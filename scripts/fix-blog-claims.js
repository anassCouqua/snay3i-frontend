const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ["**Les fuites d'eau font partie des problèmes de plomberie couramment rencontrés dans les logements.", "Les fuites d'eau font partie des problèmes de plomberie couramment rencontrés dans les logements."],
  ["Les fuites d'eau** représentent 40% des demandes sur Snay3i.ma.", "Les fuites d'eau font partie des problèmes de plomberie couramment rencontrés dans les logements."],
  ["Un plombier expérimenté peut diagnostiquer et réparer en moins d'une heure dans la plupart des cas.", "La durée du diagnostic et de la réparation dépend de la cause de la panne, de son accessibilité et des pièces nécessaires."],
  ["Les prix à Casablanca et Rabat sont généralement 15-25% plus élevés qu'en province.", "Les tarifs peuvent varier sensiblement selon la ville, le quartier, l'urgence, les matériaux et la complexité des travaux."],
  ["Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission.", "Consultez les professionnels disponibles dans votre ville et comparez les informations avant de prendre contact."],
  ["Un plombier avec 50 avis positifs est beaucoup plus fiable qu'un inconnu trouvé sur Facebook.", "Un historique d'avis détaillé peut être utile, mais il faut aussi vérifier la nature des travaux, les informations du profil et le contexte des avis."],
  ["Sur Snay3i.ma, chaque profil indique clairement la disponibilité de l'artisan.", "Lorsque la disponibilité est renseignée sur un profil, utilisez-la comme un point à vérifier avant de confirmer le rendez-vous."],
  ["Snay3i.ma est la plateforme marocaine qui vous connecte avec des plombiers vérifiés dans votre ville.", "Snay3i.ma permet de consulter des profils de plombiers disponibles dans votre ville."],
  ["Sur Snay3i.ma, tous les plombiers sont évalués par leurs clients réels. Un artisan avec de mauvaises pratiques ne peut pas se maintenir longtemps sur notre plateforme.", "Les avis, lorsqu'ils sont disponibles sur un profil, peuvent compléter votre propre vérification du professionnel."],
  ["Un artisan avec de mauvaises pratiques ne peut pas se maintenir longtemps sur notre plateforme.", "Les informations et avis disponibles peuvent compléter votre propre vérification du professionnel."],
  ["Sur Snay3i.ma, trouvez des plombiers vérifiés dans votre ville.", "Sur Snay3i.ma, consultez les profils de plombiers disponibles dans votre ville."],
  ["Sur Snay3i.ma, trouvez des électriciens vérifiés dans votre ville.", "Sur Snay3i.ma, consultez les profils d'électriciens disponibles dans votre ville."],
  ["Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc.", "Les disponibilités varient selon les professionnels référencés et les villes proposées sur la plateforme."],
  ["Une rénovation bien faite peut augmenter la valeur de votre bien de 20 à 40%.", "Une rénovation peut améliorer l'attrait et l'usage d'un logement, mais l'effet sur sa valeur dépend du bien, de son emplacement, de l'état initial et du marché local."],
  ["peuvent réduire vos factures de 30 à 50%", "peuvent contribuer à réduire la consommation d'énergie, selon le logement, les équipements et les habitudes"],
  ["Un électricien certifié avec 15 ans d'expérience facture plus cher mais offre de bien meilleures garanties qu'un débutant.", "L'expérience, les qualifications et la nature du travail sont des éléments utiles à comparer ; le prix seul ne permet pas de juger la qualité."],
  ["Casablanca et Rabat affichent des tarifs 20-30% plus élevés que les villes moyennes.", "Les tarifs peuvent différer entre villes et quartiers, notamment en fonction du déplacement et du type d'intervention."],
  ["Dans les quartiers résidentiels haut de gamme comme Anfa ou Agdal, comptez encore 10-15% de plus.", "Le quartier peut aussi influencer le coût du déplacement et les conditions d'intervention."],
  ["Minimum 6 mois sur la main d'œuvre. Pour les nouvelles installations, demandez 1 an.", "Faites préciser par écrit toute garantie proposée par le professionnel et vérifiez ce qu'elle couvre, sa durée et ses exclusions."],
  ["Pour les gros travaux, un permis est requis auprès de la municipalité. Votre électricien doit vous en informer.", "Les autorisations dépendent de la nature des travaux et des règles locales. Pour les travaux importants, vérifiez les exigences administratives applicables."],
  ["Légalement oui, mais c'est déconseillé sauf si vous avez des compétences en électricité. Les erreurs peuvent être fatales.", "Pour l'électricité, privilégiez la sécurité : faites intervenir un professionnel lorsque la tâche dépasse vos compétences ou présente un risque."],
  ["Ne jamais payer plus de 30% à l'avance pour les gros travaux. Échelonnez: 30% démarrage, 40% mi-travaux, 30% réception.", "Évitez de payer la totalité avant le début des travaux et définissez des paiements liés à l'avancement réel et au devis."],
  ["Un électricien travaillant principalement dans le Maarif ou Anfa facturera 30-40% de plus qu'un électricien de Hay Mohammadi pour le même travail.", "Le quartier peut influencer les frais de déplacement et le prix global, mais comparez toujours des devis portant sur une prestation réellement comparable."],
  ["Une panne en pleine nuit à Casablanca peut coûter 2 à 3 fois le tarif normal.", "Une intervention urgente, de nuit ou le week-end peut être facturée davantage ; demandez le tarif d'urgence avant le déplacement lorsqu'il est possible de le faire."],
  ["Sur Snay3i.ma, trouvez des carreleurs vérifiés dans toutes les villes du Maroc.", "Sur Snay3i.ma, consultez les profils de carreleurs disponibles dans les villes proposées."],
  ["plus de 100 artisans disponibles.", "les disponibilités dépendent des professionnels référencés."],
  ["Snay3i.ma vous connecte avec les meilleurs peintres vérifiés dans votre ville au Maroc.", "Snay3i.ma vous permet de consulter les profils de peintres disponibles dans votre ville au Maroc."],
  ["De Tanger à Dakhla, plus de 100 artisans disponibles.", "Les disponibilités varient selon les professionnels référencés et les villes proposées."],
  ["Un bon travail de peinture peut durer 7 à 10 ans — ça vaut l'investissement.", "La durée d'un résultat de peinture dépend de la préparation, des matériaux, de l'usage de la pièce et des conditions du logement."]
];

for (const [from, to] of replacements) {
  content = content.split(from).join(to);
}

fs.writeFileSync(file, content, 'utf8');
console.log(`Blog factuality cleanup applied: ${replacements.length} deterministic replacements`);
