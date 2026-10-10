'use client';

import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import TopBar from '@/components/common/TopBar';
import HeatMapGrid, { MeshNode, mockMeshNodes } from '@/components/heatmap/HeatMapGrid';
import NodeDetailsDrawer from '@/components/heatmap/NodeDetailsDrawer';
import { Layers } from 'lucide-react';
import { useTelemetry } from '@/telemetry/useTelemetry';

export default function HeatMapPage() {
  const { telemetry } = useTelemetry();
  const [selectedNode, setSelectedNode] = useState<MeshNode>(mockMeshNodes[0]);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar mode={telemetry.mode} hardware={telemetry.connectionState.unoQ} network={telemetry.connectionState.network} />

        <main className="p-6 lg:p-8 space-y-6 overflow-y-auto bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">Facility spatial overview</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950 tracking-tight">Facility Heat Map</h2>
              <p className="mt-1 text-sm text-slate-500">Satellite view of Plant A nodes. Select a marker to inspect its zone and telemetry state.</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-slate-600 shadow-sm">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Plant A · node coverage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <HeatMapGrid onSelectNode={setSelectedNode} selectedNodeId={selectedNode.id} />
            </div>
            <div>
              <NodeDetailsDrawer node={selectedNode} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
