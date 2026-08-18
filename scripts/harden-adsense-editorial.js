const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const blogRoot = path.join(root, 'blog');

const flagship = {
  'trouver-bon-plombier-maroc': {
    intro: 'Un bon plombier ne se choisit pas uniquement sur le prix. Au Maroc, une demande de plomberie peut aller d’une petite fuite à une intervention sanitaire urgente, et le bon choix dépend surtout du diagnostic, du périmètre du travail et de la clarté du devis.',
    sections: [
      ['Avant de contacter un plombier', 'Notez précisément le problème, l’endroit où il apparaît, depuis quand il dure et ce qui a déjà été essayé. Une photo peut être utile pour expliquer une pièce ou une fuite, mais évitez de publier des informations personnelles ou des accès privés.'],
      ['Questions utiles à poser', 'Demandez ce qui sera diagnostiqué sur place, si le déplacement est facturé, si les pièces sont incluses et comment une réparation supplémentaire serait validée. Un professionnel sérieux doit pouvoir expliquer ce qu’il propose de faire.'],
      ['Comparer des devis de plomberie', 'Comparez des prestations équivalentes. Un devis moins cher peut exclure le déplacement, certaines pièces ou des étapes de préparation. Demandez un détail simple entre main-d’œuvre, fournitures et éventuels frais additionnels.'],
      ['Après l’intervention', 'Avant de clôturer la prestation, vérifiez que la fuite ou le problème initial est traité et demandez les recommandations d’entretien si elles sont pertinentes. Conservez le devis et les échanges importants.']
    ]
  },
  'tarif-electricien-maroc-2026': {
    intro: 'Le prix d’un électricien au Maroc dépend surtout de la nature du travail, du temps nécessaire, des fournitures et de la difficulté d’accès. Un tarif utile doit donc expliquer ce qui est inclus plutôt que donner un chiffre isolé présenté comme universel.',
    sections: [
      ['Ce qui fait varier le prix', 'Une intervention de diagnostic, le remplacement d’une prise, une panne au tableau ou la création d’un circuit dédié n’ont pas la même charge de travail. Le quartier, l’accès et le matériel nécessaire peuvent aussi modifier le coût final.'],
      ['Comment demander un devis', 'Décrivez la panne ou le projet, indiquez la ville et le type de logement, puis demandez un détail de la main-d’œuvre, des fournitures et du déplacement. Pour une rénovation, demandez également les étapes prévues.'],
      ['Sécurité avant tout', 'Une panne électrique peut présenter un risque réel. Évitez les manipulations improvisées lorsque vous n’êtes pas qualifié et demandez au professionnel quelles vérifications sont nécessaires avant toute réparation.'],
      ['Comment comparer deux professionnels', 'Comparez le périmètre du travail et les fournitures, pas seulement le montant total. La meilleure comparaison est celle de deux propositions suffisamment détaillées pour représenter la même prestation.']
    ]
  },
  'urgence-plomberie-casablanca': {
    intro: 'Une fuite importante ou une canalisation bouchée peut rapidement perturber un logement. À Casablanca, la priorité est d’abord de limiter les dégâts, puis de transmettre au plombier les informations qui permettront un diagnostic plus efficace.',
    sections: [
      ['Les premières mesures', 'Lorsque cela est possible et sûr, identifiez l’arrivée d’eau concernée et limitez l’écoulement. Protégez les zones sensibles avec des serviettes ou des récipients et évitez de démonter une installation que vous ne maîtrisez pas.'],
      ['Quoi communiquer au professionnel', 'Indiquez le quartier, le type de logement, la pièce concernée, l’origine apparente de la fuite et l’urgence. Une description claire permet de préparer l’intervention et de discuter du déplacement avant l’arrivée.'],
      ['Comparer dans l’urgence', 'Même en cas d’urgence, demandez le coût du déplacement et ce qui est compris dans l’intervention lorsque la situation le permet. Clarifiez aussi les pièces qui pourraient être remplacées.'],
      ['Après la réparation', 'Faites tester l’installation, vérifiez que la fuite est réellement arrêtée et demandez ce qui doit être surveillé dans les prochaines heures ou jours.']
    ]
  },
  'electricien-casablanca-guide': {
    intro: 'Trouver un électricien à Casablanca ne consiste pas seulement à choisir le premier résultat disponible. La nature de la panne, la sécurité du logement et la précision de la demande doivent guider le choix.',
    sections: [
      ['Définir le besoin', 'Distinguez une panne, une réparation ponctuelle, une installation ou un projet de rénovation. Plus la demande est précise, plus il est facile de comparer des interventions réellement équivalentes.'],
      ['Informations à préparer', 'Indiquez le quartier, le type de logement, les symptômes observés et, si pertinent, ce qui se passe au tableau électrique. Ne manipulez pas une installation dangereuse pour tenter d’obtenir des informations supplémentaires.'],
      ['Devis et sécurité', 'Demandez ce qui sera testé, réparé ou remplacé. Pour les projets plus importants, privilégiez un devis détaillé et gardez une trace de ce qui a été convenu.'],
      ['Avant de choisir', 'Comparez la clarté des explications, le périmètre du travail, les fournitures et les conditions de paiement. Un prix seul ne suffit pas à déterminer la qualité d’une intervention.']
    ]
  },
  'electricien-professionnel-casablanca': {
    intro: 'Un électricien professionnel doit pouvoir expliquer son diagnostic, le périmètre de son intervention et les conditions de sa prestation. Cette page aide les particuliers à préparer une comparaison plus sérieuse.',
    sections: [
      ['Signes d’une bonne préparation', 'Le professionnel pose des questions sur la panne ou le projet, identifie ce qu’il doit tester et explique ce qui pourrait nécessiter un remplacement. Il ne devrait pas présenter un prix définitif sans comprendre le problème lorsque le diagnostic est indispensable.'],
      ['Les questions à poser', 'Demandez ce qui est inclus, si les fournitures sont séparées, si le déplacement est facturé et comment une modification du périmètre sera validée.'],
      ['La qualité du devis', 'Un bon devis décrit la prestation avec suffisamment de précision pour permettre une comparaison. Pour un projet de rénovation, il peut également préciser les matériaux et les étapes.'],
      ['Après les travaux', 'Testez les équipements concernés et gardez les informations importantes sur la prestation. Pour les installations techniques, demandez les recommandations d’usage et d’entretien qui sont pertinentes.']
    ]
  },
  'climatisation-maroc-installation': {
    intro: 'Au Maroc, la climatisation est à la fois une question de confort, d’entretien et de consommation. Le bon choix dépend de la pièce, de l’exposition, de l’usage et de l’équipement existant.',
    sections: [
      ['Avant une installation', 'Notez la taille approximative de la pièce, son exposition, le nombre d’occupants et la présence éventuelle d’un équipement existant. Le professionnel pourra ainsi mieux dimensionner son intervention.'],
      ['Installation ou entretien', 'Une installation et un entretien ne doivent pas être comparés de la même manière. Demandez ce qui est compris dans la pose, le contrôle, le nettoyage et les éventuelles fournitures.'],
      ['Limiter les mauvaises surprises', 'Clarifiez le modèle d’équipement concerné, les contraintes d’accès, le perçage ou les supports nécessaires et les éventuels frais de déplacement.'],
      ['Entretien', 'Un entretien régulier peut aider à maintenir les performances et à repérer certains problèmes plus tôt. Suivez les recommandations du fabricant et du professionnel.']
    ]
  },
  'macon-construction-maroc': {
    intro: 'Pour des travaux de maçonnerie au Maroc, le résultat dépend autant de la préparation du chantier que de l’exécution. Une demande précise et un devis détaillé réduisent les malentendus.',
    sections: [
      ['Décrire le chantier', 'Indiquez les dimensions approximatives, la nature du support, les matériaux existants et le résultat recherché. Des photos ou un croquis peuvent faciliter le premier échange.'],
      ['Découper les étapes', 'Pour un chantier important, demandez quelles sont les étapes prévues, les matériaux nécessaires, les évacuations éventuelles et les dépendances avec d’autres métiers.'],
      ['Comparer des offres', 'Comparez la main-d’œuvre et les matériaux séparément lorsque c’est pertinent. Vérifiez également qui fournit quoi et comment sont gérées les modifications en cours de chantier.'],
      ['Suivi du chantier', 'Gardez une trace des décisions importantes et vérifiez les étapes intermédiaires avant de passer à la suite lorsque les travaux dépendent les uns des autres.']
    ]
  },
  'jardinier-paysagiste-maroc': {
    intro: 'Un jardin adapté au climat marocain demande plus qu’une liste de plantes. Le sol, l’exposition, l’eau disponible et le niveau d’entretien souhaité doivent guider les choix.',
    sections: [
      ['Choisir selon le lieu', 'Observez l’ensoleillement, le vent, le type de sol et l’accès à l’eau. Un jardinier peut ensuite proposer des espèces et une organisation adaptées à l’usage du jardin.'],
      ['Entretien ou création', 'Distinguez un entretien régulier d’un aménagement complet. Les tâches, le temps nécessaire et les fournitures ne sont pas les mêmes.'],
      ['Arrosage', 'Demandez quelles zones nécessitent un arrosage régulier et si une solution goutte-à-goutte ou programmée est pertinente pour votre situation.'],
      ['Budget', 'Comparez les coûts d’entretien, de plantation et de fournitures séparément pour comprendre ce qui fait réellement varier le budget.']
    ]
  },
  'trouver-snay3i-maroc-darija': {
    intro: 'فالمغرب، باش تلقى الصنايعي المناسب، ماشي غير شكون لقيتي فالنتيجة الأولى. خاصك توضّح الخدمة، المدينة، والاستعجال، وتسول على الثمن وشكون غادي يجيب المعدات والمواد.',
    sections: [
      ['قبل ما تعيط للصنايعي', 'شرح المشكل بوضوح، قول شنو وقع وفين، وشنو بغيتي يتصلح. إلا كانت صورة غادي تعاون فالشرح، صيفطها بلا ما تبان فيها معلومات شخصية أو حساسة.'],
      ['شنو تسول عليه', 'سول واش التنقل داخل فالثمن، واش المواد داخلة، وشحال تقريباً غادي ياخد الوقت. إلا كانت الخدمة كبيرة، طلب تفصيل ديال الثمن باش تقدر تقارن.'],
      ['كيفاش تقارن', 'ما تقارنش غير الرقم الأخير. قارن شنو داخل فالخدمة، شكون غادي يوفر المواد، والمدة وشروط الأداء.'],
      ['من بعد الخدمة', 'جرّب الخدمة قبل ما تسالي، وخلي عندك المعلومات المهمة ديال الاتفاق أو الفاتورة إلا كانت متوفرة.']
    ]
  }
};

const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const htmlEscape = value => String(value || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (!fs.existsSync(blogRoot)) process.exit(0);

const dirs = fs.readdirSync(blogRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

for (const slug of dirs) {
  const file = path.join(blogRoot, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');

  if (!flagship[slug]) {
    html = html.replace(/<meta name="robots" content="index,follow">/i, '<meta name="robots" content="noindex,follow">');
    fs.writeFileSync(file, html, 'utf8');
    continue;
  }

  html = html.replace(/<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="index,follow">');

  if (!html.includes('data-adsense-editorial-hardening="1"')) {
    const data = flagship[slug];
    const sectionHtml = data.sections.map(([heading, body]) => `<h2>${htmlEscape(heading)}</h2><p>${htmlEscape(body)}</p>`).join('');
    const block = `<section data-adsense-editorial-hardening="1"><h2>Guide pratique Snay3i.ma</h2><p>${htmlEscape(data.intro)}</p>${sectionHtml}<h2>À retenir</h2><p>Avant de réserver une prestation, vérifiez directement avec le professionnel les tarifs, les disponibilités, le périmètre exact du travail, les fournitures et les éventuels frais de déplacement. Les informations d’un annuaire servent à préparer votre demande ; elles ne remplacent pas les vérifications nécessaires avant une prestation.</p></section>`;
    html = html.replace('</main>', `${block}</main>`);
  }

  fs.writeFileSync(file, html, 'utf8');
}

// Replace the blog hub with a curated, accurate editorial index based on the actual generated article metadata.
const curated = Object.keys(flagship).filter(slug => fs.existsSync(path.join(blogRoot, slug, 'index.html')));
const cards = curated.map(slug => {
  const html = fs.readFileSync(path.join(blogRoot, slug, 'index.html'), 'utf8');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1].trim();
  const description = (html.match(/<meta name="description" content="([^"]*)"/i) || [,''])[1].trim();
  return `<article style="padding:18px 0;border-top:1px solid #eee5da"><h2><a href="/blog/${slug}">${clean(title)}</a></h2><p>${clean(description)}</p><p><a href="/blog/${slug}">Lire le guide</a></p></article>`;
}).join('\n');

const hub = path.join(blogRoot, 'index.html');
if (fs.existsSync(hub)) {
  let html = fs.readFileSync(hub, 'utf8');
  html = html.replace(/<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="index,follow">');
  const replacement = `<section data-adsense-editorial-curation="1"><h2>Guides sélectionnés</h2><p>Nous mettons en avant des guides pratiques conçus pour aider les particuliers au Maroc à préparer leurs travaux, comparer une prestation et poser les bonnes questions avant de contacter un professionnel.</p>${cards}</section>`;
  html = html.replace(/<section data-adsense-editorial-curation="1">[\s\S]*?<\/section>/i, replacement);
  if (!html.includes('data-adsense-editorial-curation="1"')) {
    html = html.replace('</main>', `${replacement}</main>`);
  }
  fs.writeFileSync(hub, html, 'utf8');
}
