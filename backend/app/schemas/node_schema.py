from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NodeBase(BaseModel):
    id: str = Field(..., example="NODE-03")
    name: str = Field(..., example="Tin Roof Classroom")
    location_description: Optional[str] = Field(None, example="Block B, 2nd Floor")
    latitude: float = Field(..., example=20.2961)
    longitude: float = Field(..., example=85.8245)

class NodeCreate(NodeBase):
    pass

class NodeResponse(NodeBase):
    is_active: bool
    battery_percentage: float
    solar_input_watts: float
    network_status: str
    grid_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True