const fs = require('fs');
const path = require('path');

const publicRoot = path.join(__dirname, '..', 'public', 'blog');

const IMAGE_MAP = {
  'trouver-bon-plombier-maroc': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=82',
  'tarif-electricien-maroc-2026': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=82',
  'renovation-salle-bain-maroc-prix': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=82',
  'renover-maison-maroc-guide': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=82',
  'peintre-maison-maroc-conseils': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=82',
  'serrurier-urgence-maroc': 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=82',
  'climatisation-maroc-installation': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=82',
  'jardinier-paysagiste-maroc': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1600&q=82',
  'menuisier-cuisine-maroc': 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1600&q=82',
  'choisir-carreleur-maroc': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=82',
  'soudeur-autour-de-moi-maroc': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1600&q=82'
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
  jardinier: IMAGE_MAP['jardinier-paysagiste-maroc'],
  macon: IMAGE_MAP['renover-maison-maroc-guide'],
  construction: IMAGE_MAP['renover-maison-maroc-guide'],
  renovation: IMAGE_MAP['renover-maison-maroc-guide'],
  menuisier: IMAGE_MAP['menuisier-cuisine-maroc'],
  cuisine: IMAGE_MAP['menuisier-cuisine-maroc'],
  carreleur: IMAGE_MAP['choisir-carreleur-maroc'],
  soudeur: IMAGE_MAP['soudeur-autour-de-moi-maroc'],
  ferronnier: IMAGE_MAP['soudeur-autour-de-moi-maroc']
};

const PHOTO_ALTS = {
  plomberie: 'Plombier professionnel au Maroc',
  electricite: 'Électricien professionnel au Maroc',
  renovation: 'Travaux de rénovation au Maroc',
  peinture: 'Peintre professionnel au Maroc',
  serrurerie: 'Serrurier professionnel au Maroc',
  climatisation: 'Installation de climatisation au Maroc',
  jardinage: 'Jardinier paysagiste au Maroc',
  menuiserie: 'Menuisier au Maroc',
  carrelage: 'Carrelage et zellige au Maroc',
  ferronnerie: 'Soudeur et ferronnier au Maroc'
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

function categoryForSlug(slug) {
  const s = normalizeSlug(slug);
  if (s.includes('plomb')) return 'plomberie';
  if (s.includes('electric')) return 'electricite';
  if (s.includes('peint')) return 'peinture';
  if (s.includes('serrur')) return 'serrurerie';
  if (s.includes('clim')) return 'climatisation';
  if (s.includes('jardin')) return 'jardinage';
  if (s.includes('menuis') || s.includes('cuisine')) return 'menuiserie';
  if (s.includes('carrel') || s.includes('zellige')) return 'carrelage';
  if (s.includes('soud') || s.includes('ferronn')) return 'ferronnerie';
  return 'renovation';
}

function imageForSlug(slug) {
  const normalized = normalizeSlug(slug);
  if (IMAGE_MAP[normalized]) return IMAGE_MAP[normalized];
  const category = categoryForSlug(normalized);
  return CATEGORY_IMAGES[category] || GENERIC_IMAGE;
}

function secondaryImageForSlug(slug) {
  const category = categoryForSlug(slug);
  const alternates = {
    plomberie: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=82',
    electricite: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=82',
    renovation: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=82',
    peinture: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=82',
    serrurerie: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1600&q=82',
    climatisation: 'https://images.unsplash.com/photo-1631545806609-9031d8f7b2e7?auto=format&fit=crop&w=1600&q=82',
    jardinage: 'https://images.unsplash.com/photo-1599685315640-3a7cfe58a4b9?auto=format&fit=crop&w=1600&q=82',
    menuiserie: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1600&q=82',
    carrelage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=82',
    ferronnerie: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=82'
  };
  return alternates[category] || GENERIC_IMAGE;
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
    if (entry.isDirectory()) files.push(...collectHtmlFiles(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') files.push(fullPath);
  }
  return files;
}

function replaceMetaImage(html, imageUrl) {
  html = html.replace(/(<meta\s+property=["']og:image["']\s+content=["'])[^"']*(["'][^>]*>)/gi, `$1${imageUrl}$2`);
  html = html.replace(/(<meta\s+name=["']twitter:image["']\s+content=["'])[^"']*(["'][^>]*>)/gi, `$1${imageUrl}$2`);
  return html;
}

function replaceCoverImage(html, imageUrl, altText, emoji) {
  const coverRegex = /<div([^>]*data-snay3i-article-cover=["']1["'][^>]*)>\s*(?:<img([^>]*src=["'](?:\/)?blog-images\/[^"']+["'][^>]*)>|<div[^>]*data-snay3i-safe-photo=["']1["'][^>]*>[\s\S]*?<\/div>)\s*<\/div>/i;
  const safeCover = `<div$1><div role="img" aria-label="${escapeHtml(altText)}" data-snay3i-safe-photo="1" style="min-height:340px;width:100%;border-radius:20px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.25),rgba(27,38,59,.72)),url('${imageUrl}');background-size:cover;background-position:center;display:flex;align-items:flex-end;justify-content:flex-start;box-sizing:border-box;padding:24px"><div style="background:rgba(13,27,42,.82);color:#fff;border-radius:999px;padding:7px 12px;font-size:18px;line-height:1">${emoji}</div></div></div>`;
  return html.replace(coverRegex, safeCover);
}

function removeLegacyImages(html) {
  return html.replace(/<img([^>]*src=["'](?:\/)?blog-images\/[^"']+["'][^>]*)>/gi, '');
}

function insertInlinePhotos(html, slug, title) {
  if (html.includes('data-snay3i-inline-photo="1"')) return html;
  const primary = imageForSlug(slug);
  const secondary = secondaryImageForSlug(slug);
  const category = categoryForSlug(slug);
  const alt1 = PHOTO_ALTS[category] || 'Artisan au Maroc';
  const photo1 = `<div data-snay3i-inline-photo="1" role="img" aria-label="${escapeHtml(alt1)}" style="margin:28px 0;border-radius:18px;min-height:280px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.12),rgba(27,38,59,.60)),url('${primary}');background-size:cover;background-position:center;box-shadow:0 8px 24px rgba(13,27,42,.10);display:flex;align-items:flex-end;padding:20px;box-sizing:border-box"><div style="background:rgba(255,255,255,.92);color:#0D1B2A;border-radius:10px;padding:8px 12px;font-size:13px;font-weight:700">${escapeHtml(title)}</div></div>`;
  const photo2 = `<div data-snay3i-inline-photo="1" role="img" aria-label="Illustration complémentaire — ${escapeHtml(title)}" style="margin:28px 0;border-radius:18px;min-height:240px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.10),rgba(27,38,59,.62)),url('${secondary}');background-size:cover;background-position:center;box-shadow:0 8px 24px rgba(13,27,42,.10);display:flex;align-items:flex-end;padding:20px;box-sizing:border-box"><div style="background:rgba(13,27,42,.84);color:#fff;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:700">🇲🇦 Snay3i.ma</div></div>`;

  let h2Count = 0;
  const chunks = html.split(/(<h2[^>]*>[\s\S]*?<\/h2>)/gi);
  let output = '';
  for (const chunk of chunks) {
    output += chunk;
    if (/^<h2/i.test(chunk)) {
      h2Count += 1;
      if (h2Count === 2) output += photo1;
      if (h2Count === 5) output += photo2;
    }
  }
  return output;
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
  const emoji = slug.includes('electric') ? '⚡' : slug.includes('plomb') ? '🔧' : slug.includes('peint') ? '🎨' : slug.includes('serrur') ? '🔑' : slug.includes('jardin') ? '🌿' : slug.includes('clim') ? '❄️' : slug.includes('menuis') ? '🪚' : slug.includes('carrel') ? '🏛️' : slug.includes('soud') ? '🔥' : '🇲🇦';

  html = replaceMetaImage(html, imageUrl);
  html = replaceCoverImage(html, imageUrl, altText, emoji);
  html = removeLegacyImages(html);
  html = insertInlinePhotos(html, slug, altText);

  fs.writeFileSync(filePath, html);
  return true;
}

function processBlogIndex() {
  const filePath = path.join(publicRoot, 'index.html');
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('data-snay3i-blog-photo="1"')) return false;

  html = html.replace(/(<div class="card"[^>]*>\s*)(<h3>)/gi, (match, start, heading) => {
    const slugMatch = match.match(/href=["']\/blog\/([^"']+)["']/i);
    const slug = slugMatch ? slugMatch[1] : '';
    const imageUrl = imageForSlug(slug);
    const photo = `<div data-snay3i-blog-photo="1" role="img" aria-label="Illustration ${escapeHtml(slug)}" style="height:150px;width:100%;border-radius:14px;margin-bottom:12px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.12),rgba(27,38,59,.58)),url('${imageUrl}');background-size:cover;background-position:center"></div>`;
    return start + photo + heading;
  });

  // Run through all article cards again with a safer callback that can read each full card.
  html = html.replace(/<div class="card">([\s\S]*?)<\/div>/gi, (card, inner) => {
    if (card.includes('data-snay3i-blog-photo')) return card;
    const slugMatch = card.match(/href=["']\/blog\/([^"']+)["']/i);
    if (!slugMatch) return card;
    const slug = slugMatch[1];
    const imageUrl = imageForSlug(slug);
    const photo = `<div data-snay3i-blog-photo="1" role="img" aria-label="Illustration ${escapeHtml(slug)}" style="height:150px;width:100%;border-radius:14px;margin-bottom:12px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.12),rgba(27,38,59,.58)),url('${imageUrl}');background-size:cover;background-position:center"></div>`;
    return `<div class="card">${photo}${inner}</div>`;
  });

  fs.writeFileSync(filePath, html);
  return true;
}

const files = collectHtmlFiles(publicRoot);
let processed = 0;
for (const file of files) if (processFile(file)) processed += 1;
const indexProcessed = processBlogIndex();
console.log(`[static blog photography] hardened ${processed} article page(s); blog index ${indexProcessed ? 'updated' : 'already updated'}`);
