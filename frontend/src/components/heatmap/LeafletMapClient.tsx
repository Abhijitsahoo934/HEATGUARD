'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import type { MeshNode } from './HeatMapGrid';

const getRiskColor = (risk: MeshNode['risk']) => {
  if (risk === 'CRITICAL') return '#991B1B';
  if (risk === 'HIGH') return '#DC2626';
  if (risk === 'MODERATE') return '#D97706';
  return '#64748B';
};

const createCustomIcon = (node: MeshNode, selectedNodeId: string) => {
  const color = getRiskColor(node.risk);
  const isSelected = node.id === selectedNodeId;
  const isElevatedRisk = node.risk === 'HIGH' || node.risk === 'CRITICAL';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="map-pin-shell ${isSelected ? 'map-pin-selected' : ''} ${isElevatedRisk ? 'map-pin-pulse' : ''}">
        <div class="map-pin-dot" style="background-color: ${color};"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

interface LeafletMapClientProps {
  nodes: MeshNode[];
  selectedNodeId: string;
  onSelectNode: (node: MeshNode) => void;
  mapStyle: 'street' | 'satellite';
}

export default function LeafletMapClient({ nodes, selectedNodeId, onSelectNode, mapStyle }: LeafletMapClientProps) {
  return (
    <MapContainer
      center={[20.2961, 85.8245]}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <ZoomControl position="topleft" />
      {mapStyle === 'street' ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      ) : (
        <TileLayer
          attribution="Tiles &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      )}

      {nodes.map((node) => (
        <Marker
          key={node.id}
          position={[node.lat, node.lon]}
          icon={createCustomIcon(node, selectedNodeId)}
          eventHandlers={{
            click: () => onSelectNode(node),
          }}
        >
          <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={node.id === selectedNodeId}>
            {node.id} · {node.name}
          </Tooltip>
          <Popup>
            <div className="space-y-1 p-1 font-sans">
              <span className="text-[10px] font-mono font-bold uppercase text-red-600">{node.id} - {node.type}</span>
              <h4 className="text-sm font-bold text-slate-900">{node.name}</h4>
              <div className="text-xs font-mono text-slate-700">
                <p>Status: <strong>{node.status}</strong></p>
                <p>Temperature: <strong>{node.temperature === null ? 'NO DATA' : `${node.temperature.toFixed(1)} °C`}</strong></p>
                <p>Humidity: <strong>{node.humidity === null ? 'NO DATA' : `${node.humidity}%`}</strong></p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
