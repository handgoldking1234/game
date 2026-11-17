const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 240, height: 160 } });
  const P = []; let errs = 0; for (let k = 0; k < 6; k++) { const p = await ctx.newPage(); p.on('pageerror', e => { errs++; console.log('PAGE', k, e.message) }); await p.goto('http://localhost:8765/t2.html'); P.push(p) }
  await P[0].fill('#nick', '방장'); await P[0].click('#bHost'); await P[0].waitForTimeout(1500); const code = await P[0].evaluate(() => NET.code);
  await P[0].evaluate(() => { GAME.maxP = 5 });
  for (let k = 1; k < 6; k++) { await P[k].fill('#nick', '손' + k); await P[k].fill('#code', code); await P[k].click('#bJoin'); await P[k].waitForTimeout(1500) }
  await P[0].waitForTimeout(5000);
  for (let k = 0; k < 6; k++) console.log(k, await P[k].evaluate(() => NET.on + ' rem=' + Object.keys(NET.rem).length + ' ' + $('#board').textContent.slice(0, 60)));
  // ink 탈락이 다른 사람에게 보이는지
  await P[1].evaluate(() => { GAME.hp = 1; GAME.hurt('test') }); await P[0].waitForTimeout(2500);
  console.log('inked on host:', await P[0].evaluate(() => Object.values(NET.rem).filter(r => r.inked).map(r => r.n).join(',')));
  console.log('ERR', errs); await b.close();
})();
