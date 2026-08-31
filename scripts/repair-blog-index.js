const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const indexFile = path.join(blogRoot, 'index.html');

const INDEXABLE = [
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'climatisation-maroc-installation',
  'serrurier-autour-de-moi-maroc',
  'choisir-carreleur-maroc',
  'macon-construction-maroc',
  'urgence-plomberie-casablanca',
];

function get(html, re) { return (html.match(re) || [,''])[1].replace(/<[^>]+>/g,'').trim(); }
function escapeHtml(v) { return v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

if (!fs.existsSync(indexFile)) throw new Error('Blog index is missing');

const cards = INDEXABLE.map((slug) => {
  const file = path.join(blogRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[blog index] Missing canonical article: ${slug}`);
  const html = fs.readFileSync(file, 'utf8');
  const title = get(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || slug;
  const desc = get(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i);
  return `<div class="card"><h3><a href="/blog/${slug}">${escapeHtml(title)}</a></h3><p>${escapeHtml(desc)}</p></div>`;
}).join('\n');

let html = fs.readFileSync(indexFile,'utf8');
const start = html.indexOf('<h2>Guides à lire</h2>');
if (start === -1) throw new Error('[blog index] Guides à lire section missing');
const cardsStart = html.indexOf('<div class="card">', start);
const sectionEnd = html.indexOf('</section>', cardsStart);
if (cardsStart === -1 || sectionEnd === -1) throw new Error('[blog index] Card section boundaries missing');
html = html.slice(0, cardsStart) + cards + '\n' + html.slice(sectionEnd);
fs.writeFileSync(indexFile, html, 'utf8');
console.log(`[blog index] rebuilt ${INDEXABLE.length} canonical guide cards from real files`);
