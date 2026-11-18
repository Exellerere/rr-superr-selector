'use client';

import React, { useState } from 'react';
import { HLPRSPlayer } from '@/data/players';
import { Search, Zap, Plus, Minus, ArrowUpDown } from 'lucide-react';

interface LeaderboardViewsProps {
  players: HLPRSPlayer[];
  viewType: 'rr-targets' | 'batters' | 'bowlers';
  selectedPlayerIds: string[];
  onToggleAuction: (player: HLPRSPlayer) => void;
  onSelectPlayer: (player: HLPRSPlayer) => void;
}

export default function LeaderboardViews({
  players,
  viewType,
  selectedPlayerIds,
  onToggleAuction,
  onSelectPlayer,
}: LeaderboardViewsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'score' | 'sr' | 'econ' | 'bid' | 'runs' | 'wkts'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.player_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.targetRole && p.targetRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'All') {
      if (viewType === 'rr-targets') {
        if (selectedFilter === 'Released') matchesFilter = p.contractStatus?.includes('Released') || false;
        else if (selectedFilter === 'Uncapped') matchesFilter = p.contractStatus?.includes('Uncapped') || false;
        else matchesFilter = p.targetRole?.includes(selectedFilter) || false;
      }
    }
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    let diff = 0;
    if (sortBy === 'score') diff = b.hl_prs_score - a.hl_prs_score;
    else if (sortBy === 'sr') diff = parseFloat(b.career_sr) - parseFloat(a.career_sr);
    else if (sortBy === 'econ') diff = parseFloat(a.career_econ) - parseFloat(b.career_econ);
    else if (sortBy === 'bid') diff = (b.recommendedMaxBid || 0) - (a.recommendedMaxBid || 0);
    else if (sortBy === 'runs') diff = b.total_runs - a.total_runs;
    else if (sortBy === 'wkts') diff = b.total_wkts - a.total_wkts;
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
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#1E293B]/80 p-4 shadow-md">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={viewType === 'rr-targets' ? "Search 14 RR targets by name, nationality, or gap..." : "Search players by name, country, or role..."}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-[#EA1A85] focus:outline-none"
          />
        </div>

        {/* Filter Pills for RR Target Board */}
        {viewType === 'rr-targets' && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === 'All' ? 'bg-[#EA1A85] text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              All (14)
            </button>
            <button
              onClick={() => setSelectedFilter('Released')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === 'Released' ? 'bg-[#EA1A85] text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Released Nov 17 (8)
            </button>
            <button
              onClick={() => setSelectedFilter('Uncapped')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === 'Uncapped' ? 'bg-[#EA1A85] text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Uncontracted Gems (6)
            </button>
          </div>
        )}

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white font-mono">{filteredPlayers.length}</strong> evaluated players
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#1E293B]/70 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-[#0F172A]/90 text-slate-400">
              <tr>
                <th className="py-3.5 pl-4 pr-2 font-semibold">Rank</th>
                <th className="py-3.5 px-3 font-semibold">Player & Profile</th>
                {viewType === 'rr-targets' && (
                  <th className="py-3.5 px-3 font-semibold">RR Tactical Squad Gap</th>
                )}
                {viewType !== 'bowlers' && (
                  <>
                    <th onClick={() => toggleSort('runs')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right">
                      Runs / Balls
                    </th>
                    <th onClick={() => toggleSort('sr')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right">
                      Pressure SR
                    </th>
                  </>
                )}
                {viewType === 'bowlers' && (
                  <>
                    <th onClick={() => toggleSort('wkts')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right">
                      Wickets / Overs
                    </th>
                    <th onClick={() => toggleSort('econ')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right">
                      Pressure Econ
                    </th>
                  </>
                )}
                <th className="py-3.5 px-3 font-semibold text-center">Flop / Pad Penalties</th>
                <th className="py-3.5 px-3 font-semibold text-center">Volume Bonus (+B_vol)</th>
                <th onClick={() => toggleSort('score')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>HL-PRS v7</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                {viewType === 'rr-targets' && (
                  <th onClick={() => toggleSort('bid')} className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right">
                    Rec. Max Bid
                  </th>
                )}
                <th className="py-3.5 pr-4 pl-2 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPlayers.map((player, idx) => {
                const isSelected = selectedPlayerIds.includes(player.player_id);

                return (
                  <tr
                    key={player.player_id}
                    className="group hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => onSelectPlayer(player)}
                  >
                    {/* Rank */}
                    <td className="py-3.5 pl-4 pr-2 font-mono font-bold">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs text-[#EA1A85] border border-slate-700/80">
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Name & Nationality */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white group-hover:text-[#EA1A85] transition-colors flex items-center gap-1.5">
                        {player.player_name}
                        {player.is_high_baseline && (
                          <span className="rounded bg-blue-500/20 text-blue-400 px-1 py-0.2 text-[9px] font-bold border border-blue-500/30" title="Asymmetric Baseline Protected Star">
                            Protected Floor
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {player.nationality} • {player.role} • {player.total_matches} T20 matches
                      </div>
                    </td>

                    {/* RR Squad Gap (Target Board only) */}
                    {viewType === 'rr-targets' && (
                      <td className="py-3.5 px-3">
                        <span className="inline-block rounded bg-[#EA1A85]/15 px-2 py-0.5 text-[10px] font-bold text-[#EA1A85] border border-[#EA1A85]/30">
                          {player.targetRole}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${player.contractStatus?.includes('Released') ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                          <span>{player.tier}</span>
                        </div>
                      </td>
                    )}

                    {/* Batting Stats */}
                    {viewType !== 'bowlers' && (
                      <>
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className="text-white font-bold">{player.total_runs}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({player.total_balls}b)</span>
                          <div className="text-[10px] text-slate-500">Career SR: {player.career_sr}</div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className="text-emerald-400 font-bold text-sm">{player.eb_sr_press}</span>
                          <div className="text-[10px] text-slate-400">Avg: {player.eb_avg_press}</div>
                        </td>
                      </>
                    )}

                    {/* Bowling Stats */}
                    {viewType === 'bowlers' && (
                      <>
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className="text-white font-bold">{player.total_wkts} wkts</span>
                          <span className="text-[10px] text-slate-400 ml-1">({player.legal_overs} ov)</span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className="text-[#38BDF8] font-bold text-sm">{player.eb_econ_press}</span>
                          <div className="text-[10px] text-slate-400">SR: {player.eb_bowlsr_press}</div>
                        </td>
                      </>
                    )}

                    {/* Flop / Pad Penalties */}
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

                    {/* Log Volume Bonus */}
                    <td className="py-3.5 px-3 text-center font-mono text-xs">
                      <span className="text-emerald-400 font-bold">+{player.b_vol}</span>
                      <span className="text-[10px] text-slate-500 block">({player.n_press} press apps)</span>
                    </td>

                    {/* Final HL-PRS v7 Score */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-black bg-gradient-to-r from-[#EA1A85]/20 to-blue-500/20 text-white border border-[#EA1A85]/40 shadow-sm">
                        <Zap className="h-3 w-3 text-[#EA1A85]" />
                        {player.hl_prs_score}
                      </span>
                    </td>

                    {/* Recommended Bid (RR Target Board only) */}
                    {viewType === 'rr-targets' && (
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-[#F59E0B] text-sm">
                        ₹{player.recommendedMaxBid?.toFixed(2)} Cr
                      </td>
                    )}

                    {/* Actions */}
                    <td className="py-3.5 pr-4 pl-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleAuction(player)}
                        className={`rounded-lg p-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-[#EA1A85] hover:text-[#EA1A85]'
                        }`}
                        title={isSelected ? 'Remove from simulated buys' : 'Add to simulated buys'}
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
