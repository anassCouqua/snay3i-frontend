const INDEXABLE_BLOG_SLUGS = [
  'guide-trouver-artisan-fiable-maroc',
  'questions-avant-travaux-artisan-maroc',
  'comparer-devis-travaux-maroc',
  'preparer-renovation-maison-maroc',
  'brief-clair-artisan-maroc',
  'comparer-devis-travaux-maroc-darija',
];

// Local directory pages remain available to visitors, but are temporarily excluded
// from the indexable AdSense-facing corpus while richer first-party profile data is built.
const INDEXABLE_SERVICE_CITY_ROUTES = [];

const CORE_ROUTES = ['/', '/about', '/blog', '/contact', '/privacy', '/terms', '/editorial-policy', '/observatoire-artisans-maroc', '/outils', '/outils/comparateur-devis', '/outils/calculateur-peinture', '/outils/calculateur-carrelage', '/outils/checklist-renovation', '/outils/planificateur-budget-renovation', '/outils/brief-artisan'];

module.exports = {
  INDEXABLE_BLOG_SLUGS,
  INDEXABLE_SERVICE_CITY_ROUTES,
  CORE_ROUTES,
};
