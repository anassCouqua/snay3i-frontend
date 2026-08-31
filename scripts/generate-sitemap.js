const fs = require('fs');
const path = require('path');
const {
  INDEXABLE_BLOG_SLUGS,
  INDEXABLE_SERVICE_CITY_ROUTES,
  CORE_ROUTES,
} = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public');
const output = path.join(publicRoot, 'sitemap.xml');
const BASE = 'https://snay3i.ma';

if (!fs.existsSync(publicRoot)) throw new Error('Public directory is missing');

const routeFile = (route) => route === '/' ? path.join(publicRoot, 'index.html') : path.join(publicRoot, route.slice(1), 'index.html');
const ensureRoute = (route) => {
  const file = routeFile(route);
  if (!fs.existsSync(file)) throw new Error(`[sitemap] curated route does not exist: ${route}`);
  return file;
};
const setRobots = (file, desired) => {
  let html = fs.readFileSync(file, 'utf8');
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${desired}">`);
  else html = html.replace('</head>', `<meta name="robots" content="${desired}">\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
};

const blogRoutes = INDEXABLE_BLOG_SLUGS.map((slug) => `/blog/${slug}`);
const allRoutes = [...CORE_ROUTES, ...INDEXABLE_SERVICE_CITY_ROUTES, ...blogRoutes];

for (const route of allRoutes) setRobots(ensureRoute(route), 'index,follow');

const priority = (route) => route === '/' ? '1.0' : route === '/blog' ? '0.8' : route.startsWith('/artisan/') ? '0.6' : route.startsWith('/blog/') ? '0.7' : '0.5';
const changefreq = (route) => route === '/' ? 'weekly' : (route === '/blog' || route.startsWith('/artisan/')) ? 'weekly' : 'monthly';
const urls = [...new Set(allRoutes)]
  .sort()
  .map((route) => `  <url><loc>${BASE}${route}</loc><changefreq>${changefreq(route)}</changefreq><priority>${priority(route)}</priority></url>`)
  .join('\n');

fs.writeFileSync(output, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
console.log(`Generated canonical sitemap with ${allRoutes.length} verified routes, ${INDEXABLE_SERVICE_CITY_ROUTES.length} curated service-city pages and ${INDEXABLE_BLOG_SLUGS.length} curated blog guides`);
