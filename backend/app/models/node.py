from sqlalchemy import Column, Float, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class NodeModel(Base):
    __tablename__ = "nodes"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location_description = Column(String, nullable=True)

    latitude = Column(Float, nullable=False, default=20.2961)
    longitude = Column(Float, nullable=False, default=85.8245)
    is_active = Column(Boolean, default=True)
    battery_percentage = Column(Float, nullable=True)
    solar_input_watts = Column(Float, nullable=True)
    network_status = Column(String, nullable=True)
    grid_status = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())