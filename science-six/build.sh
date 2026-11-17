#!/bin/bash
cd "$(dirname "$0")"; mkdir -p out test
names=(x egg-mission speed-festival dawn-op-38 chameleon-hide wall-defenders moonlight-blades)
for i in 1 2 3 4 5 6; do
python3 - "$i" "${names[$i]}" <<'PY'
import sys,re
i,name=sys.argv[1],sys.argv[2]
k=open('kit.html').read(); g=open(f'g/g{i}.js').read()
t=re.search(r"title: '([^']+)'",g).group(1)
h=k.replace('__TITLE__',t).replace('__GAME__',g).replace('__NETFIX__',open('netfix.js').read())
open(f'out/{name}.html','w').write(h)
open(f'test/t{i}.html','w').write(k.replace('__TITLE__',t).replace('__GAME__',g).replace('__NETFIX__','').replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','../node_modules/three/build/three.min.js').replace('https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js','mockpeer.js').replace('<link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&display=swap" rel="stylesheet">',''))
PY
node -e "const s=require('fs').readFileSync('out/${names[$i]}.html','utf8');for(const m of s.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(m[1]);console.log('$i ok')"
done

sed -i 's#\.\./node_modules/three/build/three.min.js#three.min.js#' test/t*.html
