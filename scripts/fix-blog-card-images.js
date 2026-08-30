const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'src', 'Blog.js');

const PHOTO_SETS = {
  plumbing: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=82',
  electrical: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=82',
  renovation: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=82',
  painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=82',
  locksmith: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=82',
  climate: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=82',
  garden: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1400&q=82',
  carpentry: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1400&q=82',
  tile: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=82',
  metal: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1400&q=82'
};

function categoryForSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (s.includes('plomb')) return 'plumbing';
  if (s.includes('electric') || s.includes('tricien')) return 'electrical';
  if (s.includes('peint')) return 'painting';
  if (s.includes('serrur') || s.includes('cadenas')) return 'locksmith';
  if (s.includes('clim') || s.includes('frigo')) return 'climate';
  if (s.includes('jardin') || s.includes('paysag')) return 'garden';
  if (s.includes('menuis') || s.includes('cuisine')) return 'carpentry';
  if (s.includes('carrel') || s.includes('zellige')) return 'tile';
  if (s.includes('soud') || s.includes('ferronn')) return 'metal';
  return 'renovation';
}

const helper = `
const SNAY3I_CARD_PHOTOS = ${JSON.stringify(PHOTO_SETS)};
function snay3iCardPhoto(slug) {
  return SNAY3I_CARD_PHOTOS[${categoryForSlug.toString()}(slug)] || SNAY3I_CARD_PHOTOS.renovation;
}
`;

if (!fs.existsSync(blogPath)) throw new Error(`[blog card repair] Missing ${blogPath}`);
let source = fs.readFileSync(blogPath, 'utf8');
if (!source.includes('function snay3iCardPhoto')) {
  const anchor = "function setCanonical(url) {";
  source = source.replace(anchor, `${helper}\n${anchor}`);
}
// Replace calls only; never rewrite the getArticleImage function declaration.
source = source.replace(/(?<!function\s)getArticleImage\(article\)/g, "snay3iCardPhoto(article?.slug || '')");
fs.writeFileSync(blogPath, source);
console.log('[blog card repair] topic-specific photography enabled');
