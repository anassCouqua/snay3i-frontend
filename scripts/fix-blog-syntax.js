const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
const source = fs.readFileSync(file, 'utf8');

// Normalize single-quoted metadata properties to JSON-safe double-quoted strings.
// This prevents unescaped French apostrophes (e.g. d'intervention) from breaking Babel.
const lines = source.split('\n');
const propertyPattern = /^(\s*)(title|titleAr|description|category|emoji|date|readTime): '(.*)'(,?)\s*$/;

let changed = false;
const normalized = lines.map((line) => {
  const match = line.match(propertyPattern);
  if (!match || !match[3].includes("'")) return line;

  const [, indent, key, value, comma] = match;
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  changed = true;
  return `${indent}${key}: "${escaped}"${comma}`;
});

if (changed) {
  fs.writeFileSync(file, normalized.join('\n'), 'utf8');
  console.log('Normalized apostrophe-containing Blog.js metadata strings');
} else {
  console.log('Blog.js metadata normalization not needed');
}

// Clean platform-wide claims that are not guaranteed by the underlying data.
const trustClaims = {
  'Pages.js': [
    ['Le réseau des artisans marocains vérifiés. +200 artisans dans 21 villes. 🇲🇦', 'Le réseau des professionnels référencés au Maroc. Consultez les profils et contactez directement les professionnels disponibles. 🇲🇦'],
    ["Snay3i.ma est la plateforme marocaine qui connecte les clients avec des artisans vérifiés dans 35 villes du Maroc. Notre mission: rendre l\\'accès aux services à domicile simple, rapide et gratuit.", "Snay3i.ma est une plateforme marocaine qui connecte les clients avec des artisans et professionnels locaux. Notre mission: rendre l'accès aux services à domicile simple, pratique et accessible."],
    ['directement les clients avec des artisans vérifiés — sans intermédiaire, sans commission, sans complications.', 'directement les clients avec des professionnels locaux — sans intermédiaire, sans commission, sans complications.'],
    ["{n:'100+',l:'Maalems vérifiés'},", "{n:'Profils',l:'Professionnels référencés'},"],
    ["{n:'35',l:'Villes couvertes'},", "{n:'Au Maroc',l:'Villes proposées'},"],
    ["Aujourd'hui, Snay3i.ma référence plus de 100 professionnels dans 21 villes du Maroc, \n            de Tanger à Dakhla. La plateforme est disponible en français et en arabe, \n            avec une application iOS et Android pour encore plus de facilité.", "Aujourd'hui, Snay3i.ma référence des professionnels dans plusieurs villes du Maroc, avec des informations en français et en arabe pour faciliter la recherche et la prise de contact."],
    ["['🤝','Confiance','Tous nos artisans sont vérifiés et notés par leurs clients. Consultez les avis avant d\\'appeler.'],", "['🤝','Confiance','Consultez les informations disponibles sur chaque profil et les avis lorsqu\\'ils sont proposés avant de contacter un professionnel.'],"],
    ["['⚡','Rapidité','Trouvez votre artisan en moins de 30 secondes. Appelez directement, intervenez rapidement.'],", "['⚡','Rapidité','Recherchez par service et par ville, puis contactez directement le professionnel qui correspond à votre besoin.'],"],
    ['Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission', 'Rejoignez la communauté de professionnels sur Snay3i.ma — gratuit et sans commission'],
    ['Une question, un problème ou une suggestion? Notre équipe vous répond dans les 24 heures.', 'Une question, un problème ou une suggestion? Contactez-nous et nous vous répondrons dès que possible.'],
    ['Nous traiterons votre demande dans les 24 heures.', 'Nous traiterons votre demande dans les meilleurs délais.'],
    ['35 villes au Maroc: Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, Meknès, Oujda et bien plus — de Tanger à Dakhla.', 'Les villes disponibles évoluent avec les professionnels référencés. Consultez les résultats par ville directement sur la plateforme.'],
  ],
  'LandingPage.js': [
    ['Trouvez un ${svc.pro} vérifié à ${city} sur Snay3i.ma.', 'Trouvez un ${svc.pro} à ${city} sur Snay3i.ma.'],
    ['Trouvez un professionnel vérifié sur Snay3i.ma.', 'Trouvez un professionnel sur Snay3i.ma.'],
    ['Y a-t-il des ${svc.proPlural} disponibles 24h/24 à ${city}?', 'Y a-t-il des ${svc.proPlural} disponibles en urgence à ${city}?'],
    ["Oui, plusieurs professionnels sur Snay3i.ma proposent des interventions d'urgence 24h/24 à ${city}.", "La disponibilité en urgence dépend de chaque professionnel. Consultez son profil ou contactez-le directement pour vérifier ses horaires."],
    ["Sur Snay3i.ma, tous les ${svc.proPlural} à ${city} sont vérifiés et notés par leurs clients. Consultez les avis avant d'appeler.", "Sur Snay3i.ma, consultez les profils et les avis disponibles pour comparer les professionnels à ${city} avant d'appeler."],
    ["{n:'⭐', l:'Vérifiés'},", "{n:'⭐', l:'Avis disponibles'},"],
    ["['⭐','Artisans vérifiés et notés','Chaque professionnel est évalué par ses clients. Lisez les avis avant d\\'appeler.'],", "['⭐','Profils et avis','Consultez les informations et les avis disponibles sur chaque professionnel avant d\\'appeler.'],"],
    ["['⚡','Intervention rapide','Nos '+svc.proPlural+' à '+city+' sont disponibles rapidement, parfois en urgence 24h.'],", "['⚡','Contact direct','Contactez directement les '+svc.proPlural+' à '+city+' et vérifiez leur disponibilité avant de convenir d'une intervention.'],"],
    ["['🇲🇦','Réseau marocain','Plus de 100 artisans dans 21 villes du Maroc. Bilingue français et arabe.'],", "['🇲🇦','Réseau marocain','Une plateforme dédiée aux services artisanaux au Maroc, en français et en arabe.'],"],
    ['Tous nos {svc.proPlural} sont vérifiés, notés par leurs clients, et contactables directement par téléphone ou WhatsApp.', "Consultez les profils, les avis disponibles et les coordonnées affichées pour contacter directement les professionnels par téléphone ou WhatsApp."],
  ],
  'Blog.js': [
    ['Snay3i.ma est la plateforme marocaine qui vous connecte avec des plombiers vérifiés dans votre ville.', 'Snay3i.ma est une plateforme marocaine qui vous permet de rechercher des plombiers dans votre ville.'],
    ['Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission.', 'Consultez les professionnels disponibles dans votre ville et contactez-les directement — sans intermédiaire et sans commission.'],
    ['Sur Snay3i.ma, trouvez des électriciens vérifiés dans votre ville. Chaque profil affiche:', 'Sur Snay3i.ma, trouvez des électriciens dans votre ville. Chaque profil peut afficher:'],
    ['Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc.', "Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès et d'autres villes selon les professionnels référencés."],
    ['Sur Snay3i.ma, trouvez des carreleurs vérifiés dans toutes les villes du Maroc. Consultez leurs avis, regardez leurs photos de réalisations et contactez-les directement. Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir — plus de 100 artisans disponibles.', "Sur Snay3i.ma, recherchez des carreleurs dans votre ville. Consultez leurs avis lorsqu'ils sont disponibles, regardez leurs photos de réalisations et contactez-les directement."],
    ['Snay3i.ma vous connecte avec les meilleurs peintres vérifiés dans votre ville au Maroc. Consultez les profils, regardez les avis et appelez directement. De Tanger à Dakhla, plus de 100 artisans disponibles.', "Snay3i.ma vous permet de rechercher des peintres dans votre ville au Maroc. Consultez les profils, regardez les avis disponibles et contactez-les directement."],
  ]
};

for (const [name, pairs] of Object.entries(trustClaims)) {
  const target = path.join(process.cwd(), 'src', name);
  let content = fs.readFileSync(target, 'utf8');
  for (const [from, to] of pairs) {
    if (!content.includes(from)) throw new Error(`Trust-claim pattern not found in ${name}: ${from}`);
    content = content.split(from).join(to);
  }
  fs.writeFileSync(target, content, 'utf8');
}

console.log('Trust-claim cleanup applied to public-facing frontend copy');
