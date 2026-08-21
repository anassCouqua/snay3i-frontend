const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Pages.js');
let source = fs.readFileSync(file, 'utf8');

const replacements = [
  [
    "Le réseau des artisans marocains vérifiés. +200 artisans dans 21 villes. 🇲🇦",
    "Une plateforme marocaine pour rechercher des professionnels et services à domicile. 🇲🇦"
  ],
  [
    "Snay3i.ma est la plateforme marocaine qui connecte les clients avec des artisans vérifiés dans 35 villes du Maroc. Notre mission: rendre l\\'accès aux services à domicile simple, rapide et gratuit.",
    "Snay3i.ma aide les particuliers à rechercher des professionnels pour les travaux et services à domicile au Maroc. Notre mission : rendre la recherche plus simple et plus claire."
  ],
  [
    "directement les clients avec des artisans vérifiés — sans intermédiaire, sans commission, sans complications.",
    "directement les clients avec les professionnels présentés sur la plateforme. Les informations, tarifs et disponibilités doivent être confirmés avec le professionnel."
  ],
  [
    "{n:'100+',l:'Maalems vérifiés'},",
    "{n:'',l:'Professionnels référencés'},"
  ],
  [
    "{n:'35',l:'Villes couvertes'},",
    "{n:'',l:'Villes et zones selon les données disponibles'},"
  ],
  [
    "Aujourd'hui, Snay3i.ma référence plus de 100 professionnels dans 21 villes du Maroc, \n            de Tanger à Dakhla. La plateforme est disponible en français et en arabe, \n            avec une application iOS et Android pour encore plus de facilité.",
    "Snay3i.ma développe progressivement sa couverture au Maroc. La plateforme est disponible en français et en arabe. Les catégories et zones disponibles évoluent selon les informations présentes sur la plateforme."
  ],
  [
    "['🤝','Confiance','Tous nos artisans sont vérifiés et notés par leurs clients. Consultez les avis avant d\\'appeler.'],",
    "['🤝','Confiance','Consultez les informations disponibles sur chaque profil et vérifiez directement avec le professionnel les éléments importants avant une prestation.'],"
  ],
  [
    "['⚡','Rapidité','Trouvez votre artisan en moins de 30 secondes. Appelez directement, intervenez rapidement.'],",
    "['⚡','Simplicité','Recherchez par métier et par ville, puis contactez directement le professionnel lorsque les coordonnées sont disponibles.'],"
  ],
  [
    "Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission",
    "Présentez vos services sur Snay3i.ma et laissez les clients vous contacter selon les informations de votre profil."
  ],
  [
    "Aucune donnée personnelle n'est collectée. Pas de cookies publicitaires.",
    "Le site peut traiter des données techniques nécessaires à son fonctionnement et utiliser des services de mesure, de consentement ou de publicité lorsqu'ils sont activés. Les règles applicables et les choix de consentement sont présentés dans les messages et informations de confidentialité du site."
  ],
  [
    "Uniquement des cookies techniques nécessaires au fonctionnement. Pas de tracking publicitaire.",
    "Des cookies ou technologies similaires peuvent être utilisés pour le fonctionnement, la mesure d'audience et, lorsque le consentement requis est obtenu, la publicité. Consultez les informations de confidentialité et les choix de consentement disponibles sur le site."
  ],
  [
    "Snay3i.ma est une plateforme marocaine de mise en relation entre particuliers et artisans professionnels.",
    "Snay3i.ma est une plateforme marocaine de recherche et de mise en relation entre particuliers et professionnels."
  ]
];

for (const [from, to] of replacements) {
  source = source.split(from).join(to);
}

fs.writeFileSync(file, source);
console.log('Legal and trust copy hardened.');
