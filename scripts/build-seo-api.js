const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'public', 'seo');
const apiDir = path.join(process.cwd(), 'api');
const outputFile = path.join(apiDir, 'seo-pages.json');

if (!fs.existsSync(sourceDir)) {
  throw new Error('SEO source directory is missing');
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const pages = {};

for (const file of walk(sourceDir).filter((f) => f.endsWith('.html'))) {
  const relative = path.relative(sourceDir, file).split(path.sep).join('/');
  if (!relative.endsWith('/index.html') && relative !== 'index.html') continue;

  const route = relative === 'index.html'
    ? '/'
    : `/${relative.slice(0, -'/index.html'.length)}`;

  pages[route] = fs.readFileSync(file, 'utf8');
}

fs.mkdirSync(apiDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(pages), 'utf8');

console.log(`Prepared ${Object.keys(pages).length} SEO pages for the Vercel HTML handler`);
