const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo', 'artisan', 'plombier');
const BASE = 'https://snay3i.ma';
const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const pages = {
  casablanca: {
    city: 'Casablanca',
    description: 'Conseils pratiques pour trouver un plombier à Casablanca, décrire une fuite ou une panne sanitaire et comparer les informations avant un devis.',
    intro: 'Pour rechercher un plombier à Casablanca, décrivez précisément le problème, la pièce concernée et ce qui a déjà été tenté. Pour une fuite active, indiquez aussi si l’arrivée d’eau a pu être coupée.',
    local: 'Précisez le quartier, l’étage et les contraintes d’accès de l’immeuble ou du local. Pour une intervention urgente, confirmez le coût du déplacement et les conditions avant l’intervention lorsque la situation le permet.',
    checks: ['Décrire la fuite, le bouchon ou la panne et son emplacement exact','Préciser le quartier et les contraintes d’accès','Indiquer si l’eau peut être coupée et si le problème est urgent','Demander le détail du diagnostic, de la main-d’œuvre et des pièces','Comparer au moins deux devis lorsque la situation le permet'],
    related: [['/blog/trouver-bon-plombier-maroc','Comment trouver un bon plombier au Maroc'],['/blog/urgence-plomberie-casablanca','Guide urgence plomberie à Casablanca'],['/artisan/plombier/kenitra','Plombier à Kénitra'],['/artisan/plombier/oujda','Plombier à Oujda']]
  },
  martil: {
    city: 'Martil',
    description: 'Guide pratique pour rechercher un plombier à Martil, expliquer une fuite ou une panne sanitaire et préparer une demande de devis claire.',
    intro: 'Pour trouver un plombier à Martil, donnez le type de panne, son emplacement et le niveau d’urgence. Une photo de l’équipement peut aider à préparer le diagnostic avant le déplacement.',
    local: 'Indiquez le quartier, le type de logement et les conditions d’accès. Pour une résidence ou un appartement, précisez l’étage et les éventuelles règles d’accès ou de stationnement.',
    checks: ['Identifier le point de fuite ou l’équipement concerné','Préciser depuis quand le problème existe','Indiquer si l’arrivée d’eau est accessible','Demander le coût du déplacement avant la visite','Faire confirmer les pièces et la main-d’œuvre dans le devis'],
    related: [['/blog/trouver-bon-plombier-maroc','Guide pour choisir un plombier'],['/artisan/plombier/tanger','Plombier à Tanger'],['/artisan/plombier/oujda','Plombier à Oujda']]
  },
  marrakech: {
    city: 'Marrakech',
    description: 'Guide local pour rechercher un plombier à Marrakech, préparer un dépannage sanitaire et comparer les informations avant intervention.',
    intro: 'Pour un plombier à Marrakech, précisez le problème, l’équipement concerné et les contraintes d’accès. Pour un riad, une maison ancienne ou un logement difficile d’accès, décrivez la configuration avant la visite.',
    local: 'Pour un chantier planifié, précisez le quartier et l’accès au logement. Demandez un devis suffisamment détaillé lorsque plusieurs interventions ou fournitures sont nécessaires.',
    checks: ['Décrire précisément la panne et son emplacement','Préciser le type de logement et les contraintes d’accès','Indiquer si l’intervention est urgente','Demander ce qui est compris dans le déplacement et le diagnostic','Faire distinguer pièces, main-d’œuvre et éventuels travaux complémentaires'],
    related: [['/blog/trouver-bon-plombier-maroc','Comment trouver un bon plombier au Maroc'],['/blog/plombier-marrakech-guide','Guide plomberie à Marrakech'],['/artisan/plombier/casablanca','Plombier à Casablanca'],['/artisan/plombier/oujda','Plombier à Oujda']]
  },
  tanger: {
    city: 'Tanger',
    description: 'Conseils pour trouver un plombier à Tanger, préparer un dépannage ou une réparation et comparer les informations avant un devis.',
    intro: 'Une demande de plombier à Tanger est plus facile à traiter quand vous précisez la panne, le logement ou local concerné et l’accès au lieu d’intervention. Pour une fuite, indiquez si elle est active et si l’eau a pu être coupée.',
    local: 'Précisez le quartier, l’étage et les contraintes d’accès ou de stationnement. Pour une intervention importante, demandez un devis détaillant les fournitures, la main-d’œuvre et les délais.',
    checks: ['Décrire le problème et l’équipement concerné','Préciser le quartier et l’accès au bâtiment','Indiquer si la situation nécessite une intervention rapide','Demander si le diagnostic ou le déplacement est facturé','Comparer le détail des devis et les fournitures prévues'],
    related: [['/blog/trouver-bon-plombier-maroc','Guide pour choisir un plombier'],['/blog/artisan-tanger-guide-2026','Guide des artisans à Tanger'],['/artisan/plombier/marrakech','Plombier à Marrakech'],['/artisan/plombier/kenitra','Plombier à Kénitra']]
  }
};

const page = ({ city, description, intro, local, checks, related }) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plombier à ${esc(city)} — Trouver un professionnel | Snay3i.ma</title>
<meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow">
<link rel="canonical" href="${BASE}/artisan/plombier/${city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}">
<style>body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav{max-width:900px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:900px;margin:auto;padding:44px 22px}section{background:#fff;border:1px solid #e8e0d4;border-radius:16px;padding:26px;margin:0 0 16px}h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:21px;color:#0d1b2a}h3{font-size:17px;color:#0d1b2a}.meta{color:#6f6a64;font-size:14px}li{margin-bottom:7px}ul{padding-left:22px}a{color:#b34f24}</style>
<script type="application/ld+json" data-snay3i-growth="1">${JSON.stringify({ '@context':'https://schema.org', '@type':'WebPage', '@id':`${BASE}/artisan/plombier/${city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}#webpage`, url:`${BASE}/artisan/plombier/${city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}`, name:`Plombier à ${city} — Trouver un professionnel | Snay3i.ma`, description, inLanguage:'fr'})}</script>
</head><body><header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header>
<main><section><p class="meta">Snay3i.ma • Plombier • ${esc(city)}</p><h1>Plombier à ${esc(city)}</h1><p>${esc(intro)}</p><p>${esc(local)}</p></section>
<section><h2>Comment préparer votre demande</h2><ul>${checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
<section><h2>Questions utiles avant l’intervention</h2><div><h3>Quelles informations partager pour obtenir une réponse plus précise ?</h3><p>Décrivez la nature du besoin, le lieu, les contraintes d’accès et les éléments techniques ou dimensions que vous connaissez. Une photo peut être utile lorsque cela aide à identifier l’équipement.</p></div><div><h3>Que faut-il vérifier avant de confirmer la prestation ?</h3><p>Confirmez le périmètre du travail, le déplacement, les fournitures éventuelles, le délai et les conditions de paiement. Pour des travaux importants, demandez un devis détaillé.</p></div><div><h3>Quand prévoir une visite ou un diagnostic ?</h3><p>Une visite peut être nécessaire lorsque l’état de l’installation, les dimensions, l’accès ou l’origine de la panne ne peuvent pas être déterminés à distance.</p></div></section>
<section><h2>Avant de choisir un plombier à ${esc(city)}</h2><p>Comparez des prestations équivalentes et vérifiez directement avec le professionnel ses tarifs, disponibilités, conditions de déplacement, fournitures et délai. Les informations affichées sur Snay3i.ma dépendent des données disponibles sur chaque profil.</p></section>
<section><h2>Guides et recherches utiles</h2><p>${related.map(([url,label])=>`<a href="${url}">${esc(label)}</a>`).join(' · ')}</p><p><a href="/blog">Voir les guides pratiques de Snay3i.ma</a></p></section></main>
<footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer></body></html>`;

for (const [slug, data] of Object.entries(pages)) {
  const target = path.join(root, slug, 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, page(data), 'utf8');
}
console.log(`Plumbing growth pages optimized: ${Object.keys(pages).length}`);
