/* 4. 카멜레온 숨바꼭질 — 열과 우리 생활 (그림 전시관 위장 · 휘슬 · 열화상 스캔) */
const POSE = ['서기', '웅크리기', '눕기'];
const SILC = ['#9775fa', '#4dabf7', '#ffd43b', '#ff6b6b', '#69db7c', '#ffa94d', '#f8f9fa', '#f783ac', '#20c997'];
const NPCN = ['민트초코', '구름빵', '도토리', '별사탕', '콩떡', '하늘이', '감자칩'];
function paintArt(th) {
  const c = document.createElement('canvas'); c.width = 800; c.height = 350; const g = c.getContext('2d');
  const T = [['#8ecae6', '#ffe5b4', '#95d5b2', '#52b788'], ['#1b2a4e', '#4a5f8a', '#2d6a4f', '#1b4332'], ['#ff8fab', '#ffd166', '#118ab2', '#06d6a0'], ['#e9f5db', '#b7e4c7', '#74c69d', '#40916c']][th];
  const sk = g.createLinearGradient(0, 0, 0, 220); sk.addColorStop(0, T[0]); sk.addColorStop(1, T[1]); g.fillStyle = sk; g.fillRect(0, 0, 800, 350);
  if (th === 1) { g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) g.fillRect(rnd(0, 800), rnd(0, 150), 3, 3); g.fillStyle = '#fff3bf'; g.beginPath(); g.arc(640, 70, 34, 0, TAU); g.fill() } else { g.fillStyle = '#ffd43b'; g.beginPath(); g.arc(th === 2 ? 400 : 120, 80, 40, 0, TAU); g.fill() }
  g.fillStyle = T[2]; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= 800; x += 40) g.lineTo(x, 190 + Math.sin(x / 90 + th) * 28); g.lineTo(800, 350); g.lineTo(0, 350); g.fill();
  g.fillStyle = T[3]; g.beginPath(); g.moveTo(0, 270); for (let x = 0; x <= 800; x += 40) g.lineTo(x, 262 + Math.sin(x / 60 + th * 2) * 12); g.lineTo(800, 350); g.lineTo(0, 350); g.fill();
  if (th === 3) for (let i = 0; i < 7; i++) { const x = 40 + i * 120; g.fillStyle = '#7f5539'; g.fillRect(x, 150, 14, 80); g.fillStyle = '#2d6a4f'; g.beginPath(); g.arc(x + 7, 140, 38, 0, TAU); g.fill() }
  if (th === 0) { g.fillStyle = '#ff6b6b'; g.fillRect(300, 300, 160, 40); g.fillStyle = '#fff'; for (let i = 0; i < 8; i++) g.fillRect(300 + i * 20, 300, 10, 40) }
  if (th === 2) { g.fillStyle = '#fff'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(rnd(50, 750), rnd(220, 250), 30, 6, 0, 0, TAU); g.fill() } }
  for (let i = 0; i < 30; i++) { g.fillStyle = pick(['#ffd43b', '#ff8787', '#fff', '#da77f2']); g.beginPath(); g.arc(rnd(0, 800), rnd(290, 345), 5, 0, TAU); g.fill() }
  const us = [], sils = []; for (let k = 0; k < 400 && us.length < 4; k++) { const u = rnd(.1, .9); if (us.every(v => Math.abs(v - u) > .17)) us.push(u) }
  const Y = y => 350 - (y - .2) * 50;
  for (const u of us) {
    const col = pick(SILC), x = u * 800; g.fillStyle = col;
    g.fillRect(x - 15, Y(.62), 13, Y(.2) - Y(.62)); g.fillRect(x + 2, Y(.62), 13, Y(.2) - Y(.62));
    g.beginPath(); g.roundRect ? g.roundRect(x - 19, Y(1.42), 38, Y(.6) - Y(1.42), 8) : g.rect(x - 19, Y(1.42), 38, Y(.6) - Y(1.42)); g.fill();
    g.fillRect(x - 30, Y(1.37), 11, Y(.77) - Y(1.37)); g.fillRect(x + 19, Y(1.37), 11, Y(.77) - Y(1.37));
    g.beginPath(); g.arc(x, Y(1.85), 23, 0, TAU); g.fill(); sils.push({ u, col });
  }
  return { c, sils, data: g.getImageData(0, 0, 800, 350).data };
}
const GAME = {
  id: 'cham', title: '카멜레온 숨바꼭질', sub: '그림 속에 숨고, 휘슬과 열화상 스캔을 버텨라!', emoji: '🦎', unit: '열과 우리 생활',
  facts: ['열은 <b>온도가 높은 곳에서 낮은 곳으로</b> 이동해요.', '<b>금속</b>(철·구리·알루미늄)은 열이 잘 이동하고, <b>나무·솜·스타이로폼·석고</b>는 열이 잘 이동하지 않아요.', '열의 이동을 줄이는 것이 <b>단열</b>이에요. 보온병·이중창·방한복이 단열을 이용해요.'],
  how: '여기는 <b>그림 전시관</b>! 판마다 <b>숨는 사람 ↔ 술래</b>가 바뀌어요(혼자 할 때). 술래 차례엔 <b>붓 태그(J)</b>로 60초 안에 5명을 모두 찾고, <b>열화상 카메라(K)</b>로 금속 옆에 숨은 사람의 체온을 찾아요. 준비 시간에 그림 앞이나 조각상 옆에 서서 <b>스포이드(J)</b>로 색을 찍어 몸을 칠해요. 그림 속 사람 모양과 색을 맞추면 감쪽같아요. <b>포즈(K)</b>도 바꿔 봐요. <b>휘슬</b>이 울리면 숨은 사람 모두 소리를 내요 — 술래가 가까우면 위험! 휘슬 대신 <b>열화상 스캔</b>이 올 때는 <b>단열 물건</b>(나무 액자·석고·솜·커튼·스타이로폼) 옆이어야 해요. <b>라디에이터·금속</b> 옆은 체온이 보여 들켜요! 3판 중 2판 살아남기.',
  help: '이동 WASD · 화면 회전 Q/E·마우스 드래그 · 스포이드 J · 포즈 K',
  quiz: [
    { q: '다음 중 열이 가장 잘 이동하는 물질은?', a: ['구리', '나무', '솜', '스타이로폼'], e: '금속은 열이 잘 이동해요. 그래서 냄비 바닥은 금속으로 만들어요.' },
    { q: '겨울에 솜이 든 두꺼운 옷을 입으면 따뜻한 까닭은?', a: ['솜 속 공기층이 몸의 열이 빠져나가는 것을 막아서', '솜이 열을 만들어서', '옷이 무거워서', '솜이 햇빛을 내서'], e: '솜과 공기층은 열이 잘 이동하지 않아요. 이것이 단열이에요.' },
    { q: '온도가 다른 두 물체가 맞닿으면 열은 어떻게 이동할까요?', a: ['온도가 높은 물체에서 낮은 물체로', '온도가 낮은 물체에서 높은 물체로', '이동하지 않는다', '양쪽으로 똑같이'], e: '열은 항상 온도가 높은 곳에서 낮은 곳으로 이동해요.' },
    { q: '물체의 차갑고 따뜻한 정도를 숫자로 나타낸 것은?', a: ['온도', '무게', '부피', '길이'], e: '온도는 온도계로 측정하고 단위는 ℃를 써요.' },
    { q: '단열을 이용한 예가 아닌 것은?', a: ['금속 프라이팬 바닥', '보온병', '이중창', '아이스박스'], e: '프라이팬 바닥은 열이 잘 이동하도록 금속으로 만들어요. 나머지는 열의 이동을 막아요.' },
    { q: '물을 끓일 때 냄비 속 물 전체가 뜨거워지는 까닭은?', a: ['데워진 물이 위로, 차가운 물이 아래로 움직이며 열이 이동해서', '물이 움직이지 않아서', '냄비가 차가워서', '뚜껑 때문에'], e: '액체와 기체에서는 물질이 직접 움직이면서 열이 이동해요.' },
    { q: '방 안의 라디에이터(난방기)가 방을 데울 수 있는 까닭은?', a: ['뜨거운 금속에서 주변 공기로 열이 이동해서', '공기가 열을 만들어서', '창문이 열을 만들어서', '열은 이동하지 않아서'], e: '라디에이터의 뜨거운 금속에서 차가운 공기로 열이 이동하고, 데워진 공기가 위로 올라가며 방 전체가 따뜻해져요.' },
  ],
  net() { const P = this.p.g.position; return [P.x, 0, P.z, this.p.g.rotation.y, Math.floor(this.score), '#' + this.skin.color.getHexString(), this.pose, this.caught ? 1 : 0] },
  mkBody(col) { const c = person({ top: col, bottom: col, skin: col, hair: null }); const m = new THREE.MeshToonMaterial({ color: col, gradientMap: grad }); c.g.traverse(o => { if (o.isMesh && o.geometry.type !== 'PlaneGeometry' && !(o.material.color && o.material.color.getHexString() === '111111')) o.material = m }); c.mat = m; return c },
  mkGhost(r) { return this.mkBody('#ffffff') },
  ghost(r) { r.g.mat.color.set(r.d[5] || '#fff'); this.setPose(r.g, r.d[6] || 0); r.g.g.visible = !r.d[7] },
  setPose(c, p) { c.g.scale.set(1, p === 1 ? .55 : 1, 1); c.g.rotation.x = p === 2 ? -PI / 2 : 0; c.g.position.y = p === 2 ? .35 : 0 },
  init() {
    newScene('#2b2320', 40, 110, { amb: .62, sunI: .45, ground: '#6b5b4b' });
    const fc = document.createElement('canvas'); fc.width = fc.height = 64; const fg = fc.getContext('2d'); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { fg.fillStyle = (i + j) % 2 ? '#212529' : '#f1f3f5'; fg.fillRect(i * 32, j * 32, 32, 32) } const ft = new THREE.CanvasTexture(fc); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.magFilter = THREE.NearestFilter; ft.repeat.set(11.5, 11.5);
    const fl = add(null, new THREE.PlaneGeometry(46, 46), new THREE.MeshToonMaterial({ map: ft, gradientMap: grad }), 0, 0, 0); fl.rotation.x = -PI / 2; fl.castShadow = false;
    for (const [x, z, w, d] of [[0, -23, 47, 1], [0, 23, 47, 1], [-23, 0, 1, 47], [23, 0, 1, 47]]) { box(null, w, 10, d, '#efe3c8', x, 5, z); box(null, w * .99 + .2, .6, d * .99 + .2, '#6b4226', x, .3, z); box(null, w * .99 + .2, .4, d * .99 + .2, '#c9a36a', x, 9.6, z) }
    for (let i = -1; i <= 1; i++) { box(null, 30, .3, 1.2, MB('#fff9db'), 0, 10.2, i * 12) }
    // 그림
    this.arts = []; let th = 0; const hot = [1, 6];
    for (const [nx, nz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) for (const s of [-1, 1]) {
      const ux = nz ? (nz > 0 ? 1 : -1) : 0, uz = nx ? (nx > 0 ? -1 : 1) : 0, cx = -nx * 22.4 + ux * s * 10.6, cz = -nz * 22.4 + uz * s * 10.6, w = 16, h = 7, b = .2;
      const A = paintArt(th++ % 4), tex = new THREE.CanvasTexture(A.c), m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
      m.position.set(cx + nx * .14, b + h / 2, cz + nz * .14); m.rotation.y = Math.atan2(nx, nz); scene.add(m);
      const F = new THREE.Group(); F.position.set(cx - nx * .1, 0, cz - nz * .1); F.rotation.y = Math.atan2(nx, nz); scene.add(F); box(F, w + .8, .4, .3, '#c9a227', 0, b + h + .2, 0); box(F, .4, h + .6, .3, '#c9a227', -w / 2 - .2, b + h / 2, 0); box(F, .4, h + .6, .3, '#c9a227', w / 2 + .2, b + h / 2, 0);
      const art = { cx, cz, nx, nz, ux, uz, w, h, b, A, hot: hot.includes(this.arts.length) }; this.arts.push(art);
      if (art.hot) { const R = new THREE.Group(); R.position.set(cx + nx * .5, 0, cz + nz * .5); R.rotation.y = Math.atan2(nx, nz); scene.add(R); for (let i = -6; i <= 6; i++) box(R, .35, 1.3, .5, '#adb5bd', i * .45, .75, 0); box(R, 6.2, .2, .55, '#868e96', 0, .1, 0); label(R, '🔥 철 라디에이터', 3, .5, '#e03131', '#fff', 0, 1.8, .3, 36) }
    }
    // 전시물 (단열 / 금속)
    this.objs = [];
    const addO = (n, col, ins, x, z, mk) => { const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); mk(g); const l = label(g, n, 1.9, .38, ins ? '#1971c2' : '#e03131', '#fff', 0, 3.4, 0, 36); l.userData.bill = 1; this.objs.push({ x, z, col, ins, n }) };
    const statue = (g, k) => { const p = person({ top: '#f1f3f5', bottom: '#f1f3f5', skin: '#f1f3f5', hair: null }); p.g.traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHexString() === '111111') o.visible = false }); p.aL.rotation.z = k ? 2.6 : -.3; p.aR.rotation.x = -1.2; g.add(p.g) };
    addO('석고 조각상', '#f1f3f5', 1, -8, -6, g => statue(g, 1)); addO('석고 조각상', '#f1f3f5', 1, 9, 5, g => statue(g, 0)); addO('석고 조각상', '#f1f3f5', 1, 0, 11, g => statue(g, 1));
    addO('구리 조각상', '#d9480f', 0, 7, -9, g => { cyl(g, .5, .9, .6, '#a63d10', 0, .3, 0); const t = add(g, new THREE.TorusKnotGeometry(.8, .28, 60, 8), '#d9480f', 0, 2, 0); t.scale.set(1, 1.2, 1) });
    addO('나무 벤치', '#a47148', 1, -5, 1, g => { box(g, 4, .3, 1.3, '#a47148', 0, .8, 0); for (const x of [-1.6, 1.6]) box(g, .3, .8, 1.1, '#7f5539', x, .4, 0) });
    addO('나무 벤치', '#a47148', 1, 5, -1, g => { box(g, 4, .3, 1.3, '#a47148', 0, .8, 0); for (const x of [-1.6, 1.6]) box(g, .3, .8, 1.1, '#7f5539', x, .4, 0) });
    addO('벨벳 커튼', '#a61e4d', 1, 0, -21.6, g => { for (let i = -2; i <= 2; i++) box(g, .6, 8, .5, i % 2 ? '#a61e4d' : '#c2255c', i * .55, 4, 0) });
    addO('벨벳 커튼', '#a61e4d', 1, 0, 21.6, g => { for (let i = -2; i <= 2; i++) box(g, .6, 8, .5, i % 2 ? '#a61e4d' : '#c2255c', i * .55, 4, 0) });
    addO('스타이로폼 상자', '#f8f9fa', 1, -16, 13, g => { box(g, 2, 1.6, 1.6, '#f8f9fa', 0, .8, 0); box(g, 1.6, 1.2, 1.4, '#f8f9fa', .2, 2.2, 0) });
    addO('솜 쿠션 소파', '#ffc9de', 1, -13, -14, g => { sph(g, 1.4, '#ffc9de', 0, .7, 0, 1.4, .6, 1); box(g, 3.4, 1.4, .5, '#fcc2d7', 0, 1.2, -.8) });
    addO('알루미늄 사다리', '#ced4da', 0, 15, -14, g => { for (const x of [-.6, .6]) box(g, .15, 4.5, .15, '#ced4da', x, 2.25, 0); for (let i = 0; i < 6; i++) box(g, 1.3, .12, .15, '#ced4da', 0, .5 + i * .7, 0) });
    addO('철 금고', '#868e96', 0, 15, 14, g => { box(g, 2, 2.4, 1.6, '#868e96', 0, 1.2, 0); cyl(g, .3, .3, .1, '#495057', 0, 1.4, .82).rotation.x = PI / 2 });
    // 나 · 술래 · 다른 숨은이
    this.p = this.mkBody('#ffffff'); this.skin = this.p.mat; scene.add(this.p.g);
    const S = person({ top: '#f8f9fa', bottom: '#e9ecef', skin: '#ffffff', hair: null, s: 1.25 }); scene.add(S.g); S.g.traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHexString() === '111111') o.visible = false });
    this.eye = box(S.head, .62, .16, .1, MB('#ff6b6b'), 0, .05, .43); const br = new THREE.Group(); br.position.set(0, -.55, .1); S.aR.add(br); cyl(br, .06, .06, 2.2, '#8b5a2b', 0, -.2, .9).rotation.x = PI / 2; sph(br, .22, '#e64980', 0, -.2, 2.05, 1, 1, 1.4);
    this.sk = S; this.skl = label(S.g, '🖌️ 술래', 2, .5, '#c92a2a', '#fff', 0, 3.4, 0, 40); this.skl.userData.bill = 1;
    this.cone = new THREE.Mesh(new THREE.CircleGeometry(7.2, 16, -PI / 5, PI / 2.5), MB('#ff6b6b', { transparent: true, opacity: .16, side: THREE.DoubleSide, depthWrite: false })); this.cone.rotation.x = -PI / 2; this.cone.rotation.z = PI / 2; this.cone.position.y = .08; S.g.add(this.cone);
    this.rings = [];
    this.round = 0; this.win = 0; this.lose = 0; this.t = 0; this.pose = 0; this.score = 0; this.yaw = 0; this.dragX = 0; this.newRound();
    setBtns([{ k: 'KeyK', i: '🧎', l: '포즈' }, { k: 'KeyJ', i: '💧', l: '스포이드' }]);
    if (!window.__chDrag) { window.__chDrag = 1; addEventListener('mousemove', e => { if (e.buttons && e.target && e.target.id === 'cv') GAME.dragX += e.movementX }) }
    this.hud();
  },
  hud() {
    let h = $('#ch'); if (h) h.remove();
    if (!$('#chCss')) { const s = document.createElement('style'); s.id = 'chCss'; s.textContent = `
#ch{position:fixed;inset:0;pointer-events:none;z-index:6;font-family:'Black Han Sans',Jua,sans-serif;color:#fff;text-shadow:0 2px 0 #111}
#ch .tl{position:absolute;left:12px;top:12px;font-size:15px;color:#ffd43b;line-height:1.35}#ch .tl span{color:#fff}
#ch .tc{position:absolute;left:50%;top:10px;transform:translateX(-50%);text-align:center;width:min(56vw,520px)}
#chBan{font-size:24px;color:#ff4d4d;-webkit-text-stroke:1px #111}#chBan.prep{color:#ffd43b}
#chCnt{margin-top:4px;font-size:20px}#chCnt .r{color:#ff6b6b}#chCnt .b{color:#74c0fc}
#chObj{margin-top:6px;font:14px Jua,sans-serif;background:rgba(0,0,0,.5);border-radius:10px;padding:4px 10px;display:inline-block;text-shadow:none}#chObj b{color:#ffd43b}
#ch .tr{position:absolute;right:12px;top:12px;text-align:right;font-size:16px;line-height:1.45}#ch .tr .w{color:#ffd43b}
#chRing{position:absolute;left:50%;top:46%;width:120px;height:120px;margin:-60px;border:5px solid #ff6b6b;border-radius:50%;opacity:0;transition:opacity .3s}
@media(max-width:640px){#ch .tl{font-size:11.5px;top:10px}#ch .tc{top:84px;width:92vw}#chBan{font-size:18px}#chCnt{font-size:15px}#chObj{font-size:12px}#ch .tr{font-size:12.5px;top:10px}}`; document.head.appendChild(s) }
    h = document.createElement('div'); h.id = 'ch'; h.innerHTML = `<div id="chBlind" style="position:absolute;inset:0;background:#0b0b0f;opacity:0;transition:opacity .4s;display:flex;align-items:center;justify-content:center;font-size:clamp(28px,7vw,54px);color:#ffd43b"></div><div id="chScan" style="position:absolute;inset:0;background:radial-gradient(rgba(255,120,40,.08) 35%,rgba(110,30,200,.55));opacity:0;transition:opacity .3s"></div><div class="tl" id="chTop"></div><div class="tc"><div id="chBan"></div><div id="chCnt"></div><div id="chObj"></div></div><div class="tr" id="chR"></div>`;
    document.body.appendChild(h); $('.hud').style.display = 'none'; $('#board').style.top = '110px'; $('#bar').style.top = innerWidth > 640 ? '122px' : '';
  },
  newRound() {
    this.round++; this.role = !NET.on && this.round % 2 === 0 ? 'seek' : 'hide'; this.ph = 'prep'; this.pt = this.role === 'seek' ? 10 : 18; this.found = 0; this.camT = 0; this.camOn = 0; this.sus = 0; this.caught = false; this.scan = 0; this.wT = 12; this.wk = this.round % 2; this.wp = null; this.p.g.visible = true; this.why = null;
    this.sk.g.position.set(0, 0, 0); this.sk.g.rotation.y = 0; this.skl.visible = this.role === 'hide'; this.p.g.visible = this.role === 'hide';
    setBtns(this.role === 'seek' ? [{ k: 'KeyK', i: '🌡️', l: '열화상' }, { k: 'KeyJ', i: '🖌️', l: '태그' }] : [{ k: 'KeyK', i: '🧎', l: '포즈' }, { k: 'KeyJ', i: '💧', l: '스포이드' }]); $('#help').textContent = this.role === 'seek' ? '이동 WASD · 화면 회전 Q/E·드래그 · 붓 태그 J · 열화상 카메라 K' : this.help;
    // 다른 숨은이: 그림 속 사람 모양이나 조각상 옆에 숨는다
    (this.npc || []).forEach(n => scene.remove(n.c.g)); this.npc = [];
    const spots = []; for (const a of this.arts) for (const s of a.A.sils) spots.push({ x: a.cx + (s.u - .5) * a.w * a.ux + a.nx * .5, z: a.cz + (s.u - .5) * a.w * a.uz + a.nz * .5, col: s.col, ry: Math.atan2(a.nx, a.nz), pose: 0 });
    for (const o of this.objs) spots.push({ x: o.x + 1.3, z: o.z + .4, col: o.col, ry: rnd(0, TAU), pose: o.n.includes('조각') ? 0 : 1 });
    spots.sort(() => Math.random() - .5);
    for (let i = 0; i < (NET.on ? 3 : this.role === 'seek' ? 5 : 6); i++) { const s = spots[i], c = this.mkBody(s.col); c.g.position.set(s.x, 0, s.z); c.g.rotation.y = s.ry; this.setPose(c, s.pose); scene.add(c.g); const nr = this.near(s.x, s.z); this.npc.push({ c, n: NPCN[i], x: s.x, z: s.z, alive: true, warm: !(nr && nr.ins), sc: this.npcS ? this.npcS[i] : 0 }) }
    this.npcS = this.npc.map(n => n.sc);
    toast(this.role === 'seek' ? `${this.round}판 · 이번엔 내가 술래! 눈 감고 10초` : `${this.round}판 · 숨을 준비! (18초)`, '#ffd43b', 1.6);
  },
  artAt(x, z) { for (const a of this.arts) { const d = (x - a.cx) * a.nx + (z - a.cz) * a.nz, u = ((x - a.cx) * a.ux + (z - a.cz) * a.uz) / a.w + .5; if (d > -.2 && d < 2.3 && u > .02 && u < .98) return { a, u } } return null },
  pix(a, u, y) { const v = 1 - (y - a.b) / a.h, X = clamp(Math.floor(u * 800), 0, 799), Y = clamp(Math.floor(v * 350), 0, 349), i = (Y * 800 + X) * 4, D = a.A.data; return new THREE.Color(D[i] / 255, D[i + 1] / 255, D[i + 2] / 255) },
  near(x, z) { const w = this.artAt(x, z); if (w) return { n: w.a.hot ? '라디에이터 앞 그림' : '나무 액자 그림', ins: w.a.hot ? 0 : 1, art: w }; let b = null, bd = 2.6; for (const o of this.objs) { const d = Math.hypot(x - o.x, z - o.z); if (d < bd) { b = o; bd = d } } return b },
  bg(x, z) { const o = this.near(x, z); if (o && o.art) return this.pix(o.art.a, o.art.u, [1.15, .65, .3][this.pose]); if (o) return new THREE.Color(o.col); return new THREE.Color(((Math.floor(x / 2) + Math.floor(z / 2)) & 1) ? '#f1f3f5' : '#212529') },
  ring(x, z, col) { const m = new THREE.Mesh(new THREE.RingGeometry(.6, .9, 28), MB(col, { transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false })); m.rotation.x = -PI / 2; m.position.set(x, .12, z); scene.add(m); this.rings.push({ m, t: 0 }) },
  endRound(ok) {
    if (ok) { this.win++; this.score += 50; snd('win') } else this.lose++;
    if (this.win >= 2) return endGame(true, `완벽한 위장과 날카로운 눈! 색도 체온도 읽었어요. 점수 ${Math.floor(this.score)}`); if (this.lose >= 2) return endGame(false, this.why || '스포이드로 색을 찍고, 스캔 때는 단열 물건 옆으로!');
    this.ph = 'rest'; this.scan = 0; this.camOn = 0; scene.background.set('#2b2320'); $('#chBlind').style.opacity = 0; quiz(ok2 => { if (ok2) this.score += 30; toast(ok2 ? '정답! 점수 +30' : '다음 판!', '#ffd43b', .8); this.newRound() });
  },
  /* 내가 술래인 판 */
  upSeek(dt) {
    const t = this.t, SK = this.sk, S = SK.g.position, a = axis(); this.cone.visible = false;
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw), mx = Math.cos(this.yaw) * a.x - fx * a.y, mz = -Math.sin(this.yaw) * a.x - fz * a.y;
    for (let i = this.rings.length - 1; i >= 0; i--) { const r = this.rings[i]; r.t += dt; r.m.scale.setScalar(1 + r.t * 5); r.m.material.opacity = .9 * (1 - r.t); if (r.t >= 1) { scene.remove(r.m); this.rings.splice(i, 1) } }
    this.pt -= dt; this.camT -= dt; if (this.camOn > 0) this.camOn -= dt;
    const alive = this.npc.filter(n => n.alive);
    if (this.ph === 'prep') { $('#chBlind').style.opacity = 1; $('#chBlind').textContent = `🙈 눈 감는 중… ${Math.ceil(this.pt)}`; stand(SK, t); if (this.pt <= 0) { this.ph = 'seek'; this.pt = 60; this.wT = 10; $('#chBlind').style.opacity = 0; snd('hit'); toast('🖌️ 찾아라! 60초 안에 5명 모두', '#ff8787', 1.6) } }
    else if (this.ph === 'seek') {
      $('#chBlind').style.opacity = 0;
      if (a.x || a.y) { S.x = clamp(S.x + mx * 7 * dt, -21.6, 21.6); S.z = clamp(S.z + mz * 7 * dt, -21.6, 21.6); SK.g.rotation.y = Math.atan2(mx, mz); walk(SK, t * 11) } else stand(SK, t);
      SK.aR.rotation.x = this.tagT > 0 ? -2.2 : -1.2; this.tagT = (this.tagT || 0) - dt;
      this.wT -= dt; if (this.wT <= 0) { this.wT = 10; snd('jump'); alive.forEach(n => this.ring(n.x, n.z, '#ffd43b')); toast('📣 휘슬! 노란 고리를 봐요', '#ffd43b', 1) }
      if (hit('KeyK') && this.camT <= 0) { this.camT = 14; this.camOn = 3; snd('bad'); toast('🌡️ 열화상 카메라! 금속 옆 숨은이는 체온이 보여요', '#ffa94d', 1.6) }
      for (const n of this.npc) n.c.mat.emissive && n.c.mat.emissive.set(this.camOn > 0 && n.alive && n.warm ? '#ff5a00' : '#000000');
      if (hit('KeyJ') || hit('Space') || hit('Click')) { this.tagT = .25; const f = V3(Math.sin(SK.g.rotation.y), 0, Math.cos(SK.g.rotation.y)); let best = null, bd = 3; for (const n of alive) { const qx = n.x - S.x, qz = n.z - S.z, d = Math.hypot(qx, qz); if (d < bd && (d < 1.2 || (qx * f.x + qz * f.z) / d > .3)) { best = n; bd = d } }
        if (best) { best.alive = false; best.c.g.visible = false; this.found++; this.score += 40; this.ring(best.x, best.z, '#ff6b6b'); snd('hit'); toast(`🎯 ${best.n} 찾았다! (${this.found}/5)`, '#69db7c', 1) } else { this.pt -= 3; snd('bad'); toast('빗나감! -3초', '#ff8787', .6) } }
      if (!alive.length || this.found >= 5) return this.endRound(true);
      if (this.pt <= 0) { this.why = '휘슬 고리와 열화상 카메라로 숨은 곳을 좁혀 봐요!'; return this.endRound(false) }
    }
    scene.background.set(this.camOn > 0 ? '#2b1055' : '#2b2320'); $('#chScan').style.opacity = this.camOn > 0 ? .7 : 0; setBar(null);
    $('#chTop').innerHTML = '🏆 TOP 3<br>' + [['나', this.score]].concat(this.npc.map((n, i) => [n.n, this.npcS[i]])).sort((p, q) => q[1] - p[1]).slice(0, 3).map((r, i) => `<span>${i + 1}. ${r[0]} — ${Math.floor(r[1])}</span>`).join('<br>');
    const ban = $('#chBan'); ban.className = this.ph === 'prep' ? 'prep' : ''; ban.textContent = this.ph === 'prep' ? '🖌️ 이번엔 내가 술래!' : '🔎 숨은 사람을 모두 찾아라!';
    $('#chCnt').innerHTML = `<span class="r">🖌️ 나</span> &nbsp; <span class="b">🦎 ${alive.length}</span>${this.ph === 'seek' ? ` &nbsp; ⏱ ${Math.max(0, Math.ceil(this.pt))}` : ''}`;
    $('#chObj').innerHTML = `<b>J</b> 붓 태그 (빗나가면 -3초) · <b>K</b> 열화상 ${this.camT > 0 ? Math.ceil(this.camT) + '초' : '준비 ✅'}`;
    $('#chR').innerHTML = `내 점수: <span class="w">${Math.floor(this.score)}</span><br>${this.ph === 'seek' ? `다음 📣 휘슬: <span class="w">${Math.ceil(this.wT)}초</span><br>` : ''}${this.round}판 · 성공 ${this.win} / 실패 ${this.lose}<br>찾음 ${this.found}/5`;
    const cd = W < H ? 8 : 6.5, chh = W < H ? 4.6 : 3.8; let dd = cd, cx, cz; do { cx = S.x + Math.sin(this.yaw) * dd; cz = S.z + Math.cos(this.yaw) * dd; dd -= .4 } while (dd > 1.2 && (Math.abs(cx) > 21.8 || Math.abs(cz) > 21.8));
    cam.position.set(cx, chh, cz); cam.lookAt(S.x, 1.5, S.z);
    const q = new THREE.Quaternion(); scene.traverse(m => { if (m.userData.bill && m.parent) { m.parent.getWorldQuaternion(q); m.quaternion.copy(q.invert().multiply(cam.quaternion)) } });
  },
  update(dt) {
    this.t += dt; this.yaw -= lookDX * .0035 + this.dragX * .006 + ((K.KeyE ? 1 : 0) - (K.KeyQ ? 1 : 0)) * dt * 2.4; this.dragX = 0; if (this.role === 'seek') return this.upSeek(dt);
    const t = this.t, P = this.p.g.position, a = axis(); let moving = false;
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw), mx = Math.cos(this.yaw) * a.x - fx * a.y, mz = -Math.sin(this.yaw) * a.x - fz * a.y;
    if (!this.caught) {
      const sp = this.pose === 0 ? 7.5 : this.pose === 1 ? 3.5 : 1.2;
      if (a.x || a.y) { moving = true; P.x = clamp(P.x + mx * sp * dt, -21.6, 21.6); P.z = clamp(P.z + mz * sp * dt, -21.6, 21.6); this.p.g.rotation.y = Math.atan2(mx, mz); walk(this.p, t * 12) } else { stand(this.p, t); const w = this.artAt(P.x, P.z); if (w) this.p.g.rotation.y = Math.atan2(w.a.nx, w.a.nz) }
      if (hit('KeyJ') || hit('Space')) { this.skin.color.copy(this.bg(P.x, P.z)); snd('jump'); toast('💧 색 찍기!', '#fff', .5) } if (hit('KeyK')) { this.pose = (this.pose + 1) % 3; toast('포즈: ' + POSE[this.pose], '#fff', .5) }
    }
    this.setPose(this.p, this.pose);
    const o = this.near(P.x, P.z), diff = (() => { const c1 = this.skin.color, c2 = this.bg(P.x, P.z); return Math.hypot(c1.r - c2.r, c1.g - c2.g, c1.b - c2.b) })();
    this.pt -= dt; const SK = this.sk, S = SK.g.position;
    for (let i = this.rings.length - 1; i >= 0; i--) { const r = this.rings[i]; r.t += dt; r.m.scale.setScalar(1 + r.t * 5); r.m.material.opacity = .9 * (1 - r.t); if (r.t >= 1) { scene.remove(r.m); this.rings.splice(i, 1) } }
    if (this.ph === 'prep') { this.eye.material.color.set('#495057'); this.cone.visible = false; this.skl.material.opacity = 1; stand(SK, t); SK.head.rotation.x = .5; if (this.pt <= 0) { this.ph = 'seek'; this.pt = 40; SK.head.rotation.x = 0; snd('hit'); toast('🖌️ 찾는 시간! 40초 버티기', '#ff8787', 1.6) } }
    else if (this.ph === 'seek') {
      if (!this.caught) { this.score += dt * 10 } this.npc.forEach((n, i) => { if (n.alive) this.npcS[i] += dt * 10 });
      this.cone.visible = true; this.wT -= dt; if (this.scan > 0) this.scan -= dt;
      if (this.wT <= 0) {
        this.wT = 12; this.wk = 1 - this.wk;
        if (this.wk === 0) { this.scan = 3; snd('bad'); toast('🌡️ 열화상 스캔! 단열 물건 옆으로!', '#ffa94d', 1.6) }
        else { snd('jump'); setTimeout(() => snd('jump'), 150); const hs = this.npc.filter(n => n.alive).map(n => [n.x, n.z]); if (!this.caught) hs.push([P.x, P.z]); hs.forEach(h => this.ring(h[0], h[1], '#ffd43b')); if (hs.length) { hs.sort((p, q) => Math.hypot(p[0] - S.x, p[1] - S.z) - Math.hypot(q[0] - S.x, q[1] - S.z)); const tg = hs[Math.random() < .6 ? 0 : Math.random() * hs.length | 0]; this.wp = [clamp(tg[0] + rnd(-2, 2), -20, 20), clamp(tg[1] + rnd(-2, 2), -20, 20)] } toast('📣 휘슬! 숨은 사람들이 소리를 냈다', '#ffd43b', 1.4); if (!this.caught && Math.hypot(P.x - S.x, P.z - S.z) < 14) this.sus = clamp(this.sus + .2, 0, 1) }
      }
      scene.background.set(this.scan > 0 ? '#2b1055' : '#2b2320'); this.eye.material.color.set(this.scan > 0 ? '#ffa94d' : '#ff6b6b');
      if (!this.wp || Math.hypot(S.x - this.wp[0], S.z - this.wp[1]) < 1) this.wp = Math.random() < .4 ? [clamp(P.x + rnd(-9, 9), -20, 20), clamp(P.z + rnd(-9, 9), -20, 20)] : [rnd(-20, 20), rnd(-20, 20)];
      const dx = this.wp[0] - S.x, dz = this.wp[1] - S.z, l = Math.hypot(dx, dz) || 1; S.x += dx / l * 4.2 * dt; S.z += dz / l * 4.2 * dt; SK.g.rotation.y = Math.atan2(dx, dz); walk(SK, t * 9); SK.aR.rotation.x = -1.3 + Math.sin(t * 6) * .3;
      for (let i = 0; i < this.npc.length; i++) { const n = this.npc[i]; if (!n.alive) continue; const qx = n.x - S.x, qz = n.z - S.z, d = Math.hypot(qx, qz); if (d < 3.4 && (qx * dx + qz * dz) / (d * l || 1) > .4 && Math.random() < dt * .35) { n.alive = false; n.c.g.visible = false; this.ring(n.x, n.z, '#ff6b6b'); snd('hit'); toast(`🎯 ${n.n} 발견!`, '#ff8787', 1) } }
      if (!this.caught) {
        const px = P.x - S.x, pz = P.z - S.z, d = Math.hypot(px, pz), inView = d < 9 && (px * dx + pz * dz) / (d * l || 1) > .55; let rate = -.25;
        if (inView) rate = (clamp(diff * 1.6, 0, 1.2) + (moving ? 1.2 : 0)) * [1, .6, .4][this.pose] * (1.3 - d / 9) - .12;
        if (this.scan > 0 && d < 16) rate = Math.max(rate, o && o.ins ? -.2 : .75);
        this.sus = clamp(this.sus + rate * dt, 0, 1);
        if (this.sus >= 1) { this.caught = true; this.p.g.visible = false; this.ring(P.x, P.z, '#ff6b6b'); snd('bad'); flash(); shake = .6; this.why = this.scan > 0 ? (o ? `${o.n}은(는) 열이 잘 이동해요. 체온이 전해져 들켰어요!` : '주변에 단열 물건이 없어 체온이 보였어요!') : moving ? '움직이다 들켰어요!' : '몸 색이 주변과 달랐어요!'; toast('🎯 들켰다! ' + this.why, '#ff8787', 2.4); this.pt = Math.min(this.pt, 2.5) }
      }
      if (this.pt <= 0) return this.endRound(!this.caught);
    }
    // 화면 UI
    const left = this.npc.filter(n => n.alive).length + (this.caught ? 0 : 1) + Object.values(NET.rem).filter(r => r.d && !r.d[7]).length;
    const lead = [['나', this.score]].concat(this.npc.map((n, i) => [n.n, this.npcS[i]])).sort((p, q) => q[1] - p[1]).slice(0, 3);
    $('#chTop').innerHTML = '🏆 TOP 3<br>' + lead.map((r, i) => `<span>${i + 1}. ${r[0]} — ${Math.floor(r[1])}</span>`).join('<br>');
    const ban = $('#chBan'); ban.className = this.ph === 'prep' ? 'prep' : ''; ban.textContent = this.ph === 'prep' ? `🎨 숨을 시간 — ${Math.ceil(this.pt)}초` : this.caught ? '🎯 들켰다…' : this.scan > 0 ? '🌡️ 열화상 스캔 중!' : '🔎 찾는 시간 — 숨은 사람을 찾아라!';
    $('#chCnt').innerHTML = `<span class="r">🖌️ 1</span> &nbsp; <span class="b">🦎 ${left}</span>${this.ph === 'seek' ? ` &nbsp; ⏱ ${Math.ceil(this.pt)}` : ''}`;
    $('#chObj').innerHTML = this.ph === 'prep' ? `여기: ${o ? o.n + (o.ins ? ' (단열 ✅)' : ' (금속 ⚠️)') : '바닥'} · 색 차이 ${diff < .15 ? '✅' : diff < .5 ? '🟡' : '🔴'} · <b>J</b> 스포이드` : this.caught ? '다음 판을 기다려요' : this.scan > 0 ? `${o ? (o.ins ? '단열 ✅ 안전' : '금속 ⚠️ 위험!') : '⚠️ 단열 물건 옆으로!'}` : `색 차이 ${diff < .15 ? '✅ 거의 같음' : diff < .5 ? '🟡 조금 다름' : '🔴 많이 다름'}`;
    $('#chR').innerHTML = `내 점수: <span class="w">${Math.floor(this.score)}</span><br>${this.ph === 'seek' ? `다음 ${this.wk === 0 ? '📣 휘슬' : '🌡️ 열화상'}: <span class="w">${Math.ceil(this.wT)}초</span><br>` : ''}${this.round}판 · 성공 ${this.win} / 실패 ${this.lose}<br>포즈: ${POSE[this.pose]}`;
    setBar(this.ph === 'seek' && !this.caught ? this.sus : null); $('#chScan').style.opacity = this.scan > 0 ? 1 : 0;
    // 3인칭 카메라 (들키면 술래 관전)
    const F = this.caught ? S : P, cd = W < H ? 8 : 6.5, chh = W < H ? 4.2 : 3.3; let dd = cd, cx, cz; do { cx = F.x + Math.sin(this.yaw) * dd; cz = F.z + Math.cos(this.yaw) * dd; dd -= .4 } while (dd > 1.2 && (Math.abs(cx) > 21.8 || Math.abs(cz) > 21.8));
    cam.position.set(cx, chh, cz); cam.lookAt(F.x, 1.3, F.z);
    const q = new THREE.Quaternion(); scene.traverse(m => { if (m.userData.bill && m.parent) { m.parent.getWorldQuaternion(q); m.quaternion.copy(q.invert().multiply(cam.quaternion)) } });
  }
};
