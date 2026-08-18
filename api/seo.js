const fs = require('fs');
const path = require('path');
const pages = (() => {
  try {
    return require('./seo-pages.json');
  } catch {
    return {};
  }
})();

const safeRoute = (value) => {
  const decoded = decodeURIComponent(String(value || '/'));
  if (!decoded.startsWith('/') || decoded.includes('..') || decoded.includes('\\')) return null;
  return decoded.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
};

module.exports = function handler(req, res) {
  const queryRoute = Array.isArray(req.query?.route) ? req.query.route[0] : req.query?.route;
  const urlRoute = req.url ? new URL(req.url, 'https://snay3i.ma').searchParams.get('route') : null;
  const route = safeRoute(queryRoute || urlRoute || '/');

  if (!route) {
    res.status(400).setHeader('Content-Type', 'text/plain; charset=utf-8').end('Bad route');
    return;
  }

  let html = pages[route];

  if (!html) {
    const relative = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`;
    const file = path.join(process.cwd(), 'public', 'seo', relative);
    if (fs.existsSync(file)) html = fs.readFileSync(file, 'utf8');
  }

  if (!html) {
    res.status(404).setHeader('Content-Type', 'text/plain; charset=utf-8').end('Not found');
    return;
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(html);
};
