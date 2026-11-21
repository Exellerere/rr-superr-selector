'use client';

import React, { useState } from 'react';
import {
  HLPRSPlayer,
  RR_AUCTION_TARGET_BOARD
} from '@/data/players';
import {
  Crosshair,
  Star,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Plus,
  Minus
} from 'lucide-react';

interface AuctionWarRoomViewProps {
  onSelectPlayer: (player: HLPRSPlayer) => void;
  selectedPlayers?: HLPRSPlayer[];
  selectedPlayerIds?: string[];
  onTogglePlayer?: (player: HLPRSPlayer) => void;
  onToggleAuction?: (player: HLPRSPlayer) => void;
}

export default function AuctionWarRoomView({
  onSelectPlayer,
  selectedPlayers,
  selectedPlayerIds: propPlayerIds,
  onTogglePlayer,
  onToggleAuction
}: AuctionWarRoomViewProps) {
  const [subTab, setSubTab] = useState<'matrix' | 'scouting' | 'bidding' | 'simulator'>('matrix');
  const [selectedGapFilter, setSelectedGapFilter] = useState('All');

  const selectedPlayerIds = propPlayerIds || (selectedPlayers ? selectedPlayers.map(p => p.player_id) : []);
  const handleToggle = onTogglePlayer || onToggleAuction || (() => {});

  // Slots matching Mockup 1:
  const squadSlots = [
    {
      slotId: 'slot-1',
      slotName: 'SLOT 1: MARQUEE FINISHER (P1)',
      urgency: 'URGENT',
      urgencyColor: 'bg-[#EA1A85] text-white',
      requirement: 'REQ. SR: 140+ • Fills Hetmyer / Curran Void',
      targetIds: ['6554', '3782', '7059'], // Salman Nizar, M Shahrukh Khan, Nehal Wadhera
      targets: [
        { name: 'Salman Nizar', id: '6554', role: 'Finisher', bid: '₹2.60 Cr', initials: 'SN' },
        { name: 'M Shahrukh Khan', id: '3782', role: 'Power Finisher', bid: '₹6.80 Cr', initials: 'SK' },
        { name: 'Nehal Wadhera', id: '7059', role: 'LHB Finisher', bid: '₹5.80 Cr', initials: 'NW' }
      ]
    },
    {
      slotId: 'slot-2',
      slotName: 'SLOT 2: DEATH BOWLER (P2)',
      urgency: 'MONITORING',
      urgencyColor: 'bg-[#D4AF37] text-slate-950 font-black',
      requirement: 'REQ. SR: 140+, ECON: <7.5 • Fills Deshpande / Milne Gap',
      targetIds: ['1556', '3174', '56185'], // David Payne, Matt Henry, Tanay Sanghvi
      targets: [
        { name: 'David Payne', id: '1556', role: 'Left-Arm Death', bid: '₹3.80 Cr', initials: 'DP' },
        { name: 'Matt Henry', id: '3174', role: 'Express Seam', bid: '₹4.60 Cr', initials: 'MH' },
        { name: 'Tanay Sanghvi', id: '56185', role: 'Domestic Seam', bid: '₹2.40 Cr', initials: 'TS' }
      ]
    },
    {
      slotId: 'slot-3',
      slotName: 'SLOT 3: ANCHOR / BACKUP WK (P3)',
      urgency: 'URGENT',
      urgencyColor: 'bg-[#EA1A85] text-white',
      requirement: 'ECON: <7.5 • Fills Ravi Singh / Samson Backup Void',
      targetIds: ['4211', '58135'], // Vishnu Vinod, Tejasvi Dahiya
      targets: [
        { name: 'Vishnu Vinod', id: '4211', role: '360 WK-Batter', bid: '₹3.20 Cr', initials: 'VV' },
        { name: 'Tejasvi Dahiya', id: '58135', role: 'Keeper-Finisher', bid: '₹2.20 Cr', initials: 'TD' }
      ]
    },
    {
      slotId: 'slot-4',
      slotName: 'SLOT 4: SPIN ALL-ROUNDER (P4)',
      urgency: 'URGENT',
      urgencyColor: 'bg-[#EA1A85] text-white',
      requirement: 'REQ. SR: 140+ • Fills Puthur / Chahal Spin Void',
      targetIds: ['4900', '32862', '56559'], // Wanindu Hasaranga, AM Ghazanfar, Kartik Chadha
      targets: [
        { name: 'Wanindu Hasaranga', id: '4900', role: 'Wrist Spinner', bid: '₹7.20 Cr', initials: 'WH' },
        { name: 'AM Ghazanfar', id: '32862', role: 'Mystery Spinner', bid: '₹4.80 Cr', initials: 'AG' },
        { name: 'Kartik Chadha', id: '56559', role: 'Domestic Leg-Spin', bid: '₹1.60 Cr', initials: 'KC' }
      ]
    },
    {
      slotId: 'slot-5',
      slotName: 'SLOT 5: PACE SPEARHEAD / UTILITY (P5)',
      urgency: 'MONITORING',
      urgencyColor: 'bg-[#D4AF37] text-slate-950 font-black',
      requirement: 'ECON: <7.5 • Seam Bowling Depth for Archer',
      targetIds: ['19781', '6461', '5951'], // Mitchell Owen, Mayank Rawat, Pradeep Dadhe
      targets: [
        { name: 'Mitchell Owen', id: '19781', role: 'Pace All-Rounder', bid: '₹5.40 Cr', initials: 'MO' },
        { name: 'Mayank Rawat', id: '6461', role: 'Seam Utility', bid: '₹2.80 Cr', initials: 'MR' },
        { name: 'Pradeep Dadhe', id: '5951', role: 'Hard-Length Pace', bid: '₹1.80 Cr', initials: 'PD' }
      ]
    }
  ];

  // 6 Primary Spotlight Scouting Cards (Center Column)
  const spotlightPlayerIds = ['6554', '4900', '1556', '19781', '58135', '6461'];
  const spotlightPlayers = RR_AUCTION_TARGET_BOARD.filter((p) =>
    spotlightPlayerIds.includes(p.player_id)
  );

  const totalSpent = RR_AUCTION_TARGET_BOARD
    .filter((p) => selectedPlayerIds.includes(p.player_id))
    .reduce((sum, p) => sum + (p.recommendedMaxBid || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. WAR ROOM CONTROL BAR (Matching Mockup 1 Top Strip) */}
      <div className="rounded-2xl border border-[#EA1A85]/30 bg-[#112240] p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: War Room Badge & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
              LIVE
            </span>
          </div>

          <div className="h-5 w-px bg-slate-700" />

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              STAGE: FINAL ROUND
            </span>
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Round 1 Problem Statement Synced
            </span>
          </div>
        </div>

        {/* Center: War Room Sub-Navigation Tabs (Matching Image 1) */}
        <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setSubTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
              subTab === 'matrix' ? 'bg-[#EA1A85] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Squad Gap Matrix (5-Slots)
          </button>
          <button
            onClick={() => setSubTab('scouting')}
            className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
              subTab === 'scouting' ? 'bg-[#EA1A85] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scouting &amp; Pressure Stats
          </button>
          <button
            onClick={() => setSubTab('simulator')}
            className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
              subTab === 'simulator' ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Simulator
          </button>
        </div>

        {/* Right: Purse Indicator */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400 uppercase font-black block">Purse Remaining</span>
          <span className="text-base font-black text-[#D4AF37]">
            ₹{(27.05 - totalSpent).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-slate-500 block">MAX SLOTS: 6</span>
        </div>
      </div>

      {/* 2. THREE-COLUMN WAR ROOM LAYOUT (Matching Mockup 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMN 1: SQUAD GAP MATRIX - 5 SLOTS (Width ~28% -> lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-[#112240] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Crosshair className="h-4 w-4 text-[#EA1A85]" />
                <span>Squad Gap Matrix (5 Slots)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">19 Retained</span>
            </div>

            <div className="space-y-3">
              {squadSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className="rounded-xl border border-slate-800 bg-[#0B162C]/90 p-3 hover:border-[#EA1A85]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-white">{slot.slotName}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${slot.urgencyColor}`}>
                      {slot.urgency}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mb-2">{slot.requirement}</p>

                  {/* Target Avatar Chips */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    {slot.targets.map((tgt) => {
                      const isTargetSelected = selectedPlayerIds.includes(tgt.id);

                      return (
                        <div
                          key={tgt.id}
                          onClick={() => {
                            const p = RR_AUCTION_TARGET_BOARD.find(x => x.player_id === tgt.id);
                            if (p) onSelectPlayer(p);
                          }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] cursor-pointer transition-all ${
                            isTargetSelected
                              ? 'bg-[#EA1A85]/20 border-[#EA1A85] text-white font-bold'
                              : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-500'
                          }`}
                          title={`${tgt.name} (${tgt.role}) - ${tgt.bid}`}
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EA1A85] text-white text-[8px] font-black">
                            {tgt.initials}
                          </span>
                          <span className="truncate max-w-[55px]">{tgt.name.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Note on Exclusions */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <strong className="text-white block mb-0.5">Franchise Depth Alignment:</strong>
              Solves the 5 exact voids created by releasing Hetmyer, Curran, Deshpande/Milne, Puthur, and Ravi Singh. Redundant openers and left-arm orthodox spinners are strictly excluded.
            </div>
          </div>
        </div>

        {/* COLUMN 2: PLAYER SCOUTING CARDS - PRESSURE STATS (Width ~47% -> lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#112240] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Player Scouting Cards — Pressure Stats
                </h3>
                <p className="text-[10px] text-slate-400">
                  Granular Usual vs. Pressure performance splits
                </p>
              </div>

              <select
                value={selectedGapFilter}
                onChange={(e) => setSelectedGapFilter(e.target.value)}
                className="rounded bg-[#0B162C] border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-[#EA1A85]"
              >
                <option value="All">All candidates</option>
                <option value="Finisher">Finishers (P1/P3)</option>
                <option value="Pacer">Death Pacers (P2/P5)</option>
                <option value="Spinner">Wrist Spinners (P4)</option>
              </select>
            </div>

            {/* 6 Spotlight Player Cards Grid (Matching Image 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(selectedGapFilter === 'All'
                ? spotlightPlayers
                : spotlightPlayers.filter(p => 
                    p.role.toLowerCase().includes(selectedGapFilter.toLowerCase()) || 
                    (p.targetRole && p.targetRole.toLowerCase().includes(selectedGapFilter.toLowerCase()))
                  )
              ).map((p) => {
                const isSelected = selectedPlayerIds.includes(p.player_id);
                const isBowler = Boolean(p.role.includes('Bowler') || p.targetRole?.includes('Pacer') || p.targetRole?.includes('Spinner'));

                // Calculate Usual vs Pressure heights for the comparative mini bar chart
                const usualVal = isBowler ? parseFloat(p.career_econ) : parseFloat(p.career_sr);
                const pressVal = isBowler ? p.eb_econ_press : p.eb_sr_press;

                // Normalize for visual bar:
                const maxVal = isBowler ? 12 : 240;
                const usualH = Math.min(100, Math.round((usualVal / maxVal) * 100));
                const pressH = Math.min(100, Math.round((pressVal / maxVal) * 100));

                return (
                  <div
                    key={p.player_id}
                    onClick={() => onSelectPlayer(p)}
                    className="group rounded-xl border border-slate-800 bg-[#0B162C] p-3.5 hover:border-[#EA1A85]/60 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: Avatar, Name, Role, Star */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-slate-900 to-[#1E293B] border border-[#EA1A85]/50 text-xs font-black text-white">
                            {p.player_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white group-hover:text-[#EA1A85] transition-colors truncate max-w-[120px]">
                              {p.player_name}
                            </h4>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                              {p.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(p);
                            }}
                            className={`p-1 rounded text-xs transition-colors ${
                              isSelected ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {isSelected ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      {/* 4 Stat Blocks */}
                      <div className="grid grid-cols-2 gap-2 mt-3 p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[10px]">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Pressure Index</span>
                          <span className="font-mono font-bold text-white text-xs">{p.hl_prs_score.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">
                            {isBowler ? 'Pressure Econ' : 'Pressure SR'}
                          </span>
                          <span className="font-mono font-bold text-emerald-400 text-xs">
                            {isBowler ? `${p.eb_econ_press}` : `${p.eb_sr_press}%`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Baseline Rate</span>
                          <span className="font-mono font-bold text-slate-300">
                            {isBowler ? `${p.career_econ}` : `${p.career_sr}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Target Bid</span>
                          <span className="font-mono font-black text-[#D4AF37]">₹{p.recommendedMaxBid?.toFixed(2)} Cr</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: "Usual vs. Pressure" Mini Double Bar Chart (Matching Image 1) */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1.5">
                        <span className="uppercase font-bold tracking-wider">Usual vs. Pressure</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-sm bg-[#D4AF37]" />
                            <span>Usual</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-sm bg-[#EA1A85]" />
                            <span>Pressure</span>
                          </span>
                        </div>
                      </div>

                      {/* Comparative Double Bars */}
                      <div className="flex items-end gap-2 h-7 bg-slate-900/60 rounded px-2 py-1">
                        <div className="flex-1 flex items-end gap-1.5 h-full">
                          {/* Usual Bar (Gold) */}
                          <div
                            style={{ height: `${usualH}%` }}
                            className="w-1/2 rounded-t-sm bg-[#D4AF37] transition-all"
                            title={`Usual: ${usualVal}`}
                          />
                          {/* Pressure Bar (Pink) */}
                          <div
                            style={{ height: `${pressH}%` }}
                            className="w-1/2 rounded-t-sm bg-[#EA1A85] shadow-sm shadow-[#EA1A85]/40 transition-all"
                            title={`Pressure: ${pressVal}`}
                          />
                        </div>
                        <span className="font-mono text-[9px] font-bold text-slate-300">
                          {isBowler ? `Econ: ${pressVal}` : `SR: ${pressVal}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 3: DECISION & BID TRACKER (Width ~25% -> lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-[#112240] p-4 shadow-xl space-y-4">
            
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center justify-between">
                <span>Decision &amp; Bid Tracker</span>
                <span className="text-[10px] text-slate-400 font-mono">₹27.05 Cr Cap</span>
              </h3>
            </div>

            {/* Simulated Bids */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">AUCTION BID 1:</span>
                <span className="text-white font-bold">₹7.20 Cr (Hasaranga)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">AUCTION BID 2:</span>
                <span className="text-white font-bold">₹3.80 Cr (Payne)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">AUCTION BID 3:</span>
                <span className="text-white font-bold">₹2.60 Cr (Nizar)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-[#D4AF37]/40">
                <span className="text-[#D4AF37] font-bold text-[11px]">CURRENT BID:</span>
                <span className="text-[#D4AF37] font-black">₹5.40 Cr (Owen)</span>
              </div>
            </div>

            {/* Recommended Targets List */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider mb-2">
                Recommended Targets (Priority)
              </span>

              <div className="space-y-1 text-[11px] font-mono">
                {RR_AUCTION_TARGET_BOARD.slice(0, 8).map((p, i) => (
                  <div
                    key={p.player_id}
                    onClick={() => onSelectPlayer(p)}
                    className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900 cursor-pointer transition-colors"
                  >
                    <span className="text-slate-300 truncate max-w-[140px]">
                      {i + 1}. {p.player_name}
                    </span>
                    <span className="text-[#D4AF37] font-bold">
                      ₹{p.recommendedMaxBid?.toFixed(2)} Cr
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Ingestion Verified */}
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>DATA INGESTION: VERIFIED (100%)</span>
            </div>

            {/* Action Buttons (Matching Mockup 1) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  alert(`Live Bid Simulation: Total Selected Spend = ₹${totalSpent.toFixed(2)} Cr out of ₹27.05 Cr purse.`);
                }}
                className="w-full py-2.5 rounded-xl font-black uppercase text-xs text-white bg-gradient-to-r from-[#EA1A85] to-[#B81165] hover:brightness-110 shadow-lg shadow-[#EA1A85]/30 transition-all flex items-center justify-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Simulate Bid</span>
              </button>

              <button
                onClick={() => {
                  const p1 = RR_AUCTION_TARGET_BOARD[0];
                  if (p1) onSelectPlayer(p1);
                }}
                className="w-full py-2.5 rounded-xl font-black uppercase text-xs text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:brightness-110 shadow-lg shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-slate-950" />
                <span>Compare Players</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
