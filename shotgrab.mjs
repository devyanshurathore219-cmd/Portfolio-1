import puppeteer from 'puppeteer-core';

const SITE = 'https://digital-markiting-beta.vercel.app/';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

for (const url of [SITE, `${SITE}index.html`]) {
  const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log(`${url} -> ${res.status()} ${res.url()}`);
}

const info = await page.evaluate(() => ({
  title: document.title,
  navLinks: [...document.querySelectorAll('nav a, header a')].map((a) => ({
    text: a.textContent.trim().slice(0, 24),
    href: a.getAttribute('href'),
  })),
  sections: [...document.querySelectorAll('section, main > div[id]')]
    .slice(0, 20)
    .map((s) => ({
      id: s.id || null,
      cls: (s.className || '').toString().slice(0, 50),
      heading: s.querySelector('h1, h2')?.textContent.trim().slice(0, 40) ?? null,
      top: Math.round(s.getBoundingClientRect().top + window.scrollY),
      height: Math.round(s.getBoundingClientRect().height),
    })),
}));

console.log(JSON.stringify(info, null, 2));
await browser.close();
