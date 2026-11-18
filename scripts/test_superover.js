const fs = require('fs');

console.log('Testing player_match_stats.csv duplicate grouping...');
const statsRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/player_match_stats.csv', 'utf8').trim().split('\n');
console.log(`Total rows in player_match_stats.csv: ${statsRaw.length - 1}`);

// Count dup_N by (match_id, player_id)
const countMap = new Map();
for (let i = 1; i < statsRaw.length; i++) {
  const line = statsRaw[i];
  if (!line) continue;
  const cols = line.split(',');
  const key = `${cols[0]}_${cols[1]}`;
  countMap.set(key, (countMap.get(key) || 0) + 1);
}

let dupCount = 0;
let maxDup = 0;
const superOverMatches = new Set();
for (const [key, count] of countMap.entries()) {
  if (count > 1) {
    dupCount++;
    if (count > maxDup) maxDup = count;
    superOverMatches.add(key.split('_')[0]);
  }
}
console.log(`Number of (match_id, player_id) with duplicates: ${dupCount}`);
console.log(`Max duplicate count: ${maxDup}`);
console.log(`Matches with Super Over duplicates: ${superOverMatches.size} matches (matches: ${Array.from(superOverMatches).slice(0, 10).join(', ')}...)`);
