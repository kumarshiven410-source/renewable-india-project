from abc import ABC, abstractmethod
from typing import Any


class RenewableDataProvider(ABC):
    """Swap-in interface for local JSON today and official MNRE/CEA ingest later."""

    name: str
    origin: str

    @abstractmethod
    def is_available(self) -> bool:
        raise NotImplementedError

    @abstractmethod
    def load_observations(self) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def load_previous_observations(self) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def load_generation(self) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def load_news(self) -> list[dict[str, Any]]:
        raise NotImplementedError
