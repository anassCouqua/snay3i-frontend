const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS, INDEXABLE_SERVICE_CITY_ROUTES, CORE_ROUTES } = require('./site-curation-config');

const root = path.join(__dirname, '..');
const publicRoot = path.join(root, 'public');
const BASE = 'https://snay3i.ma';
const blogRoutes = INDEXABLE_BLOG_SLUGS.map((slug) => `/blog/${slug}`);
const routes = [...CORE_ROUTES, ...INDEXABLE_SERVICE_CITY_ROUTES, ...blogRoutes];

function fileFor(route) {
  return route === '/' ? path.join(publicRoot, 'index.html') : path.join(publicRoot, route.slice(1), 'index.html');
}
function decode(value='') {
  return String(value).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').trim();
}
function esc(value='') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function stripGenerated(html) {
  return html
    .replace(/\s*<script[^>]*data-snay3i-site-schema="1"[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script[^>]*data-snay3i-breadcrumb-schema="1"[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\s*<nav[^>]*data-snay3i-breadcrumbs="1"[^>]*>[\s\S]*?<\/nav>/gi, '');
}
function titleFor(html, route) {
  const h1 = decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]);
  if (h1) return h1;
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1]);
  return title || route;
}
function isDarijaHtml(html) { return /<html[^>]*lang=["']ary["'][^>]*dir=["']rtl["']/i.test(html); }
function labelFor(route, html) {
  if (route === '/blog') return 'Blog';
  if (route === '/about') return 'À propos';
  if (route === '/contact') return 'Contact';
  if (route === '/privacy') return 'Confidentialité';
  if (route === '/terms') return 'CGU';
  return titleFor(html, route);
}
function breadcrumbItems(route, html) {
  const darija = isDarijaHtml(html);
  const items = [{ name: darija ? 'الرئيسية' : 'Accueil', url: `${BASE}/` }];
  if (route.startsWith('/blog/')) items.push({ name: darija ? 'المدونة' : 'Blog', url: `${BASE}/blog` });
  items.push({ name: labelFor(route, html), url: `${BASE}${route}` });
  return items;
}

const homepage = fileFor('/');
if (!fs.existsSync(homepage)) throw new Error('[structured data] homepage missing');
let homeHtml = stripGenerated(fs.readFileSync(homepage, 'utf8'));
const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Snay3i.ma',
      url: `${BASE}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}/logo.png`,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@snay3i.ma',
        contactType: 'customer support',
        availableLanguage: ['fr', 'ar', 'ary'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: `${BASE}/`,
      name: 'Snay3i.ma',
      inLanguage: ['fr-MA', 'ary-MA'],
      publisher: { '@id': `${BASE}/#organization` },
    },
  ],
};
const siteTag = `<script type="application/ld+json" data-snay3i-site-schema="1">${JSON.stringify(siteGraph).replace(/</g, '\\u003c')}</script>`;
homeHtml = homeHtml.replace('</head>', `${siteTag}</head>`);
fs.writeFileSync(homepage, homeHtml, 'utf8');

for (const route of routes.filter((item) => item !== '/')) {
  const file = fileFor(route);
  if (!fs.existsSync(file)) throw new Error(`[structured data] indexable route missing: ${route}`);
  let html = stripGenerated(fs.readFileSync(file, 'utf8'));
  const darija = isDarijaHtml(html);
  const items = breadcrumbItems(route, html);

  const visible = `<nav aria-label="${darija ? 'مسار الصفحة' : 'Fil d’Ariane'}" data-snay3i-breadcrumbs="1" style="font-size:13px;line-height:1.5;margin:0 0 20px;color:#6f6a64;${darija ? 'direction:rtl;text-align:right' : ''}">${items.map((item, index) => {
    const last = index === items.length - 1;
    return last ? `<span aria-current="page">${esc(item.name)}</span>` : `<a href="${index === 0 ? '/' : new URL(item.url).pathname}">${esc(item.name)}</a><span aria-hidden="true"> › </span>`;
  }).join('')}</nav>`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  const schemaTag = `<script type="application/ld+json" data-snay3i-breadcrumb-schema="1">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  html = html.replace('</head>', `${schemaTag}</head>`);
  html = html.replace(/<main([^>]*)>/i, `<main$1>${visible}`);

  if (!/data-snay3i-breadcrumbs="1"/.test(html)) throw new Error(`[structured data] visible breadcrumbs missing: ${route}`);
  if (!/"@type":"BreadcrumbList"/.test(html)) throw new Error(`[structured data] BreadcrumbList missing: ${route}`);
  fs.writeFileSync(file, html, 'utf8');
}

if (/"@type":"LocalBusiness"/.test(homeHtml)) throw new Error('[structured data] homepage must not claim LocalBusiness');
console.log(`[structured data] PASS: multilingual Organization/WebSite identity added; localized visible + schema breadcrumbs added to ${routes.length - 1} indexable interior routes`);
