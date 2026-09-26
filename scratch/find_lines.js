const fs = require('fs');

const lines = fs.readFileSync('scratch/Experience-ofTVAJf3.js', 'utf8').split('\n');

lines.forEach((line, i) => {
  if (line.includes('avatar_anim') || line.includes('cat_front_body') || line.includes('speech_bubble') || line.includes('pustatabliczka')) {
    console.log(`Line ${i + 1}: ${line.slice(0, 100)}...`);
  }
});
