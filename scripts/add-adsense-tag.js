const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const tag = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script>';
const excludedRoutes = new Set(['privacy', 'terms', 'contact']);

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
};

for (const file of walk(root).filter((file) => file.endsWith('.html'))) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const route = relative.replace(/\/index\.html$/, '').split('/')[0];
  if (excludedRoutes.has(route)) continue;

  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) continue;
  const next = html.replace('</head>', `  ${tag}\n</head>`);
  if (next !== html) fs.writeFileSync(file, next, 'utf8');
}
