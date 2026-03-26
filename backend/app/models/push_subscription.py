from beanie import Document
from datetime import datetime
from typing import Any, Dict


class PushSubscription(Document):
    user_id: str
    subscription: Dict[str, Any]
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "push_subscriptions"
