import puppeteer from 'puppeteer-core';

const SITE = 'https://digital-markiting-beta.vercel.app/index.html';

/*
  Viewport per shot matches the aspect ratio of the card slot the image lands in,
  the same way the RealEstate captures were sized (2.00 / 1.37 / 1.13). Shooting
  at the slot's ratio means object-cover has almost nothing to crop.
*/
const SHOTS = [
  { file: 'digiwebnow_agency_hero.jpg', anchor: '#home', width: 1200, height: 1060, tab: 'WEB' },
  /*
    topOffset parks the section's top edge that many pixels below the viewport
    top. The nav is fixed at ~80px, so anything less clips the section heading;
    centring instead pulled in the neighbouring logo marquee.
  */
  { file: 'digiwebnow_agency_about.jpg', anchor: '#about', width: 1400, height: 1020, topOffset: 92 },
  { file: 'digiwebnow_agency_blog.jpg', anchor: '#blog', width: 1600, height: 800, topOffset: 96 },
];

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height });
  await page.goto(SITE, { waitUntil: 'networkidle2', timeout: 90000 });

  /* The site opens behind a loader overlay; wait it out before shooting. */
  await page
    .waitForFunction(
      () => {
        const l = document.getElementById('loader');
        if (!l) return true;
        const cs = getComputedStyle(l);
        return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0;
      },
      { timeout: 20000 }
    )
    .catch(() => console.log(`  (loader wait timed out for ${shot.file}, continuing)`));

  /*
    The hero rotates through Web / Graphic / Digital on its own. Pin it to the
    WEB variant so the shot is deliberate instead of whatever the carousel
    happened to be showing.
  */
  if (shot.tab) {
    const pinned = await page.evaluate((label) => {
      const el = [...document.querySelectorAll('button, div, a, span')].find(
        (n) => n.children.length === 0 && n.textContent.trim().toUpperCase() === label
      );
      if (!el) return false;
      (el.closest('button') ?? el).click();
      return true;
    }, shot.tab);
    console.log(`  ${shot.file}: pinned hero to ${shot.tab} -> ${pinned}`);
    await new Promise((r) => setTimeout(r, 1800));
  }

  await page.evaluate(
    ({ sel, topOffset }) => {
      const el = document.querySelector(sel);
      if (!el) return window.scrollTo(0, 0);
      if (topOffset == null) return el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo(0, Math.max(0, y));
    },
    { sel: shot.anchor, topOffset: shot.topOffset }
  );

  /* Scroll-reveal animations need a beat to finish before the shutter. */
  await new Promise((r) => setTimeout(r, 2200));

  await page.screenshot({
    path: `public/assets/images/${shot.file}`,
    type: 'jpeg',
    quality: 88,
  });

  const check = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el?.getBoundingClientRect();
    return {
      anchorFound: !!el,
      anchorTop: r ? Math.round(r.top) : null,
      anchorHeight: r ? Math.round(r.height) : null,
      heading: document.querySelector('#dynamic-title')?.textContent?.trim() ?? null,
    };
  }, shot.anchor);

  console.log(`  wrote ${shot.file} (${shot.width}x${shot.height}) ${JSON.stringify(check)}`);
  await page.close();
}

await browser.close();
