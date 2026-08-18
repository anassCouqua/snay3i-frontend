const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const blogSourcePath = path.join(process.cwd(), 'src', 'Blog.js');

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const replaceAll = (source, replacements) => {
  let out = source;
  for (const [from, to] of replacements) out = out.split(from).join(to);
  return out;
};

const articleMeta = {
  'trouver-bon-plombier-maroc': {
    editorial: 'Ce guide propose une méthode de comparaison applicable au contexte marocain : description du problème, devis, déplacement, matériaux et vérification avant paiement.',
    related: ['/artisan/plombier/casablanca', '/artisan/plombier/rabat', '/blog/urgence-plomberie-casablanca']
  },
  'tarif-electricien-maroc-2026': {
    editorial: 'Les montants mentionnés dans ce guide sont indicatifs. Le coût réel dépend notamment de la ville, de l’accès, de la complexité, des matériaux et du caractère urgent de l’intervention. Demandez un devis détaillé avant travaux.',
    related: ['/artisan/electricien/casablanca', '/artisan/electricien/rabat', '/artisan/electricien/tanger']
  },
  'renovation-maison-maroc-guide': {
    editorial: 'Pour une rénovation, la meilleure protection contre les dépassements consiste à définir le périmètre, prioriser les travaux techniques et comparer plusieurs devis comparables avant de lancer le chantier.',
    related: ['/artisan/macon/casablanca', '/artisan/electricien/casablanca', '/artisan/peintre/casablanca']
  }
};

const sourceReplacements = [
  ["Les témoignages d'autres clients sont la meilleure indication de la qualité du travail. Un plombier avec 50 avis positifs est beaucoup plus fiable qu'un inconnu trouvé sur Facebook.", "Les avis peuvent aider à comparer une expérience client, mais ils ne remplacent pas la vérification des compétences, du périmètre du travail et du devis."],
  ["Les fuites d'eau représentent 40% des demandes sur Snay3i.ma.", "Les fuites d'eau font partie des problèmes de plomberie fréquents dans les logements."],
  ["Sur Snay3i.ma, chaque profil indique clairement la disponibilité de l'artisan.", "Lorsque cette information est disponible, le profil peut indiquer les modalités ou disponibilités déclarées par le professionnel."],
  ["Snay3i.ma est la plateforme marocaine qui vous connecte avec des plombiers vérifiés dans votre ville.", "Snay3i.ma aide à rechercher des plombiers et à comparer les informations disponibles sur les profils publiés."],
  ["Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission.", "La plateforme propose des profils dans plusieurs villes. Les disponibilités et informations dépendent des données publiées au moment de la consultation."],
  ["Sur Snay3i.ma, tous les plombiers sont évalués par leurs clients réels.", "Lorsque des avis sont affichés, ils constituent un élément parmi d'autres à vérifier avant de réserver une prestation."],
  ["Sur Snay3i.ma, trouvez des électriciens vérifiés dans votre ville. Chaque profil affiche:", "Sur Snay3i.ma, vous pouvez consulter les informations disponibles sur les profils d'électriciens dans les villes couvertes. Les champs visibles dépendent du profil."],
  ["Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc.", "La plateforme couvre plusieurs villes marocaines et les pages locales permettent de rechercher des professionnels par métier et par ville."]
];

if (fs.existsSync(blogSourcePath)) {
  const source = fs.readFileSync(blogSourcePath, 'utf8');
  const cleaned = replaceAll(source, sourceReplacements);
  if (cleaned !== source) fs.writeFileSync(blogSourcePath, cleaned, 'utf8');
}

const blogDir = path.join(root, 'blog');
if (!fs.existsSync(blogDir)) process.exit(0);

for (const [slug, meta] of Object.entries(articleMeta)) {
  const file = path.join(blogDir, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const editorial = `<section data-editorial-quality="1"><h2>À propos de ce guide</h2><p>${esc(meta.editorial)}</p><p>Les recommandations sont informatives et doivent être adaptées à la situation réelle. Vérifiez les prix, disponibilités, garanties et contraintes avec le professionnel avant toute prestation.</p></section>`;
  const links = `<section data-editorial-related="1"><h2>Pages utiles</h2><p>${meta.related.map((href) => `<a href="${href}">Consulter cette ressource</a>`).join(' · ')}</p></section>`;
  if (!html.includes('data-editorial-quality="1"')) html = html.replace('</main>', `${editorial}${links}</main>`);
  fs.writeFileSync(file, html, 'utf8');
}

console.log('[Blog quality] cleaned unsupported claims and strengthened priority articles');
