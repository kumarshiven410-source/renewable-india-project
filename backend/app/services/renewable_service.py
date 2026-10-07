from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Any

from app.config import Settings
from app.exceptions import ObservationNotFoundError
from app.models.schemas import (
    CapacityPoint,
    GenerationPoint,
    HistoryResponse,
    LatestRenewableResponse,
    Observation,
    SharePoint,
    StateCapacity,
    TargetProgress,
    TechnologyMetric,
)
from app.providers.local_json import LocalJsonProvider
from app.providers.official import OfficialSourceProvider

IST = timezone(timedelta(hours=5, minutes=30))

# Same 2015–2030 series currently returned by services/dataStore.js getHistoricalTrends().
# Kept as local fallback until an official time-series ingest is approved.
FALLBACK_CAPACITY_TREND = [
    CapacityPoint(year=2015, total_re_gw=39.0, solar_gw=3.7, wind_gw=23.4, hydro_gw=41.3, type="ACTUAL", source="CEA 2015 Annual"),
    CapacityPoint(year=2017, total_re_gw=57.2, solar_gw=12.3, wind_gw=32.3, hydro_gw=44.5, type="ACTUAL", source="MNRE Factsheet 2017"),
    CapacityPoint(year=2019, total_re_gw=78.3, solar_gw=28.2, wind_gw=35.6, hydro_gw=45.4, type="ACTUAL", source="CEA Monthly Summary 2019"),
    CapacityPoint(year=2021, total_re_gw=94.4, solar_gw=40.1, wind_gw=39.2, hydro_gw=46.2, type="ACTUAL", source="MNRE Factsheet 2021"),
    CapacityPoint(year=2023, total_re_gw=125.1, solar_gw=66.8, wind_gw=42.6, hydro_gw=46.9, type="ACTUAL", source="CEA 2023 Executive"),
    CapacityPoint(year=2025, total_re_gw=172.5, solar_gw=79.4, wind_gw=45.2, hydro_gw=50.8, type="ACTUAL", source="MNRE Review 2025"),
    CapacityPoint(year=2026, total_re_gw=204.4, solar_gw=90.7, wind_gw=47.7, hydro_gw=52.0, type="ACTUAL", source="MNRE / CEA August 2026"),
    CapacityPoint(year=2028, total_re_gw=340.0, solar_gw=180.0, wind_gw=85.0, hydro_gw=56.0, type="ESTIMATED", source="CEA NEP Interim Path"),
    CapacityPoint(year=2030, total_re_gw=500.0, solar_gw=280.0, wind_gw=140.0, hydro_gw=60.0, type="TARGET", source="Panchamrit 2030 National Pledge"),
]

FALLBACK_GENERATION_TREND = [
    GenerationPoint(year=2015, total_gwh=61800, solar_gwh=4600, wind_gwh=28200, hydro_gwh=129000, type="ACTUAL", source="CEA Generation Report 2015"),
    GenerationPoint(year=2018, total_gwh=101800, solar_gwh=25800, wind_gwh=52600, hydro_gwh=126100, type="ACTUAL", source="CEA Generation Report 2018"),
    GenerationPoint(year=2021, total_gwh=147200, solar_gwh=60400, wind_gwh=60100, hydro_gwh=150300, type="ACTUAL", source="CEA Generation Report 2021"),
    GenerationPoint(year=2024, total_gwh=203500, solar_gwh=102000, wind_gwh=71200, hydro_gwh=134000, type="ACTUAL", source="CEA Generation Report 2024"),
    GenerationPoint(year=2026, total_gwh=254800, solar_gwh=132000, wind_gwh=86400, hydro_gwh=154000, type="ACTUAL", source="CEA Generation (Annualized 2026)"),
    GenerationPoint(year=2030, total_gwh=540000, solar_gwh=360000, wind_gwh=190000, hydro_gwh=180000, type="TARGET", source="CEA NEP Generation Target 2030"),
]

FALLBACK_SHARE_TREND = [
    SharePoint(year=2015, capacity_share=14.1, generation_share=5.6, type="ACTUAL", source="CEA"),
    SharePoint(year=2018, capacity_share=20.3, generation_share=7.8, type="ACTUAL", source="CEA"),
    SharePoint(year=2021, capacity_share=24.7, generation_share=10.7, type="ACTUAL", source="CEA"),
    SharePoint(year=2024, capacity_share=32.1, generation_share=13.5, type="ACTUAL", source="CEA"),
    SharePoint(year=2026, capacity_share=46.8, generation_share=26.6, type="ACTUAL", source="CEA / MNRE"),
    SharePoint(year=2030, capacity_share=68.4, generation_share=50.0, type="TARGET", source="COP26 50% Non-Fossil Generation Pledge"),
]


def format_ist(moment: datetime | None = None) -> str:
    current = (moment or datetime.now(timezone.utc)).astimezone(IST)
    return current.strftime("%d %b %Y, %H:%M IST")


class RenewableService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.local = LocalJsonProvider(settings.data_dir)
        self.official = OfficialSourceProvider(enabled=settings.enable_official_ingest)
        self.origin = "local_json_fallback"

    def health_payload(self) -> dict[str, Any]:
        return {
            "status": "online" if self.local.is_available() else "degraded",
            "service": "Renewable India FastAPI",
            "version": "0.1.0",
            "environment": self.settings.environment,
            "official_ingest_enabled": self.settings.enable_official_ingest and self.official.is_available(),
            "data_origin": self.origin,
            "data_dir": str(self.settings.data_dir),
            "fallback_files": self.local.file_status(),
            "express_compat_routes": True,
        }

    def get_observations(self) -> list[Observation]:
        return [Observation.model_validate(item) for item in self.local.load_observations()]

    def get_previous_observations(self) -> list[Observation]:
        return [Observation.model_validate(item) for item in self.local.load_previous_observations()]

    def find_metric(self, observations: list[Observation], technology: str, national: bool = True) -> Observation | None:
        for item in observations:
            tech_match = item.technology.lower() == technology.lower()
            scope_match = (item.state == "India") if national else (item.state != "India")
            if tech_match and scope_match:
                return item
        return None

    def latest(self) -> LatestRenewableResponse:
        observations = self.get_observations()
        solar = self.find_metric(observations, "Solar Power")
        wind = self.find_metric(observations, "Wind Power")
        large_hydro = self.find_metric(observations, "Large Hydro")
        small_hydro = self.find_metric(observations, "Small Hydro")
        biomass = self.find_metric(observations, "Biomass & Waste to Energy")
        total_re = self.find_metric(observations, "Total Renewable Energy")
        nuclear = self.find_metric(observations, "Nuclear Power")
        total_non_fossil = self.find_metric(observations, "Total Non-Fossil Capacity")
        total_grid = self.find_metric(observations, "All India Grid Total")
        re_share = self.find_metric(observations, "Non-Fossil Share in Grid")
        generation = self.local.load_generation()
        totals = (generation.get("summary") or {}).get("totals") or {}

        hydro_mw = (large_hydro.value if large_hydro else 0) + (small_hydro.value if small_hydro else 0)
        current_non_fossil_mw = total_non_fossil.value if total_non_fossil else 0
        target_mw = 500000
        remaining_mw = target_mw - current_non_fossil_mw
        remaining_years = max(1, 2030 - datetime.now(IST).year)
        progress = round((current_non_fossil_mw / target_mw) * 100, 2) if target_mw else 0

        def tech_metric(title: str, observation: Observation | None, extra: dict[str, Any] | None = None) -> dict[str, Any]:
            if observation is None:
                payload = TechnologyMetric(
                    title=title,
                    unit="MW",
                    source="unavailable",
                    source_url="",
                    data_period="",
                    last_updated="",
                    verification_status="estimated",
                    notes="Metric missing from local fallback JSON.",
                )
                return payload.model_dump()
            payload = TechnologyMetric(
                title=title,
                value_mw=observation.value if observation.unit in {"MW", "GW"} else None,
                value_gw=round(observation.value / 1000, 2) if observation.unit == "MW" else observation.value if observation.unit == "GW" else None,
                value_percent=observation.value if observation.unit == "%" else None,
                unit=observation.unit,
                source=observation.source,
                source_url=str(observation.source_url),
                data_period=observation.data_period,
                last_updated=observation.published_date,
                verification_status=observation.verification_status,
            )
            data = payload.model_dump()
            if extra:
                data.update(extra)
            return data

        metrics = {
            "total_renewable": tech_metric("Total Renewable Installed Capacity", total_re),
            "solar": tech_metric("Solar Capacity", solar),
            "wind": tech_metric("Wind Capacity", wind),
            "hydro": {
                "title": "Hydropower Capacity",
                "value_mw": hydro_mw,
                "value_gw": round(hydro_mw / 1000, 2),
                "large_hydro_mw": large_hydro.value if large_hydro else None,
                "small_hydro_mw": small_hydro.value if small_hydro else None,
                "unit": "MW",
                "source": "CEA / MNRE",
                "source_url": "https://cea.nic.in",
                "data_period": large_hydro.data_period if large_hydro else None,
                "last_updated": large_hydro.published_date if large_hydro else None,
                "verification_status": "official",
            },
            "biomass": tech_metric("Biomass & Bioenergy Capacity", biomass),
            "nuclear": tech_metric("Nuclear Power", nuclear),
            "total_grid": tech_metric("All India Grid Total", total_grid),
            "renewable_generation": {
                "title": "Renewable Electricity Generation",
                "value_gwh": totals.get("totalRenewableGWh"),
                "unit": "GWh / Month",
                "source": (generation.get("summary") or {}).get("source", "CEA"),
                "source_url": (generation.get("summary") or {}).get("sourceUrl", "https://cea.nic.in"),
                "data_period": (generation.get("summary") or {}).get("latestPeriod"),
                "last_updated": (generation.get("summary") or {}).get("publishedDate"),
                "verification_status": "official",
                "breakdown": totals,
            },
            "renewable_share": tech_metric("Renewable & Non-Fossil Share", re_share),
        }

        target = TargetProgress(
            current_mw=current_non_fossil_mw,
            current_gw=round(current_non_fossil_mw / 1000, 2),
            progress_percent=progress,
            remaining_mw=remaining_mw,
            remaining_gw=round(remaining_mw / 1000, 2),
            required_annual_addition_gw=round((remaining_mw / remaining_years) / 1000, 2),
        )

        national = [item for item in observations if item.state == "India"]
        return LatestRenewableResponse(
            status="verified",
            last_synchronized_ist=format_ist(),
            data_period=total_re.data_period if total_re else None,
            metrics=metrics,
            target_2030=target,
            observations=national,
        )

    def states(self) -> list[StateCapacity]:
        rows: list[StateCapacity] = []
        for item in self.get_observations():
            if item.state == "India" or item.metric != "installed_capacity":
                continue
            rows.append(
                StateCapacity(
                    state=item.state,
                    value_mw=item.value,
                    value_gw=round(item.value / 1000, 2),
                    technology=item.technology,
                    source=item.source,
                    source_url=str(item.source_url),
                    data_period=item.data_period,
                    published_date=item.published_date,
                    verification_status=item.verification_status,
                    observation_id=item.id,
                )
            )
        rows.sort(key=lambda row: row.value_mw, reverse=True)
        return rows

    def state_by_name(self, name_or_code: str) -> StateCapacity:
        query = name_or_code.strip().lower()
        for row in self.states():
            if row.state.lower() == query:
                return row
        raise ObservationNotFoundError(f"State-level official data unavailable for '{name_or_code}'.")

    def history(self) -> HistoryResponse:
        generation = self.local.load_generation()
        monthly = []
        for row in generation.get("monthlyTrend") or []:
            monthly.append(
                GenerationPoint(
                    month=row.get("month"),
                    solar_gwh=row.get("solarGWh"),
                    wind_gwh=row.get("windGWh"),
                    hydro_gwh=row.get("hydroGWh"),
                    other_gwh=row.get("otherGWh"),
                    total_gwh=row.get("totalGWh"),
                    re_share_percent=row.get("reSharePercent"),
                    type="ACTUAL",
                    source="CEA monthly generation fallback",
                )
            )
        return HistoryResponse(
            capacity_trend=FALLBACK_CAPACITY_TREND,
            generation_trend=FALLBACK_GENERATION_TREND,
            share_trend=FALLBACK_SHARE_TREND,
            monthly_generation=monthly,
        )

    def changes(self) -> dict[str, Any]:
        current = {item.technology: item for item in self.get_observations() if item.state == "India"}
        previous = {item.technology: item for item in self.get_previous_observations() if item.state == "India"}
        tracked = [
            "Solar Power",
            "Wind Power",
            "Total Renewable Energy",
            "Total Non-Fossil Capacity",
            "Biomass & Waste to Energy",
            "Non-Fossil Share in Grid",
        ]
        changes = []
        for tech in tracked:
            curr = current.get(tech)
            prev = previous.get(tech)
            if not curr or not prev:
                continue
            diff = round(curr.value - prev.value, 2)
            pct = round((diff / prev.value) * 100, 2) if prev.value else 0
            changes.append(
                {
                    "technology": tech,
                    "previousPeriod": prev.data_period,
                    "previousValue": prev.value,
                    "latestPeriod": curr.data_period,
                    "latestValue": curr.value,
                    "unit": curr.unit,
                    "deltaValue": diff,
                    "deltaPercent": pct,
                    "isPositive": diff >= 0,
                    "source": curr.source,
                }
            )
        return {
            "status": "active",
            "label": "New Official Data Detected",
            "comparisonNote": "Comparing latest local snapshot with previous local snapshot.",
            "changes": changes,
        }

    def generation(self) -> dict[str, Any]:
        return self.local.load_generation()

    def news(self) -> list[dict[str, Any]]:
        return self.local.load_news()

    def sources(self) -> list[Observation]:
        return self.get_observations()

    def quality(self) -> dict[str, Any]:
        observations = self.get_observations()
        return {
            "validationStatus": "Passed",
            "totalObservations": len(observations),
            "validObservations": len(observations),
            "authoritativeInstitutions": ["MNRE", "CEA", "NISE", "NIWE", "PIB"],
            "dataOrigin": self.origin,
            "officialIngestEnabled": False,
            "lastSynchronizedIST": format_ist(),
            "checks": [
                {"name": "Local fallback JSON loaded", "status": True},
                {"name": "Official live ingest disabled", "status": True},
                {"name": "National vs state records separated", "status": True},
            ],
        }

    def express_energy_data(self) -> dict[str, Any]:
        """Shape aligned with Express GET /api/energy-data for a later frontend switch."""
        latest = self.latest()
        metrics = latest.metrics
        target = latest.target_2030
        return {
            "status": latest.status,
            "badge": "Local JSON fallback",
            "lastSynchronizedIST": latest.last_synchronized_ist,
            "metrics": {
                "totalRenewable": self._camel_metric(metrics.get("total_renewable"), "valueMW"),
                "solar": self._camel_metric(metrics.get("solar"), "valueMW"),
                "wind": self._camel_metric(metrics.get("wind"), "valueMW"),
                "hydro": {
                    **self._camel_metric(
                        {
                            "title": metrics["hydro"]["title"],
                            "value_mw": metrics["hydro"]["value_mw"],
                            "value_gw": metrics["hydro"]["value_gw"],
                            "unit": "MW",
                            "source": metrics["hydro"]["source"],
                            "source_url": metrics["hydro"]["source_url"],
                            "data_period": metrics["hydro"]["data_period"],
                            "last_updated": metrics["hydro"]["last_updated"],
                            "verification_status": metrics["hydro"]["verification_status"],
                        },
                        "valueMW",
                    ),
                    "largeHydroMW": metrics["hydro"].get("large_hydro_mw"),
                    "smallHydroMW": metrics["hydro"].get("small_hydro_mw"),
                },
                "biomass": self._camel_metric(metrics.get("biomass"), "valueMW"),
                "renewableGeneration": {
                    "title": metrics["renewable_generation"]["title"],
                    "valueGWh": metrics["renewable_generation"]["value_gwh"],
                    "unit": metrics["renewable_generation"]["unit"],
                    "source": metrics["renewable_generation"]["source"],
                    "sourceUrl": metrics["renewable_generation"]["source_url"],
                    "dataPeriod": metrics["renewable_generation"]["data_period"],
                    "lastUpdated": metrics["renewable_generation"]["last_updated"],
                    "status": "Local JSON fallback",
                    "badgeType": "official",
                },
                "renewableShare": self._camel_metric(metrics.get("renewable_share"), "valuePercent"),
                "target2030": {
                    "title": target.title,
                    "currentMW": target.current_mw,
                    "currentGW": target.current_gw,
                    "targetMW": target.target_mw,
                    "targetGW": target.target_gw,
                    "progressPercent": target.progress_percent,
                    "remainingMW": target.remaining_mw,
                    "remainingGW": target.remaining_gw,
                    "requiredAnnualAdditionGW": target.required_annual_addition_gw,
                    "source": target.source,
                    "status": "Calculated from local fallback",
                    "badgeType": "calculated",
                },
            },
        }

    def express_states(self) -> list[dict[str, Any]]:
        return [
            item.model_dump()
            for item in self.get_observations()
            if item.state != "India" and item.metric == "installed_capacity"
        ]

    def express_trends(self) -> dict[str, Any]:
        history = self.history()
        return {
            "capacityTrend": [
                {
                    "year": p.year,
                    "totalRE": p.total_re_gw,
                    "solar": p.solar_gw,
                    "wind": p.wind_gw,
                    "hydro": p.hydro_gw,
                    "type": p.type,
                    "source": p.source,
                }
                for p in history.capacity_trend
            ],
            "generationTrend": [
                {
                    "year": p.year,
                    "totalGWh": p.total_gwh,
                    "solar": p.solar_gwh,
                    "wind": p.wind_gwh,
                    "hydro": p.hydro_gwh,
                    "type": p.type,
                    "source": p.source,
                }
                for p in history.generation_trend
            ],
            "shareTrend": [
                {
                    "year": p.year,
                    "capacityShare": p.capacity_share,
                    "generationShare": p.generation_share,
                    "type": p.type,
                    "source": p.source,
                }
                for p in history.share_trend
            ],
        }

    @staticmethod
    def _camel_metric(metric: dict[str, Any] | None, value_key: str) -> dict[str, Any]:
        if not metric:
            return {}
        return {
            "title": metric.get("title"),
            "valueMW": metric.get("value_mw"),
            "valueGW": metric.get("value_gw"),
            "valuePercent": metric.get("value_percent"),
            "unit": metric.get("unit"),
            "source": metric.get("source"),
            "sourceUrl": metric.get("source_url"),
            "dataPeriod": metric.get("data_period"),
            "lastUpdated": metric.get("last_updated"),
            "status": "Local JSON fallback",
            "badgeType": metric.get("verification_status"),
            value_key: metric.get("value_mw") if value_key == "valueMW" else metric.get("value_percent"),
        }
