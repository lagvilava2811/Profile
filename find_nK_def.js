const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

const regex = /(?:const|var|let)\s+nK\s*=|nK\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>|function\s+nK\s*\(/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('Found nK definition:', m[0]);
  console.log(bundle.substring(m.index, m.index + 1200));
}
