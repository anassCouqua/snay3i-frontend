const fs = require('fs');
const path = require('path');

const files = [
  'src/App.js',
  'src/LandingPage.js',
  'src/Pages.js',
  'src/Blog.js',
  'src/index.html',
].map((p) => path.resolve(process.cwd(), p));

const replacements = [
  ['artisans vérifiés', 'professionnels référencés'],
  ['Artisans vérifiés', 'Professionnels référencés'],
  ['artisans vérifié', 'professionnels référencé'],
  ['Artisans vérifié', 'Professionnels référencé'],
  ['Maalems vérifiés', 'Maalems référencés'],
  ['Maalems vérifié', 'Maalems référencé'],
  ['tous les artisans sont vérifiés', 'les profils présentent les informations disponibles sur chaque professionnel'],
  ['Tous nos artisans sont vérifiés', 'Les informations de chaque profil doivent être vérifiées avant intervention'],
  ['Tous les artisans sont vérifiés', 'Les informations de chaque profil doivent être vérifiées avant intervention'],
  ['Tous les artisans sont vérifiés et notés par leurs clients.', 'Consultez les informations et avis réellement affichés sur chaque profil.'],
  ['Artisans vérifiés et notés', 'Informations de profil et avis disponibles'],
  ['Tous les professionnels sont vérifiés', 'Les informations de chaque profil sont à vérifier avant intervention'],
  ['disponibles 24h/24', 'dont les horaires peuvent varier selon le professionnel'],
  ['disponibles rapidement, parfois en urgence 24h.', 'dont la disponibilité dépend du professionnel et du type d’intervention.'],
  ['+200 professionnels', 'professionnels référencés'],
  ['+200 artisans', 'professionnels référencés'],
  ['100+\',l:\'Maalems vérifiés\'', '100+\',l:\'Maalems référencés\''],
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  let updated = original;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }
  if (updated !== original) fs.writeFileSync(file, updated);
}
