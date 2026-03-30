from datetime import datetime
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query

from app.api.dependencies import get_current_user
from app.models.exploration import ExplorationLog
from app.models.user import User
from app.models.zone import Zone
from app.services.forecast_runner import run_daily_risk_forecast

router = APIRouter(prefix="/api/explorations", tags=["explorations"])

_MOISTURE_TO_INDEX = {
    "dry": 0.1,
    "moist": 0.4,
    "wet": 0.7,
    "saturated": 1.0,
}

_ALLOWED_ACTIVITY_TYPES = {"drilling", "sampling", "surveying", "other"}


def _parse_date(value: Optional[str], *, end_of_day: bool = False) -> Optional[datetime]:
    if not value:
        return None

    raw = str(value).strip()
    if not raw:
        return None

    try:
        if len(raw) == 10:
            raw = f"{raw}T23:59:59" if end_of_day else f"{raw}T00:00:00"
        if raw.endswith("Z"):
            raw = raw[:-1] + "+00:00"
        return datetime.fromisoformat(raw)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {value}")


async def _resolve_zone(zone_ref: str) -> Optional[Zone]:
    ref = str(zone_ref or "").strip()
    if not ref:
        return None

    try:
        zone = await Zone.get(ref)
        if zone:
            return zone
    except Exception:
        pass

    return await Zone.find_one(Zone.name == ref)


def _exploration_to_dict(row: ExplorationLog) -> dict:
    effective_log_date = row.log_date or row.start_time or row.created_at
    effective_depth = row.depth_m if row.depth_m is not None else row.depth_meters

    return {
        "id": str(row.id),
        "zone_id": row.zone_id,
        "zone_name": row.zone_name,
        "log_date": effective_log_date.isoformat() if effective_log_date else None,
        "activity_type": row.activity_type or "other",
        "depth_m": effective_depth,
        "water_encountered": row.water_encountered,
        "water_depth_m": row.water_depth_m,
        "soil_description": row.soil_description or row.notes,
        "moisture_level": row.moisture_level or "dry",
        "remarks": row.remarks or row.notes,
        "logged_by": row.logged_by,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


@router.post("", status_code=201)
async def create_exploration(
    body: dict,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["field_worker", "safety_officer", "admin"]:
        raise HTTPException(status_code=403, detail="Only field workers/officers/admin can submit exploration logs")

    required_fields = ["zone_id", "log_date", "activity_type", "soil_description", "moisture_level"]
    missing = [field for field in required_fields if body.get(field) in (None, "")]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing)}")

    zone = await _resolve_zone(body.get("zone_id"))
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")

    activity_type = str(body.get("activity_type")).strip().lower()
    if activity_type not in _ALLOWED_ACTIVITY_TYPES:
        raise HTTPException(status_code=400, detail="activity_type must be drilling/sampling/surveying/other")

    moisture_level = str(body.get("moisture_level")).strip().lower()
    if moisture_level not in _MOISTURE_TO_INDEX:
        raise HTTPException(status_code=400, detail="moisture_level must be dry/moist/wet/saturated")

    log_date = _parse_date(str(body.get("log_date")))
    water_encountered = bool(body.get("water_encountered"))

    depth_m = None
    if body.get("depth_m") not in (None, ""):
        try:
            depth_m = float(body.get("depth_m"))
        except Exception:
            raise HTTPException(status_code=400, detail="depth_m must be a number")

    water_depth_m = None
    if water_encountered and body.get("water_depth_m") not in (None, ""):
        try:
            water_depth_m = float(body.get("water_depth_m"))
        except Exception:
            raise HTTPException(status_code=400, detail="water_depth_m must be a number")

    row = ExplorationLog(
        zone_id=str(zone.id),
        zone_name=zone.name,
        logged_by=str(current_user.id),
        log_date=log_date,
        activity_type=activity_type,
        depth_m=depth_m,
        water_encountered=water_encountered,
        water_depth_m=water_depth_m,
        soil_description=str(body.get("soil_description")),
        moisture_level=moisture_level,
        remarks=body.get("remarks"),
        notes=body.get("remarks"),
        created_at=datetime.utcnow(),
    )
    await row.insert()

    updated_saturation = float(zone.soil_saturation_index)
    saturation_updated = False
    if water_encountered:
        updated_saturation = _MOISTURE_TO_INDEX[moisture_level]
        zone.soil_saturation_index = updated_saturation
        zone.last_updated = datetime.utcnow()
        await zone.save()
        saturation_updated = True

    background_tasks.add_task(run_daily_risk_forecast, str(zone.id))

    payload = _exploration_to_dict(row)
    payload["zone_saturation_index"] = updated_saturation
    payload["saturation_updated"] = saturation_updated
    payload["forecast_triggered"] = True
    return payload


@router.get("")
async def list_explorations(
    zone_id: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    water_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=500),
    current_user: User = Depends(get_current_user),
):
    _ = current_user

    filters = []
    if zone_id:
        filters.append(ExplorationLog.zone_id == str(zone_id))

    start_dt = _parse_date(date_from)
    end_dt = _parse_date(date_to, end_of_day=True)
    if start_dt:
        filters.append(ExplorationLog.log_date >= start_dt)
    if end_dt:
        filters.append(ExplorationLog.log_date <= end_dt)
    if water_only:
        filters.append(ExplorationLog.water_encountered == True)

    rows = await ExplorationLog.find(*filters).sort("-log_date").limit(limit).to_list()

    if district:
        district_zone_ids = {
            str(z.id)
            for z in await Zone.find(Zone.district == district).to_list()
        }
        rows = [row for row in rows if row.zone_id in district_zone_ids]

    return [_exploration_to_dict(row) for row in rows]


@router.get("/{exploration_id}")
async def get_exploration(
    exploration_id: str,
    current_user: User = Depends(get_current_user),
):
    _ = current_user

    row = await ExplorationLog.get(exploration_id)
    if not row:
        raise HTTPException(status_code=404, detail="Exploration log not found")

    return _exploration_to_dict(row)
