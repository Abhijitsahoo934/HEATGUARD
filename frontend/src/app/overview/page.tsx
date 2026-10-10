'use client';

import { AlertTriangle, Droplets, Radio, Thermometer } from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import TopBar from '@/components/common/TopBar';
import { useTelemetry } from '@/telemetry/useTelemetry';

const NODE_ID = 'NODE-01';

function Reading({ label, value, unit, icon }: { label: string; value: string; unit?: string; icon: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">{icon}{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        {value}{unit && <span className="ml-1 text-sm font-normal text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { telemetry } = useTelemetry(NODE_ID);
  const lastError = telemetry.lastError;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} network={telemetry.connectionState.network} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <header>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span className={`h-2 w-2 rounded-full ${telemetry.mode === 'LIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {telemetry.mode} · {telemetry.source} · {NODE_ID}
              </div>
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-red-600">Facility status · Plant A</span>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Industrial Command Center</h1>
              <p className="mt-1 text-sm text-slate-500">Real-time heat conditions, node status and local protection readiness.</p>
            </header>

            {lastError && (
              <div className="flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                {lastError}
              </div>
            )}

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ['ACTIVE NODES', telemetry.dataQuality === 'GOOD' ? '1' : 'NO DATA'],
                ['HIGH-RISK ZONES', telemetry.dataQuality === 'GOOD' ? (telemetry.riskLevel === 'HIGH' || telemetry.riskLevel === 'CRITICAL' ? '1' : '0') : 'NO DATA'],
                ['ALERTS', telemetry.dataQuality === 'GOOD' ? '0' : 'NO DATA'],
                ['OFFLINE NODES', telemetry.connectionState.unoQ === 'NOT CONNECTED' ? 'NO DATA' : '0'],
                ['EDGE SAFETY STATUS', telemetry.connectionState.unoQ === 'ONLINE' ? 'READY' : 'NOT CONNECTED'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="block text-[10px] font-mono font-semibold tracking-wider text-slate-400">{label}</span>
                  <span className="mt-2 block text-lg font-bold text-slate-950">{value}</span>
                </div>
              ))}
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-semibold text-slate-950">Current Zone Conditions</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {telemetry.mode === 'LIVE' && telemetry.dataQuality === 'GOOD'
                        ? 'DHT22 measurements received for the monitored work area.'
                        : 'No live telemetry is available for this zone.'}
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">{telemetry.dataQuality}</span>
                </div>
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <Reading label="Ambient temperature" value={telemetry.temperature?.toFixed(1) ?? '—'} unit="°C" icon={<Thermometer className="h-4 w-4 text-red-500" />} />
                  <Reading label="Relative humidity" value={telemetry.humidity?.toFixed(0) ?? '—'} unit="%" icon={<Droplets className="h-4 w-4 text-blue-500" />} />
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  {telemetry.dataQuality === 'GOOD' ? 'Source: DHT22 · Ambient temperature and relative humidity only.' : 'STATUS: NO LIVE DATA · Connect the UNO Q and DHT22 to begin live readings.'}
                </p>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-950">Industrial Heat-Risk Screening</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">Temperature + humidity based screening for the monitored work area.</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Current state</span>
                    <span className={`font-semibold ${telemetry.dataQuality === 'GOOD' ? 'text-amber-700' : 'text-slate-500'}`}>
                      {telemetry.dataQuality === 'GOOD' ? telemetry.riskLevel : 'UNKNOWN'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{telemetry.dataQuality === 'GOOD' ? telemetry.riskReason : 'Risk unavailable until live temperature and humidity data are received.'}</p>
                </div>
              </section>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-950">Local Industrial Protection Path</h2>
                  <p className="mt-1 text-sm text-slate-500">Commands are shown separately from physical confirmation.</p>
                </div>
                <span className="text-xs font-mono text-slate-400">DHT22 → UNO Q → relay → fan / buzzer</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ['DHT22', telemetry.sensorStatus.dht22],
                  ['UNO Q', telemetry.connectionState.unoQ],
                  ['Risk decision', telemetry.dataQuality === 'GOOD' ? telemetry.riskLevel : 'UNKNOWN'],
                  ['Fan / buzzer', telemetry.actuatorState.fan.command],
                ].map(([label, state]) => (
                  <div key={label} className="border border-slate-200 bg-slate-50 p-3">
                    <span className="block text-xs text-slate-500">{label}</span>
                    <span className="mt-1 block text-sm font-semibold text-slate-800">{state}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
