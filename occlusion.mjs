import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

for (const vp of [
  { width: 1440, height: 950, label: 'lg 1440' },
  { width: 900, height: 900, label: 'md  900' },
  { width: 390, height: 844, label: 'sm  390' },
]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto('http://localhost:4355/', { waitUntil: 'networkidle2', timeout: 60000 });

  /* The fan is scroll-driven — bringing the section into view is what opens it,
     so there is no control to click. Wait for the reveal to settle instead. */
  await page.evaluate(() => document.getElementById('team').scrollIntoView({ block: 'center' }));
  await new Promise((r) => setTimeout(r, 2000));

  const res = await page.evaluate(() => {
    const founderImg = document.querySelector('#team img[alt*="Devyanshu"]');
    const f = founderImg.closest('.relative').getBoundingClientRect();
    const cards = [...document.querySelectorAll('#team [aria-hidden]')].filter((el) =>
      el.className.includes('absolute left-1/2 top-1/2')
    );
    const vw = window.innerWidth;
    return {
      founder: { l: Math.round(f.left), r: Math.round(f.right), w: Math.round(f.width) },
      vw,
      cards: cards.map((c) => {
        const r = c.getBoundingClientRect();
        // Width hidden behind the founder card.
        const ovl = Math.max(0, Math.min(r.right, f.right) - Math.max(r.left, f.left));
        // Width pushed outside the viewport.
        const off = Math.max(0, -r.left) + Math.max(0, r.right - vw);
        return {
          name: c.querySelector('.font-bold')?.textContent?.trim(),
          l: Math.round(r.left),
          r: Math.round(r.right),
          w: Math.round(r.width),
          behindPct: Math.round((ovl / r.width) * 100),
          offscreenPct: Math.round((off / r.width) * 100),
        };
      }),
    };
  });

  console.log(`\n=== ${vp.label} (founder ${res.founder.w}px @ ${res.founder.l}-${res.founder.r}, viewport ${res.vw}) ===`);
  for (const c of res.cards) {
    const visible = 100 - c.behindPct - c.offscreenPct;
    const flag = visible >= 55 ? 'ok  ' : 'POOR';
    console.log(
      `  ${flag} ${String(c.name).padEnd(15)} x ${String(c.l).padStart(5)}-${String(c.r).padStart(5)} (${c.w}px)  behind founder ${String(c.behindPct).padStart(3)}%  offscreen ${String(c.offscreenPct).padStart(3)}%  visible ~${visible}%`
    );
  }
  await page.close();
}

await browser.close();
