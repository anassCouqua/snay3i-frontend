const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Pages.js');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ['Le réseau des artisans marocains vérifiés. +200 artisans dans 21 villes. 🇲🇦', 'Le réseau des professionnels référencés au Maroc. Consultez les profils et contactez directement les professionnels disponibles. 🇲🇦'],
  ["Snay3i.ma est la plateforme marocaine qui connecte les clients avec des artisans vérifiés dans 35 villes du Maroc. Notre mission: rendre l\\'accès aux services à domicile simple, rapide et gratuit.", "Snay3i.ma est une plateforme marocaine qui connecte les clients avec des artisans et professionnels locaux. Notre mission: rendre l'accès aux services à domicile simple, pratique et accessible."],
  ['directement les clients avec des artisans vérifiés — sans intermédiaire, sans commission, sans complications.', 'directement les clients avec des professionnels locaux — sans intermédiaire, sans commission, sans complications.'],
  ["{n:'100+',l:'Maalems vérifiés'}", "{n:'Profils',l:'Professionnels référencés'}"],
  ["{n:'35',l:'Villes couvertes'}", "{n:'Plusieurs',l:'Villes proposées'}"],
  ["Aujourd'hui, Snay3i.ma référence plus de 100 professionnels dans 21 villes du Maroc, \n            de Tanger à Dakhla. La plateforme est disponible en français et en arabe, \n            avec une application iOS et Android pour encore plus de facilité.", "Aujourd'hui, Snay3i.ma référence des professionnels dans plusieurs villes du Maroc, avec des informations en français et en arabe pour faciliter la recherche et la prise de contact."],
  ["['🤝','Confiance','Tous nos artisans sont vérifiés et notés par leurs clients. Consultez les avis avant d\\'appeler.']", "['🤝','Confiance','Consultez les informations disponibles sur chaque profil et les avis lorsqu\\'ils sont proposés avant de contacter un professionnel.']"],
  ["['⚡','Rapidité','Trouvez votre artisan en moins de 30 secondes. Appelez directement, intervenez rapidement.']", "['⚡','Rapidité','Recherchez par service et par ville, puis contactez directement le professionnel qui correspond à votre besoin.']"],
  ['Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission', 'Rejoignez la communauté de professionnels sur Snay3i.ma — gratuit et sans commission'],
  ['Une question, un problème ou une suggestion? Notre équipe vous répond dans les 24 heures.', 'Une question, un problème ou une suggestion? Contactez-nous et nous vous répondrons dès que possible.'],
  ['Nous traiterons votre demande dans les 24 heures.', 'Nous traiterons votre demande dans les meilleurs délais.'],
  ['35 villes au Maroc: Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, Meknès, Oujda et bien plus — de Tanger à Dakhla.', 'Les villes disponibles évoluent avec les professionnels référencés. Consultez les résultats par ville directement sur la plateforme.'],
];

for (const [from, to] of replacements) {
  content = content.split(from).join(to);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Public page claim cleanup applied');
