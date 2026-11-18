const fs = require('fs');

console.log('Loading datasets...');
const matchesRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/matches.csv', 'utf8').trim().split('\n');
const matchHeader = matchesRaw[0].split(',');
const matches = [];
for (let i = 1; i < matchesRaw.length; i++) {
  const line = matchesRaw[i];
  if (!line) continue;
  // parse CSV line with possible quotes or simple split
  const cols = line.split(',');
  const m = {
    comp_id: cols[0],
    match_id: cols[1],
    match_format: cols[2],
    match_number: cols[3],
    match_date: cols[4],
    stage: cols[5] ? cols[5].trim() : '',
    venue_id: cols[7],
    venue_name: cols[8],
    home_team_id: cols[10],
    home_team: cols[11],
    away_team_id: cols[12],
    away_team: cols[13],
    first_inn_bat_team_id: cols[18],
    player_of_the_match: cols[19],
    win_team_id: cols[24],
    result: cols.slice(25).join(',')
  };
  m.is_true_knockout = ['Final', 'Qualifier', 'Semi Final', 'Eliminator', 'Quarter Final'].includes(m.stage) ? 1 : 0;
  matches.push(m);
}
console.log(`Loaded ${matches.length} matches. True knockouts: ${matches.filter(m => m.is_true_knockout).length}`);

// Check competitions
const compsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/competitions.csv', 'utf8').trim().split('\n');
const compMap = new Map();
for (let i = 1; i < compsRaw.length; i++) {
  const line = compsRaw[i];
  if (!line) continue;
  const cols = line.split(',');
  compMap.set(cols[0], {
    comp_id: cols[0],
    season: cols[1],
    name: cols.slice(2, cols.length - 1).join(','),
    match_type: cols[cols.length - 1]
  });
}
console.log(`Loaded ${compMap.size} competitions.`);

// Check mapping
const mapRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_competition_team_mapping.csv', 'utf8').trim().split('\n');
const playerTeamMap = new Map(); // key: `${player_id}_${comp_id}` -> team_id
for (let i = 1; i < mapRaw.length; i++) {
  const cols = mapRaw[i].split(',');
  if (cols.length >= 4) {
    playerTeamMap.set(`${cols[0]}_${cols[2]}`, cols[3]);
  }
}
console.log(`Loaded ${playerTeamMap.size} player-comp-team mappings.`);

// Check players
const playersRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/players.csv', 'utf8').trim().split('\n');
const playerMap = new Map();
for (let i = 1; i < playersRaw.length; i++) {
  const cols = playersRaw[i].split(',');
  if (cols.length >= 6) {
    playerMap.set(cols[0], {
      player_id: cols[0],
      player_name: cols[1],
      bowling_type: cols[2],
      bowling_hand: cols[3],
      batting_type: cols[4],
      batting_hand: cols[5],
      date_of_birth: cols[6],
      is_wicket_keeper: cols[7],
      nationality: cols[8]
    });
  }
}
console.log(`Loaded ${playerMap.size} players.`);
