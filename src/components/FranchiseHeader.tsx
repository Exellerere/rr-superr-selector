'use client';

import React from 'react';
import {
  Trophy,
  BarChart3,
  Crosshair,
  Search,
  Scale
} from 'lucide-react';

export type MainTabType = 
  | 'leaderboards'
  | 'quadrants'
  | 'war-room'
  | 'forensic'
  | 'v71-refinement';

interface FranchiseHeaderProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  selectedTargetsCount: number;
  totalPurseAllocated: number;
}

export default function FranchiseHeader({
  activeTab,
  onTabChange,
  selectedTargetsCount,
  totalPurseAllocated
}: FranchiseHeaderProps) {
  const tabs = [
    {
      id: 'leaderboards' as MainTabType,
      label: '🏆 Pressure Leaderboards',
      badge: 'Top 20 Batters & Bowlers',
      icon: Trophy
    },
    {
      id: 'quadrants' as MainTabType,
      label: '📊 Pressure Quadrants & Charts',
      badge: 'Scatter & Par Splits',
      icon: BarChart3
    },
    {
      id: 'war-room' as MainTabType,
      label: '🎯 RR IPL 2027 Auction War-Room',
      badge: '5-Slot Squad Gap Matrix',
      icon: Crosshair
    },
    {
      id: 'forensic' as MainTabType,
      label: '🔍 Forensic Audit & Formula',
      badge: '3 Bug Fixes & Flop Math',
      icon: Search
    },
    {
      id: 'v71-refinement' as MainTabType,
      label: '⚖️ v7.1 Model Refinement (Kohli Exemption)',
      badge: 'Championship Win Exemption',
      icon: Scale
    }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#EA1A85]/20 bg-[#0B162C]/95 backdrop-blur-md shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Franchise Status & Brand Bar */}
        <div className="flex flex-col md:flex-row md:h-20 py-3 md:py-0 items-start md:items-center justify-between gap-4 border-b border-slate-800/80">
          
          {/* Left: RR Crest + Typography */}
          <div className="flex items-center gap-3.5">
            {/* Custom SVG Royal Shield & Crown */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EA1A85] via-[#B81165] to-[#0B162C] shadow-lg shadow-[#EA1A85]/30 border-2 border-[#D4AF37]/80">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white text-white" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#D4AF37] ring-2 ring-[#0B162C]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded bg-[#EA1A85]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#EA1A85] border border-[#EA1A85]/40">
                  RR Analytics Lab
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Halla Bol • IPL 2027 War Room
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Season 2 Finalist
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 uppercase">
                <span>SupeRR Selector</span>
                <span className="text-[#EA1A85]">—</span>
                <span className="text-[#D4AF37]">Season 2</span>
              </h1>
              
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                High-Leverage Pressure Intelligence &amp; IPL 2027 Auction Strategy (T20-Only Strict)
              </p>
            </div>
          </div>

          {/* Right: Live Franchise Status Strip */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Primary: Total Remaining Purse (After Player Retentions) */}
            <div className="rounded-xl bg-[#112240] border-2 border-[#D4AF37] px-3.5 py-1.5 shadow-lg flex items-center gap-2.5">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#D4AF37] uppercase font-black tracking-wider">
                  Total Remaining Purse
                </span>
                <span className="text-[9px] text-slate-300 font-semibold">
                  (After Player Retentions)
                </span>
              </div>
              <div className="flex items-baseline gap-1 border-l border-slate-700/80 pl-2.5">
                <span className="font-mono font-black text-base text-white">
                  ₹27.05
                </span>
                <span className="text-xs font-bold text-[#D4AF37]">Cr</span>
              </div>
            </div>

            {/* Open Slots Pill */}
            <div className="rounded-xl bg-[#112240] border border-[#38BDF8]/40 px-3 py-1.5 shadow-md flex items-center gap-2">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Open Slots</span>
                <span className="text-[9px] text-slate-400 font-semibold">(3 Overseas)</span>
              </div>
              <span className="font-mono font-black text-base text-[#38BDF8] border-l border-slate-700/80 pl-2">
                6
              </span>
            </div>

            {/* Sidelined Simulation Info */}
            {selectedTargetsCount > 0 && (
              <div className="hidden xl:flex items-center gap-1.5 rounded-xl bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 text-[11px] text-slate-400">
                <span>Simulated Plan:</span>
                <span className="font-mono font-bold text-slate-200">₹{totalPurseAllocated.toFixed(2)} Cr</span>
                <span className="text-[10px] text-slate-500">({selectedTargetsCount} targets)</span>
              </div>
            )}

            {/* Model Badge */}
            <div className="rounded-xl bg-[#112240] border border-[#EA1A85]/50 px-3 py-1.5 shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EA1A85] animate-ping" />
              <span className="font-mono font-bold text-xs text-[#EA1A85]">
                HL-PRS v7
              </span>
            </div>
          </div>
        </div>

        {/* Segmented Navigation Bar (5 Clean Tabs) */}
        <nav className="flex space-x-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isV71 = tab.id === 'v71-refinement';

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all relative ${
                  isActive
                    ? isV71
                      ? 'bg-gradient-to-r from-amber-500 to-[#D4AF37] text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-1 ring-white/20'
                      : 'bg-gradient-to-r from-[#EA1A85] to-[#B81165] text-white font-extrabold shadow-lg shadow-[#EA1A85]/35 ring-1 ring-white/20'
                    : isV71
                    ? 'text-amber-300 hover:text-white bg-[#112240]/60 hover:bg-[#162B4D] border border-amber-500/30'
                    : 'text-slate-300 hover:text-white bg-[#112240]/60 hover:bg-[#162B4D] border border-[#EA1A85]/15'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? (isV71 ? 'text-slate-950' : 'text-white') : (isV71 ? 'text-amber-400' : 'text-[#EA1A85]')}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 hidden md:inline-block rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                      isActive
                        ? isV71
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-white/20 text-white'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
