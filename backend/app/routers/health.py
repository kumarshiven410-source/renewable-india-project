from fastapi import APIRouter, Depends

from app.deps import get_renewable_service
from app.models.schemas import HealthResponse
from app.services.renewable_service import RenewableService

router = APIRouter(tags=["health"])


@router.get("/api/health", response_model=HealthResponse)
def health(service: RenewableService = Depends(get_renewable_service)) -> HealthResponse:
    return HealthResponse.model_validate(service.health_payload())
