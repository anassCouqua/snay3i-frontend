const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicBlog = path.join(root, 'public', 'blog');

const NOINDEX_SLUGS = new Set([
  'electricien-casablanca-pas-cher',
  'electricien-professionnel-casablanca',
  'electricien-rabat-pas-cher',
  'plombier-autour-de-moi-pas-cher',
  'plombier-casablanca-pas-cher',
  'plombier-rabat-pas-cher',
  'serrurier-casablanca-pas-cher',
  'serrurier-autour-de-moi-maroc',
  'macon-casablanca-pas-cher'
]);

function addNoindex(html) {
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow">');
  }
  return html.replace('</head>', '<meta name="robots" content="noindex,follow">\n</head>');
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
  for (const entry of fs.readdirSync(publicBlog, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(publicBlog, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    html = removeEditorialBoilerplate(html);
    if (NOINDEX_SLUGS.has(entry.name)) html = addNoindex(html);
    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      changed += 1;
    }
  }
  console.log(`[AdSense hardening] cleaned ${changed} static article page(s); ${NOINDEX_SLUGS.size} overlapping variants set to noindex`);
}

processArticles();
