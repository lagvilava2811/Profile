const https = require('https');
const fs = require('fs');
const path = require('path');

const list = [
  '/textures/corridor/avatar_sketch.webp',
  '/textures/entrance/speech_bubble.webp',
  '/images/avatar-hero.webp',
  '/images/avatar-thinking.webp',
  '/textures/corridor/avatar_anim/1.webp',
  '/textures/corridor/avatar_anim/2.webp',
  '/textures/corridor/avatar_anim/3.webp',
  '/textures/corridor/avatar_anim/4.webp',
  '/textures/corridor/avatar_anim/5.webp',
  '/textures/corridor/avatar_anim/6.webp',
  '/textures/corridor/avatar_anim/7.webp',
  '/textures/corridor/avatar_anim/8.webp',
  '/textures/corridor/avatar_anim/9.webp',
  '/textures/corridor/pustatabliczka.webp',
  '/textures/corridor/doors/klamkadodrzwi_painted.webp',
  '/textures/corridor/doors/door_back.webp',
  '/textures/corridor/doors/ramkasingledoors.webp',
  '/textures/corridor/doors/backsingledoors.webp',
  '/textures/entrance/sign.webp',
  '/textures/entrance/cat_front_body.webp',
  '/textures/entrance/avatar_window.webp'
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
  console.log('Downloading avatar & entrance assets...');
  for (const item of list) {
    await download(item);
  }
  console.log('Done downloading avatar assets!');
}

run();
