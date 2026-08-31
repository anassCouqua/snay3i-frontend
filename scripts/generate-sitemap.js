const fs = require('fs');
const path = require('path');

const publicRoot = path.join(process.cwd(), 'public');
const output = path.join(publicRoot, 'sitemap.xml');
const BASE = 'https://snay3i.ma';

if (!fs.existsSync(publicRoot)) throw new Error('Public directory is missing');

// Curated editorial set: only pages that really exist under /public/blog/ are allowed.
const INDEXABLE_BLOG_SLUGS = new Set([
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'climatisation-maroc-installation',
  'serrurier-autour-de-moi-maroc',
  'choisir-carreleur-maroc',
  'macon-construction-maroc',
  'urgence-plomberie-casablanca',
]);

const INDEXABLE_SERVICE_CITY_ROUTES = new Set([
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
]);

const walk = (dir, skip = new Set()) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.isDirectory() && skip.has(entry.name)) return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full, skip) : [full];
});

const setRobots = (file, desired) => {
  let html = fs.readFileSync(file, 'utf8');
  if (/<meta name="robots" content="[^"]*">/i.test(html)) {
    html = html.replace(/<meta name="robots" content="[^"]*">/i, `<meta name="robots" content="${desired}">`);
  } else {
    html = html.replace('</head>', `<meta name="robots" content="${desired}">\n</head>`);
  }
  fs.writeFileSync(file, html, 'utf8');
};

const routes = new Set(['/']);

for (const file of walk(publicRoot, new Set(['seo'])).filter((f) => f.endsWith('/index.html'))) {
  const relative = path.relative(publicRoot, file).split(path.sep).join('/');
  const route = relative === 'index.html'
    ? '/'
    : `/${relative.slice(0, -'/index.html'.length)}`;

  if (route.startsWith('/blog/')) {
    const slug = route.slice('/blog/'.length);
    const indexable = INDEXABLE_BLOG_SLUGS.has(slug);
    setRobots(file, indexable ? 'index,follow' : 'noindex,follow');
    if (!indexable) continue;
  }

  if (route.startsWith('/artisan/')) {
    const indexable = INDEXABLE_SERVICE_CITY_ROUTES.has(route);
    setRobots(file, indexable ? 'index,follow' : 'noindex,follow');
    if (!indexable) continue;
  }

  routes.add(route);
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

const urls = [...routes]
  .sort()
  .map((route) => `  <url><loc>${BASE}${route}</loc><changefreq>${changefreq(route)}</changefreq><priority>${priority(route)}</priority></url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(output, xml, 'utf8');
console.log(`Generated canonical sitemap with ${routes.size} URLs and ${INDEXABLE_BLOG_SLUGS.size} curated blog guides`);