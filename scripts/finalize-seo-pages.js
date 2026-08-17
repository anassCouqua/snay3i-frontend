const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');
const seoDir = path.join(buildDir, 'seo');
const staticJsDir = path.join(buildDir, 'static', 'js');
const staticCssDir = path.join(buildDir, 'static', 'css');

if (!fs.existsSync(seoDir) || !fs.existsSync(staticJsDir)) {
  throw new Error('Build output or SEO pages are missing');
}

const mainJs = fs.readdirSync(staticJsDir).find((name) => /^main\..+\.js$/.test(name));
const mainCss = fs.existsSync(staticCssDir)
  ? fs.readdirSync(staticCssDir).find((name) => /^main\..+\.css$/.test(name))
  : null;

if (!mainJs) throw new Error('Main JS bundle not found');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

for (const file of walk(seoDir).filter((f) => f.endsWith('.html'))) {
  let html = fs.readFileSync(file, 'utf8');
  const bootstrap = [
    mainCss ? `<link rel="stylesheet" href="/static/css/${mainCss}">` : '',
    `<script defer src="/static/js/${mainJs}"></script>`
  ].join('');
  html = html.replace('</head>', `${bootstrap}</head>`);
  fs.writeFileSync(file, html, 'utf8');
}

console.log(`Finalized ${walk(seoDir).filter((f) => f.endsWith('.html')).length} crawlable pages with the production React bundle`);
