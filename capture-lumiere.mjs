import puppeteer from 'puppeteer-core';

const SITE = 'https://e-commerce-furniture-1-bpdr.onrender.com/';

/*
  Viewport per shot matches the aspect ratio of the ProjectsSection card slot
  the image lands in (2.00 / 1.37 / 1.13), same as the RealEstate, DigiWebNow
  and EMBER captures, so object-cover has almost nothing left to crop.
  The 16:9 shot is the aspect-video thumbnail in FeaturedClientWebsites.

  `heroSlide` pins the Flickity hero to a specific cell instead of screenshotting
  whichever slide happened to be up: cell 0 is "The Geometry of Desire", cell 1
  "The Autumn Edit", cell 2 "Crafted to Last".

  `topOffset` parks the target element's top edge this many pixels below the
  viewport top. The announcement bar (40px) plus the solid nav (67px) overlay the
  page, so mid-page targets need to clear ~107px.
*/
const SHOTS = [
  /* topOffset 67 tucks the section's top edge exactly under the solid nav, so
     no sliver of the previous section shows above it. */
  {
    file: 'lumiere_collections.jpg',
    target: 'collections',
    width: 1600,
    height: 800,
    topOffset: 67,
  },
  /*
    The 1.37 slot needs a target taller than 1020px or the frame bleeds into
    the following section. The material-spotlight block (623px) does exactly
    that, so this slot uses the full-bleed "Built to Last" heritage hero
    (1755px) instead.
  */
  { file: 'lumiere_heritage.jpg', target: 'heritage', width: 1400, height: 1020, topOffset: 0 },
  { file: 'lumiere_hero.jpg', target: 'hero', width: 1200, height: 1060, topOffset: 0, heroSlide: 1 },
  { file: 'lumiere_furniture.jpg', target: 'hero', width: 1600, height: 900, topOffset: 0, heroSlide: 1 },
];

/* Runs in the page. Most homepage sections carry no id or class, so the two
   mid-page targets are found by their heading copy. */
function locate(target) {
  const byHeading = (re) =>
    [...document.querySelectorAll('section')].find((s) =>
      re.test(s.querySelector('h1, h2, h3')?.textContent ?? '')
    ) ?? null;

  if (target === 'hero') return document.querySelector('.mfr-core__hero-section');
  if (target === 'heritage') return document.querySelector('.ht-hero');
  if (target === 'collections') return byHeading(/popular collections/i);
  return null;
}

/* Runs in the page. Clicks the Flickity page dot for the wanted cell and
   confirms it landed. Autoplay does not advance under automation, so once the
   cell is selected it stays put for the screenshot. */
function selectHeroSlide(index) {
  const dots = [...document.querySelectorAll('.flickity-page-dots .dot')];
  if (!dots[index]) return `no dot ${index} (found ${dots.length})`;
  dots[index].click();
  const cells = [...document.querySelectorAll('.mfr-carousel__item')];
  return {
    requested: index,
    selectedNow: cells.findIndex((c) => c.classList.contains('is-selected')),
    heading: cells[index]?.querySelector('h1, h2')?.textContent.trim().slice(0, 30) ?? null,
  };
}

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height });
  // Free Render instance: allow for a cold start on the first shot.
  await page.goto(SITE, { waitUntil: 'networkidle2', timeout: 180000 });

  /* Walk the page to trigger the scroll-reveal sections (they gate on
     --visible classes) and to pull in every lazily loaded photo. */
  await page.evaluate(async () => {
    const step = 380;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 900));
  });

  await page
    .waitForFunction(
      () => [...document.images].every((img) => img.complete && img.naturalWidth > 0),
      { timeout: 40000 }
    )
    .catch(() => console.log(`  (image wait timed out for ${shot.file}, continuing)`));

  let slideInfo = null;
  if (shot.heroSlide !== undefined) {
    slideInfo = await page.evaluate(
      ({ idx, src }) => new Function('index', `return (${src})(index)`)(idx),
      { idx: shot.heroSlide, src: selectHeroSlide.toString() }
    );
    /* Let the slide transition and its staggered text reveal finish. */
    await new Promise((r) => setTimeout(r, 2500));
  }

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
  await new Promise((r) => setTimeout(r, 1800));
  /* Re-park: the reveal animations can shift layout after the first scroll. */
  await park();
  await new Promise((r) => setTimeout(r, 1000));

  const check = await page.evaluate(
    ({ target, locateSrc }) => {
      const el = new Function('target', `return (${locateSrc})(target)`)(target);
      const r = el?.getBoundingClientRect();
      const imgs = [...(el?.querySelectorAll('img') ?? [])];

      /* An image can be loaded and still screenshot blank if an ancestor
         fades or clips it, so walk up and check. */
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
    `  wrote ${shot.file} (${shot.width}x${shot.height}) ` +
      `${slideInfo ? `slide=${JSON.stringify(slideInfo)} ` : ''}${JSON.stringify(check)}`
  );
  if (!check.found) console.log(`  !! target "${shot.target}" not found for ${shot.file}`);
  if (check.hidden > 0) console.log(`  !! ${check.hidden} image(s) still hidden in ${shot.file}`);

  await page.close();
}

await browser.close();
