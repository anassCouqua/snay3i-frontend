const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo', 'artisan');
const BASE = 'https://snay3i.ma';

const services = {
  plombier: 'plombier',
  electricien: 'électricien',
  macon: 'maçon',
  bricoleur: 'bricoleur',
  peintre: 'peintre',
  menuisier: 'menuisier',
  carreleur: 'carreleur',
  climatisation: 'professionnel de la climatisation',
  serrurier: 'serrurier',
  menage: 'professionnel du ménage',
  jardinier: 'jardinier',
  soudeur: 'soudeur'
};

const cities = {
  casablanca: 'Casablanca',
  rabat: 'Rabat',
  marrakech: 'Marrakech',
  tanger: 'Tanger',
  fes: 'Fès',
  agadir: 'Agadir'
};

const priorityRoutes = new Set([
  '/artisan/plombier/kenitra',
  '/artisan/plombier/oujda',
  '/artisan/serrurier/kenitra',
  '/artisan/soudeur/mohammedia',
  '/artisan/climatisation/berkane',
  '/artisan/climatisation/safi',
  '/artisan/jardinier/berkane'
]);

const escapeAttr = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

let changed = 0;

for (const [serviceSlug, serviceLabel] of Object.entries(services)) {
  for (const [citySlug, city] of Object.entries(cities)) {
    const route = `/artisan/${serviceSlug}/${citySlug}`;
    if (priorityRoutes.has(route)) continue;

    const file = path.join(root, serviceSlug, citySlug, 'index.html');
    if (!fs.existsSync(file)) continue;

    const original = fs.readFileSync(file, 'utf8');
    const title = `${serviceLabel[0].toUpperCase()}${serviceLabel.slice(1)} à ${city} — Rechercher un professionnel | Snay3i.ma`;
    const description = `Guide pratique pour rechercher un ${serviceLabel} à ${city}, préparer votre demande et comparer les informations avant de réserver une prestation.`;

    let html = original;
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(title)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${escapeAttr(description)}">`);
    html = html.replace(/<h1>[^<]*<\/h1>/i, `<h1>${escapeAttr(serviceLabel[0].toUpperCase() + serviceLabel.slice(1))} à ${escapeAttr(city)}</h1>`);

    if (html !== original) {
      fs.writeFileSync(file, html, 'utf8');
      changed += 1;
    }
  }
}

console.log(`CTR snippet optimization applied to ${changed} generic service/city pages; priority pages preserved.`);
