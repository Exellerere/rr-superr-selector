'use client';

import React, { useState } from 'react';
import Navbar, { ActiveTab } from '@/components/Navbar';
import ExecutiveKPICards from '@/components/ExecutiveKPICards';
import PlayerTable from '@/components/PlayerTable';
import PlayerScoutingDrawer from '@/components/PlayerScoutingDrawer';
import ScoutingCharts from '@/components/ScoutingCharts';
import AuctionSimulator from '@/components/AuctionSimulator';
import MethodologySection from '@/components/MethodologySection';
import { Player, UNCAPPED_PLAYERS, EXECUTIVE_KPIS } from '@/data/players';
import { Zap, ChevronRight, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('uncapped-picks');
  const [selectedPlayerForDrawer, setSelectedPlayerForDrawer] = useState<Player | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Default selected auction players (top 4 targets by default)
  const [auctionSelectedPlayers, setAuctionSelectedPlayers] = useState<Player[]>([
    UNCAPPED_PLAYERS[0], // Priyansh Arya
    UNCAPPED_PLAYERS[1], // Sameer Rizvi
    UNCAPPED_PLAYERS[2], // Rasikh Salam Dar
    UNCAPPED_PLAYERS[3], // Vipraj Nigam
  ]);

  // Drawer open handler
  const handleOpenPlayerDrawer = (player: Player) => {
    setSelectedPlayerForDrawer(player);
    setIsDrawerOpen(true);
  };

  const handleClosePlayerDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Toggle player into auction simulator
  const handleToggleAuctionPlayer = (player: Player) => {
    setAuctionSelectedPlayers((prev) => {
      const exists = prev.some((p) => p.id === player.id);
      if (exists) {
        return prev.filter((p) => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  // Apply scenario preset
  const handleApplyPreset = (playerIds: string[]) => {
    const selected = UNCAPPED_PLAYERS.filter((p) => playerIds.includes(p.id));
    setAuctionSelectedPlayers(selected);
  };

  // Reset auction selection
  const handleResetAuction = () => {
    setAuctionSelectedPlayers([]);
  };

  // Computed metrics
  const totalAllocatedBudget = auctionSelectedPlayers.reduce(
    (sum, p) => sum + p.recommendedMaxBid,
    0
  );

  const avgSelectedPressure =
    auctionSelectedPlayers.length > 0
      ? auctionSelectedPlayers.reduce((sum, p) => sum + p.clutchPressureRating, 0) /
        auctionSelectedPlayers.length
      : EXECUTIVE_KPIS.avgPressureImpactScore;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between selection:bg-[#EA1A85] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCount={auctionSelectedPlayers.length}
        totalPurseAllocated={totalAllocatedBudget}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* Executive KPI Summary Cards */}
        <ExecutiveKPICards
          selectedPlayersCount={auctionSelectedPlayers.length}
          totalAllocatedBudget={totalAllocatedBudget}
          avgSelectedPressure={avgSelectedPressure}
        />

        {/* Tab Specific Content */}
        {activeTab === 'uncapped-picks' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>Top 10 Young Uncapped Domestic Talent</span>
                  <span className="rounded-full bg-[#EA1A85]/20 text-[#EA1A85] px-2 py-0.5 text-xs font-bold border border-[#EA1A85]/30">
                    IPL 2027 Roster Fit
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Comprehensive performance tracking, boundary generation, and dynamic pressure impact ratings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pressure-explorer')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E293B] border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#EA1A85] hover:text-white transition-colors"
                >
                  <Zap className="h-3.5 w-3.5 text-[#EA1A85]" />
                  <span>Scatter Matrix View</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setActiveTab('auction-simulator')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#EA1A85] to-[#D01474] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#EA1A85]/20 hover:brightness-110 transition-all"
                >
                  <span>Purse Simulator ({auctionSelectedPlayers.length})</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Filterable Table / Card Component */}
            <PlayerTable
              onSelectPlayer={handleOpenPlayerDrawer}
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.id)}
              onToggleAuction={handleToggleAuctionPlayer}
            />
          </section>
        )}

        {activeTab === 'pressure-explorer' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="pb-1">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Pressure Index Explorer & Quadrant Matrix</span>
                <span className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-xs font-bold border border-blue-500/30">
                  Interactive Recharts
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Cross-correlate raw strike rates/economies against pressure leverage scores to identify mispriced talent ahead of rival franchises.
              </p>
            </div>

            {/* Visual Recharts Scatter & Bar charts */}
            <ScoutingCharts
              onSelectPlayer={handleOpenPlayerDrawer}
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.id)}
            />
          </section>
        )}

        {activeTab === 'auction-simulator' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <AuctionSimulator
              selectedPlayers={auctionSelectedPlayers}
              onTogglePlayer={handleToggleAuctionPlayer}
              onSelectPlayer={handleOpenPlayerDrawer}
              onApplyPreset={handleApplyPreset}
              onReset={handleResetAuction}
            />
          </section>
        )}

        {activeTab === 'overview' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <MethodologySection />
          </section>
        )}

      </main>

      {/* Slide-in Scouting Report Drawer */}
      <PlayerScoutingDrawer
        player={selectedPlayerForDrawer}
        isOpen={isDrawerOpen}
        onClose={handleClosePlayerDrawer}
        isSelectedForAuction={
          selectedPlayerForDrawer
            ? auctionSelectedPlayers.some((p) => p.id === selectedPlayerForDrawer.id)
            : false
        }
        onToggleAuction={handleToggleAuctionPlayer}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B1120] py-6 text-xs text-slate-400 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EA1A85] font-black text-white text-xs">
              RR
            </div>
            <div>
              <p className="font-bold text-slate-200">
                SupeRR Selector 2026 • Rajasthan Royals Scouting System
              </p>
              <p className="text-[11px] text-slate-500">
                Halla Bol! High-Leverage Analytics & Contextual Talent Acquisition for IPL 2027.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Next.js 16 App Router
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
              Tailwind CSS
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
              Vercel Ready
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
