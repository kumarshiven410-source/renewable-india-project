from fastapi import APIRouter, Depends

from app.deps import get_renewable_service
from app.models.schemas import (
    ApiEnvelope,
    HistoryResponse,
    LatestRenewableResponse,
    StateCapacity,
)
from app.services.renewable_service import RenewableService

router = APIRouter(prefix="/api/renewable", tags=["renewable"])


@router.get("/latest", response_model=ApiEnvelope[LatestRenewableResponse])
def latest(service: RenewableService = Depends(get_renewable_service)) -> ApiEnvelope[LatestRenewableResponse]:
    return ApiEnvelope(data=service.latest(), data_origin="local_json_fallback")


@router.get("/states", response_model=ApiEnvelope[list[StateCapacity]])
def states(service: RenewableService = Depends(get_renewable_service)) -> ApiEnvelope[list[StateCapacity]]:
    rows = service.states()
    return ApiEnvelope(data=rows, data_origin="local_json_fallback")


@router.get("/states/{name_or_code}", response_model=ApiEnvelope[StateCapacity])
def state_detail(
    name_or_code: str,
    service: RenewableService = Depends(get_renewable_service),
) -> ApiEnvelope[StateCapacity]:
    return ApiEnvelope(data=service.state_by_name(name_or_code), data_origin="local_json_fallback")


@router.get("/history", response_model=ApiEnvelope[HistoryResponse])
def history(service: RenewableService = Depends(get_renewable_service)) -> ApiEnvelope[HistoryResponse]:
    return ApiEnvelope(data=service.history(), data_origin="local_json_fallback")
