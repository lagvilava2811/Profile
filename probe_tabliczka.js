const fs = require('fs');

// Simple webp header check or probe
const buf = fs.readFileSync('d:/chemi/assets/textures/corridor/pustatabliczka.webp');
console.log('pustatabliczka length:', buf.length);
console.log('first 30 bytes:', buf.subarray(0, 30));
