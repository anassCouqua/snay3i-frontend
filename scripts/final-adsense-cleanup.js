const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const blogRoot = path.join(root, 'blog');

// Keep a deliberately small editorial core indexable for the AdSense review.
// Service/city SEO pages are intentionally untouched.
const INDEXABLE_BLOG = new Set([
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'renovation-maison-maroc-guide',
  'climatisation-maroc-installation',
  'serrurier-autour-de-moi-maroc',
  'choisir-carreleur-maroc',
  'urgence-plomberie-casablanca',
  'entretien-maison-maroc-checklist'
]);

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
};

if (fs.existsSync(blogRoot)) {
  for (const file of walk(blogRoot)) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(blogRoot, file).split(path.sep);
    const slug = rel[0];
    if (!slug || slug === 'index.html') continue;

    let html = fs.readFileSync(file, 'utf8');
    const isIndexable = INDEXABLE_BLOG.has(slug);

    if (!isIndexable) {
      if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
        html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow">');
      } else {
        html = html.replace('</head>', '<meta name="robots" content="noindex,follow">\n</head>');
      }
    }

    fs.writeFileSync(file, html, 'utf8');
  }
}

// Remove unsupported or overly strong claims from generated public HTML.
const trustReplacements = [
  [/plateforme marocaine qui vous connecte avec des plombiers vérifiés dans votre ville/gi, 'plateforme marocaine qui aide à rechercher des plombiers dans votre ville'],
  [/trouvez des électriciens vérifiés dans votre ville/gi, 'recherchez des électriciens dans votre ville'],
  [/électriciens vérifiés/gi, 'électriciens présents sur la plateforme'],
  [/electriciens vérifiés/gi, 'electriciens présents sur la plateforme'],
  [/tous les plombiers sont évalués par leurs clients réels/gi, 'les profils peuvent afficher les avis disponibles sur la plateforme'],
  [/tous nos artisans sont vérifiés et évalués par leurs clients/gi, 'consultez les informations disponibles sur les professionnels présents sur la plateforme'],
  [/artisans vérifiés/gi, 'professionnels présents sur la plateforme'],
  [/prix réels/gi, 'prix indicatifs'],
  [/prix réel/gi, 'prix indicatif'],
  [/qui est souvent aussi le plus disponible et le moins cher en frais de déplacement/gi, 'qui peut réduire les frais de déplacement selon sa disponibilité et sa localisation'],
  [/la géolocalisation vous montre l’électricien le plus proche/gi, 'la plateforme peut afficher des professionnels selon la ville et les informations disponibles']
];

for (const file of walk(root)) {
  if (!file.endsWith('.html')) continue;
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  for (const [pattern, replacement] of trustReplacements) html = html.replace(pattern, replacement);
  if (html !== original) fs.writeFileSync(file, html, 'utf8');
}

const sitemap = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  let xml = fs.readFileSync(sitemap, 'utf8');
  xml = xml.replace(/\s*<url>\s*<loc>https:\/\/snay3i\.ma\/blog\/([^<]+)<\/loc>[\s\S]*?<\/url>/g, (block, slug) => {
    return INDEXABLE_BLOG.has(slug) ? block : '';
  });
  fs.writeFileSync(sitemap, xml, 'utf8');
}

console.log(`[AdSense cleanup] kept ${INDEXABLE_BLOG.size} flagship editorial URLs indexable; de-indexed weaker blog variants and normalized unsupported trust claims`);
