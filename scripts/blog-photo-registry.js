// Curated blog photography registry.
// IMPORTANT: an image URL belongs to ONE article only.
// Unmapped articles intentionally use the Snay3i gradient fallback rather than
// receiving an irrelevant/repeated photo.

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

const PHOTO_REGISTRY = {
  // Plumbing
  'trouver-bon-plombier-maroc': U('photo-1581094288338-2314dddb7ece'),
  'urgence-plomberie-casablanca': U('photo-1581092160607-ee22621dd758'),
  'plombier-autour-de-moi-pas-cher': U('photo-1765897569756-07a635a9661b'),
  'plombier-casablanca-pas-cher': U('photo-1581578731548-c64695cc6952'),
  'plombier-rabat-pas-cher': U('photo-1723988429049-0a42e45e8501'),
  'plombier-marrakech-guide': U('photo-1694875119129-d79757ef3780'),

  // Electrical
  'tarif-electricien-maroc-2026': U('photo-1621905252507-b35492cc74b4'),
  'electricien-casablanca-guide': U('photo-1741388222137-c0d3007ec173'),
  'electricien-autour-de-moi-maroc': U('photo-1544724569-5f546fd6f2b5'),
  'electricien-casablanca-pas-cher': U('photo-1558618666-fcd25c85cd64'),
  'electricien-rabat-pas-cher': U('photo-1707336851425-cd0efa55819d'),
  'electricien-urgence-casablanca': U('photo-1713967245835-279ac4ee83f3'),
  'electricien-professionnel-casablanca': U('photo-1786177590769-f3b9fc8eb5ed'),

  // Renovation / construction / home maintenance
  'renovation-maison-maroc-guide': U('photo-1503387762-592deb58ef4e'),
  'entretien-maison-maroc-checklist': U('photo-1782898622998-899bb7183a12'),
  'macon-construction-maroc': U('photo-1780849328094-228dc15a6e10'),
  'macon-casablanca-pas-cher': U('photo-1517581177682-a085bb7ffb15'),
  'renovation-salle-bain-maroc-prix': U('photo-1785486249963-b7bf5bdbaba3'),

  // Painting
  'peintre-maison-maroc-conseils': U('photo-1742900280861-32bed068938b'),
  'peintre-casablanca-prix': U('photo-1589939705384-5185137a7f0f'),

  // Tiling / Moroccan interiors
  'choisir-carreleur-maroc': U('photo-1783989342149-12f93bde9ff4'),

  // Carpentry
  'menuisier-cuisine-maroc': U('photo-1787069538722-342d4397b042'),

  // Locksmith / doors / keys
  'serrurier-urgence-maroc': U('photo-1654944932733-bca31b703dd7'),
  'serrurier-autour-de-moi-maroc': U('photo-1558655146-d09347e92766'),
  'serrurier-casablanca-pas-cher': U('photo-1768720407298-1b24a0f6749d'),
  'serrurier-marrakech-guide': U('photo-1731397980201-1538f718209d'),

  // Climate / HVAC
  'climatisation-maroc-installation': U('photo-1621905251189-08b45d6a269e'),
  'climatisation-oujda-guide': U('photo-1766414629984-73a93e7caba0'),

  // Gardening
  'jardinier-paysagiste-maroc': U('photo-1779760478460-89c2f9e9c1e3'),

  // Welding / metalwork
  'soudeur-autour-de-moi-maroc': U('photo-1745448797901-2a4c9d9af1c1'),

  // Cleaning
  'nettoyage-maison-maroc-prix': U('photo-1779224962292-0e7ebddb20a7'),

  // City / Morocco-specific guides
  'artisan-marrakech-guide': U('photo-1779088469709-06fe1564c366'),
  'artisan-rabat-guide-2026': U('photo-1751407690802-39d531cacd11'),
  'artisan-tanger-guide-2026': U('photo-1781341031281-083ef5964938'),
  'trouver-snay3i-maroc-darija': U('photo-1779088470584-f6a5eb7c14a2')
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
  ferronnerie: 'Soudeur et ferronnier au Maroc',
  ville: 'Guide local Snay3i.ma au Maroc'
};

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
  if (s.includes('carrel') || s.includes('zellige') || s.includes('salle-bain')) return 'carrelage';
  if (s.includes('soud') || s.includes('ferronn')) return 'ferronnerie';
  if (s.includes('artisan-')) return 'ville';
  return 'renovation';
}

function photoForSlug(slug) {
  return PHOTO_REGISTRY[normalizeSlug(slug)] || '';
}

function validatePhotoRegistry() {
  const seen = new Map();
  for (const [slug, url] of Object.entries(PHOTO_REGISTRY)) {
    if (!url) continue;
    if (seen.has(url)) {
      throw new Error(`[blog photos] Duplicate image assigned to ${seen.get(url)} and ${slug}`);
    }
    seen.set(url, slug);
  }
}

validatePhotoRegistry();

module.exports = { PHOTO_REGISTRY, PHOTO_ALTS, normalizeSlug, categoryForSlug, photoForSlug };
