/* 3. 새벽 작전 38 — 날씨와 우리 생활 (1인칭 침투 · 피 표현 없음) */
const ZN = [{ n: '안개 구역', far: 24, see: 11, sky: '#8e9aa6', d: '기온 3℃ · 습도 95% · 바람 약함 · 안개' }, { n: '비 구역', far: 55, see: 19, sky: '#4b5563', d: '기온 8℃ · 습도 90% · 구름 많음 · 강수량 12mm' }, { n: '강풍 구역', far: 130, see: 32, sky: '#7aa7d9', d: '기온 10℃ · 습도 40% · 맑음 · 바람 강함' }, { n: '북측 기지 · 한파', far: 70, see: 22, sky: '#c5cfdb', d: '기온 -8℃ · 습도 60% · 눈 · 차고 건조한 북서풍' }];
const GAME = {
  id: 'op38', title: '새벽 작전 38', sub: '날씨를 읽고 38선을 넘어 북측 기지의 적 사령관을 제압하라!', emoji: '🪖', unit: '날씨와 우리 생활',
  facts: ['<b>기상 요소</b>: 기온, 바람, 습도, 구름의 양, 강수량으로 날씨를 나타내요.', '<b>안개</b>는 지표면 가까이에서 수증기가 <b>응결</b>해 떠 있는 것 — 멀리 안 보여요.', '바람은 <b>고기압에서 저기압</b>으로 불어요. 고기압은 맑고, 저기압은 흐리고 비가 와요.'],
  how: '38선 철책 문을 지나 <b>북측 기지</b>까지 침투해, 벙커 안의 <b>적 사령관(가상 인물)</b>을 제압하고 <b>헬기장</b>으로 탈출해요. <b>안개</b> 속에서는 경비병도 멀리 못 봐요. <b>비</b>가 오면 발소리가 묻혀요. <b>강풍</b> 구역에서는 총알이 바람에 밀리니 바람 반대쪽을 겨눠요. 총소리는 주변 경비병을 불러요 — 가까이서는 조용한 <b>칼(F)</b>로! 구역 사이 <b>기상 관측함</b>에서 퀴즈를 풀면 체력이 회복돼요.',
  help: '이동 WASD · 시점 마우스(화면 클릭) / Q·E · 사격 클릭/J · 칼 F · 앉기 C',
  quiz: [
    { q: '날씨를 나타내는 기상 요소가 아닌 것은?', a: ['요일', '기온', '습도', '강수량'], e: '기상 요소에는 기온, 바람, 습도, 구름의 양, 강수량 등이 있어요.' },
    { q: '안개가 생기는 까닭은?', a: ['지표면 가까이의 공기 중 수증기가 응결해서', '먼지가 날려서', '연기가 퍼져서', '구름이 녹아서'], e: '밤사이 지표면 근처 공기가 차가워지면 수증기가 응결해 작은 물방울로 떠 있어요.' },
    { q: '이슬·안개·구름의 공통점은?', a: ['모두 수증기가 응결해 생긴다', '모두 하늘 높이 떠 있다', '모두 얼음이다', '모두 바람이 만든다'], e: '생기는 위치는 다르지만 모두 수증기의 응결로 생겨요.' },
    { q: '바람은 어디에서 어디로 불까요?', a: ['고기압에서 저기압으로', '저기압에서 고기압으로', '위에서 아래로만', '불지 않는다'], e: '공기는 기압이 높은 곳에서 낮은 곳으로 이동하고, 이것이 바람이에요.' },
    { q: '저기압이 다가오면 날씨는 대체로 어떻게 될까요?', a: ['구름이 많아지고 비가 오기 쉽다', '아주 맑아진다', '기온이 100℃가 된다', '변화가 없다'], e: '저기압에서는 공기가 위로 올라가 구름이 생기기 쉬워요.' },
    { q: '습도가 높은 날의 특징은?', a: ['빨래가 잘 마르지 않고 눅눅하다', '산불이 나기 쉽다', '피부가 건조해진다', '정전기가 많이 생긴다'], e: '습도가 높으면 공기 중에 수증기가 많아 물이 잘 증발하지 않아요.' },
  ],
  net() { return [this.pos.x, 0, this.pos.z, this.yaw + PI, Math.round(clamp(-this.pos.z / 236, 0, 1) * 100) + (this.boss && this.boss.out ? 100 : 0)] },
  init() {
    newScene(ZN[0].sky, 4, ZN[0].far, { amb: .5, sunI: .45, fov: 70 }); box(null, 90, .2, 220, '#3d4f37', 0, -.1, -80);
    for (const x of [-32, 32]) box(null, .4, 4, 220, '#495057', x, 2, -80);
    for (let i = 0; i < 70; i++) { const x = rnd(-30, 30), z = rnd(-165, 4); if (Math.random() < .45) box(null, rnd(2, 4), rnd(1, 1.6), 1.2, '#5c5f66', x, .7, z).rotation.y = rnd(0, 3); else { cyl(null, .3, .4, 3, '#3d2b1f', x, 1.5, z, 8); cone(null, 1.7, 3.4, '#27492d', x, 4.2, z, 8) } }
    for (const z of [-55, -110]) { for (let x = -30; x <= 30; x += 3) if (Math.abs(x) > 4) box(null, .2, 2.4, .2, '#868e96', x, 1.2, z); box(null, 60, .08, .08, '#adb5bd', 0, 2.2, z) }
    this.cps = [-52, -107].map(z => { const g = new THREE.Group(); g.position.set(0, 0, z); scene.add(g); box(g, 1.4, 1.2, 1.2, '#f8f9fa', 0, 1.6, 0); for (const s of [-1, 1]) cyl(g, .06, .06, 1.2, '#dee2e6', s * .5, .5, 0, 6); label(g, '기상 관측함', 2.4, .5, '#1c7ed6', '#fff', 0, 2.6, 0, 40); return { g, z, done: false } });
    const gate = new THREE.Group(); gate.position.set(0, 0, -165); scene.add(gate); for (const s of [-1, 1]) box(gate, .6, 6, .6, '#adb5bd', s * 4, 3, 0); box(gate, 9, .8, .6, '#adb5bd', 0, 6, 0); label(gate, '38선 통과 지점', 7, 1, '#111', '#ffd43b', 0, 4.6, .4); for (let x = -30; x <= 30; x += 3) if (Math.abs(x) > 4) box(null, .2, 3, .2, '#868e96', x, 1.5, -165);
    this.ens = []; const mk = (x, z) => { const c = person({ top: '#6b5b3e', bottom: '#4a3f2b', hat: '#4a3f2b', s: 1.05 }); c.g.position.set(x, 0, z); scene.add(c.g); box(c.aR, .08, .1, .9, '#212529', 0, -.55, .35); this.ens.push({ c, x, z, hx: x, hz: z, a: rnd(0, TAU), out: false, alert: 0, cd: 1, turn: rnd(0, TAU) }) };
    for (let i = 0; i < 12; i++) mk(rnd(-24, 24), -14 - i * 12.5 + rnd(-3, 3));
    for (const [x, z] of [[-18, -185], [18, -190], [-6, -200], [7, -199], [-8, -222], [8, -224]]) mk(x, z);
    { const c = person({ top: '#3b3b2e', bottom: '#2b2b22', skin: '#f1c9a5', hair: '#222', s: 1.3 }); c.g.position.set(0, 0, -224); scene.add(c.g); cyl(c.head, .55, .5, .14, '#2b2b22', 0, .42, .03); box(c.head, .9, .06, .5, '#1d1d17', 0, .37, .32); box(c.body, .3, .14, .03, '#ffd43b', -.2, .25, .24); box(c.body, .3, .14, .03, '#e03131', .2, .25, .24); box(c.aR, .08, .1, .9, '#212529', 0, -.55, .35); const l = label(c.g, '🎯 적 사령관 (가상 인물)', 3.4, .6, '#c92a2a', '#fff', 0, 3.4, 0, 40); l.userData.bill = 1;
      this.boss = { c, x: 0, z: -224, hx: 0, hz: -220, a: 0, out: false, alert: 0, cd: 1, turn: PI, hp: 3, boss: 1 }; this.ens.push(this.boss) }
    // 북측 기지 · 벙커 · 헬기장
    box(null, 90, .2, 90, '#e9ecef', 0, -.08, -210); for (const x of [-32, 32]) box(null, .4, 4, 90, '#495057', x, 2, -210);
    for (let i = 0; i < 26; i++) { const x = rnd(-30, 30), z = rnd(-246, -170); if (Math.abs(x) < 15 && z < -200 && z > -232) continue; cyl(null, .3, .4, 3, '#3d2b1f', x, 1.5, z, 8); cone(null, 1.7, 3.4, '#f1f3f5', x, 4.2, z, 8) }
    this.walls = [[-12, -3, -206, -204], [3, 12, -206, -204], [-13, -11, -229, -204], [11, 13, -229, -204], [-13, 13, -230, -228]];
    for (const [x0, x1, z0, z1] of this.walls) box(null, x1 - x0, 4.2, z1 - z0, '#6c757d', (x0 + x1) / 2, 2.1, (z0 + z1) / 2);
    box(null, 26, .5, 26, '#495057', 0, 4.45, -217); label(null, '⚠️ 북측 지휘 벙커', 8, 1.2, '#212529', '#ffd43b', 0, 5.6, -203.8);
    cyl(null, 4.5, 4.5, .15, '#495057', 0, .08, -238, 28); label(null, 'H', 4, 4, null, '#ffd43b', 0, .2, -238, 220).rotation.x = -PI / 2; label(null, '🚁 탈출 헬기장', 5, .9, '#1c7ed6', '#fff', 0, 3, -238).userData.bill = 1;
    this.heli = new THREE.Group(); this.heli.position.set(0, 0, -238); scene.add(this.heli); box(this.heli, 2.4, 2, 5, '#495057', 0, 1.6, 0); box(this.heli, .5, .5, 4, '#495057', 0, 2.2, 4.2); this.rotor = box(this.heli, 9, .08, .4, '#212529', 0, 2.8, 0); this.heli.visible = false;
    this.rain = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(900).map(() => rnd(-14, 14)), 3)), new THREE.PointsMaterial({ color: '#a5d8ff', size: .12 })); scene.add(this.rain);
    this.gun = new THREE.Group(); box(this.gun, .05, .07, .5, '#212529', .16, -.15, -.45); box(this.gun, .04, .1, .05, '#3d2b1f', .16, -.21, -.3); this.fl = sph(this.gun, .06, MB('#ffe066'), .16, -.14, -.72); this.fl.visible = false; this.kn = box(this.gun, .02, .05, .3, '#dee2e6', -.18, -.2, -.4); this.kn.visible = false;
    scene.add(cam); cam.add(this.gun); this.gun.scale.setScalar(.55); this.gun.position.set(.06, 0, -.32); this.pos = V3(0, 1.6, 6); this.yaw = 0; this.pitch = 0; this.hp = 100; this.t = 0; this.cd = 0; this.mag = 8; this.rl = 0; this.zi = 0; this.wind = 0; this.kT = 0; this.crouch = 0;
    lookOn = true; $('#cross').style.display = 'block';
    setBtns([{ k: 'KeyC', i: '🧎', l: '앉기' }, { k: 'KeyF', i: '🔪', l: '칼' }, { k: 'KeyJ', i: '🔫', l: '사격' }]);
  },
  down(e, how) { if (e.boss && e.hp > 1) { e.hp--; e.alert = 1.5; snd('hit'); toast(`🎯 사령관이 버틴다! (남은 ${e.hp})`, '#ffa94d', .9); return } if (e.boss) { this.heli.visible = true; setTimeout(() => toast('🎯 적 사령관 제압! 🚁 헬기장으로 탈출!', '#69db7c', 2.4), 300) } e.out = true; e.c.body.rotation.x = -1.4; e.c.body.position.y = .35; snd('hit'); toast(how, '#ffd43b', .7) },
  update(dt) {
    this.t += dt; const t = this.t; this.cd -= dt; this.kT -= dt;
    this.yaw -= lookDX * .0028 + ((K.ArrowRight || K.KeyE ? 1 : 0) - (K.ArrowLeft || K.KeyQ ? 1 : 0)) * dt * 2.2; this.pitch = clamp(this.pitch - lookDY * .0025 + ((K.ArrowUp ? 1 : 0) - (K.ArrowDown ? 1 : 0)) * dt, -.6, .8);
    if (hit('KeyC')) this.crouch = !this.crouch; const mx = (K.KeyD ? 1 : 0) - (K.KeyA ? 1 : 0) + joy.x, mz = (K.KeyS ? 1 : 0) - (K.KeyW ? 1 : 0) + joy.y, s = Math.sin(this.yaw), c = Math.cos(this.yaw), sp = this.crouch ? 3 : 6.5, moving = Math.hypot(mx, mz) > .2;
    this.pos.x = clamp(this.pos.x + (mx * c + mz * s) * sp * dt, -30, 30); this.pos.z = clamp(this.pos.z + (-mx * s + mz * c) * sp * dt, this.passed ? -244 : -166, 8);
    for (const [x0, x1, z0, z1] of this.walls) { const X = this.pos.x, Zz = this.pos.z; if (X > x0 - .4 && X < x1 + .4 && Zz > z0 - .4 && Zz < z1 + .4) { const o = [X - (x0 - .4), x1 + .4 - X, Zz - (z0 - .4), z1 + .4 - Zz], m = Math.min(...o); if (m === o[0]) this.pos.x = x0 - .4; else if (m === o[1]) this.pos.x = x1 + .4; else if (m === o[2]) this.pos.z = z0 - .4; else this.pos.z = z1 + .4 } } this.pos.y = lerp(this.pos.y, this.crouch ? 1 : 1.6, dt * 10);
    // 구역·날씨
    const zi = this.pos.z > -55 ? 0 : this.pos.z > -110 ? 1 : this.pos.z > -166 ? 2 : 3, Z = ZN[zi]; if (zi !== this.zi) { this.zi = zi; toast('📡 ' + Z.n + ' 진입', '#a5d8ff', 1.6) }
    scene.fog.far = lerp(scene.fog.far, Z.far, dt * 2); scene.fog.color.lerp(new THREE.Color(Z.sky), dt * 2); scene.background.copy(scene.fog.color);
    this.wind = zi === 2 ? Math.sin(t * .25) * 1 : 0; this.rain.visible = zi === 1 || zi === 3; this.rain.material.color.set(zi === 3 ? '#ffffff' : '#a5d8ff'); this.rain.material.size = zi === 3 ? .2 : .12; if (zi === 1 || zi === 3) { const p = this.rain.geometry.attributes.position; for (let i = 0; i < p.count; i++) { let y = p.getY(i) - (zi === 3 ? 4 : 22) * dt; if (y < -1) y = 14; p.setY(i, y) } p.needsUpdate = true; this.rain.position.set(this.pos.x, 0, this.pos.z) }
    for (const cp of this.cps) if (!cp.done && Math.hypot(this.pos.x, this.pos.z - cp.z) < 2.6) { cp.done = true; quiz(ok => { this.hp = Math.min(100, this.hp + (ok ? 60 : 20)); toast(ok ? '정답! 체력 +60' : '체력 +20', '#69db7c') }) }
    // 사격
    const dir = V3(0, 0, -1).applyEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
    if (this.rl > 0) { this.rl -= dt; if (this.rl <= 0) this.mag = 8 }
    if ((hit('KeyJ') || hit('Click')) && this.cd <= 0 && this.rl <= 0) {
      this.cd = .32; this.mag--; snd('shot'); this.fl.visible = true; this.flT = .06; this.gun.position.z = -.24; if (this.mag <= 0) this.rl = 1.4;
      const right = V3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)); let best = null, bd = 1e9;
      for (const e of this.ens) { if (e.out) continue; const to = V3(e.x - this.pos.x, 1.3 - this.pos.y, e.z - this.pos.z), d = to.length(); if (d > 70) continue; const aim = dir.clone().multiplyScalar(d).addScaledVector(right, this.wind * d * .06); if (aim.distanceTo(to) < .75 + d * .012 && d < bd) { best = e; bd = d } const loud = zi === 1 ? 14 : 26; if (d < loud && e.alert < .6) { e.alert = .6; e.turn = Math.atan2(this.pos.x - e.x, this.pos.z - e.z) } }
      if (best) this.down(best, '제압!'); else if (zi === 2 && Math.abs(this.wind) > .4) toast('바람에 밀렸다! 바람 반대쪽을 겨눠요', '#a5d8ff', .9);
    }
    if (hit('KeyF') && this.kT <= 0) { this.kT = .6; this.kn.visible = true; snd('jump'); for (const e of this.ens) { if (e.out) continue; const dx = e.x - this.pos.x, dz = e.z - this.pos.z, d = Math.hypot(dx, dz); if (d < 2.4 && (dx * dir.x + dz * dir.z) / d > .5) { this.down(e, '조용히 제압!'); break } } }
    if (this.kT < .3) this.kn.visible = false; if (this.flT > 0) { this.flT -= dt; if (this.flT <= 0) this.fl.visible = false } this.gun.position.z = lerp(this.gun.position.z, -.32, dt * 12); this.gun.position.y = this.rl > 0 ? -.15 : 0;
    // 경비병
    let seenBy = 0;
    for (const e of this.ens) {
      if (e.out) continue; const dx = this.pos.x - e.x, dz = this.pos.z - e.z, d = Math.hypot(dx, dz), f = V3(Math.sin(e.c.g.rotation.y), 0, Math.cos(e.c.g.rotation.y));
      let range = Z.see * (this.crouch ? .65 : 1) * (moving && zi !== 1 ? 1.15 : 1); const sees = d < range && ((dx * f.x + dz * f.z) / d > .45 || d < 3.5);
      e.alert = clamp(e.alert + (sees ? dt * (1.6 - d / range) : -dt * .25), 0, 1.5);
      if (e.alert > .55) { e.turn = Math.atan2(dx, dz); stand(e.c, t); e.c.aR.rotation.x = -1.5; if (sees) seenBy++; e.cd -= dt; if (e.alert >= 1 && sees && e.cd <= 0) { e.cd = rnd(.9, 1.5); snd('shot'); if (Math.random() < clamp(.75 - d / range * .5, .15, .7)) { this.hp -= 14; flash(); shake = .4; toast('맞았다!', '#ff8787', .5) } } }
      else { e.a += dt * .5; const tx = e.hx + Math.cos(e.a) * 5, tz = e.hz + Math.sin(e.a) * 3, vx = tx - e.x, vz = tz - e.z, l = Math.hypot(vx, vz) || 1; e.x += vx / l * 1.6 * dt; e.z += vz / l * 1.6 * dt; e.turn = Math.atan2(vx, vz); walk(e.c, t * 6, .5); e.c.aR.rotation.x = -.6 }
      let dr = e.turn - e.c.g.rotation.y; dr = Math.atan2(Math.sin(dr), Math.cos(dr)); e.c.g.rotation.y += dr * Math.min(1, dt * 5); e.c.g.position.set(e.x, 0, e.z);
    }
    if (this.hp <= 0) return endGame(false, '안개·비를 이용해 숨고, 가까운 경비병은 칼(F)로 조용히!');
    if (!this.passed && this.pos.z < -164 && Math.abs(this.pos.x) < 4) { this.passed = true; snd('win'); quiz(ok => { this.hp = Math.min(100, this.hp + (ok ? 50 : 15)); toast('38선 통과! 2단계: 북측 벙커의 적 사령관을 제압하라', '#ffd43b', 2.6) }) }
    if (this.heli.visible) { this.rotor.rotation.y += dt * 20; if (Math.hypot(this.pos.x, this.pos.z + 238) < 4.5) return endGame(true, '작전 성공! 안개·비·강풍·한파를 읽고 침투해 적 사령관을 제압하고 탈출했어요.') }
    cam.position.copy(this.pos); cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    setObj(`📡 <b>${Z.n}</b> · ${Z.d}${zi === 2 ? ` · 바람 ${this.wind > .2 ? '➡️' : this.wind < -.2 ? '⬅️' : '·'}${'💨'.repeat(Math.round(Math.abs(this.wind) * 3))}` : ''}`);
    setStat(`❤️ ${Math.max(0, Math.round(this.hp))} · 🔫 ${this.rl > 0 ? '장전 중' : this.mag + '/8'}<br>${seenBy ? '<b style="color:#ff8787">⚠️ 발각!</b>' : this.crouch ? '🧎 숨는 중' : !this.passed ? '38선까지 ' + Math.max(0, Math.round(165 + this.pos.z)) + 'm' : this.boss.out ? '🚁 헬기장까지 ' + Math.round(Math.hypot(this.pos.x, this.pos.z + 238)) + 'm' : '🎯 사령관까지 ' + Math.round(Math.hypot(this.pos.x - this.boss.x, this.pos.z - this.boss.z)) + 'm'}`); setBar(null);
  }
};
