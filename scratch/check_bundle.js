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

async function main() {
  const indexJs = await fetch('https://itomdev.com/assets/index-BWgbYKJh.js');
  console.log('indexJs length:', indexJs.length);
  // find asset references or chunk paths
  const chunkMatches = indexJs.match(/\/assets\/[a-zA-Z0-9_\-\.]+\.js/g) || [];
  console.log('Referenced JS files:', Array.from(new Set(chunkMatches)));

  // If there are other chunks, fetch them and search for avatar / doors
  for (const chunkPath of Array.from(new Set(chunkMatches))) {
    console.log('Fetching', chunkPath);
    const chunkContent = await fetch('https://itomdev.com' + chunkPath);
    console.log('Chunk length:', chunkContent.length);
    if (chunkContent.includes('avatar') || chunkContent.includes('tabliczka') || chunkContent.includes('drzwi')) {
      console.log('Found keywords in', chunkPath);
      fs.writeFileSync('scratch/experience_found.js', chunkContent);
    }
  }
}

main().catch(console.error);
