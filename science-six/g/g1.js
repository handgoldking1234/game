/* 1. 에그 대작전 — 자원과 에너지 (블록 맵 · 알 캐릭터 · Run 추격 · 안전 구역 · 알 훔치기) */
const ET = { coal: ['석탄 알', '#343a40', 9, 110], oil: ['석유 알', '#6b4226', 11, 130], gas: ['천연가스 알', '#adb5bd', 10, 120], sun: ['태양광 알', '#ffd43b', 4, 0], wind: ['풍력 알', '#74c0fc', 4, 0], water: ['수력 알', '#339af0', 5, 0] };
const EK = Object.keys(ET);
const EI = {
  coal: '아주 오래전 식물이 땅속에 묻혀 만들어진 <b>화석 연료</b>. 화력 발전에 써요. 양이 정해져 있어 언젠가 바닥나요.',
  oil: '옛날 바다 생물이 땅속에서 변해 만들어진 <b>화석 연료</b>. 자동차 연료와 플라스틱 원료가 돼요. 태우면 매연이 나와요.',
  gas: '땅속에 있는 기체 <b>화석 연료</b>. 가스레인지·난방에 써요. 계속 쓰면 고갈돼요.',
  sun: '<b>햇빛</b>으로 전기를 만드는 재생에너지. 계속 얻을 수 있지만 밤이나 흐린 날엔 적게 만들어요.',
  wind: '<b>바람</b>으로 날개를 돌려 전기를 만드는 재생에너지. 바람이 센 바닷가·산에 많이 세워요.',
  water: '높은 곳에서 떨어지는 <b>물의 힘</b>으로 전기를 만드는 재생에너지. 댐을 이용해요.'
};
const SHOPEGG = { sun: 90, wind: 90, water: 120 };
const TIER = [['일반', '#adb5bd', 1], ['희귀', '#4dabf7', 1.5], ['영웅', '#9775fa', 2.2], ['전설', '#fab005', 3]];
function blockTex(a, b, n = 2, stud = true) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), s = 64 / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? a : b; g.fillRect(i * s, j * s, s, s); g.strokeStyle = 'rgba(0,0,0,.10)'; g.lineWidth = 2; g.strokeRect(i * s + 1, j * s + 1, s - 2, s - 2); if (stud) { g.fillStyle = 'rgba(255,255,255,.16)'; g.beginPath(); g.arc(i * s + s / 2, j * s + s / 2, s * .27, 0, TAU); g.fill(); g.strokeStyle = 'rgba(0,0,0,.13)'; g.stroke() } } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; return t }
function eggTex(col) { const c = document.createElement('canvas'); c.width = 32; c.height = 128; const g = c.getContext('2d'); const R = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa', '#f783ac']; for (let i = 0; i < 8; i++) { g.fillStyle = col === 'rainbow' ? R[i % 7] : i % 2 ? '#ffffff' : col; g.fillRect(0, i * 16, 32, 16) } return new THREE.CanvasTexture(c) }
const GAME = {
  id: 'egg', title: '에그 대작전', sub: '알을 훔쳐 발전 펫을 키우고, Run 시간엔 안전 구역으로!', emoji: '🥚', unit: '자원과 에너지', ghostH: 3.3,
  facts: ['석탄·석유·천연가스 같은 <b>자원은 양이 정해져 있어(유한)</b> 계속 쓰면 언젠가 없어져요.', '<b>태양광·풍력·수력</b> 같은 재생에너지는 계속 다시 얻을 수 있어요.', '에너지를 <b>효율적으로</b> 쓰고 아껴 쓰면 자원을 더 오래 쓸 수 있어요.'],
  how: '가운데 <b>둥지</b>에서 알을 집어 <b>내 기지(SAFE ZONE)</b>로 가져오면 발전 펫이 되어 ⚡를 벌어요. <b>화석 연료 펫</b>은 많이 벌지만 곧 <b>고갈</b>되고, <b>재생에너지 펫</b>은 조금씩 계속 벌어요. 다른 기지의 펫을 <b>훔칠 수도</b> 있어요! 둥지 받침대는 <b>높을수록 귀한 알</b>(일반·희귀·영웅·전설)이 있어요 — 상점에서 <b>점프력</b>을 올려요. 알을 집으면 <b>Run!</b> 둥지 경비(매연 괴물)가 쫓아와요 — SAFE ZONE으로 도망쳐요. 펜에 놓은 알은 5초 뒤 <b>부화</b>해요. 알은 30초마다 <b>재입고</b>돼요. ⚡1000을 먼저 모으면 승리.',
  help: '이동 WASD · 점프 Space · 화면 회전 Q/E 또는 마우스 드래그 · 상점 1·2·3',
  quiz: [
    { q: '석탄·석유를 계속 쓰면 어떤 문제가 생길까요?', a: ['양이 정해져 있어 언젠가 고갈된다', '쓸수록 양이 늘어난다', '아무 문제도 없다', '저절로 다시 생긴다'], e: '화석 연료는 만들어지는 데 아주 오랜 시간이 걸려 양이 유한해요.' },
    { q: '다음 중 재생에너지가 아닌 것은?', a: ['석유', '태양광', '풍력', '수력'], e: '석유는 화석 연료예요. 태양광·풍력·수력은 계속 다시 얻을 수 있는 재생에너지예요.' },
    { q: '태양광 발전의 특징으로 알맞은 것은?', a: ['햇빛이 있으면 계속 전기를 만들 수 있다', '밤에 더 잘 된다', '석탄을 태워야 한다', '한 번 쓰면 없어진다'], e: '태양광 발전은 햇빛을 이용해 전기를 만들어요. 다만 날씨와 시간의 영향을 받아요.' },
    { q: '에너지를 효율적으로 이용하는 방법은?', a: ['에너지 소비 효율 등급이 높은 제품을 쓴다', '빈방에 불을 켜 둔다', '냉장고 문을 열어 둔다', '가까운 거리도 자동차를 탄다'], e: '효율이 높은 제품은 같은 일을 하면서 에너지를 덜 써요.' },
    { q: '우리가 쓰는 종이는 어떤 자원으로 만들까요?', a: ['나무', '석유', '철광석', '모래'], e: '종이는 나무로 만들어요. 생활 속 물건은 여러 자원으로 만들어져요.' },
    { q: '풍력 발전기가 전기를 만들 때 이용하는 것은?', a: ['바람', '석탄', '햇빛', '지열'], e: '풍력 발전은 바람의 힘으로 날개를 돌려 전기를 만들어요.' },
    { q: '자원이 고갈되면 생길 수 있는 어려움은?', a: ['물건과 에너지를 만들기 어려워진다', '공기가 늘어난다', '전기가 저절로 생긴다', '달라지는 것이 없다'], e: '자원이 부족해지면 물건·전기·연료를 얻기 어려워져요. 그래서 아껴 쓰고 재생에너지를 늘려요.' },
    { q: '석탄·석유를 태울 때 생기는 문제는?', a: ['매연과 이산화 탄소가 나와 공기가 나빠진다', '공기가 깨끗해진다', '물이 생긴다', '아무것도 나오지 않는다'], e: '화석 연료를 태우면 매연과 이산화 탄소가 나와요. 그래서 재생에너지를 늘리려고 해요.' },
  ],
  bpos(i, n) { const a = i / Math.max(3, n) * TAU + PI / 2; return [Math.cos(a) * 19, Math.sin(a) * 19] },
  /* 알 모양 캐릭터 */
  mkCrit(col, s = 1) {
    const g = new THREE.Group(); g.scale.setScalar(s); const body = new THREE.Group(); body.position.y = .9; g.add(body);
    sph(body, .62, new THREE.MeshToonMaterial({ map: eggTex(col), gradientMap: grad }), 0, .25, 0, 1, 1.28, 1);
    for (const x of [-1, 1]) { sph(body, .1, '#111', x * .2, .45, .54); sph(body, .035, MB('#fff'), x * .2 + .03, .49, .63) }
    const bk = cone(body, .09, .2, '#ff922b', 0, .32, .64, 8); bk.rotation.x = PI / 2;
    const fc = col === 'rainbow' ? ['#ff6b6b', '#ffd43b', '#4dabf7'] : [col, '#ffd43b', col]; fc.forEach((c, i) => { const f = cone(body, .08, .38, c, (i - 1) * .14, 1.12, -.05, 6); f.rotation.z = (1 - i) * .35 });
    const wc = col === 'rainbow' ? '#f783ac' : col;
    const wing = x => { const p = new THREE.Group(); p.position.set(x * .6, .4, 0); body.add(p); box(p, .1, .55, .42, wc, x * .05, -.22, 0); box(p, .08, .3, .3, '#ffd43b', x * .1, -.45, 0); return p };
    const leg = x => { const p = new THREE.Group(); p.position.set(x * .24, -.42, 0); body.add(p); box(p, .14, .4, .14, '#ff922b', 0, -.2, 0); box(p, .26, .08, .34, '#ff922b', 0, -.42, .07); return p };
    return { g, body, head: body, aL: wing(-1), aR: wing(1), lL: leg(-1), lR: leg(1) };
  },
  mkEgg(k, p, x, y, z, s = 1) { const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); (p || scene).add(g); sph(g, .42, ET[k][1], 0, .5, 0, 1, 1.25, 1); for (const sx of [-1, 1]) sph(g, .06, ET[k][1] === '#343a40' ? '#fff' : '#111', sx * .14, .62, .37); sph(g, .13, ET[k][3] ? '#ff6b6b' : '#69db7c', 0, 1.12, 0); g.userData.k = k; return g },
  mkGhost(r) { return this.mkCrit(r.c) },
  mkMon() {
    const g = new THREE.Group(); scene.add(g); box(g, 2.2, 1.8, 2, '#495057', 0, 1.5, 0); box(g, 1.9, 1.2, 1.7, '#343a40', 0, 2.95, .1);
    for (const x of [-1, 1]) { box(g, .42, .24, .06, MB('#ff2b2b'), x * .45, 3.05, .97); box(g, .5, .9, .5, '#343a40', x * .6, .45, .5); box(g, .5, .9, .5, '#343a40', x * .6, .45, -.5) }
    for (let i = 0; i < 4; i++) box(g, .16, .2, .06, '#f1f3f5', -.36 + i * .24, 2.55, .97);
    g.smoke = []; for (let i = 0; i < 5; i++) g.smoke.push(sph(g, .5, MB('#868e96', { transparent: true, opacity: .55 }), rnd(-.6, .6), 3.9 + i * .3, rnd(-.4, .4)));
    label(g, '💨 매연 괴물', 2.8, .6, '#111', '#ff8787', 0, 5.2, 0, 40).userData.bill = 1; g.visible = false; return g;
  },
  wallSeg(x, z, w, d, h) { const t = blockTex('#9c6b3c', '#8a5a2e', 2, false); t.repeat.set(Math.max(w, d) / 2, h / 2); box(null, w, h, d, new THREE.MeshToonMaterial({ map: t, gradientMap: grad }), x, h / 2, z); const g = blockTex('#5cb85c', '#4fa84f', 2, true); g.repeat.set(w / 2, d / 2); box(null, w + .1, .5, d + .1, new THREE.MeshToonMaterial({ map: g, gradientMap: grad }), x, h + .25, z) },
  tree(x, z, s = 1) { box(null, .9 * s, 3 * s, .9 * s, '#8b5a2b', x, 1.5 * s, z); box(null, 3.2 * s, 2 * s, 3.2 * s, '#37b24d', x, 3.6 * s, z); box(null, 2 * s, 1.2 * s, 2 * s, '#2f9e44', x, 5 * s, z) },
  palm(x, z) { for (let i = 0; i < 5; i++) box(null, .55, 1, .55, '#c08a4b', x + i * .12, .5 + i, z); for (let i = 0; i < 4; i++) { const l = box(null, 3, .2, .8, '#40c057', x + .6, 5.1, z); l.rotation.y = i * PI / 2; l.translateX(1.3); l.rotation.z = -.3 } },
  init() {
    newScene('#8fd3ff', 70, 190, { sunI: .7, amb: .5 });
    const gt = blockTex('#6fd36a', '#62c55d', 2, true); gt.repeat.set(45, 45); const gr = add(null, new THREE.PlaneGeometry(180, 180), new THREE.MeshToonMaterial({ map: gt, gradientMap: grad }), 0, 0, 0); gr.rotation.x = -PI / 2; gr.castShadow = false;
    for (let s = -36; s < 36; s += 6) { this.wallSeg(-37, s + 3, 4, 6, rnd(4, 8)); this.wallSeg(37, s + 3, 4, 6, rnd(4, 8)); this.wallSeg(s + 3, 37, 6, 4, rnd(4, 8)); this.wallSeg(s + 3, -37, 6, 4, 1.2) }
    const sand = add(null, new THREE.PlaneGeometry(180, 30), '#ffe8a3', 0, .02, -54); sand.rotation.x = -PI / 2; const sea = add(null, new THREE.PlaneGeometry(220, 80), MB('#4dabf7'), 0, -.1, -105); sea.rotation.x = -PI / 2;
    for (let i = 0; i < 8; i++) this.palm(rnd(-50, 50), rnd(-62, -44));
    for (let i = 0; i < 22; i++) { const a = rnd(0, TAU), r = rnd(43, 60); this.tree(Math.cos(a) * r, Math.max(-38, Math.sin(a) * r), rnd(1, 1.5)) }
    for (const [x, z] of [[-29, -29], [29, -29], [-29, 29], [29, 29], [-30, 8], [30, -10]]) this.tree(x, z, .8);
    for (let i = 0; i < 14; i++) { const a = rnd(0, TAU), r = rnd(9, 27), x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(Math.hypot(x, z) - 19) < 6) continue; box(null, 1.6, 1.2, 1.6, '#51cf66', x, .6, z) }
    // 둥지(블록)
    box(null, 17, .12, 17, '#dee2e6', 0, .06, 0); label(null, '🥚 알 둥지', 4, 1, '#f08c00', '#fff', 0, 4.6, 0).userData.bill = 1;
    this.slots = [.8, 1.4, 2.2, 3.0, .8, 1.4, 2.2, 3.0].map((h, i) => { const a = i / 8 * TAU, x = Math.cos(a) * 6.5, z = Math.sin(a) * 6.5, tier = h < 1 ? 0 : h < 2 ? 1 : h < 2.6 ? 2 : 3; box(null, 2.2, h, 2.2, TIER[tier][1], x, h / 2, z); box(null, 2.4, .14, 2.4, '#fff', x, h + .02, z); return { x, z, h, tier, egg: null } });
    this.p = this.mkCrit('rainbow'); scene.add(this.p.g); this.bases = {}; this.eggs = []; this.pets = []; this.carry = null; this.cg = null; this.seen = new Set();
    this.coin = 0; this.total = 0; this.goal = 1000; this.spd = 0; this.eff = 0; this.lock = 0; this.t = 0; this.spawn = 0; this.qn = 250; this.msgT = 0; this.vy = 0; this.inv = 0; this.dragX = 0;
    this.runT = 0; this.run = 0; this.jmp = 0; this.ctier = 0; this.mon = this.mkMon(); this.mwp = null;
    this.ai = NET.on ? [] : [{ id: 'ai1', n: '로봇 까미', c: '#845ef7' }, { id: 'ai2', n: '로봇 뚜비', c: '#20c997' }].map(o => { const ch = this.mkCrit(o.c); scene.add(ch.g); label(ch.g, o.n, 2.2, .55, '#111', '#fff', 0, 3.1, 0, 40).userData.bill = 1; return Object.assign(o, { ch, pets: [], carry: null, st: 'nest', wait: rnd(1, 4), total: 0 }) });
    const [bx, bz] = this.myBase(); this.p.g.position.set(bx, 0, bz); this.yaw = Math.atan2(bx, bz);
    setBtns([{ k: 'Space', i: '⬆️', l: '점프' }]);
    if (!window.__eggDrag) { window.__eggDrag = 1; addEventListener('mousemove', e => { if (e.buttons && e.target && e.target.id === 'cv') GAME.dragX += e.movementX }) }
    this.hud();
  },
  /* 화면 UI */
  hud() {
    let h = $('#eh'); if (h) h.remove();
    if (!$('#ehCss')) { const s = document.createElement('style'); s.id = 'ehCss'; s.textContent = `
#eh{position:fixed;inset:0;pointer-events:none;z-index:6;font-family:'Black Han Sans',Jua,sans-serif;color:#fff}
#eh .sq{pointer-events:auto;width:62px;height:58px;border:3px solid #111;border-radius:13px;color:#fff;font-size:24px;line-height:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:0 4px 0 #111;cursor:pointer;position:relative;padding:0;font-family:inherit}
#eh .sq:active{transform:translateY(3px);box-shadow:0 1px 0 #111}
#eh .sq i{font-style:normal;font-size:13px;text-shadow:0 1px 0 #111}
#eh .sq em{position:absolute;top:-10px;font-style:normal;min-width:22px;height:22px;border-radius:11px;background:#e03131;border:2px solid #111;font:13px/18px Jua,sans-serif;padding:0 4px}
#eh .sq em.l{left:-8px}#eh .sq em.r{right:-8px;background:#2f9e44}
#eh .pu{background:linear-gradient(#cc5de8,#9c36b5)}#eh .bl{background:linear-gradient(#4dabf7,#1c7ed6)}#eh .gr{background:linear-gradient(#69db7c,#2f9e44)}#eh .pk{background:linear-gradient(#faa2c1,#e64980)}#eh .gy{background:transparent;border:0;box-shadow:none;font-size:30px;width:44px}
#eh .tl{position:absolute;left:10px;top:10px;display:flex;gap:8px;align-items:center}
#eh .lf{position:absolute;left:10px;top:86px;display:flex;flex-direction:column;gap:14px}
#eh .rt{position:absolute;right:10px;top:40%;display:flex;flex-direction:column;gap:18px}
#eh .tr{position:absolute;right:10px;top:10px;display:flex;flex-direction:column;align-items:flex-end;gap:6px}
#eh .pill{background:rgba(25,40,55,.78);border:3px solid #111;border-radius:12px;padding:3px 12px 3px 8px;font-size:21px;box-shadow:0 3px 0 #111;white-space:nowrap}
#eh .pill.sm{font-size:15px;background:rgba(77,171,247,.85)}#eh .pill.go{font-size:14px;background:rgba(0,0,0,.55)}
#eh .tc{position:absolute;left:50%;top:12px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;width:min(52vw,440px)}
#ehRun{width:100%;text-align:center;background:linear-gradient(90deg,transparent,rgba(255,107,107,.92) 18%,rgba(255,107,107,.92) 82%,transparent);padding:5px 0;font-size:28px;-webkit-text-stroke:1px #111;display:none;animation:ehp .6s infinite alternate}
@keyframes ehp{to{filter:brightness(1.25)}}
#ehObj{background:rgba(0,0,0,.5);border-radius:10px;padding:4px 10px;font:14px Jua,sans-serif;text-align:center}#ehObj b{color:#ffd43b}
#ehPanel{display:none;pointer-events:auto;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,430px);max-height:74vh;overflow:auto;background:#fff;color:#111;border:4px solid #111;border-radius:18px;box-shadow:0 6px 0 #111;padding:14px 14px 16px;font-family:Jua,sans-serif}
#ehPanel h3{margin:0 0 6px;font:24px 'Black Han Sans',sans-serif}
#ehPanel .x{position:absolute;right:10px;top:8px;width:36px;height:36px;border:3px solid #111;border-radius:10px;background:#ff6b6b;color:#fff;font:20px 'Black Han Sans';cursor:pointer}
#ehPanel .row{display:flex;align-items:center;gap:10px;border:2px solid #dee2e6;border-radius:12px;padding:8px 10px;margin-top:8px;font-size:15px;line-height:1.35}
#ehPanel .row .ic{font-size:28px;flex:none;width:36px;text-align:center}
#ehPanel .row.off{opacity:.45}
#ehPanel .buy{margin-left:auto;flex:none;border:3px solid #111;border-radius:10px;background:#ffd43b;font:15px Jua,sans-serif;padding:6px 10px;box-shadow:0 3px 0 #111;cursor:pointer;color:#111}
#ehPanel .fb{height:8px;border-radius:4px;background:#e9ecef;overflow:hidden;margin-top:4px}#ehPanel .fb i{display:block;height:100%;background:#ff922b}
#ehPanel .note{font-size:13px;color:#555;margin-top:8px}
@media(max-width:640px){#eh .sq{width:50px;height:48px;font-size:19px}#eh .sq i{font-size:11px}#eh .lf{top:68px}#eh .pill{font-size:16px}#eh .pill.sm{font-size:13px}#eh .tc{top:12px;width:33vw}#ehRun{font-size:18px}#ehObj{font-size:11.5px;padding:3px 6px}#eh .rt{top:36%}}`; document.head.appendChild(s) }
    h = document.createElement('div'); h.id = 'eh'; h.innerHTML = `
<div class="tl"><button class="sq gy" data-p="set">⚙️</button><button class="sq pu" data-p="shop">🏪<i>상점</i></button></div>
<div class="lf"><button class="sq bl" data-p="bag">🎒<i>가방</i></button><button class="sq bl" data-p="idx">📕<i>도감</i></button></div>
<div class="tc"><div id="ehRun">Run!</div><div id="ehObj"></div></div>
<div class="tr"><div class="pill">⚡ <b id="ehCoin">0</b></div><div class="pill sm" id="ehTime"></div><div class="pill go" id="ehGoal"></div></div>
<div class="rt"><button class="sq gr" data-p="bag">🐾<i>펫</i><em class="l" id="ehPetF">0</em><em class="r" id="ehPetR">0</em></button><button class="sq pk" data-p="egg">🥚<i>알</i></button></div>
<div id="ehPanel"></div>`;
    document.body.appendChild(h); $('.hud').style.display = 'none'; $('#board').style.top = '150px';
    h.querySelectorAll('[data-p]').forEach(b => b.onclick = e => { e.stopPropagation(); this.open(this.pan === b.dataset.p ? null : b.dataset.p) });
    h.addEventListener('mousedown', e => e.stopPropagation()); this.pan = null; this.panT = 0;
  },
  open(p) {
    this.pan = p; const P = $('#ehPanel'); if (!p) { P.style.display = 'none'; return } P.style.display = 'block';
    const c1 = 40 + this.spd * 40, c3 = 60 + this.eff * 60, row = (ic, txt, btn) => `<div class="row"><div class="ic">${ic}</div><div>${txt}</div>${btn || ''}</div>`;
    let s = `<button class="x" data-c>✕</button>`;
    if (p === 'shop') s += `<h3>🏪 업그레이드 상점</h3>` + row('👟', `<b>달리기 속도</b> Lv.${this.spd}/5`, this.spd < 5 ? `<button class="buy" data-b="1">⚡${c1}</button>` : '') + row('🦘', `<b>점프력</b> Lv.${this.jmp}/3 — 높은 받침대의 희귀 알`, this.jmp < 3 ? `<button class="buy" data-b="4">⚡${50 + this.jmp * 60}</button>` : '') + row('🔒', `<b>기지 잠금</b> 25초 동안 아무도 못 훔쳐요`, `<button class="buy" data-b="2">⚡30</button>`) + row('💡', `<b>발전 효율</b> Lv.${this.eff}/4 — 같은 펫으로 전기를 더 많이`, this.eff < 4 ? `<button class="buy" data-b="3">⚡${c3}</button>` : '') + `<div class="note">💡 효율을 높이면 같은 에너지로 더 많은 일을 할 수 있어요. 에너지 효율 등급 1등급 제품처럼요!</div>`;
    else if (p === 'egg') s += `<h3>🥚 재생에너지 알 가게</h3>` + Object.keys(SHOPEGG).map(k => row(`<span style="color:${ET[k][1]}">●</span>`, `<b>${ET[k][0]}</b> 초당 ⚡${ET[k][2]} · 고갈 없음 ♻️`, `<button class="buy" data-e="${k}">⚡${SHOPEGG[k]}</button>`)).join('') + `<div class="note">⛽ 화석 연료 알(석탄·석유·가스)은 가게에서 팔지 않아요. 둥지에서만 나오고, 쓰면 없어져요.</div>`;
    else if (p === 'bag') s += `<h3>🎒 가방 · 내 펫</h3>` + (this.carry ? row('🥚', `들고 있는 알: <b>${ET[this.carry][0]}</b> → 내 기지로!`) : '') + (this.pets.length ? this.pets.map(q => row(`<span style="color:${ET[q.k][1]}">●</span>`, `<b>${ET[q.k][0].replace(' 알', '')} 펫</b> ${TIER[q.t || 0][0]} ${q.h > 0 ? '🐣 부화 중 ' + Math.ceil(q.h) + '초' : '초당 ⚡' + (ET[q.k][2] * (q.m || 1) * (1 + this.eff * .25)).toFixed(1)}` + (ET[q.k][3] ? `<div class="fb"><i style="width:${Math.max(0, q.left / ET[q.k][3] * 100)}%"></i></div>` : ' · ♻️ 계속'))).join('') : `<div class="note">아직 펫이 없어요. 둥지에서 알을 가져와요!</div>`) + `<div class="note">주황 막대 = 남은 연료. 화석 연료 펫은 막대가 다 닳으면 사라져요.</div>`;
    else if (p === 'idx') s += `<h3>📕 에너지 알 도감 ${this.seen.size}/6</h3>` + EK.map(k => this.seen.has(k) ? row(`<span style="color:${ET[k][1]}">●</span>`, `<b>${ET[k][0]}</b> ${ET[k][3] ? '⛽ 화석 연료' : '♻️ 재생에너지'}<br>${EI[k]}`) : `<div class="row off"><div class="ic">❔</div><div>??? — 알을 모으면 열려요</div></div>`).join('');
    else s += `<h3>❓ 하는 법</h3><div style="font-size:15px;line-height:1.5">${this.how}</div><div class="note">${this.help}</div>`;
    P.innerHTML = s; P.querySelector('[data-c]').onclick = () => this.open(null);
    P.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { this.buy(+b.dataset.b); this.open(p) });
    P.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { const k = b.dataset.e; if (this.coin >= SHOPEGG[k]) { this.coin -= SHOPEGG[k]; this.pets.push({ k, left: 0 }); this.see(k); snd('ok'); toast(`${ET[k][0]} 부화! 계속 벌어요 ♻️`, '#69db7c') } else { toast(`⚡${SHOPEGG[k]} 필요`, '#ddd', .7); snd('bad') } this.open(p) });
  },
  buy(n) {
    const c1 = 40 + this.spd * 40, c3 = 60 + this.eff * 60;
    if (n === 1 && this.spd < 5) { if (this.coin >= c1) { this.coin -= c1; this.spd++; snd('ok'); toast('👟 속도 업!', '#ffd43b') } else toast(`⚡${c1} 필요`, '#ddd', .7) }
    if (n === 2) { if (this.lock > 0) toast('이미 잠겨 있어요', '#74c0fc', .7); else if (this.coin >= 30) { this.coin -= 30; this.lock = 25; snd('ok'); toast('🔒 25초 동안 기지 잠금!', '#74c0fc') } else toast('⚡30 필요', '#ddd', .7) }
    if (n === 4 && this.jmp < 3) { const c4 = 50 + this.jmp * 60; if (this.coin >= c4) { this.coin -= c4; this.jmp++; snd('ok'); toast('🦘 점프력 업! 더 높이', '#ffd43b') } else toast(`⚡${c4} 필요`, '#ddd', .7) }
    if (n === 3 && this.eff < 4) { if (this.coin >= c3) { this.coin -= c3; this.eff++; snd('ok'); toast('💡 효율 업! 같은 펫으로 더 많이', '#ffd43b') } else toast(`⚡${c3} 필요`, '#ddd', .7) }
  },
  see(k) { if (!this.seen.has(k)) { this.seen.add(k); setTimeout(() => toast(`📕 도감 등록: ${ET[k][0]}`, '#ffd43b', 1.2), 900) } },
  ids() { return [NET.id].concat(Object.keys(NET.rem), this.ai.map(a => a.id)).sort() },
  myBase() { const ids = this.ids(); return this.bpos(ids.indexOf(NET.id), ids.length) },
  base(id, col, name) {
    let b = this.bases[id];
    if (!b || b.sc !== scene) { const g = new THREE.Group(); scene.add(g); box(g, 9.4, .3, 9.4, col, 0, .15, 0); box(g, 8.4, .34, 8.4, '#f8f9fa', 0, .17, 0); const sz = label(g, 'SAFE ZONE', 6.5, 1.3, null, '#adb5bd', 0, .36, 2.6, 52); sz.rotation.x = -PI / 2; for (const [x, z] of [[-4.4, -4.4], [4.4, -4.4], [-4.4, 4.4], [4.4, 4.4]]) box(g, .5, 1.6, .5, col, x, .8, z); const sh = sph(g, 6, MB('#74c0fc', { transparent: true, opacity: .25, depthWrite: false }), 0, .3, 0, 1, .75, 1); label(g, name, 3.2, .7, col, '#fff', 0, 4.2, 0, 40).userData.bill = 1; b = this.bases[id] = { g, sh, sc: scene, items: [] } }
    const ids = this.ids(), [x, z] = this.bpos(ids.indexOf(id), ids.length); b.g.position.set(x, 0, z); b.g.rotation.y = Math.atan2(x, z); b.x = x; b.z = z; return b;
  },
  inB(x, z, b) { return b && Math.abs(x - b.x) < 4.6 && Math.abs(z - b.z) < 4.6 },
  showPets(b, kinds) { const sig = kinds.join(','); if (b.sig === sig) return; b.sig = sig; b.items.forEach(m => b.g.remove(m)); b.items = kinds.map((k, i) => this.mkEgg(k, b.g, -3 + (i % 5) * 1.5, .35, -3 + Math.floor(i / 5) * 1.5, .9)) },
  take(k) { this.carry = k; if (this.cg) this.p.g.remove(this.cg); this.cg = this.mkEgg(k, this.p.g, 0, 2.25, 0, .9); this.see(k); snd('jump') },
  drop() { this.carry = null; if (this.cg) { this.p.g.remove(this.cg); this.cg = null } },
  net() { const P = this.p.g.position; return [P.x, P.y, P.z, this.p.g.rotation.y, Math.floor(this.total), this.pets.map(p => p.k).join(','), this.lock > 0 ? 1 : 0, this.carry || ''] },
  ghost(r) { const b = this.base(r.id, r.c, r.n || '친구'); this.showPets(b, r.d[5] ? r.d[5].split(',') : []); b.sh.visible = !!r.d[6]; if (r.d[4] >= this.goal && playing) endGame(false, `${r.n}님이 먼저 ⚡${this.goal}을 모았어요!`) },
  onNet(m) {
    if (m.t === 'steal') { if (this.lock > 0 || !this.pets[m.i]) return; const p = this.pets.splice(m.i, 1)[0]; NET.send({ t: 'given', to: m.id, k: p.k, left: p.left }); toast(`🚨 ${(NET.rem[m.id] || {}).n || '누군가'}이(가) ${ET[p.k][0]}을 훔쳐갔다!`, '#ff8787', 2); snd('bad') }
    else if (m.t === 'given' && !this.carry) { this.take(m.k); this.cleft = m.left; toast(`${ET[m.k][0]} 훔치기 성공! 기지로!`, '#ffd43b') }
  },
  update(dt) {
    this.t += dt; const t = this.t, P = this.p.g.position, a = axis(), sp = (7 + this.spd * 1.2) * ((K.ShiftLeft || K.ShiftRight) ? 1.3 : 1) * (this.carry ? .85 : 1); this.lock -= dt; this.msgT -= dt; this.inv -= dt;
    // 카메라 회전 · 이동(화면 기준)
    this.yaw -= lookDX * .0035 + this.dragX * .006 + ((K.KeyE ? 1 : 0) - (K.KeyQ ? 1 : 0)) * dt * 2.4; this.dragX = 0;
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw), mx = Math.cos(this.yaw) * a.x - fx * a.y, mz = -Math.sin(this.yaw) * a.x - fz * a.y;
    const ox = P.x, oz = P.z; P.x = clamp(P.x + mx * sp * dt, -32, 32); P.z = clamp(P.z + mz * sp * dt, -32, 32);
    let gy = 0; for (const S of this.slots) if (Math.abs(P.x - S.x) < 1.35 && Math.abs(P.z - S.z) < 1.35) { if (P.y >= S.h - .35) gy = Math.max(gy, S.h); else { P.x = ox; P.z = oz } }
    if ((hit('Space') || hit('KeyJ')) && this.og) { this.vy = 10 + this.jmp * 1.6; snd('jump') } this.vy -= 28 * dt; P.y += this.vy * dt; this.og = false; if (P.y <= gy) { P.y = gy; this.vy = 0; this.og = true }
    if (a.x || a.y) { this.p.g.rotation.y = Math.atan2(mx, mz); walk(this.p, t * 13) } else stand(this.p, t);
    if (!this.og) { this.p.aL.rotation.z = -.6 - Math.sin(t * 30) * .5; this.p.aR.rotation.z = -this.p.aL.rotation.z } else this.p.aL.rotation.z = this.p.aR.rotation.z = 0;
    this.p.g.visible = this.inv <= 0 || Math.sin(t * 30) > 0;
    // 둥지 알
    this.runT -= dt; if (this.runT <= 0) { this.runT = 30; let n = 0; for (const S of this.slots) if (!S.egg) { const k = Math.random() < .5 ? pick(['coal', 'oil', 'gas']) : pick(['sun', 'wind', 'sun', 'wind', 'water']); S.egg = this.mkEgg(k, null, S.x, S.h + .1, S.z); S.egg.userData.tier = S.tier; this.eggs.push(S.egg); n++ } if (n && this.t > 1) toast(`🥚 알 재입고! (${n}개)`, '#ffd43b', 1.2) }
    if (!this.carry) for (const S of this.slots) { const e = S.egg; if (e && Math.hypot(P.x - S.x, P.z - S.z) < 1.4 && P.y >= S.h - .5) { scene.remove(e); this.eggs.splice(this.eggs.indexOf(e), 1); S.egg = null; this.take(e.userData.k); this.cleft = null; this.ctier = S.tier; this.run = 22; this.mon.position.set(0, 0, 0); this.mwp = null; snd('bad'); shake = .3; toast(`${TIER[S.tier][0]} ${ET[this.carry][0]} 획득! Run! 둥지 경비가 쫓아온다`, '#ff8787', 1.6); break } }
    // 내 기지
    const mb = this.base(NET.id, NET.col, '내 기지'), inBase = this.inB(P.x, P.z, mb); mb.sh.visible = this.lock > 0;
    if (inBase && this.carry) { const k = this.carry; this.pets.push({ k, left: this.cleft != null ? this.cleft : ET[k][3], m: TIER[this.ctier][2], t: this.ctier, h: 5 }); this.drop(); this.ctier = 0; snd('ok'); if (this.run > 0) { this.run = 0; this.mon.visible = false } toast('🐣 알을 펜에 놓았다! 5초 뒤 부화', '#69db7c', 1.2) }
    for (const q of this.pets) if (q.h > 0) { q.h -= dt; if (q.h <= 0) { snd('ok'); toast(ET[q.k][3] ? `${ET[q.k][0]} 부화! 많이 벌지만 곧 고갈돼요` : `${ET[q.k][0]} 부화! 계속 벌어요 ♻️`, '#69db7c', 1.4) } }
    if (hit('Digit1')) this.buy(1); if (hit('Digit2')) this.buy(2); if (hit('Digit3')) this.buy(3); if (hit('Digit4')) this.buy(4);
    // 발전
    let inc = 0; for (let i = this.pets.length - 1; i >= 0; i--) { const p = this.pets[i], e = ET[p.k]; if (p.h > 0) continue; const g = e[2] * (p.m || 1) * (1 + this.eff * .25) * dt; inc += g; if (e[3]) { p.left -= e[2] * dt; if (p.left <= 0) { this.pets.splice(i, 1); toast(`⛽ ${e[0].replace(' 알', '')} 고갈! 화석 연료는 유한해요`, '#ffa8a8', 1.8); snd('bad') } } }
    this.coin += inc; this.total += inc; this.showPets(mb, this.pets.map(p => p.k));
    for (const id in this.bases) this.bases[id].items.forEach((m, i) => { m.position.y = .35 + Math.abs(Math.sin(t * 4 + i)) * .25; m.rotation.y = Math.sin(t * 2 + i) * .5 });
    // 훔치기 (친구·로봇 기지)
    if (!this.carry && this.msgT <= 0) {
      for (const k in NET.rem) { const r = NET.rem[k], b = this.bases[k]; if (!r.d || !b || !r.d[5]) continue; if (this.inB(P.x, P.z, b)) { if (r.d[6]) { toast('🔒 잠긴 기지예요', '#74c0fc', .8); this.msgT = 1.5 } else { NET.send({ t: 'steal', to: k, i: 0 }); this.msgT = 1.2 } } }
      for (const A of this.ai) { const b = this.bases[A.id]; if (b && A.pets.length && this.inB(P.x, P.z, b)) { const p = A.pets.shift(); this.take(p.k); this.cleft = p.left; toast(`${ET[p.k][0]} 훔치기 성공! 기지로!`, '#ffd43b'); this.msgT = 1 } }
    }
    // Run! 매연 괴물
    const M = this.mon; if (this.run > 0) {
      this.run -= dt; M.visible = true; const safe = inBase || this.inv > 0 || !this.carry; let tx, tz;
      if (!safe) { tx = P.x; tz = P.z } else { if (!this.mwp || Math.hypot(M.position.x - this.mwp[0], M.position.z - this.mwp[1]) < 2) this.mwp = [rnd(-26, 26), rnd(-26, 26)]; tx = this.mwp[0]; tz = this.mwp[1] }
      const dx = tx - M.position.x, dz = tz - M.position.z, l = Math.hypot(dx, dz) || 1, ms = safe ? 4 : 5.6 + this.ctier * .45 + this.spd * .45;
      let nx = M.position.x + dx / l * ms * dt, nz = M.position.z + dz / l * ms * dt;
      for (const id in this.bases) { const b = this.bases[id]; if (Math.abs(nx - b.x) < 5.6 && Math.abs(nz - b.z) < 5.6) { nx = M.position.x; nz = M.position.z; this.mwp = null } }
      M.position.x = nx; M.position.z = nz; M.rotation.y = Math.atan2(dx, dz); M.position.y = Math.abs(Math.sin(t * 9)) * .3; M.smoke.forEach((s, i) => { s.position.y = 3.9 + ((t * .8 + i * .3) % 1.6); s.material.opacity = .55 * (1 - ((t * .8 + i * .3) % 1.6) / 1.6) });
      if (!safe && Math.hypot(P.x - M.position.x, P.z - M.position.z) < 1.9) { const lost = Math.min(this.coin, 40); this.coin -= lost; if (this.carry) this.drop(); this.run = Math.min(this.run, 2); P.set(mb.x, 0, mb.z); this.inv = 2.5; flash(); shake = .5; snd('bad'); toast(`💨 둥지 경비(매연 괴물)에게 잡혔다! 알을 빼앗겼어요 ⚡-${Math.floor(lost)}`, '#ff8787', 1.6) }
      for (const A of this.ai) { const C = A.ch.g.position, b = this.bases[A.id]; if (!this.inB(C.x, C.z, b) && Math.hypot(C.x - M.position.x, C.z - M.position.z) < 1.9) { A.carry = null; A.stole = 0; C.set(b.x, 0, b.z); A.st = 'nest' } }
      if (this.run <= 0) { M.visible = false; toast('휴~ 경비가 둥지로 돌아갔어요', '#b2f2bb', 1.2) }
    }
    // 로봇 라이벌 (혼자 할 때)
    for (const A of this.ai) {
      const b = this.base(A.id, A.c, A.n), C = A.ch.g.position; this.showPets(b, A.pets.map(p => p.k)); b.sh.visible = false; if (!A.init) { A.init = 1; C.set(b.x, 0, b.z) }
      let tx = b.x, tz = b.z; A.wait -= dt;
      if (A.st === 'nest') { tx = 0; tz = 0; if (Math.hypot(C.x, C.z) < 4 && A.wait <= 0) { A.carry = Math.random() < .55 ? pick(['coal', 'oil', 'gas']) : pick(['sun', 'wind']); A.st = 'home' } }
      else if (A.st === 'raid') { tx = mb.x; tz = mb.z; if (this.inB(C.x, C.z, mb)) { if (this.lock > 0 || !this.pets.length) { A.st = 'home'; if (this.lock > 0) toast(`🔒 ${A.n}를 잠금으로 막았다!`, '#74c0fc', 1.2) } else { const p = this.pets.splice(Math.random() * this.pets.length | 0, 1)[0]; A.carry = p.k; A.cl = p.left; A.st = 'home'; A.stole = 1; toast(`🚨 ${A.n}가 ${ET[p.k][0]}을 훔쳐간다! 쫓아가 부딪혀요`, '#ff8787', 2.2); snd('bad') } } }
      else if (Math.hypot(C.x - b.x, C.z - b.z) < 2) { if (A.carry) { A.pets.push({ k: A.carry, left: A.cl != null ? A.cl : ET[A.carry][3] }); A.carry = null; A.cl = null; A.stole = 0 } A.st = this.pets.length > 1 && Math.random() < .3 ? 'raid' : 'nest'; A.wait = rnd(2, 5) }
      if (this.run > 0 && A.st !== 'home') { tx = b.x; tz = b.z }
      if (A.stole && A.carry && Math.hypot(C.x - P.x, C.z - P.z) < 1.6 && !this.carry) { this.take(A.carry); this.cleft = A.cl; A.carry = null; A.stole = 0; A.st = 'home'; toast('되찾았다!', '#69db7c'); snd('ok') }
      const dx = tx - C.x, dz = tz - C.z, l = Math.hypot(dx, dz) || 1, v = (A.wait > 0 && A.st === 'nest' && l < 4) || l < .3 ? 0 : 5.4; C.x += dx / l * v * dt; C.z += dz / l * v * dt; A.ch.g.rotation.y = Math.atan2(dx, dz); v ? walk(A.ch, t * 11) : stand(A.ch, t);
      if (A.cg && (!A.carry || A.cg.userData.k !== A.carry)) { A.ch.g.remove(A.cg); A.cg = null } if (A.carry && !A.cg) A.cg = this.mkEgg(A.carry, A.ch.g, 0, 2.25, 0, .9);
      for (let i = A.pets.length - 1; i >= 0; i--) { const p = A.pets[i], e = ET[p.k]; A.total += e[2] * dt * .55; if (e[3]) { p.left -= e[2] * dt; if (p.left <= 0) A.pets.splice(i, 1) } }
      if (A.total >= this.goal) return endGame(false, `${A.n}가 먼저 ⚡${this.goal}을 모았어요. 재생에너지 펫을 늘려 봐요!`);
    }
    for (const e of this.eggs) e.rotation.y += dt;
    if (this.total >= this.qn) { this.qn += 250; this.open(null); quiz(ok => { if (ok) { this.coin += 60; this.total += 60; toast('정답! ⚡+60', '#ffd43b') } }) }
    if (this.total >= this.goal) return endGame(true, `⚡${this.goal} 달성! 재생에너지 펫이 오래오래 벌어 줬어요.`);
    // 화면 UI
    const fossil = this.pets.filter(p => ET[p.k][3]).length, sec = Math.ceil(this.run > 0 ? this.run : this.runT);
    $('#ehCoin').textContent = Math.floor(this.coin); $('#ehPetF').textContent = '⛽' + fossil; $('#ehPetR').textContent = '♻️' + (this.pets.length - fossil);
    $('#ehTime').textContent = this.run > 0 ? `🏃 Run ${sec}초` : `🥚 재입고 ${Math.floor(sec / 60)}m${String(sec % 60).padStart(2, '0')}s`;
    $('#ehGoal').innerHTML = `🏁 ${Math.floor(this.total)}/${this.goal}${this.lock > 0 ? ' 🔒' + Math.ceil(this.lock) : ''}` + this.ai.map(A => `<br><span style="color:${A.c}">●</span> ${A.n} ${Math.floor(A.total)}`).join('');
    $('#ehRun').style.display = this.run > 0 ? 'block' : 'none';
    $('#ehObj').innerHTML = this.run > 0 && !inBase ? '💨 둥지 경비가 쫓아와요! <b>SAFE ZONE</b>으로!' : this.carry ? `🥚 <b>${ET[this.carry][0]}</b>을 <b>내 기지</b>로!` : '🪹 <b>알 둥지</b> 받침대에 점프해 알 훔치기 · 높을수록 귀한 알 · 다른 기지에서도 <b>훔치기</b>';
    this.panT -= dt; if (this.pan === 'bag' && this.panT <= 0) { this.panT = .5; this.open('bag') }
    // 3인칭 카메라
    const cd = W < H ? 12 : 10, ch = W < H ? 6.5 : 5.2; cam.position.set(P.x + Math.sin(this.yaw) * cd, P.y + ch, P.z + Math.cos(this.yaw) * cd); cam.lookAt(P.x, P.y + 1.6, P.z);
    const q = new THREE.Quaternion(); scene.traverse(o => { if (o.userData.bill && o.parent) { o.parent.getWorldQuaternion(q); o.quaternion.copy(q.invert().multiply(cam.quaternion)) } });
  }
};
