const fs = require('fs');
const code = fs.readFileSync('scratch/index-itom.js', 'utf8');

function searchSubstrings(arr) {
  for (const s of arr) {
    let idx = 0;
    console.log(`\n================ ${s} ================`);
    while ((idx = code.indexOf(s, idx)) !== -1) {
      console.log(`\n--- Found at ${idx} ---`);
      console.log(code.slice(Math.max(0, idx - 250), Math.min(code.length, idx + 400)));
      idx += s.length;
    }
  }
}

searchSubstrings(['avatar_anim/', 'avatar_sketch', 'avatar_window', 'cat_front_body', 'pustatabliczka']);
