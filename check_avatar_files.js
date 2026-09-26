const fs = require('fs');
const path = require('path');

const files = [
  'assets/textures/corridor/avatar_sketch.webp',
  'assets/textures/entrance/speech_bubble.webp',
  'assets/textures/entrance/avatar_window.webp',
  'assets/textures/entrance/cat_front_body.webp',
  'assets/textures/corridor/pustatabliczka.webp',
  'assets/textures/corridor/avatar_anim/1.webp',
  'assets/textures/corridor/avatar_anim/5.webp',
  'assets/images/avatar-hero.webp'
];

files.forEach(f => {
  const full = path.join('d:/chemi', f);
  if (fs.existsSync(full)) {
    console.log(f, 'EXISTS, size:', fs.statSync(full).size);
  } else {
    console.log(f, 'MISSING');
  }
});
