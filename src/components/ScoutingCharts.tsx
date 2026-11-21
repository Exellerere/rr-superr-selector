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
import { HLPRSPlayer, RR_AUCTION_TARGET_BOARD, RR_5_SQUAD_GAPS } from '@/data/players';
import { Activity, BarChart3 } from 'lucide-react';

interface ScoutingChartsProps {
  onSelectPlayer: (player: HLPRSPlayer) => void;
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
  const [chartMode, setChartMode] = useState<'all' | 'released' | 'uncapped'>('all');

  const scatterData = RR_AUCTION_TARGET_BOARD.map((p) => {
    const isBowler = Boolean(p.targetRole?.includes('Pacer') || p.targetRole?.includes('Spinner') || p.role?.includes('Bowler'));
    const isReleased = p.contractStatus?.includes('Released');
    
    return {
      id: p.player_id,
      name: p.player_name,
      role: p.targetRole || p.role,
      nationality: p.nationality,
      isReleased,
      isBowler,
      // Stat value: Pressure SR for batters, Inverted Economy for bowlers
      statValue: isBowler ? p.eb_econ_press : p.eb_sr_press,
      hl_prs_score: p.hl_prs_score,
      recBid: p.recommendedMaxBid || 2.0,
      originalPlayer: p,
      zSize: (p.recommendedMaxBid || 2.0) * 45,
    };
  }).filter((p) => {
    if (chartMode === 'released') return p.isReleased;
    if (chartMode === 'uncapped') return !p.isReleased;
    return true;
  });

  const squadGapChartData = RR_5_SQUAD_GAPS.map((gap) => {
    const availableTargets = RR_AUCTION_TARGET_BOARD.filter(p => p.targetRole?.includes(gap.gapName.split('. ')[1]) || false);
    const selectedCount = availableTargets.filter(p => selectedPlayerIds.includes(p.player_id)).length;
    
    return {
      gapName: gap.gapName.split('. ')[1] || gap.gapName,
      availableTargets: availableTargets.length,
      selectedTargets: selectedCount,
      urgency: gap.urgency,
    };
  });

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <div className="h-[400px] rounded-xl border border-slate-800 bg-[#1E293B]/70 animate-pulse flex items-center justify-center text-slate-500 text-xs">
          Loading HL-PRS v7 Scatter Matrix...
        </div>
        <div className="h-[400px] rounded-xl border border-slate-800 bg-[#1E293B]/70 animate-pulse flex items-center justify-center text-slate-500 text-xs">
          Loading RR 5 Squad Gap Breakdown...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Scatter Plot - Performance vs HL-PRS v7 */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#EA1A85]" />
                  HL-PRS v7 Score vs. Pressure Performance Metric
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rajasthan Royals 14 Auction Targets (Released Nov 17 + Uncontracted Gems)
                </p>
              </div>

              <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900/90 p-0.5 text-xs">
                <button
                  onClick={() => setChartMode('all')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    chartMode === 'all' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All (14)
                </button>
                <button
                  onClick={() => setChartMode('released')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    chartMode === 'released' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Released (8)
                </button>
                <button
                  onClick={() => setChartMode('uncapped')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    chartMode === 'uncapped' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Uncontracted (6)
                </button>
              </div>
            </div>

            {/* Quadrant Legend */}
            <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Top-Right: High-Leverage Elite Gems</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#F59E0B] font-medium">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                <span>Bubble Size = Rec. Max Bid (₹ Cr)</span>
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
                    name="Performance Metric"
                    domain={['auto', 'auto']}
                    stroke="#94A3B8"
                    fontSize={11}
                    label={{
                      value: 'Pressure Metric (SR for Batters / Econ for Bowlers)',
                      position: 'bottom',
                      offset: 0,
                      fill: '#94A3B8',
                      fontSize: 10,
                    }}
                  />
                  
                  <YAxis
                    type="number"
                    dataKey="hl_prs_score"
                    name="HL-PRS v7 Score"
                    domain={[40, 95]}
                    stroke="#94A3B8"
                    fontSize={11}
                    label={{
                      value: 'HL-PRS v7 Score (0-100)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#94A3B8',
                      fontSize: 10,
                    }}
                  />

                  <ZAxis type="number" dataKey="zSize" range={[120, 500]} name="Max Bid" />

                  <ReferenceLine y={65} stroke="#EA1A85" strokeDasharray="4 4" label={{ value: 'Priority Target Threshold (65+)', fill: '#EA1A85', fontSize: 10, position: 'right' }} />

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
                            <p className="text-slate-400 text-[11px]">{data.role} • {data.nationality}</p>
                            <div className="pt-2 border-t border-slate-800 space-y-0.5 font-mono text-[11px]">
                              <p className="text-emerald-400">
                                HL-PRS v7 Score: <strong>{data.hl_prs_score} / 100</strong>
                              </p>
                              <p className="text-white">
                                {data.isBowler ? 'Pressure Econ' : 'Pressure SR'}: <strong>{data.statValue}</strong>
                              </p>
                              <p className="text-[#F59E0B]">
                                Rec. Max Bid: <strong>₹{data.recBid.toFixed(2)} Cr</strong>
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 pt-1 italic">Click to view HL-PRS dossier</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Scatter
                    name="RR Target Candidates"
                    data={scatterData}
                    onClick={(entry) => {
                      if (entry && typeof entry === 'object') {
                        const payload = 'payload' in entry ? (entry as { payload?: { originalPlayer?: HLPRSPlayer } }).payload : undefined;
                        const originalPlayer = payload?.originalPlayer || ('originalPlayer' in entry ? (entry as { originalPlayer?: HLPRSPlayer }).originalPlayer : undefined);
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
                          fill={isSelected ? '#EA1A85' : entry.isReleased ? '#F59E0B' : '#38BDF8'}
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
              <span className="h-2.5 w-2.5 rounded-full bg-[#EA1A85]" /> Selected Target
              <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B] ml-2" /> Released Stars
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] ml-2" /> Uncontracted Gems
            </span>
          </div>
        </div>

        {/* CHART 2: Bar Chart - RR 5 Squad Gap Fulfillment */}
        <div className="rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#F59E0B]" />
                  RR 5 Squad Gaps Ahead of IPL 2027
                </h3>
                <span className="rounded-full bg-[#EA1A85]/15 border border-[#EA1A85]/30 px-2 py-0.5 text-[10px] font-bold text-[#EA1A85]">
                  HL-PRS v7 Mapping
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Available vs. Simulated Targets per tactical squad deficit
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
                    domain={[0, 5]}
                    stroke="#94A3B8"
                    fontSize={11}
                  />
                  
                  <YAxis
                    type="category"
                    dataKey="gapName"
                    stroke="#CBD5E1"
                    fontSize={10}
                    width={150}
                    tick={{ fill: '#E2E8F0' }}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as typeof squadGapChartData[0];
                        return (
                          <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-white text-sm">{data.gapName}</p>
                            <p className="text-slate-400">Urgency: <strong className="text-[#EA1A85]">{data.urgency}</strong></p>
                            <div className="pt-2 border-t border-slate-800 space-y-0.5 font-mono text-[11px]">
                              <p className="text-blue-400">
                                Available Candidates: <strong>{data.availableTargets}</strong>
                              </p>
                              <p className="text-emerald-400">
                                Currently Selected in Cart: <strong>{data.selectedTargets}</strong>
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
                    dataKey="availableTargets"
                    name="Available Shortlisted Candidates"
                    fill="#38BDF8"
                    radius={[0, 4, 4, 0]}
                  />

                  <Bar
                    dataKey="selectedTargets"
                    name="Active Targets Selected"
                    fill="#EA1A85"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Redundant openers and left-arm orthodox spinners explicitly excluded</span>
            <span className="text-emerald-400 font-medium">100% gap coverage possible</span>
          </div>
        </div>

      </div>
    </div>
  );
}
