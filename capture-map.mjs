import puppeteer from 'puppeteer-core';

/*
  Bakes the contact page's map background into a single local image.

  Why a baked image rather than a live map:
    - No API key. Mapbox / Google / MapTiler static-map endpoints all need one,
      and a key committed to a static frontend is a key given away.
    - No runtime request. The page loads one local file instead of ~40 tile
      requests against someone else's CDN on every visit, which is also what
      keeps this inside acceptable tile-usage territory.
    - No dependency. Stitching normally wants sharp or node-canvas; laying the
      tiles out in a page and screenshotting them uses the puppeteer-core that
      is already here.

  Tiles are CARTO's "dark_all" basemap, which is the dark, grey-street,
  labelled style the reference design uses. It is OpenStreetMap data, so the
  page carries the required attribution — see the footer of ContactPage.tsx.

  ---------------------------------------------------------------------------
  TO MOVE THE MAP: change CENTRE (and ZOOM if you want it tighter or wider),
  then re-run `node capture-map.mjs`. Nothing else needs touching.
  ---------------------------------------------------------------------------
*/
const CENTRE = { lat: 28.6315, lon: 77.2167, label: 'Connaught Place, New Delhi' };
const ZOOM = 15;

/* Logical size of the output. deviceScaleFactor below multiplies this. */
const WIDTH = 1600;
const HEIGHT = 1000;
const SCALE = 1.5;

const TILE = 256;
const OUT = 'public/assets/images/contact_map.jpg';

/* Web Mercator: centre lat/lon -> global pixel coordinates at this zoom. */
const globalPixels = (lat, lon, zoom) => {
  const n = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n * TILE,
    y: ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n * TILE,
  };
};

const centre = globalPixels(CENTRE.lat, CENTRE.lon, ZOOM);
const left = centre.x - WIDTH / 2;
const top = centre.y - HEIGHT / 2;

const firstTileX = Math.floor(left / TILE);
const lastTileX = Math.floor((left + WIDTH) / TILE);
const firstTileY = Math.floor(top / TILE);
const lastTileY = Math.floor((top + HEIGHT) / TILE);

/* Where the first tile's top-left corner sits relative to the viewport. */
const offsetX = firstTileX * TILE - left;
const offsetY = firstTileY * TILE - top;

const tiles = [];
for (let x = firstTileX; x <= lastTileX; x++) {
  for (let y = firstTileY; y <= lastTileY; y++) {
    const sub = 'abc'[Math.abs(x + y) % 3];
    tiles.push({
      /* @2x tiles are 512px covering 256 logical px, so they stay sharp once
         deviceScaleFactor is applied. */
      url: `https://${sub}.basemaps.cartocdn.com/dark_all/${ZOOM}/${x}/${y}@2x.png`,
      cssLeft: Math.round(offsetX + (x - firstTileX) * TILE),
      cssTop: Math.round(offsetY + (y - firstTileY) * TILE),
    });
  }
}

/*
  dark_all is far darker than the reference, whose streets read as clear grey.
  The lift is baked in here rather than applied as a CSS filter on the page:
  filtering a full-bleed image on every paint costs real compositing time, and
  the levels never need to change at runtime.
*/
const BRIGHTNESS = 2.3;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#0b0b0b;overflow:hidden}
  #m{position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;
     filter:brightness(${BRIGHTNESS}) contrast(1.05)}
  #m img{position:absolute;width:${TILE}px;height:${TILE}px;display:block}
</style></head><body><div id="m">
${tiles
  .map((t) => `<img src="${t.url}" style="left:${t.cssLeft}px;top:${t.cssTop}px">`)
  .join('\n')}
</div></body></html>`;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE });
await page.setContent(html, { waitUntil: 'networkidle2', timeout: 120000 });

const loaded = await page
  .waitForFunction(
    () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    { timeout: 60000 }
  )
  .then(() => true)
  .catch(() => false);

const status = await page.evaluate(() => {
  const imgs = [...document.images];
  return {
    total: imgs.length,
    failed: imgs.filter((i) => !i.complete || !i.naturalWidth).length,
    sample: imgs[0]?.naturalWidth,
  };
});

await page.screenshot({
  path: OUT,
  type: 'jpeg',
  quality: 82,
  clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
});

console.log(`centre        : ${CENTRE.label} (${CENTRE.lat}, ${CENTRE.lon}) z${ZOOM}`);
console.log(`tiles         : ${status.total} requested, ${status.failed} failed (native ${status.sample}px)`);
console.log(`all loaded    : ${loaded}`);
console.log(`brightness    : ${BRIGHTNESS}x baked in`);
console.log(`wrote         : ${OUT} at ${WIDTH * SCALE}x${HEIGHT * SCALE}`);
if (status.failed > 0) console.log('!! some tiles did not load — re-run before shipping');

await browser.close();
