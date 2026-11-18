const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/GAURAV/Downloads';
const files = [
  'competitions.csv',
  'matches.csv',
  'players.csv',
  'player_competition_team_mapping.csv',
  'player_match_stats.csv'
];

files.forEach(f => {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) {
    console.log(`NOT FOUND: ${f}`);
    return;
  }
  const stat = fs.statSync(p);
  const content = fs.readFileSync(p, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${f} (${(stat.size / 1024 / 1024).toFixed(2)} MB, ${lines.length} lines) ===`);
  console.log('Header: ' + lines[0]);
  console.log('Sample 1: ' + lines[1]);
  if (lines[2]) console.log('Sample 2: ' + lines[2]);
});
