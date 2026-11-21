'use client';

import React from 'react';
import {
  Flame,
  Shield,
  Target,
  Database,
  Crown
} from 'lucide-react';

export default function KPISummaryStrip() {
  const kpis = [
    {
      id: 'kpi-scope',
      label: 'HIGH-PRESSURE EVENTS ANALYZED',
      value: '109,564',
      subtext: '5,086 Matches • 287 Tournaments',
      highlight: '3 Super Over Bugs Fixed',
      icon: Database,
      accentColor: 'text-[#38BDF8]',
      sparkColor: 'bg-[#38BDF8]',
      sparkHeights: [30, 45, 60, 40, 85, 70, 95]
    },
    {
      id: 'kpi-batter',
      label: '#1 PRESSURE BATTER',
      value: 'Vaibhav Suryavanshi',
      subtext: '97.19 HL-PRS • 228.5 Pressure SR',
      highlight: 'RR Retained Prodigy (MVP 2026)',
      icon: Flame,
      crown: true,
      accentColor: 'text-[#EA1A85]',
      sparkColor: 'bg-[#EA1A85]',
      sparkHeights: [40, 55, 70, 80, 90, 85, 100]
    },
    {
      id: 'kpi-bowler',
      label: '#1 PRESSURE BOWLER',
      value: 'Jasprit Bumrah',
      subtext: '92.71 HL-PRS • 6.82 Pressure Econ',
      highlight: '0.0% KO Flop • 2026 WC POTM',
      icon: Shield,
      crown: true,
      accentColor: 'text-[#D4AF37]',
      sparkColor: 'bg-[#D4AF37]',
      sparkHeights: [85, 90, 75, 95, 80, 100, 92]
    },
    {
      id: 'kpi-target',
      label: 'TOP RELEASED RR AUCTION TARGET',
      value: 'Mitchell Owen & Hasaranga',
      subtext: '₹27.05 Cr Purse • 6 Open Slots',
      highlight: 'Solves 5 RR Squad Gaps',
      icon: Target,
      accentColor: 'text-emerald-400',
      sparkColor: 'bg-emerald-400',
      sparkHeights: [50, 65, 45, 75, 85, 60, 90]
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.id}
            className="group relative rounded-2xl border border-[#EA1A85]/20 bg-[#112240] p-4 shadow-xl backdrop-blur-md transition-all hover:border-[#EA1A85]/60 hover:shadow-2xl border-t-[3px] border-t-[#EA1A85] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 ${kpi.accentColor}`} />
                  {kpi.label}
                </span>

                {kpi.crown && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    <Crown className="h-3 w-3" />
                  </span>
                )}
              </div>

              {/* Big Metric Value */}
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <h3 className="font-mono text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#EA1A85] transition-colors truncate">
                  {kpi.value}
                </h3>
              </div>

              {/* Subtext */}
              <p className="text-xs text-slate-300 font-medium mt-1">
                {kpi.subtext}
              </p>
            </div>

            {/* Bottom: Sparkline + Highlight Tag */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-800">
                {kpi.highlight}
              </span>

              {/* Mini Sparkline Bars */}
              <div className="flex items-end gap-1 h-5 shrink-0">
                {kpi.sparkHeights.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1 rounded-t-sm ${kpi.sparkColor} opacity-70 group-hover:opacity-100 transition-opacity`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
