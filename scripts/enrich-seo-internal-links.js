const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo', 'artisan');

const blogByService = {
  plombier: ['/blog/trouver-bon-plombier-maroc', '/blog/urgence-plomberie-casablanca'],
  electricien: ['/blog/tarif-electricien-maroc-2026', '/blog/electricien-autour-de-moi-maroc'],
  macon: ['/blog/macon-construction-maroc', '/blog/macon-casablanca-pas-cher'],
  bricoleur: ['/blog/entretien-maison-maroc-checklist'],
  peintre: ['/blog/peintre-casablanca-prix'],
  menuisier: ['/blog/menuisier-cuisine-maroc'],
  carreleur: ['/blog/choisir-carreleur-maroc'],
  climatisation: ['/blog/climatisation-maroc-installation'],
  serrurier: ['/blog/serrurier-autour-de-moi-maroc'],
  menage: ['/blog/entretien-maison-maroc-checklist'],
  jardinier: ['/blog/jardinier-paysagiste-maroc'],
  soudeur: []
};

const serviceLabels = {
  plombier: 'Plombier',
  electricien: 'Électricien',
  macon: 'Maçon',
  bricoleur: 'Bricoleur',
  peintre: 'Peintre',
  menuisier: 'Menuisier',
  carreleur: 'Carreleur',
  climatisation: 'Climatisation',
  serrurier: 'Serrurier',
  menage: 'Ménage',
  jardinier: 'Jardinier',
  soudeur: 'Soudeur'
};

const cityLabels = {
  casablanca: 'Casablanca',
  rabat: 'Rabat',
  marrakech: 'Marrakech',
  tanger: 'Tanger',
  fes: 'Fès',
  agadir: 'Agadir',
  kenitra: 'Kénitra',
  oujda: 'Oujda',
  mohammmedia: 'Mohammedia',
  mohammedia: 'Mohammedia',
  berkane: 'Berkane',
  safi: 'Safi'
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function enrich(file) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const match = relative.match(/^([^/]+)\/([^/]+)\/index\.html$/);
  if (!match) return false;

  const [, service, city] = match;
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-seo-internal-links="1"')) return false;

  const cityLabel = cityLabels[city] || city;
  const serviceLabel = serviceLabels[service] || service;
  const links = [];

  const sameCityServices = Object.entries(serviceLabels)
    .filter(([slug]) => slug !== service)
    .slice(0, 2)
    .map(([slug, label]) => ({ url: `/artisan/${slug}/${city}`, label: `${label} à ${cityLabel}` }));

  links.push(...sameCityServices);

  for (const url of (blogByService[service] || []).slice(0, 2)) {
    const label = url.split('/').pop().replace(/-/g, ' ');
    links.push({ url, label: `Guide ${label}` });
  }

  const unique = [];
  const seen = new Set();
  for (const link of links) {
    if (!seen.has(link.url) && !html.includes(`href=\"${link.url}\"`)) {
      seen.add(link.url);
      unique.push(link);
    }
  }

  if (!unique.length) return false;

  const section = `<section data-seo-internal-links="1"><h2>À voir aussi</h2><p>${unique.map((link) => `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`).join(' · ')}</p><p>Explorez d’autres professionnels à ${escapeHtml(cityLabel)} ou consultez nos guides pour préparer votre demande.</p></section>`;

  const marker = '</main>';
  const index = html.lastIndexOf(marker);
  if (index === -1) return false;

  const updated = `${html.slice(0, index)}${section}${html.slice(index)}`;
  fs.writeFileSync(file, updated, 'utf8');
  return true;
}

const files = walk(root).filter((file) => path.basename(file) === 'index.html');
let changed = 0;
for (const file of files) {
  if (enrich(file)) changed += 1;
}

console.log(`SEO internal-link enrichment applied to ${changed} artisan pages.`);
