'use client';

import React, { useState } from 'react';
import {
  HLPRSPlayer,
  OPEN_TOP_20_BATTERS,
  OPEN_TOP_20_BOWLERS,
  RR_AUCTION_TARGET_BOARD
} from '@/data/players';
import {
  Crown,
  Search,
  Zap,
  ArrowUpDown,
  Plus,
  Minus
} from 'lucide-react';

interface FranchiseLeaderboardProps {
  onSelectPlayer: (player: HLPRSPlayer) => void;
  selectedPlayerIds: string[];
  onToggleAuction: (player: HLPRSPlayer) => void;
  allBatters?: HLPRSPlayer[];
  allBowlers?: HLPRSPlayer[];
  rrTargets?: HLPRSPlayer[];
}

export default function FranchiseLeaderboard({
  onSelectPlayer,
  selectedPlayerIds,
  onToggleAuction
}: FranchiseLeaderboardProps) {
  const [boardType, setBoardType] = useState<'batters' | 'bowlers' | 'rr-targets'>('batters');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'released' | 'uncapped' | 'top10'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'sr' | 'econ' | 'matches'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Select base list
  let activeList: HLPRSPlayer[] = OPEN_TOP_20_BATTERS;
  if (boardType === 'bowlers') activeList = OPEN_TOP_20_BOWLERS;
  if (boardType === 'rr-targets') activeList = RR_AUCTION_TARGET_BOARD;

  // Filter
  const filtered = activeList.filter((p) => {
    const matchesSearch =
      p.player_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contractStatus && p.contractStatus.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'released') {
      return p.contractStatus?.toLowerCase().includes('released');
    }
    if (filterCategory === 'uncapped') {
      return p.contractStatus?.toLowerCase().includes('uncapped') || p.contractStatus?.toLowerCase().includes('non-contracted');
    }
    if (filterCategory === 'top10') {
      return p.rank <= 10;
    }
    return true;
  }).sort((a, b) => {
    let diff = 0;
    if (sortBy === 'score') diff = b.hl_prs_score - a.hl_prs_score;
    else if (sortBy === 'matches') diff = b.total_matches - a.total_matches;
    else if (sortBy === 'sr') diff = parseFloat(b.career_sr) - parseFloat(a.career_sr);
    else if (sortBy === 'econ') diff = parseFloat(a.career_econ) - parseFloat(b.career_econ);
    return sortOrder === 'desc' ? diff : -diff;
  });

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder(key === 'econ' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & View Controls Bar */}
      <div className="rounded-2xl border border-[#EA1A85]/20 bg-[#112240] p-4 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Toggle Pills: Top Batters / Top Bowlers / RR 14 Targets */}
        <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setBoardType('batters')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              boardType === 'batters'
                ? 'bg-gradient-to-r from-[#EA1A85] to-[#B81165] text-white shadow-md shadow-[#EA1A85]/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Top Batters</span>
            <span className="rounded bg-black/30 px-1.5 py-0.2 text-[10px] font-mono">20</span>
          </button>

          <button
            onClick={() => setBoardType('bowlers')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              boardType === 'bowlers'
                ? 'bg-gradient-to-r from-[#EA1A85] to-[#B81165] text-white shadow-md shadow-[#EA1A85]/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Top Bowlers</span>
            <span className="rounded bg-black/30 px-1.5 py-0.2 text-[10px] font-mono">20</span>
          </button>

          <button
            onClick={() => setBoardType('rr-targets')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              boardType === 'rr-targets'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-black shadow-md shadow-[#D4AF37]/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>RR 14 Targets</span>
            <span className="rounded bg-black/30 text-white px-1.5 py-0.2 text-[10px] font-mono">14</span>
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search player, country, team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EA1A85]"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterCategory === 'all' ? 'bg-[#EA1A85] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('top10')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterCategory === 'top10' ? 'bg-[#D4AF37] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 10 Picks
            </button>
            <button
              onClick={() => setFilterCategory('released')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterCategory === 'released' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Released Nov 17
            </button>
            <button
              onClick={() => setFilterCategory('uncapped')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterCategory === 'uncapped' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Uncontracted
            </button>
          </div>
        </div>

      </div>

      {/* Main Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-[#EA1A85]/20 bg-[#112240] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-[#0B162C]/90 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 pl-4 pr-2 font-semibold">Rank</th>
                <th className="py-3.5 px-3 font-semibold">Player &amp; Franchise</th>
                <th onClick={() => toggleSort('matches')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-center">
                  Matches (Press)
                </th>
                <th className="py-3.5 px-3 font-semibold text-right">
                  {boardType === 'bowlers' ? 'Career Econ' : 'Career SR'}
                </th>
                <th onClick={() => toggleSort(boardType === 'bowlers' ? 'econ' : 'sr')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right">
                  {boardType === 'bowlers' ? 'Pressure Econ / SR' : 'Pressure SR / Avg'}
                </th>
                <th className="py-3.5 px-3 font-semibold text-center">
                  Flop / Pad Penalty
                </th>
                <th onClick={() => toggleSort('score')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-center min-w-[200px]">
                  <div className="flex items-center justify-center gap-1">
                    <span>Pressure Rating (HL-PRS v7)</span>
                    <ArrowUpDown className="h-3 w-3 text-[#EA1A85]" />
                  </div>
                </th>
                {boardType === 'rr-targets' && (
                  <th className="py-3.5 px-3 font-semibold text-right">
                    Rec. Max Bid
                  </th>
                )}
                <th className="py-3.5 pr-4 pl-2 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.player_id);
                const isTop3 = player.rank <= 3;

                return (
                  <tr
                    key={player.player_id}
                    onClick={() => onSelectPlayer(player)}
                    className={`group cursor-pointer transition-colors ${
                      isTop3
                        ? 'bg-[#162B4D]/50 hover:bg-[#162B4D]/90 border-l-4 border-l-[#D4AF37]'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank with Crown for Top 3 */}
                    <td className="py-3.5 pl-4 pr-2 font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        {isTop3 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D4AF37]/20 text-xs font-black text-[#D4AF37] border border-[#D4AF37]/40">
                            <Crown className="h-3.5 w-3.5 mr-0.5" />
                            {player.rank}
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs text-slate-300 border border-slate-800">
                            {player.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Player & Franchise */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white group-hover:text-[#EA1A85] transition-colors flex items-center gap-2">
                        <span>{player.player_name}</span>
                        {player.contractStatus && (
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${
                            player.contractStatus.includes('Released')
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : player.contractStatus.includes('Retained')
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {player.contractStatus}
                          </span>
                        )}
                        {player.is_high_baseline && (
                          <span className="rounded bg-sky-500/20 text-sky-400 px-1 py-0.2 text-[9px] font-bold border border-sky-500/30" title="Protected Floor">
                            Floor Protected
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {player.nationality} • {player.role}
                      </div>
                    </td>

                    {/* Matches (Press) */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      <span className="font-bold">{player.total_matches}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({player.n_press} press)</span>
                    </td>

                    {/* Baseline SR / Econ */}
                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      {boardType === 'bowlers' ? (
                        <span>{player.career_econ}</span>
                      ) : (
                        <span>{player.career_sr}</span>
                      )}
                    </td>

                    {/* Pressure SR / Econ */}
                    <td className="py-3.5 px-3 text-right font-mono">
                      {boardType === 'bowlers' ? (
                        <div>
                          <span className="text-[#38BDF8] font-bold text-sm">{player.eb_econ_press}</span>
                          <div className="text-[10px] text-slate-400">SR: {player.eb_bowlsr_press}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-emerald-400 font-bold text-sm">{player.eb_sr_press}</span>
                          <div className="text-[10px] text-slate-400">Avg: {player.eb_avg_press}</div>
                        </div>
                      )}
                    </td>

                    {/* Penalties */}
                    <td className="py-3.5 px-3 text-center font-mono text-[11px]">
                      {player.p_flop > 0 || player.p_pad > 0 ? (
                        <div className="space-y-0.5">
                          {player.p_flop > 0 && (
                            <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] text-rose-400 font-bold block">
                              KO Flop: -{player.p_flop}
                            </span>
                          )}
                          {player.p_pad > 0 && (
                            <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-400 font-bold block">
                              Stat-Pad: -{player.p_pad}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-bold">0.0 (Clean)</span>
                      )}
                    </td>

                    {/* Pressure Rating Progress Bar (Jaipur Pink to Gold Gradient) */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-white flex items-center gap-1">
                            <Zap className="h-3 w-3 text-[#EA1A85]" />
                            {player.hl_prs_score.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                        {/* Gradient Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, Math.max(10, player.hl_prs_score))}%` }}
                            className="h-full rounded-full rr-gradient-bar shadow-sm transition-all duration-500"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Rec Bid for RR targets */}
                    {boardType === 'rr-targets' && (
                      <td className="py-3.5 px-3 text-right font-mono font-black text-[#D4AF37] text-sm">
                        ₹{player.recommendedMaxBid?.toFixed(2)} Cr
                      </td>
                    )}

                    {/* Action button */}
                    <td className="py-3.5 pr-4 pl-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleAuction(player)}
                        className={`rounded-lg p-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-[#EA1A85] hover:text-[#EA1A85]'
                        }`}
                        title={isSelected ? 'Remove target' : 'Select target'}
                      >
                        {isSelected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </button>
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
