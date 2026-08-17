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

// Editorial cleanup: remove unsupported statistics, absolute promises, and outdated platform claims.
const blogClaims = [
  ["Les fuites d'eau représentent 40% des demandes sur Snay3i.ma.", "Les fuites d'eau font partie des problèmes courants de plomberie et peuvent avoir plusieurs causes."],
  ["Un plombier expérimenté peut diagnostiquer et réparer en moins d'une heure dans la plupart des cas.", "Le délai de diagnostic et de réparation dépend de la cause, de l'installation et de l'accès au problème."],
  ["Les prix à Casablanca et Rabat sont généralement 15-25% plus élevés qu'en province.", "Les tarifs peuvent varier sensiblement selon la ville, le quartier, l'urgence, les matériaux et la complexité des travaux."],
  ['Un acompte de 30% maximum est acceptable.', "Convenez d'un échéancier de paiement lié à l'avancement des travaux et précisé dans le devis."],
  ['Sur Snay3i.ma, tous les plombiers sont évalués par leurs clients réels.', 'Sur Snay3i.ma, consultez les informations et les avis disponibles sur les profils avant de contacter un professionnel.'],
  ['Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission.', 'Consultez les professionnels disponibles dans votre ville et contactez-les directement — sans intermédiaire et sans commission.'],
  ['Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc.', "Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès et d'autres villes selon les professionnels référencés."],
  ['Sur Snay3i.ma, trouvez des électriciens vérifiés dans votre ville. Chaque profil affiche:', 'Sur Snay3i.ma, trouvez des électriciens dans votre ville. Chaque profil peut afficher:'],
  ["Minimum 6 mois sur la main d'œuvre. Pour les nouvelles installations, demandez 1 an.", "La durée de garantie dépend de l'artisan, du devis et de la nature des travaux. Demandez que toute garantie proposée soit indiquée par écrit."],
  ["Légalement oui, mais c'est déconseillé sauf si vous avez des compétences en électricité. Les erreurs peuvent être fatales.", "Pour les travaux électriques présentant un risque, faites appel à un professionnel compétent et vérifiez les exigences applicables avant toute intervention. Les erreurs peuvent provoquer un incendie ou une électrocution."],
  ['Une rénovation bien faite peut augmenter la valeur de votre bien de 20 à 40%.', "Une rénovation peut améliorer le confort et, selon le projet et le marché local, contribuer à la valeur du bien."],
  ["Une bonne isolation, une climatisation efficace et une installation électrique optimisée peuvent réduire vos factures de 30 à 50%.", "Une bonne isolation et des équipements efficaces peuvent contribuer à réduire la consommation d'énergie, selon l'état initial du logement et les usages."],
  ['Ils surviennent dans 90% des projets de rénovation.', "Ils sont fréquents dans les projets de rénovation, notamment lorsque l'état réel du logement n'est découvert qu'après le début des travaux."],
  ["Ne payez jamais tout à l'avance. Échelonnez les paiements selon l'avancement: 30% au démarrage, 40% à mi-travaux, 30% à la réception.", "Évitez de tout payer à l'avance. Prévoyez des paiements par étapes liés à l'avancement et clairement définis dans le devis."],
  ["Ne payez pas tout à l'avance. Un acompte de 30% au démarrage, 40% à mi-travaux, 30% à la réception finale.", "Évitez de tout payer à l'avance. Convenez de paiements par étapes et conditionnez le solde à la réception des travaux prévue au devis."],
  ['La centrale prend 30-40% de commission.', 'Certaines plateformes ou intermédiaires peuvent facturer des frais de mise en relation: vérifiez toujours les conditions et les frais avant de vous engager.'],
  ["Un enduit proposé à 30 MAD/m² alors que le marché est à 70-100 MAD cache forcément quelque chose — épaisseur insuffisante, matériaux de mauvaise qualité, ou le prix ne comprend pas la main d'œuvre.", "Un devis nettement inférieur aux autres mérite d'être vérifié: demandez ce qui est inclus, l'épaisseur prévue, les matériaux et la main-d'œuvre."],
  ["Ne jamais payer plus de 30% à l'avance pour les gros travaux. Échelonnez: 30% démarrage, 40% mi-travaux, 30% réception.", "Pour les gros travaux, évitez de tout payer à l'avance et définissez un échéancier lié aux étapes prévues au devis."],
  ['Plus de 100 professionnels vérifiés dans 21 villes du Maroc.', 'Des professionnels référencés dans plusieurs villes du Maroc, selon les disponibilités affichées sur la plateforme.'],
  ['plus de 100 professionnels vérifiés dans 21 villes du Maroc.', 'des professionnels référencés dans plusieurs villes du Maroc, selon les disponibilités affichées sur la plateforme.'],
  ['plus de 100 artisans disponibles.', 'des artisans référencés selon les disponibilités affichées sur la plateforme.'],
  ['plus de 100 artisans dans 21 villes du Maroc.', 'des professionnels référencés dans plusieurs villes du Maroc.'],
  ['## علاشa Snay3i.ma هي الحل؟', '## علاش Snay3i.ma هي الحل؟'],
  ['أكثر من 100 معلم في 21 مدينة فالمغرب.', 'مهنيون وصنايعية متوفرون حسب المدينة والخدمة المعروضة على المنصة.'],
  ['على Snay3i.ma، كل صنايعي عندو تقييمات من زبائن حقيقيين.', 'على Snay3i.ma، شوف المعلومات والتقييمات المتوفرة فكل بروفايل قبل ما تتاصل بالمهني.'],
  ['هاد الخطوات الأربعة كافية باش تلقى أحسن صنايعي فمدينتك.', 'هاد الخطوات كيساعدوك تقارن وتختار الصنايعي اللي مناسب للحاجة ديالك فمدينتك.'],

  // Factual/editorial accuracy pass: remove unsupported local-market generalisations.
  ['Casablanca et Rabat affichent des tarifs 20-30% plus élevés que les villes moyennes. Dans les quartiers résidentiels haut de gamme comme Anfa ou Agdal, comptez encore 10-15% de plus.', "Les tarifs varient selon la ville, le quartier, l'urgence, les matériaux, l'expérience et la complexité du chantier. Demandez plusieurs devis comparables avant de conclure."],
  ['Une intervention d\'urgence la nuit ou le week-end coûte entre 50% et 100% de plus qu\'une intervention normale. C\'est le prix de la disponibilité immédiate.', "Une intervention d'urgence peut être majorée, mais la hausse dépend du professionnel et des conditions convenues. Demandez le tarif ou l'estimation avant le déplacement."],
  ['Un électricien certifié avec 15 ans d\'expérience facture plus cher mais offre de bien meilleures garanties qu\'un débutant.', "L'expérience peut influencer le tarif et la capacité à traiter certains chantiers. Vérifiez surtout l'expérience pertinente, les références et les conditions proposées."],
  ['Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc.', "Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès et d'autres villes selon les professionnels référencés."],
  ["**Faut-il un permis pour les travaux électriques?** Pour les gros travaux, un permis est requis auprès de la municipalité. Votre électricien doit vous en informer.", "**Faut-il une autorisation pour des travaux?** Cela dépend de la nature du chantier et des règles d'urbanisme applicables. Au Maroc, les demandes d'autorisations territoriales sont centralisées via le guichet national Rokhas; pour un projet important ou une modification du bâti, vérifiez la procédure avant de commencer."],
  ["**## Les tarifs d'un électricien au Maroc en 2026**", "**## Les tarifs d'un électricien au Maroc en 2026**\n\n*Les montants ci-dessous sont des repères indicatifs, non des tarifs officiels. Le prix réel dépend du chantier, du déplacement, des matériaux et du professionnel. Comparez des devis décrivant exactement les mêmes travaux.*"],
  ["**## Tableau des tarifs par type d'intervention**", "**## Tableau des tarifs par type d'intervention**\n\n*Repères indicatifs: demandez un devis écrit et vérifiez si les matériaux, le déplacement et la main-d'œuvre sont inclus.*"],
  ["Pour les gros travaux, un permis est requis auprès de la municipalité.", "Pour certains travaux de construction, de rénovation ou de modification du bâti, une autorisation peut être nécessaire. Vérifiez les règles d'urbanisme applicables à votre commune avant le chantier."],
  ['La cuisine ouverte sur le séjour est très demandée dans les appartements modernes de Casablanca et Rabat.', "La cuisine ouverte est une option courante dans certains projets résidentiels contemporains, mais le choix dépend de la configuration, des usages et du budget."],
  ["Les panneaux solaires connaissent un essor important, surtout à Agadir et Marrakech où l'ensoleillement est exceptionnel.", "Les panneaux solaires peuvent être pertinents pour certains logements, selon l'ensoleillement local, la consommation et le type d'installation. Une étude du site est préférable avant de budgéter."],
  ['Le Maroc offre une richesse unique en termes de carrelage, mélangeant traditions ancestrales et matériaux modernes:', 'Le marché marocain propose des solutions traditionnelles et modernes, avec des matériaux et techniques adaptés à différents usages:'],
  ['Au Maroc, comme partout, il existe malheureusement des arnaqueurs dans le secteur de la plomberie.', 'Comme pour tout service à domicile, restez vigilant face aux devis incomplets, aux changements de prix non annoncés ou aux demandes de paiement inhabituelles.'],
  ['Une fuite dans un mur peut pourrir la structure.', 'Une fuite dans un mur peut provoquer des dommages aux matériaux et favoriser l’humidité; une évaluation rapide permet de limiter les dégâts.'],
  ['Un robinet qui fuit peut gaspiller jusqu\'à 150 litres d\'eau par jour.', 'La quantité d\'eau perdue par un robinet qui fuit dépend fortement du débit et de la durée de la fuite; corrigez rapidement la fuite pour limiter le gaspillage.'],
];

let blogContent = fs.readFileSync(file, 'utf8');
for (const [from, to] of blogClaims) {
  if (blogContent.includes(from)) {
    blogContent = blogContent.split(from).join(to);
  }
}

// Add one concise Morocco-specific source note to electrical guidance when the target section exists.
const electricalSourceNote = "\n\n**Repère officiel:** les installations électriques basse tension au Maroc sont encadrées par des normes marocaines publiées par l'IMANOR, notamment la NM 06.1.100 et les normes associées de protection et de vérification. Pour un chantier présentant un enjeu de sécurité, demandez à un professionnel de vérifier la conformité de l'installation.\n";
if (!blogContent.includes("**Repère officiel:** les installations électriques basse tension au Maroc")) {
  blogContent = blogContent.replace(
    "## Les risques d'un mauvais électricien\n",
    electricalSourceNote + "\n## Les risques d'un mauvais électricien\n"
  );
}

// Add a consumer-rights reminder to articles that recommend quotes, prices or guarantees.
const consumerNote = "\n\n**Bon réflexe consommateur:** au Maroc, la loi n°31-08 encadre la protection du consommateur et le droit à une information claire et objective avant la conclusion d'un contrat. Demandez que le prix, les conditions de vente et toute garantie proposée soient clairement indiqués.\n";
if (!blogContent.includes("**Bon réflexe consommateur:** au Maroc, la loi n°31-08")) {
  blogContent = blogContent.replace(
    "## Les erreurs à éviter avec un maçon\n",
    consumerNote + "\n## Les erreurs à éviter avec un maçon\n"
  );
}

fs.writeFileSync(file, blogContent, 'utf8');
console.log('Blog editorial cleanup applied');
