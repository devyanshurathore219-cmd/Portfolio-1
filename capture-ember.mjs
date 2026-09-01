import puppeteer from 'puppeteer-core';

const SITE = 'https://dining-ember.vercel.app/';

/*
  Viewport per shot matches the aspect ratio of the card slot the image lands in
  (2.00 / 1.37 / 1.13), the same sizing the RealEstate and DigiWebNow captures
  use, so object-cover has almost nothing left to crop.

  `target` picks the element to frame. The signatures shot frames the four-plate
  grid rather than the whole section, because the section's top half is heading
  and the plates are the point. `topOffset` parks that element's top edge this
  many pixels below the viewport top; the nav is fixed at ~72px.
*/
const SHOTS = [
  { file: 'ember_signatures.jpg', target: 'sigGrid', width: 1600, height: 800, topOffset: 96 },
  { file: 'ember_chef.jpg', target: 'chefSection', width: 1400, height: 1020, topOffset: 10 },
  { file: 'ember_hero.jpg', target: 'hero', width: 1200, height: 1060, topOffset: 0 },
];

/* Runs in the page. Returns the element a shot should frame. */
function locate(target) {
  if (target === 'hero') return document.querySelector('#top');
  if (target === 'chefSection') return document.querySelector('#chef');
  if (target === 'sigGrid') {
    const sig = document.querySelector('#signatures');
    if (!sig) return null;
    /* The plate grid is the only grid in the section holding all four cards. */
    return (
      [...sig.querySelectorAll('.grid, [class*="grid-cols"]')].find(
        (el) => el.querySelectorAll('img').length === 4
      ) ?? sig
    );
  }
  return null;
}

/*
  Runs in the page. EMBER staggers its content in with inline styles
  (opacity: 0, blur, translateY, and clip-path: inset(... 100%) on the chef
  portrait frame) and drives them from a module-scoped Lenis instance. Under
  automation that instance never publishes scroll updates, so the chef portrait
  stays fully clipped and screenshots as an empty panel no matter how the page
  is scrolled -- window.scrollTo, real wheel events, and a headed browser all
  leave it hidden.

  So: let the page animate on its own first, then force whatever is still stuck
  into its settled state. Inline animation props are removed rather than
  overwritten, so each element falls back to its stylesheet value (the intended
  final tracking, blur and offset) instead of whatever frame the intro froze on.
*/
function forceSettled() {
  const hiddenByClip = (s) => /clip-path:\s*inset\([^)]*100%/.test(s);
  const hiddenByOpacity = (s) => /(^|;)\s*opacity:\s*0(\.0+)?\s*(;|$)/.test(s);

  let forced = 0;
  for (const el of document.querySelectorAll('[style]')) {
    const style = el.getAttribute('style') ?? '';
    const clipped = hiddenByClip(style);
    if (!clipped && !hiddenByOpacity(style)) continue;

    for (const prop of ['opacity', 'filter', 'transform', 'letter-spacing']) {
      el.style.removeProperty(prop);
    }
    if (clipped) el.style.clipPath = 'none';
    forced++;
  }
  return forced;
}

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height });
  await page.goto(SITE, { waitUntil: 'networkidle2', timeout: 90000 });

  /* Every photo here is loading="lazy", so walk the whole page to pull them in
     and to give the scroll-reveals their chance to run naturally. */
  await page.evaluate(async () => {
    const step = 400;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 130));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 700));
  });

  await page
    .waitForFunction(
      () => [...document.images].every((img) => img.complete && img.naturalWidth > 0),
      { timeout: 30000 }
    )
    .catch(() => console.log(`  (image wait timed out for ${shot.file}, continuing)`));

  await page.evaluate(
    ({ target, topOffset, locateSrc }) => {
      const el = new Function('target', `return (${locateSrc})(target)`)(target);
      if (!el) return window.scrollTo(0, 0);
      const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo(0, Math.max(0, y));
    },
    { target: shot.target, topOffset: shot.topOffset, locateSrc: locate.toString() }
  );

  await new Promise((r) => setTimeout(r, 2200));

  const forced = await page.evaluate(
    (src) => new Function(`return (${src})()`)(),
    forceSettled.toString()
  );

  /* Re-park after settling: removing transforms can shift layout slightly. */
  await page.evaluate(
    ({ target, topOffset, locateSrc }) => {
      const el = new Function('target', `return (${locateSrc})(target)`)(target);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo(0, Math.max(0, y));
    },
    { target: shot.target, topOffset: shot.topOffset, locateSrc: locate.toString() }
  );
  await new Promise((r) => setTimeout(r, 1200));

  const check = await page.evaluate(
    ({ target, locateSrc }) => {
      const el = new Function('target', `return (${locateSrc})(target)`)(target);
      const r = el?.getBoundingClientRect();
      const imgs = [...(el?.querySelectorAll('img') ?? [])];

      /* An image can be loaded and opaque and still screenshot blank if an
         ancestor clips or fades it, so walk up and check. */
      const hidden = imgs.filter((img) => {
        if (!img.complete || !img.naturalWidth) return true;
        let node = img;
        while (node && node !== document.body) {
          const cs = getComputedStyle(node);
          if (+cs.opacity < 0.9) return true;
          if (cs.visibility === 'hidden') return true;
          if (/inset\([^)]*100%/.test(cs.clipPath)) return true;
          node = node.parentElement;
        }
        return false;
      });

      return {
        targetTop: r ? Math.round(r.top) : null,
        targetHeight: r ? Math.round(r.height) : null,
        imgs: imgs.length,
        hidden: hidden.length,
        docPending: [...document.images].filter((i) => !i.complete || !i.naturalWidth).length,
      };
    },
    { target: shot.target, locateSrc: locate.toString() }
  );

  await page.screenshot({
    path: `public/assets/images/${shot.file}`,
    type: 'jpeg',
    quality: 88,
  });

  console.log(
    `  wrote ${shot.file} (${shot.width}x${shot.height}) settled=${forced} ${JSON.stringify(check)}`
  );
  if (check.hidden > 0) console.log(`  !! ${check.hidden} image(s) still hidden in ${shot.file}`);

  await page.close();
}

await browser.close();
