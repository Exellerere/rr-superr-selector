const fs = require('fs');

const statsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_match_stats.csv', 'utf8').trim().split('\n');

for (let i = 1; i < 30; i++) {
  const cols = statsRaw[i].split(',');
  const name = cols[2];
  const order = cols[4];
  const d = cols[5];
  const runs = cols[6];
  const balls = cols[7];
  console.log(`${name} | Order: ${order} | Dismissal_Status: ${d} | Runs: ${runs} | Balls: ${balls}`);
}
