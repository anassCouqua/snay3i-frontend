const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexFile = path.join(root, 'public', 'index.html');
const notFoundFile = path.join(root, 'public', '404.html');
const vercelFile = path.join(root, 'vercel.json');
const failures = [];

for (const file of [indexFile, notFoundFile, vercelFile]) if (!fs.existsSync(file)) failures.push(`missing ${path.relative(root,file)}`);
if (failures.length) throw new Error(`[routing/rendering] BLOCKED:\n${failures.join('\n')}`);

const indexHtml = fs.readFileSync(indexFile, 'utf8');
const noscript = (indexHtml.match(/<noscript>([\s\S]*?)<\/noscript>/i) || [,''])[1];
const text = noscript.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ').replace(/\s+/g,' ').trim();
const words = text.match(/[A-Za-zÀ-ÿ0-9'-]+/g) || [];
if (!/<h1\b/i.test(noscript)) failures.push('homepage raw response fallback has no H1');
if ((noscript.match(/<h2\b/gi) || []).length < 3) failures.push('homepage raw response fallback has fewer than 3 H2 sections');
if (words.length < 220) failures.push(`homepage raw response fallback is only ${words.length} words (internal floor 220)`);
if (!/href="\/about"/i.test(noscript) || !/href="\/privacy"/i.test(noscript) || !/href="\/terms"/i.test(noscript) || !/href="\/contact"/i.test(noscript)) failures.push('homepage raw response fallback lacks core trust links');

const notFound = fs.readFileSync(notFoundFile, 'utf8');
if (!/<meta\s+name="robots"\s+content="noindex,follow"/i.test(notFound)) failures.push('404 page is not noindex,follow');

const vercel = JSON.parse(fs.readFileSync(vercelFile, 'utf8'));
const routes = Array.isArray(vercel.routes) ? vercel.routes : [];
const filesystemIndex = routes.findIndex((r) => r && r.handle === 'filesystem');
const catchallIndex = routes.findIndex((r) => r && r.src === '/.*' && Number(r.status) === 404 && r.dest === '/404.html');
if (filesystemIndex < 0) failures.push('vercel routing has no filesystem handle');
if (catchallIndex < 0) failures.push('vercel routing has no real 404 catch-all');
if (filesystemIndex >= 0 && catchallIndex >= 0 && catchallIndex < filesystemIndex) failures.push('404 catch-all appears before filesystem handling');

for (const routePath of ['/rejoindre', '/rejoindre/']) {
  const route = routes.find((r) => r && r.src === routePath);
  if (!route) {
    failures.push(`${routePath}: legitimate SPA route is not preserved before 404 catch-all`);
    continue;
  }
  if (route.dest !== '/index.html') failures.push(`${routePath}: expected rewrite to /index.html`);
  const xRobots = route.headers && (route.headers['X-Robots-Tag'] || route.headers['x-robots-tag']);
  if (!xRobots || !/noindex/i.test(xRobots)) failures.push(`${routePath}: SPA acquisition route must be noindex`);
  const routeIndex = routes.indexOf(route);
  if (catchallIndex >= 0 && routeIndex > catchallIndex) failures.push(`${routePath}: route appears after 404 catch-all`);
}

if (failures.length) throw new Error(`[routing/rendering] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[routing/rendering] PASS: homepage exposes ${words.length} raw fallback words with trust links; /rejoindre remains functional and noindex; unknown routes are configured for HTTP 404 + noindex`);
