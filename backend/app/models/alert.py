from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class ActuationLogModel(Base):
    __tablename__ = "actuation_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    node_id = Column(String, ForeignKey("nodes.id"), nullable=False, index=True)
    
    event_type = Column(String, nullable=False)        # SENSE, PREDICT, THRESHOLD_CROSSED, ACTUATE_FAN, REST_ALERT
    description = Column(String, nullable=False)
    
    # Actuator states at the time of event
    fan_status = Column(String, default="OFF")         # ON / OFF
    cooler_status = Column(String, default="OFF")      # ON / OFF
    buzzer_status = Column(String, default="IDLE")     # ACTIVE / IDLE
    
    persona_applied = Column(String, default="LABORER") # LABORER, SCHOOL_CHILD, ELDERLY
    is_local_decision = Column(Boolean, default=True)   # Proves edge autonomy during outages
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)