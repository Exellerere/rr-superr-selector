'use client';

import React from 'react';
import { Player } from '@/data/players';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Target, Flame, BarChart3 } from 'lucide-react';

interface PlayerScoutingDrawerProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  isSelectedForAuction: boolean;
  onToggleAuction: (player: Player) => void;
}

export default function PlayerScoutingDrawer({
  player,
  isOpen,
  onClose,
  isSelectedForAuction,
  onToggleAuction,
}: PlayerScoutingDrawerProps) {
  if (!isOpen || !player) return null;

  const { scoutingReport } = player;

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
              Official Scouting Dossier
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
                  Remove from Target Buys
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Add to Target Buys
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
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          
          {/* Hero Profile Block */}
          <div className="rounded-xl border border-slate-700/70 bg-[#1E293B]/80 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-[#EA1A85]/20 to-transparent blur-xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-[#1E293B] border-2 border-[#EA1A85]/60 text-xl font-black text-white shadow-md">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">{player.name}</h2>
                    <span className="rounded bg-[#EA1A85]/20 px-2 py-0.5 text-[10px] font-bold text-[#EA1A85] border border-[#EA1A85]/30">
                      Uncapped
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {player.age} yrs • {player.domesticTeam} • {player.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    {player.battingStyle} {player.bowlingStyle ? `• ${player.bowlingStyle}` : ''}
                  </p>
                </div>
              </div>

              {/* Scout Grade */}
              <div className="flex items-center sm:flex-col items-end gap-1 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Scout Grade</span>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-[#F59E0B]" />
                  <span className="text-lg font-black font-mono text-[#F59E0B]">{scoutingReport.scoutRating}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ 10</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-center">
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressure Score</span>
                <span className="text-sm font-black font-mono text-[#EA1A85]">{player.clutchPressureRating}</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{player.runsOrWickets.includes('Wickets') ? 'Economy Rate' : 'Strike Rate'}</span>
                <span className="text-sm font-black font-mono text-[#F59E0B]">{player.strikeRateOrEconomy}</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Boundary %</span>
                <span className="text-sm font-black font-mono text-emerald-400">{player.boundaryPercentage}%</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rec. Max Bid</span>
                <span className="text-sm font-black font-mono text-white">₹{player.recommendedMaxBid.toFixed(2)} Cr</span>
              </div>
            </div>
          </div>

          {/* Rajasthan Royals Strategic Fit */}
          <div className="rounded-xl border border-[#EA1A85]/30 bg-gradient-to-r from-[#EA1A85]/10 via-[#1E293B] to-[#1E293B] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA1A85]">
              <Target className="h-4 w-4" />
              RR Strategic Fit & Tactical Role
            </div>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed">
              {scoutingReport.rajasthanRoyalsFit}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Target Role Designation:</span>
              <span className="rounded-md bg-[#EA1A85]/20 px-2 py-0.5 text-xs font-bold text-white border border-[#EA1A85]/40">
                {scoutingReport.projectedRole}
              </span>
            </div>
          </div>

          {/* Analyst Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Lead Scout Analyst Summary
            </h3>
            <p className="rounded-xl border border-slate-800 bg-[#1E293B]/60 p-4 text-xs text-slate-300 leading-relaxed">
              {scoutingReport.analystSummary}
            </p>
          </div>

          {/* Technical Strengths & Development Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Technical Strengths
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scoutingReport.technicalStrengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas of Development */}
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Areas of Development
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scoutingReport.areasOfDevelopment.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics Radar / Benchmark Bars */}
          <div className="space-y-3 rounded-xl border border-slate-800 bg-[#1E293B]/70 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-[#F59E0B]" />
                Advanced Metric Percentiles vs Uncapped Benchmark
              </h4>
              <span className="text-[10px] text-slate-500">Benchmark = 60</span>
            </div>

            <div className="space-y-3 pt-2">
              {scoutingReport.metricsRadar.map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{metric.label}</span>
                    <span className="font-mono font-bold text-white">
                      {metric.value} <span className="text-slate-500 text-[10px]">/ 100</span>
                    </span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    {/* Benchmark marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                      style={{ left: `${metric.benchmark}%` }}
                      title={`Benchmark: ${metric.benchmark}`}
                    />
                    {/* Value bar */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-[#EA1A85] to-[#F59E0B]"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Pressure Match Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-[#EA1A85]" />
              Signature High-Leverage Performances
            </h4>
            
            <div className="space-y-2.5">
              {scoutingReport.recentHighlights.map((hl, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{hl.match}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-semibold">
                      {hl.tournament}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-[#F59E0B]">{hl.performance}</p>
                  <p className="text-[11px] text-slate-400">{hl.context}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 bg-[#0F172A] p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Bid Ceiling</span>
            <span className="text-base font-black font-mono text-[#F59E0B]">
              ₹{player.recommendedMaxBid.toFixed(2)} Cr
              <span className="text-xs text-slate-500 font-normal ml-1"> (Base: ₹{player.basePrice.toFixed(2)} Cr)</span>
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
            {isSelectedForAuction ? 'Remove from Simulator' : 'Target for RR Squad (+)'}
          </button>
        </div>

      </aside>
    </div>
  );
}
