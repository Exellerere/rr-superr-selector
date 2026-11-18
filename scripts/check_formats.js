const fs = require('fs');

const comps = fs.readFileSync('C:/Users/GAURAV/Downloads/competitions.csv', 'utf8')
  .trim().split('\n').slice(1).map(l => {
    const parts = l.split(',');
    return { comp_id: parts[0], season: parts[1], name: parts[2], match_type: parts[3] };
  });

const matchTypes = new Set(comps.map(c => c.match_type));
console.log('Competition match_types:', Array.from(matchTypes));

const matches = fs.readFileSync('C:/Users/GAURAV/Downloads/matches.csv', 'utf8')
  .trim().split('\n').slice(1).map(l => {
    const parts = l.split(',');
    return { comp_id: parts[0], match_id: parts[1], match_format: parts[2], stage: parts[5] };
  });

const matchFormats = new Set(matches.map(m => m.match_format));
console.log('Match formats in matches.csv:', Array.from(matchFormats));

const stages = new Set(matches.map(m => m.stage ? m.stage.trim() : ''));
console.log('Unique trimmed stages:', Array.from(stages));
