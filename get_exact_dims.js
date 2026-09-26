const fs = require('fs');

function getDimensions(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString('ascii', 12, 16) === 'VP8L') {
    const b1 = buf[21];
    const b2 = buf[22];
    const b3 = buf[23];
    const b4 = buf[24];
    const width = 1 + (((b2 & 0x3f) << 8) | b1);
    const height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
    return { width, height, ratio: width / height };
  } else if (buf.toString('ascii', 12, 16) === 'VP8 ') {
    const width = buf.readUInt16LE(26) & 0x3fff;
    const height = buf.readUInt16LE(28) & 0x3fff;
    return { width, height, ratio: width / height };
  }
  return { len: buf.length };
}

console.log('avatar_sketch:', getDimensions('d:/chemi/assets/textures/corridor/avatar_sketch.webp'));
console.log('avatar_anim 1:', getDimensions('d:/chemi/assets/textures/corridor/avatar_anim/1.webp'));
console.log('speech_bubble:', getDimensions('d:/chemi/assets/textures/entrance/speech_bubble.webp'));
console.log('avatar_window:', getDimensions('d:/chemi/assets/textures/entrance/avatar_window.webp'));
console.log('cat_front_body:', getDimensions('d:/chemi/assets/textures/entrance/cat_front_body.webp'));
