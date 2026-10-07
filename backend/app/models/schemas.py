from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, Field, HttpUrl

T = TypeVar("T")

VerificationStatus = Literal["official", "calculated", "simulation", "estimated"]
SeriesType = Literal["ACTUAL", "ESTIMATED", "TARGET"]


class ApiEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data_origin: Literal["local_json_fallback", "official_ingest"] = "local_json_fallback"
    data: T


class Observation(BaseModel):
    id: str
    source: str
    source_url: HttpUrl | str
    metric: str
    technology: str
    state: str
    value: float
    unit: str
    data_period: str
    published_date: str
    fetched_at: str
    verification_status: VerificationStatus


class TechnologyMetric(BaseModel):
    title: str
    value_mw: float | None = None
    value_gw: float | None = None
    value_gwh: float | None = None
    value_percent: float | None = None
    unit: str
    source: str
    source_url: str
    data_period: str
    last_updated: str
    verification_status: VerificationStatus
    notes: str | None = None


class TargetProgress(BaseModel):
    title: str = "Progress Toward 2030 Target"
    current_mw: float
    current_gw: float
    target_mw: float = 500000
    target_gw: float = 500
    progress_percent: float
    remaining_mw: float
    remaining_gw: float
    required_annual_addition_gw: float
    source: str = "Panchamrit COP26 Commitment & CEA Plan"
    verification_status: VerificationStatus = "calculated"


class LatestRenewableResponse(BaseModel):
    status: str
    last_synchronized_ist: str | None = None
    data_period: str | None = None
    metrics: dict[str, Any]
    target_2030: TargetProgress
    observations: list[Observation] = Field(default_factory=list)


class StateCapacity(BaseModel):
    state: str
    value_mw: float
    value_gw: float
    unit: str = "MW"
    technology: str
    source: str
    source_url: str
    data_period: str
    published_date: str
    verification_status: VerificationStatus
    observation_id: str


class CapacityPoint(BaseModel):
    year: int
    total_re_gw: float
    solar_gw: float
    wind_gw: float
    hydro_gw: float
    type: SeriesType
    source: str


class GenerationPoint(BaseModel):
    year: int | None = None
    month: str | None = None
    total_gwh: float | None = None
    solar_gwh: float | None = None
    wind_gwh: float | None = None
    hydro_gwh: float | None = None
    other_gwh: float | None = None
    re_share_percent: float | None = None
    type: SeriesType | None = None
    source: str | None = None


class SharePoint(BaseModel):
    year: int
    capacity_share: float
    generation_share: float
    type: SeriesType
    source: str


class HistoryResponse(BaseModel):
    capacity_trend: list[CapacityPoint]
    generation_trend: list[GenerationPoint]
    share_trend: list[SharePoint]
    monthly_generation: list[GenerationPoint]


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    environment: str
    official_ingest_enabled: bool
    data_origin: str
    data_dir: str
    fallback_files: dict[str, bool]
    express_compat_routes: bool = True
