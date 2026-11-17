/* 6. 달빛 검사단 RPG — 날씨와 우리 생활 */
const MT = { dew: ['이슬 요괴', '#74c0fc', 14, 4, 6, 3.2], fog: ['안개 요괴', '#ced4da', 34, 8, 14, 3.6], cloud: ['구름 요괴', '#f8f9fa', 70, 13, 26, 4], boss: ['저기압 태풍 대왕', '#5f3dc4', 520, 20, 300, 3] };
const QS = [
  { n: '이슬 요괴 5마리 퇴치', k: 'dew', c: 5, where: '서쪽 이슬 풀밭', talk: '새벽마다 풀잎에 이슬 요괴가 맺힌다네. 수증기가 차가운 풀잎에 응결한 것이지!', rw: '기술 "햇살 베기(K)"를 배웠다! 햇볕에 이슬이 증발해요', f() { this.skill = true } },
  { n: '안개 요괴 5마리 퇴치', k: 'fog', c: 5, where: '북쪽 안개 숲', talk: '안개는 땅 가까이에서 수증기가 응결해 떠 있는 것이라네. 앞이 잘 안 보이니 조심!', rw: '검 강화! 공격력 +8', f() { this.atk += 8 } },
  { n: '구름 요괴 5마리 퇴치', k: 'cloud', c: 5, where: '동쪽 구름 언덕', talk: '구름은 높은 하늘에서 수증기가 응결해 생기지. 물방울이 커지면 비가 된다네.', rw: '최대 체력 +50 · 남쪽 태풍의 문이 열렸다!', f() { this.mhp += 50; this.hp = this.mhp; this.gate.visible = false } },
  { n: '저기압 태풍 대왕 퇴치', k: 'boss', c: 1, where: '남쪽 태풍의 터', talk: '저기압 대왕이 구름과 비바람을 몰고 왔네. 고기압의 맑은 기운으로 물리치게!', rw: '', f() { } },
];
const GAME = {
  id: 'rpg', title: '달빛 검사단 RPG', sub: '날씨 요괴를 물리치고 마을에 맑은 하늘을!', emoji: '🗡️', unit: '날씨와 우리 생활', ghostH: 2.9,
  facts: ['<b>이슬</b>은 물체 표면에, <b>안개</b>는 지표면 가까이에, <b>구름</b>은 높은 하늘에 — 모두 수증기가 <b>응결</b>한 것이에요.', '<b>기상 요소</b>: 기온, 바람, 습도, 구름의 양, 강수량.', '<b>고기압</b>은 맑은 날씨, <b>저기압</b>은 흐리고 비 오는 날씨. 바람은 고기압에서 저기압으로 불어요.'],
  how: '마을의 <b>기상 박사</b>에게 임무를 받고, 요괴를 물리쳐 <b>경험치·골드</b>를 모아 레벨을 올려요. 임무를 끝내고 박사에게 돌아가 <b>퀴즈</b>를 맞히면 보상! 상점(🏪)에서는 골드로 물약과 강화를 사요. 쓰러져도 마을에서 다시 일어나요.',
  help: '이동 WASD · 베기 J · 햇살 베기 K · 물약 L · 상점에서 1 물약 / 2 검 강화',
  quiz: [
    { q: '이른 아침 풀잎에 맺힌 물방울(이슬)은 어떻게 생길까요?', a: ['공기 중 수증기가 차가운 풀잎에서 응결해서', '밤에 비가 와서', '풀이 물을 뿜어서', '땅에서 물이 튀어서'], e: '밤에 차가워진 물체 표면에 수증기가 응결해 이슬이 맺혀요.' },
    { q: '안개와 구름의 차이는?', a: ['생기는 높이 — 안개는 지표면 가까이, 구름은 높은 하늘', '안개는 얼음, 구름은 연기', '안개는 여름에만 생긴다', '차이가 없다'], e: '둘 다 수증기가 응결한 것이고, 떠 있는 위치가 달라요.' },
    { q: '구름에서 비가 내리는 과정은?', a: ['구름 속 작은 물방울이 합쳐져 무거워지면 떨어진다', '구름이 통째로 떨어진다', '바람이 물을 뿌린다', '햇빛이 물로 변한다'], e: '물방울이 커지고 무거워져 떨어지면 비, 얼음 알갱이가 녹지 않고 떨어지면 눈이에요.' },
    { q: '저기압인 곳의 날씨는?', a: ['구름이 많고 비가 오기 쉽다', '항상 맑다', '바람이 전혀 없다', '기온이 0℃다'], e: '저기압에서는 공기가 위로 올라가 구름이 잘 생겨요.' },
    { q: '고기압과 저기압 사이에서 바람은?', a: ['고기압에서 저기압으로 분다', '저기압에서 고기압으로 분다', '불지 않는다', '위로만 분다'], e: '공기가 기압이 높은 곳에서 낮은 곳으로 이동하는 것이 바람이에요.' },
    { q: '기상 요소로 알맞게 짝지은 것은?', a: ['기온·습도·바람·강수량', '요일·시간·날짜', '키·몸무게', '색깔·모양'], e: '날씨는 기온, 바람, 습도, 구름의 양, 강수량 같은 기상 요소로 나타내요.' },
    { q: '날씨가 우리 생활에 주는 영향으로 알맞은 것은?', a: ['비 예보가 있으면 우산을 챙기고 야외 행사를 바꾼다', '날씨는 생활과 상관없다', '맑으면 항상 우산을 쓴다', '습도는 빨래와 상관없다'], e: '옷차림, 농사, 교통, 행사 등 생활 곳곳이 날씨의 영향을 받아요.' },
  ],
  net() { const P = this.p.g.position; return [P.x, 0, P.z, this.p.g.rotation.y, this.lv] },
  zone(x, z) { return Math.hypot(x, z) < 13 ? 'town' : z > Math.abs(x) ? 'boss' : -z > Math.abs(x) ? 'fog' : x < 0 ? 'dew' : 'cloud' },
  init() {
    newScene('#a5d8ff', 50, 150); box(null, 200, .2, 200, '#69b55f', 0, -.1, 0);
    cyl(null, 13, 13, .1, '#e8c99a', 0, .02, 0, 32); box(null, 60, .05, 60, '#8ad1a0', -45, .01, 0); box(null, 60, .05, 60, '#5a7d62', 0, .01, -45); box(null, 60, .05, 60, '#cfe8ff', 45, .01, 0); box(null, 60, .05, 46, '#6b5b95', 0, .01, 40);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; box(null, 3.4, 2.6, 3.4, '#ffe8cc', Math.cos(a) * 9, 1.3, Math.sin(a) * 9 - 0); cone(null, 3, 2, '#e8590c', Math.cos(a) * 9, 3.6, Math.sin(a) * 9, 4).rotation.y = PI / 4 }
    for (let i = 0; i < 40; i++) { const x = rnd(-30, 30), z = rnd(-72, -18); cyl(null, .35, .45, 3, '#3d2b1f', x, 1.5, z, 8); cone(null, 2, 4, '#27492d', x, 4.6, z, 8) }
    for (let i = 0; i < 14; i++) sph(null, rnd(2, 4), '#fff', rnd(22, 70), rnd(.5, 1.5), rnd(-28, 28), 1.4, .5, 1);
    for (let i = 0; i < 30; i++) cone(null, .25, 1, '#2f9e44', rnd(-70, -18), .5, rnd(-28, 28), 5);
    this.npc = person({ top: '#fff', hat: '#1c7ed6', hair: '#dee2e6' }); this.npc.g.position.set(-3, 0, -3); scene.add(this.npc.g); label(this.npc.g, '기상 박사', 2.4, .6, '#1c7ed6', '#fff', 0, 3, 0, 40); this.mark = label(this.npc.g, '❗', 1, 1, null, '#ffd43b', 0, 4, 0, 90);
    const sh = new THREE.Group(); sh.position.set(5, 0, -2); scene.add(sh); box(sh, 3, 2, 2, '#ffd43b', 0, 1, 0); label(sh, '🏪 상점', 2.6, .7, '#e8590c', '#fff', 0, 2.8, 0, 40); this.shop = sh;
    this.gate = box(null, 16, 4, 1, '#5f3dc4', 0, 2, 17); label(this.gate, '🌀 태풍의 문 (임무 3 후 열림)', 12, 1, null, '#fff', 0, 0, .6, 40);
    this.p = person({ top: NET.col, bottom: '#212529', hair: '#111', s: 1.05 }); scene.add(this.p.g); const sw = new THREE.Group(); this.p.aR.add(sw); sw.position.set(0, -.6, .1); box(sw, .08, .1, 1.7, '#e9ecef', 0, 0, .9); box(sw, .3, .12, .1, '#fab005', 0, 0, .1);
    this.arc = new THREE.Mesh(new THREE.RingGeometry(1.2, 2.9, 20, 1, -PI / 3, PI / 1.5), MB('#fff', { transparent: true, opacity: 0, side: THREE.DoubleSide })); this.arc.rotation.x = -PI / 2; scene.add(this.arc);
    this.ms = []; this.lv = 1; this.xp = 0; this.hp = 100; this.mhp = 100; this.mp = 50; this.atk = 10; this.gold = 0; this.pot = 2; this.skill = false; this.q = 0; this.qc = 0; this.qst = 'new'; this.t = 0; this.cd = 0; this.inv = 0; this.sw = 0; this.talkT = 0; this.bossM = null; this.sun = 0;
    for (const k of ['dew', 'fog', 'cloud']) for (let i = 0; i < 6; i++) this.mk(k);
    setBtns([{ k: 'KeyL', i: '🧪', l: '물약' }, { k: 'KeyK', i: '☀️', l: '햇살' }, { k: 'KeyJ', i: '🗡️', l: '베기' }]);
  },
  mk(k) { const T = MT[k], g = new THREE.Group(); let x, z; if (k === 'dew') { x = rnd(-68, -20); z = rnd(-26, 26) } else if (k === 'fog') { x = rnd(-26, 26); z = rnd(-68, -20) } else if (k === 'cloud') { x = rnd(20, 68); z = rnd(-26, 26) } else { x = 0; z = 46 }
    const s = k === 'boss' ? 3.4 : 1; if (k === 'dew') { sph(g, .8, T[1], 0, .8, 0, 1, 1.15, 1); cone(g, .45, .7, T[1], 0, 1.75, 0) } else { for (let i = 0; i < 4; i++) sph(g, .7, T[1], Math.cos(i * 1.6) * .6, .9 + (i % 2) * .3, Math.sin(i * 1.6) * .4) } for (const sd of [-1, 1]) sph(g, .12, '#111', sd * .28, 1, .72); if (k === 'boss') { const r = new THREE.Mesh(new THREE.TorusGeometry(1.6, .18, 6, 20), M('#b197fc')); r.rotation.x = PI / 2; r.position.y = .5; g.add(r); g.userData.ring = r }
    g.scale.setScalar(s); g.position.set(x, 0, z); scene.add(g); const hb = label(g, T[0], 2.6 / s * (k === 'boss' ? 2 : 1), .5 / s * (k === 'boss' ? 2 : 1), '#111', '#fff', 0, 2.6, 0, 40); const m = { g, k, x, z, hx: x, hz: z, hp: T[2], mhp: T[2], atk: T[3], xp: T[4], v: T[5], cd: 0, stun: 0, hb }; this.ms.push(m); return m },
  hitM(m, dmg, strong) {
    if (strong && (m.k === 'dew' || m.k === 'fog')) dmg *= 2; m.hp -= dmg; m.stun = .25; const dx = m.x - this.p.g.position.x, dz = m.z - this.p.g.position.z, l = Math.hypot(dx, dz) || 1; if (m.k !== 'boss') { m.x += dx / l * 1.6; m.z += dz / l * 1.6 } snd('hit'); m.g.scale.y = m.g.scale.x * .75;
    if (m.hp <= 0) { scene.remove(m.g); this.ms.splice(this.ms.indexOf(m), 1); this.xp += m.xp; this.gold += Math.round(m.xp * .8); if (QS[this.q] && QS[this.q].k === m.k && this.qst === 'on') { this.qc++; if (this.qc >= QS[this.q].c) { this.qst = 'done'; toast('임무 완료! 기상 박사에게 돌아가요', '#ffd43b', 2) } } if (m.k === 'boss') { this.won = true; return } const k = m.k; setTimeout(() => { if (playing && this.ms.filter(x => x.k === k).length < 6) this.mk(k) }, 5000);
      while (this.xp >= this.lv * 30) { this.xp -= this.lv * 30; this.lv++; this.mhp += 18; this.hp = this.mhp; this.atk += 3; snd('win'); toast(`⬆️ 레벨 ${this.lv}! 체력·공격력 상승`, '#ffd43b', 1.4) } }
  },
  update(dt) {
    this.t += dt; const t = this.t, P = this.p.g.position, a = axis(); this.cd -= dt; this.inv -= dt; this.talkT -= dt; this.mp = Math.min(50, this.mp + 4 * dt);
    if (this.won) return endGame(true, `저기압 대왕 퇴치! 고기압이 찾아와 마을 하늘이 맑아졌어요. (레벨 ${this.lv})`);
    let nx = P.x + a.x * 8.5 * dt, nz = P.z + a.y * 8.5 * dt; if (this.gate.visible && this.zone(nx, nz) === 'boss') { nx = P.x; nz = P.z; if (this.talkT <= 0) { this.talkT = 2; toast('🌀 태풍의 문이 닫혀 있어요 (임무 3 완료 후)', '#b197fc', 1.4) } } P.x = clamp(nx, -72, 72); P.z = clamp(nz, -72, 62);
    if (a.x || a.y) { this.p.g.rotation.y = Math.atan2(a.x, a.y); walk(this.p, t * 12) } else stand(this.p, t);
    const face = V3(Math.sin(this.p.g.rotation.y), 0, Math.cos(this.p.g.rotation.y)), zn = this.zone(P.x, P.z);
    scene.fog.far = lerp(scene.fog.far, zn === 'fog' ? 30 : zn === 'boss' ? 70 : 150, dt * 2); scene.fog.color.lerp(new THREE.Color(zn === 'fog' ? '#ced4da' : zn === 'boss' ? '#3b2f63' : '#a5d8ff'), dt * 2); scene.background.copy(scene.fog.color);
    const inShop = Math.hypot(P.x - 5, P.z + 2) < 3.2; if (inShop) { if (hit('KeyJ')) KP.Digit1 = 1; if (hit('KeyK')) KP.Digit2 = 1; delete KP.KeyJ; delete KP.KeyK }
    // 공격
    if (hit('KeyJ') && this.cd <= 0) { this.cd = .32; this.sw = .2; snd('shot'); this.arc.material.color.set('#fff'); this.arc.material.opacity = .8; this.arc.position.set(P.x, .3, P.z); this.arc.rotation.z = this.p.g.rotation.y - PI / 2; this.arc.scale.setScalar(1); for (const m of this.ms.slice()) { const dx = m.x - P.x, dz = m.z - P.z, d = Math.hypot(dx, dz), r = m.k === 'boss' ? 5.2 : 3.2; if (d < r && (dx * face.x + dz * face.z) / (d || 1) > .2) this.hitM(m, this.atk + rnd(0, 4)) } }
    if (hit('KeyK')) { if (!this.skill) toast('아직 배우지 않은 기술이에요', '#ddd', .8); else if (this.mp < 25) toast('기력 부족!', '#ddd', .6); else if (this.cd <= 0) { this.mp -= 25; this.cd = .5; this.sw = .3; this.sun = .5; snd('win'); flash(); toast('☀️ 햇살 베기! 물방울이 증발한다', '#ffd43b', .9); this.arc.material.color.set('#ffd43b'); this.arc.material.opacity = .9; this.arc.position.set(P.x, .3, P.z); this.arc.scale.setScalar(2.2); for (const m of this.ms.slice()) if (Math.hypot(m.x - P.x, m.z - P.z) < (m.k === 'boss' ? 9 : 7)) this.hitM(m, this.atk * 1.6, true) } }
    if (hit('KeyL')) { if (this.pot > 0 && this.hp < this.mhp) { this.pot--; this.hp = Math.min(this.mhp, this.hp + 60); snd('ok'); toast('🧪 체력 +60', '#69db7c', .7) } else toast(this.pot ? '체력이 가득해요' : '물약이 없어요', '#ddd', .6) }
    this.arc.material.opacity = Math.max(0, this.arc.material.opacity - dt * 3.5); if (this.sw > 0) { this.sw -= dt; this.p.aR.rotation.x = -2.6 + (.25 - this.sw) * 10 } else this.p.aR.rotation.x = -.5;
    // 박사·상점
    const nd = Math.hypot(P.x + 3, P.z + 3), Q = QS[this.q]; this.mark.visible = !!Q && this.qst !== 'on'; this.mark.position.y = 4 + Math.sin(t * 4) * .2;
    if (Q && nd < 3 && this.talkT <= 0) { if (this.qst === 'new') { this.qst = 'on'; this.qc = 0; this.talkT = 3; snd('ok'); toast(`📜 ${Q.talk}`, '#fff', 4.5); if (Q.k === 'boss' && !this.bossM) this.bossM = this.mk('boss') } else if (this.qst === 'done') { this.talkT = 3; quiz(ok => { if (!ok) { toast('박사: "다시 생각해 보게!" (다시 말 걸기)', '#ddd', 1.6); return } Q.f.call(this); this.gold += 40; toast('🎁 ' + (Q.rw || '보상!'), '#ffd43b', 3); this.q++; this.qst = 'new' }) } }
    if (Math.hypot(P.x - 5, P.z + 2) < 3.2) { if (hit('Digit1')) { if (this.gold >= 20) { this.gold -= 20; this.pot++; snd('ok'); toast('🧪 물약 구입', '#69db7c', .6) } else toast('골드 부족 (20)', '#ddd', .6) } if (hit('Digit2')) { const c = 60 + (this.up || 0) * 40; if (this.gold >= c) { this.gold -= c; this.up = (this.up || 0) + 1; this.atk += 5; snd('ok'); toast('🗡️ 검 강화! 공격력 +5', '#ffd43b', .8) } else toast(`골드 부족 (${c})`, '#ddd', .6) } }
    // 요괴
    for (const m of this.ms) {
      const dx = P.x - m.x, dz = P.z - m.z, d = Math.hypot(dx, dz), agg = m.k === 'boss' ? 40 : 11, safe = Math.hypot(P.x, P.z) < 13; m.cd -= dt;
      if (m.stun > 0) m.stun -= dt; else if (d < agg && !safe) { m.x += dx / d * m.v * dt; m.z += dz / d * m.v * dt } else { const bx = m.hx - m.x, bz = m.hz - m.z, bl = Math.hypot(bx, bz); if (bl > 1) { m.x += bx / bl * 2 * dt; m.z += bz / bl * 2 * dt } }
      m.g.position.set(m.x, m.k === 'dew' ? Math.abs(Math.sin(t * 5 + m.hx)) * .5 : .3 + Math.sin(t * 2 + m.hx) * .2, m.z); m.g.rotation.y = Math.atan2(dx, dz); m.g.scale.y = lerp(m.g.scale.y, m.g.scale.x, dt * 8); if (m.g.userData.ring) m.g.userData.ring.rotation.z += dt * 4;
      const reach = m.k === 'boss' ? 4.6 : 1.5; if (d < reach && m.cd <= 0 && this.inv <= 0 && !safe) { m.cd = 1.1; this.inv = .5; this.hp -= m.atk; shake = .4; snd('bad'); flash() }
      if (m.k === 'boss' && Math.sin(t * .9) > .97 && d < 30) { P.x += dx / d * -14 * dt * 6; toast('🌀 비바람! 밀려난다', '#b197fc', .6) }
    }
    if (this.hp <= 0) { this.hp = this.mhp; const lose = Math.floor(this.gold * .2); this.gold -= lose; P.set(0, 0, 3); snd('bad'); toast(`쓰러졌다… 마을에서 다시! (골드 -${lose})`, '#ff8787', 2) }
    const zname = { town: '🏘️ 마을', dew: '🌿 이슬 풀밭', fog: '🌫️ 안개 숲', cloud: '☁️ 구름 언덕', boss: '🌀 태풍의 터' }[zn];
    setObj(Q ? (this.qst === 'new' ? `📜 <b>기상 박사</b>(❗)에게 가서 임무 받기` : this.qst === 'done' ? `✅ <b>기상 박사</b>에게 보고하기 (퀴즈)` : `📜 ${Q.n} <b>${this.qc}/${Q.c}</b> · ${Q.where}`) : '끝!'); if (Math.hypot(P.x - 5, P.z + 2) < 3.2) setObj('🏪 <b>1(J)</b> 물약 20G · <b>2(K)</b> 검 강화 ' + (60 + (this.up || 0) * 40) + 'G');
    setStat(`Lv.<b>${this.lv}</b> ❤️${Math.max(0, Math.round(this.hp))}/${this.mhp} ⚡${Math.round(this.mp)}<br>💰${this.gold} 🧪${this.pot} 🗡️${this.atk} · ${zname}`); setBar(this.xp / (this.lv * 30));
    cam.position.set(P.x, W < H ? 26 : 19, P.z + (W < H ? 16 : 13)); cam.lookAt(P.x, 0, P.z - 1);
  }
};
