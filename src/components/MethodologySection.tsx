'use client';

import React, { useState } from 'react';
import { HL_PRS_V7_DOCUMENTATION, RR_5_SQUAD_GAPS } from '@/data/players';
import { CheckCircle2, ShieldCheck, Zap, Target } from 'lucide-react';

export default function MethodologySection() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  const stages = HL_PRS_V7_DOCUMENTATION.pipelineStages;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gradient-to-r from-[#EA1A85] to-[#2563EB] px-2.5 py-0.5 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            HL-PRS v7 Pipeline Specification
          </span>
          <span className="text-xs text-slate-400 font-mono">
            T20-Only Strict Engine • 7,824 Players Evaluated
          </span>
        </div>
        <h2 className="mt-2 text-xl font-black text-white tracking-tight">
          Hierarchical Leverage-Weighted Pressure Rating System (HL-PRS v7)
        </h2>
        <p className="text-xs text-slate-300 max-w-4xl mt-1 leading-relaxed">
          The official 6-stage mathematical framework built for the Rajasthan Royals SupeRR Selector Season 2 challenge. Evaluates context-weighted T20 performance, isolates true clutch match-winners from stat-padders, corrects legacy database bugs, and optimizes bidding for the IPL 2027 auction.
        </p>
      </div>

      {/* Stage Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {stages.map((st, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStageIdx(idx)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeStageIdx === idx
                ? 'bg-gradient-to-r from-[#EA1A85] to-[#D01474] text-white shadow-md shadow-[#EA1A85]/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              {idx + 1}
            </span>
            <span>{st.stage.split(': ')[1] || st.stage}</span>
          </button>
        ))}
      </div>

      {/* Detailed Content for Selected Stage */}
      <div className="rounded-xl border border-slate-800 bg-[#1E293B]/70 p-6 shadow-xl space-y-6">
        
        {/* STAGE 1: Forensic Data Cleaning */}
        {activeStageIdx === 0 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EA1A85] uppercase tracking-wider">
                STAGE 1 SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Forensic Data Cleaning &amp; Pre-Processing
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Before applying mathematical weighting, the raw relational datasets were audited to eliminate duplication anomalies and fractional over errors:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                  <CheckCircle2 className="h-4 w-4" />
                  1. Super Over Nx Multiplication Fix
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Grouped <code className="text-emerald-300">player_match_stats.csv</code> by <code className="text-emerald-300">(match_id, player_id)</code> to count duplicate rows (<code className="text-emerald-300">dup_N</code>). Across all 16 Super Over matches, divided runs, balls, fours, and sixes by <code className="text-emerald-300">dup_N</code> before deduplicating (<code className="text-emerald-300">keep=&apos;last&apos;</code>). Prevents 2x and 3x artificial stat inflation.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                  <CheckCircle2 className="h-4 w-4" />
                  2. Base-10 Fractional Over Fix (4.1+ Overs)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Completely discarded the pre-computed <code className="text-rose-300">economy_rate</code> column. Converted <code className="text-emerald-300">overs_bowled</code> to true legal deliveries:
                  <br />
                  <code className="text-[#F59E0B] font-mono mt-1 block">legal_balls = min(24, int(overs)*6 + round((overs - int(overs))*10))</code>
                </p>
              </div>

              <div className="rounded-xl border border-blue-900/40 bg-blue-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                  <ShieldCheck className="h-4 w-4" />
                  3. Stage String Hygiene &amp; True Knockouts
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Stripped trailing whitespaces in <code className="text-blue-300">matches.csv</code> stage names (e.g. merging <code className="text-blue-300">&apos;Quarter Final &apos;</code> into <code className="text-blue-300">&apos;Quarter Final&apos;</code>). Defined <code className="text-[#EA1A85] font-mono">is_true_knockout = 1</code> strictly for elimination games (Final, Qualifier, Semi Final, Eliminator, Quarter Final), strictly excluding &apos;Super 4&apos; round-robins.
                </p>
              </div>

              <div className="rounded-xl border border-blue-900/40 bg-blue-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                  <ShieldCheck className="h-4 w-4" />
                  4. Relational Team Resolution &amp; T20 Strictness
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Joined <code className="text-blue-300">player_competition_team_mapping.csv</code> on <code className="text-blue-300">(player_id, comp_id)</code> to map home/away team contexts. Filtered strictly for T20, T20I, and official state T20 leagues, strictly excluding U19/Youth ODIs and List-A matches from numeric scores.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: Multiplicative Match Leverage */}
        {activeStageIdx === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EA1A85] uppercase tracking-wider">
                STAGE 2 SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Multiplicative Match Leverage Weight (L_i)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Every T20 appearance receives a continuous leverage multiplier compounding competition prestige, tournament stage, and in-match crisis:
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-center text-sm font-bold text-[#F59E0B]">
              L_i = W_comp,i × M_stage,i × M_situation,i
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
                <h4 className="font-bold text-white uppercase text-[11px] text-blue-400">Strict Competition Hierarchy (W_comp)</h4>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li><strong className="text-white font-mono">1.35x:</strong> ICC T20 World Cup &amp; Asia Cup</li>
                  <li><strong className="text-white font-mono">1.25x:</strong> Full-Member Bilateral T20I</li>
                  <li><strong className="text-white font-mono">1.15x:</strong> Indian Premier League (IPL)</li>
                  <li><strong className="text-white font-mono">1.00x:</strong> Emerging Teams Asia Cup &amp; A Teams</li>
                  <li><strong className="text-white font-mono">0.95x:</strong> SA20, BBL, CPL, PSL, Blast, ILT20, MLC</li>
                  <li><strong className="text-white font-mono">0.82x:</strong> Syed Mushtaq Ali Trophy (SMAT Elite)</li>
                  <li><strong className="text-white font-mono">0.70x:</strong> State Leagues (TNPL, UP T20, DPL, etc.)</li>
                  <li><strong className="text-white font-mono">0.58x:</strong> Regional Domestic / SMAT Plate</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
                <h4 className="font-bold text-white uppercase text-[11px] text-amber-400">Stage Multipliers (M_stage)</h4>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li><strong className="text-white font-mono">1.50x:</strong> Tournament Final</li>
                  <li><strong className="text-white font-mono">1.35x:</strong> Semi Final / Qualifier / Eliminator</li>
                  <li><strong className="text-white font-mono">1.25x:</strong> Quarter Final</li>
                  <li><strong className="text-white font-mono">1.10x:</strong> Super 4 Round Robin</li>
                  <li><strong className="text-white font-mono">1.00x:</strong> Group / League Stage</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
                <h4 className="font-bold text-white uppercase text-[11px] text-emerald-400">Crisis Situation Boosts (M_situation)</h4>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li><strong className="text-white font-mono">+0.55:</strong> Severe Collapse (3 top-5 out &le;10)</li>
                  <li><strong className="text-white font-mono">+0.55:</strong> Winning 200+ Target Chase</li>
                  <li><strong className="text-white font-mono">+0.55:</strong> Winning Low-Total Defense (&le;160)</li>
                  <li><strong className="text-white font-mono">+0.45:</strong> Ultra-Close (&le;5 runs / &le;2 wkts)</li>
                  <li><strong className="text-white font-mono">+0.35:</strong> Flat-Track Shootout (Par &ge;9.20 RPO)</li>
                  <li><strong className="text-white font-mono">+0.20:</strong> Player of the Match (POTM)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: Empirical Bayes Shrinkage */}
        {activeStageIdx === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EA1A85] uppercase tracking-wider">
                STAGE 3 SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Empirical Bayes Shrinkage &amp; Asymmetric Baseline Protection
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Isolates high-pressure appearances and shrinks small sample sizes toward universal T20 priors using Bayesian pseudocounts:
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-center text-xs sm:text-sm font-bold text-[#F59E0B] overflow-x-auto">
              EB_Avg_w = (R_w + 12·k_m·24.5) / (O_w + 12·k_m) &nbsp;&nbsp;|&nbsp;&nbsp; EB_SR_w = ((R_w + 1.5·k_m·135.5) / (B_w + 150·k_m)) × 100
            </div>

            <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-blue-400 uppercase text-xs flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Asymmetric Baseline Protection Rule
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Elite global stars (e.g., Suryakumar Yadav, Jos Buttler) who maintain an elite absolute pressure floor (<code className="text-white font-bold font-mono">Pressure Avg &ge; 30.0</code>, <code className="text-white font-bold font-mono">Pressure SR &ge; 148.0</code>, and <code className="text-white font-bold font-mono">P_pad &lt; 0.5</code>) are never penalized with a negative relative delta (Delta = Pressure - Usual). They receive positive pressure elevation bonuses while rewarding their unmatched match consistency.
              </p>
            </div>
          </div>
        )}

        {/* STAGE 4: Habitual Knockout Flop Penalty */}
        {activeStageIdx === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EA1A85] uppercase tracking-wider">
                STAGE 4 SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Habitual Knockout Flop Penalty (-P_flop)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Identifies players with repeated failure in true elimination games (Final, Qualifier, Semi Final, Eliminator, Quarter Final):
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-center text-xs sm:text-sm font-bold text-rose-400 overflow-x-auto">
              P_flop = min(14.0, 0.85·∑ S_flop + 6.0·max(0, R_flop - 0.38)·√(N_KO) - 1.5·N_KO_Hero)
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>• <strong>Batting Flop:</strong> Top-7 batter dismissed for &le;15 runs in a true knockout (severity 1.25x if &lt;10 runs; 0.75x if 10–15 runs).</p>
              <p>• <strong>Bowling Flop:</strong> Bowler (&ge;6 legal balls) conceding &ge;9.50 RPO with &le;1 wicket (severity 1.25x if &ge;11.0 RPO and 0 wickets).</p>
              <p>• <strong>Trigger Threshold:</strong> Applied strictly when a player has &ge;3 knockout matches and a Flop Rate R_flop &ge; 45% with sub-25 average or &ge;8.50 economy.</p>
            </div>
          </div>
        )}

        {/* STAGE 5: Stat-Padding & Slow Anchor Penalty */}
        {activeStageIdx === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EA1A85] uppercase tracking-wider">
                STAGE 5 SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Rate-Normalized Stat-Padding &amp; Slow-Anchor Penalty (-P_pad)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Detects sluggish innings that harm the team&apos;s win probability while building deceptive raw run totals:
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-center text-xs sm:text-sm font-bold text-amber-400 overflow-x-auto">
              P_pad = min(14.0, 0.22·max(0, R_slow - 20%) + 0.65·max(0, R_loss - 4%) + 2.0·max(0, Cost - 1.0) + 0.45·max(0, 138 - SR_career))
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>• <strong>Slow-Anchor Knock:</strong> Batter faces &ge;20 balls and strikes at &le; -12.0 SR points below match par (or &lt;128.0 SR when match par &ge;132.0).</p>
              <p>• <strong>Stat-Pad Loss:</strong> Slow-anchor knock of 25+ runs that results in the batter&apos;s team losing the match.</p>
              <p>• <strong>Run Cost:</strong> Difference between runs scored and runs expected at match par rate.</p>
            </div>
          </div>
        )}

        {/* STAGE 6: Log Volume Bonus & Final Composite */}
        {activeStageIdx === 5 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EA1A85] uppercase tracking-wider">
                STAGE 6 SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Logarithmic Pressure Volume Bonus (+B_vol) &amp; Final Composite
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Rewards extensive high-pressure samples (N_press) and high-impact match interventions (N_impact):
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-center text-xs sm:text-sm font-bold text-emerald-400 overflow-x-auto">
              B_vol = 1.35·ln(1 + N_press / 8) + 0.65·ln(1 + N_impact / 5)
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-center text-xs sm:text-sm font-bold text-white overflow-x-auto">
              Final HL-PRS v7 = Base HL-PRS - P_flop - P_pad + B_pedigree + B_vol
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-white uppercase text-xs">Two Dedicated Output Boards Generated:</h4>
              <p>1. <strong>All-Player Open Top 20 Batters &amp; Bowlers:</strong> Global benchmark ranking featuring international and IPL stars (Suryakumar Yadav, Heinrich Klaasen, Jasprit Bumrah, Rashid Khan, Wanindu Hasaranga, Jos Buttler) incorporating 2026 World Cup &amp; IPL records.</p>
              <p>2. <strong>Rajasthan Royals IPL 2027 Auction Target Board:</strong> Strictly filtered for players officially Released on Nov 17, 2026 and Uncontracted Indian Domestic Gems mapped strictly to RR&apos;s 5 open squad gaps (excluding redundant openers and left-arm orthodox spinners).</p>
            </div>
          </div>
        )}

      </div>

      {/* Rajasthan Royals 5 Squad Gaps Mapping */}
      <div className="rounded-xl border border-slate-800 bg-[#1E293B]/70 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#EA1A85]" />
            <h3 className="text-sm font-bold text-white">Rajasthan Royals 5 Squad Gaps Ahead of IPL 2027</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Excludes redundant openers &amp; left-arm spinners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {RR_5_SQUAD_GAPS.map(gap => (
            <div key={gap.id} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{gap.gapName}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  gap.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {gap.urgency}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{gap.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
