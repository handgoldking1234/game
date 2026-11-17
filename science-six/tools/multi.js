const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 480, height: 300 } });
  for (let i = 1; i <= 6; i++) {
    const A = await ctx.newPage(), B = await ctx.newPage(); const errs = []; for (const p of [A, B]) { p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) }) }
    await A.goto(`http://localhost:8765/t${i}.html`); await B.goto(`http://localhost:8765/t${i}.html`); await A.waitForTimeout(500);
    await A.fill('#nick', '방장'); await A.click('#bHost'); await A.waitForTimeout(1500); const code = await A.evaluate(() => NET.code);
    await B.fill('#nick', '손님'); await B.fill('#code', code); await B.click('#bJoin'); await B.waitForTimeout(4000);
    const ra = await A.evaluate(() => ({ on: NET.on, rem: Object.values(NET.rem).map(r => r.n + ':' + !!r.g), board: $('#board').textContent, playing }));
    const rb = await B.evaluate(() => ({ on: NET.on, rem: Object.values(NET.rem).map(r => r.n + ':' + !!r.g), playing }));
    let extra = '';
    if (i === 1) { // 훔치기: A에게 펫을 주고 B가 A 기지로 이동
      await A.evaluate(() => { GAME.pets.push({ k: 'sun', left: 0 }, { k: 'coal', left: 100 }) }); await B.waitForTimeout(800);
      await B.evaluate(() => { const b = GAME.bases[Object.keys(NET.rem)[0]]; GAME.p.g.position.set(b.x, 0, b.z) }); await B.waitForTimeout(1500);
      extra = ' steal: B carry=' + await B.evaluate(() => GAME.carry) + ' A pets=' + await A.evaluate(() => GAME.pets.length);
      await A.evaluate(() => { GAME.lock = 20 }); await B.evaluate(() => { GAME.drop(); GAME.msgT = 0 }); await B.waitForTimeout(1800); extra += ' locked: B carry=' + await B.evaluate(() => GAME.carry);
    }
    if (i === 3) await A.screenshot({ path: 'multi3.png' });
    console.log(i, code, JSON.stringify(ra), JSON.stringify(rb), extra, 'ERR', errs.length, errs.slice(0, 3).join(' / ')); await A.close(); await B.close();
  }
  await b.close();
})();
