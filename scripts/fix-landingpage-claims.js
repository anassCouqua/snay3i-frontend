const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'LandingPage.js');
let source = fs.readFileSync(file, 'utf8');

const replacements = [
  ["Trouvez un ${svc.pro} vérifié à ${city} sur Snay3i.ma. Professionnels disponibles, appelez directement sans intermédiaire. Devis gratuit 🇲🇦", "Recherchez un ${svc.pro} à ${city} sur Snay3i.ma. Consultez les informations disponibles et contactez directement le professionnel pour préciser votre besoin et demander un devis. 🇲🇦"],
  ["${svc.desc} à ${city}. Trouvez un professionnel vérifié sur Snay3i.ma.", "${svc.desc} à ${city}. Consultez les informations disponibles sur les profils et contactez directement le professionnel."],
  ["Oui, plusieurs professionnels sur Snay3i.ma proposent des interventions d'urgence 24h/24 à ${city}.", "La disponibilité dépend de chaque professionnel. Vérifiez directement les horaires et les conditions d'intervention avant de vous déplacer ou de demander un rendez-vous."],
  ["Sur Snay3i.ma, tous les ${svc.proPlural} à ${city} sont vérifiés et notés par leurs clients. Consultez les avis avant d'appeler.", "Consultez les informations réellement affichées sur chaque profil et posez vos questions au professionnel avant de confirmer la prestation."],
  ["Artisans vérifiés et notés", "Informations de profil pour comparer"],
  ["Chaque professionnel est évalué par ses clients. Lisez les avis avant d\\'appeler.", "Les informations disponibles sur chaque profil peuvent vous aider à comparer les professionnels avant de les contacter."],
  ["Intervention rapide", "Contact direct"],
  ["Nos '+svc.proPlural+' à '+city+' sont disponibles rapidement, parfois en urgence 24h.", "Contactez directement les professionnels à ${city} pour vérifier leur disponibilité et leurs délais d'intervention."],
  ["Plus de 100 artisans dans 21 villes du Maroc. Bilingue français et arabe.", "Une plateforme marocaine pour rechercher des professionnels et services à domicile."],
  ["Gratuit pour les clients, sans intermédiaire, sans commission.", "La mise en relation et les conditions éventuelles doivent être vérifiées sur la plateforme et avec le professionnel."],
  ["Tous nos ${svc.proPlural} sont vérifiés, notés par leurs clients, et contactables directement par téléphone ou WhatsApp.\n            Gratuit pour les clients, sans intermédiaire, sans commission.", "Consultez les informations disponibles sur les profils puis contactez directement le professionnel par les moyens affichés. Vérifiez les tarifs, la disponibilité et les éventuels frais avant les travaux."],
  ["Nos professionnels à ${city} sont disponibles rapidement.", "La disponibilité varie selon chaque professionnel. Vérifiez directement avant de confirmer la prestation."],
  ["Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission", "Créez un profil professionnel sur Snay3i.ma pour présenter vos services et votre zone d'activité."],
  ["Rejoignez +200 professionnels sur Snay3i.ma — gratuit et sans commission", "Présentez vos services sur Snay3i.ma et laissez les clients vous contacter selon les informations de votre profil."],
];

for (const [from, to] of replacements) {
  source = source.split(from).join(to);
}

fs.writeFileSync(file, source);
console.log('LandingPage trust/content claims hardened.');
