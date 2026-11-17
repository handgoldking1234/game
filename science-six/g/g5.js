/* 5. 와이어 기동대 — 자원과 에너지 (와이어로 날아다니며 거인 행진 막기) */
const GT = [['석탄 거인', '#343a40'], ['석유 거인', '#6b4226'], ['가스 거인', '#868e96']];
const GAME = {
  id: 'wire', title: '와이어 기동대', sub: '날아올라 매연 거인의 행진을 멈춰라!', emoji: '🪝', unit: '자원과 에너지',
  facts: ['석탄·석유·천연가스는 <b>양이 정해진(유한한) 자원</b>이에요.', '<b>태양광·풍력</b> 같은 재생에너지는 계속 다시 얻을 수 있어요.', '에너지는 <b>아껴 쓰고 효율적으로</b> 써야 오래 쓸 수 있어요.'],
  how: '등에 멘 <b>태양광 와이어 장치</b>와 빨간 망토로 날아요! 화면 가운데로 <b>거인이나 돌기둥</b>을 겨누고 <b>와이어(클릭/J)를 누르고 있으면</b> 줄에 끌려 날아가요. <b>손을 떼면</b> 그 속도 그대로 날아가니, 기둥에서 기둥으로 그네처럼 이어 타요. 공중에서 <b>Space</b>는 가스 분사(급가속)! 빠르게 거인 가슴의 <b>빛나는 코어</b>를 스치면 베어요(빠를수록 세게). 가스는 유한 — <b>K</b>로 ☀️태양광·🌬️풍력 충전탑에 가서 채워요.',
  help: '시점 마우스 / Q·E · 와이어 클릭·J(누르고 있기) · 분사 Space · 충전탑 K · 거인화 R · 이동 WASD',
  quiz: [
    { q: '화석 연료에 해당하지 않는 것은?', a: ['바람', '석탄', '석유', '천연가스'], e: '바람은 재생에너지(풍력)의 자원이에요.' },
    { q: '재생에너지의 좋은 점은?', a: ['계속 다시 얻을 수 있다', '쓰면 영영 없어진다', '땅속에서만 캘 수 있다', '매연이 많이 나온다'], e: '태양광·풍력은 고갈되지 않고 계속 이용할 수 있어요.' },
    { q: '자원이 유한하다는 말의 뜻은?', a: ['양이 정해져 있어 다 쓰면 없어진다', '끝없이 많다', '색이 변한다', '무게가 없다'], e: '유한하다는 것은 한계가 있다는 뜻이에요.' },
    { q: '에너지를 지속가능하게 이용하는 방법은?', a: ['재생에너지를 늘리고 에너지를 아껴 쓴다', '화석 연료만 더 많이 쓴다', '전등을 항상 켜 둔다', '물건을 한 번 쓰고 버린다'], e: '미래 세대도 쓸 수 있도록 자원을 아끼고 재생에너지를 이용해요.' },
    { q: '플라스틱은 주로 어떤 자원으로 만들까요?', a: ['석유', '나무', '물', '모래'], e: '플라스틱·합성 섬유는 석유로 만들어요.' },
    { q: '풍력 발전기를 세우기 좋은 곳은?', a: ['바람이 많이 부는 곳', '바람이 전혀 없는 곳', '지하실', '터널 안'], e: '풍력 발전은 바람이 세고 꾸준한 곳에서 효율이 좋아요.' },
  ],
  net() { return [this.pos.x, this.pos.y, this.pos.z, this.yaw + PI, this.kill] },
  init() {
    newScene('#ffc9a8', 90, 260, { ground: '#8d7a5c', fov: 65 }); box(null, 260, .2, 320, '#b9a27c', 0, -.1, -110);
    box(null, 120, 7, 4, '#868e96', 0, 3.5, 16); for (let x = -58; x <= 58; x += 4) box(null, 2, 1.2, 4.2, '#adb5bd', x, 7.6, 16); for (let i = 0; i < 12; i++) { box(null, 5, 4, 5, '#ffe8cc', -55 + i * 10, 2, 28); cone(null, 4.4, 3, '#e8590c', -55 + i * 10, 5.5, 28, 4).rotation.y = PI / 4 }
    this.tw = [[-28, -30, 0], [28, -30, 1], [0, -60, 0], [-34, -90, 1], [34, -90, 0], [0, -115, 1]].map(([x, z, k]) => { const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); cyl(g, 1.2, 1.6, 18, '#dee2e6', 0, 9, 0, 10); cyl(g, 3, 3, .5, '#ffd43b', 0, 18.2, 0, 16); if (k) { const b = new THREE.Group(); b.position.set(0, 22, 0); g.add(b); for (let i = 0; i < 3; i++) { const bl = box(b, .5, 5, .15, '#fff', 0, 2.5, 0); bl.geometry.translate(0, 0, 0); const h = new THREE.Group(); h.rotation.z = i * TAU / 3; h.add(bl); b.add(h) } g.userData.blade = b; cyl(g, .25, .25, 4, '#dee2e6', 0, 20, 0, 8) } else { const pn = box(g, 5, .2, 3.4, '#1c7ed6', 0, 19.6, 0); pn.rotation.x = -.4 } label(g, k ? '🌬️ 풍력 충전탑' : '☀️ 태양광 충전탑', 6, 1, '#111', '#ffd43b', 0, 16, 1.8, 40); return { g, x, z, y: 18.5 } });
    this.pl = []; for (let i = 0; i < 16; i++) { const x = -60 + (i % 4) * 40 + rnd(-6, 6), z = -20 - (i / 4 | 0) * 38 + rnd(-8, 8), h = rnd(16, 26); cyl(null, 1.6, 2.2, h, '#a39a8c', x, h / 2, z, 8); sph(null, .5, MB('#ffe066'), x, h + .4, z); this.pl.push(V3(x, h, z)) }
    this.gs = []; for (let i = 0; i < 12; i++) this.mk(-48 + (i % 6) * 19 + rnd(-4, 4), -150 - (i / 6 | 0) * 60 - rnd(0, 20), i);
    this.me = person({ top: '#1c3d5a', bottom: '#e9ecef', hat: null, hair: '#3b2a20' }); scene.add(this.me.g); this.gear(); this.rope = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V3(), V3()]), new THREE.LineBasicMaterial({ color: '#fff' })); scene.add(this.rope); this.rope.visible = false;
    this.pos = V3(0, 8.2, 16); this.vel = V3(); this.yaw = 0; this.pitch = -.05; this.gas = 100; this.hp = 5; this.wall = 5; this.kill = 0; this.t = 0; this.hook = null; this.qn = 4; this.inv = 0; this.tg = 0; this.titan = 0; this.pc = 0;
    lookOn = true; $('#cross').style.display = 'block'; setBtns([{ k: 'KeyR', i: '🌞', l: '거인화' }, { k: 'KeyK', i: '🔋', l: '충전탑' }, { k: 'Space', i: '⤴️', l: '분사' }, { k: 'KeyJ', i: '🪝', l: '와이어' }]);
  },
  gear() {
    const M = this.me, b = M.body;
    // 등 장치: 둥근 배낭 + 태양광 팬 + 가스 표시등
    box(b, .62, .7, .34, '#495057', 0, .12, -.4); const fan = new THREE.Group(); fan.position.set(0, .12, -.6); b.add(fan); cyl(fan, .3, .3, .08, '#ffd43b', 0, 0, 0, 16).rotation.x = PI / 2; for (let i = 0; i < 4; i++) { const bl = box(fan, .07, .5, .03, '#1c7ed6', 0, 0, -.05); bl.rotation.z = i * PI / 4 } this.fan = fan;
    this.lamp = sph(b, .07, MB('#69db7c'), .25, .4, -.58);
    // 손목 와이어 발사기
    for (const a of [M.aL, M.aR]) { cyl(a, .13, .13, .3, '#ffd43b', 0, -.5, .05, 10); cyl(a, .05, .05, .2, '#212529', 0, -.6, .2, 8).rotation.x = PI / 2 }
    this.blade = box(M.aR, .07, .09, 1.3, '#a5d8ff', 0, -.62, .75); box(M.aR, .14, .14, .2, '#343a40', 0, -.62, .12);
    // 띠 장비
    box(b, .74, .08, .48, '#3b2a20', 0, -.22, 0); for (const sx of [-1, 1]) box(b, .06, .82, .47, '#3b2a20', sx * .2, .15, 0);
    // 망토 (3마디)
    let par = b, y = .5; this.cape = []; for (let i = 0; i < 3; i++) { const g = new THREE.Group(); g.position.set(0, y, i ? 0 : -.3); par.add(g); const m = box(g, .9 - i * .02, .42, .04, '#c92a2a', 0, -.21, 0); if (i === 1) label(g, '☀', .4, .4, null, '#ffd43b', 0, -.21, -.03, 80).rotation.y = PI; this.cape.push(g); par = g; y = -.42 }
    // 거인화용 빛
    this.aura = sph(this.me.g, 1.6, MB('#ffd43b', { transparent: true, opacity: .25, depthWrite: false }), 0, 1.2, 0); this.aura.visible = false;
  },
  titanOn() {
    if (this.titan > 0 || this.tg < 100) return; this.tg = 0; this.titan = 15; this.hook = null; this.vel.set(0, 0, 0); this.pos.y = 0; snd('win'); flash(); shake = 1.2;
    toast('🌞 태양 거인 변신! 15초 동안 거인을 밀어내요', '#ffd43b', 2); this.me.g.scale.setScalar(5); this.aura.visible = true;
  },
  titanOff() { this.titan = 0; this.me.g.scale.setScalar(1); this.aura.visible = false; this.pos.set(this.pos.x, 8.2, clamp(this.pos.z, -200, 16)); if (Math.abs(this.pos.z - 16) > 3) this.pos.y = 0; toast('변신 끝! 다시 와이어로', '#fff', 1.2) },
  mk(x, z, i) { const [name, col] = GT[i % 3], big = i % 4 === 3, s = big ? 1.35 : 1, g = new THREE.Group(); g.scale.setScalar(s); sph(g, 3.2, col, 0, 8, 0, 1, 1.3, .9); sph(g, 2.2, col, 0, 14, 0); for (const sd of [-1, 1]) { sph(g, .4, '#ff6b6b', sd * .8, 14.4, 1.9); const l = cyl(g, 1, 1.2, 5, col, sd * 1.6, 2.5, 0); l.userData.leg = sd; const ar = cyl(g, .8, .9, 6, col, sd * 4, 8, 0); ar.rotation.z = sd * .3 } const core = sph(g, 1.1, MB('#ffe066'), 0, 9, 2.8); cyl(g, .6, .9, 2, '#495057', 0, 17, 0).userData.st = 1; label(g, name, 7, 1.4, '#111', '#fff', 0, 20, 0, 44); g.position.set(x, 0, z); scene.add(g); this.gs.push({ g, x, z, hp: big ? 3 : 2, s, name, core, v: rnd(2.6, 3.4) }) },
  update(dt) {
    this.t += dt; const t = this.t, P = this.pos; this.inv -= dt;
    this.yaw -= lookDX * .0028 + ((K.ArrowRight || K.KeyE ? 1 : 0) - (K.ArrowLeft || K.KeyQ ? 1 : 0)) * dt * 2.2; this.pitch = clamp(this.pitch - lookDY * .0022 + ((K.ArrowUp ? 1 : 0) - (K.ArrowDown ? 1 : 0)) * dt, -.7, .9);
    const fw = V3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)), rt = V3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)), aim = V3(0, 0, -1).applyEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
    if (hit('KeyR')) { if (this.tg >= 100) this.titanOn(); else toast(`거인화 게이지 ${Math.floor(this.tg)}% (거인을 쓰러뜨리면 차요)`, '#ddd', .9) }
    if (this.titan > 0) { this.titan -= dt; this.pc -= dt; const mx = (K.KeyD ? 1 : 0) - (K.KeyA ? 1 : 0) + joy.x, mz = (K.KeyW ? 1 : 0) - (K.KeyS ? 1 : 0) - joy.y; P.addScaledVector(fw, mz * 16 * dt).addScaledVector(rt, mx * 16 * dt); P.y = 0; P.x = clamp(P.x, -70, 70); P.z = clamp(P.z, -260, 12);
      if ((hit('KeyJ') || hit('Click')) && this.pc <= 0) { this.pc = .45; this.slash = .3; snd('hit'); shake = .7; let any = false; for (const g of this.gs.slice()) if (Math.hypot(g.x - P.x, g.z - P.z) < 14) { any = true; g.hp -= 2; g.z -= 12; if (g.hp <= 0) this.fell(g) } if (any) toast('태양 펀치!', '#ffd43b', .5) }
      for (const g of this.gs) if (Math.hypot(g.x - P.x, g.z - P.z) < 8) g.z -= 20 * dt;
      if (this.titan <= 0) this.titanOff() }
    const floor = (P.z > 13.5 && P.z < 18.5 && Math.abs(P.x) < 60) ? 7.2 : (this.tw.find(w => Math.hypot(P.x - w.x, P.z - w.z) < 3.2 && P.y > w.y - 1.5) || { y: 0 }).y || 0, onG = P.y <= floor + .02 && !this.hook;
    if (this.titan > 0) { } else if (!this.hook) {
      const mx = (K.KeyD ? 1 : 0) - (K.KeyA ? 1 : 0) + joy.x, mz = (K.KeyW ? 1 : 0) - (K.KeyS ? 1 : 0) - joy.y; const acc = onG ? 60 : 14;
      this.vel.addScaledVector(fw, mz * acc * dt).addScaledVector(rt, mx * acc * dt); const damp = Math.pow(onG ? .0005 : .5, dt); this.vel.x *= damp; this.vel.z *= damp; this.vel.y -= 26 * dt;
      if (hit('Space')) { if (onG) { this.vel.y = 12; snd('jump') } else if (this.gas >= 8) { this.gas -= 8; this.vel.addScaledVector(aim, 20); snd('shot'); for (let i = 0; i < 3; i++) { const sm = sph(null, .5, MB('#fff', { transparent: true, opacity: .6 }), P.x, P.y + 1, P.z); sm.userData.sm = 1; (this.smk = this.smk || []).push(sm) } } }
      // 와이어
      let tg = null;
      if (hit('KeyJ') || hit('Click')) { if (this.gas < 10) toast('가스 부족! K로 충전탑으로', '#ff8787', 1); else { let best = .3; for (const g of this.gs) { const c = V3(g.x, 9 * g.s, g.z + 2.8 * g.s), to = c.clone().sub(P), d = to.length(); if (d > 110) continue; const an = aim.angleTo(to) * .8; if (an < best) { best = an; tg = { g, p: c } } } for (const a of this.pl.concat(this.tw.map(w => V3(w.x, w.y + 1, w.z)))) { const to = a.clone().sub(P), d = to.length(); if (d > 90 || d < 4) continue; const an = aim.angleTo(to); if (an < best) { best = an; tg = { p: a.clone(), anchor: 1 } } } if (!tg) toast('겨눈 곳에 걸 데가 없어요', '#ddd', .6); else this.gas -= tg.g ? 8 : 4 } }
      if (hit('KeyK')) { const w = this.tw.slice().sort((a, b) => Math.hypot(P.x - a.x, P.z - a.z) - Math.hypot(P.x - b.x, P.z - b.z))[0]; tg = { tw: w, p: V3(w.x, w.y + .4, w.z) } }
      if (tg) { this.hook = tg; snd('shot') }
    } else {
      const H = this.hook; if (H.g) { if (!this.gs.includes(H.g)) { this.hook = null } else H.p.set(H.g.x, 9 * H.g.s, H.g.z + 2.8 * H.g.s) }
      if (this.hook) {
        const to = H.p.clone().sub(P), d = to.length(), held = K.KeyJ || K.Mouse || H.tw || this.autoHold; to.normalize();
        this.vel.addScaledVector(to, 95 * dt); this.vel.lerp(to.clone().multiplyScalar(this.vel.length()), Math.min(1, dt * 2.5)); this.vel.y -= 6 * dt; const sp = this.vel.length(); if (sp > 52) this.vel.multiplyScalar(52 / sp);
        if (H.g && d < 3.4) { const pw = sp > 34 ? 2 : 1; this.hook = null; H.g.hp -= pw; snd('hit'); shake = .5; flash(); this.vel.multiplyScalar(.55); this.vel.y = 16; this.slash = .3; if (H.g.hp <= 0) this.fell(H.g); else toast(pw > 1 ? '고속 베기! 2배!' : '베었다! 한 번 더!', '#ffe066', .7) }
        else if (!H.g && d < 2.2) { this.hook = null; if (H.tw) { this.vel.set(0, 0, 0); P.copy(H.p) } else this.vel.y = Math.max(this.vel.y, 9) }
        else if (!held) this.hook = null;
      }
    }
    if (!(this.titan > 0)) P.addScaledVector(this.vel, dt); if (P.y < floor) { P.y = floor; this.vel.y = 0 } P.x = clamp(P.x, -70, 70); P.z = clamp(P.z, -260, 30);
    const onT = this.tw.find(w => Math.hypot(P.x - w.x, P.z - w.z) < 3.2 && Math.abs(P.y - w.y) < .6); this.gas = clamp(this.gas + (onT ? 45 : 1.5) * dt, 0, 100); if (onT && Math.sin(t * 8) > .95) toast('♻️ 재생에너지로 충전 중!', '#69db7c', .5);
    // 거인 행진
    for (let i = this.gs.length - 1; i >= 0; i--) { const g = this.gs[i]; g.z += g.v * dt; g.g.position.set(g.x, Math.abs(Math.sin(t * 2 + i)) * .5, g.z); g.g.rotation.z = Math.sin(t * 2 + i) * .05; g.core.scale.setScalar(1 + Math.sin(t * 6) * .12); g.g.children.forEach(m => { if (m.userData.leg) m.rotation.x = Math.sin(t * 2 + i + m.userData.leg) * .4 });
      if (Math.random() < dt * 1.5) { const sm = sph(null, 1 + Math.random(), MB('#495057', { transparent: true, opacity: .5 }), g.x, 19 * g.s, g.z); sm.userData.sm = 2.5; this.smk = this.smk || []; this.smk.push(sm) }
      if (g.z > 10) { scene.remove(g.g); this.gs.splice(i, 1); this.wall--; shake = 1; snd('bad'); flash(); toast('방벽이 부서졌다!', '#ff8787'); if (this.wall <= 0) return endGame(false, '거인을 겨누고 와이어! 가스가 떨어지면 K로 충전탑으로!') }
      else if (!(this.titan > 0) && P.y < 3 && Math.hypot(P.x - g.x, P.z - g.z) < 4.5 * g.s && this.inv <= 0) { this.inv = 2; this.hp--; this.vel.set((P.x - g.x) * 3, 12, 20); snd('bad'); toast('밟힐 뻔! 땅은 위험해요', '#ff8787'); if (this.hp <= 0) return endGame(false, '땅에 오래 있으면 위험해요. 와이어로 날아다녀요!') } }
    if (this.smk) for (let i = this.smk.length - 1; i >= 0; i--) { const s = this.smk[i]; s.position.y += dt * 3; s.userData.sm -= dt; s.material.opacity = s.userData.sm * .2; if (s.userData.sm <= 0) { scene.remove(s); this.smk.splice(i, 1) } }
    for (const w of this.tw) if (w.g.userData.blade) w.g.userData.blade.rotation.z += dt * 3;
    if (!this.gs.length) return endGame(true, '거인 행진을 멈췄어요! 쓰러진 자리마다 재생에너지 발전소가 생겼어요.');
    // 캐릭터·카메라
    this.me.g.position.copy(P); this.me.g.rotation.y = this.yaw + PI; if (onG && Math.hypot(this.vel.x, this.vel.z) > 1) walk(this.me, t * 13); else stand(this.me, t); if (!onG) { this.me.aL.rotation.x = -2.6; this.me.aR.rotation.x = this.slash > 0 ? -.4 : -2.6; this.me.body.rotation.x = .5 } else this.me.body.rotation.x = 0; this.slash = (this.slash || 0) - dt;
    const spd = this.titan > 0 ? 6 : this.vel.length(); this.cape.forEach((c, i) => c.rotation.x = -Math.min(1.3, spd * .03 + (onG ? 0 : .2)) * (i ? .5 : 1) + Math.sin(t * 9 + i) * (.06 + spd * .004)); this.fan.rotation.z += dt * (4 + spd); this.lamp.material.color.set(this.gas < 20 ? '#fa5252' : this.gas < 50 ? '#fab005' : '#69db7c'); this.aura.material.opacity = .18 + Math.sin(t * 8) * .08;
    this.rope.visible = !!this.hook; if (this.hook) this.rope.geometry.setFromPoints([P.clone().setY(P.y + 1.4), this.hook.p]);
    const back = aim.clone().multiplyScalar(-(this.titan > 0 ? 46 : W < H ? 13 : 9)); cam.position.copy(P).add(back).add(V3(0, this.titan > 0 ? 26 : 3.2, 0)); if (cam.position.y < .6) cam.position.y = .6; cam.lookAt(P.clone().add(aim.clone().multiplyScalar(30)).add(V3(0, 2, 0)));
    setObj(this.titan > 0 ? `🌞 <b>태양 거인</b> ${Math.ceil(this.titan)}초 · 클릭/J 펀치 · 가까운 거인을 밀어내요` : this.gas < 10 ? '🔋 <b>가스 부족!</b> K로 충전탑(재생에너지)에 가요' : `🪝 <b>거인·기둥</b>을 겨누고 와이어 꾹! · 속도 <b>${Math.round(this.vel.length())}</b>`); setStat(`❤️ ${this.hp} · 🧱 ${this.wall} · 🌞 ${this.titan > 0 ? '변신 중' : Math.floor(this.tg) + '%' + (this.tg >= 100 ? ' (R)' : '')}<br>거인 ${12 - this.gs.length}/12 쓰러뜨림`); setBar(this.gas / 100);
  },
  fell(g) { scene.remove(g.g); this.gs.splice(this.gs.indexOf(g), 1); this.kill++; if (!(this.titan > 0)) { this.tg = Math.min(100, this.tg + 34); if (this.tg >= 100) toast('🌞 거인화 준비 완료! R', '#ffd43b', 1.6) } toast(`${g.name} 쓰러짐! → ☀️ 발전소로`, '#69db7c', 1.2); snd('ok'); const p = new THREE.Group(); p.position.set(g.x, 0, g.z); scene.add(p); box(p, 6, .2, 4, '#1c7ed6', 0, 1.6, 0).rotation.x = -.4; cyl(p, .2, .2, 1.6, '#dee2e6', 0, .8, 0, 6); if (this.kill % this.qn === 0 && this.gs.length) quiz(ok => { if (ok) { this.gas = 100; this.hp = Math.min(5, this.hp + 1); toast('정답! 가스 가득 + 하트', '#ffd43b') } }) }
};
