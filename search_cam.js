const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

const idx = bundle.indexOf('position:[0,.2,28]');
if (idx !== -1) {
  console.log(bundle.substring(idx - 600, idx + 800));
}
