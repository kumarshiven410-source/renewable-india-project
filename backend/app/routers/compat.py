"""
Compatibility routes matching the existing Express API contract in server.js.

The current frontend still talks to Express (or uses static JSON). These
paths exist so a later switch can point the same fetch URLs at FastAPI
without renaming Express endpoints.
"""

from fastapi import APIRouter, Depends

from app.deps import get_renewable_service
from app.services.renewable_service import RenewableService

router = APIRouter(tags=["express-compat"])


@router.get("/api/energy-data")
def energy_data(service: RenewableService = Depends(get_renewable_service)) -> dict:
    return {"success": True, "dataOrigin": "local_json_fallback", "data": service.express_energy_data()}


@router.get("/api/states")
def states(service: RenewableService = Depends(get_renewable_service)) -> dict:
    rows = service.express_states()
    return {
        "success": True,
        "dataOrigin": "local_json_fallback",
        "totalStatesReported": len(rows),
        "data": rows,
    }


@router.get("/api/state/{name_or_code}")
def state(name_or_code: str, service: RenewableService = Depends(get_renewable_service)) -> dict:
    match = service.state_by_name(name_or_code)
    return {"success": True, "available": True, "dataOrigin": "local_json_fallback", "data": match.model_dump()}


@router.get("/api/generation")
def generation(service: RenewableService = Depends(get_renewable_service)) -> dict:
    return {"success": True, "dataOrigin": "local_json_fallback", "data": service.generation()}


@router.get("/api/trends")
def trends(service: RenewableService = Depends(get_renewable_service)) -> dict:
    return {"success": True, "dataOrigin": "local_json_fallback", "data": service.express_trends()}


@router.get("/api/target-tracker")
def target_tracker(service: RenewableService = Depends(get_renewable_service)) -> dict:
    latest = service.latest()
    return {
        "success": True,
        "dataOrigin": "local_json_fallback",
        "data": latest.target_2030.model_dump(),
    }


@router.get("/api/changes")
def changes(service: RenewableService = Depends(get_renewable_service)) -> dict:
    return {"success": True, "dataOrigin": "local_json_fallback", "data": service.changes()}


@router.get("/api/news")
def news(service: RenewableService = Depends(get_renewable_service)) -> dict:
    return {"success": True, "dataOrigin": "local_json_fallback", "data": service.news()}


@router.get("/api/sources")
def sources(service: RenewableService = Depends(get_renewable_service)) -> dict:
    observations = service.sources()
    return {
        "success": True,
        "dataOrigin": "local_json_fallback",
        "totalObservations": len(observations),
        "data": [item.model_dump(mode="json") for item in observations],
    }


@router.get("/api/quality")
def quality(service: RenewableService = Depends(get_renewable_service)) -> dict:
    return {"success": True, "dataOrigin": "local_json_fallback", "data": service.quality()}
