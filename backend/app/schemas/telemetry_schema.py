from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class TelemetryCreate(BaseModel):
    node_id: str = Field(..., min_length=1, example="NODE-01")
    ambient_temp: float = Field(..., ge=-40, le=85, example=31.8)
    humidity: float = Field(..., ge=0, le=100, example=68.0)

class TelemetryResponse(BaseModel):
    id: int
    node_id: str
    ambient_temp: float
    humidity: float
    heat_index: float
    risk_level: str
    timestamp: datetime

    class Config:
        from_attributes = True


class SensorTelemetryResponse(BaseModel):
    node_id: str
    ambient_temp: float | None
    humidity: float | None
    sensor_ok: bool
    heat_status: str
    fan: bool
    buzzer: bool
    fan_threshold: float | None = None
    critical_threshold: float | None = None
    timestamp: datetime

class AIForecastResponse(BaseModel):
    node_id: str
    current_temp: float
    forecast: List[dict] # [{ "time": "+1h", "temp": 43.2 }, ...]
    predicted_risk_spike_minutes: int
    thermal_inertia_detected: bool
    recommendation: str