'use client';

import React from 'react';
import { Award, Users, Activity, DollarSign, BookOpen } from 'lucide-react';

export type ActiveTab = 'overview' | 'uncapped-picks' | 'pressure-explorer' | 'auction-simulator';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedCount: number;
  totalPurseAllocated: number;
}

export default function Navbar({ activeTab, onTabChange, selectedCount, totalPurseAllocated }: NavbarProps) {
  const navTabs = [
    { id: 'overview' as ActiveTab, label: 'Overview & Methodology', icon: BookOpen },
    { id: 'uncapped-picks' as ActiveTab, label: 'Top 10 Uncapped Picks', icon: Users },
    { id: 'pressure-explorer' as ActiveTab, label: 'Pressure Index Explorer', icon: Activity },
    { id: 'auction-simulator' as ActiveTab, label: 'Auction Budget Simulator', icon: DollarSign, badge: selectedCount > 0 ? `${selectedCount} targets` : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-md">
      {/* Top Banner / Brand bar */}
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
                  <span>SupeRR Selector 2026</span>
                  <span className="hidden md:inline text-slate-500 font-light">|</span>
                  <span className="hidden md:inline text-xs sm:text-sm font-semibold text-slate-300">IPL 2027 Talent Scouting Engine</span>
                </h1>
                
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EA1A85]/15 px-2.5 py-0.5 text-xs font-semibold text-[#EA1A85] border border-[#EA1A85]/30">
                  <Award className="h-3 w-3" />
                  Season 2 Submission
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Rajasthan Royals Analytics & High-Leverage Talent Identification System
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
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Shortlisted</span>
                <span className="font-mono font-bold text-[#EA1A85]">{selectedCount} / 10 Active</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">IPL 2027 Model v2.4</span>
              <span className="sm:hidden">v2.4</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar" aria-label="Tabs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#EA1A85] to-[#D01474] text-white shadow-md shadow-[#EA1A85]/25 ring-1 ring-white/20'
                    : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EA1A85]/20 text-[#EA1A85] border border-[#EA1A85]/30'
                  }`}>
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
