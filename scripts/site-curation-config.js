const INDEXABLE_BLOG_SLUGS = [
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'renovation-maison-maroc-guide',
  'climatisation-maroc-installation',
  'serrurier-urgence-maroc',
  'choisir-carreleur-maroc',
  'macon-construction-maroc',
  'urgence-plomberie-casablanca',
  'petites-reparations-bricoleur-maison-maroc',
  'repeindre-maison-maroc-guide',
  'rangement-sur-mesure-menuisier-maroc',
  'nettoyage-profond-maison-guide',
  'creer-beau-jardin-maroc',
  'projet-soudure-ferronnerie-maroc',
];

// Service/city pages remain usable for visitors, but they are deliberately
// excluded from Google until they contain genuinely local, non-templated value.
const INDEXABLE_SERVICE_CITY_ROUTES = [];

const CORE_ROUTES = ['/', '/about', '/blog', '/contact', '/privacy', '/terms'];

module.exports = {
  INDEXABLE_BLOG_SLUGS,
  INDEXABLE_SERVICE_CITY_ROUTES,
  CORE_ROUTES,
};
