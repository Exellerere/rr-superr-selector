'use client';

import React, { useState } from 'react';
import Navbar, { ActiveTab } from '@/components/Navbar';
import ExecutiveKPICards from '@/components/ExecutiveKPICards';
import LeaderboardViews from '@/components/LeaderboardViews';
import PlayerScoutingDrawer from '@/components/PlayerScoutingDrawer';
import ScoutingCharts from '@/components/ScoutingCharts';
import AuctionSimulator from '@/components/AuctionSimulator';
import MethodologySection from '@/components/MethodologySection';
import {
  HLPRSPlayer,
  RR_AUCTION_TARGET_BOARD,
  OPEN_TOP_20_BATTERS,
  OPEN_TOP_20_BOWLERS,
} from '@/data/players';
import { Zap, ChevronRight, Target, Flame, Shield } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rr-target-board');
  const [selectedPlayerForDrawer, setSelectedPlayerForDrawer] = useState<HLPRSPlayer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Default selected auction players from the 14 targets:
  // Hasaranga (Wrist Spin), David Payne (Death Pacer), Salman Nizar (Finisher), Tejasvi Dahiya (WK/Finisher), Mayank Rawat (Pace AR)
  const [auctionSelectedPlayers, setAuctionSelectedPlayers] = useState<HLPRSPlayer[]>([
    RR_AUCTION_TARGET_BOARD[0], // Salman Nizar
    RR_AUCTION_TARGET_BOARD[1], // Wanindu Hasaranga
    RR_AUCTION_TARGET_BOARD[2], // Tejasvi Dahiya
    RR_AUCTION_TARGET_BOARD[3], // David Payne
    RR_AUCTION_TARGET_BOARD[5], // Mayank Rawat
  ]);

  const handleOpenPlayerDrawer = (player: HLPRSPlayer) => {
    setSelectedPlayerForDrawer(player);
    setIsDrawerOpen(true);
  };

  const handleClosePlayerDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleToggleAuctionPlayer = (player: HLPRSPlayer) => {
    setAuctionSelectedPlayers((prev) => {
      const exists = prev.some((p) => p.player_id === player.player_id);
      if (exists) {
        return prev.filter((p) => p.player_id !== player.player_id);
      } else {
        return [...prev, player];
      }
    });
  };

  const handleApplyPreset = (playerIds: string[]) => {
    const selected = RR_AUCTION_TARGET_BOARD.filter((p) => playerIds.includes(p.player_id));
    setAuctionSelectedPlayers(selected);
  };

  const handleResetAuction = () => {
    setAuctionSelectedPlayers([]);
  };

  const totalAllocatedBudget = auctionSelectedPlayers.reduce(
    (sum, p) => sum + (p.recommendedMaxBid || 0),
    0
  );

  const avgSelectedPressure =
    auctionSelectedPlayers.length > 0
      ? auctionSelectedPlayers.reduce((sum, p) => sum + p.hl_prs_score, 0) /
        auctionSelectedPlayers.length
      : 74.2;

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

        {/* Tab 1: RR IPL 2027 Target Board */}
        {activeTab === 'rr-target-board' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#EA1A85]" />
                  <span>Rajasthan Royals IPL 2027 Auction Target Board</span>
                  <span className="rounded-full bg-[#EA1A85]/20 text-[#EA1A85] px-2 py-0.5 text-xs font-bold border border-[#EA1A85]/30">
                    14 Targets
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Filtered strictly for Officially Released (Nov 17, 2026) and Uncontracted Indian Domestic Gems mapped strictly to RR&apos;s 5 open squad gaps (excluding redundant openers & left-arm orthodox spinners).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('open-batters')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E293B] border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#EA1A85] hover:text-white transition-colors"
                >
                  <Flame className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>Open Top 20 Batters</span>
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

            <LeaderboardViews
              players={RR_AUCTION_TARGET_BOARD}
              viewType="rr-targets"
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.player_id)}
              onToggleAuction={handleToggleAuctionPlayer}
              onSelectPlayer={handleOpenPlayerDrawer}
            />
          </section>
        )}

        {/* Tab 2: Open Top 20 Batters */}
        {activeTab === 'open-batters' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Flame className="h-5 w-5 text-[#F59E0B]" />
                  <span>All-Player Open Top 20 Batters (HL-PRS v7)</span>
                  <span className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-xs font-bold border border-blue-500/30">
                    T20 World Cup & IPL Records
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Global benchmark rankings across 7,824 players evaluated under Empirical Bayes leverage weighting, Habitual Flop (-P_flop), and Stat-Pad (-P_pad) penalties.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('rr-target-board')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E293B] border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#EA1A85] hover:text-white transition-colors"
              >
                <Target className="h-3.5 w-3.5 text-[#EA1A85]" />
                <span>Return to RR 14 Targets</span>
              </button>
            </div>

            <LeaderboardViews
              players={OPEN_TOP_20_BATTERS}
              viewType="batters"
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.player_id)}
              onToggleAuction={handleToggleAuctionPlayer}
              onSelectPlayer={handleOpenPlayerDrawer}
            />
          </section>
        )}

        {/* Tab 3: Open Top 20 Bowlers */}
        {activeTab === 'open-bowlers' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#38BDF8]" />
                  <span>All-Player Open Top 20 Bowlers (HL-PRS v7)</span>
                  <span className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-xs font-bold border border-blue-500/30">
                    T20 World Cup & IPL Records
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Ranked by Pressure Economy, Strike Rate under Crisis Situations, and Knockout Flop Resistance.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('rr-target-board')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E293B] border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#EA1A85] hover:text-white transition-colors"
              >
                <Target className="h-3.5 w-3.5 text-[#EA1A85]" />
                <span>Return to RR 14 Targets</span>
              </button>
            </div>

            <LeaderboardViews
              players={OPEN_TOP_20_BOWLERS}
              viewType="bowlers"
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.player_id)}
              onToggleAuction={handleToggleAuctionPlayer}
              onSelectPlayer={handleOpenPlayerDrawer}
            />
          </section>
        )}

        {/* Tab 4: Pressure Explorer & Recharts */}
        {activeTab === 'pressure-explorer' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="pb-1">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#EA1A85]" />
                <span>HL-PRS v7 Pressure Matrix & RR 5 Squad Gap Breakdown</span>
              </h2>
              <p className="text-xs text-slate-400">
                Visual quadrant analysis comparing pressure performance against HL-PRS v7 scores, alongside RR tactical role depth.
              </p>
            </div>

            <ScoutingCharts
              onSelectPlayer={handleOpenPlayerDrawer}
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.player_id)}
            />
          </section>
        )}

        {/* Tab 5: Auction Simulator */}
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

        {/* Tab 6: Methodology & Architecture */}
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
            ? auctionSelectedPlayers.some((p) => p.player_id === selectedPlayerForDrawer.player_id)
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
                SupeRR Selector • HL-PRS v7 Engine (T20-Only Strict)
              </p>
              <p className="text-[11px] text-slate-500">
                Rajasthan Royals Analytics & High-Leverage Talent Identification System for IPL 2027.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              7,824 Players Evaluated
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
              Next.js 16
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
              Vercel Deployed
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
