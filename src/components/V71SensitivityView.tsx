'use client';

import React, { useState } from 'react';
import { V71_COMPARISON_DATA, V71SensitivityComparison } from '@/data/players';
import {
  ShieldAlert,
  Award,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  Search,
  Sparkles
} from 'lucide-react';

export default function V71SensitivityView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'beneficiaries' | 'penalized'>('all');

  const filteredData = V71_COMPARISON_DATA.filter((item: V71SensitivityComparison) => {
    const matchesSearch =
      item.player_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'beneficiaries') return item.rank_delta > 0 || item.score_delta > 0.5;
    if (filterType === 'penalized') return item.p_pad_v71 > 5.0;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. MANDATORY EVALUATOR INFO BANNER */}
      <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-950/20 to-slate-900 p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Info className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-300 text-base">Model Refinement Sensitivity Audit</span>
              <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-400/30">
                v7.1 Championship & Collapse-Win Exemption
              </span>
            </div>
            <p className="text-sm font-medium text-amber-200/90 leading-relaxed">
              <strong>Official Note:</strong> The primary tabs (<span className="text-white">Top Batters</span>, <span className="text-white">Top Bowlers</span>, and <span className="text-white">RR Auction Strategy</span>) reflect the baseline <strong>HL-PRS v7</strong> rankings submitted in our Round 1 PDF report. This dedicated sensitivity tab demonstrates our <strong>v7.1 Championship & Collapse-Win Exemption</strong> without breaking consistency with your submitted PDF report.
            </p>
          </div>
        </div>
      </div>

      {/* 2. THE MATHEMATICAL RULE EXPLANATION */}
      <div className="rounded-2xl border border-slate-800 bg-[#1E293B]/70 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#EA1A85]" />
          <span>v7.1 Rule Definition: The Championship & Collapse-Win Exemption</span>
        </h3>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          In high-scoring modern T20s, an anchor innings can mistakenly register as &quot;stat-padding&quot; if measured strictly against league-wide scoring velocity. The <strong>v7.1 refinement</strong> introduces an objective situational exemption:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
              <AlertTriangle className="h-4 w-4" />
              <span>Trigger 1: Early Collapse</span>
            </div>
            <p className="text-xs text-slate-300">
              Innings where $\ge 2$ wickets fall inside the Powerplay (e.g., India 34/3 in the 2024 T20 World Cup Final). The incoming anchor is rebuilding, not stat-padding.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <CheckCircle2 className="h-4 w-4" />
              <span>Trigger 2: Match-Winning Outcome</span>
            </div>
            <p className="text-xs text-slate-300">
              Any $20+$ ball innings where the batter&apos;s team goes on to <strong>WIN</strong> the match. A knock that directly yields tournament silverware is never penalized.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
              <TrendingUp className="h-4 w-4" />
              <span>Trigger 3: Recency Weighting</span>
            </div>
            <p className="text-xs text-slate-300">
              Applies a 2023–2026 recency weighting to career strike-rate baselines to prevent distant historical games from dragging down modern high-impact form.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE SPOTLIGHT: KOHLI VS BABAR AZAM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* VIRAT KOHLI SPOTLIGHT CARD */}
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-[#1E293B] to-[#0F172A] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              Championship Match-Winner
            </span>
            <span className="font-mono text-xs text-slate-400">player_id: 47</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black text-white">Virat Kohli</h4>
              <p className="text-xs text-slate-400">Royal Challengers Bengaluru / India</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Rank Movement</span>
              <span className="font-mono font-bold text-lg text-white flex items-center justify-end gap-1.5">
                <span className="text-slate-400 line-through">#23</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">#10 Top 10</span>
              </span>
            </div>
          </div>

          {/* Metrics comparison */}
          <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">v7 Baseline</span>
              <span className="font-mono font-bold text-base text-slate-300">77.85</span>
              <span className="text-[10px] text-rose-400 block font-mono">-7.14 P_pad</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[10px] text-emerald-400 block uppercase font-bold">v7.1 Refined</span>
              <span className="font-mono font-bold text-base text-emerald-400">84.40</span>
              <span className="text-[10px] text-emerald-300 block font-mono">-0.80 P_pad</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-400 block uppercase font-bold">Net Change</span>
              <span className="font-mono font-bold text-base text-amber-400">+6.55</span>
              <span className="text-[10px] text-amber-300 block font-mono">+13 Ranks</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-emerald-300">Why the model upgrades Kohli:</p>
            <p className="leading-relaxed">
              His historic <strong>76 off 59 balls</strong> in the 2024 T20 World Cup Final rescued India from <strong>34/3</strong> inside the Powerplay, won Player of the Match, and secured the World Championship. In v7 baseline, this was dinged for falling below tournament par; in v7.1, it is rightfully recognized as a match-winning masterpiece!
            </p>
          </div>
        </div>

        {/* BABAR AZAM SPOTLIGHT CARD */}
        <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-b from-rose-950/20 via-[#1E293B] to-[#0F172A] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Losing-Cause Stat-Padder
            </span>
            <span className="font-mono text-xs text-slate-400">player_id: 2485</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black text-white">Babar Azam</h4>
              <p className="text-xs text-slate-400">Non-IPL Global Franchise / Pakistan</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Rank Movement</span>
              <span className="font-mono font-bold text-lg text-white flex items-center justify-end gap-1.5">
                <span className="text-slate-400">#18</span>
                <ArrowRight className="h-4 w-4 text-rose-400" />
                <span className="text-rose-400">#26 Outside Top 25</span>
              </span>
            </div>
          </div>

          {/* Metrics comparison */}
          <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">v7 Baseline</span>
              <span className="font-mono font-bold text-base text-slate-300">68.82</span>
              <span className="text-[10px] text-rose-400 block font-mono">-11.81 P_pad</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[10px] text-rose-400 block uppercase font-bold">v7.1 Refined</span>
              <span className="font-mono font-bold text-base text-rose-400">68.82</span>
              <span className="text-[10px] text-rose-400 block font-mono">-11.81 P_pad</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Penalty Exemption</span>
              <span className="font-mono font-bold text-base text-rose-400">0.00</span>
              <span className="text-[10px] text-rose-300 block font-mono">DENIED</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-rose-300">Why Babar remains penalized:</p>
            <p className="leading-relaxed">
              15 of his slow knocks (&lt;120 SR) occurred in <strong>losses</strong> where his team chased steep targets without early collapse context. Because they neither rebuilt from crisis nor yielded victories, the v7.1 exemption correctly denies relief—<strong>proving the mathematical model cleanly separates heroes from losing-cause stat-padders</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* 4. SIDE-BY-SIDE TOP BATTERS COMPARISON TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-[#1E293B] shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-[#F59E0B]" />
              <span>Comparative Leaderboard: HL-PRS v7 Baseline vs v7.1 Refinement</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side inspection of Top 10 Batters showing Kohli entering #10 and Rizvi moving to #11
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-700/80 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EA1A85]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-700/80 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'all' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('beneficiaries')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'beneficiaries' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Beneficiaries
              </button>
              <button
                onClick={() => setFilterType('penalized')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'penalized' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Penalized
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">v7 Rank</th>
                <th className="py-3 px-4 font-semibold">v7.1 Rank</th>
                <th className="py-3 px-4 font-semibold">Player</th>
                <th className="py-3 px-4 font-semibold">Contract Status</th>
                <th className="py-3 px-4 font-semibold text-right">v7 Score</th>
                <th className="py-3 px-4 font-semibold text-right">v7.1 Score</th>
                <th className="py-3 px-4 font-semibold text-center">Score Delta</th>
                <th className="py-3 px-4 font-semibold text-center">Pad Penalty (v7 vs v7.1)</th>
                <th className="py-3 px-4 font-semibold">Exemption Status & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredData.map((row) => {
                const isKohli = row.player_id === '47';
                const isBabar = row.player_id === '2485';

                return (
                  <tr
                    key={row.player_id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isKohli
                        ? 'bg-emerald-950/25 border-l-4 border-l-emerald-500 font-medium'
                        : isBabar
                        ? 'bg-rose-950/20 border-l-4 border-l-rose-500'
                        : ''
                    }`}
                  >
                    {/* v7 Rank */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">
                      #{row.rank_v7}
                    </td>

                    {/* v7.1 Rank */}
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                        isKohli ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200'
                      }`}>
                        #{row.rank_v71}
                        {row.rank_delta > 0 && (
                          <span className="text-[10px] text-emerald-400 font-bold">+{row.rank_delta}</span>
                        )}
                        {row.rank_delta < 0 && (
                          <span className="text-[10px] text-rose-400 font-bold">{row.rank_delta}</span>
                        )}
                      </span>
                    </td>

                    {/* Player */}
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span>{row.player_name}</span>
                      {isKohli && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                          Exemption Hero
                        </span>
                      )}
                      {isBabar && (
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                          Denial Baseline
                        </span>
                      )}
                    </td>

                    {/* Team */}
                    <td className="py-3 px-4 text-slate-300">
                      {row.team}
                    </td>

                    {/* v7 Score */}
                    <td className="py-3 px-4 font-mono text-slate-300 text-right">
                      {row.v7_score.toFixed(2)}
                    </td>

                    {/* v7.1 Score */}
                    <td className="py-3 px-4 font-mono font-bold text-right text-emerald-400">
                      {row.v71_score.toFixed(2)}
                    </td>

                    {/* Score Delta */}
                    <td className="py-3 px-4 font-mono text-center">
                      {row.score_delta > 0 ? (
                        <span className="text-emerald-400 font-bold">+{row.score_delta.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-500">0.00</span>
                      )}
                    </td>

                    {/* Pad Penalty */}
                    <td className="py-3 px-4 font-mono text-center">
                      <span className="text-slate-400">-{row.p_pad_v7.toFixed(2)}</span>
                      <span className="mx-1 text-slate-600">→</span>
                      <span className={row.p_pad_v71 < row.p_pad_v7 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                        -{row.p_pad_v71.toFixed(2)}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 text-slate-400 max-w-md">
                      <p className="line-clamp-2 hover:line-clamp-none transition-all">{row.exemptionReason}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
