const fs = require('fs');
const path = require('path');

const files = [
  path.join(process.cwd(), 'src', 'App.js'),
  path.join(process.cwd(), 'src', 'Pages.js'),
  path.join(process.cwd(), 'src', 'LandingPage.js')
];

const replacements = [
  ['Le réseau des artisans marocains vérifiés. +200 artisans dans 21 villes. 🇲🇦', 'Une plateforme marocaine pour rechercher des professionnels et services à domicile. 🇲🇦'],
  ['La plateforme marocaine qui connecte les clients avec des artisans vérifiés dans 35 villes du Maroc.', 'La plateforme marocaine qui aide les clients à rechercher des professionnels dans différentes villes du Maroc.'],
  ['connecte les clients avec des artisans vérifiés — sans intermédiaire, sans commission, sans complications.', 'aide les clients à rechercher des professionnels et à les contacter directement lorsque leurs coordonnées sont disponibles.'],
  ["{n:'100+',l:'Maalems vérifiés'}", "{n:'100+',l:'Profils publiés'}"],
  ["['🤝','Confiance','Tous nos artisans sont vérifiés et notés par leurs clients. Consultez les avis avant d\\'appeler.']", "['🤝','Transparence','Consultez les informations publiées sur chaque profil et confirmez directement les détails avant la prestation.']"],
  ["['⚡','Rapidité','Trouvez votre artisan en moins de 30 secondes. Appelez directement, intervenez rapidement.']", "['⚡','Contact direct','Contactez directement les professionnels via les moyens affichés sur leur profil.']"],
  ['Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission', 'Créez un profil professionnel sur Snay3i.ma et présentez vos services et votre zone d’activité.'],
  ['35 villes au Maroc: Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, Meknès, Oujda et bien plus — de Tanger à Dakhla.', 'Snay3i.ma propose des catégories et des pages locales pour différentes villes du Maroc. Vérifiez les professionnels réellement disponibles dans votre zone.'],
  ["Pour les visiteurs : Aucune donnée personnelle n'est collectée. Pas de cookies publicitaires.", "Pour les visiteurs : le site peut utiliser des cookies ou technologies de mesure et de publicité selon les services activés et les choix de consentement de l'utilisateur."],
  ['Uniquement des cookies techniques nécessaires au fonctionnement. Pas de tracking publicitaire.', 'Des cookies techniques et, lorsque les services correspondants sont activés avec le consentement requis, des technologies de mesure ou de publicité peuvent être utilisées.'],
  ['La plateforme est entièrement gratuite, aussi bien pour les clients que pour les artisans.', 'La plateforme est destinée à faciliter la recherche et la mise en relation. Toute condition tarifaire applicable doit être vérifiée sur la plateforme et avec le professionnel.'],
  ['tous nos artisans sont vérifiés', 'les informations publiées sur les profils peuvent être consultées'],
  ['artisans vérifiés', 'professionnels référencés'],
  ['artisans de confiance', 'professionnels référencés'],
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let source = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) source = source.split(from).join(to);
  fs.writeFileSync(file, source);
}

console.log('Trust and legal consistency hardening applied.');
