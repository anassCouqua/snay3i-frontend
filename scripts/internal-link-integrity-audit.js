const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS, CORE_ROUTES } = require('./site-curation-config');
const root = path.join(__dirname, '..');
const publicRoot = path.join(root, 'public');
const routeFile = (route) => route === '/' ? path.join(publicRoot,'index.html') : path.join(publicRoot,route.slice(1),'index.html');
const curated = [...CORE_ROUTES, ...INDEXABLE_BLOG_SLUGS.map(s=>'/blog/'+s)];
const failures = [];
for (const route of curated) {
  const file = routeFile(route);
  if (!fs.existsSync(file)) { failures.push(route+': source file missing'); continue; }
  const html = fs.readFileSync(file,'utf8');
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m=>m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const clean = href.split('#')[0].split('?')[0].replace(/\/$/,'') || '/';
    if (/\.(?:png|webp|jpg|jpeg|svg|ico|xml|txt)$/i.test(clean)) continue;
    const target = routeFile(clean);
    if (fs.existsSync(target)) continue;
    if (clean === '/rejoindre') continue;
    failures.push(route+' -> '+href+': internal target missing');
  }
}
const unique=[...new Set(failures)];
if(unique.length) throw new Error('[internal links] BLOCKED ('+unique.length+'):\n'+unique.join('\n'));
console.log('[internal links] PASS: '+curated.length+' curated routes have no broken internal HTML links');
