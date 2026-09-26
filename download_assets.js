const https = require('https');
const fs = require('fs');
const path = require('path');

const list = [
  '/images/map.webp',
  '/images/pin.webp',
  '/images/pin-slot.webp',
  '/images/ink-splash.webp',
  '/textures/paper-texture.webp',
  '/textures/corridor/wall_texture.webp',
  '/textures/corridor/kawalekpodlogi.webp',
  '/textures/corridor/ceiling_texture.webp',
  '/textures/corridor/doors/frame_sketch.webp',
  '/textures/corridor/doors/doorrleft.webp',
  '/textures/corridor/doors/dorright.webp',
  '/textures/corridor/doors/handle_left_sketch.webp',
  '/textures/corridor/doors/handle_right_sketch.webp',
  '/textures/corridor/doors/klamkadodrzwi.webp',
  '/textures/corridor/doors/drzwiprojekty.webp',
  '/textures/corridor/doors/drzwiprojekty_painted.webp',
  '/textures/corridor/doors/drzwiabout.webp',
  '/textures/corridor/doors/drzwiabout_painted.webp',
  '/textures/corridor/doors/drzwikontakt.webp',
  '/textures/corridor/doors/drzwikontakt_painted.webp',
  '/textures/corridor/doors/drzwisocial.webp',
  '/textures/corridor/doors/drzwisocial_painted.webp',
  '/textures/corridor/decorations/while_true_loop.webp',
  '/textures/corridor/decorations/coffee_debug.webp',
  '/textures/corridor/decorations/idea_process.webp',
  '/textures/corridor/decorations/paper_airplane.webp',
  '/textures/corridor/decorations/pencil.webp',
  '/textures/corridor/ramkanazdjecieduza.webp',
  '/textures/corridor/ramkanazdjecieduza_painted.webp',
  '/textures/corridor/szafkaprzod.webp',
  '/textures/corridor/rysuneknaobraz1.webp',
  '/textures/corridor/rysuneknaobrazek3.webp',
  '/textures/corridor/strzalka.webp',
  '/fonts/CabinSketch-Bold.ttf',
  '/fonts/CabinSketch-Regular.ttf'
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
  console.log('Starting downloads of itomdev textures...');
  for (const item of list) {
    await download(item);
  }
  console.log('Done downloading textures!');
}

run();
