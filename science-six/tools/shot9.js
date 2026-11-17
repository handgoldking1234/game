const { chromium } = require('playwright');
const i = +process.argv[2], pre = process.argv[3] || '';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); let E = 0;
  for (const [tag, vp] of [['d', { viewport: { width: 1100, height: 620 } }], ['m', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
    const p = await b.newPage(vp); p.on('pageerror', e => { E++; console.log('PAGE', e.message) }); p.on('console', m => { if (m.type() === 'error') { E++; console.log('CON', m.text()) } });
    await p.goto(`http://localhost:8765/t${i}.html`); await p.waitForTimeout(700);
    await p.click('#bStart'); await p.waitForTimeout(2000);
    if (pre) await p.evaluate(pre); await p.waitForTimeout(2500);
    await p.screenshot({ path: `z${i}_${tag}.png` }); await p.close();
  }
  console.log('ERRORS', E); await b.close();
})();
