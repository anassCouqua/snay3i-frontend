'use strict';

const {
  INDEXABLE_BLOG_SLUGS,
  INDEXABLE_SERVICE_CITY_ROUTES,
  CORE_ROUTES,
} = require('./site-curation-config');

const BASE = 'https://snay3i.ma';
const EXPECTED_ROUTES = [...new Set([
  ...CORE_ROUTES,
  ...INDEXABLE_SERVICE_CITY_ROUTES,
  ...INDEXABLE_BLOG_SLUGS.map((slug) => '/blog/' + slug),
])].sort();
const AD_ROUTES = new Set(INDEXABLE_BLOG_SLUGS.map((slug) => '/blog/' + slug));
const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

function canonicalFor(route) {
  return BASE + (route === '/' ? '/' : route);
}

async function fetchText(route, attempt) {
  const url = new URL(route, BASE);
  url.searchParams.set('__snay3i_smoke', String(attempt) + '-' + Date.now());
  const response = await fetch(url, {
    cache: 'no-store',
    redirect: 'follow',
    headers: {
      'cache-control': 'no-cache, no-store, max-age=0',
      pragma: 'no-cache',
      'user-agent': 'Snay3iProductionQualityCheck/1.0',
    },
    signal: AbortSignal.timeout(15000),
  });
  const html = await response.text();
  if (!response.ok) throw new Error(route + ' returned HTTP ' + response.status);
  return { html, response };
}

async function runChecks(attempt) {
  failures.length = 0;
  const requiredRoutes = [...EXPECTED_ROUTES, '/sitemap.xml', '/robots.txt'];
  const results = await Promise.all(requiredRoutes.map(async (route) => ({
    route,
    ...(await fetchText(route, attempt)),
  })));
  const byRoute = new Map(results.map((result) => [result.route, result]));
  const sitemap = byRoute.get('/sitemap.xml').html;
  const robots = byRoute.get('/robots.txt').html;

  const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim());
  const expectedUrls = EXPECTED_ROUTES.map(canonicalFor).sort();
  check(new Set(sitemapUrls).size === sitemapUrls.length, 'Production sitemap contains duplicate URLs');
  check(JSON.stringify([...sitemapUrls].sort()) === JSON.stringify(expectedUrls),
    'Production sitemap does not match the 21 curated canonical routes (found ' + sitemapUrls.length + ' URLs)');
  check(/<urlset\b/i.test(sitemap), 'Production sitemap does not have a urlset root');
  check(/^\s*Sitemap:\s*https:\/\/snay3i\.ma\/sitemap\.xml\s*$/im.test(robots),
    'Production robots.txt does not declare the canonical sitemap');

  for (const route of EXPECTED_ROUTES) {
    const html = byRoute.get(route).html;
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    check(Boolean(title && title[1].trim()), route + ': production HTML has no title');
    check(Boolean(canonicalMatch && canonicalMatch[1] === canonicalFor(route)),
      route + ': production canonical is missing or incorrect');
    check(Boolean(robotsMatch && /^index\s*,\s*follow$/i.test(robotsMatch[1])),
      route + ': production robots directive is missing or not index,follow');

    const hasAdServingCode = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html)
      || /<ins\b[^>]*class=["'][^"']*adsbygoogle/i.test(html);
    check(AD_ROUTES.has(route) ? hasAdServingCode : !hasAdServingCode,
      route + ': production AdSense serving-code placement differs from the approved six-guide allowlist');
  }

  for (const slug of INDEXABLE_BLOG_SLUGS) {
    const route = '/blog/' + slug;
    const html = byRoute.get(route).html;
    const schemaScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const schemas = [];
    for (const match of schemaScripts) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed && parsed['@type'] === 'BlogPosting') schemas.push(parsed);
      } catch (_) {
        failures.push(route + ': production BlogPosting JSON-LD is invalid JSON');
      }
    }
    const datePublished = html.match(/<time\b[^>]*datetime=["']([^"']+)["'][^>]*data-date-published=["']1["']/i);
    const dateModified = html.match(/<time\b[^>]*datetime=["']([^"']+)["'][^>]*data-date-modified=["']1["']/i);
    check(schemas.length >= 1, route + ': production BlogPosting structured data is missing');
    check(Boolean(datePublished && dateModified), route + ': production visible publication/modification dates are missing');

    for (const schema of schemas) {
      check(Boolean(datePublished && schema.datePublished === datePublished[1]),
        route + ': production visible publication date disagrees with BlogPosting JSON-LD');
      check(Boolean(dateModified && schema.dateModified === dateModified[1]),
        route + ': production visible modification date disagrees with BlogPosting JSON-LD');
      const sitemapBlock = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gi)]
        .map((match) => match[1])
        .find((block) => block.includes('<loc>' + canonicalFor(route) + '</loc>'));
      check(Boolean(sitemapBlock && sitemapBlock.includes('<lastmod>' + schema.dateModified + '</lastmod>')),
        route + ': production sitemap lastmod disagrees with BlogPosting JSON-LD');
    }
  }

  const questions = byRoute.get('/blog/questions-avant-travaux-artisan-maroc').html;
  const compare = byRoute.get('/blog/comparer-devis-travaux-maroc').html;
  for (const [route, html] of [
    ['/blog/questions-avant-travaux-artisan-maroc', questions],
    ['/blog/comparer-devis-travaux-maroc', compare],
  ]) {
    check(/<div class=["']table-wrap["'][^>]*>[\s\S]*?<table>[\s\S]*?<thead>[\s\S]*?<th scope=["']col["'][\s\S]*?<tbody>[\s\S]*?<\/tbody>[\s\S]*?<\/table>/i.test(html),
      route + ': production HTML does not contain the semantic comparison table');
    check(/<tbody>[\s\S]*?<tr>[\s\S]*?<td>[^<\s]/i.test(html),
      route + ': production comparison table has no populated data cells');
  }
  check(/Travaux compris/i.test(questions), 'Question guide comparison rows are missing from production HTML');
  check(/Devis A/i.test(compare), 'Quote comparison headers are missing from production HTML');

  if (failures.length) throw new Error(failures.join('\n'));
  console.log('PASS: production returned ' + EXPECTED_ROUTES.length + ' curated canonical routes.');
  console.log('PASS: robots.txt and sitemap URLs/lastmod match the deployed article metadata.');
  console.log('PASS: all six article pages have matching visible dates and BlogPosting JSON-LD.');
  console.log('PASS: both comparison tables render in served HTML with populated cells.');
  console.log('PASS: AdSense serving code is limited to the six approved editorial guides.');
}

(async () => {
  let lastError;
  for (let attempt = 1; attempt <= 18; attempt += 1) {
    try {
      await runChecks(attempt);
      process.exitCode = 0;
      return;
    } catch (error) {
      lastError = error;
      console.log('Production deployment verification attempt ' + attempt + '/18 did not pass: ' + error.message);
      if (attempt < 18) await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
  console.error('BLOCKED: live production smoke test did not pass after 18 attempts.');
  console.error(lastError && lastError.message ? lastError.message : String(lastError));
  process.exitCode = 1;
})();
