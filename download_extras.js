const https = require('https');
const fs = require('fs');
const path = require('path');

const extras = [
  '/textures/corridor/drzewkowdoniczce.webp',
  '/textures/corridor/kratkawentylacyjna.webp',
  '/textures/corridor/kwiatekwdoniczce.webp',
  '/textures/corridor/kratanalampy.webp',
  '/textures/corridor/bokilampy.webp',
  '/textures/entrance/stone-path.webp',
  '/textures/entrance/tree_sketch.webp'
];

async function run() {
  for (const p of extras) {
    const fullUrl = 'https://itomdev.com' + p;
    const dest = path.join('d:/chemi/assets', p.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await new Promise((resolve) => {
      https.get(fullUrl, (res) => {
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Saved', p);
            resolve();
          });
        } else {
          console.log('Skip', p, res.statusCode);
          resolve();
        }
      }).on('error', () => resolve());
    });
  }
  console.log('Done downloading extras!');
}

run();
