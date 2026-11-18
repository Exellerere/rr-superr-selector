const fs = require('fs');

const comps = fs.readFileSync('C:/Users/GAURAV/Downloads/competitions.csv', 'utf8')
  .trim().split('\n').slice(1).map(l => {
    const parts = l.split(',');
    return { comp_id: parts[0], season: parts[1], name: parts.slice(2, parts.length - 1).join(','), match_type: parts[parts.length - 1] };
  });

console.log('Sample competitions:');
comps.slice(0, 30).forEach(c => console.log(`${c.comp_id}: ${c.name} (${c.match_type}, ${c.season})`));

// Check unique tournaments/names
const uniqueNames = Array.from(new Set(comps.map(c => c.name)));
console.log('\nTotal unique competition names:', uniqueNames.length);
console.log('Competitions matching World Cup, IPL, etc:');
uniqueNames.filter(n => /world cup|ipl|asia cup|smat|syed|tnpl|maharaja|bbl|sa20|psl|cpl|blast|ilt20|mlc|lpl|bpl/i.test(n))
  .forEach(n => console.log(' - ' + n));
