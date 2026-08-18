const fs = require('fs');
const path = require('path');

const sourceRoot = path.join(process.cwd(), 'public', 'seo');
const apiDir = path.join(process.cwd(), 'api');
const output = path.join(apiDir, 'seo-pages.json');

if (!fs.existsSync(sourceRoot)) {
  throw new Error('public/seo does not exist; generate SEO pages before building the page map');
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const pages = {};
for (const file of walk(sourceRoot).filter((f) => f.endsWith('index.html'))) {
  const relative = path.relative(sourceRoot, file).split(path.sep).join('/');
  const parts = relative.split('/');
  parts.pop();
  const route = parts.length ? `/${parts.join('/')}` : '/';
  pages[route] = fs.readFileSync(file, 'utf8');
}

fs.mkdirSync(apiDir, { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(pages)}\n`, 'utf8');
console.log(`SEO runtime page map generated: ${Object.keys(pages).length} routes`);
