'use client';

import React, { useState } from 'react';
import {
  FORENSIC_BUGS_LIST,
  KNOCKOUT_FLOP_LEADERBOARD,
  STAT_PADDING_LEADERBOARD,
  ForensicBugAudit,
  FlopPenaltyPlayer,
  StatPadPlayer
} from '@/data/players';
import {
  Database,
  Flame,
  CheckCircle2,
  AlertOctagon,
  FileText
} from 'lucide-react';

export default function ForensicAuditView() {
  const [activeSection, setActiveSection] = useState<'bugs' | 'flops' | 'padding'>('bugs');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-[#0F172A] p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              Dataset Forensics & Integrity
            </span>
            <span className="text-xs text-slate-400">Audited 109,733 Match Stats Rows</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-2">
            Forensic Data Audit & Penalty Verification
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Detailed inspection of the 3 critical upstream database bugs corrected before model training, alongside verified deductions for habitual elimination flops (-P_flop) and losing-cause stat-padding (-P_pad).
          </p>
        </div>

        {/* Section Navigation Buttons */}
        <div className="flex items-center rounded-xl bg-slate-900/90 p-1.5 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSection('bugs')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'bugs'
                ? 'bg-[#EA1A85] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>3 Critical Bug Fixes</span>
          </button>
          <button
            onClick={() => setActiveSection('flops')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'flops'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Knockout Flops (-P_flop)</span>
          </button>
          <button
            onClick={() => setActiveSection('padding')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'padding'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Stat-Padding (-P_pad)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 3 CRITICAL BUG FIXES */}
      {activeSection === 'bugs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORENSIC_BUGS_LIST.map((bug: ForensicBugAudit, idx: number) => (
              <div
                key={bug.id}
                className="rounded-2xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-xs font-bold text-blue-400 border border-blue-500/30">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {bug.affectedRows}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mt-3">
                    {bug.bugName}
                  </h3>
                  
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {bug.description}
                  </p>

                  <div className="mt-4 p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200">
                    <span className="font-bold text-rose-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                      Real-World Damage:
                    </span>
                    {bug.realWorldImpact}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
                    <span className="font-bold text-emerald-400 block mb-0.5 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      HL-PRS v7 Forensic Fix:
                    </span>
                    {bug.fixApplied}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Deep Dive Scorecard Case Study */}
          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-6 shadow-xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#EA1A85]" />
              <span>Scorecard Walkthrough: Fixing Match 28962 (India vs Afghanistan, Double Super Over)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4 text-xs space-y-2">
                <span className="font-bold text-rose-400 uppercase text-[11px] block">
                  Raw Corrupted Dataset State:
                </span>
                <p className="text-slate-300">
                  Because of the Super Over N× Multiplication Bug, Rinku Singh appeared with 3 duplicate rows recording <strong>207 runs off 117 balls</strong> in each row. Rohit Sharma appeared with 2 duplicate rows recording <strong>242 runs off 138 balls</strong>.
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-rose-300">
                  SELECT match_id, player_id, runs_scored, balls_faced FROM stats WHERE match_id=28962;
                  <br />→ Rinku: 207 (117b) × 3 rows [Distorted career SR to absurd small-sample bias]
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 text-xs space-y-2">
                <span className="font-bold text-emerald-400 uppercase text-[11px] block">
                  Post-Deduplication Verified Reality:
                </span>
                <p className="text-slate-300">
                  By grouping by <code>(match_id, player_id)</code> and dividing <code>runs_scored</code> and <code>balls_faced</code> by <code>dup_N</code>, our pipeline restored Rinku Singh&apos;s authentic <strong>69* off 39 balls</strong> from 22/4 and Rohit&apos;s <strong>121* off 69 balls</strong>.
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300">
                  Fixed True Line: Rinku Singh 69* (39) | Leverage Multiplier Li = 2.50×
                  <br />(Severe Collapse 22/4 [+0.55] + Tied Thriller Double Super Over [+0.45])
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: KNOCKOUT FLOP DEDUCTION */}
      {activeSection === 'flops' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
                  Stage 4 Formula: -P_flop
                </span>
                <h3 className="font-bold text-white text-base">
                  Habitual Elimination Knockout Flop Leaderboard
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Deducts up to <strong>-14.00 points</strong> for batters dismissed for $\le 15$ runs and bowlers conceding $\ge 9.50$ RPO with $\le 1$ wicket in $\ge 45\%$ of true tournament knockouts (Finals, Qualifiers, Eliminators, Semi-Finals).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Rank</th>
                    <th className="py-3 px-4 font-semibold">Player Name</th>
                    <th className="py-3 px-4 font-semibold">Franchise</th>
                    <th className="py-3 px-4 font-semibold text-center">True KO Inns</th>
                    <th className="py-3 px-4 font-semibold text-center">KO Failures (&le;15r)</th>
                    <th className="py-3 px-4 font-semibold text-center">Flop Rate</th>
                    <th className="py-3 px-4 font-semibold text-center">Penalty Deducted</th>
                    <th className="py-3 px-4 font-semibold">Notable Elimination Failures</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {KNOCKOUT_FLOP_LEADERBOARD.map((p: FlopPenaltyPlayer) => (
                    <tr key={p.player_name} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                        #{p.rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {p.player_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.team}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-slate-300">
                        {p.ko_inns}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-rose-400 font-bold">
                        {p.ko_failures}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center font-bold text-rose-400">
                        {p.flop_rate}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center font-black text-rose-400 bg-rose-950/20">
                        {p.p_flop_deduction}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-md">
                        {p.notable_failures}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: STAT-PADDING PENALTY */}
      {activeSection === 'padding' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                  Stage 5 Formula: -P_pad
                </span>
                <h3 className="font-bold text-white text-base">
                  Rate-Normalized Stat-Padding & Slow-Anchor Deductions
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Penalizes batters who soak up $\ge 20$ balls striking at $\ge 12.0$ SR points below match par, or compile $25+$ runs at low velocity in team defeats.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Rank</th>
                    <th className="py-3 px-4 font-semibold">Player Name</th>
                    <th className="py-3 px-4 font-semibold">Team</th>
                    <th className="py-3 px-4 font-semibold text-center">Slow 20+ Ball Knocks</th>
                    <th className="py-3 px-4 font-semibold text-center">In Team Defeats</th>
                    <th className="py-3 px-4 font-semibold text-center">Career SR</th>
                    <th className="py-3 px-4 font-semibold text-center">Penalty Deducted</th>
                    <th className="py-3 px-4 font-semibold">Cricketing Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {STAT_PADDING_LEADERBOARD.map((p: StatPadPlayer) => (
                    <tr key={p.player_name} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        #{p.rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {p.player_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.team}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-slate-300">
                        {p.slow_20b_knocks}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-amber-400 font-bold">
                        {p.slow_knocks_in_losses}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-slate-300">
                        {p.career_sr}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center font-black text-amber-400 bg-amber-950/20">
                        {p.p_pad_deduction}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-md">
                        {p.cricketing_analysis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
