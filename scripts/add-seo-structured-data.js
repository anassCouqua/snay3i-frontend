const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const BASE = 'https://snay3i.ma';

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const escJson = (value) => JSON.stringify(String(value ?? ''));

const titleFrom = (html) => html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
const descriptionFrom = (html) => html.match(/<meta name="description" content="([\s\S]*?)">/i)?.[1] || '';
const canonicalFrom = (html) => html.match(/<link rel="canonical" href="([\s\S]*?)">/i)?.[1] || BASE;

const routeFromFile = (file) => {
  const relative = path.relative(root, file).split(path.sep).join('/');
  return relative === 'index.html' ? '/' : `/${relative.slice(0, -'/index.html'.length)}`;
};

if (!fs.existsSync(root)) throw new Error('SEO source directory is missing');

let updated = 0;
for (const file of walk(root).filter((f) => f.endsWith('/index.html') || path.basename(f) === 'index.html')) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-snay3i-structured="1"')) continue;

  const route = routeFromFile(file);
  const title = titleFrom(html);
  const description = descriptionFrom(html);
  const canonical = canonicalFrom(html);
  const parts = route.split('/').filter(Boolean);
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE + '/' }
  ];

  let position = 2;
  if (parts[0] === 'artisan' && parts.length >= 2) {
    breadcrumbItems.push({ '@type': 'ListItem', position: position++, name: 'Artisans', item: `${BASE}/` });
    breadcrumbItems.push({ '@type': 'ListItem', position: position++, name: title.replace(/\s+—\s+Snay3i\.ma.*$/, ''), item: canonical });
  } else if (parts[0] === 'blog') {
    breadcrumbItems.push({ '@type': 'ListItem', position: position++, name: 'Blog', item: `${BASE}/blog` });
    if (parts.length > 1) breadcrumbItems.push({ '@type': 'ListItem', position: position++, name: title.replace(/\s+—\s+Snay3i\.ma.*$/, ''), item: canonical });
  } else if (route !== '/') {
    breadcrumbItems.push({ '@type': 'ListItem', position: position, name: title.replace(/\s+—\s+Snay3i\.ma.*$/, ''), item: canonical });
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#website`, url: `${BASE}/`, name: 'Snay3i.ma' },
        inLanguage: 'fr'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      }
    ]
  };

  const json = JSON.stringify(graph).replace(/<\//g, '<\\/');
  const script = `<script type="application/ld+json" data-snay3i-structured="1">${json}</script>`;
  html = html.replace('</head>', `${script}\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`Structured data enriched on ${updated} SEO pages`);
