const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const SEO = path.join(ROOT, 'public', 'seo');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function replaceInFile(file, replacements) {
  if (!fs.existsSync(file)) return false;
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  if (text !== original) fs.writeFileSync(file, text, 'utf8');
  return text !== original;
}

// Remove unsupported or overly promotional claims from customer-facing source.
const claimReplacements = [
  ['Le réseau des artisans marocains vérifiés. +200 artisans dans 21 villes. 🇲🇦', 'Une plateforme marocaine pour rechercher des professionnels par métier et par ville. 🇲🇦'],
  ['La plateforme marocaine qui connecte les clients avec des artisans de confiance partout au Maroc.', 'Une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour leurs travaux et services à domicile.'],
  ["La plateforme marocaine qui connecte les clients avec des artisans de confiance partout au Maroc.", "Une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour leurs travaux et services à domicile."],
  ["La plateforme marocaine qui connecte les clients avec des artisans vérifiés dans 35 villes du Maroc. Notre mission: rendre l'accès aux services à domicile simple, rapide et gratuit.", "Snay3i.ma aide les particuliers à rechercher des professionnels pour les travaux et services à domicile au Maroc. Notre mission est de rendre la recherche plus simple et plus accessible."],
  ["directement avec des artisans vérifiés — sans intermédiaire, sans commission, sans complications.", "directement avec des professionnels référencés sur la plateforme."],
  ["directement les clients avec des artisans vérifiés — sans intermédiaire, sans commission, sans complications.", "directement les clients avec des professionnels référencés sur la plateforme."],
  ["{n:'100+',l:'Maalems vérifiés'}", "{n:'Profils',l:'Professionnels référencés'}"],
  ["{n:'35',l:'Villes couvertes'}", "{n:'Plusieurs',l:'Villes proposées'}"],
  ["{n:'12',l:'Catégories de services'}", "{n:'12',l:'Catégories de services'}"],
  ["{n:'100%',l:'Gratuit pour tous'}", "{n:'Simple',l:'Recherche gratuite'}"],
  ["Aujourd'hui, Snay3i.ma référence plus de 100 professionnels dans 21 villes du Maroc, de Tanger à Dakhla. La plateforme est disponible en français et en arabe, avec une application iOS et Android pour encore plus de facilité.", "Aujourd'hui, Snay3i.ma facilite la recherche de professionnels dans plusieurs villes du Maroc. La plateforme est disponible en français et en arabe. Consultez les résultats disponibles directement sur le site."],
  ["Tous nos artisans sont vérifiés et notés par leurs clients. Consultez les avis avant d'appeler.", "Consultez les informations disponibles sur chaque profil et les avis lorsqu'ils sont présents avant de contacter un professionnel."],
  ["Tous nos artisans sont vérifiés et évalués par leurs clients.", "Les profils et les avis affichés dépendent des informations disponibles sur la plateforme."],
  ["Trouvez votre artisan en moins de 30 secondes. Appelez directement, intervenez rapidement.", "Recherchez par métier et par ville, puis contactez directement le professionnel qui correspond à votre besoin."],
  ["Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission", "Rejoignez la communauté de professionnels sur Snay3i.ma"],
  ["Rejoignez +200 professionnels sur Snay3i.ma", "Rejoignez la communauté de professionnels sur Snay3i.ma"],
  ["35 villes au Maroc: Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, Meknès, Oujda et bien plus — de Tanger à Dakhla.", "Les villes et professionnels disponibles évoluent avec les données de la plateforme. Consultez directement les résultats par ville."],
  ["les artisans vérifiés", "les professionnels référencés"],
  ["artisan vérifié", "professionnel référencé"],
  ["artisans vérifiés", "professionnels référencés"],
  ["artisans de confiance", "professionnels référencés"],
  ["artisans évalués", "professionnels référencés"],
  ["plus de 100 artisans", "les professionnels disponibles"],
  ["+100 artisans", "les professionnels disponibles"],
  ["dans 21 villes du Maroc", "dans plusieurs villes du Maroc"],
  ["35 villes du Maroc", "plusieurs villes du Maroc"],
  ["100+ artisans", "des professionnels référencés"],
  ["100% Gratuit pour tous", "Recherche gratuite"],
  ["Snay3i.ma est et restera gratuit pour les clients et les artisans. Sans commission, sans abonnement.", "La recherche sur Snay3i.ma est proposée sans frais pour les visiteurs. Les conditions applicables à une prestation sont convenues directement avec le professionnel."],
  ["La plateforme est disponible en français et en arabe, avec une application iOS et Android pour encore plus de facilité.", "La plateforme est disponible en français et en arabe sur le site web."],
];

for (const file of [...walk(SRC), ...walk(SEO)].filter((f) => /\.(js|jsx|html)$/.test(f))) {
  replaceInFile(file, claimReplacements);
}

// Remove unsupported first-person claims from editorial pages.
const blogReplacements = [
  [/Les témoignages d'autres clients sont la meilleure indication de la qualité du travail\./g, "Les avis peuvent apporter un signal utile, mais ils ne remplacent pas votre propre vérification du professionnel et du devis."],
  [/Chaque profil indique clairement la disponibilité de l'artisan\./g, "Lorsqu'une information de disponibilité est publiée, vérifiez-la directement avec le professionnel."],
  [/Sur Snay3i\.ma, tous les plombiers sont évalués par leurs clients réels\./g, "Les avis éventuels dépendent des informations effectivement publiées sur chaque profil."],
  [/Sur Snay3i\.ma, trouvez des électriciens vérifiés dans votre ville\./g, "Sur Snay3i.ma, recherchez des électriciens par ville et vérifiez les informations disponibles sur chaque profil."],
  [/Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission\./g, "Les résultats disponibles dépendent des professionnels actuellement référencés. Comparez les informations et contactez directement les professionnels pertinents."],
  [/40% des demandes sur Snay3i\.ma/g, "une part importante des demandes peut concerner"],
  [/la deuxième demande la plus fréquente/g, "une demande courante"],
  [/le plus fréquent/g, "un cas courant"],
];
const blogFile = path.join(SRC, 'Blog.js');
if (fs.existsSync(blogFile)) {
  let text = fs.readFileSync(blogFile, 'utf8');
  for (const [pattern, replacement] of blogReplacements) text = text.replace(pattern, replacement);
  fs.writeFileSync(blogFile, text, 'utf8');
}

// Keep only a small, strong editorial set indexable. Service/city pages remain available to users,
// but are noindex unless they are explicitly curated below with genuinely differentiated value.
const curatedServiceCities = new Set([
  'artisan/plombier/casablanca',
  'artisan/plombier/rabat',
  'artisan/electricien/casablanca',
  'artisan/electricien/rabat',
  'artisan/macon/casablanca',
  'artisan/peintre/casablanca',
  'artisan/menuisier/casablanca',
  'artisan/climatisation/casablanca',
  'artisan/serrurier/casablanca',
  'artisan/carreleur/casablanca',
]);

for (const file of walk(SEO).filter((f) => f.endsWith('/index.html') || path.basename(f) === 'index.html')) {
  const rel = path.relative(SEO, file).split(path.sep).join('/');
  if (!rel.startsWith('artisan/') || !rel.endsWith('/index.html')) continue;
  const route = rel.slice(0, -'/index.html'.length);
  let html = fs.readFileSync(file, 'utf8');
  const desired = curatedServiceCities.has(route) ? 'index,follow' : 'noindex,follow';
  if (/<meta name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta name=["']robots["'][^>]*>/i, `<meta name="robots" content="${desired}">`);
  } else {
    html = html.replace('</head>', `<meta name="robots" content="${desired}">\n</head>`);
  }
  fs.writeFileSync(file, html, 'utf8');
}

console.log('[AdSense hardening] sanitized unsupported public claims and curated service/city indexability');
