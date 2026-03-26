from beanie import Document
from datetime import datetime
from enum import Enum
from typing import Optional


class NotificationType(str, Enum):
    alert = "alert"
    info = "info"
    warning = "warning"


class Notification(Document):
    user_id: str
    title: str
    message: str
    zone_id: Optional[str] = None
    zone_name: Optional[str] = None
    type: NotificationType = NotificationType.info
    is_read: bool = False
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "notifications"
