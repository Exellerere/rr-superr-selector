'use client';

import React, { useState, useMemo } from 'react';
import { Player, UNCAPPED_PLAYERS } from '@/data/players';
import { Search, ArrowUpDown, ChevronDown, Plus, Minus, Zap, Eye, LayoutGrid, List } from 'lucide-react';

interface PlayerTableProps {
  onSelectPlayer: (player: Player) => void;
  selectedPlayerIds: string[];
  onToggleAuction: (player: Player) => void;
}

export default function PlayerTable({
  onSelectPlayer,
  selectedPlayerIds,
  onToggleAuction,
}: PlayerTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [pressureFilter, setPressureFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'pressure' | 'bid' | 'boundary' | 'stat'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const roleOptions = [
    'All',
    'Top-Order Batter',
    'Middle-Order Finisher',
    'Pace Bowler',
    'Wrist Spinner',
    'Finger Spinner',
    'All-Rounder',
    'Wicketkeeper-Batter'
  ];

  const filteredAndSortedPlayers = useMemo(() => {
    return UNCAPPED_PLAYERS.filter((player) => {
      // Search filter
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.domesticTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.role.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = selectedRole === 'All' || player.role === selectedRole;

      // Pressure filter
      let matchesPressure = true;
      if (pressureFilter === 'elite') matchesPressure = player.clutchPressureRating >= 92;
      if (pressureFilter === 'high') matchesPressure = player.clutchPressureRating >= 90;

      return matchesSearch && matchesRole && matchesPressure;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortBy === 'pressure') {
        comparison = b.clutchPressureRating - a.clutchPressureRating;
      } else if (sortBy === 'bid') {
        comparison = b.recommendedMaxBid - a.recommendedMaxBid;
      } else if (sortBy === 'boundary') {
        comparison = b.boundaryPercentage - a.boundaryPercentage;
      } else if (sortBy === 'stat') {
        comparison = b.strikeRateOrEconomy - a.strikeRateOrEconomy;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, selectedRole, pressureFilter, sortBy, sortOrder]);

  const handleSortChange = (key: 'rank' | 'pressure' | 'bid' | 'boundary' | 'stat') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder(key === 'rank' ? 'asc' : 'desc');
    }
  };

  return (
    <section className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#1E293B]/80 p-4 shadow-md">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by player name, state team, or role..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-[#EA1A85] focus:outline-none focus:ring-1 focus:ring-[#EA1A85]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters and View toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role selector */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-900/90 pl-3 pr-8 py-2 text-xs font-medium text-slate-200 focus:border-[#EA1A85] focus:outline-none"
            >
              <option value="All">All Roles ({UNCAPPED_PLAYERS.length})</option>
              {roleOptions.filter(r => r !== 'All').map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Pressure tier filter */}
          <div className="relative">
            <select
              value={pressureFilter}
              onChange={(e) => setPressureFilter(e.target.value)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-900/90 pl-3 pr-8 py-2 text-xs font-medium text-slate-200 focus:border-[#EA1A85] focus:outline-none"
            >
              <option value="All">All Pressure Tiers</option>
              <option value="elite">Elite Clutch (92+ PI)</option>
              <option value="high">High Leverage (90+ PI)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-[#EA1A85] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-[#EA1A85] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredAndSortedPlayers.length}</strong> uncapped players</span>
        <span className="text-[11px] text-slate-500">Click any row or player card to open detailed scouting report</span>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#1E293B]/70 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#0F172A]/90 text-slate-400">
                <tr>
                  <th
                    onClick={() => handleSortChange('rank')}
                    className="cursor-pointer py-3.5 pl-4 pr-2 font-semibold hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Rank</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-semibold">Player Name</th>
                  <th className="py-3.5 px-3 font-semibold">Role & Style</th>
                  <th className="py-3.5 px-3 font-semibold">Domestic Team</th>
                  <th
                    onClick={() => handleSortChange('boundary')}
                    className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Boundary %</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortChange('stat')}
                    className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Phase Metric / SR</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortChange('pressure')}
                    className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Pressure Rating</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortChange('bid')}
                    className="cursor-pointer py-3.5 px-3 font-semibold hover:text-white text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Rec. Max Bid</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3.5 pr-4 pl-2 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAndSortedPlayers.map((player) => {
                  const isSelected = selectedPlayerIds.includes(player.id);
                  const isBowler = player.runsOrWickets.includes('Wickets');

                  return (
                    <tr
                      key={player.id}
                      className="group hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => onSelectPlayer(player)}
                    >
                      {/* Rank */}
                      <td className="py-3.5 pl-4 pr-2 font-mono font-bold">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs text-[#EA1A85] border border-slate-700/80">
                          #{player.rank}
                        </span>
                      </td>

                      {/* Name & Age */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white group-hover:text-[#EA1A85] transition-colors flex items-center gap-1.5">
                          {player.name}
                          <Eye className="h-3 w-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {player.age} yrs • {player.runsOrWickets}
                        </div>
                      </td>

                      {/* Role & Style */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block rounded bg-slate-900/90 px-2 py-0.5 text-[11px] font-medium text-slate-200 border border-slate-700/60">
                          {player.role}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                          {player.battingStyle}
                        </div>
                      </td>

                      {/* Domestic Team */}
                      <td className="py-3.5 px-3 font-medium text-slate-300">
                        {player.domesticTeam}
                      </td>

                      {/* Boundary % */}
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-emerald-400">
                        {player.boundaryPercentage}%
                      </td>

                      {/* Death / PP Metric */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono font-bold text-white">
                          {player.strikeRateOrEconomy}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                            {isBowler ? ' Econ' : ' SR'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#F59E0B] font-mono">
                          {player.deathPowerplayStat}
                        </div>
                      </td>

                      {/* Pressure Rating */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold border ${
                          player.clutchPressureRating >= 93
                            ? 'bg-[#EA1A85]/20 text-[#EA1A85] border-[#EA1A85]/40'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}>
                          <Zap className="h-3 w-3" />
                          {player.clutchPressureRating}
                        </span>
                      </td>

                      {/* Recommended Max Bid */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono font-bold text-white text-sm">
                          ₹{player.recommendedMaxBid.toFixed(2)} Cr
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Base: ₹{player.basePrice.toFixed(2)} Cr
                        </div>
                      </td>

                      {/* Action */}
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
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedPlayers.map((player) => {
            const isSelected = selectedPlayerIds.includes(player.id);
            const isBowler = player.runsOrWickets.includes('Wickets');

            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="group relative cursor-pointer rounded-xl border border-slate-800 bg-[#1E293B]/80 p-5 shadow-lg transition-all duration-300 hover:border-[#EA1A85]/60 hover:bg-[#1E293B] flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-bold text-[#EA1A85] border border-slate-700">
                      #{player.rank}
                    </span>
                    <span className="rounded-full bg-[#EA1A85]/15 px-2 py-0.5 font-mono text-[11px] font-bold text-[#EA1A85] border border-[#EA1A85]/30 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {player.clutchPressureRating} PI
                    </span>
                  </div>

                  {/* Player Name and Team */}
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-white group-hover:text-[#EA1A85] transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {player.age} yrs • {player.domesticTeam}
                    </p>
                    <span className="mt-2 inline-block rounded bg-slate-900/90 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-800">
                      {player.role}
                    </span>
                  </div>

                  {/* Key Stats Strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Volume</span>
                      <span className="text-xs font-bold text-white">{player.runsOrWickets}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">{isBowler ? 'Econ' : 'SR'}</span>
                      <span className="text-xs font-bold font-mono text-[#F59E0B]">{player.strikeRateOrEconomy}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Boundary</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">{player.boundaryPercentage}%</span>
                    </div>
                  </div>

                  {/* Tactical Phase Highlight */}
                  <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/40 px-2.5 py-1.5 rounded-md border border-slate-800 flex items-center justify-between">
                    <span>Phase Performance:</span>
                    <strong className="text-white font-mono">{player.deathPowerplayStat}</strong>
                  </div>
                </div>

                {/* Card Footer: Bid & Toggle Button */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rec. Max Bid</span>
                    <span className="text-sm font-black font-mono text-[#F59E0B]">₹{player.recommendedMaxBid.toFixed(2)} Cr</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPlayer(player)}
                      className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700 hover:text-white hover:border-slate-500"
                    >
                      Dossier
                    </button>

                    <button
                      onClick={() => onToggleAuction(player)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          : 'bg-[#EA1A85] text-white hover:bg-[#D01474]'
                      }`}
                    >
                      {isSelected ? 'Remove' : '+ Target'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
