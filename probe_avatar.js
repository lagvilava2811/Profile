const fs = require('fs');

function getWebpSize(filepath) {
  const buf = fs.readFileSync(filepath);
  // VP8 chunk width and height
  const w = buf.readUInt16LE(26) & 0x3fff;
  const h = buf.readUInt16LE(28) & 0x3fff;
  return { w, h, ratio: w / h };
}

console.log('avatar_sketch:', getWebpSize('d:/chemi/assets/textures/corridor/avatar_sketch.webp'));
console.log('avatar_anim 1:', getWebpSize('d:/chemi/assets/textures/corridor/avatar_anim/1.webp'));
console.log('speech_bubble:', getWebpSize('d:/chemi/assets/textures/entrance/speech_bubble.webp'));
