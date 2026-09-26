const fs = require('fs');
const code = fs.readFileSync('scratch/index-itom.js', 'utf8');

// Let's search for "drzwiabout" or "pustatabliczka" or "drzwi" in the code outside the array definitions
function findCodeAround(term) {
  let idx = 0;
  while ((idx = code.indexOf(term, idx)) !== -1) {
    if (idx < 1485000) { // before the preload arrays!
      console.log(`Found ${term} at index ${idx}`);
      console.log(code.slice(Math.max(0, idx - 200), Math.min(code.length, idx + 400)));
      console.log('--------------------------------------------------');
    }
    idx += term.length;
  }
}

findCodeAround('drzwiabout');
findCodeAround('pustatabliczka');
findCodeAround('avatar_sketch');
findCodeAround('avatar_window');
findCodeAround('cat_front_body');
