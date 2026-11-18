const fs = require('fs');

const playersRaw = fs.readFileSync('C:/Users/GAURAV/Downloads/players.csv', 'utf8').trim().split('\n');
const searchNames = [
  'Mitchell Owen', 'Shahrukh Khan', 'Vishnu Vinod', 'Nehal Wadhera',
  'Hasaranga', 'Ghazanfar', 'Matt Henry', 'David Payne',
  'Mayank Rawat', 'Salman Nizar', 'Tejasvi Dahiya', 'Tanay Sanghvi', 'Pradeep Dadhe', 'Kartik Chadha',
  'Suryakumar', 'Buttler', 'Klaasen', 'Bumrah', 'Pooran', 'Arshdeep', 'Rashid Khan'
];

console.log('Searching for target players in players.csv:');
for (let i = 1; i < playersRaw.length; i++) {
  const line = playersRaw[i];
  const cols = line.split(',');
  const name = cols[1];
  for (const s of searchNames) {
    if (name && name.toLowerCase().includes(s.toLowerCase())) {
      console.log(`Found: [${cols[0]}] ${name} | Bat: ${cols[4]} | Bowl: ${cols[2]}`);
      break;
    }
  }
}
