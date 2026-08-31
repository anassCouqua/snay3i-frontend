const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS, INDEXABLE_SERVICE_CITY_ROUTES, CORE_ROUTES } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public');
const blogRoutes = INDEXABLE_BLOG_SLUGS.map((slug) => `/blog/${slug}`);
const routes = [...CORE_ROUTES, ...INDEXABLE_SERVICE_CITY_ROUTES, ...blogRoutes];
const guideSet = new Set(blogRoutes);
const failures = [];

function fileFor(route) {
  return route === '/' ? path.join(publicRoot, 'index.html') : path.join(publicRoot, route.slice(1), 'index.html');
}
function decode(text='') {
  return String(text)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&[a-z0-9#]+;/gi, ' ');
}
function wordsFrom(html) {
  return (decode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []).length;
}
function metaDescription(html) {
  return ((html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || html.match(/<meta\s+content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i) || [,''])[1] || '').trim();
}

for (const route of routes) {
  const file = fileFor(route);
  if (!fs.existsSync(file)) {
    failures.push(`${route}: missing raw HTML file`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const isDarija = /<html[^>]*lang=["']ary["'][^>]*dir=["']rtl["']/i.test(html);
  const title = ((html.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1] || '').trim();
  const desc = metaDescription(html);
  const h1Count = route === '/'
    ? ((html.match(/<noscript[\s\S]*?<h1\b/gi) || []).length)
    : (html.match(/<h1\b/gi) || []).length;

  if (!title) failures.push(`${route}: <title> missing from raw HTML`);
  if (!desc) failures.push(`${route}: meta description missing from raw HTML`);
  if (h1Count !== 1) failures.push(`${route}: expected one raw H1, found ${h1Count}`);

  if (route === '/') {
    const noscript = (html.match(/<noscript[^>]*>([\s\S]*?)<\/noscript>/i) || [,''])[1];
    const wordCount = wordsFrom(noscript);
    if (wordCount < 300) failures.push(`/: raw static fallback only ${wordCount} words; internal robustness floor is 300`);
    if (!/data-snay3i-site-schema="1"/.test(html)) failures.push('/: site identity schema marker missing');
    if (!/"@type":"Organization"/.test(html)) failures.push('/: Organization schema missing');
    if (!/"@type":"WebSite"/.test(html)) failures.push('/: WebSite schema missing');
    if (/"@type":"LocalBusiness"/.test(html)) failures.push('/: misleading LocalBusiness schema present');
    if (!/contact@snay3i\.ma/.test(html)) failures.push('/: Organization contact email missing');
  } else {
    if (!/<nav[^>]*data-snay3i-breadcrumbs="1"/i.test(html)) failures.push(`${route}: visible breadcrumb trail missing`);
    if (!/data-snay3i-breadcrumb-schema="1"/.test(html) || !/"@type":"BreadcrumbList"/.test(html)) failures.push(`${route}: BreadcrumbList schema missing`);
    if (isDarija && !/aria-label="مسار الصفحة"/.test(html)) failures.push(`${route}: Darija breadcrumb label not localized`);
  }

  if (guideSet.has(route)) {
    const required = [
      ['BlogPosting', /"@type":"BlogPosting"/],
      ['datePublished', /"datePublished":"\d{4}-\d{2}-\d{2}"/],
      ['dateModified', /"dateModified":"\d{4}-\d{2}-\d{2}"/],
      ['author', /"author":\{"@type":"Organization","name":"Rédaction Snay3i\.ma"/],
      ['publisher logo', /"logo":\{"@type":"ImageObject","url":"https:\/\/snay3i\.ma\/logo\.png"\}/],
      ['mainEntityOfPage', /"mainEntityOfPage":\{"@type":"WebPage","@id":"https:\/\/snay3i\.ma\/blog\//],
      ['visible published date', /data-date-published="1"/],
      ['visible modified date', /data-date-modified="1"/],
      ['language', isDarija ? /"inLanguage":"ary-MA"/ : /"inLanguage":"fr-MA"/],
    ];
    for (const [label, re] of required) if (!re.test(html)) failures.push(`${route}: ${label} missing`);
  }
}

if (failures.length) throw new Error(`[structured data audit] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[structured data audit] PASS: ${routes.length} indexable raw HTML routes have core metadata/H1; homepage has 300+ static words + Organization/WebSite; ${routes.length - 1} interior routes have localized breadcrumbs; ${INDEXABLE_BLOG_SLUGS.length} guides have complete language-aware BlogPosting schema`);
