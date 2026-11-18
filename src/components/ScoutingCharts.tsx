'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Player, UNCAPPED_PLAYERS, SQUAD_GAPS } from '@/data/players';
import { Activity, BarChart3 } from 'lucide-react';

interface ScoutingChartsProps {
  onSelectPlayer: (player: Player) => void;
  selectedPlayerIds: string[];
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function ScoutingCharts({
  onSelectPlayer,
  selectedPlayerIds,
}: ScoutingChartsProps) {
  const isMounted = useIsClient();
  const [chartMode, setChartMode] = useState<'batters' | 'bowlers' | 'all'>('all');

  // Format data for Scatter Plot
  const scatterData = UNCAPPED_PLAYERS.map((p) => {
    const isBowler = p.runsOrWickets.includes('Wickets');
    return {
      id: p.id,
      name: p.name,
      role: p.role,
      isBowler,
      team: p.domesticTeam,
      // X-axis: Strike rate (for batters) or Inverted Economy (for bowlers)
      statValue: p.strikeRateOrEconomy,
      // Y-axis: Pressure Rating (0 - 100)
      pressureRating: p.clutchPressureRating,
      boundaryPct: p.boundaryPercentage,
      recBid: p.recommendedMaxBid,
      originalPlayer: p,
      // Dot size based on Rec Max Bid
      zSize: p.recommendedMaxBid * 30,
    };
  }).filter((p) => {
    if (chartMode === 'batters') return !p.isBowler;
    if (chartMode === 'bowlers') return p.isBowler;
    return true;
  });

  // Role Gap Bar Chart Data
  const squadGapChartData = SQUAD_GAPS.map((gap) => {
    return {
      roleCategory: gap.roleCategory,
      currentStrength: gap.currentStrength,
      targetGoal: 90, // ideal benchmark
      gapDeficit: 90 - gap.currentStrength,
      shortlistedCount: gap.shortlistedCount,
      urgency: gap.urgencyLevel,
    };
  });

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <div className="h-[400px] rounded-xl border border-slate-800 bg-[#1E293B]/70 animate-pulse flex items-center justify-center text-slate-500 text-xs">
          Loading Scouting Scatter Matrix...
        </div>
        <div className="h-[400px] rounded-xl border border-slate-800 bg-[#1E293B]/70 animate-pulse flex items-center justify-center text-slate-500 text-xs">
          Loading Squad Gap Analysis...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Scatter Plot - Performance vs Pressure Rating */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#EA1A85]" />
                  Clutch Pressure Index vs. Strike Rate / Economy
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Identifies undervalued high-leverage gems in top-right quadrant
                </p>
              </div>

              {/* Chart Filter Buttons */}
              <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900/90 p-0.5 text-xs">
                <button
                  onClick={() => setChartMode('all')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    chartMode === 'all' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All (10)
                </button>
                <button
                  onClick={() => setChartMode('batters')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    chartMode === 'batters' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Batters
                </button>
                <button
                  onClick={() => setChartMode('bowlers')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    chartMode === 'bowlers' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bowlers
                </button>
              </div>
            </div>

            {/* Quadrant Legend Strip */}
            <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Top Right: Elite High-Leverage Gems</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#F59E0B] font-medium">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                <span>Top Left: Clutch Specialists & Anchors</span>
              </div>
            </div>

            {/* Recharts Scatter Plot */}
            <div className="h-[320px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  
                  <XAxis
                    type="number"
                    dataKey="statValue"
                    name={chartMode === 'bowlers' ? 'Economy Rate' : 'Strike Rate / Economy'}
                    domain={chartMode === 'bowlers' ? [6, 9] : ['auto', 'auto']}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickFormatter={(v) => `${v}`}
                    label={{
                      value: chartMode === 'bowlers' ? 'Economy Rate (RPO)' : 'Strike Rate (Batters) / Economy (Bowlers)',
                      position: 'bottom',
                      offset: 0,
                      fill: '#94A3B8',
                      fontSize: 10,
                    }}
                  />
                  
                  <YAxis
                    type="number"
                    dataKey="pressureRating"
                    name="Pressure Rating"
                    domain={[86, 96]}
                    stroke="#94A3B8"
                    fontSize={11}
                    label={{
                      value: 'Clutch Pressure Score (0-100)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#94A3B8',
                      fontSize: 10,
                    }}
                  />

                  <ZAxis type="number" dataKey="zSize" range={[120, 420]} name="Max Bid" />

                  <ReferenceLine y={90} stroke="#EA1A85" strokeDasharray="4 4" label={{ value: 'Target 90+ PI', fill: '#EA1A85', fontSize: 10, position: 'right' }} />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as typeof scatterData[0];
                        return (
                          <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 shadow-2xl text-xs space-y-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-white text-sm">{data.name}</span>
                              <span className="rounded bg-[#EA1A85]/20 px-1.5 py-0.5 text-[10px] text-[#EA1A85] font-bold">
                                #{data.originalPlayer.rank}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px]">{data.role} • {data.team}</p>
                            <div className="pt-2 border-t border-slate-800 space-y-0.5 font-mono text-[11px]">
                              <p className="text-emerald-400">
                                Pressure Score: <strong>{data.pressureRating} / 100</strong>
                              </p>
                              <p className="text-white">
                                {data.isBowler ? 'Economy' : 'Strike Rate'}: <strong>{data.statValue}</strong>
                              </p>
                              <p className="text-[#F59E0B]">
                                Boundary Rate: <strong>{data.boundaryPct}%</strong>
                              </p>
                              <p className="text-[#EA1A85]">
                                Rec. Max Bid: <strong>₹{data.recBid.toFixed(2)} Cr</strong>
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 pt-1 italic">Click to view full dossier</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Scatter
                    name="Uncapped Shortlist"
                    data={scatterData}
                    onClick={(entry) => {
                      if (entry && typeof entry === 'object') {
                        const payload = 'payload' in entry ? (entry as { payload?: { originalPlayer?: Player } }).payload : undefined;
                        const originalPlayer = payload?.originalPlayer || ('originalPlayer' in entry ? (entry as { originalPlayer?: Player }).originalPlayer : undefined);
                        if (originalPlayer) {
                          onSelectPlayer(originalPlayer);
                        }
                      }
                    }}
                    cursor="pointer"
                  >
                    {scatterData.map((entry, index) => {
                      const isSelected = selectedPlayerIds.includes(entry.id);
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isSelected ? '#EA1A85' : entry.isBowler ? '#38BDF8' : '#F59E0B'}
                          stroke={isSelected ? '#FFFFFF' : '#0F172A'}
                          strokeWidth={isSelected ? 2 : 1}
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EA1A85]" /> Target Shortlist
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] ml-2" /> Pacers/Spinners
              <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B] ml-2" /> Batters/Finishers
            </span>
            <span className="text-slate-500 font-mono">Bubble size = Rec. Max Bid</span>
          </div>
        </div>

        {/* CHART 2: Bar Chart - Role-Wise Squad Gap Coverage for Rajasthan Royals */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#F59E0B]" />
                  RR Squad Gap vs. Shortlisted Coverage Ahead of IPL 2027
                </h3>
                <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                  Critical Deficits
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Rajasthan Royals roster depth benchmarked against target strength (90)
              </p>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-[340px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={squadGapChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={false} />
                  
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickFormatter={(v) => `${v}%`}
                  />
                  
                  <YAxis
                    type="category"
                    dataKey="roleCategory"
                    stroke="#CBD5E1"
                    fontSize={11}
                    width={130}
                    tick={{ fill: '#E2E8F0' }}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as typeof squadGapChartData[0];
                        return (
                          <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-white text-sm">{data.roleCategory}</p>
                            <p className="text-slate-400">
                              Urgency Level:{' '}
                              <span className={`font-bold ${data.urgency === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                                {data.urgency}
                              </span>
                            </p>
                            <div className="pt-2 border-t border-slate-800 space-y-0.5 font-mono text-[11px]">
                              <p className="text-slate-300">
                                Current Depth: <strong>{data.currentStrength}%</strong>
                              </p>
                              <p className="text-rose-400">
                                Deficit to Benchmark: <strong>-{data.gapDeficit}%</strong>
                              </p>
                              <p className="text-[#EA1A85]">
                                Shortlisted Talents Available: <strong>{data.shortlistedCount} Players</strong>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />

                  <Bar
                    dataKey="currentStrength"
                    name="Current Squad Strength (%)"
                    fill="#38BDF8"
                    radius={[0, 4, 4, 0]}
                  />

                  <Bar
                    dataKey="gapDeficit"
                    name="Scouting Target Deficit (%)"
                    fill="#EA1A85"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Domestic Death Pacer & Power Finisher are <strong>Critical Gaps</strong></span>
            <span className="text-emerald-400 font-medium">100% covered in Top 10 Shortlist</span>
          </div>
        </div>

      </div>
    </div>
  );
}
