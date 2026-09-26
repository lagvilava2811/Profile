const fs = require('fs');

const code = fs.readFileSync('scratch/index-itom.js', 'utf8');

// Find where qF or GF are referenced in the code
function findRefs(varName) {
  let pos = 0;
  let count = 0;
  console.log(`=== REFS FOR: ${varName} ===`);
  const regex = new RegExp(`\\b${varName}\\b`, 'g');
  let match;
  while ((match = regex.exec(code)) !== null) {
    console.log(`\n--- Match at ${match.index} ---`);
    console.log(code.slice(Math.max(0, match.index - 100), Math.min(code.length, match.index + 300)));
    count++;
    if (count >= 5) break;
  }
}

findRefs('qF');
findRefs('GF');
