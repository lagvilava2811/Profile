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

async function inspect() {
  const indexJs = await fetch('https://itomdev.com/assets/index-BWgbYKJh.js');
  fs.writeFileSync('scratch/index-itom.js', indexJs);
  console.log('Saved 1.5MB bundle to scratch/index-itom.js');

  // Search for avatar
  let pos = 0;
  while ((pos = indexJs.indexOf('avatar', pos)) !== -1) {
    console.log('--- AVATAR MATCH at', pos, '---');
    console.log(indexJs.slice(Math.max(0, pos - 200), pos + 300));
    pos += 6;
    if (pos > 500000) break; // just some samples
  }

  // Search for tabliczka
  pos = 0;
  while ((pos = indexJs.indexOf('tabliczka', pos)) !== -1) {
    console.log('--- TABLICZKA MATCH at', pos, '---');
    console.log(indexJs.slice(Math.max(0, pos - 200), pos + 300));
    pos += 9;
    if (pos > 500000) break;
  }
}

inspect().catch(console.error);
