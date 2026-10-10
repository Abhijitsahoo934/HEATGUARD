'use client';

import { Activity, Cpu, Radio, Server, Thermometer } from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import TopBar from '@/components/common/TopBar';
import { useTelemetry } from '@/telemetry/useTelemetry';

function StatusRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <div>
        <span className="block text-sm text-slate-700">{label}</span>
        {note && <span className="mt-0.5 block text-xs text-slate-400">{note}</span>}
      </div>
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export default function DeviceHealthPage() {
  const { telemetry } = useTelemetry();
  const liveLink = telemetry.connectionState.network === 'ONLINE';
  const processingStatus = liveLink ? 'CONNECTED' : 'NOT CONNECTED';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} network={telemetry.connectionState.network} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <header>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {telemetry.mode} · {telemetry.dataQuality === 'GOOD' ? 'LIVE TELEMETRY' : 'NO LIVE TELEMETRY'}
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Industrial Edge Device Health</h1>
              <p className="mt-1 text-sm text-slate-500">Monitor node connectivity, sensor integrity and local protection readiness.</p>
            </header>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <span className="text-xs font-mono text-slate-400">SYSTEM STATUS</span>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">UNO Q · {telemetry.connectionState.unoQ}</h2>
                  <p className="mt-1 text-sm text-slate-500">Live sensor telemetry is flowing through the facility edge link.</p>
                </div>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">{liveLink ? 'CONNECTED' : 'NOT CONNECTED'}</span>
              </div>
              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
                <StatusRow label="Runtime mode" value={telemetry.mode} note="Live values are shown only after a verified device reading." />
                <StatusRow label="Last heartbeat" value="Not available" note="Waiting for UNO Q." />
                <StatusRow label="Network" value={telemetry.connectionState.network} note="Network state is separate from hardware state." />
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                <h2 className="font-semibold text-slate-950">Safety path</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                {[
                  ['DHT22', telemetry.sensorStatus.dht22, Thermometer],
                  ['Local processing', telemetry.modelState.state, Cpu],
                  ['Risk decision', telemetry.riskLevel, Activity],
                  ['Actuator command', telemetry.actuatorState.fan.command, Radio],
                ].map(([label, state, Icon]) => {
                  const StageIcon = Icon as typeof Thermometer;
                  return (
                    <div key={label as string} className="flex items-center gap-3 border border-slate-200 bg-white p-4 shadow-sm">
                      <StageIcon className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="block text-xs text-slate-500">{label as string}</span>
                        <span className="mt-1 block text-sm font-semibold text-slate-800">{state as string}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Thermometer className="h-4 w-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-950">Sensor status</h2>
                </div>
                <StatusRow label="DHT22" value={telemetry.sensorStatus.dht22} note="Ambient temperature and relative humidity only." />
                <StatusRow label="Temperature" value={telemetry.temperature === null ? 'NO DATA' : `${telemetry.temperature.toFixed(1)} °C`} note="DHT22 reading only." />
                <StatusRow label="Humidity" value={telemetry.humidity === null ? 'NO DATA' : `${telemetry.humidity.toFixed(0)} %`} note="DHT22 reading only." />
                <StatusRow label="Data freshness" value={telemetry.dataQuality} note={telemetry.timestamp ?? 'No device timestamp available.'} />
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Server className="h-4 w-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-950">Processing and actuation</h2>
                </div>
                <StatusRow label="QRB2210 Linux application" value={processingStatus} note="Facility edge processing link." />
                <StatusRow label="STM32U585 control loop" value={processingStatus} note="Local protection control link." />
                <StatusRow label="Forecast engine" value="EDGE ESTIMATE" note="Transparent short-horizon fallback; no trained ML model installed." />
                <StatusRow label="Fan" value="Command not sent" note="Physical feedback unavailable." />
                <StatusRow label="Buzzer" value="Command not sent" note="Physical feedback unavailable." />
              </section>
            </div>

            <div className="border border-slate-200 bg-slate-100 px-4 py-3 text-xs text-slate-600">
              Power telemetry: <strong>Not connected</strong>. No battery, solar input, voltage or runtime values are displayed.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
