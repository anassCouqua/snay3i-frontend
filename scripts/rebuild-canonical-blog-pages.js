const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceFile = path.join(root, 'src', 'Blog.js');
const blogRoot = path.join(root, 'public', 'blog');

const CANONICAL = [
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'renovation-maison-maroc-guide',
  'climatisation-maroc-installation',
  'serrurier-urgence-maroc',
  'choisir-carreleur-maroc',
  'macon-construction-maroc',
  'urgence-plomberie-casablanca',
];

function unescapeJs(value) {
  return value
    .replace(/\\`/g, '`')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}
function esc(value) {
  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function inlineMd(value) {
  return value
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r/g,'').split('\n');
  const out = [];
  let paragraph = [];
  let list = null;
  function flushParagraph() {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMd(esc(paragraph.join(' ').trim()))}</p>`);
    paragraph = [];
  }
  function closeList() {
    if (!list) return;
    out.push(`</${list}>`);
    list = null;
  }
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); closeList(); continue; }
    const h = line.match(/^##\s+(.+)$/);
    if (h) { flushParagraph(); closeList(); out.push(`<h2>${inlineMd(esc(h[1]))}</h2>`); continue; }
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) { flushParagraph(); if (list !== 'ol') { closeList(); out.push('<ol>'); list='ol'; } out.push(`<li>${inlineMd(esc(ol[1]))}</li>`); continue; }
    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) { flushParagraph(); if (list !== 'ul') { closeList(); out.push('<ul>'); list='ul'; } out.push(`<li>${inlineMd(esc(ul[1]))}</li>`); continue; }
    closeList();
    paragraph.push(line);
  }
  flushParagraph(); closeList();
  return out.join('\n');
}
function extractArticle(source, slug) {
  const safeSlug = slug.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re = new RegExp(`\\{\\s*\\n\\s*slug: ['"]${safeSlug}['"],[\\s\\S]*?\\n\\s*content: \\`([\\s\\S]*?)\\`\\s*\\n\\s*\\}\\s*(?:,|\\n)`, 'm');
  const match = source.match(re);
  if (!match) throw new Error(`[canonical blog] Source article not found: ${slug}`);
  const block = match[0];
  const title = (block.match(/title:\s*['"]([^'"\n]+)['"]/i) || [,''])[1];
  const description = (block.match(/description:\s*'([^']*)'/i) || block.match(/description:\s*"([^"]*)"/i) || [,''])[1];
  const date = (block.match(/date:\s*['"]([^'"]+)['"]/i) || [,''])[1];
  const readTime = (block.match(/readTime:\s*['"]([^'"]+)['"]/i) || [,''])[1];
  if (!title || !description || !match[1].trim()) throw new Error(`[canonical blog] Incomplete source article: ${slug}`);
  return { slug, title: unescapeJs(title), description: unescapeJs(description), date, readTime, content: unescapeJs(match[1].trim()) };
}
function htmlFor(article) {
  const body = markdownToHtml(article.content);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(article.title)} — Snay3i.ma</title>
<meta name="description" content="${esc(article.description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://snay3i.ma/blog/${article.slug}">
<meta name="twitter:card" content="summary_large_image">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script>
<style>
body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}
header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}
nav{max-width:900px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}
main{max-width:900px;margin:auto;padding:44px 22px}section{background:#fff;border:1px solid #e8e0d4;border-radius:16px;padding:26px;margin:0 0 16px}
h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:21px;color:#0d1b2a}.meta{color:#6f6a64;font-size:14px}
.article p,.article li{font-size:17px}.article h2{margin-top:30px}ul,ol{padding-left:22px}
@media (max-width:640px){main{padding:26px 14px}h1{font-size:28px}.article p,.article li{font-size:16px}section{padding:20px}nav{gap:10px;font-size:14px}}
</style>
</head>
<body>
<header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header>
<main>
<div data-snay3i-article-cover="1" style="margin:0 0 26px;border-radius:20px;overflow:hidden;min-height:20px"></div>
<article class="article"><section>
<p class="meta">Guide Snay3i.ma${article.date ? ` • ${esc(article.date)}` : ''}${article.readTime ? ` • ${esc(article.readTime)}` : ''}</p>
<h1>${esc(article.title)}</h1>
<p>${esc(article.description)}</p>
</section>
<section>
${body}
</section>
</article>
<section><h2>Snay3i.ma</h2>
<p>Snay3i.ma est une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour les travaux et services à domicile. Les informations affichées dépendent des données disponibles sur chaque profil.</p>
<p>Avant toute prestation, vérifiez directement avec le professionnel les tarifs, les disponibilités, la nature du travail et les éventuels frais.</p>
<p><a href="/blog">Voir les guides du blog</a> · <a href="/about">À propos de Snay3i.ma</a> · <a href="/contact">Nous contacter</a></p>
</section>
</main>
<footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer>
</body></html>`;
}
if (!fs.existsSync(sourceFile)) throw new Error('[canonical blog] Blog.js missing');
if (!fs.existsSync(blogRoot)) fs.mkdirSync(blogRoot, { recursive: true });
const source = fs.readFileSync(sourceFile, 'utf8');
for (const slug of CANONICAL) {
  const article = extractArticle(source, slug);
  const dir = path.join(blogRoot, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), htmlFor(article), 'utf8');
}
console.log(`[canonical blog] rebuilt ${CANONICAL.length} canonical article pages directly from Blog.js`);
