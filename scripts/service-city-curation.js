const fs = require('fs');
const path = require('path');
const { INDEXABLE_SERVICE_CITY_ROUTES } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public');
const artisanRoot = path.join(publicRoot, 'artisan');
const curated = new Set(INDEXABLE_SERVICE_CITY_ROUTES);

const GUIDE_BY_TRADE = {
  plombier: '/blog/trouver-bon-plombier-maroc',
  electricien: '/blog/tarif-electricien-maroc-2026',
  macon: '/blog/macon-construction-maroc',
  peintre: '/blog/renovation-maison-maroc-guide',
  menuisier: '/blog/renovation-maison-maroc-guide',
  climatisation: '/blog/climatisation-maroc-installation',
  serrurier: '/blog/serrurier-urgence-maroc',
  carreleur: '/blog/choisir-carreleur-maroc',
};

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function label(value) {
  return String(value)
    .split('-')
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : part)
    .join(' ');
}

function setRobots(html, value) {
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${value}">`);
  }
  return html.replace('</head>', `<meta name="robots" content="${value}">\n</head>`);
}

function stripAdsense(html) {
  html = html.replace(/\s*<meta\s+name=["']google-adsense-account["'][^>]*>/gi, '');
  html = html.replace(/\s*<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*>\s*<\/script>/gi, '');
  return html;
}

function stripStructuredData(html) {
  return html.replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
}

function relatedSection(route) {
  const [, , trade, city] = route.split('/');
  const sameTrade = INDEXABLE_SERVICE_CITY_ROUTES.filter((item) => item !== route && item.split('/')[2] === trade).slice(0, 2);
  const sameCity = INDEXABLE_SERVICE_CITY_ROUTES.filter((item) => item !== route && item.split('/')[3] === city).slice(0, 3);
  const guide = GUIDE_BY_TRADE[trade] || '/blog';

  const links = [];
  links.push(`<a href="${guide}">Guide pratique ${esc(label(trade))}</a>`);
  for (const item of sameTrade) {
    const parts = item.split('/');
    links.push(`<a href="${item}">${esc(label(parts[2]))} à ${esc(label(parts[3]))}</a>`);
  }
  for (const item of sameCity) {
    const parts = item.split('/');
    links.push(`<a href="${item}">${esc(label(parts[2]))} à ${esc(label(parts[3]))}</a>`);
  }

  const unique = [...new Set(links)].slice(0, 5);
  return `<section><h2>Guides et recherches utiles</h2><p>${unique.join(' · ')}</p><p><a href="/blog">Voir les guides pratiques de Snay3i.ma</a></p></section>`;
}

function rewriteCuratedLinks(html, route) {
  const replacement = relatedSection(route);
  const sectionPair = /<section><h2>Guides et recherches utiles<\/h2>[\s\S]*?<\/section>\s*(?:<section[^>]*data-seo-internal-links=["']1["'][^>]*>[\s\S]*?<\/section>)?/i;
  if (sectionPair.test(html)) html = html.replace(sectionPair, replacement);
  else html = html.replace('</main>', `${replacement}</main>`);

  return html.replace(/<a\s+([^>]*?)href=["'](\/artisan\/[^"'?#]+)["']([^>]*)>([\s\S]*?)<\/a>/gi, (match, before, href, after, text) => {
    if (curated.has(href)) return match;
    return text;
  });
}

function retirePage(html, route) {
  const [, , trade, city] = route.split('/');
  const title = `Recherche ${label(trade)} à ${label(city)} — Snay3i.ma`;
  const description = `Cette page locale n’est pas incluse dans la sélection de pages maintenues de Snay3i.ma. Utilisez la recherche principale ou les guides pratiques.`;

  html = setRobots(html, 'noindex,follow');
  html = stripAdsense(html);
  html = stripStructuredData(html);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${esc(description)}">`);

  const main = `<main><section><p class="meta">Snay3i.ma • Page locale non maintenue</p><h1>${esc(label(trade))} à ${esc(label(city))}</h1><p>Cette combinaison métier et ville n’est pas actuellement incluse dans notre sélection de pages locales maintenues. Nous préférons ne pas présenter une page générique comme si elle contenait des informations locales vérifiées.</p><p>Utilisez la recherche principale de Snay3i.ma pour consulter les profils disponibles au moment de votre visite, ou consultez nos guides pour préparer votre demande et comparer une prestation.</p><p><a href="/">Rechercher sur Snay3i.ma</a> · <a href="/blog">Voir les guides pratiques</a></p></section></main>`;
  html = html.replace(/<main>[\s\S]*?<\/main>/i, main);
  return html;
}

function collectPages() {
  const pages = [];
  if (!fs.existsSync(artisanRoot)) return pages;
  for (const tradeEntry of fs.readdirSync(artisanRoot, { withFileTypes: true })) {
    if (!tradeEntry.isDirectory()) continue;
    const tradeDir = path.join(artisanRoot, tradeEntry.name);
    for (const cityEntry of fs.readdirSync(tradeDir, { withFileTypes: true })) {
      if (!cityEntry.isDirectory()) continue;
      const file = path.join(tradeDir, cityEntry.name, 'index.html');
      if (!fs.existsSync(file)) continue;
      pages.push({
        route: `/artisan/${tradeEntry.name}/${cityEntry.name}`,
        file,
      });
    }
  }
  return pages;
}

const pages = collectPages();
const found = new Set(pages.map((page) => page.route));
const missing = INDEXABLE_SERVICE_CITY_ROUTES.filter((route) => !found.has(route));
if (missing.length) throw new Error(`[service-city curation] missing curated route(s): ${missing.join(', ')}`);

let retiredCount = 0;
let curatedCount = 0;
for (const page of pages) {
  let html = fs.readFileSync(page.file, 'utf8');
  if (curated.has(page.route)) {
    html = setRobots(html, 'index,follow');
    html = rewriteCuratedLinks(html, page.route);
    curatedCount += 1;
  } else {
    html = retirePage(html, page.route);
    retiredCount += 1;
  }
  fs.writeFileSync(page.file, html, 'utf8');
}

const failures = [];
for (const page of pages) {
  const html = fs.readFileSync(page.file, 'utf8');
  if (curated.has(page.route)) {
    if (!/<meta\s+name=["']robots["']\s+content=["']index,follow["']/i.test(html)) failures.push(`${page.route}: curated page is not index,follow`);
    const serviceLinks = [...html.matchAll(/href=["'](\/artisan\/[^"'?#]+)["']/gi)].map((match) => match[1]);
    const leaked = serviceLinks.filter((href) => !curated.has(href));
    if (leaked.length) failures.push(`${page.route}: links to uncurated service route(s): ${[...new Set(leaked)].join(', ')}`);
  } else {
    if (!/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(html)) failures.push(`${page.route}: retired page is not noindex,follow`);
    if (/adsbygoogle\.js|google-adsense-account/i.test(html)) failures.push(`${page.route}: AdSense remains on retired page`);
  }
}

if (failures.length) throw new Error(`[service-city curation] BLOCKED:\n${failures.join('\n')}`);
console.log(`[service-city curation] PASS: ${pages.length} service-city pages found; ${curatedCount} curated indexable; ${retiredCount} retired noindex/ad-free; no curated page links to an uncurated service route`);
