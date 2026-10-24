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
const adEligible = new Set(blogRoutes);

const minimumWords = {
  '/': 250,
  '/about': 400,
  '/blog': 250,
  '/contact': 180,
  '/privacy': 350,
  '/terms': 650,
  '/editorial-policy': 650,
  '/outils': 300,
  '/outils/comparateur-devis': 450,
  '/outils/calculateur-peinture': 350,
  '/outils/calculateur-carrelage': 350,
  '/outils/checklist-renovation': 350,
  '/outils/planificateur-budget-renovation': 350,
  '/outils/brief-artisan': 300,
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
    const fallback = html.match(/<main[^>]*data-static-app-fallback=["']1["'][^>]*>([\s\S]*?)<\/main>/i);
    if (fallback) source = fallback[1];
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
  return text.toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
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
const sitemapPath = path.join(publicRoot, 'sitemap.xml');
const robotsPath = path.join(publicRoot, 'robots.txt');
if (!fs.existsSync(sitemapPath)) {
  failures.push('sitemap.xml: generated sitemap missing');
} else {
  const sitemapHtml = fs.readFileSync(sitemapPath, 'utf8');
  const urlBlocks = [...sitemapHtml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => match[1]);
  const sitemapUrls = urlBlocks.map((block) => ((block.match(/<loc>([^<]+)<\/loc>/i) || [null, ''])[1]));
  const expectedUrls = routes.map((route) => 'https://snay3i.ma' + (route === '/' ? '/' : route)).sort();
  const sortedSitemapUrls = [...sitemapUrls].sort();
  if (sitemapUrls.some((url) => !url)) failures.push('sitemap.xml: one or more URL entries have no <loc>');
  if (new Set(sitemapUrls).size !== sitemapUrls.length) failures.push('sitemap.xml: duplicate canonical URLs found');
  if (JSON.stringify(sortedSitemapUrls) !== JSON.stringify(expectedUrls)) {
    const missing = expectedUrls.filter((url) => !sitemapUrls.includes(url));
    const extra = sitemapUrls.filter((url) => !expectedUrls.includes(url));
    failures.push('sitemap.xml: must contain exactly the curated indexable routes; missing [' + missing.join(', ') + '], extra [' + extra.join(', ') + ']');
  }
  const blocksByUrl = new Map(urlBlocks.map((block) => [((block.match(/<loc>([^<]+)<\/loc>/i) || [null, ''])[1]), block]));
  for (const slug of INDEXABLE_BLOG_SLUGS) {
    const route = '/blog/' + slug;
    const articleHtml = fs.readFileSync(fileFor(route), 'utf8');
    const modified = (articleHtml.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/i) || [null, ''])[1];
    const block = blocksByUrl.get('https://snay3i.ma' + route);
    if (!modified) failures.push(route + ': dateModified missing while validating sitemap lastmod');
    else if (!block || !block.includes('<lastmod>' + modified + '</lastmod>')) failures.push(route + ': sitemap lastmod does not match BlogPosting dateModified');
  }
}
if (!fs.existsSync(robotsPath)) {
  failures.push('robots.txt: file missing');
} else {
  const robotsText = fs.readFileSync(robotsPath, 'utf8');
  if (!/^\s*Sitemap:\s*https:\/\/snay3i\.ma\/sitemap\.xml\s*$/im.test(robotsText)) failures.push('robots.txt: canonical sitemap declaration missing');
}

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
  const h1 = route === '/'
    ? (((html.match(/<main[^>]*data-static-app-fallback=["']1["'][^>]*>[\s\S]*?<\/main>/i) || [''])[0].match(/<h1\b/gi) || []).length)
    : (html.match(/<h1\b/gi) || []).length;
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
  const missingAlt = images.filter((match) => !/\balt=["'][^"']+["']/i.test(match[1])).length;
  const missingDimensions = images.filter((match) => {
    const attrs = match[1];
    const explicit = /\bwidth=["']?\d+/i.test(attrs) && /\bheight=["']?\d+/i.test(attrs);
    const ratioReserved = /aspect-ratio\s*:/i.test(attrs);
    return !explicit && !ratioReserved;
  }).length;
  const hasServingAds = /adsbygoogle\.js|<ins\\b[^>]*class=["'][^"']*adsbygoogle/i.test(html);
  const min = route.startsWith('/blog/') ? 800 : (minimumWords[route] || 180);
  const isDarija = /-darija$/.test(route);
  let directoryUniqueHtml = '';
  if (route.startsWith('/artisan/')) {
    const uniqueMarker = 'data-directory-unique="1"';
    const markerAt = html.indexOf(uniqueMarker);
    const sectionStart = markerAt >= 0 ? html.lastIndexOf('<section', markerAt) : -1;
    const sectionEnd = markerAt >= 0 ? html.indexOf('</section>', markerAt) : -1;
    directoryUniqueHtml = sectionStart >= 0 && sectionEnd > sectionStart ? html.slice(sectionStart, sectionEnd + 10) : '';
  }
  const directoryUniqueText = decodeEntities(directoryUniqueHtml
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
  const similarityTokens = route.startsWith('/artisan/') ? tokenize(directoryUniqueText) : tokens;

  rows.push({ route, words: tokens.length, h1, images: images.length, missingAlt, missingDimensions, hasServingAds, shingles: shingles(similarityTokens) });

  if (!/^index\s*,\s*follow$/.test(robots)) failures.push(`${route}: robots is "${robots || 'missing'}"`);
  if (canonical !== `https://snay3i.ma${route === '/' ? '/' : route}`) failures.push(`${route}: canonical mismatch (${canonical || 'missing'})`);
  if (/[?#]/.test(canonical || '')) failures.push(`${route}: canonical contains query string or fragment`);
  if (!title) failures.push(`${route}: title missing`);
  if (!desc || desc.length < 70) failures.push(`${route}: meta description too weak/missing (${desc.length})`);
  if (h1 !== 1) failures.push(`${route}: expected exactly one H1 in primary content, found ${h1}`);
  if (tokens.length < min) failures.push(`${route}: only ${tokens.length} words; internal floor is ${min}`);
  if (missingAlt) failures.push(`${route}: ${missingAlt} image(s) missing meaningful alt text`);
  if (missingDimensions) failures.push(`${route}: ${missingDimensions} image(s) lack explicit dimensions/aspect-ratio and may contribute to layout shift`);
  if (isDarija) {
    if (!/<html[^>]*lang=["']ary["'][^>]*dir=["']rtl["']/i.test(html)) failures.push(`${route}: Darija page must expose html lang=ary dir=rtl`);
  } else if (!/lang=["']fr["']/i.test(html)) {
    failures.push(`${route}: html lang=fr missing`);
  }
  if (route.startsWith('/artisan/') && similarityTokens.length < 80) failures.push(`${route}: unique directory section is too weak (${similarityTokens.length} words)`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) failures.push(`${route}: viewport meta missing`);
  if (!/<meta\s+name=["']referrer["'][^>]*content=["']strict-origin-when-cross-origin["']/i.test(html)) failures.push(`${route}: referrer policy missing or too weak for consent messaging`);
  if (!adEligible.has(route) && hasServingAds) failures.push(`${route}: AdSense serving code present on non-editorial/trust route`);

  const stale = [...html.matchAll(/href=["'](\/(?:guides|a-propos|cgu|politique-de-confidentialite|seo)(?:\/[^"']*)?)["']/gi)].map((m) => m[1]);
  if (stale.length) failures.push(`${route}: stale internal route link(s): ${[...new Set(stale)].join(', ')}`);
  const oldBlog = [...html.matchAll(/href=["'](\/blog\/([^"'?#]+))["']/gi)]
    .filter((m) => !indexed.has(m[1]))
    .map((m) => m[1]);
  if (oldBlog.length) failures.push(`${route}: link(s) to retired blog page: ${[...new Set(oldBlog)].join(', ')}`);
}

console.log('=== SNAY3I FINAL INDEXABLE-SITE GATE ===');
console.log('Route | Words | H1 | Images | Missing alt | Missing dimensions | Ad serving');
for (const row of rows) console.log(`${row.route} | ${row.words} | ${row.h1} | ${row.images} | ${row.missingAlt} | ${row.missingDimensions} | ${row.hasServingAds ? 'YES' : 'NO'}`);

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

const blogIndexHtml = fs.readFileSync(fileFor('/blog'), 'utf8');
const blogSlugs = [...blogIndexHtml.matchAll(/href=["']\/blog\/([^"'?#/]+)\/?(?:[?#][^"']*)?["']/g)].map((match) => match[1]);
const uniqueBlogSlugs = [...new Set(blogSlugs)];
const retiredBlogSlugs = [...new Set(uniqueBlogSlugs.filter((slug) => !INDEXABLE_BLOG_SLUGS.includes(slug)))];
if (retiredBlogSlugs.length) failures.push('/blog: non-curated article links are visible: ' + retiredBlogSlugs.join(', '));
if (uniqueBlogSlugs.length !== INDEXABLE_BLOG_SLUGS.length || INDEXABLE_BLOG_SLUGS.some((slug) => !uniqueBlogSlugs.includes(slug))) {
  failures.push('/blog: expected exactly the six curated guides; found ' + uniqueBlogSlugs.length);
}
if (/plus de 100 artisans|tous nos artisans sont vérifiés|vérifiés dans 21 villes/i.test(blogIndexHtml)) {
  failures.push('/blog: unsupported historical directory claims remain');
}

const appSource = fs.readFileSync(path.join(process.cwd(), 'src', 'App.js'), 'utf8');
const publisherGuideSection = appSource.match(/<section data-publisher-guides="1"[\s\S]*?<\/section>/i);
if (!publisherGuideSection) {
  failures.push('homepage: publisher guide section missing from React source');
} else {
  const appGuideSlugs = [...publisherGuideSection[0].matchAll(/href=["']\/blog\/([^"'?#/]+)\/?(?:[?#][^"']*)?["']/g)].map((match) => match[1]);
  const uniqueAppGuideSlugs = [...new Set(appGuideSlugs)];
  const staleAppGuides = [...new Set(uniqueAppGuideSlugs.filter((slug) => !INDEXABLE_BLOG_SLUGS.includes(slug)))];
  if (staleAppGuides.length) failures.push('homepage: retired article link(s) in React guide section: ' + staleAppGuides.join(', '));
  if (uniqueAppGuideSlugs.length !== INDEXABLE_BLOG_SLUGS.length || INDEXABLE_BLOG_SLUGS.some((slug) => !uniqueAppGuideSlugs.includes(slug))) {
    failures.push('homepage: expected all six curated guides exactly once in the React guide section; found ' + uniqueAppGuideSlugs.length);
  }
}
const oldAppGuideLinks = [...appSource.matchAll(/href=["']\/blog\/([^"'?#/]+)\/?(?:[?#][^"']*)?["']/g)]
  .map((match) => match[1])
  .filter((slug) => !INDEXABLE_BLOG_SLUGS.includes(slug));
if (oldAppGuideLinks.length) failures.push('homepage: retired blog URLs remain elsewhere in React source: ' + [...new Set(oldAppGuideLinks)].join(', '));

const comparatorHtml = fs.readFileSync(fileFor('/outils/comparateur-devis'), 'utf8');
const comparatorScriptTags = comparatorHtml.match(/<\/?script\b[^>]*>/gi) || [];
let comparatorScriptDepth = 0;
let malformedComparatorScripts = false;
for (const tag of comparatorScriptTags) {
  if (/^<script\b/i.test(tag)) {
    if (comparatorScriptDepth !== 0) malformedComparatorScripts = true;
    comparatorScriptDepth += 1;
  } else {
    if (comparatorScriptDepth !== 1) malformedComparatorScripts = true;
    comparatorScriptDepth -= 1;
  }
}
if (malformedComparatorScripts || comparatorScriptDepth !== 0) failures.push('/outils/comparateur-devis: malformed or nested script tags');

for (const templateId of ['message-frais-deplacement', 'message-travaux-supplementaires']) {
  if (!comparatorHtml.includes(`id="${templateId}"`)) failures.push('/outils/comparateur-devis: missing copyable message ' + templateId);
  if (!comparatorHtml.includes(`data-copy-template="${templateId}"`)) failures.push('/outils/comparateur-devis: copy button missing for ' + templateId);
}
if (!/navigator\.clipboard\.writeText\(text\)/.test(comparatorHtml)) failures.push('/outils/comparateur-devis: clipboard action missing for message templates');
if (!/id="template-copy-status"[^>]*aria-live="polite"/.test(comparatorHtml)) failures.push('/outils/comparateur-devis: accessible copy feedback missing');
if (!/id="message-frais-deplacement"[^>]*>[\s\S]*?déplacement[\s\S]*?diagnostic/.test(comparatorHtml)) failures.push('/outils/comparateur-devis: pre-visit message does not clarify travel/diagnostic fees');
if (!/id="message-travaux-supplementaires"[^>]*>[\s\S]*?montant total supplémentaire[\s\S]*?travaux supplémentaires/.test(comparatorHtml)) failures.push('/outils/comparateur-devis: scope-change message missing written amount/scope clarification');

const feeQuestionsHtml = fs.readFileSync(fileFor('/blog/questions-avant-travaux-artisan-maroc'), 'utf8');
if (!/href="\/outils\/comparateur-devis">comparateur de devis Snay3i\.ma<\/a>/.test(feeQuestionsHtml)) {
  failures.push('/blog/questions-avant-travaux-artisan-maroc: fee worksheet comparator link must render as a real internal anchor');
}
if (!/"dateModified":"2026-10-24"/.test(feeQuestionsHtml) ||
    !/datetime="2026-10-24" data-date-modified="1">24 octobre 2026<\/time>/.test(feeQuestionsHtml)) {
  failures.push('/blog/questions-avant-travaux-artisan-maroc: visible modified date must match BlogPosting dateModified after the 24 October content update');
}

const reliabilityGuideHtml = fs.readFileSync(fileFor('/blog/guide-trouver-artisan-fiable-maroc'), 'utf8');
if (!/<div class="table-wrap"[^>]*><table><thead><tr>/.test(reliabilityGuideHtml) ||
    !reliabilityGuideHtml.includes('Information observée') ||
    !reliabilityGuideHtml.includes('Ce qu&#39;elle ne prouve pas')) {
  failures.push('/blog/guide-trouver-artisan-fiable-maroc: evidence ladder must render as a semantic table');
}
if (!/href="\/observatoire-artisans-maroc">snapshot actuel de l’annuaire et sa méthode<\/a>/.test(reliabilityGuideHtml)) {
  failures.push('/blog/guide-trouver-artisan-fiable-maroc: evidence ladder must link to the first-party directory snapshot');
}
if (!reliabilityGuideHtml.includes('36 fiches') ||
    !/"dateModified":"2026-10-24"/.test(reliabilityGuideHtml) ||
    !/datetime="2026-10-24" data-date-modified="1">24 octobre 2026<\/time>/.test(reliabilityGuideHtml)) {
  failures.push('/blog/guide-trouver-artisan-fiable-maroc: dated first-party snapshot and matching updated metadata must be present');
}

for (const route of ['/blog/questions-avant-travaux-artisan-maroc', '/blog/comparer-devis-travaux-maroc']) {
  const articleHtml = fs.readFileSync(fileFor(route), 'utf8');
  if (!/<div class="table-wrap"[^>]*><table><thead><tr>/.test(articleHtml)) {
    failures.push(route + ': comparison table is missing or was not rendered as semantic HTML');
  }
  if (!/<th scope="col">/.test(articleHtml) || !/<tbody>[\s\S]*?<\/tbody>/.test(articleHtml)) {
    failures.push(route + ': comparison table must include accessible column headings and body rows');
  }
}

if (failures.length) throw new Error(`[indexable gate] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[indexable gate] PASS: ${routes.length} indexable routes pass multilingual depth, metadata, robots/canonical, ad-placement, accessibility, layout-stability and overlap checks`);
