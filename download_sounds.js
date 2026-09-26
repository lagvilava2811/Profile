const https = require('https');
const fs = require('fs');
const path = require('path');

const soundFiles = [
  '/sounds/szumwiatru.mp3',
  '/sounds/szummiasta.mp3',
  '/sounds/uchyleniedrzwi.mp3',
  '/sounds/otwarciedrzwi.mp3',
  '/sounds/zamknieciedrzwi.mp3',
  '/sounds/cfl_turningpages-belem-breeze-487596.ogg',
  '/images/map_about_painted.webp',
  '/images/map_gallery_painted.webp',
  '/images/map_contact_painted.webp',
  '/images/map_studio_painted.webp'
];

function download(relPath) {
  return new Promise((resolve) => {
    const fullUrl = 'https://itomdev.com' + relPath;
    const dest = path.join(__dirname, 'assets', relPath.replace(/^\//, ''));
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
  console.log('Downloading itomdev sounds and painted map overlays...');
  for (const s of soundFiles) {
    await download(s);
  }
  console.log('Finished downloading sounds & maps!');
}

run();
