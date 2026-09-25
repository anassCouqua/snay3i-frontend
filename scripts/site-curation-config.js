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
  'jardin-anglais-maroc-darija',
  'cuisine-moderne-zero-maroc-darija',
  'escalier-suspendu-maison-maroc-darija',
  'open-space-maison-maroc-darija',
  'villa-riad-piscine-jardin-maroc-darija',
  'hammam-beldi-maison-maroc-darija',
];

const INDEXABLE_SERVICE_CITY_ROUTES = require('../src/service-city-index-routes.json');

const CORE_ROUTES = ['/', '/about', '/blog', '/contact', '/privacy', '/terms', '/editorial-policy', '/outils', '/outils/comparateur-devis', '/outils/calculateur-peinture', '/outils/calculateur-carrelage', '/outils/checklist-renovation', '/outils/planificateur-budget-renovation', '/outils/brief-artisan'];

module.exports = {
  INDEXABLE_BLOG_SLUGS,
  INDEXABLE_SERVICE_CITY_ROUTES,
  CORE_ROUTES,
};
