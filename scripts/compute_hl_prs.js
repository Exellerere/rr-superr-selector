const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPLETE HL-PRS v7 PIPELINE (CALIBRATED) ===');

// 1. Load Competitions
const compsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/competitions.csv', 'utf8').trim().split('\n');
const compMap = new Map();
for (let i = 1; i < compsRaw.length; i++) {
  const line = compsRaw[i];
  if (!line) continue;
  const cols = line.split(',');
  const comp_id = cols[0];
  const season = cols[1];
  const name = cols.slice(2, cols.length - 1).join(',');
  const match_type = cols[cols.length - 1];
  
  let w_comp = 0.58;
  const nl = name.toLowerCase();
  
  if ((nl.includes('world cup') || nl.includes('asia cup')) && !nl.includes('warm') && !nl.includes('rising') && !nl.includes('emerging')) {
    w_comp = 1.35;
  } else if (match_type.toLowerCase() === 't20i' && (nl.includes('bilateral') || nl.includes('tour') || nl.includes('series') || nl.includes('australia') || nl.includes('india') || nl.includes('england') || nl.includes('south africa') || nl.includes('new zealand') || nl.includes('pakistan') || nl.includes('west indies') || nl.includes('sri lanka') || nl.includes('bangladesh') || nl.includes('afghanistan'))) {
    w_comp = 1.25;
  } else if (nl.includes('ipl') || nl.includes('indian premier league')) {
    w_comp = 1.15;
  } else if (nl.includes('emerging') || nl.includes('rising stars') || nl.includes('official "a"')) {
    w_comp = 1.00;
  } else if (nl.includes('sa20') || nl.includes('bbl') || nl.includes('big bash') || nl.includes('cpl') || nl.includes('psl') || nl.includes('blast') || nl.includes('ilt20') || nl.includes('mlc') || nl.includes('lpl') || nl.includes('bpl')) {
    w_comp = 0.95;
  } else if (nl.includes('syed mushtaq ali') && !nl.includes('plate')) {
    w_comp = 0.82;
  } else if (nl.includes('tnpl') || nl.includes('maharaja') || nl.includes('up t20') || nl.includes('delhi mens premier league') || nl.includes('mpl') || nl.includes('kcl') || nl.includes('mp t20') || nl.includes('dy patil') || nl.includes('andhra') || nl.includes('bengal') || nl.includes('baroda') || nl.includes('chhattisgarh') || nl.includes('assam')) {
    w_comp = 0.70;
  } else {
    w_comp = 0.58;
  }

  compMap.set(comp_id, { comp_id, season, name, match_type, w_comp });
}

// 2. Load Matches
const matchesRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/matches.csv', 'utf8').trim().split('\n');
const matchMap = new Map();
for (let i = 1; i < matchesRaw.length; i++) {
  const line = matchesRaw[i];
  if (!line) continue;
  const cols = line.split(',');
  const match_id = cols[1];
  const stageRaw = cols[5] ? cols[5].trim() : '';
  const is_true_knockout = ['Final', 'Qualifier', 'Semi Final', 'Eliminator', 'Quarter Final'].includes(stageRaw) ? 1 : 0;
  
  let m_stage = 1.00;
  if (stageRaw === 'Final') m_stage = 1.50;
  else if (['Semi Final', 'Qualifier', 'Eliminator'].includes(stageRaw)) m_stage = 1.35;
  else if (stageRaw === 'Quarter Final') m_stage = 1.25;
  else if (stageRaw === 'Super 4') m_stage = 1.10;
  else m_stage = 1.00;

  matchMap.set(match_id, {
    comp_id: cols[0],
    match_id,
    match_format: cols[2],
    match_date: cols[4],
    stage: stageRaw,
    is_true_knockout,
    m_stage,
    home_team_id: cols[10],
    away_team_id: cols[12],
    first_inn_bat_team_id: cols[18],
    player_of_the_match: cols[19],
    win_team_id: cols[24],
    result: cols.slice(25).join(',')
  });
}

// 3. Load Player Comp Mapping
const mapRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_competition_team_mapping.csv', 'utf8').trim().split('\n');
const playerCompTeam = new Map();
for (let i = 1; i < mapRaw.length; i++) {
  const cols = mapRaw[i].split(',');
  if (cols.length >= 4) {
    playerCompTeam.set(`${cols[0]}_${cols[2]}`, cols[3]);
  }
}

// 4. Load Players
const playersRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/players.csv', 'utf8').trim().split('\n');
const playerMap = new Map();
for (let i = 1; i < playersRaw.length; i++) {
  const cols = playersRaw[i].split(',');
  if (cols.length >= 6) {
    playerMap.set(cols[0], {
      player_id: cols[0],
      player_name: cols[1],
      bowling_type: cols[2] || '',
      bowling_hand: cols[3] || '',
      batting_type: cols[4] || '',
      batting_hand: cols[5] || '',
      date_of_birth: cols[6] || '',
      is_wicket_keeper: parseInt(cols[7] || '0', 10),
      nationality: (cols[8] || '').trim()
    });
  }
}

// 5. Load and clean player_match_stats.csv (Super Over bug fix & fractional overs fix)
const statsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_match_stats.csv', 'utf8').trim().split('\n');

const dupCountMap = new Map();
for (let i = 1; i < statsRaw.length; i++) {
  const line = statsRaw[i];
  if (!line) continue;
  const cols = line.split(',');
  const key = `${cols[0]}_${cols[1]}`;
  dupCountMap.set(key, (dupCountMap.get(key) || 0) + 1);
}

const cleanedStatsMap = new Map();
for (let i = 1; i < statsRaw.length; i++) {
  const line = statsRaw[i];
  if (!line) continue;
  const cols = line.split(',');
  const match_id = cols[0];
  const player_id = cols[1];
  const key = `${match_id}_${player_id}`;
  const dup_N = dupCountMap.get(key) || 1;

  const rawRuns = parseFloat(cols[6]) || 0;
  const rawBalls = parseFloat(cols[7]) || 0;
  const rawSixes = parseFloat(cols[9]) || 0;
  const rawFours = parseFloat(cols[10]) || 0;
  const rawOvers = parseFloat(cols[11]) || 0;
  const rawRunsConc = parseFloat(cols[12]) || 0;
  const rawWkts = parseFloat(cols[13]) || 0;
  const rawMaidens = parseFloat(cols[14]) || 0;
  const rawDots = parseFloat(cols[15]) || 0;
  const battingOrder = parseInt(cols[4], 10) || 0;
  const dismissalStatus = parseInt(cols[5], 10) || 0;

  const runs_scored = rawRuns / dup_N;
  const balls_faced = rawBalls / dup_N;
  const no_of_sixes = rawSixes / dup_N;
  const no_of_fours = rawFours / dup_N;

  const intOvers = Math.floor(rawOvers);
  const fracOvers = rawOvers - intOvers;
  const legal_balls = Math.min(24, intOvers * 6 + Math.round(fracOvers * 10));

  const stat = {
    match_id,
    player_id,
    player_name: cols[2],
    batting_order: battingOrder,
    dismissal_status: dismissalStatus,
    is_out: (dismissalStatus === 1) ? 1 : 0, // 1 is OUT!
    runs_scored,
    balls_faced,
    no_of_sixes,
    no_of_fours,
    legal_balls,
    runs_conceded: rawRunsConc,
    wicket_taken: rawWkts,
    maiden_overs_bowled: rawMaidens,
    dot_balls_bowled: rawDots,
  };

  cleanedStatsMap.set(key, stat);
}

// 6. Match Context & Situations
const matchSituations = new Map();

for (const stat of cleanedStatsMap.values()) {
  const m = matchMap.get(stat.match_id);
  if (!m) continue;

  if (!matchSituations.has(stat.match_id)) {
    matchSituations.set(stat.match_id, {
      match_id: stat.match_id,
      comp_id: m.comp_id,
      first_inn_runs: 0,
      second_inn_runs: 0,
      first_inn_balls: 0,
      second_inn_balls: 0,
      first_inn_top5_dismissed_le10: 0,
      first_inn_top3_dismissed_le12: 0,
      first_inn_top3_runs: 0,
      second_inn_top5_dismissed_le10: 0,
      second_inn_top3_dismissed_le12: 0,
      second_inn_top3_runs: 0,
      first_inn_top5_dismissed_le15: 0,
      second_inn_top5_dismissed_le15: 0,
    });
  }

  const ms = matchSituations.get(stat.match_id);
  const pteam = playerCompTeam.get(`${stat.player_id}_${m.comp_id}`);
  const isFirstInn = pteam && (pteam === m.first_inn_bat_team_id);

  if (isFirstInn) {
    ms.first_inn_runs += stat.runs_scored;
    ms.first_inn_balls += stat.balls_faced;
    if (stat.batting_order >= 1 && stat.batting_order <= 5) {
      if (stat.is_out && stat.runs_scored <= 10) ms.first_inn_top5_dismissed_le10++;
      if (stat.is_out && stat.runs_scored <= 15) ms.first_inn_top5_dismissed_le15++;
    }
    if (stat.batting_order >= 1 && stat.batting_order <= 3) {
      if (stat.is_out && stat.runs_scored <= 12) ms.first_inn_top3_dismissed_le12++;
      ms.first_inn_top3_runs += stat.runs_scored;
    }
  } else {
    ms.second_inn_runs += stat.runs_scored;
    ms.second_inn_balls += stat.balls_faced;
    if (stat.batting_order >= 1 && stat.batting_order <= 5) {
      if (stat.is_out && stat.runs_scored <= 10) ms.second_inn_top5_dismissed_le10++;
      if (stat.is_out && stat.runs_scored <= 15) ms.second_inn_top5_dismissed_le15++;
    }
    if (stat.batting_order >= 1 && stat.batting_order <= 3) {
      if (stat.is_out && stat.runs_scored <= 12) ms.second_inn_top3_dismissed_le12++;
      ms.second_inn_top3_runs += stat.runs_scored;
    }
  }
}

// 7. Aggregate Player Profiles
const playerProfiles = new Map();

for (const stat of cleanedStatsMap.values()) {
  const m = matchMap.get(stat.match_id);
  if (!m) continue;
  const comp = compMap.get(m.comp_id);
  const w_comp = comp ? comp.w_comp : 0.58;
  const m_stage = m.m_stage;
  const ms = matchSituations.get(stat.match_id);

  if (!playerProfiles.has(stat.player_id)) {
    const pinfo = playerMap.get(stat.player_id) || { player_name: stat.player_name };
    playerProfiles.set(stat.player_id, {
      player_id: stat.player_id,
      player_name: pinfo.player_name || stat.player_name,
      batting_type: pinfo.batting_type,
      bowling_type: pinfo.bowling_type,
      nationality: pinfo.nationality,
      is_wk: pinfo.is_wicket_keeper,
      dob: pinfo.date_of_birth,
      
      total_matches: 0,
      total_runs: 0,
      total_balls: 0,
      total_outs: 0,
      total_sixes: 0,
      total_fours: 0,
      total_legal_balls: 0,
      total_runs_conc: 0,
      total_wkts: 0,
      total_dots: 0,
      
      n_press: 0,
      n_impact_bat: 0,
      n_impact_bowl: 0,
      
      Rw: 0,
      Bw: 0,
      Ow: 0,
      Cw: 0,
      Ww: 0,
      LBw: 0,
      Dw: 0,

      R_usual_w: 0,
      B_usual_w: 0,
      O_usual_w: 0,

      n_ko: 0,
      n_ko_flops_bat: 0,
      n_ko_flops_bowl: 0,
      n_ko_heroes: 0,
      sum_ko_flop_severity: 0,
      ko_runs: 0,
      ko_outs: 0,
      ko_balls_bowled: 0,
      ko_runs_conc: 0,

      innings_count_20b: 0,
      slow_anchor_count: 0,
      pad_loss_count: 0,
      cost_runs_total: 0,

      max_w_comp: 0
    });
  }

  const prof = playerProfiles.get(stat.player_id);
  prof.total_matches++;
  if (w_comp > prof.max_w_comp) prof.max_w_comp = w_comp;

  const pteam = playerCompTeam.get(`${stat.player_id}_${m.comp_id}`);
  const isFirstInn = pteam && (pteam === m.first_inn_bat_team_id);
  const playerTeamWon = (pteam && pteam === m.win_team_id);

  const totalMatchRuns = ms ? (ms.first_inn_runs + ms.second_inn_runs) : 0;
  const totalMatchBalls = ms ? (ms.first_inn_balls + ms.second_inn_balls) : 0;
  const matchParSR = totalMatchBalls > 0 ? (totalMatchRuns / totalMatchBalls) * 100 : 135.0;
  const matchParEcon = totalMatchBalls > 0 ? (totalMatchRuns / (totalMatchBalls / 6)) : 8.15;

  let isSevereCollapse = false;
  let isStandardCollapse = false;
  if (ms) {
    if (isFirstInn) {
      if (ms.first_inn_top5_dismissed_le10 >= 3 || (ms.first_inn_top3_dismissed_le12 >= 2 && ms.first_inn_top3_runs <= 25)) isSevereCollapse = true;
      else if (ms.first_inn_top5_dismissed_le15 >= 3 || ms.first_inn_top3_runs <= 35) isStandardCollapse = true;
    } else {
      if (ms.second_inn_top5_dismissed_le10 >= 3 || (ms.second_inn_top3_dismissed_le12 >= 2 && ms.second_inn_top3_runs <= 25)) isSevereCollapse = true;
      else if (ms.second_inn_top5_dismissed_le15 >= 3 || ms.second_inn_top3_runs <= 35) isStandardCollapse = true;
    }
  }

  const isChasing = !isFirstInn;
  const target = ms ? ms.first_inn_runs + 1 : 160;
  const is200Chase = isChasing && target >= 200;
  const is175Chase = isChasing && target >= 175;
  const winning200Chase = is200Chase && playerTeamWon;

  const resLower = (m.result || '').toLowerCase();
  const isUltraClose = resLower.includes('super over') || resLower.includes('1 run') || resLower.includes('2 runs') || resLower.includes('3 runs') || resLower.includes('4 runs') || resLower.includes('5 runs') || resLower.includes('1 wkt') || resLower.includes('2 wkts');
  const isClose = isUltraClose || resLower.includes('6 runs') || resLower.includes('7 runs') || resLower.includes('8 runs') || resLower.includes('9 runs') || resLower.includes('10 runs') || resLower.includes('11 runs') || resLower.includes('12 runs') || resLower.includes('3 wkts');
  const isPOTM = (m.player_of_the_match && m.player_of_the_match.toString() === stat.player_id.toString());

  let m_bat_sit = 1.00;
  if (isSevereCollapse) m_bat_sit += 0.55;
  else if (isStandardCollapse) m_bat_sit += 0.35;

  if (winning200Chase) m_bat_sit += 0.55;
  else if (is175Chase) m_bat_sit += 0.30;

  if (isUltraClose) m_bat_sit += 0.45;
  else if (isClose) m_bat_sit += 0.25;

  if (isPOTM) m_bat_sit += 0.20;

  let m_bowl_sit = 1.00;
  const isLowTotalDef = isFirstInn && (ms ? ms.first_inn_runs <= 160 : false);
  if (isLowTotalDef && playerTeamWon) m_bowl_sit += 0.55;
  else if (isLowTotalDef) m_bowl_sit += 0.35;

  const isShootout = matchParEcon >= 9.20;
  if (isShootout) m_bowl_sit += 0.35;

  if (isUltraClose) m_bowl_sit += 0.45;
  else if (isClose) m_bowl_sit += 0.25;

  if (isPOTM) m_bowl_sit += 0.20;

  const L_bat = w_comp * m_stage * m_bat_sit;
  const L_bowl = w_comp * m_stage * m_bowl_sit;

  const isPressure = (isSevereCollapse || isStandardCollapse || is175Chase || isLowTotalDef || isShootout || isClose || m.is_true_knockout === 1);

  prof.total_runs += stat.runs_scored;
  prof.total_balls += stat.balls_faced;
  prof.total_outs += stat.is_out;
  prof.total_sixes += stat.no_of_sixes;
  prof.total_fours += stat.no_of_fours;
  prof.total_legal_balls += stat.legal_balls;
  prof.total_runs_conc += stat.runs_conceded;
  prof.total_wkts += stat.wicket_taken;
  prof.total_dots += stat.dot_balls_bowled;

  if (isPressure) {
    prof.n_press++;
    prof.Rw += L_bat * stat.runs_scored;
    prof.Bw += L_bat * stat.balls_faced;
    prof.Ow += L_bat * stat.is_out;

    prof.Cw += L_bowl * stat.runs_conceded;
    prof.Ww += L_bowl * stat.wicket_taken;
    prof.LBw += L_bowl * stat.legal_balls;
    prof.Dw += L_bowl * stat.dot_balls_bowled;

    if (stat.runs_scored >= 25 || (stat.balls_faced >= 10 && (stat.runs_scored / stat.balls_faced) * 100 >= 150)) {
      prof.n_impact_bat++;
    }
    const bowlerEcon = stat.legal_balls > 0 ? (stat.runs_conceded / (stat.legal_balls / 6)) : 99;
    if (stat.wicket_taken >= 2 || (stat.legal_balls >= 12 && bowlerEcon < matchParEcon)) {
      prof.n_impact_bowl++;
    }
  } else {
    prof.R_usual_w += L_bat * stat.runs_scored;
    prof.B_usual_w += L_bat * stat.balls_faced;
    prof.O_usual_w += L_bat * stat.is_out;
  }

  if (m.is_true_knockout === 1) {
    prof.n_ko++;
    prof.ko_runs += stat.runs_scored;
    prof.ko_outs += stat.is_out;
    prof.ko_balls_bowled += stat.legal_balls;
    prof.ko_runs_conc += stat.runs_conceded;

    if (stat.runs_scored >= 40 || stat.wicket_taken >= 3 || isPOTM) {
      prof.n_ko_heroes++;
    }

    if (stat.batting_order >= 1 && stat.batting_order <= 7 && stat.is_out && stat.runs_scored <= 15) {
      prof.n_ko_flops_bat++;
      const s = (stat.runs_scored < 10) ? (1.25 * w_comp * m_stage) : (0.75 * w_comp * m_stage);
      prof.sum_ko_flop_severity += s;
    }

    if (stat.legal_balls >= 6) {
      const econ = stat.runs_conceded / (stat.legal_balls / 6);
      if (econ >= 9.50 && stat.wicket_taken <= 1) {
        prof.n_ko_flops_bowl++;
        const s = (econ >= 11.0 && stat.wicket_taken === 0) ? (1.25 * w_comp * m_stage) : (0.85 * w_comp * m_stage);
        prof.sum_ko_flop_severity += s;
      }
    }
  }

  if (stat.balls_faced >= 20) {
    prof.innings_count_20b++;
    const playerSR = (stat.runs_scored / stat.balls_faced) * 100;
    const isSlowAnchor = (playerSR <= matchParSR - 12.0) || (matchParSR >= 132.0 && playerSR < 128.0);
    
    if (isSlowAnchor) {
      prof.slow_anchor_count++;
      if (stat.runs_scored >= 25 && !playerTeamWon) {
        prof.pad_loss_count++;
      }
      const expectedRunsAtPar = (stat.balls_faced * matchParSR) / 100;
      const deficit = Math.max(0, expectedRunsAtPar - stat.runs_scored);
      prof.cost_runs_total += deficit;
    }
  }
}

// 8. Final HL-PRS v7 Scoring
const finalResults = [];

for (const p of playerProfiles.values()) {
  const isU21Prodigy = p.total_balls > 50 && (p.total_runs / p.total_balls * 100 > 185);
  const km = isU21Prodigy ? 0.40 : 1.0;

  const mu_Avg = 24.5;
  const mu_SR = 135.5;
  const mu_Econ = 8.15;
  const mu_BowlSR = 18.8;

  // EB Shrinkage with correct is_out handling
  const EB_Avg_press = (p.Rw + 12 * km * mu_Avg) / (p.Ow + 12 * km);
  const EB_SR_press = ((p.Rw + 1.5 * km * mu_SR) / (p.Bw + 150 * km)) * 100;

  const EB_Avg_usual = (p.R_usual_w + 12 * km * mu_Avg) / (p.O_usual_w + 12 * km);
  const EB_SR_usual = ((p.R_usual_w + 1.5 * km * mu_SR) / (p.B_usual_w + 150 * km)) * 100;

  const EB_Econ_press = (p.Cw + 20.375 * km * mu_Econ) / (p.LBw / 6 + 2.5 * km);
  const EB_BowlSR_press = (p.LBw + 18.8 * km) / (p.Ww + 1.0 * km);

  // Stage 4: Habitual Knockout Flop Penalty (P_flop)
  let P_flop = 0;
  const totalKOFlops = p.n_ko_flops_bat + p.n_ko_flops_bowl;
  const R_flop = p.n_ko > 0 ? (totalKOFlops / p.n_ko) : 0;
  const koBatAvg = p.ko_outs > 0 ? (p.ko_runs / p.ko_outs) : p.ko_runs;
  const koBowlEcon = p.ko_balls_bowled > 0 ? (p.ko_runs_conc / (p.ko_balls_bowled / 6)) : 0;

  if (p.n_ko >= 3 && R_flop >= 0.45 && (koBatAvg < 25.0 || koBowlEcon >= 8.50)) {
    const rawP = 0.85 * p.sum_ko_flop_severity + 6.0 * Math.max(0, R_flop - 0.38) * Math.sqrt(p.n_ko) - 1.5 * p.n_ko_heroes;
    P_flop = Math.min(14.0, Math.max(0, rawP));
  }

  // Stage 5: Stat-Padding Penalty (P_pad)
  let P_pad = 0;
  const R_slow_20b = p.innings_count_20b > 0 ? (p.slow_anchor_count / p.innings_count_20b) * 100 : 0;
  const R_pad_loss = p.total_matches > 0 ? (p.pad_loss_count / p.total_matches) * 100 : 0;
  const costRunsPerInns = p.total_matches > 0 ? (p.cost_runs_total / p.total_matches) : 0;
  const careerSR = p.total_balls > 0 ? (p.total_runs / p.total_balls) * 100 : 120.0;

  const rawPad = 0.22 * Math.max(0, R_slow_20b - 20) +
                 0.65 * Math.max(0, R_pad_loss - 4) +
                 2.0 * Math.max(0, costRunsPerInns - 1.0) +
                 0.45 * Math.max(0, 138.0 - careerSR);
  P_pad = Math.min(14.0, Math.max(0, rawPad));

  // Asymmetric Baseline Protection
  const isHighBaselineStar = (EB_Avg_press >= 30.0 && EB_SR_press >= 148.0 && P_pad < 0.5);
  let deltaElevationBonus = 0;
  if (isHighBaselineStar) {
    const deltaAvg = Math.max(0, EB_Avg_press - EB_Avg_usual);
    const deltaSR = Math.max(0, EB_SR_press - EB_SR_usual);
    deltaElevationBonus = (deltaAvg * 0.12) + (deltaSR * 0.05);
  }

  // Stage 6: Volume Bonus
  const B_vol_bat = 1.35 * Math.log(1 + p.n_press / 8) + 0.65 * Math.log(1 + p.n_impact_bat / 5);
  const B_vol_bowl = 1.35 * Math.log(1 + p.n_press / 8) + 0.65 * Math.log(1 + p.n_impact_bowl / 5);

  const B_pedigree = p.max_w_comp >= 1.25 ? 3.5 : (p.max_w_comp >= 1.15 ? 2.5 : (p.max_w_comp >= 0.95 ? 1.5 : 0.8));

  // Calibrated Base Batting Score:
  // Avg component: 20 to 50 normalized to 0 - 50 points
  const avgPts = Math.min(50, Math.max(10, ((EB_Avg_press - 15) / 32) * 50));
  // SR component: 110 to 180 normalized to 0 - 50 points
  const srPts = Math.min(50, Math.max(10, ((EB_SR_press - 110) / 70) * 50));
  const baseBat = avgPts + srPts;

  // Calibrated Base Bowling Score:
  // Econ component: 6.0 to 10.5 normalized to 0 - 50 points (lower is better)
  const econPts = Math.min(50, Math.max(5, ((10.5 - EB_Econ_press) / 4.5) * 50));
  // SR component: 10 to 26 normalized to 0 - 50 points (lower is better)
  const bowlSrPts = Math.min(50, Math.max(5, ((26.0 - EB_BowlSR_press) / 16) * 50));
  const baseBowl = econPts + bowlSrPts;

  const final_bat_score = Math.max(45, Math.min(99.4, baseBat - P_flop - P_pad + B_pedigree + B_vol_bat + deltaElevationBonus));
  const final_bowl_score = Math.max(45, Math.min(99.4, baseBowl - P_flop + B_pedigree + B_vol_bowl));

  // Boundary percentage
  const boundaryRuns = (p.total_sixes * 6) + (p.total_fours * 4);
  const boundaryPct = p.total_runs > 0 ? ((boundaryRuns / p.total_runs) * 100).toFixed(1) : '0.0';

  finalResults.push({
    player_id: p.player_id,
    player_name: p.player_name,
    batting_type: p.batting_type,
    bowling_type: p.bowling_type,
    nationality: p.nationality,
    total_matches: p.total_matches,
    total_runs: p.total_runs,
    total_balls: p.total_balls,
    career_sr: careerSR.toFixed(1),
    boundary_pct: parseFloat(boundaryPct),
    total_wkts: p.total_wkts,
    legal_overs: (p.total_legal_balls / 6).toFixed(1),
    career_econ: p.total_legal_balls > 0 ? (p.total_runs_conc / (p.total_legal_balls / 6)).toFixed(2) : '0.00',
    n_press: p.n_press,
    eb_avg_press: parseFloat(EB_Avg_press.toFixed(1)),
    eb_sr_press: parseFloat(EB_SR_press.toFixed(1)),
    eb_econ_press: parseFloat(EB_Econ_press.toFixed(2)),
    eb_bowlsr_press: parseFloat(EB_BowlSR_press.toFixed(1)),
    p_flop: parseFloat(P_flop.toFixed(1)),
    p_pad: parseFloat(P_pad.toFixed(1)),
    b_vol_bat: parseFloat(B_vol_bat.toFixed(1)),
    b_vol_bowl: parseFloat(B_vol_bowl.toFixed(1)),
    b_pedigree: parseFloat(B_pedigree.toFixed(1)),
    final_bat_score: parseFloat(final_bat_score.toFixed(1)),
    final_bowl_score: parseFloat(final_bowl_score.toFixed(1)),
    is_high_baseline: isHighBaselineStar
  });
}

// Top 20 Open Batters (min 400 runs)
const topBatters = finalResults
  .filter(p => p.total_runs >= 400)
  .sort((a, b) => b.final_bat_score - a.final_bat_score)
  .slice(0, 20);

// Top 20 Open Bowlers (min 25 wkts)
const topBowlers = finalResults
  .filter(p => p.total_wkts >= 25)
  .sort((a, b) => b.final_bowl_score - a.final_bowl_score)
  .slice(0, 20);

console.log('\n=== CALIBRATED ALL-PLAYER OPEN TOP 20 BATTERS ===');
topBatters.forEach((p, i) => {
  console.log(`${i + 1}. ${p.player_name} (${p.nationality}) - HL-PRS: ${p.final_bat_score} | Press SR: ${p.eb_sr_press} | Press Avg: ${p.eb_avg_press} | Flop: -${p.p_flop} | Pad: -${p.p_pad} | B_vol: +${p.b_vol_bat}`);
});

console.log('\n=== CALIBRATED ALL-PLAYER OPEN TOP 20 BOWLERS ===');
topBowlers.forEach((p, i) => {
  console.log(`${i + 1}. ${p.player_name} (${p.nationality}) - HL-PRS: ${p.final_bowl_score} | Press Econ: ${p.eb_econ_press} | Press SR: ${p.eb_bowlsr_press} | Wkts: ${p.total_wkts} | B_vol: +${p.b_vol_bowl}`);
});

// Target Board Players
const targetSearchTerms = [
  // Released Stars on Nov 17, 2026
  { key: 'Mitchell Owen', roleCategory: 'Pace-Bowling All-Rounder / Seam Utility', tier: 'Released Marquee', recBid: 5.40, status: 'Released Nov 17, 2026' },
  { key: 'M Shahrukh Khan', roleCategory: 'Dynamic Lower-Order Finisher / Spin Destroyer', tier: 'Released Domestic Power', recBid: 6.80, status: 'Released Nov 17, 2026' },
  { key: 'Nehal Wadhera', roleCategory: 'Dynamic Lower-Order Finisher / Spin Destroyer', tier: 'Released Domestic Power', recBid: 5.80, status: 'Released Nov 17, 2026' },
  { key: 'Wanindu Hasaranga', roleCategory: 'Mystery Wrist Spinner / Attacking Leg-Spinner', tier: 'Released Overseas Elite', recBid: 7.20, status: 'Released Nov 17, 2026' },
  { key: 'Allah Ghazanfar', roleCategory: 'Mystery Wrist Spinner / Attacking Leg-Spinner', tier: 'Released Mystery Sensation', recBid: 4.80, status: 'Released Nov 17, 2026' },
  { key: 'Matt Henry', roleCategory: 'Domestic/Overseas Death Pacer', tier: 'Released Express Quick', recBid: 4.60, status: 'Released Nov 17, 2026' },
  { key: 'David Payne', roleCategory: 'Domestic/Overseas Death Pacer', tier: 'Released Left-Arm Seam Specialist', recBid: 3.80, status: 'Released Nov 17, 2026' },
  { key: 'Vishnu Vinod', roleCategory: 'Dynamic Power Middle-Order / Backup WK-Batter', tier: 'Released 360 Finisher', recBid: 3.20, status: 'Released Nov 17, 2026' },

  // Uncontracted Indian Uncapped Domestic Gems
  { key: 'Mayank Rawat', roleCategory: 'Pace-Bowling All-Rounder / Seam Utility', tier: 'Uncontracted Domestic Gem', recBid: 2.80, status: 'Uncapped Domestic' },
  { key: 'Salman Nizar', roleCategory: 'Dynamic Lower-Order Finisher / Spin Destroyer', tier: 'Uncontracted Domestic Gem', recBid: 2.60, status: 'Uncapped Domestic' },
  { key: 'Tejasvi Dahiya', roleCategory: 'Dynamic Power Middle-Order / Backup WK-Batter', tier: 'Uncontracted Domestic Gem', recBid: 2.20, status: 'Uncapped Domestic' },
  { key: 'Tanay Sanghvi', roleCategory: 'Domestic/Overseas Death Pacer', tier: 'Uncontracted Domestic Gem', recBid: 2.40, status: 'Uncapped Domestic' },
  { key: 'Pradeep Dadhe', roleCategory: 'Domestic/Overseas Death Pacer', tier: 'Uncontracted Domestic Gem', recBid: 1.80, status: 'Uncapped Domestic' },
  { key: 'Kartik Chadha', roleCategory: 'Mystery Wrist Spinner / Attacking Leg-Spinner', tier: 'Uncontracted Domestic Gem', recBid: 1.60, status: 'Uncapped Domestic' },
];

const rrTargetBoard = [];

targetSearchTerms.forEach(item => {
  const match = finalResults.find(p => p.player_name.toLowerCase().includes(item.key.toLowerCase()));
  if (match) {
    const isBowler = ['Domestic/Overseas Death Pacer', 'Mystery Wrist Spinner / Attacking Leg-Spinner'].includes(item.roleCategory);
    const score = isBowler ? match.final_bowl_score : match.final_bat_score;
    rrTargetBoard.push({
      ...match,
      targetRole: item.roleCategory,
      tier: item.tier,
      recommendedMaxBid: item.recBid,
      contractStatus: item.status,
      hl_prs_score: score
    });
  }
});

console.log('\n=== RAJASTHAN ROYALS TARGET BOARD (14 TARGETS) ===');
rrTargetBoard.forEach((p, i) => {
  console.log(`${i + 1}. [${p.player_id}] ${p.player_name} (${p.nationality}) | Score: ${p.hl_prs_score} | Role: ${p.targetRole} | Rec Bid: ₹${p.recommendedMaxBid.toFixed(2)} Cr | Status: ${p.contractStatus}`);
});

fs.writeFileSync('src/data/hl_prs_results.json', JSON.stringify({
  topBatters,
  topBowlers,
  rrTargetBoard
}, null, 2));

console.log('\nComputation complete. Exported to src/data/hl_prs_results.json');
