const fs = require('fs');
const bundle = fs.readFileSync('d:/chemi/itom_bundle_dump.js', 'utf8');

// Look for coordinates or corridor objects
const matches = [...bundle.matchAll(/position:\s*\[\s*[-0-9.]+\s*,\s*[-0-9.]+\s*,\s*[-0-9.]+\s*\]/g)];
console.log('Position arrays count:', matches.length);
matches.slice(0, 30).forEach(m => console.log(m[0]));
