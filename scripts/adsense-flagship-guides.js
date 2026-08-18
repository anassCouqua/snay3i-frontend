const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo', 'blog');

const guides = {
  'trouver-bon-plombier-maroc': {
    title: 'Plomberie au Maroc : guide pratique pour diagnostiquer, comparer et préparer une intervention',
    intro: 'Un bon choix de plombier commence avant le déplacement. Ce guide explique comment décrire le problème, sécuriser la situation, comparer les devis et vérifier le travail terminé.',
    sections: [
      ['1. Commencer par sécuriser la situation', [
        'En cas de fuite importante, commencez par fermer l’arrivée d’eau accessible et protégez les meubles ou appareils proches. Si l’eau atteint une installation électrique, évitez tout contact avec les éléments concernés et faites intervenir un professionnel qualifié.',
        'Pour un évier, une douche ou des toilettes bouchées, évitez d’empiler plusieurs produits chimiques. Notez ce qui s’est passé, ce qui s’écoule encore et depuis quand le problème existe : ces informations permettent un meilleur diagnostic.'
      ]],
      ['2. Décrire le problème avec précision', [
        'Un professionnel pourra mieux préparer son intervention si vous indiquez la pièce concernée, le symptôme exact, les précédentes réparations et, lorsque c’est possible, une photo générale de la zone. Ne publiez pas d’informations sensibles dans une demande publique.',
        'Distinguez une réparation ponctuelle d’un problème récurrent. Une fuite qui revient après plusieurs réparations peut nécessiter une recherche de cause plutôt qu’un simple remplacement de pièce.'
      ]],
      ['3. Comparer un devis de plomberie', [
        'Un devis utile doit permettre de comprendre ce qui est inclus : main-d’œuvre, déplacement, pièces, évacuation des déchets, essais et éventuelles interventions supplémentaires. Pour une rénovation, comparez des devis qui couvrent exactement le même périmètre.',
        'Demandez quelles pièces seront remplacées et pourquoi. Pour les équipements visibles, conservez les références ou notices lorsque cela peut aider à identifier le matériel.'
      ]],
      ['4. Vérifier la fin de l’intervention', [
        'Avant le départ du professionnel, faites fonctionner les éléments concernés et vérifiez l’absence de fuite, de bruit anormal ou d’écoulement inhabituel. Pour un débouchage, faites couler suffisamment d’eau pour observer l’évacuation.',
        'Gardez le devis, la facture et les références des pièces installées. Ces éléments sont utiles si un problème réapparaît ou si une garantie a été annoncée.'
      ]],
      ['5. Préparer une demande sur Snay3i.ma', [
        'Indiquez la ville, le quartier, la nature du problème, son niveau d’urgence et le moment où vous êtes disponible. Vous pouvez ensuite comparer les informations disponibles sur plusieurs profils avant de contacter un professionnel.',
        'La plateforme sert à faciliter la recherche. Avant de confirmer une prestation, vérifiez directement les tarifs, disponibilités, travaux inclus et frais éventuels avec le professionnel.'
      ]]
    ]
  },
  'tarif-electricien-maroc-2026': {
    title: 'Tarifs électricien au Maroc : comment comprendre un devis et éviter les mauvaises surprises',
    intro: 'Les prix d’une intervention électrique dépendent du diagnostic, du temps, de l’accès, des matériaux et du niveau d’urgence. Plutôt que de chercher un prix unique, ce guide montre comment comparer des propositions réellement équivalentes.',
    sections: [
      ['1. Séparer diagnostic, main-d’œuvre et matériel', [
        'Un devis clair distingue autant que possible le temps ou forfait de main-d’œuvre, les pièces, les consommables et les frais de déplacement. Cela facilite la comparaison entre deux professionnels qui n’utilisent pas la même présentation.',
        'Pour une panne, demandez d’abord ce qui est diagnostiqué avant de valider un remplacement. Un appareil ou une pièce n’a pas forcément besoin d’être remplacé si la cause est située ailleurs dans le circuit.'
      ]],
      ['2. Faire la différence entre petite réparation et rénovation', [
        'Le remplacement d’une prise, d’un interrupteur ou d’un luminaire n’a pas la même logique qu’une rénovation complète. Pour un chantier important, demandez un périmètre écrit : pièces concernées, circuits, tableau, protections, finition et essais.',
        'Une rénovation électrique doit être préparée autour de la sécurité d’abord, puis des usages : électroménager, éclairage, prises, climatisation, chauffe-eau ou équipements extérieurs.'
      ]],
      ['3. Les questions qui améliorent un devis', [
        'Demandez ce qui est inclus, quelles marques ou références sont proposées, combien de temps l’intervention devrait prendre et quels éléments pourraient faire évoluer le prix.',
        'Si plusieurs devis sont reçus, reformulez les différences dans un tableau personnel avant de choisir. Un prix plus bas peut simplement correspondre à moins de matériel ou à un périmètre plus limité.'
      ]],
      ['4. Signaux d’alerte', [
        'Méfiez-vous des interventions électriques importantes proposées sans diagnostic, des explications impossibles à vérifier et des demandes de paiement intégral avant que le périmètre du travail soit clair.',
        'Pour un problème potentiellement dangereux, la priorité doit rester la mise en sécurité et l’intervention d’un professionnel compétent, pas la recherche du prix le plus bas.'
      ]],
      ['5. Comparer des électriciens au Maroc', [
        'Sur Snay3i.ma, recherchez un professionnel par métier et par ville, puis vérifiez les informations réellement affichées sur son profil. Contactez plusieurs professionnels lorsque la situation le permet afin de comparer disponibilité et périmètre du travail.',
        'Avant de réserver, confirmez directement le prix, le déplacement, les matériaux, le délai et les conditions de paiement.'
      ]]
    ]
  },
  'renovation-maison-maroc-guide': {
    title: 'Rénovation maison au Maroc : méthode, ordre des travaux, budget et choix des artisans',
    intro: 'Une rénovation réussie commence par le périmètre du projet. Ce guide propose une méthode simple pour décider quoi faire en premier, comparer les intervenants et limiter les changements de dernière minute.',
    sections: [
      ['1. Commencer par un état des lieux', [
        'Avant de choisir des finitions, inspectez les sujets qui peuvent provoquer des travaux en cascade : humidité, plomberie, électricité, ventilation, menuiseries et structure. Photographiez les problèmes et notez ceux qui nécessitent une intervention technique.',
        'Classez ensuite les travaux en trois groupes : indispensables pour la sécurité ou l’usage, nécessaires pour éviter des dégâts futurs, puis améliorations esthétiques.'
      ]],
      ['2. Définir un périmètre avant de demander des devis', [
        'Décrivez précisément les pièces et les travaux souhaités. Une demande vague produit des devis difficiles à comparer et augmente le risque de changements en cours de chantier.',
        'Pour chaque poste, notez ce qui est fourni par l’artisan et ce que vous achetez vous-même. Cette simple distinction évite de comparer un devis matériaux inclus à un devis main-d’œuvre seule.'
      ]],
      ['3. Organiser l’ordre des interventions', [
        'Les travaux techniques viennent généralement avant les finitions. Une réparation de plomberie ou une modification électrique réalisée après la peinture peut provoquer des reprises inutiles.',
        'Coordonnez les artisans lorsque plusieurs métiers interviennent dans la même pièce. Le maçon, l’électricien, le plombier, le carreleur et le peintre ne doivent pas travailler sur des informations contradictoires.'
      ]],
      ['4. Suivre le chantier', [
        'Gardez les devis, factures, références de matériaux et décisions importantes au même endroit. Prenez des photos avant fermeture des murs, avant pose des finitions et à la fin des travaux.',
        'Pour chaque étape, vérifiez ce qui a réellement été exécuté par rapport au périmètre prévu avant de valider la suite du chantier.'
      ]],
      ['5. Trouver les bons profils sur Snay3i.ma', [
        'Le meilleur professionnel dépend du travail demandé. Recherchez le métier correspondant, consultez les informations disponibles et expliquez le contexte du chantier avant de demander un prix.',
        'Snay3i.ma facilite la recherche de professionnels. Vérifiez toujours directement les compétences, délais, tarifs, garanties et fournitures avec l’artisan choisi.'
      ]]
    ]
  },
  'climatisation-maroc-installation': {
    title: 'Climatisation au Maroc : installation, entretien, diagnostic et choix d’un professionnel',
    intro: 'Une climatisation efficace dépend autant du choix de l’équipement que de son installation et de son entretien. Ce guide aide à préparer une intervention sans remplacer le diagnostic d’un professionnel.',
    sections: [
      ['1. Avant une installation', [
        'Déterminez la pièce, son exposition, son usage et les contraintes d’installation. L’emplacement de l’unité intérieure et de l’unité extérieure influence le confort, l’entretien et l’évacuation des condensats.',
        'Demandez au professionnel d’expliquer ses hypothèses avant de comparer les équipements. Une solution adaptée à une petite chambre n’est pas automatiquement adaptée à un grand séjour.'
      ]],
      ['2. Entretien et signes à surveiller', [
        'Une baisse de performance, une odeur inhabituelle, des condensats anormaux ou un bruit nouveau méritent une vérification. Nettoyez les éléments accessibles conformément aux recommandations du fabricant et faites réaliser l’entretien technique nécessaire.',
        'N’ignorez pas une fuite ou un problème électrique. Une intervention rapide peut éviter une panne plus importante.'
      ]],
      ['3. Comparer une prestation', [
        'Demandez si le prix comprend le déplacement, l’installation, les supports, les raccordements, l’évacuation des condensats, les essais et la mise en service. Ces éléments expliquent souvent une différence de prix.',
        'Conservez la référence de l’équipement, la documentation et les informations de garantie après installation.'
      ]],
      ['4. Faire appel à un professionnel', [
        'Pour une panne ou une installation, préparez une description du modèle, du symptôme et de la date d’apparition du problème. Une photo de l’appareil peut aider à préparer la visite.',
        'Avant de confirmer, vérifiez directement les compétences, les délais, le coût du déplacement et les conditions de garantie.'
      ]],
      ['5. Trouver un spécialiste sur Snay3i.ma', [
        'Utilisez les pages climatisation par ville pour rechercher les professionnels disponibles et comparer les informations visibles sur leurs profils. Le bon choix dépend de votre équipement et de la nature exacte du besoin.',
        'Snay3i.ma aide à trouver et contacter des professionnels ; le devis et les conditions finales doivent être confirmés directement avec eux.'
      ]]
    ]
  },
  'serrurier-marrakech-guide': {
    title: 'Serrurier au Maroc : porte bloquée, serrure, sécurité et choix d’un professionnel',
    intro: 'Une urgence de serrurerie pousse souvent à appeler le premier numéro disponible. Ce guide donne une méthode plus sûre pour décrire le problème, limiter les mauvaises surprises et vérifier l’intervention.',
    sections: [
      ['1. En cas de porte bloquée', [
        'Décrivez le symptôme sans publier de code, clé, adresse complète ou autre information sensible. Si la porte est seulement claquée, précisez-le : le professionnel pourra préparer une intervention différente d’une serrure endommagée.',
        'Si une personne est en danger, la priorité est de contacter les services d’urgence appropriés plutôt que de traiter la situation comme une simple intervention commerciale.'
      ]],
      ['2. Demander le prix avant l’intervention', [
        'Demandez séparément le déplacement, l’ouverture, les pièces éventuelles et les frais supplémentaires possibles. Pour un remplacement, demandez le prix de la pièce avant de valider.',
        'Un devis ou une estimation écrite permet de comparer des interventions équivalentes et limite les incompréhensions à l’arrivée.'
      ]],
      ['3. Réparation ou remplacement ?', [
        'Une serrure n’a pas systématiquement besoin d’être remplacée. Demandez ce qui est réellement défectueux et quelles options existent avant de valider une pièce plus coûteuse.',
        'Après le travail, testez plusieurs fois la fermeture et l’ouverture avant de finaliser le règlement.'
      ]],
      ['4. Améliorer la sécurité du logement', [
        'Pour une amélioration de sécurité, pensez au niveau de la porte, au cylindre, aux protections complémentaires et à vos habitudes quotidiennes. Le professionnel peut proposer plusieurs niveaux de solution selon votre budget et votre besoin.',
        'Conservez les références des pièces installées et les documents remis après l’intervention.'
      ]],
      ['5. Rechercher un serrurier sur Snay3i.ma', [
        'Les recherches par métier et par ville permettent de comparer les informations disponibles sur les professionnels. En urgence, préparez le quartier, l’accessibilité et le problème précis avant d’appeler.',
        'Avant toute prestation, confirmez le tarif, le déplacement, les pièces et les conditions de paiement directement avec le serrurier.'
      ]]
    ]
  }
};

const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

for (const [slug, guide] of Object.entries(guides)) {
  const file = path.join(root, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-flagship-guide="1"')) continue;

  const sections = guide.sections.map(([heading, paragraphs]) => `
    <section class="flagship-section">
      <h2>${esc(heading)}</h2>
      ${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
    </section>`).join('');

  const block = `
<section data-flagship-guide="1">
  <p class="meta">Guide éditorial Snay3i.ma</p>
  <h2>${esc(guide.title)}</h2>
  <p><strong>${esc(guide.intro)}</strong></p>
</section>${sections}
<section class="flagship-section">
  <h2>À retenir</h2>
  <p>Les recommandations de ce guide sont générales et doivent être adaptées à la situation réelle. Avant de confirmer une prestation, vérifiez directement le périmètre du travail, le prix, les délais, les fournitures, les garanties et les éventuels frais supplémentaires avec le professionnel.</p>
</section>`;

  html = html.replace('</main>', `${block}</main>`);
  fs.writeFileSync(file, html, 'utf8');
}

console.log('[AdSense flagship guides] strengthened selected editorial guides');
