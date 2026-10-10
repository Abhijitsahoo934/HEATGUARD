'use client';

import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import TopBar from '@/components/common/TopBar';
import { BrainCircuit, Droplets, Fan, Thermometer } from 'lucide-react';
import { useTelemetry } from '@/telemetry/useTelemetry';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const zones = ['Furnace Area', 'Production Floor', 'Assembly Area', 'Warehouse', 'Packaging Area', 'Maintenance Area', 'Worker Rest Area'];

export default function AIRiskPage() {
  const [activeZone, setActiveZone] = useState(zones[0]);
  const { telemetry } = useTelemetry();
  const hasReading = telemetry.dataQuality === 'GOOD';
  const forecast = hasReading && telemetry.temperature !== null && telemetry.humidity !== null
    ? [
        { horizon: 'Now', temperature: telemetry.temperature, humidity: telemetry.humidity },
        { horizon: '+1h', temperature: telemetry.temperature + 0.7, humidity: telemetry.humidity - 1 },
        { horizon: '+2h', temperature: telemetry.temperature + 1.3, humidity: telemetry.humidity - 2 },
        { horizon: '+5h', temperature: telemetry.temperature + 0.9, humidity: telemetry.humidity - 1 },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} network={telemetry.connectionState.network} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-5">
            <header>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.18em] text-red-600">
                <BrainCircuit className="h-4 w-4" /> Local intelligence
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Industrial Heat-Risk Intelligence</h1>
              <p className="mt-1 text-sm text-slate-500">Edge-based temperature and humidity analysis for monitored work zones.</p>
            </header>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">Facility zone</h2>
                <p className="mt-1 text-xs text-slate-500">Configured zones are not assumed to have live telemetry unless a node is deployed.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {zones.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setActiveZone(zone)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      zone === activeZone ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">Current zone risk</h2>
                    <p className="mt-1 text-xs text-slate-500">{activeZone} · screening indicator</p>
                  </div>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-extrabold tracking-widest ${hasReading ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {hasReading ? telemetry.riskLevel : 'UNKNOWN'}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Metric icon={<Thermometer className="h-4 w-4 text-red-500" />} label="Temperature" value={hasReading && telemetry.temperature !== null ? `${telemetry.temperature.toFixed(1)} °C` : 'NO DATA'} />
                  <Metric icon={<Droplets className="h-4 w-4 text-blue-500" />} label="Humidity" value={hasReading && telemetry.humidity !== null ? `${telemetry.humidity.toFixed(0)} %` : 'NO DATA'} />
                  <Metric label="Recent trend" value="INSUFFICIENT HISTORY" />
                  <Metric label="Data freshness" value={telemetry.timestamp ?? 'NO DATA'} />
                </div>
                <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  {hasReading ? 'Screening uses only the available DHT22 temperature and relative humidity inputs.' : 'Risk unavailable until live temperature and humidity data are received.'}
                </p>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">Zone Heat Trend Forecast</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">Short-horizon temperature and humidity estimates derived locally from the latest DHT22 reading.</p>
                {forecast.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecast} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                          <XAxis dataKey="horizon" tick={{ fontSize: 11 }} />
                          <YAxis yAxisId="temperature" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                          <YAxis yAxisId="humidity" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} />
                          <Tooltip
                            formatter={(value: number, name: string) => [name === 'temperature' ? `${value.toFixed(1)} °C` : `${value.toFixed(0)} %`, name === 'temperature' ? 'Temperature' : 'Humidity']}
                          />
                          <Line yAxisId="temperature" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                          <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-600">
                      <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />Temperature °C</span>
                      <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-600" />Humidity %</span>
                    </div>
                    <p className="text-[11px] leading-5 text-slate-500">Transparent edge estimate: no trained ML model is installed. Values are directional, not guaranteed predictions.</p>
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-500">WAITING FOR LIVE READING</span>
                    <p className="mt-2 text-xs text-slate-400">Estimates appear when valid DHT22 temperature data is available.</p>
                  </div>
                )}
              </section>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
              <div className="flex items-center gap-2">
                <Fan className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">Industrial protection</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">DHT22 → UNO Q → heat-risk screening → relay → fan / buzzer</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <Stage label="Sensor" value="DHT22" detail="Temperature + humidity" />
                <Stage label="Edge processing" value="Arduino UNO Q" detail={telemetry.connectionState.unoQ} />
                <Stage label="Risk decision" value={hasReading ? telemetry.riskLevel : 'UNKNOWN'} detail="Screening only" />
                <Stage label="Local action" value={telemetry.actuatorState.fan.command} detail="Physical feedback unavailable" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="flex items-center gap-2 text-xs text-slate-500">{icon}{label}</span>
      <span className="mt-2 block text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Stage({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-3">
      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">{label}</span>
      <span className="mt-1 block text-sm font-semibold text-slate-900">{value}</span>
      <span className="mt-1 block text-xs text-slate-500">{detail}</span>
    </div>
  );
}
