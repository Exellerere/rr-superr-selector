'use client';

import React from 'react';
import { Users, Crosshair, Zap, DollarSign } from 'lucide-react';
import { EXECUTIVE_KPIS } from '@/data/players';

interface ExecutiveKPICardsProps {
  selectedPlayersCount: number;
  totalAllocatedBudget: number;
  avgSelectedPressure: number;
}

export default function ExecutiveKPICards({
  selectedPlayersCount,
  totalAllocatedBudget,
  avgSelectedPressure,
}: ExecutiveKPICardsProps) {
  const cards = [
    {
      id: 'total-analyzed',
      title: 'Total Domestic Players Analyzed',
      value: EXECUTIVE_KPIS.totalDomesticPlayersAnalyzed.toLocaleString(),
      subtext: 'Scouted across SMAT, VHT, DPL, Ranji & U19',
      badge: 'Tier-1 Coverage',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: Users,
      iconColor: 'text-blue-400',
      accentGlow: 'hover:border-blue-500/40',
      metricDetail: '842 players -> 10 elite targets',
      statChange: '+14% data volume vs 2025'
    },
    {
      id: 'shortlist',
      title: 'Top Uncapped Shortlist',
      value: `${selectedPlayersCount} / ${EXECUTIVE_KPIS.shortlistCount}`,
      subtext: 'High-conviction recruits tailored for RR squad holes',
      badge: '99th Percentile',
      badgeColor: 'bg-[#EA1A85]/15 text-[#EA1A85] border-[#EA1A85]/30',
      icon: Crosshair,
      iconColor: 'text-[#EA1A85]',
      accentGlow: 'hover:border-[#EA1A85]/50 glow-pink',
      metricDetail: 'Tactical role coverage: 6/6 key areas',
      statChange: '100% video & ball-tracking verified'
    },
    {
      id: 'pressure-score',
      title: 'Avg. Pressure Impact Score',
      value: `${(avgSelectedPressure || EXECUTIVE_KPIS.avgPressureImpactScore).toFixed(1)} / 100`,
      subtext: 'Weighted Win Probability Added (WPA) under leverage',
      badge: 'Clutch Tested',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: Zap,
      iconColor: 'text-emerald-400',
      accentGlow: 'hover:border-emerald-500/40',
      metricDetail: '+26.4 pts above domestic median (63.2)',
      statChange: 'Death phase multiplier 1.45x'
    },
    {
      id: 'purse-allocation',
      title: 'Target Auction Purse Allocation',
      value: `₹${totalAllocatedBudget.toFixed(2)} Cr`,
      subtext: `Projected budget of ₹${EXECUTIVE_KPIS.totalPurseBudget.toFixed(2)} Cr remaining purse`,
      badge: `${((totalAllocatedBudget / EXECUTIVE_KPIS.totalPurseBudget) * 100).toFixed(0)}% Purse Cap`,
      badgeColor: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
      icon: DollarSign,
      iconColor: 'text-[#F59E0B]',
      accentGlow: 'hover:border-[#F59E0B]/50 glow-gold',
      metricDetail: `₹${(EXECUTIVE_KPIS.totalPurseBudget - totalAllocatedBudget).toFixed(2)} Cr reserve for Overseas/Marquee`,
      statChange: 'Value-optimized cap model'
    }
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-[#1E293B]/90 p-5 shadow-lg transition-all duration-300 ${card.accentGlow}`}
          >
            {/* Ambient Background Gradient Accent */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-700/20 blur-2xl group-hover:bg-[#EA1A85]/10 transition-colors" />

            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-700/50">
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{card.title}</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-white font-mono">{card.value}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-1">{card.subtext}</p>
            </div>

            <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">{card.metricDetail}</span>
              <span className="text-slate-500 hidden sm:inline">{card.statChange}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
