from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime, timezone, timedelta
import os
from app.models.zone import Zone
from app.schemas.zone import ZoneUpdateRequest
from app.api.dependencies import get_current_user, require_officer
from app.models.user import User
from app.models.history import HistoricalLandslide
from app.core.rule_engine import simple_risk_score
from app.services.ml_models import get_rainfall_forecast
from app.utils.helpers import normalize_probability_score

router = APIRouter(prefix="/api/zones", tags=["zones"])


def _normalize_latlngs(points) -> list[list[float]]:
    normalized: list[list[float]] = []
    if not isinstance(points, list):
        return normalized

    for point in points:
        lat = lng = None
        if isinstance(point, list) and len(point) >= 2:
            lat, lng = point[0], point[1]
        elif isinstance(point, dict):
            lat = point.get("lat", point.get("latitude"))
            lng = point.get("lng", point.get("lon", point.get("longitude")))

        try:
            lat_f = float(lat)
            lng_f = float(lng)
            normalized.append([lat_f, lng_f])
        except (TypeError, ValueError):
            continue

    return normalized

def zone_to_dict(z: Zone) -> dict:
    return {
        "id": str(z.id),
        "name": z.name,
        "mine_name": z.mine_name,
        "district": z.district,
        "risk_level": z.risk_level,
        "risk_score": normalize_probability_score(z.risk_score),
        "latlngs": _normalize_latlngs(z.latlngs),
        "soil_type": z.soil_type,
        "slope_angle": z.slope_angle,
        "elevation_m": z.elevation_m,
        "area_sq_km": z.area_sq_km,
        "status": z.status,
        "last_landslide": z.last_landslide,
        "blast_count_7d": z.blast_count_7d,
        "recent_rainfall": z.recent_rainfall,
        "last_updated": z.last_updated.isoformat() if z.last_updated else None,
        "created_at": z.created_at.isoformat() if z.created_at else None,
    }


def _float_env(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None:
        return default
    try:
        return float(raw)
    except (TypeError, ValueError):
        return default


def _forecast_risk_flag(predicted_rainfall_mm: float, yellow: float, orange: float, red: float) -> str:
    if predicted_rainfall_mm >= red:
        return "red"
    if predicted_rainfall_mm >= orange:
        return "orange"
    if predicted_rainfall_mm >= yellow:
        return "yellow"
    return "green"

# ✅ All logged-in users can view zones
@router.get("")
async def get_zones(
    district: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    zones = await Zone.find().to_list()          # ✅ FIXED: was find_all()
    if district:
        zones = [z for z in zones if z.district.lower() == district.lower()]
    if risk_level:
        zones = [z for z in zones if z.risk_level == risk_level]
    if status:
        zones = [z for z in zones if z.status == status]
    return [zone_to_dict(z) for z in zones]

# ✅ All logged-in users can view a single zone
@router.get("/{zone_id}")
async def get_zone(
    zone_id: str,
    current_user: User = Depends(get_current_user),
):
    zone = await Zone.get(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zone_to_dict(zone)


@router.get("/{zone_id}/forecast")
async def get_zone_forecast(
    zone_id: str,
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    zone = await Zone.get(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")

    district = str(zone.district or "").strip()
    yellow_threshold = _float_env("FORECAST_RAIN_YELLOW_THRESHOLD_MM", 15.0)
    orange_threshold = _float_env("FORECAST_RAIN_ORANGE_THRESHOLD_MM", 35.0)
    red_threshold = _float_env("FORECAST_RAIN_RED_THRESHOLD_MM", 65.0)

    rows = get_rainfall_forecast(district=district, days=30)
    forecast: list[dict] = []
    for row in rows[:30]:
        predicted = max(0.0, float(row.get("yhat", 0.0) or 0.0))
        lower = max(0.0, float(row.get("yhat_lower", 0.0) or 0.0))
        upper = max(0.0, float(row.get("yhat_upper", 0.0) or 0.0))

        forecast.append(
            {
                "date": str(row.get("date")),
                "predicted_rainfall_mm": round(predicted, 2),
                "lower_bound_mm": round(lower, 2),
                "upper_bound_mm": round(upper, 2),
                "risk_flag": _forecast_risk_flag(
                    predicted,
                    yellow=yellow_threshold,
                    orange=orange_threshold,
                    red=red_threshold,
                ),
            }
        )

    if len(forecast) < 30:
        start = datetime.now(timezone.utc).date()
        for offset in range(len(forecast), 30):
            forecast.append(
                {
                    "date": (start + timedelta(days=offset)).isoformat(),
                    "predicted_rainfall_mm": 0.0,
                    "lower_bound_mm": 0.0,
                    "upper_bound_mm": 0.0,
                    "risk_flag": "green",
                }
            )

    return {
        "zone_id": str(zone.id),
        "zone_name": zone.name,
        "district": zone.district,
        "forecast": forecast[:30],
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

# 🔒 Only safety_officer / admin can edit zones
@router.patch("/{zone_id}")
async def update_zone(
    zone_id: str,
    body: ZoneUpdateRequest,
    current_user: User = Depends(require_officer),
):
    zone = await Zone.get(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    update_data = body.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(zone, key, value)
    zone.last_updated = datetime.utcnow()
    await zone.save()
    return zone_to_dict(zone)


# ---------------------------------------------------------------------------
# GET /api/risk-levels
# Returns a fleet-level summary of zone risk levels plus per-zone breakdown.
# ---------------------------------------------------------------------------
risk_levels_router = APIRouter(prefix="/api/risk-levels", tags=["zones"])

@risk_levels_router.get("")
async def get_risk_levels(
    district: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    """
    Returns an aggregated summary of zone risk levels.

    Response includes:
    - ``summary``: count of zones in each risk band (green / yellow / orange / red)
    - ``zones``: per-zone risk snapshot with id, name, risk_level, risk_score,
      district, and a ``simple_risk_score`` calculated from the weighted formula
    """
    zones = await Zone.find().to_list()
    if district:
        zones = [z for z in zones if z.district.lower() == district.lower()]

    summary = {"green": 0, "yellow": 0, "orange": 0, "red": 0}
    zone_rows = []

    for z in zones:
        level = str(z.risk_level)
        if level in summary:
            summary[level] += 1

        historical_count = await HistoricalLandslide.find(
            HistoricalLandslide.zone_id == str(z.id)
        ).count()

        fallback = simple_risk_score(
            rainfall_mm=float(z.recent_rainfall or 0),
            slope_deg=float(z.slope_angle or 0),
            soil_type=z.soil_type,
            blast_count_7d=z.blast_count_7d,
            historical_landslides=historical_count,
        )

        zone_rows.append({
            "id": str(z.id),
            "name": z.name,
            "mine_name": z.mine_name,
            "district": z.district,
            "risk_level": level,
            "risk_score": normalize_probability_score(z.risk_score),
            "simple_risk_score": fallback["risk_score"],
            "simple_risk_level": fallback["risk_level"],
            "last_updated": z.last_updated.isoformat() if z.last_updated else None,
        })

    # Sort: red → orange → yellow → green
    _order = {"red": 0, "orange": 1, "yellow": 2, "green": 3}
    zone_rows.sort(key=lambda r: _order.get(r["risk_level"], 4))

    return {
        "summary": summary,
        "total": len(zone_rows),
        "zones": zone_rows,
    }
