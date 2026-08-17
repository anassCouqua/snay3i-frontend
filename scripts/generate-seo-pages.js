const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const blogSourcePath = path.join(process.cwd(), 'src', 'Blog.js');

const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const markdownToHtml = (markdown) => {
  const lines = String(markdown || '').trim().split(/\r?\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith('## ')) {
      closeList();
      html.push(`<h2>${esc(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith('- ')) {
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      const item = esc(line.slice(2)).replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
      html.push(`<li>${item}</li>`);
      continue;
    }

    closeList();
    const paragraph = esc(line).replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
    html.push(`<p>${paragraph}</p>`);
  }

  closeList();
  return html.join('');
};

const unescapeJsString = (value) => String(value)
  .replace(/\\'/g, "'")
  .replace(/\\"/g, '"')
  .replace(/\\n/g, '\n')
  .replace(/\\\\/g, '\\');

const extractArticles = () => {
  if (!fs.existsSync(blogSourcePath)) return [];
  const source = fs.readFileSync(blogSourcePath, 'utf8');
  const articles = [];
  const re = /slug:\s*'([^']+)'[\s\S]*?title:\s*'((?:\\.|[^'])*)'[\s\S]*?description:\s*'((?:\\.|[^'])*)'[\s\S]*?content:\s*`([\s\S]*?)`\s*\n\s*}/g;
  let match;
  while ((match = re.exec(source))) {
    articles.push({
      slug: match[1],
      title: unescapeJsString(match[2]),
      description: unescapeJsString(match[3]),
      content: match[4]
    });
  }
  return articles;
};

const page = ({ title, description, heading, body, links = [], article = false }) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://snay3i.ma${esc(links.find(l => l.self)?.href || '/')}">
<style>
body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}
header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}
nav{max-width:900px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}
main{max-width:900px;margin:auto;padding:44px 22px}section{background:#fff;border:1px solid #e8e0d4;border-radius:16px;padding:26px;margin:0 0 16px}
h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:21px;color:#0d1b2a}a{color:#b34f24}
.meta{color:#6f6a64;font-size:14px}.cta{display:inline-block;background:#c4622d;color:#fff!important;padding:11px 18px;border-radius:999px;text-decoration:none;font-weight:700}
ul{padding-left:22px}
.article p,.article li{font-size:17px}.article h2{margin-top:30px}
</style>
</head>
<body>
<header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header>
<main>${article ? '' : '<section><p class="meta">Snay3i.ma • Guide et information</p><h1>' + esc(heading) + '</h1><p>' + esc(description) + '</p></section>'}${body}<section><h2>Snay3i.ma</h2><p>Snay3i.ma est une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour les travaux et services à domicile. Les informations affichées dépendent des données disponibles sur chaque profil.</p><p>Avant toute prestation, vérifiez directement avec le professionnel les tarifs, les disponibilités, la nature du travail et les éventuels frais.</p>${links.filter(l => !l.self).map(l => `<p><a href="${esc(l.href)}">${esc(l.label)}</a></p>`).join('')}</section></main>
<footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer>
</body></html>`;

const write = (route, html) => {
  const target = path.join(root, route, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, 'utf8');
};

const common = [
  { href: '/about', label: 'À propos de Snay3i.ma' },
  { href: '/blog', label: 'Voir les guides du blog' },
  { href: '/contact', label: 'Nous contacter' },
];

write('about', page({
  title: 'À propos de Snay3i.ma',
  description: 'Découvrez Snay3i.ma, une plateforme marocaine qui facilite la recherche de professionnels pour les travaux et services à domicile.',
  heading: 'À propos de Snay3i.ma',
  body: '<section><h2>Notre mission</h2><p>Snay3i.ma cherche à simplifier la recherche d’un professionnel au Maroc en réunissant les informations utiles par métier et par ville.</p><p>Notre approche est simple : permettre aux particuliers de comparer les informations disponibles, consulter les profils et prendre contact directement.</p></section><section><h2>Une plateforme locale</h2><p>Le service couvre des métiers courants comme la plomberie, l’électricité, la maçonnerie, la peinture, la menuiserie, la climatisation, la serrurerie, le ménage, le jardinage et la soudure.</p></section>',
  links: [{ href: '/about', self: true }, ...common]
}));

write('contact', page({
  title: 'Contact Snay3i.ma',
  description: 'Contactez l’équipe Snay3i.ma pour une question, un signalement ou une suggestion concernant la plateforme.',
  heading: 'Contactez Snay3i.ma',
  body: '<section><h2>Nous contacter</h2><p>Pour toute question concernant la plateforme, envoyez un message à <a href="mailto:contact@snay3i.ma">contact@snay3i.ma</a>.</p><p>Pour signaler un problème avec une fiche professionnelle, indiquez le nom du professionnel, la ville et les informations utiles à la vérification.</p></section>',
  links: [{ href: '/contact', self: true }, ...common]
}));

write('privacy', page({
  title: 'Politique de confidentialité — Snay3i.ma',
  description: 'Consultez la politique de confidentialité de Snay3i.ma et les informations relatives aux cookies et services Google.',
  heading: 'Politique de confidentialité',
  body: '<section><h2>Informations collectées</h2><p>Snay3i.ma peut traiter les informations nécessaires au fonctionnement de la plateforme et aux demandes adressées à l’équipe.</p></section><section><h2>Cookies et publicité</h2><p>Les fournisseurs tiers, y compris Google, peuvent utiliser des cookies pour diffuser des annonces en fonction des visites antérieures d’un utilisateur sur notre site ou sur d’autres sites. Les utilisateurs peuvent désactiver la publicité personnalisée dans les paramètres des annonces Google.</p><p>La plateforme peut également utiliser des services de mesure d’audience lorsque ceux-ci sont activés et configurés conformément aux règles applicables.</p></section>',
  links: [{ href: '/privacy', self: true }, ...common]
}));

write('terms', page({
  title: 'Conditions d’utilisation — Snay3i.ma',
  description: 'Consultez les conditions d’utilisation de la plateforme Snay3i.ma.',
  heading: 'Conditions d’utilisation',
  body: '<section><h2>Rôle de la plateforme</h2><p>Snay3i.ma fournit un service de recherche et de mise en relation. Les utilisateurs doivent vérifier directement les informations, les tarifs et les conditions d’une prestation avant de s’engager.</p></section><section><h2>Contenu des profils</h2><p>Les informations présentes sur les profils peuvent évoluer. Un profil, un avis ou un badge ne constitue pas à lui seul une garantie de résultat ou de qualité pour une prestation donnée.</p></section>',
  links: [{ href: '/terms', self: true }, ...common]
}));

write('blog', page({
  title: 'Blog Snay3i.ma — Guides pratiques pour les travaux au Maroc',
  description: 'Guides pratiques pour choisir un artisan, préparer des travaux et comprendre les prestations courantes au Maroc.',
  heading: 'Guides pratiques pour les travaux et services au Maroc',
  body: '<section><h2>Nos sujets</h2><p>Le blog couvre notamment la plomberie, l’électricité, la rénovation, le carrelage, la peinture, la menuiserie, la climatisation, la serrurerie, la maçonnerie, le jardinage et l’entretien de la maison.</p><p>Chaque guide vise à aider le lecteur à préparer sa demande, poser les bonnes questions et vérifier les informations utiles avant une prestation.</p></section>',
  links: [{ href: '/blog', self: true }, { href: '/blog/trouver-bon-plombier-maroc', label: 'Trouver un bon plombier au Maroc' }, { href: '/blog/tarif-electricien-maroc-2026', label: 'Tarif électricien Maroc 2026' }, ...common]
}));

const cities = {
  casablanca: { name: 'Casablanca', context: 'Dans une grande agglomération, comparez les délais de déplacement et confirmez l’adresse ou le quartier avant le rendez-vous. Pour les immeubles, précisez l’étage, l’ascenseur et les règles d’accès lorsqu’elles peuvent modifier la durée de l’intervention.' },
  rabat: { name: 'Rabat', context: 'Pour une intervention à Rabat, précisez le quartier et l’accès au logement ou au local. Pour les travaux planifiés, demandez un devis qui sépare la main-d’œuvre, les fournitures et les éventuels frais de déplacement.' },
  marrakech: { name: 'Marrakech', context: 'À Marrakech, certains logements, riads ou zones touristiques peuvent avoir des contraintes d’accès particulières. Décrivez les conditions d’accès et le type de bâtiment avant de confirmer la prestation.' },
  tanger: { name: 'Tanger', context: 'À Tanger, la proximité du professionnel peut être utile pour les dépannages rapides. Pour un chantier, clarifiez l’accès, le stationnement et les horaires d’intervention afin d’éviter les malentendus.' },
  fes: { name: 'Fès', context: 'À Fès, précisez si l’intervention concerne un logement moderne, une maison ancienne ou une zone à accès limité. Les contraintes d’accès peuvent influencer le temps nécessaire et le transport du matériel.' },
  agadir: { name: 'Agadir', context: 'À Agadir, indiquez clairement le type de logement ou de local et la nature de l’intervention. Pour les travaux extérieurs ou les équipements techniques, partagez les informations utiles avant le déplacement.' }
};

const services = {
  plombier: { name: 'Plombier', situations: 'fuite, évier ou WC bouché, robinetterie, chauffe-eau ou installation sanitaire', checklist: ['Décrire la panne et son emplacement', 'Indiquer si l’eau doit être coupée', 'Demander si un diagnostic sur place est nécessaire', 'Clarifier la main-d’œuvre, les pièces et le déplacement'] },
  electricien: { name: 'Électricien', situations: 'panne, prise, éclairage, tableau, circuit dédié ou rénovation électrique', checklist: ['Décrire les symptômes avant l’intervention', 'Préciser si le disjoncteur déclenche', 'Demander ce qui sera testé ou remplacé', 'Vérifier les mesures de sécurité et les conditions du devis'] },
  macon: { name: 'Maçon', situations: 'cloison, réparation, dalle, mur, ouverture ou travaux de structure', checklist: ['Décrire les dimensions approximatives', 'Préciser les matériaux existants', 'Demander les étapes prévues', 'Clarifier matériaux, main-d’œuvre, évacuation et délai'] },
  bricoleur: { name: 'Bricoleur', situations: 'petites réparations, montage, fixation, entretien ou travaux variés', checklist: ['Lister les tâches à réaliser', 'Partager des photos lorsque cela aide au diagnostic', 'Préciser le matériel déjà disponible', 'Demander si les fournitures sont incluses'] },
  peintre: { name: 'Peintre', situations: 'peinture intérieure, façade, préparation des murs et finitions', checklist: ['Indiquer les pièces et surfaces concernées', 'Préciser l’état des murs', 'Choisir le niveau de finition souhaité', 'Séparer préparation, peinture et fournitures dans le devis'] },
  menuisier: { name: 'Menuisier', situations: 'portes, placards, cuisine, meubles sur mesure ou réparations', checklist: ['Fournir les dimensions disponibles', 'Décrire l’usage et les contraintes', 'Comparer matériaux et finitions', 'Demander un détail des fournitures et de la pose'] },
  carreleur: { name: 'Carreleur', situations: 'sols, murs, salle de bain, cuisine ou rénovation de surfaces', checklist: ['Mesurer approximativement la surface', 'Préciser le type de support', 'Décrire le carrelage envisagé', 'Demander le détail de la préparation, pose et joints'] },
  climatisation: { name: 'Climatisation', situations: 'installation, entretien, nettoyage, diagnostic ou remplacement d’équipement', checklist: ['Préciser la pièce et sa taille approximative', 'Indiquer l’équipement existant s’il y en a un', 'Demander les contraintes d’installation', 'Clarifier entretien, déplacement et fournitures'] },
  serrurier: { name: 'Serrurier', situations: 'porte bloquée, clé perdue, serrure, cylindre ou sécurisation', checklist: ['Décrire la situation sans masquer l’urgence réelle', 'Demander si une ouverture non destructive est possible', 'Clarifier déplacement et pièces éventuelles', 'Vérifier le fonctionnement de la serrure avant de terminer'] },
  menage: { name: 'Ménage', situations: 'entretien régulier, nettoyage ponctuel, état des lieux ou remise en état', checklist: ['Préciser la surface et le nombre de pièces', 'Lister les tâches attendues', 'Indiquer les produits ou équipements disponibles', 'Clarifier la durée, la fréquence et les fournitures'] },
  jardinier: { name: 'Jardinier', situations: 'entretien, taille, arrosage, plantation ou aménagement extérieur', checklist: ['Décrire la surface et les plantes concernées', 'Partager des photos du jardin', 'Préciser les déchets ou évacuations à prévoir', 'Demander un détail entre entretien et fournitures'] },
  soudeur: { name: 'Soudeur', situations: 'réparation métallique, portail, garde-corps, structure ou fabrication sur mesure', checklist: ['Décrire le métal et les dimensions', 'Préciser si la pièce doit être fabriquée ou réparée', 'Indiquer les contraintes de sécurité ou d’accès', 'Demander le détail du matériau, de la fabrication et de la pose'] }
};

for (const [serviceSlug, service] of Object.entries(services)) {
  for (const [citySlug, city] of Object.entries(cities)) {
    const route = `artisan/${serviceSlug}/${citySlug}`;
    const checklistHtml = service.checklist.map(item => `<li>${esc(item)}</li>`).join('');
    write(route, page({
      title: `${service.name} à ${city.name} — Snay3i.ma`,
      description: `Guide pratique pour rechercher un ${service.name.toLowerCase()} à ${city.name}, comparer les informations disponibles et préparer une demande de devis.`,
      heading: `${service.name} à ${city.name}`,
      body: `<section><h2>Pour quels besoins contacter un ${service.name.toLowerCase()} ?</h2><p>À ${city.name}, les demandes peuvent concerner notamment : ${esc(service.situations)}. La bonne description du besoin aide le professionnel à comprendre la situation avant de se déplacer.</p><p>${esc(city.context)}</p></section><section><h2>Préparer votre demande</h2><p>Avant de contacter un professionnel, réunissez les informations simples qui permettent de comparer les réponses. ${esc(service.name)} peut avoir besoin de photos, de dimensions, de références d’équipement ou d’informations sur l’accès au logement selon la nature du travail.</p><ul>${checklistHtml}</ul></section><section><h2>Comparer les réponses</h2><p>Ne comparez pas uniquement un prix annoncé rapidement. Vérifiez ce qui est inclus, les fournitures, le déplacement, la préparation, le délai et les conditions de paiement. Pour un travail plus important, demandez un devis suffisamment détaillé pour comparer le même périmètre entre plusieurs professionnels.</p><p>Les informations affichées sur Snay3i.ma dépendent des données disponibles sur chaque profil. Avant de confirmer une prestation, vérifiez directement avec le professionnel ses disponibilités, ses tarifs et la nature exacte du travail.</p></section>`,
      links: [{ href: `/artisan/${serviceSlug}/${citySlug}`, self: true }, { href: '/blog', label: 'Lire les guides pratiques' }, { href: '/contact', label: 'Contacter Snay3i.ma' }]
    }));
  }
}

const articles = extractArticles();
for (const article of articles) {
  const body = `<article class="article"><section><p class="meta">Guide Snay3i.ma • contenu pratique</p><h1>${esc(article.title)}</h1><p>${esc(article.description)}</p></section><section>${markdownToHtml(article.content)}</section><section><h2>À retenir</h2><p>Avant de réserver une prestation, décrivez clairement votre besoin, comparez les informations disponibles et confirmez directement avec le professionnel le périmètre, le tarif, les délais et les éventuels frais.</p></section></article>`;
  write(`blog/${article.slug}`, page({
    title: `${article.title} — Snay3i.ma`,
    description: article.description,
    heading: article.title,
    body,
    article: true,
    links: [{ href: `/blog/${article.slug}`, self: true }, { href: '/blog', label: 'Retour au blog' }, ...common]
  }));
}

console.log(`Crawlable SEO pages generated: ${articles.length} blog articles + ${Object.keys(services).length * Object.keys(cities).length} service/city pages + core pages`);
