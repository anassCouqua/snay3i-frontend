const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Pages.js');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  [/Le réseau des artisans marocains vérifiés\. \+200 artisans dans 21 villes\./g, 'Le réseau des professionnels référencés au Maroc. Consultez les profils disponibles et contactez directement les professionnels.'],
  [/artisans vérifiés dans 35 villes du Maroc/g, 'professionnels locaux disponibles au Maroc'],
  [/artisans vérifiés/g, 'professionnels locaux'],
  [/100\+', 'Profils'],
  [/35'\s*,\s*l:'Villes couvertes'/g, "'Plusieurs',l:'Villes proposées'"],
  [/Aujourd'hui, Snay3i\.ma référence plus de 100 professionnels dans 21 villes du Maroc,[\s\S]*?pour encore plus de facilité\./g, "Aujourd'hui, Snay3i.ma référence des professionnels dans plusieurs villes du Maroc. La plateforme permet de consulter les informations disponibles en français et en arabe et de contacter directement les professionnels."],
  [/avec une application iOS et Android pour encore plus de facilité\./g, ''],
  [/Tous nos artisans sont vérifiés et notés par leurs clients\. Consultez les avis avant d'appeler\./g, 'Consultez les informations disponibles sur chaque profil et les avis lorsqu’ils sont proposés avant de contacter un professionnel.'],
  [/Trouvez votre artisan en moins de 30 secondes\. Appelez directement, intervenez rapidement\./g, 'Recherchez par service et par ville, puis contactez directement le professionnel qui correspond à votre besoin.'],
  [/Rejoignez \+200 professionnels sur Snay3i\.ma — gratuit et sans commission/g, 'Rejoignez la communauté de professionnels sur Snay3i.ma — gratuit et sans commission'],
  [/35 villes au Maroc:[^'\n]*?Dakhla\./g, 'Les villes disponibles évoluent avec les professionnels référencés. Consultez les résultats par ville directement sur la plateforme.'],
  [/Notre équipe vous répond dans les 24 heures\./g, 'Contactez-nous et nous vous répondrons dès que possible.'],
  [/Nous traiterons votre demande dans les 24 heures\./g, 'Nous traiterons votre demande dans les meilleurs délais.'],
  [/notre plateforme disponible sur snay3i\.ma et nos applications mobiles\./g, 'notre plateforme disponible sur snay3i.ma.'],
];

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Remaining trust and product claims normalized');
