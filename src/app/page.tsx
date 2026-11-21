'use client';

import React, { useState } from 'react';
import FranchiseHeader, { MainTabType } from '@/components/FranchiseHeader';
import KPISummaryStrip from '@/components/KPISummaryStrip';
import FranchiseLeaderboard from '@/components/FranchiseLeaderboard';
import PressureQuadrantsChart from '@/components/PressureQuadrantsChart';
import AuctionWarRoomView from '@/components/AuctionWarRoomView';
import ForensicAuditView from '@/components/ForensicAuditView';
import V71SensitivityView from '@/components/V71SensitivityView';
import PlayerScoutingDrawer from '@/components/PlayerScoutingDrawer';
import {
  HLPRSPlayer,
  RR_AUCTION_TARGET_BOARD,
  OPEN_TOP_20_BATTERS,
  OPEN_TOP_20_BOWLERS,
} from '@/data/players';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTabType>('war-room');
  const [selectedPlayerForDrawer, setSelectedPlayerForDrawer] = useState<HLPRSPlayer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Default selected auction targets from the 14 targets:
  // Salman Nizar (Finisher), Hasaranga (Wrist Spin), Tejasvi Dahiya (WK/Finisher), David Payne (Death Pacer), Mayank Rawat (Pace AR)
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

  const totalPurseAllocated = auctionSelectedPlayers.reduce(
    (sum, p) => sum + (p.recommendedMaxBid || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0B162C] text-slate-100 flex flex-col font-sans selection:bg-[#EA1A85] selection:text-white bg-jharokha">
      
      {/* Official Rajasthan Royals Franchise Header */}
      <FranchiseHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedTargetsCount={auctionSelectedPlayers.length}
        totalPurseAllocated={totalPurseAllocated}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Top 4 KPI Summary Cards matching Mockup 2 */}
        <KPISummaryStrip />

        {/* TAB 1: 🏆 Pressure Leaderboards */}
        {activeTab === 'leaderboards' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <FranchiseLeaderboard
              allBatters={OPEN_TOP_20_BATTERS}
              allBowlers={OPEN_TOP_20_BOWLERS}
              rrTargets={RR_AUCTION_TARGET_BOARD}
              selectedPlayerIds={auctionSelectedPlayers.map((p) => p.player_id)}
              onToggleAuction={handleToggleAuctionPlayer}
              onSelectPlayer={handleOpenPlayerDrawer}
            />

            {/* Bottom Quick-Jump Banner to v7.1 Sensitivity */}
            <div className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#112240] via-[#162B4D] to-[#112240] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Model Evolution: Inspect v7.1 Sensitivity (Championship Win Exemption)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    See how Virat Kohli jumps to #10 (84.40) and Rohit Sharma to #12 (82.10) when removing collapse penalties for championship victories.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('v71-refinement')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#EA1A85] px-4 py-2 text-xs font-bold text-white hover:bg-[#FF2E9B] shadow-md shadow-[#EA1A85]/30 transition-all shrink-0"
              >
                <span>View v7.1 Exemption Tab</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>
        )}

        {/* TAB 2: 📊 Pressure Quadrants & Charts */}
        {activeTab === 'quadrants' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <PressureQuadrantsChart
              batters={OPEN_TOP_20_BATTERS}
              bowlers={OPEN_TOP_20_BOWLERS}
              rrTargets={RR_AUCTION_TARGET_BOARD}
              onSelectPlayer={handleOpenPlayerDrawer}
            />
          </section>
        )}

        {/* TAB 3: 🎯 RR IPL 2027 Auction War-Room (Matching Mockup 1) */}
        {activeTab === 'war-room' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <AuctionWarRoomView
              selectedPlayers={auctionSelectedPlayers}
              onTogglePlayer={handleToggleAuctionPlayer}
              onSelectPlayer={handleOpenPlayerDrawer}
            />
          </section>
        )}

        {/* TAB 4: 🔍 Forensic Audit & Formula */}
        {activeTab === 'forensic' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <ForensicAuditView />
          </section>
        )}

        {/* TAB 5: ⚖️ v7.1 Model Refinement (Kohli Exemption) */}
        {activeTab === 'v71-refinement' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <V71SensitivityView />
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

      {/* Official Rajasthan Royals Halla Bol Footer */}
      <footer className="border-t border-[#EA1A85]/20 bg-[#070E1C] py-7 text-xs text-slate-400 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EA1A85] to-[#0B162C] border border-[#D4AF37]/70 font-black text-white text-sm shadow-md">
              RR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white uppercase tracking-wider">
                  Rajasthan Royals Analytics Lab
                </span>
                <span className="rounded bg-[#EA1A85]/20 text-[#EA1A85] px-2 py-0.5 text-[10px] font-bold border border-[#EA1A85]/30">
                  Halla Bol
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                SupeRR Selector Season 2 • High-Leverage Pressure Rating System (HL-PRS v7, T20-Only Strict Engine)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#112240] border border-slate-800 px-3 py-1.5 text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              109,564 Deduplicated Deliveries Audited
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#112240] border border-slate-800 px-3 py-1.5 text-slate-300">
              Purse: ₹27.05 Cr (6 Slots)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#112240] border border-slate-800 px-3 py-1.5 text-slate-300">
              Next.js 16 • Tailwind CSS
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
