const fs = require('fs');

const p1 = 'C:/Users/GAURAV/Downloads/Rajasthan Royals SupeRR Selector Season 2 - Methodology & Player Rankings Report.pdf';
if (fs.existsSync(p1)) {
  const buf = fs.readFileSync(p1);
  console.log(`Report PDF size: ${(buf.length / 1024).toFixed(1)} KB`);
  // scan for text streams
  const text = buf.toString('latin1');
  const matches = text.match(/HL-PRS|Pressure|Formula|Released|Mitchell Owen|Rawat|Nizar/gi);
  console.log('Matches in PDF:', matches ? matches.slice(0, 20) : 'None');
}
