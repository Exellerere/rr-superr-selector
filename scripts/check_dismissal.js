const fs = require('fs');

const statsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_match_stats.csv', 'utf8').trim().split('\n');
const dismissalMap = new Map();

for (let i = 1; i < Math.min(statsRaw.length, 5000); i++) {
  const cols = statsRaw[i].split(',');
  const d = cols[5];
  dismissalMap.set(d, (dismissalMap.get(d) || 0) + 1);
}
console.log('Sample Dismissal_Status counts:', dismissalMap);
