'use client';

import { Wifi, WifiOff } from 'lucide-react';
import type { ConnectionState, TelemetryMode } from '@/telemetry';

interface TopBarProps {
  mode?: TelemetryMode;
  hardware?: ConnectionState;
  network?: ConnectionState;
}

export default function TopBar({ mode = 'DEMO', hardware = 'NOT CONNECTED', network = 'OFFLINE' }: TopBarProps) {
  const networkOnline = network === 'ONLINE';
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-5 shadow-sm backdrop-blur-md sm:px-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-semibold tracking-wide text-slate-600 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        FACILITY: PLANT A · NODE-01
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold tracking-wide text-amber-800 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {mode}
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold tracking-wide text-slate-600 sm:inline-flex">
          <span className={`h-1.5 w-1.5 rounded-full ${hardware === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          HARDWARE {hardware}
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-wide shadow-sm ${
            networkOnline
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
          aria-live="polite"
        >
          <span className={`relative flex h-2.5 w-2.5 ${networkOnline ? 'text-emerald-500' : 'text-red-500'}`}>
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${networkOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${networkOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </span>
          {networkOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          <span>NETWORK {networkOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>
    </header>
  );
}
