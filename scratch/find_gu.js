const fs = require('fs');

const code = fs.readFileSync('scratch/Experience-ofTVAJf3.js', 'utf8');

let pos = 0;
const results = [];
while ((pos = code.indexOf('gu', pos)) !== -1) {
  // check if jsx or call
  const snippet = code.slice(Math.max(0, pos - 50), Math.min(code.length, pos + 100));
  if (snippet.includes('<') || snippet.includes('jsx(') || snippet.includes('jsxs(')) {
    results.push(`At ${pos}:\n${snippet}\n---`);
  }
  pos += 2;
  if (results.length > 20) break;
}

fs.writeFileSync('scratch/gu_usage.txt', results.join('\n'));
console.log('Done, found', results.length);
