from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.ml_models import get_district_forecast

router = APIRouter(prefix="/api/rainfall", tags=["rainfall"])


@router.get("/forecast/{district}")
async def rainfall_forecast(
    district: str,
    days_ahead: int = Query(7, ge=1, le=14),
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    forecast = get_district_forecast(district=district, days_ahead=days_ahead)
    if "error" in forecast:
        raise HTTPException(status_code=404, detail=forecast["error"])
    return forecast
