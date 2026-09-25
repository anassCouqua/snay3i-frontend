const fs = require('fs');
const path = require('path');
const data = require('../src/curated-service-city-data.json');
const routes = require('../src/service-city-index-routes.json');

const root = path.join(__dirname, '..');
const publicRoot = path.join(root, 'public');

const GUIDE_BY_SERVICE = {
  plombier: '/blog/trouver-bon-plombier-maroc',
  serrurier: '/blog/serrurier-urgence-maroc',
  bricoleur: '/blog/petites-reparations-bricoleur-maison-maroc',
  carreleur: '/blog/choisir-carreleur-maroc',
  menage: '/blog/nettoyage-profond-maison-guide',
  soudeur: '/blog/projet-soudure-ferronnerie-maroc'
};

const PREP_BY_SERVICE = {
  plombier: [
    'Décrivez la fuite, le sanitaire ou l’équipement concerné.',
    'Indiquez si l’eau est coupée et si le problème est urgent.',
    'Demandez si le déplacement et les pièces sont inclus dans le devis.'
  ],
  serrurier: [
    'Précisez le type de porte, serrure ou clé concerné.',
    'Expliquez si la porte est claquée, verrouillée ou endommagée.',
    'Demandez le prix du déplacement et des pièces avant l’intervention.'
  ],
  bricoleur: [
    'Regroupez les petites réparations à réaliser dans une seule liste.',
    'Ajoutez des photos ou dimensions quand elles peuvent éviter un déplacement inutile.',
    'Confirmez qui fournit les matériaux et accessoires nécessaires.'
  ],
  carreleur: [
    'Indiquez la surface approximative et le type de support.',
    'Précisez si le carrelage ou le zellige est déjà acheté.',
    'Demandez si la préparation, les découpes, les joints et les finitions sont inclus.'
  ],
  menage: [
    'Précisez le type de logement ou local et la surface approximative.',
    'Indiquez s’il s’agit d’un entretien courant, vitres ou fin de chantier.',
    'Confirmez si les produits et le matériel sont fournis.'
  ],
  soudeur: [
    'Décrivez l’ouvrage : portail, grille, garde-corps ou réparation.',
    'Partagez les dimensions, photos et contraintes d’accès disponibles.',
    'Demandez ce qui est inclus : fabrication, transport, pose et finition.'
  ]
};

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wa(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.startsWith('0') ? '212' + digits.slice(1) : digits;
}

function words(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean).length;
}

function listingCard(profile) {
  return `<article class="listing" data-directory-listing="${esc(profile.id)}">
    <div>
      <h3>${esc(profile.name)}</h3>
      <p class="area">📍 ${esc(profile.area)}</p>
      <p>${esc(profile.bio)}</p>
    </div>
    <div class="actions">
      <a class="call" data-lead-action="call" href="tel:${esc(profile.phone)}">📞 Appeler</a>
      <a class="whatsapp" data-lead-action="whatsapp" href="https://wa.me/${esc(wa(profile.whatsapp || profile.phone))}" rel="nofollow noopener" target="_blank">💬 WhatsApp</a>
    </div>
  </article>`;
}

function htmlFor(route, item) {
  const profiles = item.profiles || [];
  if (profiles.length < 2) throw new Error(`[directory pages] ${route} has fewer than 2 usable profiles`);
  for (const profile of profiles) {
    if (!/^0\d{9}$/.test(profile.phone || '')) throw new Error(`[directory pages] invalid Moroccan phone on ${route}: ${profile.name}`);
  }

  const prep = PREP_BY_SERVICE[item.service_slug] || [
    'Décrivez clairement votre besoin et votre zone.',
    'Demandez ce qui est inclus avant de confirmer.',
    'Comparez des prestations portant sur le même périmètre.'
  ];
  const guide = GUIDE_BY_SERVICE[item.service_slug] || '/blog';
  const otherRoutes = routes.filter((r) => r !== route)
    .filter((r) => (data[r] && (data[r].city_slug === item.city_slug || data[r].service_slug === item.service_slug)))
    .slice(0, 4);
  const related = otherRoutes.map((r) => {
    const x = data[r];
    return `<a href="${esc(r)}">${esc(x.service_label)} à ${esc(x.city)}</a>`;
  }).join(' · ');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${item.service_label} à ${item.city}`,
    url: `https://snay3i.ma${route}`,
    isPartOf: { '@type': 'WebSite', name: 'Snay3i.ma', url: 'https://snay3i.ma/' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: profiles.length,
      itemListElement: profiles.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: p.name
      }))
    }
  };

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(item.service_label)} à ${esc(item.city)} — profils et contact | Snay3i.ma</title>
<meta name="description" content="${esc(profiles.length)} profils de ${item.service_label.toLowerCase()} à ${item.city} sur Snay3i.ma. Consultez les informations publiées et contactez directement les professionnels.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://snay3i.ma${esc(route)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.65}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav,footer>div{max-width:980px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:980px;margin:auto;padding:36px 20px 56px}.hero,.panel,.listing{background:#fff;border:1px solid #e8e0d4;border-radius:18px}.hero{padding:30px;margin-bottom:18px}.hero h1{font-size:34px;line-height:1.15;margin:0 0 10px}.hero p{max-width:760px}.count{display:inline-block;background:#f2e7dc;color:#9f451f;border-radius:999px;padding:6px 11px;font-weight:700;font-size:13px}.panel{padding:24px;margin-top:18px}.listings{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px}.listing{padding:20px;display:flex;flex-direction:column;justify-content:space-between}.listing h3{font-size:18px;margin:0 0 5px}.listing p{margin:6px 0}.area{color:#6f6a64;font-size:14px}.actions{display:flex;gap:8px;margin-top:16px}.actions a{flex:1;text-align:center;padding:10px 12px;border-radius:10px;text-decoration:none;font-weight:700}.call{background:#eaf4fb;color:#124d72}.whatsapp{background:#edf8ed;color:#176235}h2{font-size:22px;margin:0 0 14px}li{margin:7px 0}.notice{font-size:14px;color:#615b55;background:#fff8e8;border:1px solid #ead9af;border-radius:12px;padding:14px}.links a,a{color:#a94924}.fine{font-size:13px;color:#6f6a64}@media(max-width:600px){.hero h1{font-size:28px}.actions{flex-direction:column}}
</style>
</head>
<body>
<header><nav><a href="/">Accueil</a><a href="/blog">Guides</a><a href="/outils">Outils</a><a href="/rejoindre">Créer un profil</a><a href="/contact">Contact</a></nav></header>
<main>
<section class="hero">
  <span class="count">${profiles.length} profils disponibles</span>
  <h1>${esc(item.service_label)} à ${esc(item.city)}</h1>
  <p>Consultez les profils actuellement publiés pour ${esc(item.city)}, puis contactez directement le professionnel pour expliquer votre besoin, vérifier sa disponibilité et demander les conditions de l’intervention.</p>
  <p class="fine">Snay3i.ma est un annuaire. La présence d’un profil ne constitue pas une certification, une garantie de disponibilité ni une validation de la qualité du travail.</p>
</section>

<section class="panel">
  <h2>Profils disponibles à ${esc(item.city)}</h2>
  <div class="listings">${profiles.map(listingCard).join('\n')}</div>
</section>

<section class="panel">
  <h2>Préparer votre demande</h2>
  <ul>${prep.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  <p>Avant de vous engager, confirmez directement le périmètre du travail, le déplacement, les fournitures, le délai et les conditions de paiement. Pour un travail important, demandez un devis écrit suffisamment détaillé pour comparer des prestations équivalentes.</p>
</section>

<section class="panel">
  <h2>Comment utiliser cette page</h2>
  <p>Les coordonnées ci-dessus proviennent des informations publiées dans l’annuaire Snay3i.ma. Contactez le professionnel pour vérifier que ses coordonnées, sa zone d’intervention et ses services sont toujours à jour. Si une information semble incorrecte, <a href="/contact">signalez-la à Snay3i.ma</a>.</p>
  <div class="notice">Ne versez pas d’acompte uniquement sur la base d’un profil en ligne. Pour les travaux techniques ou importants, vérifiez les éléments nécessaires directement avec le professionnel et conservez une trace écrite du devis et des changements convenus.</div>
</section>

<section class="panel links">
  <h2>Guides et recherches utiles</h2>
  <p><a href="${esc(guide)}">Lire le guide pratique pour ce métier</a>${related ? ' · ' + related : ''}</p>
  <p><a href="/">Rechercher un autre artisan</a> · <a href="/outils/comparateur-devis">Comparer plusieurs devis</a></p>
</section>
</main>
<footer><div>© 2026 Snay3i.ma · <a href="/about">À propos</a> · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer>
</body>
</html>`;
}

const dataRoutes = Object.keys(data).sort();
const configured = [...routes].sort();
if (JSON.stringify(dataRoutes) !== JSON.stringify(configured)) {
  throw new Error('[directory pages] route list and curated data are out of sync');
}

let written = 0;
for (const route of routes) {
  const item = data[route];
  if (!item) throw new Error(`[directory pages] missing data for ${route}`);
  const out = path.join(publicRoot, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const html = htmlFor(route, item);
  if (words(html.replace(/<[^>]+>/g, ' ')) < 250) throw new Error(`[directory pages] ${route} is unexpectedly thin`);
  fs.writeFileSync(out, html, 'utf8');
  written += 1;
}
console.log(`[directory pages] PASS: generated ${written} demand-backed service-city pages with real profile listings`);
