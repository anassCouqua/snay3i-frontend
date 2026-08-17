const pages = require('./seo-pages.json');

module.exports = function handler(req, res) {
  const rawRoute = Array.isArray(req.query?.route) ? req.query.route[0] : req.query?.route;
  const route = rawRoute ? decodeURIComponent(String(rawRoute)) : '/';
  const html = pages[route];

  if (!html) {
    res.status(404).setHeader('Content-Type', 'text/plain; charset=utf-8').end('Not found');
    return;
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(html);
};
