const fs = require('fs');

const code = fs.readFileSync('scratch/index-itom.js', 'utf8');

function findMatches(keyword, maxCount = 5) {
  let pos = 0;
  let count = 0;
  console.log(`=== SEARCH FOR: ${keyword} ===`);
  while ((pos = code.indexOf(keyword, pos)) !== -1) {
    console.log(`\n--- Match ${count + 1} at ${pos} ---`);
    console.log(code.slice(Math.max(0, pos - 150), Math.min(code.length, pos + 350)));
    pos += keyword.length;
    count++;
    if (count >= maxCount) break;
  }
}

findMatches('avatar_anim');
findMatches('speech_bubble');
findMatches('pustatabliczka');
findMatches('sign.webp');
findMatches('Entrance');
