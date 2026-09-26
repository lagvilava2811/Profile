const fs = require('fs');
const code = fs.readFileSync('d:/chemi/experience_chunk.js', 'utf8');

function find(pattern, len = 500) {
  const reg = new RegExp(pattern, 'g');
  let m;
  while ((m = reg.exec(code)) !== null) {
    console.log(`=== Match: ${pattern} at ${m.index} ===`);
    console.log(code.substring(Math.max(0, m.index - 100), Math.min(code.length, m.index + len)));
  }
}

console.log('--- SEARCHING AVATAR IN EXPERIENCE CHUNK ---');
find('avatar', 400);
find('speech', 400);
find('pustatabliczka', 400);
find('drzwi', 300);
