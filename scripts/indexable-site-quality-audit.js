const fs = require('fs');
const path = require('path');
const {
  INDEXABLE_BLOG_SLUGS,
  INDEXABLE_SERVICE_CITY_ROUTES,
  CORE_ROUTES,
} = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public');
const blogRoutes = INDEXABLE_BLOG_SLUGS.map((slug) => `/blog/${slug}`);
const routes = [...CORE_ROUTES, ...INDEXABLE_SERVICE_CITY_ROUTES, ...blogRoutes];
const indexed = new Set(routes);
const adEligible = new Set(['/', ...blogRoutes]);

const minimumWords = {
  '/': 250,
  '/about': 400,
  '/blog': 250,
  '/contact': 180,
  '/privacy': 350,
  '/terms': 650,
};

function fileFor(route) {
  return route === '/' ? path.join(publicRoot, 'index.html') : path.join(publicRoot, route.slice(1), 'index.html');
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&[a-z0-9#]+;/gi, ' ');
}

function mainText(html, route) {
  let source = html;
  if (route === '/') {
    const noscript = html.match(/<noscript[^>]*>([\s\S]*?)<\/noscript>/i);
    if (noscript) source = noscript[1];
  } else {
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (main) source = main[1];
  }
  return decodeEntities(source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-zà-ÿ0-9’'-]+/gi) || [];
}

function shingles(tokens, size = 5) {
  const set = new Set();
  for (let i = 0; i <= tokens.length - size; i += 1) set.add(tokens.slice(i, i + size).join(' '));
  return set;
}

function jaccard(a, b) {
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection || 1);
}

function metaContent(html, name) {
  const re = new RegExp(`<meta\\s+name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const reverse = new RegExp(`<meta\\s+content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i');
  const match = html.match(re) || html.match(reverse);
  return match ? match[1] : '';
}

const failures = [];
const rows = [];
for (const route of routes) {
  const file = fileFor(route);
  if (!fs.existsSync(file)) {
    failures.push(`${route}: file missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const text = mainText(html, route);
  const tokens = tokenize(text);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [null, ''])[1].replace(/<[^>]+>/g, '').trim();
  const desc = metaContent(html, 'description');
  const robots = metaContent(html, 'robots').toLowerCase();
  const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i) || [null, ''])[1];
  const h1 = (route === '/' ? ((html.match(/<noscript[\s\S]*?<h1\b/gi) || []).length) : (html.match(/<h1\b/gi) || []).length);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
  const missingAlt = images.filter((match) => !/\balt=["'][^"']+["']/i.test(match[1])).length;
  const hasAds = /adsbygoogle\.js|google-adsense-account/i.test(html);
  const min = route.startsWith('/blog/') ? 800 : (minimumWords[route] || 180);

  rows.push({ route, words: tokens.length, h1, images: images.length, missingAlt, hasAds, shingles: shingles(tokens) });

  if (!/^index\s*,\s*follow$/.test(robots)) failures.push(`${route}: robots is "${robots || 'missing'}"`);
  if (canonical !== `https://snay3i.ma${route === '/' ? '/' : route}`) failures.push(`${route}: canonical mismatch (${canonical || 'missing'})`);
  if (!title) failures.push(`${route}: title missing`);
  if (!desc || desc.length < 70) failures.push(`${route}: meta description too weak/missing (${desc.length})`);
  if (h1 !== 1) failures.push(`${route}: expected exactly one H1 in primary content, found ${h1}`);
  if (tokens.length < min) failures.push(`${route}: only ${tokens.length} words; internal floor is ${min}`);
  if (missingAlt) failures.push(`${route}: ${missingAlt} image(s) missing meaningful alt text`);
  if (!/lang=["']fr["']/i.test(html)) failures.push(`${route}: html lang=fr missing`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) failures.push(`${route}: viewport meta missing`);
  if (!adEligible.has(route) && hasAds) failures.push(`${route}: AdSense code present on non-editorial/trust route`);

  const stale = [...html.matchAll(/href=["'](\/(?:guides|a-propos|cgu|politique-de-confidentialite|seo)(?:\/[^"']*)?)["']/gi)].map((m) => m[1]);
  if (stale.length) failures.push(`${route}: stale internal route link(s): ${[...new Set(stale)].join(', ')}`);
  const oldBlog = [...html.matchAll(/href=["'](\/blog\/([^"'?#]+))["']/gi)]
    .filter((m) => !indexed.has(m[1]))
    .map((m) => m[1]);
  if (oldBlog.length) failures.push(`${route}: link(s) to retired blog page: ${[...new Set(oldBlog)].join(', ')}`);
}

console.log('=== SNAY3I FINAL INDEXABLE-SITE GATE ===');
console.log('Route | Words | H1 | Images | Missing alt | Ads');
for (const row of rows) console.log(`${row.route} | ${row.words} | ${row.h1} | ${row.images} | ${row.missingAlt} | ${row.hasAds ? 'YES' : 'NO'}`);

const overlaps = [];
for (let i = 0; i < rows.length; i += 1) {
  for (let j = i + 1; j < rows.length; j += 1) {
    const score = jaccard(rows[i].shingles, rows[j].shingles);
    if (score >= 0.20) overlaps.push({ a: rows[i].route, b: rows[j].route, score });
  }
}
overlaps.sort((a, b) => b.score - a.score);
if (overlaps.length) {
  console.log('=== INDEXABLE PAGE OVERLAP >= 0.20 ===');
  for (const pair of overlaps) console.log(`${pair.score.toFixed(3)} | ${pair.a} <> ${pair.b}`);
  for (const pair of overlaps.filter((item) => item.score >= 0.35)) failures.push(`high indexable overlap ${pair.score.toFixed(3)}: ${pair.a} <> ${pair.b}`);
} else {
  console.log('[indexable gate] no page pair has 5-word shingle overlap >= 0.20');
}

if (failures.length) throw new Error(`[indexable gate] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[indexable gate] PASS: ${routes.length} indexable routes pass depth, metadata, robots/canonical, ad-placement, accessibility and overlap checks`);
