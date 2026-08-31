const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'content', 'canonical-guide-content.json'),
  path.join(root, 'content', 'canonical-guide-additions.json'),
];

const replacements = [
  ["Il doit distinguer les travaux, les matériaux, la main-d'œuvre et, lorsqu'il y en a, les frais de déplacement ou d'évacuation.", "Pour faciliter la comparaison, demandez que le devis distingue les travaux, les matériaux, la main-d'œuvre et, lorsqu'il y en a, les frais de déplacement ou d'évacuation."],
  ["Demandez toujours ce qui est inclus.", "Demandez clairement ce qui est inclus."],
  ["Une fuite importante, de l'eau qui atteint une installation électrique, une canalisation rompue ou une absence totale d'eau dans des conditions inhabituelles justifient une réaction rapide.", "Une fuite importante, une canalisation rompue ou de l'eau qui atteint ou menace une installation électrique justifient une réaction rapide. Évitez tout contact avec une zone ou un équipement électrique mouillé et faites intervenir un professionnel compétent."],

  ["Le déplacement, la distance et l'urgence doivent apparaître clairement dans le chiffrage.", "Demandez que le déplacement, la distance et l'urgence éventuelle soient indiqués clairement dans le chiffrage."],
  ["Un bon article de prix doit donc donner des repères sans faire croire qu'un montant est garanti.", "Un bon article de prix devrait donner des repères sans faire croire qu'un montant est garanti."],
  ["Le professionnel doit examiner les circuits existants, les protections, la capacité disponible et la manière dont les différents départs sont organisés.", "L'examen peut notamment porter sur les circuits existants, les protections, la capacité disponible et la manière dont les différents départs sont organisés."],
  ["Le devis doit préciser ce qui est remplacé et ce qui reste en place.", "Demandez au devis de préciser ce qui est remplacé et ce qui reste en place."],
  ["Un professionnel sérieux doit pouvoir expliquer simplement ce qu'il a trouvé et ce qu'il propose de faire.", "Un professionnel devrait pouvoir expliquer simplement ce qu'il a trouvé et ce qu'il propose de faire."],
  ["Si la panne concerne seulement votre logement, vérifiez sans toucher aux conducteurs si un disjoncteur s'est déclenché.", "Si la panne concerne seulement votre logement, vous pouvez constater, sans toucher aux conducteurs ni démonter le tableau, si un disjoncteur accessible s'est déclenché. En cas de doute, n'intervenez pas et contactez un professionnel."],

  ["Les travaux qui modifient les murs ou les réseaux doivent généralement précéder le carrelage et la peinture.", "En général, les travaux qui modifient les murs ou les réseaux précèdent le carrelage et la peinture, mais l'ordre exact dépend du chantier."],
  ["Pour un logement occupé, définissez une zone qui doit rester fonctionnelle autant que possible.", "Pour un logement occupé, définissez une zone à maintenir fonctionnelle autant que possible."],

  ["Un devis utile doit préciser l'appareil, la capacité annoncée, la fourniture et la pose, la longueur de liaison incluse, les éventuels mètres supplémentaires, les supports, le percement, l'évacuation des condensats et la mise en service.", "Un devis utile devrait préciser l'appareil, la capacité annoncée, la fourniture et la pose, la longueur de liaison incluse, les éventuels mètres supplémentaires, les supports, le percement, l'évacuation des condensats et la mise en service."],
  ["Une estimation trouvée en ligne peut servir de repère, mais le devis final doit rester lié au logement réel.", "Une estimation trouvée en ligne peut servir de repère, mais le devis final devrait rester lié au logement réel."],

  ["Le serrurier doit surtout rétablir une fermeture fonctionnelle et vous expliquer les mesures de sécurisation disponibles.", "L'objectif principal de l'intervention est de rétablir une fermeture fonctionnelle et de vous expliquer les mesures de sécurisation disponibles."],
  ["Avant l'intervention, il doit pouvoir reformuler votre problème et expliquer la méthode envisagée.", "Avant l'intervention, il devrait pouvoir reformuler votre problème et expliquer la méthode envisagée."],
  ["Après l'ouverture, il doit distinguer ce qui est nécessaire de ce qui est simplement recommandé.", "Après l'ouverture, demandez-lui de distinguer ce qui est nécessaire de ce qui est simplement recommandé."],
  ["Une urgence serrurerie ne doit pas supprimer les règles de base d'un achat : description claire, prix compréhensible, accord avant les travaux et facture à la fin.", "Une urgence serrurerie ne justifie pas de renoncer aux repères de base : description claire, prix compréhensible, accord avant les travaux et facture à la fin."],
  ["Le professionnel doit vous expliquer la différence avant de proposer une dépense supplémentaire.", "Demandez au professionnel de vous expliquer la différence avant d'accepter une dépense supplémentaire."],

  ["Si le support présente une humidité, une mauvaise planéité ou des fissures, le carreleur doit expliquer le traitement prévu avant de commencer.", "Si le support présente une humidité, une mauvaise planéité ou des fissures, demandez au carreleur d'expliquer le traitement prévu avant de commencer."],
  ["Le choix et la largeur des joints doivent également correspondre au matériau et à l'usage.", "Le choix et la largeur des joints devraient être adaptés au matériau et à l'usage."],

  ["Le devis doit décrire le travail Un bon devis de maçonnerie précise les surfaces ou dimensions concernées, les démolitions éventuelles, les matériaux, la main-d'œuvre, l'évacuation des gravats et les reprises prévues.", "Le devis devrait décrire clairement le travail. Un devis de maçonnerie utile précise les surfaces ou dimensions concernées, les démolitions éventuelles, les matériaux, la main-d'œuvre, l'évacuation des gravats et les reprises prévues."],
  ["Les matériaux doivent être identifiables.", "Demandez que les matériaux prévus soient identifiables dans le devis ou les échanges."],
  ["Le client doit pouvoir comprendre ce qu'il paie et, si une modification est proposée en cours de chantier, pourquoi cette modification est nécessaire.", "Le devis et les échanges devraient permettre de comprendre ce qui est payé et, si une modification est proposée en cours de chantier, pourquoi elle est proposée."],
  ["Le professionnel doit identifier la nature du mur et expliquer la méthode de sécurisation.", "Avant une ouverture ou une modification de mur, la nature du mur et la méthode de sécurisation doivent être évaluées par le professionnel compétent. Si la structure peut être concernée, faites valider l'intervention par un professionnel qualifié pour cette responsabilité."],

  ["Une canalisation rompue, une arrivée d'eau impossible à arrêter, une fuite importante qui traverse un plafond ou une eau proche d'une installation électrique sont des situations qui ne doivent pas attendre un simple rendez-vous esthétique.", "Une canalisation rompue, une arrivée d'eau impossible à arrêter, une fuite importante qui traverse un plafond ou de l'eau qui atteint ou menace une installation électrique justifient une réaction rapide. Évitez tout contact avec une zone ou un équipement électrique mouillé et demandez l'aide d'un professionnel compétent."],
  ["Le mot « urgence » doit correspondre au risque réel, car les conditions d'intervention peuvent différer.", "Utilisez le terme « urgence » lorsque la situation nécessite réellement une intervention rapide, car les conditions d'intervention peuvent différer."],
  ["Une fourchette trouvée sur internet peut aider à préparer la discussion mais ne doit pas être présentée comme un tarif garanti pour Casablanca.", "Une fourchette trouvée sur internet peut aider à préparer la discussion mais ne devrait pas être présentée comme un tarif garanti pour Casablanca."],
  ["Le professionnel peut réparer l'urgence, mais la question de la responsabilité ou de la prise en charge doit être traitée séparément avec l'interlocuteur approprié.", "Le professionnel peut traiter la fuite ou la panne, tandis que la question de la responsabilité ou d'une éventuelle prise en charge se traite séparément avec l'interlocuteur approprié."],
];

let total = 0;
for (const file of files) {
  if (!fs.existsSync(file)) throw new Error(`[editorial language] missing ${path.relative(root, file)}`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = 0;
  for (const [key, value] of Object.entries(data)) {
    let next = String(value);
    for (const [from, to] of replacements) {
      if (next.includes(from)) {
        next = next.split(from).join(to);
        changed += 1;
      }
    }
    data[key] = next;
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`[editorial language] ${path.basename(file)}: ${changed} wording correction(s)`);
  total += changed;
}

const bannedAbsolutePhrases = [
  "Le professionnel doit examiner les circuits existants",
  "Le professionnel doit identifier la nature du mur",
  "Le serrurier doit surtout rétablir",
  "Après l'ouverture, il doit distinguer",
  "Le professionnel doit vous expliquer la différence",
  "ne doivent pas attendre un simple rendez-vous esthétique",
];

const combined = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const leftovers = bannedAbsolutePhrases.filter((phrase) => combined.includes(phrase));
if (leftovers.length) throw new Error(`[editorial language] BLOCKED: high-risk absolute wording remains: ${leftovers.join(' | ')}`);
console.log(`[editorial language] PASS: ${total} technical/safety wording correction(s); no banned high-risk absolutes remain`);
