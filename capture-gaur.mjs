import puppeteer from 'puppeteer-core';

const SITE = 'https://www.gaurfurniture.com/';

/*
  Viewport per shot matches the aspect ratio of the ProjectsSection card slot the
  image lands in (2.00 / 1.37 / 1.13), the same sizing the RealEstate,
  DigiWebNow, EMBER and Lumière captures use, so the frame is filled with
  almost nothing cropped. Card 03 previously reused one 1600x900 screenshot in
  all three slots, which left the two taller frames badly letterboxed.

  Targets are found by heading text rather than by id: this is a Wix site and its
  section ids are generated (#comp-mg2q9qhq), so they are not safe to hardcode.
*/
const SHOTS = [
  /* topOffset 0: this section is 666px inside an 800px frame, and offsetting it
     showed a strip of the previous section along the top edge. Flush to the top,
     the section's own internal padding supplies the breathing room and the
     leftover falls at the bottom as page continuation. */
  { file: 'gaur_portfolio.jpg', target: 'portfolio', width: 1600, height: 800, topOffset: 0 },
  { file: 'gaur_process.jpg', target: 'process', width: 1400, height: 1020, topOffset: 80 },
  { file: 'gaur_hero.jpg', target: 'hero', width: 1200, height: 1060, topOffset: 0 },
];

/*
  Runs in the page. Wix drives its section reveals from inline styles
  (opacity: 0, translateY, blur) applied by its own scroll observer. Walking the
  page fires most of them, but the hero settles back to a ghosted ~20% opacity
  under automation, which screenshots as a washed-out image.

  Inline animation props are removed rather than overwritten, so each element
  falls back to its stylesheet value — the intended final state — instead of
  whatever frame the reveal froze on. Only elements that are actually hidden are
  touched, so deliberate scrims and overlays keep their own opacity.
*/
function forceSettled() {
  const hiddenByOpacity = (s) => /(^|;)\s*opacity:\s*0?\.?\d*\s*(;|$)/.test(s);
  let forced = 0;

  for (const el of document.querySelectorAll('[style]')) {
    const style = el.getAttribute('style') ?? '';
    if (!hiddenByOpacity(style)) continue;
    const current = +getComputedStyle(el).opacity;
    if (current >= 0.95) continue;

    for (const prop of ['opacity', 'filter', 'transform', 'clip-path']) {
      el.style.removeProperty(prop);
    }
    forced++;
  }
  return forced;
}

/* Runs in the page. */
function locate(target) {
  const byHeading = (re) => {
    const heading = [...document.querySelectorAll('h1, h2, h3')].find((h) =>
      re.test(h.textContent ?? '')
    );
    if (!heading) return null;
    /* Climb to the section-sized ancestor that actually frames the block. */
    let el = heading;
    while (el.parentElement && el.getBoundingClientRect().height < 320) {
      el = el.parentElement;
    }
    return el;
  };

  /* The hero heading is not always an h1-h3 at every width, so it falls back to
     the generated section id and finally to the document top — which is where
     the hero lives anyway. */
  if (target === 'hero') {
    return (
      byHeading(/art of modern interior living/i) ??
      document.querySelector('#comp-mfxwpqqu') ??
      document.body
    );
  }
  if (target === 'process') return byHeading(/simplify your furnishing/i);
  if (target === 'portfolio') return byHeading(/our portfolio/i);
  return null;
}

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height });
  await page.goto(SITE, { waitUntil: 'networkidle2', timeout: 120000 });

  /* Wix lazy-loads imagery and gates blocks behind scroll reveals, so walk the
     whole page before framing anything. */
  await page.evaluate(async () => {
    const step = 350;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 170));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 1000));
  });

  await page
    .waitForFunction(
      () => [...document.images].every((img) => img.complete && img.naturalWidth > 0),
      { timeout: 40000 }
    )
    .catch(() => console.log(`  (image wait timed out for ${shot.file}, continuing)`));

  const park = async () => {
    await page.evaluate(
      ({ target, topOffset, locateSrc }) => {
        const el = new Function('target', `return (${locateSrc})(target)`)(target);
        if (!el) return window.scrollTo(0, 0);
        const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
        window.scrollTo(0, Math.max(0, y));
      },
      { target: shot.target, topOffset: shot.topOffset, locateSrc: locate.toString() }
    );
  };

  await park();
  await new Promise((r) => setTimeout(r, 2400));

  const forced = await page.evaluate(
    (src) => new Function(`return (${src})()`)(),
    forceSettled.toString()
  );

  /* Re-park: removing transforms can shift layout slightly. */
  await park();
  await new Promise((r) => setTimeout(r, 1400));

  const check = await page.evaluate(
    ({ target, locateSrc }) => {
      const el = new Function('target', `return (${locateSrc})(target)`)(target);
      const r = el?.getBoundingClientRect();
      const imgs = [...(el?.querySelectorAll('img') ?? [])];
      const hidden = imgs.filter((img) => {
        if (!img.complete || !img.naturalWidth) return true;
        let node = img;
        while (node && node !== document.body) {
          const cs = getComputedStyle(node);
          if (+cs.opacity < 0.9 || cs.visibility === 'hidden') return true;
          node = node.parentElement;
        }
        return false;
      });
      return {
        found: !!el,
        top: r ? Math.round(r.top) : null,
        height: r ? Math.round(r.height) : null,
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
  if (!check.found) console.log(`  !! target "${shot.target}" not found for ${shot.file}`);
  if (check.hidden > 0) console.log(`  !! ${check.hidden} image(s) still hidden in ${shot.file}`);

  await page.close();
}

await browser.close();
