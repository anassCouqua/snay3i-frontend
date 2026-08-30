// Curated blog photography registry.
// IMPORTANT: an image URL belongs to ONE article only. Unmapped articles intentionally
// use the Snay3i gradient fallback rather than receiving an irrelevant/repeated photo.

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

const PHOTO_REGISTRY = {
  // Morocco / city-specific guides
  'artisan-marrakech-guide': U('photo-1624805098931-098c0d918b34'),
  'artisan-rabat-guide-2026': U('photo-1603883207805-ed42418120fe'),

  // Plumbing
  'trouver-bon-plombier-maroc': U('photo-1581094288338-2314dddb7ece'),
  'plombier-marrakech-guide': U('photo-1581578731548-c64695cc6952'),
  'urgence-plomberie-casablanca': U('photo-1581092160607-ee22621dd758'),

  // Electrical
  'tarif-electricien-maroc-2026': U('photo-1621905252507-b35492cc74b4'),
  'electricien-autour-de-moi-maroc': U('photo-1558618666-fcd25c85cd64'),
  'electricien-casablanca-guide': U('photo-1707336851425-cd0efa55819d'),
  'electricien-urgence-casablanca': U('photo-1713967245835-279ac4ee83f3'),

  // Renovation / construction
  'renover-maison-maroc-guide': U('photo-1503387762-592deb58ef4e'),
  'entretien-maison-maroc-checklist': U('photo-1505693416388-ac5ce068fe85'),
  'macon-casablanca-pas-cher': U('photo-1517581177682-a085bb7ffb15'),

  // Painting
  'peintre-casablanca-prix': U('photo-1589939705384-5185137a7f0f'),

  // Locksmith
  'serrurier-autour-de-moi-maroc': U('photo-1558655146-d09347e92766'),
  'serrurier-marrakech-guide': U('photo-1582139329536-e7284fece509'),

  // Climate / HVAC
  'climatisation-maroc-installation': U('photo-1621905251189-08b45d6a269e'),

  // Gardening
  'jardinier-paysagiste-maroc': U('photo-1558904541-efa843a96f01'),

  // Carpentry
  'menuisier-cuisine-maroc': U('photo-1769353086138-19ee65291a04'),

  // Tiling / Moroccan bathroom
  'choisir-carreleur-maroc': U('photo-1600566753190-17f0baa2a6c3'),
  'renovation-salle-bain-maroc-prix': U('photo-1600566753086-00f18fb6b3ea'),

  // Metalwork / welding
  'soudeur-autour-de-moi-maroc': U('photo-1530124566582-a618bc2615dc')
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
