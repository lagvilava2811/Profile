const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

const regex = /avatar_anim|speech_bubble|avatar_sketch/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log(`=== Found ${m[0]} at ${m.index} ===`);
  console.log(bundle.substring(Math.max(0, m.index - 200), Math.min(bundle.length, m.index + 400)));
}
