// QA: headless screenshots at 1440 and 390 plus basic checks (console errors, broken images,
// horizontal overflow, elements left hidden). Usage: URL=http://127.0.0.1:8765/ OUT=qa node qa.mjs
import { chromium } from '/workspace/tools/shots/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'fs';
const base = process.env.URL || 'http://127.0.0.1:8765/';
const out = process.env.OUT || 'qa';
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const report = {};
for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('requestfailed', (r) => errors.push('failed: ' + r.url()));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/${w}-top.png` });
  // scroll through like a visitor so every scroll-in animation fires
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h / 2) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(250); }
  await p.waitForTimeout(1800);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
  const checks = await p.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > innerWidth,
    brokenImages: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    stillHidden: [...document.querySelectorAll('[data-in]')].filter((e) => getComputedStyle(e).opacity !== '1').length,
    animClass: document.documentElement.classList.contains('anim'),
  }));
  await p.screenshot({ path: `${out}/${w}-full.png`, fullPage: true });
  report[w] = { ...checks, errors };
  await p.close();
}
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
await b.close();
