from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class DataUnavailableError(Exception):
    """Raised when local fallback JSON cannot be loaded."""


class ObservationNotFoundError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DataUnavailableError)
    async def data_unavailable_handler(_request: Request, exc: DataUnavailableError) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "error": "Local fallback data is unavailable.",
                "detail": str(exc),
            },
        )

    @app.exception_handler(ObservationNotFoundError)
    async def not_found_handler(_request: Request, exc: ObservationNotFoundError) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": "Request validation failed.",
                "detail": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_handler(_request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error.",
                "detail": str(exc),
            },
        )
