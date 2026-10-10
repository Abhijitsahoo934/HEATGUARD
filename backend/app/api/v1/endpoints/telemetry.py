from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.telemetry import TelemetryReadingModel
from app.models.node import NodeModel
from app.schemas.telemetry_schema import (
    SensorTelemetryResponse,
    TelemetryCreate,
    TelemetryResponse,
)
from app.crud.crud_telemetry import get_latest_by_node
from app.core.config import sensor_api_is_configured
from app.services.sensor_api import SensorAPIError, fetch_sensor_reading

router = APIRouter(prefix="/telemetry", tags=["Telemetry & Edge Logic"])

def calculate_heat_index(T_c: float, rh: float) -> float:
    """Computes National Weather Service (NWS) Heat Index in Celsius."""
    # Convert Celsius to Fahrenheit for standard Rothfusz regression
    T = T_c * 9.0 / 5.0 + 32.0
    
    # Simple formula fallback if conditions are mild
    hi_simple = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (rh * 0.094))
    if hi_simple < 80:
        hi_f = hi_simple
    else:
        # Full Rothfusz regression
        c1 = -42.379; c2 = 2.04901523; c3 = 10.14333127; c4 = -0.22475541
        c5 = -0.00683783; c6 = -0.05481717; c7 = 0.00122874; c8 = 0.00085282; c9 = -0.00000199
        hi_f = (c1 + c2*T + c3*rh + c4*T*rh + c5*(T**2) + c6*(rh**2) + 
                c7*(T**2)*rh + c8*T*(rh**2) + c9*(T**2)*(rh**2))
    
    # Convert back to Celsius
    return round((hi_f - 32.0) * 5.0 / 9.0, 2)

def determine_risk_level(heat_index: float) -> str:
    """Classify environmental heat-risk screening from the DHT22-compatible metric."""
    if heat_index < 27.8:
        return "SAFE"
    elif heat_index < 29.4:
        return "MODERATE"
    elif heat_index < 31.1:
        return "ELEVATED"
    elif heat_index < 32.2:
        return "HIGH"
    else:
        return "CRITICAL"

@router.get(
    "/latest/{node_id}",
    response_model=TelemetryResponse | SensorTelemetryResponse,
)
def latest_telemetry(node_id: str, db: Session = Depends(get_db)):
    if sensor_api_is_configured():
        try:
            sensor_data = fetch_sensor_reading(node_id)
        except SensorAPIError as error:
            raise HTTPException(status_code=502, detail=str(error)) from error

        if not sensor_data["sensor_ok"]:
            return SensorTelemetryResponse(
                **sensor_data,
                timestamp=datetime.now(timezone.utc),
            )

        node = db.query(NodeModel).filter(NodeModel.id == node_id).first()
        if not node:
            node = NodeModel(
                id=node_id,
                name=node_id,
                location_description="Created from external sensor API",
            )
            db.add(node)
            db.flush()

        hi = calculate_heat_index(
            sensor_data["ambient_temp"], sensor_data["humidity"]
        )
        reading = TelemetryReadingModel(
            node_id=node_id,
            ambient_temp=sensor_data["ambient_temp"],
            humidity=sensor_data["humidity"],
            globe_temp=None,
            air_speed=None,
            surface_temp=None,
            heat_index=hi,
            wbgt=None,
            risk_level=determine_risk_level(hi),
        )
        db.add(reading)
        db.commit()
        return SensorTelemetryResponse(
            **sensor_data,
            timestamp=datetime.now(timezone.utc),
        )

    reading = get_latest_by_node(db=db, node_id=node_id)
    if not reading:
        # A node can be configured before its first hardware reading arrives.
        # 204 lets clients represent that expected initial state without
        # treating it as a failed request.
        return Response(status_code=204)
    return reading

@router.post("/", response_model=TelemetryResponse)
def ingest_telemetry(data: TelemetryCreate, db: Session = Depends(get_db)):
    # Verify node exists
    node = db.query(NodeModel).filter(NodeModel.id == data.node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail=f"Node {data.node_id} not registered.")
    
    # Compute only metrics supported by temperature and relative humidity.
    hi = calculate_heat_index(data.ambient_temp, data.humidity)
    risk = determine_risk_level(hi)
    
    # Save reading
    db_reading = TelemetryReadingModel(
        node_id=data.node_id,
        ambient_temp=data.ambient_temp,
        humidity=data.humidity,
        globe_temp=None,
        air_speed=None,
        surface_temp=None,
        heat_index=hi,
        wbgt=None,
        risk_level=risk
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading