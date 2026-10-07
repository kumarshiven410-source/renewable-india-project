from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.config import get_settings
from app.exceptions import register_exception_handlers
from app.routers import compat, health, renewable

settings = get_settings()

app = FastAPI(
    title="Renewable India FastAPI",
    description=(
        "Python API alongside the existing Express server. "
        "Serves local JSON fallback data. Official MNRE/CEA ingest is not enabled."
    ),
    version=__version__,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

register_exception_handlers(app)
app.include_router(health.router)
app.include_router(renewable.router)
app.include_router(compat.router)


@app.get("/")
def root() -> dict:
    return {
        "service": "Renewable India FastAPI",
        "docs": "/docs",
        "health": "/api/health",
        "renewable": {
            "latest": "/api/renewable/latest",
            "states": "/api/renewable/states",
            "history": "/api/renewable/history",
        },
        "official_ingest_enabled": settings.enable_official_ingest,
        "data_origin": "local_json_fallback",
    }
