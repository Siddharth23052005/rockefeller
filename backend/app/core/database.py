from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from backend.app.core.config import settings

from backend.app.models.user import User
from backend.app.models.zone import Zone
from backend.app.models.alert import Alert
from backend.app.models.report import Report
from backend.app.models.crack_report import CrackReport
from backend.app.models.blast_event import BlastEvent
from backend.app.models.exploration import ExplorationLog
from backend.app.models.weather_record import WeatherRecord
from backend.app.models.history import HistoricalLandslide
from backend.app.models.risk_prediction import RiskPrediction
from backend.app.models.user_location import UserLocation
from backend.app.models.worker_presence import WorkerPresence
from backend.app.models.notification import Notification
from backend.app.models.push_subscription import PushSubscription

client = None

async def init_db():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client.get_database(settings.DATABASE_NAME)
    await init_beanie(
        database=db,
        document_models=[
            User, Zone, Alert, Report, CrackReport,
            BlastEvent, ExplorationLog, WeatherRecord,
            HistoricalLandslide, RiskPrediction, UserLocation,
            WorkerPresence,
            Notification, PushSubscription,
        ]
    )

async def close_db():
    if client:
        client.close()
