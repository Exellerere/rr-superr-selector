'use client';

import React from 'react';
import { Award, Activity, DollarSign, BookOpen, Target, Flame, Shield, Database, Sparkles } from 'lucide-react';

export type ActiveTab =
  | 'rr-target-board'
  | 'open-batters'
  | 'open-bowlers'
  | 'v71-refinement'
  | 'forensic-audit'
  | 'pressure-explorer'
  | 'auction-simulator'
  | 'overview';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedCount: number;
  totalPurseAllocated: number;
}

export default function Navbar({ activeTab, onTabChange, selectedCount, totalPurseAllocated }: NavbarProps) {
  const navTabs = [
    { id: 'rr-target-board' as ActiveTab, label: 'RR IPL 2027 Strategy', icon: Target, badge: '₹27.05 Cr Purse' },
    { id: 'open-batters' as ActiveTab, label: 'Top Batters (HL-PRS v7)', icon: Flame, badge: 'Report Top 20' },
    { id: 'open-bowlers' as ActiveTab, label: 'Top Bowlers (HL-PRS v7)', icon: Shield, badge: 'Report Top 20' },
    { id: 'v71-refinement' as ActiveTab, label: 'v7.1 Refinement (Kohli Exemption)', icon: Sparkles, badge: 'NEW Sensitivity' },
    { id: 'forensic-audit' as ActiveTab, label: 'Forensic Audit', icon: Database, badge: '3 Bugs Fixed' },
    { id: 'pressure-explorer' as ActiveTab, label: 'Pressure Matrix', icon: Activity },
    { id: 'auction-simulator' as ActiveTab, label: 'Auction Simulator', icon: DollarSign, badge: selectedCount > 0 ? `${selectedCount} Active` : undefined },
    { id: 'overview' as ActiveTab, label: 'Engine Architecture', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EA1A85] to-[#2563EB] shadow-md shadow-[#EA1A85]/20 ring-1 ring-white/20">
              <span className="font-black text-white text-lg tracking-wider">RR</span>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#F59E0B] ring-2 ring-[#0F172A]" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                  <span>SupeRR Selector</span>
                  <span className="text-slate-500 font-light">|</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#EA1A85]">HL-PRS v7 T20 Engine</span>
                </h1>
                
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#EA1A85]/15 px-2.5 py-0.5 text-xs font-semibold text-[#EA1A85] border border-[#EA1A85]/30">
                  <Award className="h-3 w-3" />
                  Season 2 Final
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Hierarchical Leverage-Weighted Pressure Rating System • Rajasthan Royals IPL 2027
              </p>
            </div>
          </div>

          {/* Quick Metrics & Live Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-4 rounded-lg bg-[#1E293B]/70 border border-slate-800 px-3 py-1.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Simulated Spend</span>
                <span className="font-mono font-bold text-[#F59E0B]">₹{totalPurseAllocated.toFixed(2)} Cr</span>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">RR Targets</span>
                <span className="font-mono font-bold text-[#EA1A85]">{selectedCount} / 14 Selected</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">v7 Baseline Synced</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isV71 = tab.id === 'v71-refinement';

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all relative ${
                  isActive
                    ? isV71
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                      : 'bg-[#EA1A85] text-white shadow-md shadow-[#EA1A85]/30'
                    : isV71
                    ? 'text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                      isActive
                        ? isV71
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-white/20 text-white'
                        : isV71
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
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
