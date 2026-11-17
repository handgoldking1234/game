const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('http://localhost:8765/t2.html'); await p.waitForTimeout(600); await p.click('#bStart'); await p.waitForTimeout(1500);
  await p.evaluate(() => { GAME.gate = (t, cb) => cb(); GAME.p.g.position.set(0, 0, 12) }); await p.waitForTimeout(5500);
  await p.evaluate(() => { GAME.phase = 'look'; GAME.pt = 9; GAME.npcs.forEach((n, i) => { n.c.g.position.z = -10 - i % 3 * 4; if (i < 3) n.brave = 9 }); GAME.p.g.position.z = -6 }); await p.waitForTimeout(1300);
  await p.addStyleTag({ content: '#toast,#help,.hud,#bar{display:none!important}' }); await p.waitForTimeout(200);
  await p.screenshot({ path: 'th2.png' }); await b.close();
})();
