const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

const idx = bundle.indexOf('function nK(');
if (idx !== -1) {
  console.log(bundle.substring(idx, idx + 2000));
} else {
  // search definition
  const m = bundle.match(/function\s+nK\b[^\{]*\{/);
  console.log('nK match:', m);
}
