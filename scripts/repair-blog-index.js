const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS: INDEXABLE } = require('./site-curation-config');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const indexFile = path.join(blogRoot, 'index.html');

function get(html, re) { return (html.match(re) || [,''])[1].replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").trim(); }
function firstArticleParagraph(html) {
  const article = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || [,''])[1];
  const ps = [...article.matchAll(/<p([^>]*)>([\s\S]*?)<\/p>/gi)]
    .filter(m => !/data-snay3i-byline=["']1["']/i.test(m[1]) && !/class=["'][^"']*\bmeta\b/i.test(m[1]))
    .map(m => get(m[2], /([\s\S]+)/))
    .filter(t => t && !/^Guide Snay3i\.ma/i.test(t) && !/^Rédaction Snay3i\.ma/i.test(t));
  return ps.find(t => t.length >= 60) || '';
}
function escapeHtml(v) { return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function heroImage(html) {
  const cover = (html.match(/<figure[^>]*data-snay3i-article-cover=["']1["'][^>]*>([\s\S]*?)<\/figure>/i) || [,''])[1];
  const src = (cover.match(/<img[^>]*src=["']([^"']+)["']/i) || [,''])[1];
  return src;
}

if (!fs.existsSync(indexFile)) throw new Error('Blog index is missing');

const cards = INDEXABLE.map((slug) => {
  const file = path.join(blogRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[blog index] Missing canonical article: ${slug}`);
  const articleHtml = fs.readFileSync(file, 'utf8');
  const title = get(articleHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || slug;
  const desc = firstArticleParagraph(articleHtml);
  const image = heroImage(articleHtml);
  if (!desc) throw new Error(`[blog index] Missing substantive article summary: ${slug}`);
  if (!image) throw new Error(`[blog index] Missing article hero image: ${slug}`);
  return `<div class="card"><a class="card-image-link" href="/blog/${slug}" aria-label="Lire : ${escapeHtml(title)}"><img class="card-thumb" src="${escapeHtml(image)}" alt="Illustration — ${escapeHtml(title)}" loading="lazy" width="640" height="360"></a><div class="card-body"><h3><a href="/blog/${slug}">${escapeHtml(title)}</a></h3><p>${escapeHtml(desc)}</p><p class="card-read"><a href="/blog/${slug}">Lire le guide →</a></p></div></div>`;
}).join('\n');

let html = fs.readFileSync(indexFile,'utf8');
const styleAddon = `.card{display:grid;grid-template-columns:180px minmax(0,1fr);gap:18px;align-items:start;padding:20px 0;border-top:1px solid #eee5da}.card:first-child{border-top:0}.card-thumb{display:block;width:180px;height:112px;object-fit:cover;border-radius:13px;border:1px solid #e8e0d4}.card-body h3{margin-top:0}.card-read{font-weight:700;margin-top:10px!important}@media(max-width:640px){.card{grid-template-columns:1fr}.card-thumb{width:100%;height:auto;aspect-ratio:16/9}}`;
if (!html.includes('.card-thumb{')) html = html.replace('</style>', `${styleAddon}\n</style>`);

const start = html.indexOf('<h2>Guides à lire</h2>');
if (start === -1) throw new Error('[blog index] Guides à lire section missing');
const cardsStart = html.indexOf('<div class="card">', start);
const sectionEnd = html.indexOf('</section>', cardsStart);
if (cardsStart === -1 || sectionEnd === -1) throw new Error('[blog index] Card section boundaries missing');
html = html.slice(0, cardsStart) + cards + '\n' + html.slice(sectionEnd);
fs.writeFileSync(indexFile, html, 'utf8');
console.log(`[blog index] rebuilt ${INDEXABLE.length} canonical guide cards with article-derived summaries and relevant hero thumbnails`);
