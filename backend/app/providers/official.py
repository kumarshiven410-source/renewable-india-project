from typing import Any

from app.providers.base import RenewableDataProvider


class OfficialSourceProvider(RenewableDataProvider):
    """
    Placeholder for a later, approved MNRE/CEA ingest layer.

    Intentionally disabled. Methods must not contact external government APIs
    until that step is explicitly approved.
    """

    name = "official_ingest"
    origin = "official_ingest"

    def __init__(self, enabled: bool = False) -> None:
        self.enabled = enabled

    def is_available(self) -> bool:
        return False

    def load_observations(self) -> list[dict[str, Any]]:
        raise RuntimeError("Official ingest is disabled. Use local JSON fallback.")

    def load_previous_observations(self) -> list[dict[str, Any]]:
        raise RuntimeError("Official ingest is disabled. Use local JSON fallback.")

    def load_generation(self) -> dict[str, Any]:
        raise RuntimeError("Official ingest is disabled. Use local JSON fallback.")

    def load_news(self) -> list[dict[str, Any]]:
        raise RuntimeError("Official ingest is disabled. Use local JSON fallback.")
