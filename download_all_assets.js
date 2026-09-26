const https = require('https');
const fs = require('fs');
const path = require('path');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets_list.json'), 'utf8'));

function download(relPath) {
  if (relPath.endsWith('/')) return Promise.resolve(false);
  return new Promise((resolve) => {
    const fullUrl = 'https://itomdev.com' + relPath;
    const dest = path.join(__dirname, 'assets', relPath.replace(/^\//, ''));
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      return resolve(true);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    https.get(fullUrl, (res) => {
      if (res.statusCode !== 200) {
        console.log('Skip', relPath, res.statusCode);
        return resolve(false);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved', relPath);
        resolve(true);
      });
    }).on('error', (err) => {
      console.log('Err', relPath, err.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log(`Downloading ${list.length} assets from itomdev...`);
  for (const item of list) {
    await download(item);
  }
  console.log('ALL ASSETS DOWNLOADED!');
}

run();
