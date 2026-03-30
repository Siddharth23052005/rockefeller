from beanie import Document
from typing import Optional
from datetime import datetime

class BlastEvent(Document):
    zone_id: str
    zone_name: str
    logged_by: str
    blast_date: datetime
    blast_time: Optional[str] = None
    intensity: Optional[float] = None
    ppv_reading: Optional[float] = None
    depth_meters: Optional[float] = None
    blasts_this_week: Optional[int] = None
    charge_weight_kg: Optional[float] = None
    detonator_type: Optional[str] = None
    dgms_ppv_limit: Optional[float] = None
    is_ppv_exceedance: Optional[bool] = None
    is_anomaly: Optional[bool] = None
    anomaly_score: Optional[float] = None
    anomaly_severity: Optional[str] = None
    explosive_type: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "blast_events"
        indexes = [
            "zone_id",
            "created_at",
            "blast_date",
            [("zone_id", -1), ("created_at", -1)],
            [("zone_id", -1), ("blast_date", -1)],
        ]
