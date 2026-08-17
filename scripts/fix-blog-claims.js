const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  [/Les fuites d'eau\*\* représentent 40% des demandes sur Snay3i\.ma\./g, "Les fuites d'eau font partie des problèmes de plomberie couramment rencontrés dans les logements."],
  [/Un plombier expérimenté peut diagnostiquer et réparer en moins d'une heure dans la plupart des cas\./g, 'La durée du diagnostic et de la réparation dépend de la cause de la panne, de son accessibilité et des pièces nécessaires.'],
  [/Les prix à Casablanca et Rabat sont généralement 15-25% plus élevés qu'en province\./g, 'Les prix peuvent varier sensiblement selon la ville, le quartier, la complexité du travail et les frais de déplacement.'],
  [/Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission\./g, 'Consultez les professionnels disponibles dans votre ville et comparez les informations avant de prendre contact.'],
  [/Sur Snay3i\.ma, tous les plombiers sont évalués par leurs clients réels\. Un artisan avec de mauvaises pratiques ne peut pas se maintenir longtemps sur notre plateforme\./g, 'Les avis, lorsqu’ils sont disponibles sur un profil, peuvent aider à compléter votre propre vérification.'],
  [/Un acompte de 30% maximum est acceptable\. Le reste doit être payé après votre satisfaction complète\./g, 'Clarifiez les modalités de paiement dans le devis et évitez de payer la totalité avant d’avoir compris les conditions de la prestation.'],
  [/Sur Snay3i\.ma, trouvez des plombiers vérifiés dans votre ville\./g, 'Sur Snay3i.ma, consultez les profils de plombiers disponibles dans votre ville.'],
  [/Les électriciens au Maroc peuvent varier du simple au triple selon plusieurs facteurs:/g, 'Les tarifs des électriciens peuvent varier fortement selon plusieurs facteurs:'],
  [/Les tarifs des électriciens au Maroc peuvent varier du simple au triple selon plusieurs facteurs:/g, 'Les tarifs des électriciens peuvent varier fortement selon plusieurs facteurs:'],
  [/Casablanca et Rabat affichent des tarifs 20-30% plus élevés que les villes moyennes\./g, 'Les tarifs peuvent différer entre grandes villes, villes moyennes et quartiers, notamment en fonction du déplacement et du type d’intervention.'],
  [/Dans les quartiers résidentiels haut de gamme comme Anfa ou Agdal, comptez encore 10-15% de plus\./g, 'Le quartier peut aussi influencer le coût du déplacement et les conditions d’intervention.'],
  [/Un électricien certifié avec 15 ans d'expérience facture plus cher mais offre de bien meilleures garanties qu'un débutant\./g, 'L’expérience, les qualifications et la nature du travail sont des éléments utiles à comparer ; le prix seul ne permet pas de juger la qualité.'],
  [/Sur Snay3i\.ma, trouvez des électriciens vérifiés dans votre ville\./g, 'Sur Snay3i.ma, consultez les profils d’électriciens disponibles dans votre ville.'],
  [/Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc\./g, 'Les disponibilités varient selon les professionnels référencés et les villes proposées sur la plateforme.'],
  [/\*\*Faut-il un permis pour les travaux électriques\?\*\* Pour les gros travaux, un permis est requis auprès de la municipalité\. Votre électricien doit vous en informer\./g, '**Faut-il une autorisation pour les travaux électriques?** Cela dépend de la nature des travaux et des règles applicables. Vérifiez le cadre administratif local et, pour les travaux importants, faites appel à un professionnel qualifié.'],
  [/\*\*Quelle garantie exiger\?\*\* Minimum 6 mois sur la main d'œuvre\. Pour les nouvelles installations, demandez 1 an\./g, '**Quelle garantie demander?** Faites préciser par écrit toute garantie proposée par le professionnel et vérifiez ce qu’elle couvre, sa durée et ses exclusions.'],
  [/\*\*Peut-on faire les petits travaux soi-même\?\*\* Légalement oui, mais c'est déconseillé sauf si vous avez des compétences en électricité\. Les erreurs peuvent être fatales\./g, '**Peut-on faire de petits travaux soi-même?** Pour l’électricité, privilégiez la sécurité : coupez l’alimentation et faites intervenir un professionnel lorsque la tâche dépasse vos compétences ou présente un risque.'],
  [/Une rénovation bien faite peut augmenter la valeur de votre bien de 20 à 40%\./g, 'Une rénovation peut améliorer l’attrait et l’usage d’un logement, mais l’effet sur sa valeur dépend du bien, de son emplacement, de l’état initial et du marché local.'],
  [/peuvent réduire vos factures de 30 à 50%\./g, 'peuvent contribuer à réduire la consommation d’énergie, selon le logement, les équipements et les habitudes.'],
  [/30% au démarrage, 40% à mi-travaux, 30% à la réception/g, 'selon l’avancement des travaux et les conditions prévues au devis'],
  [/Un acompte de 30% au démarrage, 40% à mi-travaux, 30% à la réception finale\./g, 'Prévoyez des paiements liés à l’avancement réel des travaux et aux conditions écrites du devis.'],
  [/Ne jamais payer plus de 30% à l'avance pour les gros travaux\. Échelonnez: 30% démarrage, 40% mi-travaux, 30% réception\./g, 'Évitez de payer la totalité avant le début des travaux et définissez des paiements liés à l’avancement et au devis.'],
  [/Un électricien travaillant principalement dans le Maarif ou Anfa facturera 30-40% de plus qu'un électricien de Hay Mohammadi pour le même travail\./g, 'Le quartier peut influencer les frais de déplacement et le prix global, mais comparez toujours des devis portant sur une prestation réellement comparable.'],
  [/Une panne en pleine nuit à Casablanca peut coûter 2 à 3 fois le tarif normal\./g, 'Une intervention urgente, de nuit ou le week-end peut être facturée davantage ; demandez le tarif d’urgence avant le déplacement lorsqu’il est possible de le faire.'],
  [/Un enduit proposé à 30 MAD\/m² alors que le marché est à 70-100 MAD cache forcément quelque chose — épaisseur insuffisante, matériaux de mauvaise qualité, ou le prix ne comprend pas la main d'œuvre\./g, 'Un prix très inférieur à d’autres devis mérite des explications : vérifiez la surface, les matériaux, l’épaisseur, la préparation et ce qui est inclus dans la main-d’œuvre.'],
  [/Le "paiement total à l'avance": Ne jamais payer plus de 30% à l'avance pour les gros travaux\. Échelonnez: 30% démarrage, 40% mi-travaux, 30% réception\./g, 'Le « paiement total à l’avance » mérite de la prudence. Pour les gros travaux, définissez les paiements selon l’avancement réel et les conditions du devis.'],
  [/Sur Snay3i\.ma, trouvez des carreleurs vérifiés dans toutes les villes du Maroc\./g, 'Sur Snay3i.ma, consultez les profils de carreleurs disponibles dans les villes proposées.'],
  [/plus de 100 artisans disponibles\./g, 'les disponibilités dépendent des professionnels référencés.'],
  [/Snay3i\.ma vous connecte avec les meilleurs peintres vérifiés dans votre ville au Maroc\./g, 'Snay3i.ma vous permet de consulter les profils de peintres disponibles dans votre ville au Maroc.'],
  [/De Tanger à Dakhla, plus de 100 artisans disponibles\./g, 'Les disponibilités varient selon les professionnels référencés et les villes proposées.'],
  [/Un bon travail de peinture peut durer 7 à 10 ans — ça vaut l'investissement\./g, 'La durée d’un résultat de peinture dépend de la préparation, des matériaux, de l’usage de la pièce et des conditions du logement.'],
];

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Blog accuracy and unsupported-claim cleanup applied');
