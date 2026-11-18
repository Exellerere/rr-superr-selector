'use client';

import React, { useState } from 'react';
import { SCORING_METHODOLOGY } from '@/data/players';
import { BookOpen, Database, ChevronDown, ChevronRight, Calculator, Sliders } from 'lucide-react';

export default function MethodologySection() {
  const [activeTab, setActiveTab] = useState<string>('pressure-index');
  const [showSwapGuide, setShowSwapGuide] = useState<boolean>(true);

  const currentSection = SCORING_METHODOLOGY.find(s => s.id === activeTab) || SCORING_METHODOLOGY[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Calculator className="h-3.5 w-3.5" />
            Empirical Cricket Science
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Bayesian Leverage & Replacement-Level Valuation
          </span>
        </div>
        <h2 className="mt-2 text-xl font-black text-white tracking-tight">
          Methodology & Model Architecture
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
          How our talent scouting engine synthesizes ball-by-ball tournament telemetry into context-weighted Pressure Ratings and auction valuation caps for Rajasthan Royals.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {SCORING_METHODOLOGY.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === section.id
                ? 'bg-gradient-to-r from-[#EA1A85] to-[#D01474] text-white shadow-md shadow-[#EA1A85]/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{section.title.split('. ')[1] || section.title}</span>
          </button>
        ))}
      </div>

      {/* Selected Section Content */}
      <div className="rounded-xl border border-slate-800 bg-[#1E293B]/70 p-6 shadow-xl space-y-6">
        <div>
          <span className="text-[11px] font-mono text-[#F59E0B] uppercase font-bold tracking-wider">
            {currentSection.subtitle}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            {currentSection.title}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {currentSection.description}
          </p>
        </div>

        {/* Mathematical Formula Card */}
        {currentSection.formulaLatex && (
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/80 p-4 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
              <span className="font-mono text-slate-400 font-semibold">FORMULA SPECIFICATION</span>
              <span className="rounded bg-[#EA1A85]/20 px-2 py-0.5 text-[10px] font-bold text-[#EA1A85]">
                Algorithmic Core
              </span>
            </div>
            
            {/* Display Formula */}
            <div className="my-3 overflow-x-auto py-2 text-center">
              <code className="text-sm sm:text-base font-mono font-bold text-[#F59E0B] tracking-wide">
                {currentSection.formulaLatex}
              </code>
            </div>

            {/* Variable Breakdown */}
            <div className="mt-3 pt-3 border-t border-slate-900 space-y-1.5 text-xs text-slate-300">
              <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
                Variable Definitions & Mechanics:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-400">
                {currentSection.formulaExplanation.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#EA1A85] font-bold">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Key Model Parameters Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#EA1A85]" />
            Calibrated Model Hyperparameters
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentSection.keyParameters.map((param, idx) => (
              <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">{param.name}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{param.role}</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-1 text-xs font-mono font-bold text-[#F59E0B] border border-slate-700 shrink-0">
                  {param.weight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Replacement / Integration Guide (Collapsible) */}
      <div className="rounded-xl border border-slate-800 bg-[#1E293B]/70 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowSwapGuide(!showSwapGuide)}
          className="w-full flex items-center justify-between p-5 text-left bg-slate-900/60 hover:bg-slate-900/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Developer Guide: How to Swap with Custom CSV / JSON Datasets</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Modular & Decoupled
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                All data resides cleanly in <code className="text-slate-200">src/data/players.ts</code> with zero UI coupling
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {showSwapGuide ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </button>

        {showSwapGuide && (
          <div className="p-5 border-t border-slate-800 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EA1A85] text-white font-bold text-[10px] mb-2">1</span>
                <h5 className="font-bold text-white">Export from Python / R</h5>
                <p className="text-slate-400 mt-1 text-[11px]">
                  Export your domestic ball-by-ball model predictions to a JSON array matching the <code className="text-emerald-400">Player</code> interface.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EA1A85] text-white font-bold text-[10px] mb-2">2</span>
                <h5 className="font-bold text-white">Update src/data/players.ts</h5>
                <p className="text-slate-400 mt-1 text-[11px]">
                  Paste your output directly into <code className="text-emerald-400">UNCAPPED_PLAYERS</code>. TypeScript will automatically validate all fields at compile-time.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EA1A85] text-white font-bold text-[10px] mb-2">3</span>
                <h5 className="font-bold text-white">Build & Verify Zero Errors</h5>
                <p className="text-slate-400 mt-1 text-[11px]">
                  Run <code className="text-slate-200">npm run build</code>. The charts, table, and budget simulator will automatically render your live data.
                </p>
              </div>
            </div>

            {/* Code snippet example */}
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-[11px] overflow-x-auto">
              <div className="text-slate-500 mb-2"># Python pandas to TypeScript JSON snippet</div>
              <pre className="text-slate-300">
{`# In your Python Jupyter Notebook or scouting pipeline:
df = pd.read_csv('smat_vht_leverage_scores.csv')
df['clutchPressureRating'] = df['wpa_leverage_score'].round(1)
df['recommendedMaxBid'] = df['valuation_inr_cr'].round(2)

# Export directly for the RR SupeRR Selector web app:
df.head(10).to_json('src/data/players.json', orient='records')`}
              </pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
