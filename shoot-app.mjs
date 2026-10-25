// Renders app/index.html (the code-built dashboard, demo data) to img/pulseboard-app.png at 2x.
import { chromium } from '/workspace/tools/shots/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1200, height: 720 }, deviceScaleFactor: 2 });
await p.goto('file://' + new URL('./app/index.html', import.meta.url).pathname);
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
await p.screenshot({ path: new URL('./img/pulseboard-app.png', import.meta.url).pathname });
await b.close(); console.log('ok');
