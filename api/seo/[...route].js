const fs = require('fs');
const path = require('path');

const pages = (() => {
  try { return require('../seo-pages.json'); } catch { return {}; }
})();

function cleanParts(value) {
  const parts = Array.isArray(value) ? value : String(value || '').split('/');
  const cleaned = parts.filter(Boolean).map(decodeURIComponent);
  if (cleaned.some((p) => p === '..' || p === '.' || p.includes('\\'))) return null;
  return cleaned;
}

module.exports = function handler(req, res) {
  const parts = cleanParts(req.query?.route);
  if (!parts) {
    res.status(400).setHeader('Content-Type', 'text/plain; charset=utf-8').end('Bad route');
    return;
  }

  const route = '/' + parts.join('/');
  let html = pages[route];

  if (!html) {
    const file = path.join(process.cwd(), 'public', 'seo', ...parts, 'index.html');
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
