const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

function findContext(keyword) {
  let pos = 0;
  while ((pos = bundle.indexOf(keyword, pos)) !== -1) {
    console.log(`=== Match for ${keyword} at ${pos} ===`);
    console.log(bundle.substring(Math.max(0, pos - 250), Math.min(bundle.length, pos + 350)));
    pos += keyword.length;
    if (pos > 1000000) break; // sample
  }
}

console.log('--- AVATAR SEARCH ---');
findContext('avatar_sketch.webp');
findContext('speech_bubble.webp');
findContext('pustatabliczka.webp');
