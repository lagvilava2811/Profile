const fs = require('fs');
const code = fs.readFileSync('scratch/Experience-ofTVAJf3.js', 'utf8');

function searchAround(needle, count = 3) {
  let idx = 0;
  let c = 0;
  console.log(`\n================ SEARCH: ${needle} ================`);
  while ((idx = code.indexOf(needle, idx)) !== -1) {
    console.log(`\n--- Match at ${idx} ---`);
    console.log(code.slice(Math.max(0, idx - 100), Math.min(code.length, idx + 350)));
    c++;
    idx += needle.length;
    if (c >= count) break;
  }
}

searchAround('camera');
searchAround('fov');
searchAround('avatar_anim');
searchAround('position:[0,0,22]');
searchAround('corridor_enter');
