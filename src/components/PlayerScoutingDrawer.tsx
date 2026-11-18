'use client';

import React from 'react';
import { HLPRSPlayer } from '@/data/players';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Target, Flame } from 'lucide-react';

interface PlayerScoutingDrawerProps {
  player: HLPRSPlayer | null;
  isOpen: boolean;
  onClose: () => void;
  isSelectedForAuction: boolean;
  onToggleAuction: (player: HLPRSPlayer) => void;
}

export default function PlayerScoutingDrawer({
  player,
  isOpen,
  onClose,
  isSelectedForAuction,
  onToggleAuction,
}: PlayerScoutingDrawerProps) {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <aside className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-slate-700/80 bg-[#131E33] shadow-2xl transition-transform animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EA1A85]/20 font-black text-xs text-[#EA1A85] border border-[#EA1A85]/40">
              #{player.rank}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              HL-PRS v7 Dossier • ID: {player.player_id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleAuction(player)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelectedForAuction
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-[#EA1A85] text-white hover:bg-[#D01474] shadow-md shadow-[#EA1A85]/25'
              }`}
            >
              {isSelectedForAuction ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  Remove Target
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Select Target
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          
          {/* Hero Profile Block */}
          <div className="rounded-xl border border-slate-700/70 bg-[#1E293B]/80 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-[#EA1A85]/20 to-transparent blur-xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-[#1E293B] border-2 border-[#EA1A85]/60 text-xl font-black text-white shadow-md">
                  {player.player_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">{player.player_name}</h2>
                    {player.contractStatus && (
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                        player.contractStatus.includes('Released')
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {player.contractStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {player.nationality} • {player.role} • {player.total_matches} T20 matches
                  </p>
                </div>
              </div>

              {/* HL-PRS v7 Score Badge */}
              <div className="flex items-center sm:flex-col items-end gap-1 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">HL-PRS v7 Score</span>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-[#EA1A85]" />
                  <span className="text-xl font-black font-mono text-[#EA1A85]">{player.hl_prs_score}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ 100</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-center">
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressure SR</span>
                <span className="text-sm font-black font-mono text-emerald-400">{player.eb_sr_press}</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressure Avg</span>
                <span className="text-sm font-black font-mono text-white">{player.eb_avg_press}</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressure Econ</span>
                <span className="text-sm font-black font-mono text-[#38BDF8]">{player.eb_econ_press}</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rec. Max Bid</span>
                <span className="text-sm font-black font-mono text-[#F59E0B]">
                  {player.recommendedMaxBid ? `₹${player.recommendedMaxBid.toFixed(2)} Cr` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* RR Tactical Squad Fit (if mapped) */}
          {player.targetRole && (
            <div className="rounded-xl border border-[#EA1A85]/30 bg-gradient-to-r from-[#EA1A85]/10 via-[#1E293B] to-[#1E293B] p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA1A85]">
                <Target className="h-4 w-4" />
                Target Squad Gap Assignment
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-white">{player.targetRole}</span>
                <span className="text-xs font-mono font-bold text-[#F59E0B]">{player.tier}</span>
              </div>
            </div>
          )}

          {/* HL-PRS v7 Deductions & Bonuses Strip */}
          <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              HL-PRS v7 Forensic Deductions & Bonuses
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">KO Flop (-P_flop)</span>
                <span className={`font-mono font-bold ${player.p_flop > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {player.p_flop > 0 ? `-${player.p_flop}` : '0.0 (Clean)'}
                </span>
              </div>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Stat-Pad (-P_pad)</span>
                <span className={`font-mono font-bold ${player.p_pad > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {player.p_pad > 0 ? `-${player.p_pad}` : '0.0 (Clean)'}
                </span>
              </div>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Volume (+B_vol)</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{player.b_vol}
                </span>
              </div>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Pedigree (+B_ped)</span>
                <span className="font-mono font-bold text-blue-400">
                  +{player.b_pedigree}
                </span>
              </div>
            </div>
          </div>

          {/* Tactical Analyst Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Scout & Model Technical Summary
            </h4>
            <p className="rounded-xl border border-slate-800 bg-[#1E293B]/60 p-4 text-xs text-slate-300 leading-relaxed">
              {player.tacticalNotes}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Technical Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {player.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Scouting Caution Areas
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {player.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 bg-[#0F172A] p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Auction Valuation Cap</span>
            <span className="text-base font-black font-mono text-[#F59E0B]">
              {player.recommendedMaxBid ? `₹${player.recommendedMaxBid.toFixed(2)} Cr` : 'Player Under Contract'}
            </span>
          </div>

          <button
            onClick={() => onToggleAuction(player)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              isSelectedForAuction
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20'
                : 'bg-gradient-to-r from-[#EA1A85] to-[#D01474] text-white hover:brightness-110 shadow-lg shadow-[#EA1A85]/30'
            }`}
          >
            {isSelectedForAuction ? 'Remove from Simulator' : 'Add to Target Buys (+)'}
          </button>
        </div>

      </aside>
    </div>
  );
}
