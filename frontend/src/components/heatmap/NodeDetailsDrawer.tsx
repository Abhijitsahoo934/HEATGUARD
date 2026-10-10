import { MapPin, Thermometer } from 'lucide-react';
import type { MeshNode } from './HeatMapGrid';

interface NodeDetailsDrawerProps {
  node: MeshNode;
}

export default function NodeDetailsDrawer({ node }: NodeDetailsDrawerProps) {
  return (
    <aside className="sticky top-24 space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Node inspector</span>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{node.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-mono text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {node.lat.toFixed(4)}, {node.lon.toFixed(4)}
          </p>
        </div>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono text-slate-600">
          {node.id}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="block text-[10px] font-mono text-slate-500">Temperature</span>
            <span className="text-xl font-extrabold font-mono text-slate-900">{node.temperature === null ? 'NO DATA' : `${node.temperature.toFixed(1)} °C`}</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="block text-[10px] font-mono text-slate-500">Humidity</span>
            <span className="text-xl font-extrabold font-mono text-slate-900">{node.humidity === null ? 'NO DATA' : `${node.humidity}%`}</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-800">Data status</span>
          <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-700">{node.status === 'LIVE' ? 'Live node measurement.' : 'No physical node deployed here.'}</p>
            <p className="text-[11px] text-slate-600">{node.status === 'LIVE' ? 'DHT22 temperature and humidity are the only available measurements.' : 'This location is planned for future deployment and has no telemetry.'}</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            <Thermometer className="h-3.5 w-3.5" />
            Node Status
          </span>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">{node.type}</span>
            <span className={node.status === 'LIVE' ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-500'}>
              {node.status}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
