const fs = require('fs');
const path = require('path');

const publicRoot = path.join(process.cwd(), 'public');

const pages = [
  { route:'/artisan/menage/ouarzazate', service:'Ménage', city:'Ouarzazate', guide:'/blog/nettoyage-profond-maison-guide' },
  { route:'/artisan/serrurier/tetouan', service:'Serrurier', city:'Tétouan', guide:'/blog/serrurier-urgence-maroc' },
  { route:'/artisan/plombier/khouribga', service:'Plombier', city:'Khouribga', guide:'/blog/trouver-bon-plombier-maroc' },
  { route:'/artisan/menage/nador', service:'Ménage', city:'Nador', guide:'/blog/nettoyage-profond-maison-guide' },
  { route:'/artisan/menage/beni-mellal', service:'Ménage', city:'Béni Mellal', guide:'/blog/nettoyage-profond-maison-guide' },
  { route:'/artisan/plombier/al-hoceima', service:'Plombier', city:'Al Hoceima', guide:'/blog/trouver-bon-plombier-maroc' },
];

function esc(value){
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function pageHtml(item){
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(item.service)} à ${esc(item.city)} — recherche en cours | Snay3i.ma</title>
<meta name="description" content="Snay3i.ma ne publie pas encore assez de profils pour cette recherche. Utilisez la recherche principale ou créez un profil professionnel.">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="https://snay3i.ma${esc(item.route)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav,footer>div{max-width:880px;margin:auto;display:flex;gap:16px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:880px;margin:auto;padding:48px 20px 64px}.card{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:30px;margin-bottom:16px}h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:21px}.status{display:inline-block;background:#fff3df;color:#8a4c16;padding:6px 11px;border-radius:999px;font-size:13px;font-weight:800}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.actions a{padding:11px 16px;border-radius:10px;text-decoration:none;font-weight:800;background:#f2e7dc;color:#9f451f}.fine{font-size:14px;color:#6f6a64}a{color:#a94924}
</style>
</head>
<body>
<header><nav><a href="/">Accueil</a><a href="/blog">Guides</a><a href="/outils">Outils</a><a href="/rejoindre">Créer un profil</a></nav></header>
<main>
<section class="card">
<span class="status">Recherche disponible, offre locale à compléter</span>
<h1>${esc(item.service)} à ${esc(item.city)}</h1>
<p>Nous n’avons pas encore assez de profils professionnels publiés pour maintenir une page locale complète pour cette combinaison métier et ville. Plutôt que d’afficher une liste vide ou de présenter des informations génériques comme une offre locale, Snay3i.ma vous renvoie vers la recherche principale.</p>
<div class="actions"><a href="/">Rechercher sur Snay3i.ma</a><a href="/rejoindre">Je suis professionnel à ${esc(item.city)}</a></div>
</section>
<section class="card">
<h2>En attendant de nouveaux profils</h2>
<p>Préparez votre demande avec le type de prestation, le quartier, les contraintes d’accès, des photos lorsque cela aide et les délais souhaités. Demandez ensuite ce qui est compris dans le déplacement, la main-d’œuvre, les fournitures et les conditions de paiement.</p>
<p><a href="${esc(item.guide)}">Lire le guide pratique associé</a> · <a href="/outils/brief-artisan">Préparer un brief</a> · <a href="/outils/comparateur-devis">Comparer des devis</a></p>
<p class="fine">Cette page reste volontairement exclue de l’index Google tant que l’offre locale n’est pas suffisante. Elle existe pour éviter qu’un ancien résultat de recherche mène à une page introuvable.</p>
</section>
</main>
<footer><div>© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer>
</body>
</html>`;
}

for(const item of pages){
  const out=path.join(publicRoot,item.route.slice(1),'index.html');
  fs.mkdirSync(path.dirname(out),{recursive:true});
  const html=pageHtml(item);
  if(!/name="robots" content="noindex,follow"/i.test(html)) throw new Error(item.route+': noindex missing');
  if(/adsbygoogle|google-adsense-account/i.test(html)) throw new Error(item.route+': ad tag leak');
  fs.writeFileSync(out,html,'utf8');
}
console.log(`[stale demand recovery] PASS: ${pages.length} high-demand zero-supply routes now return useful 200/noindex pages instead of 404s`);
