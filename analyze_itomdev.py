import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

url = 'https://itomdev.com/'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')

print("Fetched HTML length:", len(html))

bundle_url = 'https://itomdev.com/assets/index-BWgbYKJh.js'
b_req = urllib.request.Request(bundle_url, headers=headers)
with urllib.request.urlopen(b_req) as b_res:
    js = b_res.read().decode('utf-8')
    print("Bundle size:", len(js))
    with open('itom_bundle_dump.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Saved itom_bundle_dump.js successfully!")
