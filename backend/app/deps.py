from functools import lru_cache

from app.config import Settings, get_settings
from app.services.renewable_service import RenewableService


@lru_cache
def get_renewable_service() -> RenewableService:
    settings: Settings = get_settings()
    return RenewableService(settings)
