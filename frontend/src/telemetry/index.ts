export type TelemetryMode = 'LIVE' | 'DEMO';
export type DataQuality = 'GOOD' | 'STALE' | 'INVALID' | 'MISSING' | 'SIMULATED';
export type ConnectionState = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'NOT CONNECTED' | 'UNKNOWN';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export interface CanonicalTelemetry {
  nodeId: string;
  timestamp: string | null;
  source: 'DHT22' | 'UNKNOWN';
  mode: TelemetryMode;
  temperature: number | null;
  humidity: number | null;
  dataQuality: DataQuality;
  sensorStatus: {
    dht22: ConnectionState;
  };
  connectionState: {
    unoQ: ConnectionState;
    network: ConnectionState;
  };
  modelState: {
    state: 'NOT LOADED' | 'READY' | 'RUNNING' | 'LEARNING' | 'ERROR' | 'UNKNOWN';
    name: string | null;
  };
  actuatorState: {
    fan: {
      command: 'ON' | 'OFF' | 'NOT SENT';
      confirmed: 'YES' | 'NO FEEDBACK' | 'UNKNOWN';
    };
    buzzer: {
      command: 'ON' | 'OFF' | 'NOT SENT';
      confirmed: 'YES' | 'NO FEEDBACK' | 'UNKNOWN';
    };
  };
  riskLevel: RiskLevel;
  riskReason: string;
  lastError: string | null;
}

export const EMPTY_TELEMETRY: CanonicalTelemetry = {
  nodeId: 'NODE-01',
  timestamp: null,
  source: 'UNKNOWN',
  mode: 'LIVE',
  temperature: null,
  humidity: null,
  dataQuality: 'MISSING',
  sensorStatus: { dht22: 'NOT CONNECTED' },
  connectionState: { unoQ: 'NOT CONNECTED', network: 'OFFLINE' },
  modelState: { state: 'NOT LOADED', name: null },
  actuatorState: {
    fan: { command: 'NOT SENT', confirmed: 'NO FEEDBACK' },
    buzzer: { command: 'NOT SENT', confirmed: 'NO FEEDBACK' },
  },
  riskLevel: 'UNKNOWN',
  riskReason: 'No live telemetry has been received.',
  lastError: 'UNO Q telemetry is unavailable.',
};

export const DEMO_TELEMETRY: CanonicalTelemetry = {
  nodeId: 'NODE-01',
  timestamp: null,
  source: 'DHT22',
  mode: 'DEMO',
  temperature: null,
  humidity: null,
  dataQuality: 'MISSING',
  sensorStatus: { dht22: 'NOT CONNECTED' },
  connectionState: { unoQ: 'NOT CONNECTED', network: 'OFFLINE' },
  modelState: { state: 'NOT LOADED', name: null },
  actuatorState: {
    fan: { command: 'NOT SENT', confirmed: 'NO FEEDBACK' },
    buzzer: { command: 'NOT SENT', confirmed: 'NO FEEDBACK' },
  },
  riskLevel: 'UNKNOWN',
  riskReason: 'Risk unavailable until live temperature and humidity data are received.',
  lastError: 'Demo mode does not simulate sensor readings.',
};

export function normalizeTelemetry(input: {
  node_id?: string;
  ambient_temp?: number | null;
  humidity?: number | null;
  timestamp?: string | null;
  network_status?: ConnectionState;
  uno_q_status?: ConnectionState;
  sensor_ok?: boolean;
  heat_status?: string;
  fan?: boolean;
  buzzer?: boolean;
  fan_threshold?: number | null;
  risk_level?: string;
}): CanonicalTelemetry {
  const sensorOk = input.sensor_ok !== false;
  const validTemperature = sensorOk && typeof input.ambient_temp === 'number' && Number.isFinite(input.ambient_temp);
  const validHumidity = sensorOk && typeof input.humidity === 'number' && Number.isFinite(input.humidity);
  const quality: DataQuality = validTemperature && validHumidity ? 'GOOD' : 'INVALID';
  const externalRisk = input.risk_level ?? input.heat_status;
  const normalizedRisk = externalRisk === 'NORMAL' ? 'SAFE' : externalRisk;
  const riskLevel: RiskLevel =
    quality === 'GOOD' && normalizedRisk && ['SAFE', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'].includes(normalizedRisk)
      ? normalizedRisk as RiskLevel
      : 'UNKNOWN';
  const sensorError = input.heat_status && input.heat_status !== 'UNKNOWN'
    ? input.heat_status
    : 'DHT22 did not report a valid reading.';

  return {
    ...EMPTY_TELEMETRY,
    nodeId: input.node_id ?? EMPTY_TELEMETRY.nodeId,
    timestamp: input.timestamp ?? null,
    mode: 'LIVE',
    temperature: validTemperature ? input.ambient_temp ?? null : null,
    humidity: validHumidity ? input.humidity ?? null : null,
    dataQuality: quality,
    sensorStatus: { dht22: quality === 'GOOD' ? 'ONLINE' : sensorOk ? 'DEGRADED' : 'OFFLINE' },
    connectionState: {
      unoQ: input.uno_q_status ?? 'UNKNOWN',
      network: input.network_status ?? 'UNKNOWN',
    },
    actuatorState: {
      fan: { command: typeof input.fan === 'boolean' ? (input.fan ? 'ON' : 'OFF') : 'NOT SENT', confirmed: 'NO FEEDBACK' },
      buzzer: { command: typeof input.buzzer === 'boolean' ? (input.buzzer ? 'ON' : 'OFF') : 'NOT SENT', confirmed: 'NO FEEDBACK' },
    },
    riskLevel,
    riskReason: quality === 'GOOD'
      ? `Screening based on DHT22 temperature and humidity${input.fan_threshold ? ` · fan threshold ${input.fan_threshold} °C` : ''}.`
      : `Risk unavailable: ${sensorError}`,
    lastError: quality === 'GOOD' ? null : sensorError,
  };
}
