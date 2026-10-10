'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Flame,
  LayoutDashboard,
  Map,
} from 'lucide-react';
import type { ConnectionState, TelemetryMode } from '@/telemetry';

const navItems = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'AI & Risk', href: '/ai-risk', icon: BrainCircuit },
  { name: 'Facility Heat Map', href: '/heat-map', icon: Map },
  { name: 'Device Health', href: '/device-health', icon: Cpu },
];

interface SidebarProps {
  mode?: TelemetryMode;
  hardware?: ConnectionState;
}

export default function Sidebar({ mode = 'DEMO', hardware = 'NOT CONNECTED' }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col justify-between border-r border-slate-800 bg-[#0F172A] text-slate-100 shadow-xl transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isCollapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className={`relative flex items-center border-b border-slate-800/80 ${isCollapsed ? 'justify-center p-4' : 'gap-3 p-6'}`}>
          <div className="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-500">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'}`}>
            <h1 className="font-bold tracking-wider text-sm text-white">HEATGUARD</h1>
            <span className="text-[10px] tracking-widest text-red-400 font-mono font-semibold">INDUSTRIAL EDGE AI</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-[0_2px_8px_rgb(15_23_42_/_0.18)] transition-[transform,color,box-shadow] duration-300 hover:scale-110 hover:text-red-600 hover:shadow-[0_4px_12px_rgb(15_23_42_/_0.25)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0F172A]"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 p-4">
          <div className={`overflow-hidden whitespace-nowrap px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 transition-[max-height,opacity] duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-6 opacity-100'}`}>
            Command Center
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-xl py-3 text-xs font-semibold transition-[background-color,color,transform,padding,gap] duration-300 ${
                  isCollapsed ? 'justify-center px-3' : 'gap-3 px-3.5'
                } ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Edge Autonomy Badge Footer */}
      <div className={`m-4 overflow-hidden rounded-xl border border-slate-800 border-t bg-slate-900/90 transition-[padding] duration-500 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`mb-1.5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <span className={`overflow-hidden whitespace-nowrap text-[10px] font-mono text-slate-400 transition-[max-width,opacity] duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[110px] opacity-100'}`}>HARDWARE RUNTIME</span>
          <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-mono font-bold ${
            hardware === 'ONLINE'
              ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
              : 'border-slate-600 bg-slate-800 text-slate-300'
          }`}>
            <span className={`mr-1 h-1.5 w-1.5 rounded-full ${hardware === 'ONLINE' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            <span className={isCollapsed ? 'sr-only' : ''}>UNO Q {hardware}</span>
          </span>
        </div>
        <p className={`overflow-hidden text-[11px] leading-tight text-slate-400 transition-[max-height,opacity] duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'}`}>
          {mode} mode · local hardware status is {hardware.toLowerCase()}.
        </p>
      </div>

    </aside>
  );
}