import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.core.config import (
    SENSOR_API_KEY,
    SENSOR_API_KEY_HEADER,
    SENSOR_API_TIMEOUT_SECONDS,
    SENSOR_API_URL,
)


class SensorAPIError(RuntimeError):
    """Raised when the configured sensor API cannot provide valid telemetry."""


def fetch_sensor_reading(node_id: str) -> dict[str, Any]:
    """Fetch one reading and normalize common external API response shapes."""
    url = SENSOR_API_URL.replace("{node_id}", node_id)
    headers = {"Accept": "application/json"}
    if SENSOR_API_KEY and SENSOR_API_KEY.lower() != "your-secret-key":
        headers[SENSOR_API_KEY_HEADER] = SENSOR_API_KEY

    request = Request(url, headers=headers, method="GET")
    try:
        with urlopen(request, timeout=SENSOR_API_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
        raise SensorAPIError(f"Sensor API request failed: {error}") from error

    if isinstance(payload, list):
        payload = payload[0] if payload else {}
    if isinstance(payload, dict) and isinstance(payload.get("data"), dict):
        payload = payload["data"]
    if not isinstance(payload, dict):
        raise SensorAPIError("Sensor API returned an unsupported JSON shape.")

    sensor_ok = payload.get("sensor_ok")
    if sensor_ok is not None and not isinstance(sensor_ok, bool):
        raise SensorAPIError("Sensor API field 'sensor_ok' must be a boolean.")

    ambient_temp = _first_number(
        payload, "ambient_temp", "temperature", "temp", "temperature_c", "temp_c"
    )
    humidity = _first_number(payload, "humidity", "relative_humidity", "rh")
    if sensor_ok is not False and (ambient_temp is None or humidity is None):
        raise SensorAPIError(
            "Sensor API response must include temperature and humidity values."
        )

    return {
        "node_id": str(payload.get("node_id") or payload.get("id") or node_id),
        "ambient_temp": ambient_temp if sensor_ok is not False else None,
        "humidity": humidity if sensor_ok is not False else None,
        "sensor_ok": sensor_ok is not False,
        "heat_status": str(payload.get("heat_status") or "UNKNOWN"),
        "fan": bool(payload.get("fan", False)),
        "buzzer": bool(payload.get("buzzer", False)),
        "fan_threshold": _first_number(payload, "fan_threshold"),
        "critical_threshold": _first_number(payload, "critical_threshold"),
    }


def _first_number(payload: dict[str, Any], *names: str) -> float | None:
    for name in names:
        value = payload.get(name)
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            return float(value)
        if isinstance(value, str):
            try:
                return float(value)
            except ValueError:
                continue
    return None
