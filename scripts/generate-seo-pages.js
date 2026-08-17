const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const blogSourcePath = path.join(process.cwd(), 'src', 'Blog.js');

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const inline = (value) => esc(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const markdownToHtml = (markdown) => {
  const lines = String(markdown || '').trim().split(/\r?\n/);
  const out = [];
  let list = null;

  const closeList = () => {
    if (list === 'ul') out.push('</ul>');
    if (list === 'ol') out.push('</ol>');
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith('## ')) {
      closeList();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      if (list !== 'ol') {
        closeList();
        out.push('<ol>');
        list = 'ol';
      }
      out.push(`<li>${inline(ordered[1])}</li>`);
      continue;
    }

    if (line.startsWith('- ')) {
      if (list !== 'ul') {
        closeList();
        out.push('<ul>');
        list = 'ul';
      }
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }

  closeList();
  return out.join('');
};

const unescapeJsString = (value) => String(value)
  .replace(/\\'/g, "'")
  .replace(/\\"/g, '"')
  .replace(/\\n/g, '\n')
  .replace(/\\\\/g, '\\');

const extractArticles = () => {
  if (!fs.existsSync(blogSourcePath)) return [];
  const source = fs.readFileSync(blogSourcePath, 'utf8');
  const results = [];
  const re = /slug:\s*'([^']+)'[\s\S]*?title:\s*'((?:\\.|[^'])*)'[\s\S]*?description:\s*'((?:\\.|[^'])*)'[\s\S]*?content:\s*`([\s\S]*?)`\s*\n\s*}/g;
  let match;
  while ((match = re.exec(source))) {
    results.push({
      slug: match[1],
      title: unescapeJsString(match[2]),
      description: unescapeJsString(match[3]),
      content: match[4]
    });
  }
  return results;
};

const page = ({ title, description, body, selfPath, article = false }) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://snay3i.ma${esc(selfPath)}">
<style>
body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}
header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}
nav{max-width:900px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}
main{max-width:900px;margin:auto;padding:44px 22px}section{background:#fff;border:1px solid #e8e0d4;border-radius:16px;padding:26px;margin:0 0 16px}
h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:21px;color:#0d1b2a}a{color:#b34f24}
.meta{color:#6f6a64;font-size:14px}.article p,.article li{font-size:17px}.article h2{margin-top:30px}ul,ol{padding-left:22px}
</style>
</head>
<body>
<header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header>
<main>${body}<section><h2>Snay3i.ma</h2><p>Snay3i.ma est une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour les travaux et services à domicile. Les informations affichées dépendent des données disponibles sur chaque profil.</p><p>Avant toute prestation, vérifiez directement avec le professionnel les tarifs, les disponibilités, la nature du travail et les éventuels frais.</p><p><a href="/blog">Voir les guides du blog</a></p><p><a href="/about">À propos de Snay3i.ma</a></p><p><a href="/contact">Nous contacter</a></p></section></main>
<footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer>
</body></html>`;

const write = (route, html) => {
  const target = path.join(root, route, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, 'utf8');
};

const corePages = [
  ['about','À propos de Snay3i.ma','Découvrez Snay3i.ma, une plateforme marocaine qui facilite la recherche de professionnels pour les travaux et services à domicile.','<section><p class="meta">Snay3i.ma • Présentation</p><h1>À propos de Snay3i.ma</h1><h2>Notre mission</h2><p>Snay3i.ma cherche à simplifier la recherche d’un professionnel au Maroc en réunissant des informations utiles par métier et par ville.</p><p>Notre approche permet aux particuliers de consulter les informations disponibles, préparer leur demande et prendre contact directement.</p><h2>Une plateforme locale</h2><p>Les catégories comprennent notamment la plomberie, l’électricité, la maçonnerie, la peinture, la menuiserie, la climatisation, la serrurerie, le ménage, le jardinage et la soudure.</p></section>'],
  ['contact','Contact Snay3i.ma','Contactez l’équipe Snay3i.ma pour une question, un signalement ou une suggestion concernant la plateforme.','<section><p class="meta">Snay3i.ma • Contact</p><h1>Contactez Snay3i.ma</h1><h2>Nous contacter</h2><p>Pour toute question concernant la plateforme, envoyez un message à <a href="mailto:contact@snay3i.ma">contact@snay3i.ma</a>.</p><p>Pour signaler un problème avec une fiche professionnelle, indiquez le nom du professionnel, la ville et les informations utiles à la vérification.</p></section>'],
  ['privacy','Politique de confidentialité — Snay3i.ma','Consultez la politique de confidentialité de Snay3i.ma et les informations relatives aux cookies et services Google.','<section><p class="meta">Snay3i.ma • Confidentialité</p><h1>Politique de confidentialité</h1><h2>Informations collectées</h2><p>Snay3i.ma peut traiter les informations nécessaires au fonctionnement de la plateforme et aux demandes adressées à l’équipe.</p><h2>Cookies et publicité</h2><p>Les fournisseurs tiers, y compris Google, peuvent utiliser des cookies pour diffuser des annonces en fonction des visites antérieures d’un utilisateur sur notre site ou sur d’autres sites. Les utilisateurs peuvent désactiver la publicité personnalisée dans les paramètres des annonces Google.</p><p>La plateforme peut également utiliser des services de mesure d’audience lorsque ceux-ci sont activés et configurés conformément aux règles applicables.</p></section>'],
  ['terms','Conditions d’utilisation — Snay3i.ma','Consultez les conditions d’utilisation de la plateforme Snay3i.ma.','<section><p class="meta">Snay3i.ma • Conditions</p><h1>Conditions d’utilisation</h1><h2>Rôle de la plateforme</h2><p>Snay3i.ma fournit un service de recherche et de mise en relation. Vérifiez directement les informations, les tarifs et les conditions d’une prestation avant de vous engager.</p><h2>Contenu des profils</h2><p>Les informations présentes sur les profils peuvent évoluer. Un profil, un avis ou un badge ne constitue pas à lui seul une garantie de résultat ou de qualité pour une prestation donnée.</p></section>'],
  ['blog','Blog Snay3i.ma — Guides pratiques pour les travaux au Maroc','Guides pratiques pour choisir un artisan, préparer des travaux et comprendre les prestations courantes au Maroc.','<section><p class="meta">Snay3i.ma • Blog</p><h1>Guides pratiques pour les travaux et services au Maroc</h1><p>Le blog couvre la plomberie, l’électricité, la rénovation, le carrelage, la peinture, la menuiserie, la climatisation, la serrurerie, la maçonnerie, le jardinage et l’entretien de la maison.</p><p>Chaque guide vise à aider le lecteur à préparer sa demande, poser les bonnes questions et vérifier les informations utiles avant une prestation.</p></section>']
];

for (const [slug,title,description,body] of corePages) {
  write(slug, page({ title, description, selfPath: `/${slug}`, body }));
}

const cities = {
  casablanca: ['Casablanca','Dans une grande agglomération, confirmez le quartier, l’accès au logement et les éventuelles contraintes d’immeuble avant le rendez-vous.'],
  rabat: ['Rabat','Précisez le quartier et l’accès au logement ou au local. Pour les travaux planifiés, demandez un devis qui distingue main-d’œuvre, fournitures et éventuels déplacements.'],
  marrakech: ['Marrakech','Certains logements, riads ou zones peuvent présenter des contraintes d’accès particulières. Décrivez le bâtiment et l’accès avant de confirmer la prestation.'],
  tanger: ['Tanger','Pour un dépannage, la proximité peut compter. Pour un chantier, clarifiez l’accès, le stationnement et les horaires d’intervention.'],
  fes: ['Fès','Précisez si le chantier concerne un logement moderne, une maison ancienne ou une zone à accès limité. Ces contraintes peuvent influencer la logistique.'],
  agadir: ['Agadir','Indiquez clairement le type de logement ou de local et la nature de l’intervention. Pour les équipements techniques, partagez les informations utiles avant le déplacement.']
};

const services = {
  plombier:['Plombier','fuite, évier ou WC bouché, robinetterie, chauffe-eau ou installation sanitaire',['Décrire la panne et son emplacement','Indiquer si l’eau doit être coupée','Demander si un diagnostic sur place est nécessaire','Clarifier main-d’œuvre, pièces et déplacement']],
  electricien:['Électricien','panne, prise, éclairage, tableau, circuit dédié ou rénovation électrique',['Décrire les symptômes','Préciser si le disjoncteur déclenche','Demander ce qui sera testé ou remplacé','Vérifier les mesures de sécurité et le devis']],
  macon:['Maçon','cloison, réparation, dalle, mur, ouverture ou travaux de structure',['Décrire les dimensions approximatives','Préciser les matériaux existants','Demander les étapes prévues','Clarifier matériaux, main-d’œuvre, évacuation et délai']],
  bricoleur:['Bricoleur','petites réparations, montage, fixation, entretien ou travaux variés',['Lister les tâches','Partager des photos si elles facilitent le diagnostic','Préciser le matériel disponible','Demander si les fournitures sont incluses']],
  peintre:['Peintre','peinture intérieure, façade, préparation des murs et finitions',['Indiquer les pièces et surfaces','Préciser l’état des murs','Choisir le niveau de finition','Séparer préparation, peinture et fournitures']],
  menuisier:['Menuisier','portes, placards, cuisine, meubles sur mesure ou réparations',['Fournir les dimensions disponibles','Décrire l’usage et les contraintes','Comparer matériaux et finitions','Demander le détail des fournitures et de la pose']],
  carreleur:['Carreleur','sols, murs, salle de bain, cuisine ou rénovation de surfaces',['Mesurer approximativement la surface','Préciser le support','Décrire le carrelage envisagé','Demander le détail de préparation, pose et joints']],
  climatisation:['Climatisation','installation, entretien, nettoyage, diagnostic ou remplacement d’équipement',['Préciser la pièce et sa taille approximative','Indiquer l’équipement existant','Demander les contraintes d’installation','Clarifier entretien, déplacement et fournitures']],
  serrurier:['Serrurier','porte bloquée, clé perdue, serrure, cylindre ou sécurisation',['Décrire la situation sans publier d’informations sensibles','Demander le coût du déplacement et de l’intervention','Vérifier ce qui sera remplacé','Tester le fonctionnement avant de terminer']],
  menage:['Ménage','entretien régulier, nettoyage ponctuel, état des lieux ou remise en état',['Préciser la surface et le nombre de pièces','Lister les tâches','Indiquer les produits disponibles','Clarifier durée, fréquence et fournitures']],
  jardinier:['Jardinier','entretien, taille, arrosage, plantation ou aménagement extérieur',['Décrire la surface et les plantes concernées','Partager des photos du jardin','Préciser les déchets ou évacuations','Demander le détail entre entretien et fournitures']],
  soudeur:['Soudeur','réparation métallique, portail, garde-corps, structure ou fabrication sur mesure',['Décrire le métal et les dimensions','Préciser fabrication ou réparation','Indiquer les contraintes d’accès ou de sécurité','Demander le détail du matériau, fabrication et pose']]
};

for (const [serviceSlug,[service,situations,checks]] of Object.entries(services)) {
  for (const [citySlug,[city,cityContext]] of Object.entries(cities)) {
    const route = `/artisan/${serviceSlug}/${citySlug}`;
    const checklist = checks.map(item => `<li>${esc(item)}</li>`).join('');
    write(`artisan/${serviceSlug}/${citySlug}`, page({
      title: `${service} à ${city} — Snay3i.ma`,
      description: `Guide pratique pour rechercher un ${service.toLowerCase()} à ${city}, comparer les informations disponibles et préparer une demande de devis.`,
      selfPath: route,
      body: `<section><p class="meta">Snay3i.ma • Guide local</p><h1>${esc(service)} à ${esc(city)}</h1><h2>Pour quels besoins ?</h2><p>Les demandes peuvent concerner notamment : ${esc(situations)}. Une description claire aide le professionnel à comprendre la situation avant de se déplacer.</p><p>${esc(cityContext)}</p><h2>Préparer votre demande</h2><ul>${checklist}</ul><h2>Comparer avant de réserver</h2><p>Comparez le périmètre du travail, les fournitures, le déplacement, le délai et les conditions de paiement. Pour un travail important, demandez un devis suffisamment détaillé pour comparer des prestations équivalentes.</p></section>`
    }));
  }
}

for (const article of extractArticles()) {
  const body = `<article class="article"><section><p class="meta">Guide Snay3i.ma • contenu pratique</p><h1>${esc(article.title)}</h1><p>${esc(article.description)}</p></section><section>${markdownToHtml(article.content)}</section></article>`;
  write(`blog/${article.slug}`, page({
    title: `${article.title} — Snay3i.ma`,
    description: article.description,
    selfPath: `/blog/${article.slug}`,
    body,
    article: true
  }));
}

console.log(`Crawlable SEO pages generated: ${extractArticles().length} blog articles + ${Object.keys(services).length * Object.keys(cities).length} service/city pages + core pages`);
