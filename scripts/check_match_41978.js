const fs = require('fs');

const statsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_match_stats.csv', 'utf8').trim().split('\n');

console.log('Match 41978 rows:');
for (let i = 1; i < statsRaw.length; i++) {
  const cols = statsRaw[i].split(',');
  if (cols[0] === '41978') {
    console.log(`${cols[2]} | Order: ${cols[4]} | Status: ${cols[5]} | Runs: ${cols[6]} | Balls: ${cols[7]} | Wkts: ${cols[13]}`);
  }
}
