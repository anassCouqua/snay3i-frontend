const fs = require('fs');
const path = require('path');

const publicRoot = path.join(process.cwd(), 'public');
const output = path.join(publicRoot, 'sitemap.xml');
const BASE = 'https://snay3i.ma';

if (!fs.existsSync(publicRoot)) throw new Error('Public directory is missing');

const INDEXABLE_BLOG_SLUGS = [
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'climatisation-maroc-installation',
  'serrurier-autour-de-moi-maroc',
  'choisir-carreleur-maroc',
  'macon-construction-maroc',
  'urgence-plomberie-casablanca',
];

const INDEXABLE_SERVICE_CITY_ROUTES = [
  '/artisan/plombier/casablanca',
  '/artisan/plombier/rabat',
  '/artisan/electricien/casablanca',
  '/artisan/electricien/rabat',
  '/artisan/macon/casablanca',
  '/artisan/peintre/casablanca',
  '/artisan/menuisier/casablanca',
  '/artisan/climatisation/casablanca',
  '/artisan/serrurier/casablanca',
  '/artisan/carreleur/casablanca',
];

const CORE_ROUTES = ['/', '/about', '/blog', '/contact', '/privacy', '/terms'];

const routeFile = (route) => {
  if (route === '/') return path.join(publicRoot, 'index.html');
  return path.join(publicRoot, route.slice(1), 'index.html');
};

const ensureRoute = (route) => {
  const file = routeFile(route);
  if (!fs.existsSync(file)) throw new Error(`[sitemap] curated route does not exist: ${route}`);
  return file;
};

const setRobots = (file, desired) => {
  let html = fs.readFileSync(file, 'utf8');
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${desired}">`);
  } else {
    html = html.replace('</head>', `<meta name="robots" content="${desired}">\n</head>`);
  }
  fs.writeFileSync(file, html, 'utf8');
};

const blogRoutes = INDEXABLE_BLOG_SLUGS.map((slug) => `/blog/${slug}`);
const allRoutes = [...CORE_ROUTES, ...INDEXABLE_SERVICE_CITY_ROUTES, ...blogRoutes];

for (const route of blogRoutes) setRobots(ensureRoute(route), 'index,follow');
for (const route of INDEXABLE_SERVICE_CITY_ROUTES) setRobots(ensureRoute(route), 'index,follow');

// Everything else under canonical blog/service roots remains crawlable but out of the index.
for (const root of ['blog', 'artisan']) {
  const base = path.join(publicRoot, root);
  if (!fs.existsSync(base)) continue;
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const route = `/${root}/${entry.name}`;
    const file = path.join(base, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    if (!allRoutes.includes(route)) setRobots(file, 'noindex,follow');
  }
}

const priority = (route) => {
  if (route === '/') return '1.0';
  if (route === '/blog') return '0.8';
  if (route.startsWith('/artisan/')) return '0.6';
  if (route.startsWith('/blog/')) return '0.7';
  return '0.5';
};

const changefreq = (route) => {
  if (route === '/') return 'weekly';
  if (route === '/blog' || route.startsWith('/artisan/')) return 'weekly';
  return 'monthly';
};

const urls = [...new Set(allRoutes)]
  .sort()
  .map((route) => `  <url><loc>${BASE}${route}</loc><changefreq>${changefreq(route)}</changefreq><priority>${priority(route)}</priority></url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(output, xml, 'utf8');
console.log(`Generated curated sitemap with ${allRoutes.length} verified routes and ${INDEXABLE_BLOG_SLUGS.length} curated blog guides`);