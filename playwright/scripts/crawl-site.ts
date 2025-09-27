import { chromium, devices } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type RouteResult = {
  route: string;
  slug: string;
  summary: PageSummary;
  screenshots: Array<ViewportCapture>;
};

type PageSummary = {
  title: string | null;
  primaryHeading: string | null;
  description: string | null;
  firstParagraph: string | null;
  linkCount: number;
  wordCount: number;
};

type ViewportCapture = {
  key: string;
  label: string;
  path: string;
  displayWidth: number;
};

const devicePresets = [
  { key: 'mobile', label: 'Mobile (Pixel 5)', options: devices['Pixel 5'], reportWidth: 260 },
  { key: 'tablet', label: 'Tablet (iPad (gen 7) portrait)', options: devices['iPad (gen 7)'], reportWidth: 540 },
  { key: 'desktop', label: 'Desktop (Chrome)', options: devices['Desktop Chrome'], reportWidth: 780 },
] as const;

const defaultRoutes = ['/', '/docs'];

type CLIOptions = {
  baseUrl: string;
  routes: string[];
  output: string;
};

const parseCliOptions = (): CLIOptions => {
  const args = process.argv.slice(2);
  const map: Record<string, string> = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = args[index + 1];

    if (next && !next.startsWith('--')) {
      map[key] = next;
      index += 1;
    } else {
      map[key] = 'true';
    }
  }

  const baseUrl =
    map.base ??
    process.env.PLAYWRIGHT_CRAWL_BASE_URL ??
    process.env.PLAYWRIGHT_BASE_URL ??
    'http://127.0.0.1:5173';

  const routes = map.routes ? map.routes.split(',').map((route) => route.trim()).filter(Boolean) : defaultRoutes;

  const output = map.output ?? 'docs/crawl.md';

  return { baseUrl, routes, output };
};

const slugifyRoute = (route: string): string => {
  if (route === '/' || route === '') {
    return 'home';
  }

  return route
    .replace(/^\//, '')
    .replace(/\/+/g, '-')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'page';
};

const buildMarkdown = (baseUrl: string, results: RouteResult[], docsDir: string): string => {
  const timestamp = new Date().toISOString();
  const regenerateCommand = `npm run crawl:playwright -- --base ${baseUrl} --routes ${results
    .map((item) => item.route)
    .join(',')}`;

  const sections = results.map((result) => {
    const summaryLines = [
      `- Route: \`${result.route}\``,
      `- URL: ${new URL(result.route, baseUrl).toString()}`,
      `- Title: ${result.summary.title ?? '—'}`,
      `- Primary heading: ${result.summary.primaryHeading ?? '—'}`,
      `- Meta description: ${result.summary.description ?? '—'}`,
      `- Links on page: ${result.summary.linkCount}`,
      `- Approximate word count: ${result.summary.wordCount}`,
    ];

    const excerpt = result.summary.firstParagraph ? `\n> ${result.summary.firstParagraph}\n` : '';

    const screenshotBlocks = result.screenshots
      .map((shot) => {
        const relativePath = path.relative(docsDir, shot.path).split(path.sep).join('/');
        const alt = `${result.summary.primaryHeading ?? result.summary.title ?? result.slug} — ${shot.label}`;
        return [
          '<figure>',
          `  <img src="${relativePath}" alt="${alt}" width="${shot.displayWidth}" loading="lazy" />`,
          `  <figcaption>${shot.label}</figcaption>`,
          '</figure>',
        ].join('\n');
      })
      .join('\n\n');

    return [
      `## ${result.summary.primaryHeading ?? result.summary.title ?? result.route}`,
      summaryLines.join('\n'),
      excerpt,
      screenshotBlocks,
    ]
      .filter(Boolean)
      .join('\n\n');
  });

  const regenerateSection = [
    '## Regenerate This Report',
    '1. Start the client (and any required backend services).',
    `2. Run \`${regenerateCommand}\` from the repo root.`,
  ].join('\n');

  return [
    '# Crawl Report',
    `Generated at: ${timestamp}`,
    `Base URL: ${baseUrl}`,
    `Routes scanned: ${results.map((item) => `\`${item.route}\``).join(', ')}`,
    regenerateSection,
    sections.join('\n\n---\n\n'),
  ]
    .filter(Boolean)
    .join('\n\n');
};

const collectSummary = async (page: import('@playwright/test').Page): Promise<PageSummary> => {
  return page.evaluate(() => {
    const title = document.title || null;
    const primaryHeading = document.querySelector('main h1, h1, h2');
    const firstParagraph = Array.from(document.querySelectorAll('main p, p')).find((element) => {
      return (element.textContent?.trim()?.length ?? 0) > 0;
    });
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;
    const linkCount = document.querySelectorAll('a').length;
    const text = document.body.innerText || '';
    const words = text
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);

    return {
      title,
      primaryHeading: primaryHeading?.textContent?.trim() ?? null,
      description,
      firstParagraph: firstParagraph?.textContent?.trim() ?? null,
      linkCount,
      wordCount: words.length,
    } satisfies PageSummary;
  });
};

const run = async () => {
  const { baseUrl, routes, output } = parseCliOptions();

  if (!baseUrl.startsWith('http')) {
    console.error(`Base URL must be an absolute http(s) URL. Received: ${baseUrl}`);
    process.exit(1);
  }

  if (routes.length === 0) {
    console.error('At least one route is required.');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: process.env.PLAYWRIGHT_HEADLESS !== 'false' });

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(currentDir, '..', '..');
  const docsDir = path.resolve(repoRoot, 'docs');
  const assetsDir = path.resolve(docsDir, 'assets', 'crawl');

  await mkdir(assetsDir, { recursive: true });

  const results: RouteResult[] = [];

  for (const route of routes) {
    const slug = slugifyRoute(route);
    const screenshots: RouteResult['screenshots'] = [];
    let summary: PageSummary | null = null;

    for (const preset of devicePresets) {
      const context = await browser.newContext({ ...preset.options });
      const page = await context.newPage();
      const targetUrl = new URL(route, baseUrl).toString();
      const response = await page.goto(targetUrl, { waitUntil: 'networkidle' });

      if (!response || !response.ok()) {
        await context.close();
        throw new Error(`Failed to load ${targetUrl}: ${(response && response.status()) || 'no response'}`);
      }

      if (preset.key === 'desktop') {
        summary = await collectSummary(page);
      }

      const screenshotPath = path.resolve(assetsDir, `${slug}-${preset.key}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push({
        key: preset.key,
        label: preset.label,
        path: screenshotPath,
        displayWidth: preset.reportWidth,
      });

      await context.close();
    }

    if (!summary) {
      throw new Error(`Unable to capture summary for ${route}.`);
    }

    results.push({ route, slug, summary, screenshots });
  }

  const markdown = buildMarkdown(baseUrl, results, docsDir);

  const outputPath = path.resolve(repoRoot, output);
  await writeFile(outputPath, `${markdown}\n`, 'utf8');

  console.log(`Crawl complete. Report written to ${path.relative(process.cwd(), outputPath)}`);

  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
