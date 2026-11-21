'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  HLPRSPlayer,
  OPEN_TOP_20_BATTERS,
  OPEN_TOP_20_BOWLERS,
  RR_AUCTION_TARGET_BOARD
} from '@/data/players';
import { Crosshair } from 'lucide-react';

interface PressureQuadrantsChartProps {
  onSelectPlayer: (player: HLPRSPlayer) => void;
  selectedPlayerIds?: string[];
  batters?: HLPRSPlayer[];
  bowlers?: HLPRSPlayer[];
  rrTargets?: HLPRSPlayer[];
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function PressureQuadrantsChart({
  onSelectPlayer,
  selectedPlayerIds
}: PressureQuadrantsChartProps) {
  const isMounted = useIsClient();
  const [chartDataset, setChartDataset] = useState<'batters' | 'bowlers' | 'rr-targets'>('batters');

  let rawList: HLPRSPlayer[] = OPEN_TOP_20_BATTERS;
  if (chartDataset === 'bowlers') rawList = OPEN_TOP_20_BOWLERS;
  if (chartDataset === 'rr-targets') rawList = RR_AUCTION_TARGET_BOARD;

  const chartData = rawList.map((p) => {
    const isBowler = chartDataset === 'bowlers' || Boolean(p.role.includes('Bowler') || p.targetRole?.includes('Pacer') || p.targetRole?.includes('Spinner'));
    
    // For batters: X = Career SR, Y = Pressure SR
    // For bowlers: X = Inverted Career Econ (12 - econ), Y = Inverted Pressure Econ (12 - press_econ)
    const xVal = isBowler ? Math.max(0, 12 - parseFloat(p.career_econ)) : parseFloat(p.career_sr);
    const yVal = isBowler ? Math.max(0, 12 - p.eb_econ_press) : p.eb_sr_press;

    // Color: Ranks 1-3 Gold, Rest Pink, Cyan for bowler
    let pointColor = '#EA1A85';
    if (p.rank <= 3) pointColor = '#D4AF37';
    else if (isBowler) pointColor = '#38BDF8';

    return {
      id: p.player_id,
      name: p.player_name,
      team: p.contractStatus || p.nationality,
      role: p.role,
      xVal,
      yVal,
      score: p.hl_prs_score,
      color: pointColor,
      isBowler,
      originalPlayer: p
    };
  });

  // Calculate median thresholds for reference lines
  const xThreshold = chartDataset === 'bowlers' ? 4.5 : 150.0;
  const yThreshold = chartDataset === 'bowlers' ? 4.5 : 155.0;

  if (!isMounted) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#112240] p-6 h-[460px] animate-pulse flex items-center justify-center text-xs text-slate-500">
        Loading Pressure Quadrants &amp; Dynamic Scatter Matrix...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#EA1A85]/20 bg-[#112240] p-5 shadow-2xl space-y-4">
      
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#EA1A85]/20 px-2 py-0.5 text-[10px] font-black uppercase text-[#EA1A85] border border-[#EA1A85]/40 flex items-center gap-1">
              <Crosshair className="h-3 w-3" />
              Dynamic 4-Quadrant Matrix
            </span>
            <span className="text-xs font-mono text-slate-400">
              {chartDataset === 'bowlers' ? 'Career Econ vs Pressure Econ' : 'Career SR vs Pressure SR'}
            </span>
          </div>
          <h3 className="text-base font-black text-white mt-1">
            Performance Under Pressure vs. Baseline
          </h3>
        </div>

        {/* Dataset Toggle */}
        <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setChartDataset('batters')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              chartDataset === 'batters' ? 'bg-[#EA1A85] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Batters
          </button>
          <button
            onClick={() => setChartDataset('bowlers')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              chartDataset === 'bowlers' ? 'bg-[#38BDF8] text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Bowlers
          </button>
          <button
            onClick={() => setChartDataset('rr-targets')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              chartDataset === 'rr-targets' ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            RR 14 Targets
          </button>
        </div>
      </div>

      {/* Chart Canvas with Quadrant Overlay */}
      <div className="relative h-[420px] w-full rounded-xl bg-[#0B162C]/80 border border-slate-800 p-2">
        
        {/* Top-Right Quadrant Watermark (Clutch / Consistent) */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none rounded-xl border border-[#EA1A85]/40 bg-[#EA1A85]/10 px-3 py-1.5 text-right backdrop-blur-sm">
          <span className="text-xs font-black text-[#EA1A85] uppercase tracking-wider block">
            ⭐ Clutch / Consistent
          </span>
          <span className="text-[10px] text-slate-300">
            High Baseline + Pressure Elevation
          </span>
        </div>

        {/* Bottom-Right Quadrant Watermark */}
        <div className="absolute bottom-10 right-4 z-10 pointer-events-none text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            High Velocity / Volatile
          </span>
        </div>

        {/* Top-Left Quadrant Watermark */}
        <div className="absolute top-4 left-16 z-10 pointer-events-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Crisis Anchor Rebuilders
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <XAxis
              type="number"
              dataKey="xVal"
              name={chartDataset === 'bowlers' ? 'Control Index (12-Econ)' : 'Career SR'}
              stroke="#64748B"
              fontSize={11}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              type="number"
              dataKey="yVal"
              name={chartDataset === 'bowlers' ? 'Pressure Control' : 'Pressure SR'}
              stroke="#64748B"
              fontSize={11}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v}`}
            />
            <ZAxis range={[90, 180]} />
            <ReferenceLine x={xThreshold} stroke="#334155" strokeDasharray="4 4" />
            <ReferenceLine y={yThreshold} stroke="#334155" strokeDasharray="4 4" />

            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#EA1A85' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const isSelected = selectedPlayerIds?.includes(data.id);

                  return (
                    <div className="rounded-xl border border-[#EA1A85]/50 bg-[#112240] p-3 shadow-2xl backdrop-blur-md text-xs space-y-1 z-50 min-w-[200px]">
                      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
                        <span className="font-black text-white">{data.name}</span>
                        <div className="flex items-center gap-1.5">
                          {isSelected && (
                            <span className="text-[10px] text-[#D4AF37] font-bold">★ Target</span>
                          )}
                          <span className="font-mono font-bold text-[#EA1A85]">#{data.originalPlayer.rank}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {data.role} • {data.team}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">HL-PRS v7:</span>
                        <span className="font-mono font-bold text-white text-sm">{data.score.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">
                          {data.isBowler ? 'Pressure Econ:' : 'Pressure SR:'}
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {data.isBowler ? `${data.originalPlayer.eb_econ_press} RPO` : `${data.originalPlayer.eb_sr_press}%`}
                        </span>
                      </div>
                      <div className="pt-2 text-[10px] text-center text-[#D4AF37] font-semibold border-t border-slate-800">
                        Click dot to view Full Dossier
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter
              name="Players"
              data={chartData}
              onClick={(e: unknown) => {
                if (e && typeof e === 'object' && 'originalPlayer' in e) {
                  onSelectPlayer((e as { originalPlayer: HLPRSPlayer }).originalPlayer);
                }
              }}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={selectedPlayerIds?.includes(entry.id) ? 3 : 1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#D4AF37]" />
            <span>Rank #1–#3 Champions</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#EA1A85]" />
            <span>Top Batters</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#38BDF8]" />
            <span>Top Bowlers</span>
          </span>
        </div>
        <span className="text-slate-500 font-mono text-[11px]">
          Click any player node to inspect scouting drawer
        </span>
      </div>

    </div>
  );
}
