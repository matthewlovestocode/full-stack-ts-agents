import { chromium } from '@playwright/test';

const argvUrlFlagIndex = process.argv.findIndex((value) => value === '--url');
const url =
  (argvUrlFlagIndex !== -1 ? process.argv[argvUrlFlagIndex + 1] : undefined) ??
  process.env.PLAYWRIGHT_ANALYZE_URL;

if (!url) {
  console.error('Usage: npm run analyze:playwright -- --url <https://example.com>');
  process.exit(1);
}

const run = async () => {
  const browser = await chromium.launch({ headless: process.env.PLAYWRIGHT_HEADLESS !== 'false' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'load' });

  const [metrics, accessibility] = await Promise.all([
    page.evaluate(() => {
      const primaryHeading = document.querySelector('h1, h2');
      const headings = Array.from(document.querySelectorAll('h1, h2')).map((element) => ({
        level: element.tagName,
        text: element.textContent?.trim() ?? '',
      }));
      const links = Array.from(document.querySelectorAll('a')).map((link) => ({
        text: link.textContent?.trim() ?? '',
        href: link.getAttribute('href') ?? '',
      }));
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img'))
        .filter((img) => !img.hasAttribute('alt') || img.getAttribute('alt') === '')
        .map((img) => img.getAttribute('src') ?? '');

      return {
        title: document.title,
        description:
          document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
        primaryHeading: primaryHeading?.textContent?.trim() ?? null,
        headingCount: headings.length,
        headings,
        linkCount: links.length,
        links,
        imagesWithoutAlt,
        textCharacters: document.body.innerText.length,
        htmlBytes: new TextEncoder().encode(document.documentElement.outerHTML).length,
      };
    }),
    page.accessibility.snapshot({ interestingOnly: true }).catch((error) => {
      console.warn('Accessibility snapshot failed:', error?.message ?? error);
      return null;
    }),
  ]);

  await browser.close();

  console.log(JSON.stringify({ url, fetchedAt: new Date().toISOString(), metrics, accessibility }, null, 2));
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
