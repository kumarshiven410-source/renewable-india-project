from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.exceptions import DataUnavailableError
from app.providers.base import RenewableDataProvider


class LocalJsonProvider(RenewableDataProvider):
    """Reads the existing project-root data/*.json files. Does not call government APIs."""

    name = "local_json"
    origin = "local_json_fallback"

    def __init__(self, data_dir: Path) -> None:
        self.data_dir = data_dir
        self.energy_path = data_dir / "energy_data.json"
        self.previous_path = data_dir / "energy_data_previous.json"
        self.generation_path = data_dir / "generation_data.json"
        self.news_path = data_dir / "news_data.json"

    def is_available(self) -> bool:
        return self.energy_path.exists()

    def file_status(self) -> dict[str, bool]:
        return {
            "energy_data.json": self.energy_path.exists(),
            "energy_data_previous.json": self.previous_path.exists(),
            "generation_data.json": self.generation_path.exists(),
            "news_data.json": self.news_path.exists(),
        }

    def load_observations(self) -> list[dict[str, Any]]:
        return self._read_json(self.energy_path, expect_list=True)

    def load_previous_observations(self) -> list[dict[str, Any]]:
        if not self.previous_path.exists():
            return []
        return self._read_json(self.previous_path, expect_list=True)

    def load_generation(self) -> dict[str, Any]:
        if not self.generation_path.exists():
            return {}
        return self._read_json(self.generation_path, expect_list=False)

    def load_news(self) -> list[dict[str, Any]]:
        if not self.news_path.exists():
            return []
        return self._read_json(self.news_path, expect_list=True)

    def _read_json(self, path: Path, expect_list: bool) -> Any:
        if not path.exists():
            raise DataUnavailableError(f"Missing fallback file: {path}")
        try:
            with path.open("r", encoding="utf-8") as handle:
                payload = json.load(handle)
        except json.JSONDecodeError as exc:
            raise DataUnavailableError(f"Invalid JSON in {path.name}: {exc}") from exc
        except OSError as exc:
            raise DataUnavailableError(f"Could not read {path.name}: {exc}") from exc

        if expect_list and not isinstance(payload, list):
            raise DataUnavailableError(f"{path.name} must contain a JSON array.")
        if not expect_list and not isinstance(payload, dict):
            raise DataUnavailableError(f"{path.name} must contain a JSON object.")
        return payload
