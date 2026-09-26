const fs = require('fs');
const code = fs.readFileSync('scratch/index-itom.js', 'utf8');

console.log('Total length:', code.length);
// Let's find all script chunks or import() statements in the whole file
const dynamicImports = [];
const regex = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
let m;
while ((m = regex.exec(code)) !== null) {
  dynamicImports.push(m[1]);
}
console.log('Dynamic imports:', dynamicImports);

// Also check for chunk naming patterns like /assets/*.js
const assetJs = code.match(/["'](\/assets\/[^"']+\.js)["']/g) || [];
console.log('Asset js matches:', assetJs);
