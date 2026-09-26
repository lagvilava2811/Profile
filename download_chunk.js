const https = require('https');
const fs = require('fs');

https.get('https://itomdev.com/assets/Experience-ofTVAJf3.js', (res) => {
  console.log('Status code:', res.statusCode);
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('d:/chemi/experience_chunk.js');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Saved experience_chunk.js! Size:', fs.statSync('d:/chemi/experience_chunk.js').size);
    });
  }
}).on('error', err => console.error(err));
