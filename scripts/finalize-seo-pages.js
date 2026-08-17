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

const bootstrap = [
  mainCss ? `<link rel="stylesheet" href="/static/css/${mainCss}">` : '',
  `<script defer src="/static/js/${mainJs}"></script>`
].join('');

const copyRecursive = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
};

const seoFiles = walk(seoDir).filter((f) => f.endsWith('.html'));
for (const file of seoFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace('</head>', `${bootstrap}</head>`);
  fs.writeFileSync(file, html, 'utf8');
}

// Keep the nested canonical tree for debugging/backward compatibility.
copyRecursive(seoDir, buildDir);

// Also publish flat HTML artifacts. This avoids directory-index resolution differences
// across CRA/Vercel routing and lets clean SEO URLs map to explicit static files.
for (const file of seoFiles) {
  const relative = path.relative(seoDir, file).split(path.sep).join('/');
  if (!relative.endsWith('/index.html')) continue;

  const routeParts = relative.split('/');
  routeParts.pop(); // index.html

  let flatName;
  if (routeParts.length === 0) {
    flatName = 'home.html';
  } else if (routeParts[0] === 'artisan' && routeParts.length === 3) {
    flatName = `artisan-${routeParts[1]}-${routeParts[2]}.html`;
  } else if (routeParts[0] === 'blog' && routeParts.length === 1) {
    flatName = 'blog.html';
  } else if (routeParts[0] === 'blog' && routeParts.length === 2) {
    flatName = `blog-${routeParts[1]}.html`;
  } else if (routeParts.length === 1) {
    flatName = `${routeParts[0]}.html`;
  } else {
    continue;
  }

  fs.copyFileSync(file, path.join(buildDir, flatName));
}

console.log(`Finalized ${seoFiles.length} crawlable pages and exposed canonical plus flat static artifacts`);
