from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime, timedelta
from app.models.blast_event import BlastEvent
from app.models.zone import Zone
from app.models.alert import Alert
from app.api.dependencies import get_current_user
from app.core.rule_engine import run_blast_check
from app.services.ml_models import check_blast_anomaly
from app.models.user import User

router = APIRouter(prefix="/api/blast-events", tags=["blast-events"])

def blast_to_dict(b: BlastEvent) -> dict:
    return {
        "id":           str(b.id),
        "zone_id":      b.zone_id,
        "zone_name":    b.zone_name,
        "blast_date":   b.blast_date.isoformat() if b.blast_date else None,
        "intensity":    b.intensity,
        "depth_meters": b.depth_meters,        # ← FIXED field name
        "blasts_this_week": b.blasts_this_week,
        "is_anomaly": b.is_anomaly,
        "anomaly_score": b.anomaly_score,
        "anomaly_severity": b.anomaly_severity,
        "explosive_type": b.explosive_type,
        "logged_by":    b.logged_by,           # ← FIXED field name
        "notes":        b.notes,
        "created_at":   b.created_at.isoformat() if b.created_at else None,
    }

@router.get("")
async def get_blast_events(
    zone_id:  Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    events = await BlastEvent.find().to_list()
    if zone_id:
        events = [e for e in events if e.zone_id == zone_id]
    events.sort(key=lambda e: e.blast_date or datetime.min, reverse=True)
    return [blast_to_dict(e) for e in events]

@router.post("", status_code=201)
async def create_blast_event(
    body: dict,
    current_user: User = Depends(get_current_user),
):
    zone = await Zone.get(body.get("zone_id"))
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")

    cutoff = datetime.utcnow() - timedelta(days=7)
    recent_blasts = await BlastEvent.find(
        BlastEvent.zone_id == str(zone.id),
        BlastEvent.blast_date >= cutoff,
    ).to_list()
    blasts_this_week = len(recent_blasts) + 1

    intensity = float(body.get("intensity") or 0)
    depth_meters = float(body.get("depth_meters") or body.get("depth_m") or 0)
    anomaly = check_blast_anomaly(
        intensity=intensity,
        depth_m=depth_meters,
        blasts_per_week=blasts_this_week,
    )

    event = BlastEvent(
        zone_id        = str(zone.id),
        zone_name      = zone.name,
        logged_by      = current_user.name,    # ← FIXED: was reported_by
        blast_date     = datetime.utcnow(),
        intensity      = intensity,
        depth_meters   = depth_meters,
        blasts_this_week = blasts_this_week,
        is_anomaly     = anomaly["is_anomaly"],
        anomaly_score  = anomaly["anomaly_score"],
        anomaly_severity = anomaly["severity"],
        explosive_type = body.get("explosive_type"),
        notes          = body.get("notes"),
        created_at     = datetime.utcnow(),
    )
    await event.insert()

    if anomaly["is_anomaly"]:
        alert = Alert(
            zone_id=str(zone.id),
            zone_name=zone.name,
            district=zone.district,
            risk_level="red" if anomaly["severity"] == "critical" else "orange",
            trigger_reason=f"Blast anomaly detected (score: {anomaly['anomaly_score']})",
            trigger_source="ml_model",
            recommended_action="Pause nearby operations and verify blast safety parameters.",
            status="active",
            created_at=datetime.utcnow(),
        )
        await alert.insert()

    # Trigger rule engine
    await run_blast_check(str(zone.id))

    return blast_to_dict(event)
