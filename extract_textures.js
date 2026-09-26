const https = require('https');
const fs = require('fs');

https.get('https://itomdev.com/assets/index-BWgbYKJh.js', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const re = /"(\/(?:textures|images|fonts)\/[^"]+)"/g;
    const list = [];
    let m;
    while ((m = re.exec(data)) !== null) {
      list.push(m[1]);
    }
    const unique = Array.from(new Set(list));
    console.log('Found assets:', unique.length);
    fs.writeFileSync('assets_list.json', JSON.stringify(unique, null, 2));
    console.log(unique.slice(0, 30));
  });
});
