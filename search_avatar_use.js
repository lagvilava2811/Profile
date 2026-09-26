const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

function searchRefs(identifier) {
  const regex = new RegExp(identifier, 'g');
  let m;
  while ((m = regex.exec(bundle)) !== null) {
    console.log(`=== Reference to ${identifier} at ${m.index} ===`);
    console.log(bundle.substring(Math.max(0, m.index - 150), Math.min(bundle.length, m.index + 250)));
  }
}

searchRefs('avatar_sketch');
searchRefs('avatar-hero');
