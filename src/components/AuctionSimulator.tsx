'use client';

import React, { useState } from 'react';
import { HLPRSPlayer, RR_AUCTION_TARGET_BOARD, RR_5_SQUAD_GAPS } from '@/data/players';
import { DollarSign, Check, Users, ShieldCheck, RefreshCw, Copy } from 'lucide-react';

interface AuctionSimulatorProps {
  selectedPlayers: HLPRSPlayer[];
  onTogglePlayer: (player: HLPRSPlayer) => void;
  onSelectPlayer: (player: HLPRSPlayer) => void;
  onApplyPreset: (playerIds: string[]) => void;
  onReset: () => void;
}

export default function AuctionSimulator({
  selectedPlayers,
  onTogglePlayer,
  onSelectPlayer,
  onApplyPreset,
  onReset,
}: AuctionSimulatorProps) {
  const [copied, setCopied] = useState(false);

  const totalPurse = 34.50; // ₹34.50 Cr total RR Purse
  const totalSlots = 8; // 8 slots to fill
  const targetUncappedCap = 18.00; // ₹18.00 Cr targeted spend for these tactical gaps

  const totalSpent = selectedPlayers.reduce((sum, p) => sum + (p.recommendedMaxBid || 0), 0);
  const remainingTotalPurse = totalPurse - totalSpent;
  const slotsFilled = selectedPlayers.length;
  const remainingSlots = Math.max(0, totalSlots - slotsFilled);
  const avgRoomPerRemainingSlot = remainingSlots > 0 ? (remainingTotalPurse / remainingSlots) : 0;

  const purseSpentPercent = Math.min(100, Math.round((totalSpent / totalPurse) * 100));

  // Gaps covered
  const coveredGaps = new Set(selectedPlayers.map(p => p.targetRole));
  const totalGaps = RR_5_SQUAD_GAPS.length;
  const gapCoveragePercentage = Math.round((coveredGaps.size / totalGaps) * 100);

  const handleCopyPlan = () => {
    const textSummary = `RR SupeRR Selector — HL-PRS v7 Auction Sheet:
Total Simulated Spend: ₹${totalSpent.toFixed(2)} Cr / ₹${totalPurse.toFixed(2)} Cr
Remaining Total Purse: ₹${remainingTotalPurse.toFixed(2)} Cr
Slots Filled: ${slotsFilled} / ${totalSlots}
RR 5 Squad Gap Coverage: ${gapCoveragePercentage}% (${coveredGaps.size}/${totalGaps} tactical holes closed)

Target Bidding Acquisitions:
${selectedPlayers.map((p, i) => `${i + 1}. ${p.player_name} (${p.nationality}) - Max Bid: ₹${(p.recommendedMaxBid || 0).toFixed(2)} Cr [${p.targetRole}] HL-PRS: ${p.hl_prs_score}`).join('\n')}
`;
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-[#0F172A] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#EA1A85]/20 px-2 py-0.5 text-xs font-bold text-[#EA1A85] border border-[#EA1A85]/30 flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              HL-PRS v7 Auction Purse Optimizer
            </span>
            <span className="text-xs text-slate-400 font-mono">
              RR Auction Purse: ₹{totalPurse.toFixed(2)} Cr • 8 Slots
            </span>
          </div>
          <h2 className="mt-2 text-xl font-black text-white tracking-tight">
            Interactive Auction Purse & Squad Simulator
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Optimize bid allocations across the 14 targets (Officially Released Nov 17 + Uncontracted Domestic Gems) to solve RR&apos;s 5 open squad gaps without overbidding.
          </p>
        </div>

        {/* Preset Strategies */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onApplyPreset(['4900', '1556', '6554', '6461'])}
            className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-[#EA1A85] hover:text-white transition-colors"
          >
            Hasaranga + Payne Core
          </button>
          <button
            onClick={() => onApplyPreset(['6554', '58135', '6461', '56185', '56559'])}
            className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-500 hover:text-white transition-colors"
          >
            All-Uncapped Indian Value (5)
          </button>
          <button
            onClick={() => onApplyPreset(RR_AUCTION_TARGET_BOARD.map(p => p.player_id))}
            className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-[#F59E0B] hover:text-white transition-colors"
          >
            All 14 Targets
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title="Reset simulation"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Simulator Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Simulated Spend */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulated Spend</span>
            <span className="text-[11px] font-mono font-bold text-[#F59E0B]">{purseSpentPercent}% of Total Purse</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">₹{totalSpent.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ ₹{totalPurse.toFixed(2)} Cr</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalSpent > targetUncappedCap ? 'bg-rose-500' : 'bg-gradient-to-r from-[#EA1A85] to-[#F59E0B]'
              }`}
              style={{ width: `${Math.min(100, (totalSpent / totalPurse) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Target Tactical Ceiling: <strong className="text-slate-300">₹{targetUncappedCap.toFixed(2)} Cr</strong>
          </p>
        </div>

        {/* Metric 2: Remaining Total Purse */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Remaining Total Purse</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              remainingTotalPurse >= 14 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {remainingTotalPurse >= 14 ? 'Healthy Cushion' : 'Tight Margin'}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-400">₹{remainingTotalPurse.toFixed(2)}</span>
            <span className="text-xs text-slate-400 ml-1">Cr remaining</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Preserved for Remaining Open Auction Slots
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Avg Room/Slot: <strong className="text-slate-300 font-mono">₹{avgRoomPerRemainingSlot.toFixed(2)} Cr</strong>
          </p>
        </div>

        {/* Metric 3: Squad Gap Coverage */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">RR 5 Gap Coverage</span>
            <span className="text-[11px] font-mono font-bold text-[#EA1A85]">{coveredGaps.size} / {totalGaps} Roles</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-[#EA1A85]">{gapCoveragePercentage}%</span>
            <span className="text-xs text-slate-400">Deficits resolved</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#EA1A85] transition-all duration-500"
              style={{ width: `${gapCoveragePercentage}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            {coveredGaps.size >= 4 ? 'Elite tactical balance achieved' : 'Select candidates across 5 gaps'}
          </p>
        </div>

        {/* Metric 4: Slots Status */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Slots Allocation</span>
            <span className="text-[11px] font-mono font-bold text-blue-400">{slotsFilled} / {totalSlots}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">{remainingSlots}</span>
            <span className="text-xs text-slate-400">Slots open</span>
          </div>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: totalSlots }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-sm ${
                  idx < slotsFilled ? 'bg-[#EA1A85]' : 'bg-slate-800'
                }`}
                title={idx < slotsFilled ? 'Filled' : 'Open'}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Guarantees full 18-25 player squad depth
          </p>
        </div>

      </div>

      {/* Main Interactive Workspace: 14 Candidates Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Candidates Checklist */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#1E293B]/70 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-[#EA1A85]" />
                RR 14 Target Candidates Pool
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Released Nov 17, 2026 + Uncontracted Indian Gems
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono font-semibold">
              {selectedPlayers.length} Active in Cart
            </span>
          </div>

          <div className="divide-y divide-slate-800/70 max-h-[500px] overflow-y-auto pr-1">
            {RR_AUCTION_TARGET_BOARD.map((player) => {
              const isSelected = selectedPlayers.some(p => p.player_id === player.player_id);

              return (
                <div
                  key={player.player_id}
                  className={`flex items-center justify-between py-3 px-2 rounded-lg transition-colors ${
                    isSelected ? 'bg-slate-800/70' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onTogglePlayer(player)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
                        isSelected
                          ? 'bg-[#EA1A85] border-[#EA1A85] text-white shadow-sm'
                          : 'border-slate-600 bg-slate-900 text-transparent hover:border-slate-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white hover:text-[#EA1A85] cursor-pointer" onClick={() => onSelectPlayer(player)}>
                          {player.player_name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          player.contractStatus?.includes('Released') ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {player.contractStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {player.targetRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-bold font-mono text-white block">
                        ₹{(player.recommendedMaxBid || 0).toFixed(2)} Cr
                      </span>
                      <span className="text-[10px] text-[#EA1A85] font-mono font-bold">
                        {player.hl_prs_score} HL-PRS
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectPlayer(player)}
                      className="rounded bg-slate-900 px-2 py-1 text-[11px] text-slate-400 border border-slate-700 hover:text-white hover:border-slate-500"
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Gap Fulfillment & Export Sheet */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-xl border border-slate-800 bg-[#1E293B]/70 p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#F59E0B]" />
                RR 5 Squad Gaps Status
              </span>
              <span className="text-xs font-mono text-[#F59E0B]">
                {coveredGaps.size} of 5 Covered
              </span>
            </h3>

            <div className="space-y-2 pt-1">
              {RR_5_SQUAD_GAPS.map((gap, idx) => {
                const isCovered = Array.from(coveredGaps).some(g => g?.includes(gap.gapName.split('. ')[1]) || false);
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                      isCovered
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-200'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${isCovered ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                      <span className="font-medium">{gap.gapName}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCovered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCovered ? 'Covered' : 'Unfilled'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Actionable Strategy Dossier
              </span>
              <span className="text-xs font-mono text-[#EA1A85] font-bold">
                {selectedPlayers.length} Targets Selected
              </span>
            </div>

            <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated Spend:</span>
                <span className="text-white font-bold">₹{totalSpent.toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Total Purse:</span>
                <span className="text-emerald-400 font-bold">₹{remainingTotalPurse.toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Bid / Slot:</span>
                <span className="text-[#F59E0B] font-bold">₹{(totalSpent / Math.max(1, selectedPlayers.length)).toFixed(2)} Cr</span>
              </div>
            </div>

            <button
              onClick={handleCopyPlan}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EA1A85] to-[#D01474] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#EA1A85]/20 hover:brightness-110 transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  HL-PRS Auction Plan Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Bidding Plan to Clipboard
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
