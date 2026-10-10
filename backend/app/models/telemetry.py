from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class TelemetryReadingModel(Base):
    __tablename__ = "telemetry_readings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    node_id = Column(String, ForeignKey("nodes.id"), nullable=False, index=True)
    
    ambient_temp = Column(Float, nullable=False)       # °C
    humidity = Column(Float, nullable=False)             # %
    # Retained as nullable legacy columns so existing databases can be migrated
    # without inventing measurements that the DHT22 cannot provide.
    globe_temp = Column(Float, nullable=True)
    air_speed = Column(Float, nullable=True)
    surface_temp = Column(Float, nullable=True)
    
    # Locally computed metrics
    heat_index = Column(Float, nullable=False)
    wbgt = Column(Float, nullable=True)                  # Unsupported until required sensors exist
    risk_level = Column(String, nullable=False)          # Screening level, not a medical diagnosis
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)