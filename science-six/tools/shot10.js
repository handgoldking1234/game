const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); let E = 0;
  const p = await b.newPage({ viewport: { width: 1100, height: 620 } }); p.on('pageerror', e => { E++; console.log('PAGE', e.message) });
  await p.goto('http://localhost:8765/t2.html'); await p.waitForTimeout(600); await p.click('#bStart'); await p.waitForTimeout(1500);
  await p.evaluate(() => { GAME.gate = (t, cb) => cb(); GAME.p.g.position.set(0, 0, 12) }); await p.waitForTimeout(5000);
  await p.evaluate(() => { GAME.phase = 'look'; GAME.pt = 5; GAME.npcs.forEach(n => { n.brave = 9; n.c.g.position.z = -20 }); GAME.p.g.position.z = -14 }); await p.waitForTimeout(450);
  await p.screenshot({ path: 'z2a.png' }); await p.waitForTimeout(1200);
  await p.evaluate(() => { GAME.inv = 0; GAME.hurt('움직였다!') }); await p.waitForTimeout(350); await p.screenshot({ path: 'z2b.png' });
  await p.waitForTimeout(800); await p.screenshot({ path: 'z2c.png' });
  await p.evaluate(() => { GAME.inv = 0; GAME.hp = 1; GAME.hurt('움직였다!') }); await p.waitForTimeout(1500); await p.screenshot({ path: 'z2d.png' });
  console.log('ERR', E); await b.close();
})();
