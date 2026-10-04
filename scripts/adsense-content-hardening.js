const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const root = path.join(__dirname, '..');
const publicBlog = path.join(root, 'public', 'blog');
const CANONICAL_SLUGS = new Set(INDEXABLE_BLOG_SLUGS);

function addNoindex(html) {
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow">');
  }
  return html.replace('</head>', '<meta name="robots" content="noindex,follow">\n</head>');
}

function removeAdSense(html) {
  html = html.replace(/<meta\s+name=["']google-adsense-account["'][^>]*>\s*/gi, '');
  html = html.replace(/<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, '');
  html = html.replace(/<ins\b[^>]*class=["'][^"']*adsbygoogle[^"']*["'][^>]*>[\s\S]*?<\/ins>\s*/gi, '');
  html = html.replace(/<script\b[^>]*>[\s\S]*?adsbygoogle[\s\S]*?<\/script>\s*/gi, (block) => /pagead2|adsbygoogle\s*=|\.push\s*\(/i.test(block) ? '' : block);
  return html;
}

function removeEditorialBoilerplate(html) {
  html = html.replace(/<section[^>]*data-adsense-editorial-hardening=["']1["'][^>]*>[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section[^>]*data-snay3i-blog-priority-links=["']1["'][^>]*>[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<h3>💡 Guide Pratique : Tarifs et Précautions pour vos Travaux au Maroc \(2026\)<\/h3>[\s\S]*?Pour trouver un professionnel vérifié et proche de chez vous, utilisez notre annuaire complet sur Snay3i\.ma\.<\/p>/gi, '');
  html = html.replace(/<\/p>\s*<p>\s*<li>/gi, '<li>');
  html = html.replace(/<\/li>\s*<\/p>\s*<p>/gi, '</li>');
  html = html.replace(/<ul>\s*<\/p>/gi, '<ul>');
  html = html.replace(/<p>\s*<\/ul>/gi, '</ul>');
  return html;
}

function retiredPage(slug) {
  const canonical = `https://snay3i.ma/blog/${slug}`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guide retiré — Snay3i.ma</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://snay3i.ma/blog"><style>body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}main{max-width:720px;margin:0 auto;padding:60px 20px}section{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:28px}a{color:#b34f24;font-weight:700}</style></head><body><main><section><p>Snay3i.ma · guide</p><h1>Cette ancienne page a été retirée</h1><p>Ce guide a été retiré de notre bibliothèque indexable pendant notre révision éditoriale. Nous publions uniquement les guides que nous pouvons maintenir avec des informations claires et utiles.</p><p><a href="/blog">Voir les guides actuels</a> · <a href="/outils">Voir les outils gratuits</a> · <a href="/contact">Nous contacter</a></p></section></main></body></html>`;
}

function processArticles() {
  if (!fs.existsSync(publicBlog)) return;
  let changed = 0;
  let legacy = 0;
  let retired = 0;
  for (const entry of fs.readdirSync(publicBlog, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(publicBlog, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    if (!CANONICAL_SLUGS.has(entry.name)) {
      legacy += 1;
      const replacement = retiredPage(entry.name);
      const current = fs.readFileSync(file, 'utf8');
      if (current !== replacement) {
        fs.writeFileSync(file, replacement, 'utf8');
        retired += 1;
        changed += 1;
      }
      continue;
    }
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    html = removeEditorialBoilerplate(html);
    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      changed += 1;
    }
  }
  console.log(`[AdSense hardening] ${CANONICAL_SLUGS.size} curated guides preserved; ${legacy} legacy articles replaced with noindex retired pages; ${retired} legacy page(s) rewritten`);
}

processArticles();
