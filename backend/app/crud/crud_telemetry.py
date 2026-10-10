from sqlalchemy.orm import Session

from app.models.telemetry import TelemetryReadingModel


def get_latest_by_node(db: Session, node_id: str) -> TelemetryReadingModel | None:
    return (
        db.query(TelemetryReadingModel)
        .filter(TelemetryReadingModel.node_id == node_id)
        .order_by(TelemetryReadingModel.timestamp.desc(), TelemetryReadingModel.id.desc())
        .first()
    )