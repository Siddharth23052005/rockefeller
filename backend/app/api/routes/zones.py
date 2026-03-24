from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime
from app.models.zone import Zone
from app.schemas.zone import ZoneUpdateRequest
from app.api.dependencies import get_current_user, require_officer
from app.models.user import User
from app.core.rule_engine import get_zone_features
from app.services.ml_models import get_tomorrow_rainfall, predict_zone_risk

router = APIRouter(prefix="/api/zones", tags=["zones"])

def zone_to_dict(z: Zone) -> dict:
    return {
        "id": str(z.id),
        "name": z.name,
        "mine_name": z.mine_name,
        "district": z.district,
        "risk_level": z.risk_level,
        "risk_score": z.risk_score,
        "latlngs": z.latlngs,
        "soil_type": z.soil_type,
        "slope_angle": z.slope_angle,
        "status": z.status,
        "last_landslide": z.last_landslide,
        "blast_count_7d": z.blast_count_7d,
        "recent_rainfall": z.recent_rainfall,
        "last_updated": z.last_updated.isoformat() if z.last_updated else None,
        "created_at": z.created_at.isoformat() if z.created_at else None,
    }

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

    base_features = await get_zone_features(zone)
    tomorrow_rain = get_tomorrow_rainfall(zone.district)

    forecast_features = {
        **base_features,
        "rainfall_mm_24h": tomorrow_rain,
        "rainfall_mm_7d": round(tomorrow_rain * 3, 2),
    }
    prediction = predict_zone_risk(**forecast_features)

    return {
        "zone_id": str(zone.id),
        "zone_name": zone.name,
        "district": zone.district,
        "prediction_horizon": "tomorrow",
        "predicted_rainfall_mm_24h": tomorrow_rain,
        "predicted_risk_label": prediction["risk_label"],
        "predicted_risk_score": prediction["risk_score"],
        "features_used": forecast_features,
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
