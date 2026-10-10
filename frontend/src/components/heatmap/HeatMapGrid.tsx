'use client';

import dynamic from 'next/dynamic';
import { Compass, Layers, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useTelemetry } from '@/telemetry/useTelemetry';

export type MeshNodeRisk = 'SAFE' | 'NO DATA' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface MeshNode {
  id: string;
  name: string;
  type: string;
  temperature: number | null;
  humidity: number | null;
  risk: MeshNodeRisk;
  status: 'LIVE' | 'SIMULATED' | 'PLANNED';
  lat: number;
  lon: number;
}

export const mockMeshNodes: MeshNode[] = [
  { id: 'NODE-01', name: 'Furnace Area', type: 'Configured facility zone', temperature: null, humidity: null, risk: 'NO DATA', status: 'PLANNED', lat: 20.2961, lon: 85.8245 },
  { id: 'NODE-02', name: 'Production Floor', type: 'Configured facility zone', temperature: null, humidity: null, risk: 'NO DATA', status: 'PLANNED', lat: 20.298, lon: 85.826 },
  { id: 'NODE-03', name: 'Assembly Area', type: 'Configured facility zone', temperature: null, humidity: null, risk: 'NO DATA', status: 'PLANNED', lat: 20.295, lon: 85.822 },
];

interface HeatMapGridProps {
  onSelectNode: (node: MeshNode) => void;
  selectedNodeId: string;
}

const getRiskAccent = (risk: MeshNodeRisk) => {
  if (risk === 'CRITICAL') return 'bg-red-700';
  if (risk === 'HIGH') return 'bg-red-500';
  if (risk === 'MODERATE') return 'bg-amber-500';
  return 'bg-slate-400';
};

const getRiskBadge = (risk: MeshNodeRisk) => {
  if (risk === 'CRITICAL') return 'bg-red-50 text-red-700 border-red-200';
  if (risk === 'HIGH') return 'bg-red-50 text-red-600 border-red-200';
  if (risk === 'MODERATE') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

const MapWithNoSSR = dynamic(() => import('./LeafletMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center bg-slate-200">
      <span className="text-xs font-mono text-slate-600 animate-pulse">Loading satellite facility map...</span>
    </div>
  ),
});

export default function HeatMapGrid({ onSelectNode, selectedNodeId }: HeatMapGridProps) {
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('satellite');
  const { telemetry } = useTelemetry();
  const nodes = mockMeshNodes.map((node) => {
    if (node.id !== telemetry.nodeId) return node;
    const live = telemetry.dataQuality === 'GOOD';
    return {
      ...node,
      temperature: telemetry.temperature,
      humidity: telemetry.humidity,
      risk: live && telemetry.riskLevel !== 'UNKNOWN' ? telemetry.riskLevel : 'NO DATA',
      status: telemetry.connectionState.network === 'ONLINE' ? 'LIVE' : 'PLANNED',
    } as MeshNode;
  });

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-red-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-900">Plant A facility heat map</h3>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 text-xs font-mono shadow-sm">
            <Layers className="ml-2 h-3.5 w-3.5 text-slate-500" />
            {(['satellite', 'street'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setMapStyle(style)}
                className={`rounded-md px-3 py-1.5 capitalize transition ${
                  mapStyle === style ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 h-[420px] w-full overflow-hidden rounded-lg border border-slate-300">
          <MapWithNoSSR
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            mapStyle={mapStyle}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-md bg-slate-950/80 px-3 py-2 text-[10px] font-semibold text-white shadow-lg">
            PLANT A · FACILITY NODE MAP
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;

          return (
            <button
              type="button"
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`relative overflow-hidden rounded-lg border bg-white p-5 text-left shadow-sm transition-all ${
                isSelected
                  ? 'border-red-600 ring-2 ring-red-600/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className={`absolute left-0 right-0 top-0 h-1.5 ${getRiskAccent(node.risk)}`} />

              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-slate-700">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">{node.type}</span>
                    <h4 className="text-sm font-bold text-slate-900">{node.name}</h4>
                  </div>
                </div>
                <span className={`rounded-md border px-2.5 py-1 text-[10px] font-mono font-bold ${getRiskBadge(node.risk)}`}>
                  {node.risk}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs font-mono">
                <div>
                  <span className="block text-slate-400">Temperature</span>
                  <span className="font-bold text-slate-900">
                    {node.temperature === null ? '—' : `${node.temperature.toFixed(1)} °C`}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400">Humidity</span>
                  <span className="font-semibold text-slate-900">{node.humidity === null ? '—' : `${node.humidity}%`}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>ID: {node.id}</span>
                <span className={node.status === 'LIVE' ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-500'}>{node.status}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
