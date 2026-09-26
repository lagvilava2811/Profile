const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const code = await fetch('https://itomdev.com/assets/Experience-ofTVAJf3.js');
  fs.writeFileSync('scratch/Experience-ofTVAJf3.js', code);
  console.log('Downloaded Experience chunk, size:', code.length);

  // Search for avatar and entrance and doors
  function findSnippets(kw, max = 3) {
    let idx = 0;
    let count = 0;
    console.log(`\n=== SNIPPETS FOR ${kw} ===`);
    while ((idx = code.indexOf(kw, idx)) !== -1) {
      console.log(`\nMatch at ${idx}:`);
      console.log(code.slice(Math.max(0, idx - 150), Math.min(code.length, idx + 450)));
      count++;
      idx += kw.length;
      if (count >= max) break;
    }
  }

  findSnippets('avatar');
  findSnippets('speech_bubble');
  findSnippets('cat_front_body');
  findSnippets('pustatabliczka');
  findSnippets('drzwiabout');
  findSnippets('drzwi');
}

run().catch(console.error);
