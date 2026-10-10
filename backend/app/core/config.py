import os

from dotenv import load_dotenv

load_dotenv()

SENSOR_API_URL = os.getenv("SENSOR_API_URL", "").strip()
SENSOR_API_KEY = os.getenv("SENSOR_API_KEY", "").strip()
SENSOR_API_KEY_HEADER = os.getenv("SENSOR_API_KEY_HEADER", "X-API-Key").strip()
SENSOR_API_TIMEOUT_SECONDS = float(os.getenv("SENSOR_API_TIMEOUT_SECONDS", "10"))


def sensor_api_is_configured() -> bool:
    """Return whether a real external sensor endpoint has been configured."""
    return bool(
        SENSOR_API_URL
        and not SENSOR_API_URL.startswith("https://example.com/")
    )