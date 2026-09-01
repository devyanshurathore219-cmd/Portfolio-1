import puppeteer from 'puppeteer-core';

/*
  The team fan is scroll-driven: the section coming into view opens it, and the
  section leaving the viewport folds it back. So this check drives it by
  scrolling rather than by clicking a control — there is no longer one.
*/
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
  defaultViewport: { width: 1440, height: 950 },
});
const page = await browser.newPage();
await page.goto('http://localhost:4355/', { waitUntil: 'networkidle2', timeout: 60000 });

const readMates = () =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll('#team [aria-hidden]')].filter((el) =>
      el.className.includes('absolute left-1/2 top-1/2')
    );
    return cards.map((c) => {
      const r = c.getBoundingClientRect();
      return {
        name: c.querySelector('.font-bold')?.textContent?.trim(),
        opacity: Number(getComputedStyle(c).opacity).toFixed(2),
        cx: Math.round(r.left + r.width / 2),
        visible: Number(getComputedStyle(c).opacity) > 0.9,
      };
    });
  });

/* Park at the top of the page: the team section is offscreen, so folded. */
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 1200));

console.log('--- layout ---');
const layout = await page.evaluate(() => {
  const s = document.getElementById('team');
  const t = s.textContent.replace(/\s+/g, ' ');
  return {
    headline: s.querySelector('h2')?.textContent?.trim(),
    hasTagline: /Founder @ DigiWebNow/i.test(t),
    hasFounderCard: !!s.querySelector('img[alt*="Devyanshu"]'),
    founderPhotoOk: (() => {
      const i = s.querySelector('img[alt*="Devyanshu"]');
      return i && i.complete && i.naturalWidth > 0;
    })(),
    hasBottomTagline: /market dominance/i.test(t),
    clientLinks: [...s.querySelectorAll('a')].map((a) => a.textContent.trim()),
    /* The reveal is automatic now: no button, no aria-expanded, no Meet/Hide. */
    buttonCount: s.querySelectorAll('button').length,
    ariaExpandedCount: s.querySelectorAll('[aria-expanded]').length,
    hasToggleLabel: /meet the team|hide team/i.test(t),
    /* Looping headline band: two identical halves, so six cells in total. */
    bandCells: s.querySelectorAll('.marquee span').length,
    bandAnimation: (() => {
      const m = s.querySelector('.marquee');
      return m ? getComputedStyle(m).animationName : null;
    })(),
  };
});
console.log(`  sr-only heading     : "${layout.headline}"            (expect "Our Team")`);
console.log(`  founder tagline     : ${layout.hasTagline}`);
console.log(`  founder card + photo: ${layout.hasFounderCard} / ${layout.founderPhotoOk ? 'loaded' : 'BROKEN'}`);
console.log(`  bottom tagline      : ${layout.hasBottomTagline}`);
console.log(`  client links        : ${layout.clientLinks.join(' | ')}`);
console.log(`  band cells / anim   : ${layout.bandCells} / ${layout.bandAnimation}   (expect 6 / marqueeScroll)`);
console.log(`  buttons in #team    : ${layout.buttonCount}   (expect 0)`);
console.log(`  aria-expanded nodes : ${layout.ariaExpandedCount}   (expect 0)`);
console.log(`  Meet/Hide label     : ${layout.hasToggleLabel}   (expect false)`);

console.log('\n--- folded (page top, section offscreen) ---');
let mates = await readMates();
console.log(`  teammate cards found: ${mates.length} (expect 4)`);
mates.forEach((m) => console.log(`    ${String(m.name).padEnd(16)} opacity=${m.opacity} centreX=${m.cx}`));
console.log(`  all hidden before scroll: ${mates.every((m) => Number(m.opacity) < 0.1) ? 'PASS' : 'FAIL'}`);

/* Scroll down to the section the way a visitor arrives, then sample the reveal. */
await page.evaluate(async () => {
  const team = document.getElementById('team');
  const target = team.getBoundingClientRect().top + window.scrollY;
  const start = window.scrollY;
  for (let i = 1; i <= 30; i++) {
    window.scrollTo(0, start + ((target - start) * i) / 30);
    await new Promise((r) => setTimeout(r, 35));
  }
});

console.log('\n--- scroll-triggered open (sampling every 120ms) ---');
for (let t = 0; t <= 1200; t += 120) {
  const snap = await readMates();
  const visCount = snap.filter((m) => Number(m.opacity) > 0.5).length;
  console.log(`  t=${String(t).padStart(4)}ms  visible=${visCount}/4  [${snap.map((m) => m.opacity).join(' ')}]`);
  await new Promise((r) => setTimeout(r, 120));
}

await new Promise((r) => setTimeout(r, 800));
mates = await readMates();
console.log('\n--- opened state (fan positions) ---');
mates.forEach((m) => console.log(`    ${String(m.name).padEnd(16)} opacity=${m.opacity} centreX=${m.cx}`));
console.log(`  all visible after scroll: ${mates.every((m) => Number(m.opacity) > 0.9) ? 'PASS' : 'FAIL'}`);
console.log(`  fanned to 4 distinct x  : ${new Set(mates.map((m) => m.cx)).size === 4 ? 'PASS' : 'FAIL'}`);

await page.screenshot({ path: 'fan_open.png' });

/* Leaving the section entirely folds the hand back. */
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 1800));
mates = await readMates();
console.log(`  folds after leaving     : ${mates.every((m) => Number(m.opacity) < 0.1) ? 'PASS' : 'FAIL'}`);

await page.evaluate(() => document.getElementById('team').scrollIntoView({ block: 'center' }));
await new Promise((r) => setTimeout(r, 1600));
mates = await readMates();
console.log(`  re-opens on return     : ${mates.every((m) => Number(m.opacity) > 0.9) ? 'PASS' : 'FAIL'}`);

await browser.close();
