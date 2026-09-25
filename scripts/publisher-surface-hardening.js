const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS, INDEXABLE_SERVICE_CITY_ROUTES, CORE_ROUTES } = require('./site-curation-config');

const root = process.cwd();
const appFile = path.join(root, 'src', 'App.js');
const landingFile = path.join(root, 'src', 'LandingPage.js');
const sitemapFile = path.join(root, 'public', 'sitemap.xml');
const indexFile = path.join(root, 'public', 'index.html');
const vercelFile = path.join(root, 'vercel.json');

for (const file of [appFile, landingFile, sitemapFile, indexFile, vercelFile]) {
  if (!fs.existsSync(file)) throw new Error(`[publisher surface] missing ${path.relative(root, file)}`);
}

let app = fs.readFileSync(appFile, 'utf8');
const inserted = false;
const landing = fs.readFileSync(landingFile, 'utf8');
const sitemap = fs.readFileSync(sitemapFile, 'utf8');
const index = fs.readFileSync(indexFile, 'utf8');
const vercel = fs.readFileSync(vercelFile, 'utf8');
const failures = [];

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (sitemapLocs.some((url) => /\/(?:profile|profiles|worker|workers)\//i.test(url))) failures.push('sitemap exposes standalone profile URLs');

const curatedServiceUrls = new Set(INDEXABLE_SERVICE_CITY_ROUTES.map((route) => 'https://snay3i.ma' + route));
const exposedServiceUrls = sitemapLocs.filter((url) => /\/artisan\//i.test(url));
const uncuratedServiceUrls = exposedServiceUrls.filter((url) => !curatedServiceUrls.has(url));
if (uncuratedServiceUrls.length) failures.push('sitemap exposes uncurated service-city URLs: ' + uncuratedServiceUrls.join(', '));
for (const url of curatedServiceUrls) if (!sitemapLocs.includes(url)) failures.push('sitemap missing curated directory URL: ' + url);

const expectedRoutes = CORE_ROUTES.length + INDEXABLE_BLOG_SLUGS.length + INDEXABLE_SERVICE_CITY_ROUTES.length;
if (sitemapLocs.length !== expectedRoutes) failures.push(`expected ${expectedRoutes} curated sitemap URLs, found ${sitemapLocs.length}`);

const parameterHref = /href\s*=\s*(?:["'`])[^"'`]*\?(?:[^"'`]*&)?(?:sort|filter|page|category)=/i;
if (parameterHref.test(app)) failures.push('App.js contains crawlable filter/sort/page/category parameter links');
if (parameterHref.test(landing)) failures.push('LandingPage.js contains crawlable filter/sort/page/category parameter links');

const sourceCanonical = (index.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [null, ''])[1];
if (sourceCanonical !== 'https://snay3i.ma/') failures.push(`homepage canonical is not clean root (${sourceCanonical || 'missing'})`);
if (/[?#]/.test(sourceCanonical || '')) failures.push('homepage canonical contains a query or fragment');

if (/setMeta\(['"]robots['"],\s*['"]index,\s*follow['"]\s*\)/i.test(landing)) failures.push('LandingPage.js contains an uncontrolled runtime index,follow override');
if (/list\.length[\s\S]{0,140}['"]index,\s*follow['"]/i.test(landing)) failures.push('LandingPage.js conditionally indexes arbitrary populated local pages');

if (!/href=["']\/blog["']/.test(index)) failures.push('raw homepage fallback does not link to /blog');
const canonicalGuideLinks = [...app.matchAll(/href=["'](\/blog\/[^"']+)["']/g)].map((m) => m[1]);
if (new Set(canonicalGuideLinks).size < 4) failures.push('interactive homepage does not prominently expose at least four canonical editorial guides');
if (!/data-publisher-guides=["']1["']/.test(app)) failures.push('interactive homepage editorial guide module missing');
const firstPartyTools = [...app.matchAll(/href=["'](\/outils(?:\/[^"']*)?)["']/g)].map((m) => m[1]);
if (new Set(firstPartyTools).size < 5) failures.push('interactive homepage exposes fewer than five distinct first-party tool links');
if (!/data-snay3i-tools-hub=["']1["']/.test(app)) failures.push('interactive homepage first-party tools module missing');

if (!/"src"\s*:\s*"\/rejoindre"[\s\S]{0,180}X-Robots-Tag["']?\s*:\s*["']noindex,\s*follow/i.test(vercel)) failures.push('/rejoindre is not explicitly noindex at the edge');
if (!/"dest"\s*:\s*"\/404\.html"[\s\S]{0,80}"status"\s*:\s*404/i.test(vercel)) failures.push('real 404 catchall missing from vercel.json');

if (failures.length) throw new Error(`[publisher surface] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[publisher surface] PASS: ${expectedRoutes}-route sitemap exposes exactly ${INDEXABLE_SERVICE_CITY_ROUTES.length} curated directory pages, no uncurated profile/service-city leaks, no crawlable filter permutations; runtime catch-all local pages remain noindex`);
