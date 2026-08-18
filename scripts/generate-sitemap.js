const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const output = path.join(process.cwd(), 'public', 'sitemap.xml');
const BASE = 'https://snay3i.ma';

if (!fs.existsSync(root)) throw new Error('SEO source directory is missing');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const routes = new Set(['/']);

for (const file of walk(root).filter((f) => f.endsWith('/index.html') || path.basename(f) === 'index.html')) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const route = relative === 'index.html'
    ? '/'
    : `/${relative.slice(0, -'/index.html'.length)}`;
  routes.add(route);
}

const priority = (route) => {
  if (route === '/') return '1.0';
  if (route === '/blog') return '0.8';
  if (route.startsWith('/artisan/')) return '0.6';
  if (route.startsWith('/blog/')) return '0.6';
  return '0.5';
};

const changefreq = (route) => {
  if (route === '/') return 'weekly';
  if (route === '/blog' || route.startsWith('/artisan/')) return 'weekly';
  return 'monthly';
};

const urls = [...routes].sort().map((route) => `  <url><loc>${BASE}${route}</loc><changefreq>${changefreq(route)}</changefreq><priority>${priority(route)}</priority></url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(output, xml, 'utf8');
console.log(`Generated sitemap with ${routes.size} URLs`);
