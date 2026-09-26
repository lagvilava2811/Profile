const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  "/textures/doors/frame_sketch.webp",
  "/textures/doors/door_left_sketch.webp",
  "/textures/doors/door_right_sketch.webp",
  "/textures/doors/door_left_painted.webp",
  "/textures/doors/door_right_painted.webp",
  "/textures/doors/handle_left_sketch.webp",
  "/textures/doors/handle_left_painted.webp",
  "/textures/doors/handle_right_sketch.webp",
  "/textures/doors/handle_right_painted.webp",
  "/textures/doors/door_back.webp",
  "/textures/doors/door_back_left_sketch.webp",
  "/textures/doors/pien.webp",
  "/textures/doors/pien_sketch.webp",
  "/textures/entrance/wall_bricks_2.webp",
  "/textures/entrance/stone-path.webp",
  "/textures/entrance/floor_paper.webp",
  "/textures/entrance/belka.webp",
  "/textures/entrance/cat_front_body.webp",
  "/textures/entrance/window_sketch.webp",
  "/textures/entrance/avatar_window.webp",
  "/textures/entrance/tree_sketch.webp",
  "/textures/entrance/mouse_hanging.webp",
  "/textures/entrance/pot_with_duck.webp",
  "/textures/entrance/bug_sketch.webp",
  "/textures/entrance/speech_bubble.webp",
  "/textures/entrance/sign.webp",
  "/textures/corridor/texturadoprogow.webp",
  "/textures/corridor/bokilampy.webp",
  "/textures/corridor/kratanalampy.webp",
  "/textures/corridor/decorations/pencil.webp",
  "/textures/corridor/decorations/paper_ball.webp",
  "/textures/corridor/decorations/coffee_cup.webp"
];

function download(relPath) {
  return new Promise((resolve) => {
    const localPath = path.join('assets', relPath.replace(/^\//, ''));
    if (fs.existsSync(localPath) && fs.statSync(localPath).size > 100) {
      console.log('Already exists:', localPath);
      return resolve(true);
    }
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(localPath);
    const fullUrl = 'https://itomdev.com' + relPath;
    https.get(fullUrl, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded:', localPath, fs.statSync(localPath).size, 'bytes');
          resolve(true);
        });
      } else {
        console.warn('Failed:', res.statusCode, fullUrl);
        file.close();
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('Error downloading:', fullUrl, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const u of urls) {
    await download(u);
  }
}

run();
