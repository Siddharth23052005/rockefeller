from beanie import Document
from typing import Optional
from datetime import datetime

class ExplorationLog(Document):
    zone_id: str
    zone_name: Optional[str] = None
    logged_by: str
    log_date: Optional[datetime] = None
    activity_type: Optional[str] = None
    depth_m: Optional[float] = None
    water_encountered: bool = False
    water_depth_m: Optional[float] = None
    soil_description: Optional[str] = None
    moisture_level: Optional[str] = None
    remarks: Optional[str] = None
    notes: Optional[str] = None

    # Legacy fields retained for backward compatibility with historical records.
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    direction: Optional[str] = None
    depth_meters: Optional[float] = None
    equipment: Optional[str] = None
    active: Optional[bool] = True

    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "exploration_logs"
        indexes = [
            "zone_id",
            "log_date",
            [ ("zone_id", -1), ("log_date", -1) ],
        ]
