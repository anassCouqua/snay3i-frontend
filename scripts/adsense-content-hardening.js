const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicBlog = path.join(root, 'public', 'blog');

const CANONICAL_SLUGS = new Set([
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'renovation-maison-maroc-guide',
  'climatisation-maroc-installation',
  'serrurier-urgence-maroc',
  'choisir-carreleur-maroc',
  'macon-construction-maroc',
  'urgence-plomberie-casablanca',
]);

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

function processArticles() {
  if (!fs.existsSync(publicBlog)) return;
  let changed = 0;
  let legacy = 0;
  let adStripped = 0;
  for (const entry of fs.readdirSync(publicBlog, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(publicBlog, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    html = removeEditorialBoilerplate(html);
    if (!CANONICAL_SLUGS.has(entry.name)) {
      legacy += 1;
      html = addNoindex(html);
      const beforeAds = html;
      html = removeAdSense(html);
      if (html !== beforeAds) adStripped += 1;
    }
    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      changed += 1;
    }
  }
  console.log(`[AdSense hardening] cleaned ${changed} static article page(s); ${legacy} legacy articles noindexed; ad code stripped from ${adStripped} legacy page(s)`);
}

processArticles();