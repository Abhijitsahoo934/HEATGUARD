import { normalizeTelemetry, type CanonicalTelemetry } from '@/telemetry';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');

interface HardwareTelemetryResponse {
  node_id?: string;
  ambient_temp?: number | null;
  humidity?: number | null;
  timestamp?: string | null;
  sensor_ok?: boolean;
  heat_status?: string;
  fan?: boolean;
  buzzer?: boolean;
  fan_threshold?: number | null;
  critical_threshold?: number | null;
  risk_level?: string;
}

export async function fetchLatestTelemetry(nodeId = 'NODE-01', signal?: AbortSignal): Promise<CanonicalTelemetry | null> {
  const response = await fetch(`${API_BASE_URL}/telemetry/latest/${encodeURIComponent(nodeId)}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal,
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Telemetry request failed with ${response.status}`);
  }

  const telemetry = (await response.json()) as HardwareTelemetryResponse;
  return normalizeTelemetry({
    ...telemetry,
    node_id: telemetry.node_id ?? nodeId,
    network_status: 'ONLINE',
    uno_q_status: 'ONLINE',
  });
}
