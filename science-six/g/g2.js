/* 2. 무궁화 운동회 — 혼합물의 분리 · 열과 우리 생활 · 날씨와 우리 생활 · 자원과 에너지 */
const SEP = ['체로 거르기', '가라앉혀 기울여 따르기', '물에 녹여 거르기', '가열해 증발시키기'];
const SEPQ = [['콩과 좁쌀이 섞였어요', 0], ['자갈과 모래가 섞였어요', 0], ['흙탕물에서 맑은 물만!', 1], ['물과 식용유가 섞였어요', 1], ['소금과 모래가 섞였어요', 2], ['설탕과 모래가 섞였어요', 2], ['소금물에서 소금만!', 3], ['바닷물로 소금 만들기', 3]];
const HEAT = [['구리 판', '나무 판'], ['철 냄비', '솜이불'], ['알루미늄 판', '스타이로폼'], ['쇠 숟가락', '플라스틱 판'], ['금속 쟁반', '뽁뽁이(공기층)'], ['은 접시', '코르크 판'], ['철판', '두꺼운 털옷']];
const WOX = [['이슬은 수증기가 응결해 물체 표면에 맺힌 것이다', 1], ['안개는 아주 높은 하늘에서만 생긴다', 0], ['구름은 수증기가 응결해 하늘에 떠 있는 것이다', 1], ['기온·바람·습도·구름의 양·강수량은 기상 요소다', 1], ['고기압인 곳은 대체로 흐리고 비가 온다', 0], ['저기압인 곳은 구름이 많고 비가 오기 쉽다', 1], ['습도가 높으면 빨래가 더 빨리 마른다', 0], ['이슬·안개·구름은 모두 수증기가 응결해 생긴다', 1], ['습도는 공기 중에 수증기가 들어 있는 정도다', 1]];
const TUG = [['재생에너지는?', '풍력', '석탄'], ['언젠가 고갈되는 자원은?', '석유', '햇빛'], ['에너지를 아끼는 행동은?', '빈방 불 끄기', '문 열고 난방'], ['재생에너지는?', '태양광', '천연가스'], ['효율이 높은 전등은?', 'LED', '백열등'], ['종이를 만드는 자원은?', '나무', '철광석']];
const GAME = {
  id: 'fest', maxP: 24, title: '무궁화 운동회', sub: '시즌 2 · 돌아온 우승자, 이번엔 게임을 멈추러 왔다', emoji: '🌻', unit: '혼합물의 분리 · 열 · 날씨 · 자원과 에너지',
  facts: ['<b>혼합물의 분리</b>: 알갱이 크기가 다르면 체로, 섞이지 않는 액체는 기울여 따르고, 물에 녹는 것은 녹여 거른 뒤 증발!', '<b>열의 이동</b>: 금속은 열이 잘 이동하고, 나무·솜·스타이로폼·공기층은 잘 이동하지 않아요(단열).', '<b>날씨</b>: 이슬·안개·구름은 수증기가 응결한 것. 고기압은 맑고 저기압은 흐려요.', '<b>자원과 에너지</b>: 화석 연료는 유한, 태양광·풍력은 재생에너지.'],
  how: '<b>이야기</b>: 지난 대회 우승자였던 나는 이 서바이벌을 멈추려고 참가자로 다시 들어왔다. 게임이 끝날 때마다 <b>계속/그만 투표</b>가 열리고, 6게임을 마치면 참가자들의 <b>반란</b>이 시작돼요!<br>로비의 <b>황금돼지 저금통</b>에 상금 500만원(5만원권 100장)이 들어 있어요. 종목마다 <b>출발 전에 문제를 맞혀야</b> 뛸 수 있어요. ① 무궁화 꽃이 피었습니다 → ② 분리 방법 발판 → ③ 달고나 모양 따기 → ④ 단열 징검다리 → ⑤ 날씨 OX 달리기 → ⑥ 에너지 줄다리기. 틀리거나 아웃되면 상금이 줄어요!',
  help: '이동: WASD · 방향키   ·   줄다리기: J 연타 + ←/→ 고르기',
  quiz: [
    { u: 'e', q: '다음 중 재생에너지는?', a: ['태양광', '석탄', '석유', '천연가스'], e: '태양광·풍력처럼 계속 다시 얻을 수 있는 에너지를 재생에너지라고 해요.' },
    { u: 'e', q: '석유 같은 자원을 아껴 써야 하는 까닭은?', a: ['양이 정해져 있어 언젠가 없어지기 때문', '너무 많아서', '쓸수록 늘어나서', '맛이 없어서'], e: '자원은 유한해요. 아껴 쓰고 효율적으로 써야 해요.' },
    { u: 's', q: '소금과 모래의 혼합물을 분리하는 순서는?', a: ['물에 녹인다 → 거른다 → 거른 물을 증발시킨다', '체로 거른다 → 끝', '자석을 댄다', '얼린다'], e: '소금만 물에 녹는 성질을 이용해 거르고, 거른 소금물을 가열해 물을 증발시키면 소금을 얻어요.' },
    { u: 's', q: '콩, 팥, 좁쌀 혼합물을 분리할 때 이용하는 성질은?', a: ['알갱이의 크기 차이', '물에 녹는 성질', '색깔', '맛'], e: '알갱이 크기가 다른 고체 혼합물은 눈의 크기가 다른 체로 분리해요.' },
    { u: 'h', q: '뜨거운 물이 든 컵을 차가운 물에 담그면?', a: ['뜨거운 물은 식고 차가운 물은 따뜻해져 온도가 같아진다', '둘 다 더 뜨거워진다', '변화가 없다', '차가운 물이 더 차가워진다'], e: '온도가 다른 두 물체가 접촉하면 열이 높은 곳에서 낮은 곳으로 이동해 온도가 같아져요.' },
    { u: 'h', q: '보온병이 음료의 온도를 오래 유지하는 까닭은?', a: ['열의 이동을 막는 단열 구조라서', '열을 스스로 만들어서', '금속이라 열이 잘 통해서', '물이 얼어서'], e: '단열은 열의 이동을 줄이는 것이에요. 이중벽·공기층이 열 이동을 막아요.' },
    { u: 'w', q: '이슬과 안개의 공통점은?', a: ['수증기가 응결해 생긴다', '얼음이 녹아 생긴다', '비가 고여 생긴다', '바람이 만들었다'], e: '둘 다 공기 중 수증기가 응결한 것이에요. 이슬은 물체 표면, 안개는 지표면 가까이에 떠 있어요.' },
    { u: 'w', q: '고기압인 곳의 날씨는 대체로 어떨까요?', a: ['맑다', '비가 많이 온다', '눈이 온다', '안개만 낀다'], e: '고기압에서는 대체로 날씨가 맑고, 저기압에서는 구름이 많고 비가 오기 쉬워요.' },
    { u: 'e', q: '에너지를 효율적으로 쓰는 방법은?', a: ['에너지 소비 효율이 높은 제품을 쓴다', '빈방 전등을 켜 둔다', '냉장고 문을 열어 둔다', '가까운 거리도 차를 탄다'], e: '효율이 높으면 같은 일을 하면서 에너지를 덜 써요.' },
    { u: 'e', q: '풍력 발전이 이용하는 것은?', a: ['바람', '석탄', '석유', '우라늄'], e: '풍력 발전은 바람으로 날개를 돌려 전기를 만드는 재생에너지예요.' },
    { u: 'e', q: '자원이 유한하다는 뜻은?', a: ['양이 정해져 있어 다 쓰면 없어진다', '끝없이 많다', '저절로 늘어난다', '쓸 수 없다'], e: '그래서 자원을 아껴 쓰고 재활용해요.' },
    { u: 's', q: '흙탕물에서 맑은 물을 얻는 방법은?', a: ['흙을 가라앉힌 뒤 윗물만 기울여 따른다', '체로 친다', '얼린다', '흔든다'], e: '골고루 섞이지 않는 혼합물은 가라앉힌 뒤 기울여 따라 분리해요.' },
    { u: 's', q: '바닷물에서 소금을 얻는 염전은 어떤 방법을 쓸까요?', a: ['햇빛과 바람으로 물을 증발시킨다', '체로 거른다', '자석으로 끌어당긴다', '기울여 따른다'], e: '물을 증발시키면 녹아 있던 소금이 남아요.' },
    { u: 's', q: '물과 식용유처럼 섞이지 않는 액체를 분리하려면?', a: ['층이 나뉜 뒤 위층을 기울여 따른다', '체로 거른다', '증발시킨다', '가루를 넣는다'], e: '섞이지 않는 액체는 층이 나뉘므로 기울여 따라 분리할 수 있어요.' },
    { u: 'h', q: '달고나를 만들 때 국자 손잡이가 뜨거워지는 까닭은?', a: ['열이 금속 국자를 따라 이동해서', '설탕이 손잡이로 올라와서', '공기가 차가워서', '국자가 열을 만들어서'], e: '고체에서는 열이 온도가 높은 곳에서 낮은 곳으로 물질을 따라 이동해요.' },
    { u: 'h', q: '다음 중 열이 잘 이동하지 않는 물질은?', a: ['스타이로폼', '구리', '철', '알루미늄'], e: '스타이로폼·솜·나무는 열이 잘 이동하지 않아 단열에 써요.' },
    { u: 'h', q: '물체의 온도를 정확히 알려면?', a: ['온도계로 측정한다', '손으로 만져 본다', '눈으로 본다', '무게를 잰다'], e: '온도는 온도계로 측정하고 ℃로 나타내요.' },
    { u: 'w', q: '날씨를 나타내는 기상 요소가 아닌 것은?', a: ['요일', '기온', '습도', '강수량'], e: '기상 요소: 기온, 바람, 습도, 구름의 양, 강수량.' },
    { u: 'w', q: '구름은 어떻게 생길까요?', a: ['수증기가 높은 하늘에서 응결해서', '연기가 모여서', '바다가 날아가서', '바람이 얼어서'], e: '공기 중 수증기가 응결해 작은 물방울·얼음 알갱이로 떠 있는 것이 구름이에요.' },
    { u: 'w', q: '저기압이 다가오면 날씨는?', a: ['구름이 많아지고 비가 오기 쉽다', '아주 맑아진다', '변화가 없다', '기온이 100℃가 된다'], e: '저기압에서는 흐리고 비가 오기 쉬워요.' },
  ],
  net() { const P = this.p.g.position; return [P.x, P.y, P.z, this.p.g.rotation.y, Math.max(0, this.round - 1) * 100 + Math.round(this.prog * 99), this.hp <= 0 ? 1 : 0, this.num] },
  ghost(r) { if (r.d[6] && r.bib !== r.d[6]) { r.bib = r.d[6]; box(r.g.body, .5, .4, .02, '#fff', 0, .15, -.24); label(r.g.body, String(r.d[6]), .46, .3, null, '#111', 0, .15, -.26, 50).rotation.y = PI } if (r.d[5] && !r.inked) { r.inked = 1; this.ink(r.g.g.position, r.g, () => { r.g.body.rotation.x = -1.2; r.g.body.position.y = .45 }); this.say(`참가자 ${r.d[6] || ''}번 ${r.n} 탈락`) } if (r.inked) { r.g.body.rotation.x = -1.2; r.g.body.position.y = .45 } },
  /* 먹물 — 피 대신 먹물 풍선을 맞고 탈락 */
  ink(tp, who, cb, me) {
    let best = null, bd = 1e9; const w = V3(); for (const L of this.robos) { L.getWorldPosition(w); const d = w.distanceTo(tp); if (d < bd) { bd = d; best = w.clone() } } if (!best || bd > 45) best = V3(tp.x, 12, tp.z + 6);
    if (this.round === 1 && this.it && Math.abs(tp.z + 56) < 70) { this.it.getWorldPosition(w); w.y += 7; if (w.distanceTo(tp) < bd + 30) best = w.clone() }
    const m = sph(null, .32, '#111', best.x, best.y, best.z); m.castShadow = false; this.inks.push({ m, a: best, who, tp, k: 0, cb, me }); snd('jump');
  },
  splat(who, tp) {
    if (who && who.body) for (let i = 0; i < 5; i++) { const b = sph(who.body, rnd(.1, .2), '#111', rnd(-.35, .35), rnd(-.2, 1.2), pick([.25, -.25]), 1, 1, .35); b.castShadow = false }
    const d = add(null, new THREE.CircleGeometry(1, 14), MB('#111', { transparent: true, opacity: .85, depthWrite: false }), tp.x + rnd(-.4, .4), .06, tp.z + rnd(-.4, .4)); d.rotation.x = -PI / 2; d.scale.set(rnd(.9, 1.5), rnd(.7, 1.2), 1); d.castShadow = false; this.puddles.push(d); if (this.puddles.length > 40) scene.remove(this.puddles.shift());
  },
  inkScreen() { let o = document.getElementById('inkOv'); if (!o) { o = document.createElement('div'); o.id = 'inkOv'; o.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:7;opacity:0;transition:opacity 1.6s'; o.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%"><g fill="#0b0b0f">' + [[20, 30, 14], [75, 22, 11], [60, 70, 16], [15, 78, 10], [42, 50, 8], [88, 60, 9], [32, 12, 6], [50, 90, 7]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}"/><circle cx="${c[0] + c[2] * .9}" cy="${c[1] + c[2] * .6}" r="${c[2] * .35}"/><circle cx="${c[0] - c[2]}" cy="${c[1] - c[2] * .4}" r="${c[2] * .25}"/>`).join('') + '</g></svg>'; document.body.appendChild(o) } o.style.transition = 'none'; o.style.opacity = .78; requestAnimationFrame(() => requestAnimationFrame(() => { o.style.transition = 'opacity 1.6s'; o.style.opacity = 0 })) },
  inkTick(dt) { for (let i = this.inks.length - 1; i >= 0; i--) { const I = this.inks[i]; I.k += dt / .5; const k = Math.min(1, I.k), tp = I.tp; I.m.position.set(lerp(I.a.x, tp.x, k), lerp(I.a.y, tp.y + 1.4, k) + Math.sin(k * PI) * 2, lerp(I.a.z, tp.z, k)); if (k >= 1) { scene.remove(I.m); this.inks.splice(i, 1); snd('hit'); this.splat(I.who, tp); if (I.me) this.inkScreen(); if (I.cb) I.cb() } } },
  pads(z, n, w) { const a = []; for (let i = 0; i < n; i++) { const g = new THREE.Group(); g.position.set((i - (n - 1) / 2) * (w + .6), 0, z); scene.add(g); g.userData.pl = box(g, w, .3, 4.4, '#ffe066', 0, -.1, 0); a.push(g) } return a },
  text(g, t, w) { [...g.children].filter(m => m.userData.lb).forEach(m => g.remove(m)); const l = label(g, t, w * .95, 1.2, '#fff', '#111', 0, 2.3, -2, 40); l.userData.lb = 1; const st = box(g, .15, 1.8, .15, '#868e96', 0, .9, -2); st.userData.lb = 1 },
  init() {
    newScene('#ffd8a8', 70, 190, { ground: '#b08968' });
    box(null, 34, .2, 330, '#d9a86c', 0, -.1, -130); for (const x of [-17, 17]) box(null, 1, 5, 330, '#74c0fc', x, 2.5, -130);
    // R1
    for (let z = 0; z >= -50; z -= 10) box(null, 30, .02, .2, '#fff', 0, .02, z); box(null, 30, .03, .6, '#e03131', 0, .03, -50);
    const s = new THREE.Group(); s.position.set(0, 0, -57); scene.add(s);
    const RD = '#e03131'; sph(s, 3.2, RD, 0, 3.2, 0, 1, .95, 1); sph(s, 2.2, '#fff5f5', 0, 3, 2.1, 1, 1.05, .5); for (let i = 0; i < 5; i++) sph(s, .35, '#ffd43b', Math.cos(i * 1.26) * 1.1, 3 + Math.sin(i * 1.26) * 1.1, 3.05, 1, 1, .3);
    sph(s, 2, '#ffe3c4', 0, 7.2, 0); sph(s, 2.15, RD, 0, 8.3, -.4, 1, .6, 1); cone(s, .9, 1.4, '#ffd43b', 0, 9.8, 0, 12);
    for (const sx of [-1, 1]) { sph(s, .5, '#fff', sx * .7, 7.3, 1.75, 1, 1, .4); sph(s, .5, '#ffa8a8', sx * 1.2, 6.6, 1.6, 1, .6, .3) } this.eyes = [-1, 1].map(sx => sph(s, .26, MB('#111'), sx * .7, 7.3, 1.95)); box(s, .9, .12, .1, '#c92a2a', 0, 6.4, 1.95);
    label(s, '오뚝이 술래', 4, .9, '#111', '#ffd43b', 0, 11.2, 0, 44); this.it = s; s.rotation.y = PI;
    // R2 분리 발판
    this.sp = this.pads(-92, 4, 7); this.sp.forEach((g, i) => g.position.set(i % 2 ? 3.9 : -3.9, 0, i < 2 ? -89 : -95.5)); this.sp.forEach((g, i) => this.text(g, SEP[i], 6)); this.sBoard = new THREE.Group(); this.sBoard.position.set(0, 6, -101); scene.add(this.sBoard);
    // R3 단열 징검다리
    box(null, 34, .25, 34, '#ff6b35', 0, -.02, -135); this.hr = []; for (let i = 0; i < 5; i++) this.hr.push(this.pads(-123 - i * 6, 2, 6)); label(null, '🔥 뜨거운 바닥! 열이 잘 이동하지 않는 발판으로', 16, 1.4, '#c92a2a', '#fff', 0, 5, -156);
    // R4 OX
    this.ox = this.pads(-188, 2, 13); this.ox[0].userData.pl.material = M('#74c0fc'); this.ox[1].userData.pl.material = M('#ffa8a8'); this.ox.forEach((g, i) => { g.scale.z = 3; label(g, i ? 'X' : 'O', 5, 1.6, null, '#fff', 0, .1, 0, 90).rotation.x = -PI / 2 }); this.oBoard = new THREE.Group(); this.oBoard.position.set(0, 5, -200); scene.add(this.oBoard);
    // R5 줄다리기
    this.tg = new THREE.Group(); this.tg.position.set(0, 0, -240); scene.add(this.tg); cyl(this.tg, .09, .09, 20, '#d9b38c', 0, 1.2, 0, 8).rotation.z = PI / 2; box(this.tg, .1, .6, .3, '#e03131', 0, 1.2, 0); box(null, .15, .02, 6, '#fff', 0, .02, -240); for (const x of [-3, 3]) box(null, .15, .02, 6, x < 0 ? '#339af0' : '#ff6b6b', x, .02, -240);
    this.rv = [0, 1, 2].map(i => { const c = person({ top: '#868e96', hat: '#495057' }); c.g.position.set(2 + i * 1.3, 0, 0); c.g.rotation.y = -PI / 2; this.tg.add(c.g); return c }); this.tBoard = new THREE.Group(); this.tBoard.position.set(0, 5, -246); scene.add(this.tBoard);
    // 로비: 황금돼지 저금통
    box(null, 34, .05, 24, '#f8f0e3', 0, .02, 23); const pig = new THREE.Group(); pig.position.set(0, 0, 22); scene.add(pig); this.pig = pig; const GD = new THREE.MeshToonMaterial({ color: '#ffc531', gradientMap: grad, emissive: '#7a5200', emissiveIntensity: .35 });
    sph(pig, 2.4, GD, 0, 4.2, 0, 1.25, 1, 1); sph(pig, 1.3, GD, 0, 4.6, 2.4); cyl(pig, .7, .7, .5, GD, 0, 4.4, 3.6, 16).rotation.x = PI / 2; for (const sx of [-1, 1]) { sph(pig, .12, '#111', sx * .25, 4.4, 3.87); sph(pig, .16, '#111', sx * .55, 5.1, 3.4); cone(pig, .5, .9, GD, sx * .9, 5.9, 2.2, 4); for (const sz of [-1, 1]) cyl(pig, .5, .45, 1, GD, sx * 1.6, 2.2, sz * 1.1, 10) }
    box(pig, 1.3, .1, .3, '#111', 0, 6.56, 0); const bill = box(pig, 1.1, 1, .06, '#f2b84b', 0, 6.9, 0); bill.rotation.z = .15; this.bill = bill; const tl = new THREE.Mesh(new THREE.TorusGeometry(.4, .12, 6, 12, PI * 1.5), GD); tl.position.set(0, 4.6, -2.5); tl.rotation.y = PI / 2; pig.add(tl);
    pig.position.y = 4.8; for (const sx of [-1, 1]) { box(null, .8, 15, .8, '#495057', sx * 9, 7.5, 22); for (const sz of [-1, 1]) { const c = cyl(null, .07, .07, 3.6, '#adb5bd', sx * 1.2, 0, 22 + sz * 1, 6); c.position.y = 13.1; c.rotation.z = -sx * .08 } } box(null, 19, .8, .8, '#495057', 0, 15, 22); cyl(null, .5, .5, .4, '#868e96', 0, 14.4, 22, 12);
    box(null, 6, .2, 6, '#e9ecef', 0, .1, 22); label(null, '↑ 상금 500만원 ↑', 5, 1, null, '#c92a2a', 0, .22, 22).rotation.x = -PI / 2;
    this.pigLb = new THREE.Group(); this.pigLb.position.set(0, 16.4, 22); scene.add(this.pigLb);
    const gate = new THREE.Group(); gate.position.set(0, 0, 11); scene.add(gate); for (const sx of [-1, 1]) box(gate, .8, 6, .8, '#e03131', sx * 5, 3, 0); box(gate, 11, 1.4, .8, '#e03131', 0, 6, 0); label(gate, '🏁 출발문 · 문제를 맞혀야 열려요', 10, 1.1, null, '#fff', 0, 6, .45, 40);
    // R3 달고나
    cyl(null, 10, 10, .3, '#e0a458', 0, .05, -272, 40); cyl(null, 10.6, 10.6, .2, '#adb5bd', 0, 0, -272, 40); this.dBoard = new THREE.Group(); this.dBoard.position.set(0, 6, -286); scene.add(this.dBoard); this.dots = []; this.dline = null;
    this.p = person({ top: NET.col, hat: '#fff' }); this.p.g.rotation.y = PI; scene.add(this.p.g); this.p.g.position.set(0, 0, 31);
    this.robos = []; const bad = [456, 218, 67, 1, 199, 240, 101, 212]; do { this.num = 300 + (Math.random() * 150 | 0) } while (bad.includes(this.num)); this.left = 120;
    this.tag = label(this.p.g, `참가자 ${this.num}`, 2.2, .5, '#111', '#fff', 0, 2.9, 0, 40); box(this.p.body, .5, .4, .02, '#fff', 0, .15, -.24); label(this.p.body, String(this.num), .46, .3, null, '#111', 0, .15, -.26, 50).rotation.y = PI;
    // 로비 무대·관중석·사회자·심판
    box(null, 10, 1.2, 4, '#495057', -10, .6, 27); this.hostC = this.host(-10, 1.2, 27); this.hostC.g.rotation.y = .4;
    for (let i = 0; i < 4; i++) box(null, 34, .6, 1.6, i % 2 ? '#e64980' : '#ffd43b', 0, .3 + i * .6, 37 + i * 1.6);
    this.robo(-6.5, 11.6); this.robo(6.5, 11.6); this.robo(-15, -56, .6); this.robo(15, -56, -.6); this.robo(-14, -236, .3); this.robo(14, -236, -.3);
    // 1라운드 참가자
    this.npcs = []; for (let i = 0; i < (NET.on ? 4 : 9); i++) { let n; do { n = 300 + (Math.random() * 150 | 0) } while (bad.includes(n) || n === this.num); const c = person({ top: pick(['#20c997', '#339af0', '#fab005', '#e64980', '#868e96']), s: .95 }); c.g.rotation.y = PI; c.g.position.set(-13 + i * 3.2 + (i > 3 ? 3.4 : 0), 0, 2.5 + rnd(-1, 1)); c.g.visible = false; scene.add(c.g); box(c.body, .5, .4, .02, '#fff', 0, .15, -.24); label(c.body, String(n), .46, .3, null, '#111', 0, .15, -.26, 50).rotation.y = PI; this.npcs.push({ c, n, v: rnd(2.6, 4.2), brave: rnd(.02, .35), out: false, z0: c.g.position.z, x0: c.g.position.x }) }
    this.inks = []; this.puddles = []; this.money = 5000000; this.gating = false; this.crack = 0; this.showMoney();
    this.round = 0; this.prog = 0; this.hp = 3; this.t = 0; this.phase = 'sing'; this.pt = 3; this.v = 0; this.qi = 0; this.qt = 0; this.cur = null; this.msg = 0; this.pull = 0; this.tq = null; this.tqT = 3; this.inv = 0; this.order = [];
    setBtns([{ k: 'ArrowLeft', i: '⬅️', l: '왼쪽' }, { k: 'KeyJ', i: '💪', l: '당겨!' }, { k: 'ArrowRight', i: '➡️', l: '오른쪽' }]);
  },
  board(g, t, sub) { while (g.children.length) g.remove(g.children[0]); g.scale.setScalar(W < H ? .5 : 1); label(g, t, 22, 2, '#111', '#ffd43b', 0, 0, 0, 40); if (sub) label(g, sub, 12, 1.2, '#fff', '#111', 0, -1.8, 0, 40) },
  robo(x, z, ry = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); box(g, 1.3, 1.8, .9, '#f06595', 0, 1.6, 0); for (let i = 0; i < 3; i++) box(g, 1.32, .18, .92, '#212529', 0, 1.0 + i * .5, 0); for (const sx of [-1, 1]) { box(g, .3, 1, .3, '#212529', sx * .35, .5, 0); box(g, .25, 1.1, .25, '#f06595', sx * .85, 1.8, 0) } sph(g, .7, '#e9ecef', 0, 3, 0); const lamp = sph(g, .32, MB('#40c057'), 0, 3.1, .55); box(g, .6, .3, .1, '#212529', 0, 2, .46); label(g, '심판', 1, .35, null, '#fff', 0, 2, .52, 40); this.robos.push(lamp); return g },
  host(x, y, z) { const c = person({ top: '#212529', bottom: '#212529', skin: '#ffc531', hair: null, s: 1.2 }); c.g.position.set(x, y, z); scene.add(c.g); const h = c.head; sph(h, .5, '#ffc531', 0, 0, 0, 1.05, 1, 1); cyl(h, .2, .2, .18, '#f59f00', 0, -.05, .48, 12).rotation.x = PI / 2; for (const sx of [-1, 1]) { cone(h, .16, .3, '#ffc531', sx * .32, .45, 0, 4); sph(h, .06, '#111', sx * .07, -.05, .58) } box(c.body, .16, .5, .05, '#ffd43b', 0, .1, .24); label(c.g, '🐷 황금돼지 사회자', 3.2, .6, '#111', '#ffd43b', 0, 3.6, 0, 40); return c },
  say(t) { toast('📢 ' + t, '#ffd43b', 2.6) },
  showMoney() { const g = this.pigLb; while (g.children.length) g.remove(g.children[0]); label(g, `🐷 상금 ${Math.round(this.money / 10000)}만원 (5만원권 ${Math.round(this.money / 50000)}장)`, 14, 1.6, '#111', '#ffd43b', 0, 0, 0, 40) },
  pay(n) { this.money = Math.max(0, this.money - n); this.showMoney() },
  gate(tag, then) { this.gating = true; const ask = () => quiz(ok => { if (ok) { this.gating = false; snd('ok'); toast('정답! 출발!', '#69db7c', 1); then() } else { this.pay(100000); toast('땡! 상금 -10만원 · 다시 풀어요', '#ff8787', 1.4); setTimeout(ask, 900) } }, tag); ask() },
  mkShape() {
    const kind = pick(['동그라미', '세모', '별', '네모']); let v = [];
    if (kind === '동그라미') for (let i = 0; i < 24; i++) v.push([Math.cos(i / 24 * TAU) * 6, Math.sin(i / 24 * TAU) * 6]); else if (kind === '세모') v = [[0, -7], [6.5, 4.5], [-6.5, 4.5]]; else if (kind === '네모') v = [[-5.5, -5.5], [5.5, -5.5], [5.5, 5.5], [-5.5, 5.5]]; else for (let i = 0; i < 10; i++) { const r = i % 2 ? 3.2 : 7, a = i / 10 * TAU - PI / 2; v.push([Math.cos(a) * r, Math.sin(a) * r]) }
    this.shape = v.map(p => [p[0], p[1] - 272]); this.dots.forEach(d => scene.remove(d)); this.dots = []; if (this.dline) scene.remove(this.dline);
    const pts = this.shape.concat([this.shape[0]]), segs = []; let total = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push(l); total += l }
    for (let k = 0; k < 16; k++) { let d = k / 16 * total, i = 0; while (d > segs[i]) { d -= segs[i]; i++ } const f = d / segs[i]; this.dots.push(sph(null, .35, '#fff3bf', lerp(pts[i][0], pts[i + 1][0], f), .5, lerp(pts[i][1], pts[i + 1][1], f))) }
    this.dline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p => V3(p[0], .24, p[1]))), new THREE.LineBasicMaterial({ color: '#7a4a12' })); scene.add(this.dline);
    this.board(this.dBoard, `🍪 달고나 ${kind} 따기`, '선을 따라 걸으며 점을 모두 모아요 · 선에서 벗어나면 금이 가요!'); this.p.g.position.set(this.dots[0].position.x, 0, this.dots[0].position.z); this.qt = 40; this.crack = 0;
  },
  lineDist(x, z) { let b = 1e9; const p = this.shape; for (let i = 0; i < p.length; i++) { const a = p[i], c = p[(i + 1) % p.length], dx = c[0] - a[0], dz = c[1] - a[1], t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz), 0, 1); b = Math.min(b, Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t)) } return b },
  hurt(msg) { this.pay(500000); this.hp--; shake = .6; snd('bad'); this.ink(this.p.g.position.clone(), this.hp <= 0 ? this.p : null, null, 1); toast('💦 먹물! ' + msg + ' (상금 -50만원)', '#ff8787', 1.8); this.inv = 1; if (this.hp <= 0) { this.round = -2; this.say(`참가자 ${this.num}번 탈락`); setTimeout(() => { if (playing) endGame(false, '먹물 풍선을 맞고 탈락! ' + msg) }, 1800) } },
  next(tag, z) { const nr = this.round + 1; this.round = -1; snd('win'); toast(nr === 7 ? '6게임 통과!' : `${nr - 1}번째 게임 통과!`, '#69db7c'); if (this.hp < 3) this.hp++; const names = ['', '', '분리 방법 발판', '달고나 모양 따기', '단열 징검다리', '날씨 OX 달리기', '에너지 줄다리기']; this.left = Math.max(12, this.left - (14 + (Math.random() * 10 | 0))); this.npcs.forEach(n => n.c.g.visible = false);
    const go = () => this.gate(tag, () => { if (nr === 7) this.rebel(); else this.say(`사회자: ${['', '', '두', '세', '네', '다섯', '여섯'][nr]} 번째 게임은 「${names[nr]}」입니다.`); this.round = nr; this.prog = 0; this.qi = 0; this.cur = null; this.order = []; this.jump = null; this.p.g.position.set(0, 0, z); this.p.g.position.y = 0; if (nr === 3) this.mkShape() });
    if (nr === 7) { this.story(['🎙️ 사회자: "축하합니다! 이제 상금은…"', '그때 참가자 한 명이 외쳤다. "투표로는 절대 못 멈춰!"', '💥 참가자들이 일어섰다! 통제실의 발전기 3대를 꺼서 심판 로봇을 멈춰라!'], go) }
    else this.vote(nr, go) },
  story(lines, cb) { let i = 0; const O = this.ov(); const nx = () => { if (i >= lines.length) { O.classList.remove('on'); quizOn = false; cb(); return } O.querySelector('.card').innerHTML = `<div style="font-size:44px">${['🎬', '📜', '✊'][i % 3]}</div><div style="font-size:19px;line-height:1.55;margin:10px 0">${lines[i]}</div><button class="btn">${i === lines.length - 1 ? '시작! ▶' : '다음 ▶'}</button>`; O.querySelector('.btn').onclick = () => { snd('ok'); i++; nx() } }; quizOn = true; O.classList.add('on'); nx() },
  ov() { let O = document.getElementById('ovVote'); if (!O) { O = document.createElement('div'); O.id = 'ovVote'; O.className = 'ov'; O.innerHTML = '<div class="card"></div>'; document.body.appendChild(O) } return O },
  vote(nr, cb) {
    const O = this.ov(), C = O.querySelector('.card'), n = this.left; quizOn = true; O.classList.add('on');
    C.innerHTML = `<div style="font-size:44px">🗳️</div><h3>참가자 투표 · 남은 ${n}명</h3><div style="font-size:17px;line-height:1.5;margin:6px 0">사회자: "게임을 <b>계속</b>하시겠습니까, <b>그만</b>두시겠습니까?<br>절반 넘게 그만을 고르면 상금을 나눠 갖고 끝납니다."</div><div style="font-size:14px;color:#555">(돌아온 우승자인 나는 이 서바이벌을 멈추려고 왔다…)</div><div style="display:flex;gap:10px"><button class="btn" id="vO" style="background:#74c0fc">⭕ 계속</button><button class="btn" id="vX" style="background:#ffa8a8">❌ 그만</button></div><div id="vT" style="font:28px 'Black Han Sans',sans-serif;margin-top:10px"></div>`;
    const pickV = mine => { C.querySelectorAll('button').forEach(b => b.disabled = true); snd('hit'); const o = Math.floor(n / 2) + 1 + (Math.random() * 3 | 0), x = n - o; let k = 0; const T = C.querySelector('#vT'); const iv = setInterval(() => { k = Math.min(1, k + .08); T.innerHTML = `⭕ ${Math.round(o * k)} : ${Math.round(x * k)} ❌`; if (k >= 1) { clearInterval(iv); T.innerHTML += `<div style="font-size:17px;margin-top:4px">${o - x <= 3 ? '단 ' + (o - x) + '표 차이로 ' : ''}<b>계속</b>! ${mine ? '' : '…내 표는 모자랐다.'}</div>`; this.votes = (this.votes || 0) + (mine ? 0 : 1); setTimeout(() => { O.classList.remove('on'); quizOn = false; cb() }, 1600) } }, 60) };
    C.querySelector('#vO').onclick = () => pickV(true); C.querySelector('#vX').onclick = () => pickV(false);
  },
  rebel() {
    this.say('참가자들: "통제실로! 발전기를 꺼!"'); const Z = -335; this.rz = Z; this.rb = []; this.gens = []; this.balls = []; this.rd = 0;
    if (!this.rbuilt) { this.rbuilt = 1; box(null, 34, .2, 34, '#343a40', 0, -.05, Z); for (const [x, z, w, d] of [[0, Z - 17, 34, .6], [-17, Z, .6, 34], [17, Z, .6, 34]]) box(null, w, 5, d, '#495057', x, 2.5, z); label(null, '⚡ 통제실', 8, 1.4, '#c92a2a', '#fff', 0, 6, Z - 16.6) }
    [[-11, Z - 10], [11, Z - 10], [0, Z - 14]].forEach(([x, z], i) => { const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); box(g, 3, 3, 2, '#868e96', 0, 1.5, 0); for (let k = 0; k < 3; k++) box(g, 3.05, .15, 2.05, '#212529', 0, .6 + k * .8, 0); const lamp = sph(g, .35, MB('#fa5252'), 0, 3.3, 0); const lv = box(g, .2, 1.2, .2, '#ffd43b', 1.1, 2.2, 1.1); label(g, `발전기 ${i + 1}`, 2.4, .5, '#111', '#fff', 0, 4, 0, 40); this.gens.push({ g, lamp, lv, x, z, off: false }) });
    for (let i = 0; i < 5; i++) { const g = this.robo(rnd(-12, 12), Z + rnd(-9, 0)); this.rb.push({ g, lamp: this.robos[this.robos.length - 1], stun: 0, a: rnd(0, TAU) }) }
    this.rn = []; for (let i = 0; i < 6; i++) { const c = person({ top: pick(['#20c997', '#339af0', '#fab005', '#e64980']), s: .95 }); c.g.position.set(rnd(-12, 12), 0, Z + 12); scene.add(c.g); this.rn.push({ c, tx: rnd(-14, 14), tz: Z + rnd(-12, 12) }) }
    setBtns([{ k: 'KeyE', i: '🔌', l: '레버' }, { k: 'KeyJ', i: '💧', l: '물풍선' }]); $('#help').textContent = '이동: WASD · 방향키   ·   물풍선: J   ·   발전기 레버: E';
  },
  move(dt, sp = 8) { const P = this.p.g.position, a = axis(); P.x = clamp(P.x + a.x * sp * dt, -15, 15); P.z += a.y * sp * dt; if (a.x || a.y) { this.p.g.rotation.y = Math.atan2(a.x, a.y); walk(this.p, this.t * 12) } else stand(this.p, this.t); return P },
  update(dt) {
    this.t += dt; const t = this.t, P = this.p.g.position; this.inv -= dt; let cz = P.z, cy = W < H ? 12 : 8, cd = W < H ? 17 : 12;
    this.inkTick(dt);
    if (this.round === -2) { this.p.body.rotation.x = lerp(this.p.body.rotation.x, -1.2, dt * 5); this.p.body.position.y = lerp(this.p.body.position.y, .45, dt * 5); setObj('💦 먹물을 맞고 탈락…'); }
    else if (this.round === -1) { stand(this.p, t); setObj('🔬 <b>출발 문제</b>를 맞혀야 뛸 수 있어요'); }
    else if (this.round === 0) {
      this.move(dt); P.z = clamp(P.z, 11.5, 33); this.pig.rotation.y = Math.sin(t * .6) * .25; this.pig.position.y = 4.8 + Math.sin(t * 1.3) * .15; this.pig.rotation.z = Math.sin(t * .9) * .04; this.bill.position.y = 6.9 + Math.sin(t * 3) * .12; this.prog = 0;
      setObj(`🐷 참가자 <b>${this.num}</b>번 · 상금 <b>500만원</b>이 걸린 6게임! <b>출발문</b>으로`); if (!this.hi) { this.hi = 1; this.say('사회자: 다시 오신 것을 환영합니다, 참가자 여러분! …어라, 낯익은 얼굴이 있군요?') } walk(this.hostC, t * 2, .15); cy = W < H ? 11 : 7.5; cd = W < H ? 22 : 15;
      if (P.z < 12.6 && Math.abs(P.x) < 5 && !this.gating) { this.round = -1; this.gate('e', () => { this.round = 1; this.p.g.position.set(0, 0, 2); this.phase = 'sing'; this.pt = 3; this.singT = 3; this.r1t = 60; this.npcs.forEach(n => { n.c.g.visible = true; n.out = false; n.c.g.position.set(n.x0, 0, n.z0); n.c.body.rotation.x = 0 }); this.say('사회자: 첫 번째 게임은 「무궁화 꽃이 피었습니다」입니다. 제한 시간 60초!') }) }
    } else if (this.round === 3) {
      this.move(dt, 7); const dx = P.x, dz = P.z + 272, dl = Math.hypot(dx, dz); if (dl > 9.4) { P.x = dx / dl * 9.4; P.z = dz / dl * 9.4 - 272 }
      this.qt -= dt; for (let i = this.dots.length - 1; i >= 0; i--) if (Math.hypot(P.x - this.dots[i].position.x, P.z - this.dots[i].position.z) < 1.1) { scene.remove(this.dots[i]); this.dots.splice(i, 1); snd('ok') }
      const off = this.lineDist(P.x, P.z) > 1.5; this.crack = clamp(this.crack + (off ? dt * .9 : -dt * .3), 0, 1); if (off && Math.sin(t * 20) > .8) toast('쩍! 선으로 돌아가요', '#ffa94d', .4);
      if (this.crack >= 1 || this.qt <= 0) { const m = this.qt <= 0 ? '시간 초과!' : '달고나가 부서졌다!'; this.mkShape(); this.hurt(m) }
      this.prog = 1 - this.dots.length / 16; setObj(`🍪 선을 따라 점 모으기 <b>${16 - this.dots.length}/16</b> ⏱ ${Math.max(0, this.qt).toFixed(0)}초 · 금 ${'💢'.repeat(Math.ceil(this.crack * 3))}`); cz = -272; cy = W < H ? 34 : 22; cd = W < H ? 14 : 12;
      if (!this.dots.length && this.hp > 0) this.next('h', -117);
    } else if (this.round === 7) {
      this.move(dt, 8.5); P.x = clamp(P.x, -16, 16); P.z = clamp(P.z, this.rz - 16, this.rz + 16); this.rd -= dt; cz = P.z; cy = W < H ? 24 : 16; cd = W < H ? 16 : 12;
      if (hit('KeyJ') && this.rd <= 0) { const tg = this.rb.filter(r => r.stun <= 0 && !this.dead).sort((a, b) => a.g.position.distanceTo(P) - b.g.position.distanceTo(P))[0]; if (tg && tg.g.position.distanceTo(P) < 12) { this.rd = .6; snd('jump'); const m = sph(null, .35, '#4dabf7', P.x, 1.8, P.z); this.balls.push({ m, tg, k: 0, x0: P.x, z0: P.z }) } else toast('가까운 로봇이 없어요', '#ddd', .5) }
      for (let i = this.balls.length - 1; i >= 0; i--) { const B = this.balls[i]; B.k += dt / .45; const q = B.tg.g.position, k = Math.min(1, B.k); B.m.position.set(lerp(B.x0, q.x, k), 1.8 + Math.sin(k * PI) * 2.5, lerp(B.z0, q.z, k)); if (k >= 1) { scene.remove(B.m); this.balls.splice(i, 1); B.tg.stun = 4; snd('hit'); toast('지지직! 합선 — 4초 멈춤', '#74c0fc', .8) } }
      const near = this.gens.find(g => !g.off && Math.hypot(P.x - g.x, P.z - g.z) < 3); if (hit('KeyE') && near) { this.round = -1; quiz(ok => { this.round = 7; if (ok) { near.off = true; near.lamp.material.color.set('#495057'); near.lv.rotation.x = 1.2; snd('win'); toast(`발전기 ${this.gens.indexOf(near) + 1} 꺼짐! (${this.gens.filter(g => g.off).length}/3)`, '#69db7c', 1.4) } else toast('레버가 꿈쩍 안 해요… 다시!', '#ff8787', 1) }, 'e') }
      const off = this.gens.filter(g => g.off).length, dead = off >= 3;
      for (const r of this.rb) { const q = r.g.position; r.stun -= dt; if (dead) { r.lamp.material.color.set('#495057'); r.g.rotation.x = lerp(r.g.rotation.x, .5, dt * 3); continue } r.lamp.material.color.set(r.stun > 0 ? '#4dabf7' : '#fa5252'); if (r.stun > 0) continue; const dx = P.x - q.x, dz = P.z - q.z, d = Math.hypot(dx, dz); let vx, vz; if (d < 10) { vx = dx / d; vz = dz / d } else { r.a += dt * .7; vx = Math.cos(r.a); vz = Math.sin(r.a) } const sp = 3 + off * .6; q.x = clamp(q.x + vx * sp * dt, -15, 15); q.z = clamp(q.z + vz * sp * dt, this.rz - 15, this.rz + 15); r.g.rotation.y = Math.atan2(vx, vz); if (d < 1.5 && this.inv <= 0) { this.hurt('심판 로봇에게 잡혔다!'); P.z = Math.min(P.z + 4, this.rz + 15) } }
      for (const n of this.rn) { const q = n.c.g.position, dx = n.tx - q.x, dz = n.tz - q.z, l = Math.hypot(dx, dz); if (l < 1) { n.tx = rnd(-14, 14); n.tz = this.rz + rnd(-12, 12) } else { q.x += dx / l * 4 * dt; q.z += dz / l * 4 * dt; n.c.g.rotation.y = Math.atan2(dx, dz); walk(n.c, t * 12) } }
      this.prog = off / 3; setObj(near ? '🔌 <b>E</b>로 레버 내리기 (문제를 맞혀야 내려가요)' : `✊ <b>반란!</b> 발전기 ${off}/3 끄기 · 💧 J 물풍선으로 로봇 멈추기`);
      if (dead && !this.dead) { this.dead = true; snd('win'); flash(); this.say('전원이 꺼졌다! 심판 로봇이 모두 멈췄다!'); setTimeout(() => { if (playing) endGame(true, `반란 성공! 서바이벌은 멈췄고, 상금 ${Math.round(this.money / 10000)}만원은 남은 참가자 모두에게 나눠졌어요.${this.votes ? ' (그만 투표 ' + this.votes + '번)' : ''}`) }, 2200) }
    } else if (this.round === 1) {
      this.pt -= dt; if (this.pt <= 0) { if (this.phase === 'sing') { this.phase = 'turn'; this.pt = .35 } else if (this.phase === 'turn') { this.phase = 'look'; this.pt = rnd(1.5, 2.4); snd('hit') } else { this.phase = 'sing'; this.pt = this.singT = rnd(2.2, 4) } }
      this.r1t = (this.r1t || 60) - dt; if (this.r1t <= 0) { this.r1t = 60; P.z = 2; this.hurt('시간 초과! 처음부터') }
      for (const L of this.robos) L.material.color.set(this.phase === 'look' ? '#fa5252' : this.phase === 'turn' ? '#fab005' : '#40c057');
      for (const n of this.npcs) { if (n.out) { if (n.wait) { stand(n.c, t); continue } n.c.body.rotation.x = lerp(n.c.body.rotation.x, -1.2, dt * 6); n.c.body.position.y = lerp(n.c.body.position.y, .45, dt * 6); continue } const G = n.c.g.position; const mv = G.z > -50 && (this.phase === 'sing' || (this.phase !== 'sing' && Math.random() < n.brave * dt * 8)); if (mv) { G.z -= n.v * dt; walk(n.c, t * 12) } else stand(n.c, t); if (this.phase === 'look' && mv && Math.random() < .5) { n.out = true; n.wait = 1; this.left--; this.ink(n.c.g.position.clone(), n.c, () => { n.wait = 0; this.say(`참가자 ${n.n}번 탈락`) }) } }
      this.it.rotation.y = lerp(this.it.rotation.y, this.phase === 'sing' ? PI : 0, Math.min(1, dt * 12)); this.it.rotation.z = this.phase === 'sing' ? Math.sin(t * 3) * .08 : 0; this.eyes.forEach(e => e.material.color.set(this.phase === 'look' ? '#fa5252' : '#111'));
      const a = axis(), fwd = (a.y < -.3 || K.KeyJ) ? 1 : 0; this.v = lerp(this.v, fwd * 6.5, Math.min(1, dt * (fwd ? 5 : 12))); P.x = clamp(P.x + a.x * 5 * dt, -14, 14);
      if (this.phase === 'look' && this.v > 1.2 && this.inv <= 0) { this.v = 0; P.z = Math.min(2, P.z + 10); this.phase = 'sing'; this.pt = 3; this.hurt('움직였다! 10m 뒤로~'); if (this.hp > 0) { const z0 = P.z; this.round = -1; this.gate('e', () => { this.round = 1; this.phase = 'sing'; this.pt = 3 }) } }
      P.z -= this.v * dt; this.p.g.rotation.y = PI; this.v > .5 ? walk(this.p, t * 13) : stand(this.p, t); this.prog = clamp((2 - P.z) / 52, 0, 1);
      const PH = '무궁화 꽃이 피었습니다'; const k = this.phase === 'sing' ? Math.min(PH.length - 3, Math.floor((1 - this.pt / (this.singT || 3)) * (PH.length - 2))) : PH.length; setObj((this.phase === 'look' ? '🔴 <b>멈춰!</b> ' : this.phase === 'turn' ? '🟡 ' : '🟢 ') + `<b>${PH.slice(0, Math.max(1, k))}</b>${this.phase === 'look' ? '!' : '…'} ⏱ ${Math.ceil(this.r1t || 60)}초`);
      if (P.z <= -50) this.next('s', -84);
    } else if (this.round === 2) {
      this.move(dt); P.z = clamp(P.z, -98, -80);
      if (!this.cur) { if (!this.order.length) this.order = SEPQ.slice().sort(() => Math.random() - .5); this.cur = this.order.pop(); this.qt = 9; this.board(this.sBoard, '🧪 ' + this.cur[0], '알맞은 분리 방법 발판 위로!') }
      this.qt -= dt; const on = this.sp.findIndex(g => Math.abs(P.x - g.position.x) < 3.5 && Math.abs(P.z - g.position.z) < 2.2);
      this.sp.forEach((g, i) => g.position.y = lerp(g.position.y, i === on ? -.12 : 0, dt * 10));
      if (this.qt <= 0) { if (on === this.cur[1]) { this.qi++; snd('ok'); toast('정답! ' + SEP[on], '#69db7c', 1) } else this.hurt(`정답은 "${SEP[this.cur[1]]}"`); this.cur = null; P.z = -84 }
      this.prog = this.qi / 4; setObj(`🧪 <b>${this.cur ? this.cur[0] : ''}</b> → 발판 고르기 ⏱ ${Math.max(0, this.qt).toFixed(0)}초 (${this.qi}/4)`); cz = -91; cy = W < H ? 22 : 13; cd = W < H ? 24 : 15;
      if (this.qi >= 4 && this.hp > 0) this.next('h', -272);
    } else if (this.round === 4) {
      if (!this.cur) { this.cur = this.hr.map(row => { const m = pick(HEAT), cold = Math.random() * 2 | 0; row.forEach((g, i) => { g.visible = true; this.text(g, i === cold ? m[1] : m[0], 5.6) }); return cold }); this.jump = null }
      if (this.jump) { const J = this.jump; J.k += dt / .45; const k = Math.min(1, J.k); P.x = lerp(J.x0, J.x1, k); P.z = lerp(J.z0, J.z1, k); P.y = Math.sin(k * PI) * 1.6; if (k >= 1) { this.jump = null; P.y = 0; if (J.end) { this.next('w', -180); return } if (J.ok) { snd('ok'); toast('단열! 안 뜨거워요', '#69db7c', .8) } else { J.g.visible = false; this.hurt('앗 뜨거! 금속은 열이 잘 이동해요') ; P.x = this.hr[this.qi][this.cur[this.qi]].position.x } this.qi++ } }
      else { stand(this.p, t); let side = -1; if (hit('ArrowLeft') || hit('KeyA')) side = 0; if (hit('ArrowRight') || hit('KeyD')) side = 1; if (Math.abs(joy.x) > .6 && !this.jl) { side = joy.x > 0 ? 1 : 0; this.jl = 1 } else if (Math.abs(joy.x) < .3) this.jl = 0;
        if (this.qi >= 5) this.jump = { k: 0, x0: P.x, z0: P.z, x1: 0, z1: -152, end: true }; else if (side >= 0) { const g = this.hr[this.qi][side]; this.jump = { k: 0, x0: P.x, z0: P.z, x1: g.position.x, z1: g.position.z, ok: side === this.cur[this.qi], g }; snd('jump') } }
      this.prog = this.qi / 5; setObj(`🔥 <b>열이 잘 이동하지 않는</b> 발판으로! ← / → (${Math.min(this.qi + 1, 5)}/5)`); cz = -121 - this.qi * 6; cy = W < H ? 20 : 11; if (W < H) cd = 20;
    } else if (this.round === 5) {
      this.move(dt, 10); P.z = clamp(P.z, -194, -178);
      if (!this.cur) { if (!this.order.length) this.order = WOX.slice().sort(() => Math.random() - .5); this.cur = this.order.pop(); this.qt = 7; this.board(this.oBoard, this.cur[0], '맞으면 O(파랑), 틀리면 X(빨강)로 달려요!') }
      this.qt -= dt; if (this.qt <= 0) { const side = P.x < 0 ? 1 : 0; if (side === this.cur[1]) { this.qi++; snd('ok'); toast('정답!', '#69db7c', .8) } else this.hurt(`땡! 정답은 ${this.cur[1] ? 'O' : 'X'}`); this.cur = null; P.x = 0; P.z = -180 }
      this.prog = this.qi / 4; setObj(`🌦️ OX 달리기 ⏱ <b>${Math.max(0, this.qt).toFixed(0)}초</b> (${this.qi}/4)`); cz = -186; cy = W < H ? 22 : 11; if (W < H) cd = 26;
      if (this.qi >= 4 && this.hp > 0) this.next('e', -240);
    } else if (this.round === 6) {
      P.set(-2 - this.pull, 0, -240); this.p.g.rotation.y = PI / 2; this.p.body.rotation.x = -.4; this.p.aL.rotation.x = this.p.aR.rotation.x = -1.3;
      if (hit('KeyJ') || hit('Space') || hit('Click')) { this.pull += .11; snd('hit') } this.pull -= .5 * dt;
      this.tqT -= dt; if (!this.tq && this.tqT <= 0) { const q = pick(TUG), sw = Math.random() < .5; this.tq = { q, ans: sw ? 1 : 0, l: sw ? q[2] : q[1], r: sw ? q[1] : q[2], t: 4 }; this.board(this.tBoard, `${q[0]}  ⬅️ ${this.tq.l}  |  ${this.tq.r} ➡️`, '맞히면 크게 당겨요!') }
      if (this.tq) { this.tq.t -= dt; let side = -1; if (hit('ArrowLeft') || hit('KeyA')) side = 0; if (hit('ArrowRight') || hit('KeyD')) side = 1; if (side >= 0 || this.tq.t <= 0) { if (side === this.tq.ans) { this.pull += 1; snd('ok'); toast('정답! 영차!!', '#69db7c', .8) } else { this.pull -= .8; snd('bad'); toast('땡! 끌려간다~', '#ff8787', .8) } this.tq = null; this.tqT = 3; this.board(this.tBoard, '💪 J 연타로 당겨요!') } }
      this.tg.position.x = -this.pull; this.rv.forEach(c => { c.body.rotation.x = -.4; c.aL.rotation.x = c.aR.rotation.x = -1.3 }); this.prog = clamp((this.pull + 3) / 6, 0, 1);
      setObj('💪 <b>J 연타!</b> 문제가 나오면 ← / → 로 정답 고르기'); cz = -240; cy = W < H ? 9 : 6; cd = W < H ? 20 : 13;
      if (this.pull >= 3) { this.pull = 0; this.next('e', -322); return } if (this.pull <= -3) return endGame(false, '줄이 넘어갔어요. J 연타 + 문제 맞히기!');
    }
    this.tag.lookAt(cam.position);
    setStat(`${hearts(this.hp, 3)} · 🐷 <b>${Math.round(this.money / 10000)}만원</b><br>참가자 ${this.num} · ${this.round < 1 ? '로비' : this.round === 7 ? '✊ 반란' : this.round + '/6 게임'} · 남은 ${this.left}명${NET.on ? ` · 👥 ${1 + Object.keys(NET.rem).length}/24` : ''}`); setBar(this.prog);
    const cx = this.round === 1 || this.round === 0 ? P.x * .3 : 0; if (this.round < 0) cz = cam.position.z - cd; cam.position.lerp(V3(cx, cy, cz + cd), Math.min(1, dt * 5)); cam.lookAt(cx, 1.5, cz - (this.round === 1 ? 14 : 5));
  }
};
