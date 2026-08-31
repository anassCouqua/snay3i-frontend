const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd());
const blogPath = path.join(root, 'src', 'Blog.js');
const htmlRoots = [path.join(root, 'public', 'blog'), path.join(root, 'public', 'seo')];

const rules = [
  [/Les fuites d'eau\*\* représentent 40% des demandes sur Snay3i\.ma\./g, "Les fuites d'eau** font partie des problèmes de plomberie courants. Nous ne publions pas de pourcentage de demandes sans données internes vérifiables."],
  [/Avec plus de 100 artisans dans 21 villes du Maroc, vous trouverez rapidement le bon professionnel — sans intermédiaire et sans commission\./g, "Utilisez Snay3i.ma pour rechercher les professionnels actuellement proposés dans votre ville et vérifiez directement la disponibilité, le prix et les conditions de la prestation."],
  [/Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès — plus de 100 artisans dans 21 villes du Maroc\./g, "La disponibilité des professionnels varie selon la ville et évolue dans le temps. Consultez les résultats disponibles pour votre zone."],
  [/Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir — plus de 100 artisans disponibles\./g, "La disponibilité des carreleurs varie selon la ville. Consultez les professionnels actuellement proposés dans votre zone."],
  [/Sur Snay3i\.ma, tous les plombiers sont évalués par leurs clients réels\. Un artisan avec de mauvaises pratiques ne peut pas se maintenir longtemps sur notre plateforme\./g, "Lorsque des avis clients sont disponibles sur un profil Snay3i.ma, consultez-les avec attention. Confirmez toujours directement les références, le devis et les conditions de l'intervention."],
  [/Sur Snay3i\.ma, chaque profil indique clairement la disponibilité de l'artisan\./g, "Lorsque la disponibilité est affichée sur un profil, vérifiez-la directement avec l'artisan avant de convenir d'un rendez-vous."],
  [/Sur Snay3i\.ma, trouvez des plombiers vérifiés dans votre ville\./g, "Sur Snay3i.ma, recherchez les plombiers proposés dans votre ville et vérifiez les informations disponibles sur chaque profil."],
  [/Sur Snay3i\.ma, trouvez des électriciens vérifiés dans votre ville\./g, "Sur Snay3i.ma, recherchez les électriciens proposés dans votre ville et vérifiez les informations disponibles sur chaque profil."],
  [/Sur Snay3i\.ma, trouvez des carreleurs vérifiés dans toutes les villes du Maroc\./g, "Sur Snay3i.ma, recherchez les carreleurs proposés dans votre ville et comparez les informations disponibles sur leurs profils."],
  [/Chaque profil affiche:\n- Le nombre d'années d'expérience\n- La note moyenne des clients\n- Le nombre d'avis\n- La disponibilité \(urgence ou non\)\n- La localisation exacte/g, "Les informations affichées dépendent des données disponibles sur chaque profil. Vérifiez directement avec le professionnel les points importants avant de réserver."],
  [/Un plombier avec 50 avis positifs est beaucoup plus fiable qu'un inconnu trouvé sur Facebook\./g, "Un historique d'avis détaillés peut être utile, mais il faut aussi vérifier les réalisations, le devis, l'expérience pertinente et les conditions de l'intervention."],
  [/Un acompte de 30% maximum est acceptable\./g, "Si un acompte est demandé, convenez par écrit du montant, de ce qu'il couvre et du calendrier de paiement. Évitez de payer la totalité avant le début ou la réception des travaux importants."],
  [/Minimum 6 mois sur la main d'œuvre\. Pour les nouvelles installations, demandez 1 an\./g, "La garantie dépend du professionnel, du travail réalisé et des conditions convenues. Demandez-la par écrit avant le début des travaux."],
  [/Légalement oui, mais c'est déconseillé sauf si vous avez des compétences en électricité\./g, "Pour toute intervention électrique présentant un risque, privilégiez un professionnel qualifié et respectez les règles de sécurité applicables."],
  [/Pour les gros travaux, un permis est requis auprès de la municipalité\. Votre électricien doit vous en informer\./g, "Les autorisations et règles applicables dépendent de la nature des travaux et de la commune. Vérifiez les exigences locales avant un chantier important."],
  [/peuvent augmenter la valeur de votre bien de 20 à 40%\./g, "Une rénovation peut améliorer le confort et, selon le projet et le marché local, la valeur d'un logement. L'impact financier dépend fortement du bien, des travaux et du contexte local."],
  [/peuvent réduire vos factures de 30 à 50%\./g, "peuvent réduire la consommation d'énergie dans certaines situations, mais le gain dépend du logement, des équipements et des habitudes."],
  [/Ils surviennent dans 90% des projets de rénovation\./g, "Prévoyez une marge pour les imprévus, notamment lorsque l'état réel du logement n'est pas encore connu."],
  [/Les tarifs.*?sont généralement 15-25% plus élevés qu'en province\./g, "Les tarifs peuvent différer sensiblement selon la ville, le quartier, le déplacement, l'urgence, les matériaux et la complexité du travail. Demandez des devis locaux."],
  [/Casablanca et Rabat affichent des tarifs 20-30% plus élevés que les villes moyennes\. Dans les quartiers résidentiels haut de gamme comme Anfa ou Agdal, comptez encore 10-15% de plus\./g, "Les prix peuvent varier selon la ville, le quartier, le déplacement, l'urgence et la complexité du travail. Comparez plusieurs devis pour une prestation comparable."],
  [/Dans les grandes villes comme Casablanca et Marrakech, l'immobilier se vend mieux et plus cher quand il est en bon état\./g, "L'état et la qualité d'un logement peuvent influencer son attractivité, mais l'effet sur le prix dépend du bien et du marché local."],
  [/Privilégiez un plombier avec au moins 5 ans d'expérience pour les travaux importants/g, "Pour des travaux importants, privilégiez un professionnel qui peut démontrer une expérience pertinente sur un chantier comparable et demandez des références si nécessaire."],
  [/Un électricien certifié avec 15 ans d'expérience facture plus cher mais offre de bien meilleures garanties qu'un débutant\./g, "L'expérience pertinente et les qualifications peuvent compter, mais elles ne garantissent pas à elles seules la qualité du travail. Vérifiez les compétences, les références et les conditions proposées."],
  [/plus de 100 artisans dans 21 villes du Maroc/gi, "des professionnels actuellement proposés dans plusieurs villes du Maroc"],
  [/plus de 100 artisans disponibles/gi, "les professionnels actuellement proposés dans votre zone"],
  [/21 villes du Maroc/gi, "plusieurs villes du Maroc"],
  [/au moins 5 ans d'expérience/gi, "une expérience pertinente démontrable"],
  [/15 ans d'expérience/gi, "une expérience pertinente"],
  [/au moins 5 ans d&#39;expérience/gi, "une expérience pertinente démontrable"],
  [/15 ans d&#39;expérience/gi, "une expérience pertinente"],
  [/\+200 artisans vérifiés dans 21 villes du Maroc/gi, "Consultez les professionnels actuellement proposés dans votre ville"],
  [/\+200 artisans vérifiés/gi, "Consultez les professionnels actuellement proposés dans votre ville"],
  [/La référence des artisans marocains/gi, "La plateforme de recherche d'artisans de Snay3i.ma"],
  [/les meilleurs artisans au Maroc/gi, "des professionnels proposés sur Snay3i.ma"],
];

const bannedPatterns = [
  /\bplus de 100 artisans\b/gi,
  /\b21 villes du Maroc\b/gi,
  /\b40% des demandes sur Snay3i\.ma\b/gi,
  /\bau moins 5 ans d(?:'|&#39;)expérience\b/gi,
  /\b15 ans d(?:'|&#39;)expérience\b/gi,
  /\b30% maximum est acceptable\b/gi,
  /\bMinimum 6 mois sur la main d(?:'|&#39;)œuvre\b/gi,
  /\b20-30% plus élevés\b/gi,
  /\b20 à 40%\b/gi,
  /\b30 à 50%\b/gi,
  /\b90% des projets\b/gi,
  /\+200 artisans vérifiés/gi,
  /La référence des artisans marocains/gi,
];

function applyRules(source) {
  let changes = 0;
  for (const [pattern, replacement] of rules) {
    const before = source;
    source = source.replace(pattern, replacement);
    if (source !== before) changes += 1;
  }
  return { source, changes };
}

function collectHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectHtmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function findBanned(source, fileLabel) {
  const found = [];
  for (const re of bannedPatterns) {
    for (const match of source.matchAll(re)) found.push(`${fileLabel}: ${match[0]}`);
  }
  return found;
}

function main() {
  if (!fs.existsSync(blogPath)) throw new Error(`[forensic audit] Missing ${blogPath}`);

  let source = fs.readFileSync(blogPath, 'utf8');
  let sourceChanges;
  ({ source, changes: sourceChanges } = applyRules(source));

  source = source.replace(
    /const AUTHOR_TITLE = 'Fondateur de Snay3i\.ma \| Expert en services artisanaux au Maroc';/,
    "const AUTHOR_TITLE = 'Fondateur de Snay3i.ma | Éditeur du guide pratique Snay3i';"
  );
  fs.writeFileSync(blogPath, source, 'utf8');

  const banned = findBanned(source, 'src/Blog.js');
  let htmlChanged = 0;
  let htmlFiles = 0;
  for (const dir of htmlRoots) {
    for (const file of collectHtmlFiles(dir)) {
      htmlFiles += 1;
      let html = fs.readFileSync(file, 'utf8');
      const before = html;
      let htmlRuleChanges;
      ({ source: html, changes: htmlRuleChanges } = applyRules(html));
      htmlChanged += htmlRuleChanges;
      if (html !== before) fs.writeFileSync(file, html, 'utf8');
      banned.push(...findBanned(html, path.relative(root, file)));
    }
  }

  console.log(`[forensic audit] applied ${sourceChanges} source rule(s); processed ${htmlFiles} generated HTML file(s); changed ${htmlChanged} generated file(s)`);
  if (banned.length) throw new Error(`[forensic audit] BLOCKED: unsupported claims remain:\n${Array.from(new Set(banned)).join('\n')}`);
  console.log('[forensic audit] PASS: no banned unsupported-claim patterns remain in source or generated HTML');
}

main();
