const fs = require('fs');

// Read the results to see raw numbers
const data = JSON.parse(fs.readFileSync('src/data/hl_prs_results.json', 'utf8'));
console.log('Sample raw top batters:');
data.topBatters.slice(0, 5).forEach(b => console.log(b));

console.log('\nSample raw RR Target Board:');
data.rrTargetBoard.forEach(p => console.log(p.player_name, p.final_bat_score, p.final_bowl_score, p.total_runs, p.total_wkts));
