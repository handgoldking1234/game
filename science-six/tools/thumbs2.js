const { chromium } = require('playwright');
const S = {
 1: "GAME.runT=0;setTimeout(()=>{GAME.p.g.position.set(0,0,13);GAME.yaw=0;GAME.take('sun');GAME.run=20;GAME.mon.visible=true;GAME.mon.position.set(2,0,7)},400)",
 3: "GAME.passed=true;GAME.pos.set(-2,1.6,-197);GAME.yaw=.05",
 4: "const a=GAME.arts[0],s=a.A.sils[1];GAME.p.g.position.set(a.cx+(s.u-.5)*16+1.2,0,-20.6);GAME.yaw=0.25;GAME.skin.color.set(s.col)",
 6: "GAME.p.g.position.set(-22,0,2)"
};
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const i of [1, 3, 4, 6]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
    await p.goto(`http://localhost:8765/t${i}.html`); await p.waitForTimeout(600); await p.click('#bStart'); await p.waitForTimeout(2200);
    await p.evaluate(S[i]); await p.waitForTimeout(2600);
    await p.addStyleTag({ content: '#toast,#help,#ovQuiz,#eh,#ch,.hud,#bar,#cross,#touch{display:none!important}' });
    await p.waitForTimeout(300); await p.screenshot({ path: `th${i}.png` }); await p.close();
  }
  await b.close();
})();
