const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');

const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const page = ({ title, description, heading, body, links = [] }) => `<!doctype html>
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
</style>
</head>
<body>
<header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header>
<main><section><p class="meta">Snay3i.ma • Guide et information</p><h1>${esc(heading)}</h1><p>${esc(description)}</p></section>${body}<section><h2>Snay3i.ma</h2><p>Snay3i.ma est une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour les travaux et services à domicile. Les informations affichées dépendent des données disponibles sur chaque profil.</p><p>Avant toute prestation, vérifiez directement avec le professionnel les tarifs, les disponibilités, la nature du travail et les éventuels frais.</p>${links.filter(l => !l.self).map(l => `<p><a href="${esc(l.href)}">${esc(l.label)}</a></p>`).join('')}</section></main>
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

const cities = {
  casablanca: 'Casablanca', rabat: 'Rabat', marrakech: 'Marrakech', tanger: 'Tanger', fes: 'Fès', agadir: 'Agadir'
};
const services = {
  plombier: 'Plombier', electricien: 'Électricien', macon: 'Maçon', bricoleur: 'Bricoleur', peintre: 'Peintre', menuisier: 'Menuisier', carreleur: 'Carreleur', climatisation: 'Climatisation', serrurier: 'Serrurier', menage: 'Ménage', jardinier: 'Jardinier', soudeur: 'Soudeur'
};

for (const [serviceSlug, service] of Object.entries(services)) {
  for (const [citySlug, city] of Object.entries(cities)) {
    const route = `artisan/${serviceSlug}/${citySlug}`;
    write(route, page({
      title: `${service} à ${city} — Snay3i.ma`,
      description: `Recherchez des ${service.toLowerCase()} et professionnels pour vos besoins à ${city}. Consultez les informations disponibles et contactez directement les professionnels référencés sur Snay3i.ma.`,
      heading: `${service} à ${city}`,
      body: `<section><h2>Comment rechercher un ${service.toLowerCase()} à ${city} ?</h2><p>Commencez par consulter les profils disponibles pour ${city}, vérifiez les compétences indiquées et prenez contact pour décrire votre besoin.</p><ul><li>Décrivez précisément les travaux ou la panne.</li><li>Demandez un devis et clarifiez les frais de déplacement ou de matériel.</li><li>Vérifiez les disponibilités et les conditions avant le début du travail.</li></ul></section>`,
      links: [{ href: `/artisan/${serviceSlug}/${citySlug}`, self: true }, { href: '/blog', label: 'Lire les guides pratiques' }, { href: '/contact', label: 'Contacter Snay3i.ma' }]
    }));
  }
}

const articles = [
  ['trouver-bon-plombier-maroc','Comment trouver un bon plombier au Maroc','Conseils pratiques pour comparer des profils, décrire une panne, demander un devis et vérifier les informations avant une intervention de plomberie.'],
  ['tarif-electricien-maroc-2026','Tarif électricien Maroc 2026','Guide pour comprendre les facteurs qui influencent le prix d’une intervention électrique au Maroc et préparer une demande de devis précise.'],
  ['renovation-maison-maroc-guide','Guide de rénovation maison au Maroc','Les principales étapes d’une rénovation : diagnostic, budget, ordre des travaux, choix des professionnels et suivi du chantier.'],
  ['choisir-carreleur-maroc','Comment choisir un carreleur au Maroc','Points à vérifier avant de choisir un carreleur : préparation du support, matériaux, finition, métrés et devis.'],
  ['trouver-snay3i-maroc-darija','Comment trouver un professionnel au Maroc en Darija','Vocabulaire et conseils simples pour expliquer un besoin de travaux et comparer les informations d’un professionnel.'],
  ['urgence-plomberie-casablanca','Urgence plomberie à Casablanca : les premiers réflexes','Gestes de première urgence, informations à préparer et points à vérifier avant de faire intervenir un plombier.'],
  ['peintre-maison-maroc-conseils','Choisir un peintre pour sa maison au Maroc','Préparation des surfaces, choix de peinture, estimation des quantités et questions à poser avant le chantier.'],
  ['menuisier-cuisine-maroc','Menuisier cuisine au Maroc : préparer son projet','Mesures, matériaux, rangements, finitions et devis : les éléments utiles avant de lancer une cuisine sur mesure.'],
  ['climatisation-maroc-installation','Climatisation au Maroc : installation et entretien','Conseils pour choisir une solution adaptée, préparer l’installation et organiser l’entretien d’un climatiseur.'],
  ['serrurier-urgence-maroc','Serrurier au Maroc : gérer une urgence','Que faire en cas de clé perdue, serrure bloquée ou porte coincée, et comment demander une intervention clairement.'],
  ['macon-construction-maroc','Maçon au Maroc : préparer des travaux de construction','Les points essentiels à clarifier avant des travaux de maçonnerie : périmètre, matériaux, étapes, délais et devis.'],
  ['jardinier-paysagiste-maroc','Jardinier et paysagiste au Maroc : organiser son projet','Comment décrire un besoin d’entretien ou d’aménagement extérieur et comparer les prestations proposées.'],
  ['artisan-marrakech-guide','Trouver un artisan à Marrakech : guide pratique','Méthode pour rechercher un professionnel à Marrakech, vérifier les informations utiles et préparer une demande de devis.'],
  ['electricien-casablanca-guide','Électricien à Casablanca : points à vérifier','Conseils de sécurité et questions utiles pour choisir un professionnel de l’électricité à Casablanca.'],
  ['entretien-maison-maroc-checklist','Entretien de la maison au Maroc : checklist','Une checklist pratique pour anticiper plomberie, électricité, peinture, climatisation et petits travaux au fil de l’année.']
];

for (const [slug, title, description] of articles) {
  write(`blog/${slug}`, page({
    title: `${title} — Snay3i.ma`,
    description,
    heading: title,
    body: `<section><h2>Ce guide en pratique</h2><p>${esc(description)}</p><p>Avant une intervention, décrivez votre besoin, demandez les éléments importants du devis et vérifiez directement avec le professionnel les conditions de la prestation.</p></section>`,
    links: [{ href: `/blog/${slug}`, self: true }, { href: '/blog', label: 'Retour au blog' }, ...common]
  }));
}

console.log('Crawlable SEO pages generated');
