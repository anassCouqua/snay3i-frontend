const fs = require('fs');
const path = require('path');

const publicRoot = path.join(process.cwd(), 'public');

const pages = [
  {
    route:'/artisan/menage/ouarzazate', service:'Ménage', city:'Ouarzazate', guide:'/blog/nettoyage-profond-maison-guide',
    profiles:[
      {name:'BELA HASSANI DADES SARL',phone:'0660473334',area:'61 Hay Essalam, Ouarzazate',source:'Go Africa Online',url:'https://www.goafricaonline.com/ma/578241-bela-hassani-dades-nettoyage-entretien-ouarzazate-maroc',note:'Entreprise référencée publiquement à Ouarzazate pour des activités comprenant le nettoyage, le jardinage et la maintenance.'},
      {name:'LIKOUM',phone:'0661481616',area:'Ouarzazate · service annoncé en ligne',source:'LIKOUM',url:'https://likoum.ma/femme-de-menage-a-ouarzazate/',note:'Service de ménage et de nettoyage annoncé publiquement pour Ouarzazate sur le site de l’entreprise.'}
    ]
  },
  {
    route:'/artisan/serrurier/tetouan', service:'Serrurier', city:'Tétouan', guide:'/blog/serrurier-urgence-maroc',
    profiles:[
      {name:'Auto Key : Serrurier & Reproduction des Clés',phone:'0652269663',area:'Groupe résidentielle Baladia Taboula, Tétouan',source:'Fiche Google Business',url:'https://www.google.com/maps/search/?api=1&query=Auto%20Key%20Serrurier%20T%C3%A9touan',note:'Fiche locale publique indiquant une activité de serrurerie et de reproduction de clés à Tétouan.'}
    ]
  },
  {
    route:'/artisan/plombier/khouribga', service:'Plombier', city:'Khouribga', guide:'/blog/trouver-bon-plombier-maroc',
    profiles:[
      {name:'GTE – Global Thermique & Énergétique',phone:'0707070666',area:'Khouribga · service annoncé sur le site de l’entreprise',source:'Site officiel GTE',url:'https://www.gte-service.com/gte/devis-plomberie-khouribga',note:'Entreprise qui publie des prestations de plomberie à Khouribga, notamment installation, entretien et dépannage.'},
      {name:'FelKhedma / Mussette',phone:'0762397426',area:'Khouribga · siège annoncé',source:'LinkedIn',url:'https://ma.linkedin.com/company/felkhedma-ma',note:'Page professionnelle rattachée à Khouribga indiquant la plomberie parmi les spécialités de services.'}
    ]
  },
  {
    route:'/artisan/menage/nador', service:'Ménage', city:'Nador', guide:'/blog/nettoyage-profond-maison-guide',
    profiles:[
      {name:'Homefix Gestion',phone:'0618269179',area:'Nador · services annoncés en ligne',source:'Site officiel',url:'https://www.homefixgestion.com/',note:'Entreprise qui annonce des services de nettoyage pour Nador et différents types de locaux.'},
      {name:'Bio Hygiène Service',phone:'0539686864',area:'Nador · intervention signalée publiquement',source:'LinkedIn',url:'https://ma.linkedin.com/company/bio-hygi%C3%A8ne-service',note:'Entreprise de nettoyage dont une publication professionnelle signale une intervention à la Gare Maritime de Nador.'}
    ]
  },
  {
    route:'/artisan/menage/beni-mellal', service:'Ménage', city:'Béni Mellal', guide:'/blog/nettoyage-profond-maison-guide',
    profiles:[
      {name:'SNG Maroc',phone:'0661207675',area:'Béni Mellal · activité annoncée',source:'Yelo',url:'https://www.yelo.ma/company/211318/SNG_Service_de_nettoyage_et_gardiennage_Maroc',note:'Société de nettoyage et gardiennage dont les informations publiques indiquent une présence à Béni Mellal.'},
      {name:'LIKOUM',phone:'0666672561',area:'Béni Mellal · service annoncé en ligne',source:'LIKOUM',url:'https://likoum.ma/femme-de-menage-a-beni-mellal/',note:'Page dédiée aux services de femme de ménage à Béni Mellal publiée sur le site de l’entreprise.'}
    ]
  },
  {
    route:'/artisan/plombier/al-hoceima', service:'Plombier', city:'Al Hoceima', guide:'/blog/trouver-bon-plombier-maroc',
    profiles:[
      {name:'Plombier et électricité HOCEIMA',phone:'0648438326',area:'Avenue Tarik Ibn Ziyad, Al Hoceïma',source:'Fiche Google Business',url:'https://www.google.com/maps/search/?api=1&query=Plombier%20et%20%C3%A9lectricit%C3%A9%20HOCEIMA%2C%20Al%20Hoce%C3%AFma',note:'Entreprise locale référencée publiquement à Al Hoceïma pour des services de plomberie et d’électricité.'},
      {name:'Mon Plombier',phone:'0605120328',area:'Al Hoceïma · service annoncé en ligne',source:'Mon Plombier',url:'https://monplombier.ma/plombier-al-hoceima/',note:'Service de plomberie avec une page consacrée aux interventions à Al Hoceïma.'}
    ]
  }
];

function esc(value){
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function wa(value){
  const digits=String(value||'').replace(/\D/g,'');
  return digits.startsWith('0') ? '212'+digits.slice(1) : digits;
}

function profileCard(profile){
  return `<article class='provider'>
    <span class='status'>Information publique · fiche non revendiquée</span>
    <h2>${esc(profile.name)}</h2>
    <p class='area'>📍 ${esc(profile.area)}</p>
    <p>${esc(profile.note)}</p>
    <p class='source'>Source : <a href='${esc(profile.url)}' target='_blank' rel='nofollow noopener'>${esc(profile.source)}</a></p>
    <div class='actions'>
      <a class='call' href='tel:${esc(profile.phone)}'>📞 Appeler</a>
      <a class='whatsapp' href='https://wa.me/${esc(wa(profile.phone))}' target='_blank' rel='nofollow noopener'>💬 WhatsApp</a>
    </div>
  </article>`;
}

function pageHtml(item){
  const count=item.profiles.length;
  const profileWord=count===1?'référence publique repérée':'références publiques repérées';
  return `<!doctype html>
<html lang='fr'>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1'>
<title>${esc(item.service)} à ${esc(item.city)} — recherche locale | Snay3i.ma</title>
<meta name='description' content='Références publiques pour ${esc(item.service.toLowerCase())} à ${esc(item.city)}. Consultez les sources et confirmez les informations avant de contacter un professionnel.'>
<meta name='robots' content='noindex,follow'>
<link rel='canonical' href='https://snay3i.ma${esc(item.route)}'>
<meta name='referrer' content='strict-origin-when-cross-origin'>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav,footer>div{max-width:880px;margin:auto;display:flex;gap:16px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:900px;margin:auto;padding:34px 20px 64px}.hero,.provider,.panel{background:#fff;border:1px solid #e8e0d4;border-radius:18px}.hero{padding:30px;margin-bottom:16px}.hero h1{font-size:32px;line-height:1.2;margin:8px 0 10px}.status{display:inline-block;background:#fff3df;color:#8a4c16;padding:6px 11px;border-radius:999px;font-size:12px;font-weight:800}.provider{padding:20px;margin:12px 0}.provider h2{font-size:19px;margin:8px 0 4px}.area{color:#6f6a64;font-size:13px}.source{font-size:12px;color:#6f6a64}.source a,a{color:#a94924}.actions{display:flex;gap:9px;margin-top:15px}.actions a{flex:1;text-align:center;padding:10px 12px;border-radius:10px;text-decoration:none;font-weight:800}.call{background:#eaf4fb;color:#124d72!important}.whatsapp{background:#edf8ed;color:#176235!important}.panel{padding:22px;margin-top:16px}.fine{font-size:13px;color:#6f6a64}.notice{background:#fff8e8;border:1px solid #ead9af;border-radius:12px;padding:14px;font-size:13px;color:#615b55}@media(max-width:600px){.hero h1{font-size:27px}.actions{flex-direction:column}}
</style>
</head>
<body>
<header><nav><a href='/'>Accueil</a><a href='/blog'>Guides</a><a href='/outils'>Outils</a><a href='/rejoindre'>Créer un profil</a><a href='/contact'>Contact</a></nav></header>
<main>
<section class='hero'>
<span class='status'>${count} ${profileWord}</span>
<h1>${esc(item.service)} à ${esc(item.city)}</h1>
<p>Nous avons trouvé des entreprises ou services publiquement associés à cette activité et à cette ville. Cette page sert à compléter la recherche locale pendant que Snay3i développe son offre propre.</p>
<p class='fine'>Les fiches ci-dessous ne sont pas des inscriptions Snay3i. Nous n'indiquons aucune vérification, note, avis, disponibilité ou garantie qui n'est pas établie par la source. Les coordonnées doivent être confirmées avant utilisation.</p>
</section>
<section class='panel'>
<h2>Références publiques</h2>
${item.profiles.map(profileCard).join('')}
</section>
<section class='panel'>
<h2>Préparer votre demande</h2>
<p>Décrivez le besoin avec précision, ajoutez le quartier et envoyez des photos lorsque cela peut éviter un déplacement inutile. Pour comparer plusieurs propositions, demandez séparément le déplacement, la main-d’œuvre, les fournitures, le délai et les conditions de paiement.</p>
<p><a href='${esc(item.guide)}'>Lire le guide pratique associé</a> · <a href='/outils/brief-artisan'>Préparer un brief</a> · <a href='/outils/comparateur-devis'>Comparer des devis</a></p>
</section>
<section class='panel'>
<h2>Pourquoi la page reste non indexée pour le moment</h2>
<p>Snay3i ne transforme pas automatiquement chaque recherche locale en page indexable. Tant que l’offre locale n’est pas suffisamment documentée et maintenue, cette page reste accessible aux visiteurs mais exclue de l’index Google. Cela nous permet de privilégier la qualité et la transparence plutôt que le volume de pages.</p>
<div class='notice'>Une entreprise peut demander une correction ou souhaiter revendiquer une fiche publique via <a href='/contact'>la page de contact</a>. Une revendication ne sera pas présentée comme une vérification sans élément permettant de l’établir.</div>
</section>
</main>
<footer><div>© 2026 Snay3i.ma · <a href='/privacy'>Confidentialité</a> · <a href='/terms'>CGU</a> · <a href='/contact'>Contact</a></div></footer>
</body>
</html>`;
}

for(const item of pages){
  const out=path.join(publicRoot,item.route.slice(1),'index.html');
  fs.mkdirSync(path.dirname(out),{recursive:true});
  const html=pageHtml(item);
  if(!/name='robots' content='noindex,follow'/i.test(html)) throw new Error(item.route+': noindex missing');
  if(/adsbygoogle|google-adsense-account/i.test(html)) throw new Error(item.route+': ad tag leak');
  if((html.match(/class='provider'/g)||[]).length < 1) throw new Error(item.route+': no public provider cards generated');
  fs.writeFileSync(out,html,'utf8');
}
console.log(`[public-source demand pages] PASS: populated ${pages.length} demand pages with public-source providers while keeping them noindex and ad-free`);