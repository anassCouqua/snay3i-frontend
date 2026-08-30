const fs = require('fs');
const path = require('path');

const publicRoot = path.join(__dirname, '..', 'public', 'blog');

const IMAGE_MAP = {
  'trouver-bon-plombier-maroc': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=82',
  'tarif-electricien-maroc-2026': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=82',
  'renover-maison-maroc-guide': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=82',
  'peintre-maison-maroc-conseils': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=82',
  'serrurier-urgence-maroc': 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=82',
  'climatisation-maroc-installation': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=82'
};

const CATEGORY_IMAGES = {
  plomberie: IMAGE_MAP['trouver-bon-plombier-maroc'],
  plombier: IMAGE_MAP['trouver-bon-plombier-maroc'],
  electricien: IMAGE_MAP['tarif-electricien-maroc-2026'],
  electricite: IMAGE_MAP['tarif-electricien-maroc-2026'],
  peintre: IMAGE_MAP['peintre-maison-maroc-conseils'],
  peinture: IMAGE_MAP['peintre-maison-maroc-conseils'],
  serrurier: IMAGE_MAP['serrurier-urgence-maroc'],
  serrurerie: IMAGE_MAP['serrurier-urgence-maroc'],
  climatisation: IMAGE_MAP['climatisation-maroc-installation'],
  jardinier: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1600&q=82',
  macon: IMAGE_MAP['renover-maison-maroc-guide'],
  construction: IMAGE_MAP['renover-maison-maroc-guide'],
  renovation: IMAGE_MAP['renover-maison-maroc-guide'],
  menuisier: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1600&q=82',
  cuisine: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1600&q=82',
  carreleur: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=82',
  soudeur: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1600&q=82',
  ferronnier: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1600&q=82'
};

const GENERIC_IMAGE = IMAGE_MAP['renover-maison-maroc-guide'];

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function imageForSlug(slug) {
  const normalized = normalizeSlug(slug);
  if (IMAGE_MAP[normalized]) return IMAGE_MAP[normalized];

  for (const [keyword, url] of Object.entries(CATEGORY_IMAGES)) {
    if (normalized.includes(keyword)) return url;
  }

  return GENERIC_IMAGE;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function collectHtmlFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      files.push(fullPath);
    }
  }
  return files;
}

function replaceMetaImage(html, imageUrl) {
  html = html.replace(
    /(<meta\s+property=["']og:image["']\s+content=["'])[^"']*(["'][^>]*>)/gi,
    `$1${imageUrl}$2`
  );
  html = html.replace(
    /(<meta\s+name=["']twitter:image["']\s+content=["'])[^"']*(["'][^>]*>)/gi,
    `$1${imageUrl}$2`
  );
  return html;
}

function replaceCoverImage(html, imageUrl, altText, emoji) {
  const coverRegex = /<div([^>]*data-snay3i-article-cover=["']1["'][^>]*)>\s*<img([^>]*src=["'](?:\/)?blog-images\/[^"']+["'][^>]*)>\s*<\/div>/i;
  const safeCover = `<div$1><div role="img" aria-label="${escapeHtml(altText)}" data-snay3i-safe-photo="1" style="min-height:340px;width:100%;border-radius:20px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.25),rgba(27,38,59,.72)),url('${imageUrl}');background-size:cover;background-position:center;display:flex;align-items:flex-end;justify-content:flex-start;box-sizing:border-box;padding:24px"><div style="background:rgba(13,27,42,.82);color:#fff;border-radius:999px;padding:7px 12px;font-size:18px;line-height:1">${emoji}</div></div></div>`;
  return html.replace(coverRegex, safeCover);
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('data-snay3i-article-cover')) return false;

  const relative = path.relative(publicRoot, filePath).split(path.sep);
  const slug = relative.length > 1 ? relative[0] : '';
  if (!slug || slug === 'index.html') return false;

  const imageUrl = imageForSlug(slug);
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const altText = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Snay3i.ma — Guide pratique';
  const emoji = slug.includes('electric') ? '⚡' : slug.includes('plomb') ? '🔧' : slug.includes('peint') ? '🎨' : slug.includes('serrur') ? '🔑' : slug.includes('jardin') ? '🌿' : slug.includes('clim') ? '❄️' : '🇲🇦';

  html = replaceMetaImage(html, imageUrl);
  html = replaceCoverImage(html, imageUrl, altText, emoji);

  // Any old /blog-images image left elsewhere is removed from the DOM rather than
  // left as a browser-level broken-image placeholder.
  html = html.replace(/<img([^>]*src=["'](?:\/)?blog-images\/[^"']+["'][^>]*)>/gi, '');

  fs.writeFileSync(filePath, html);
  return true;
}

const files = collectHtmlFiles(publicRoot);
let processed = 0;
for (const file of files) {
  if (processFile(file)) processed += 1;
}

console.log(`[static blog photography] hardened ${processed} article page(s)`);
