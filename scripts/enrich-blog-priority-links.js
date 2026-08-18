const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo', 'blog');
if (!fs.existsSync(root)) {
  console.log('Blog enrichment skipped: generated blog directory not found');
  process.exit(0);
}

const clusters = [
  {
    test: /plombier|plomberie/i,
    links: [
      ['/artisan/plombier/kenitra', 'Plombier à Kénitra'],
      ['/artisan/plombier/oujda', 'Plombier à Oujda'],
    ],
  },
  {
    test: /serrurier|serrurerie/i,
    links: [['/artisan/serrurier/kenitra', 'Serrurier à Kénitra']],
  },
  {
    test: /soudeur|soudure|métallique/i,
    links: [['/artisan/soudeur/mohammedia', 'Soudeur à Mohammedia']],
  },
  {
    test: /climatisation|climatiseur|climatis/i,
    links: [
      ['/artisan/climatisation/berkane', 'Climatisation à Berkane'],
      ['/artisan/climatisation/safi', 'Climatisation à Safi'],
    ],
  },
  {
    test: /jardinier|jardinage|paysagiste/i,
    links: [['/artisan/jardinier/berkane', 'Jardinier à Berkane']],
  },
];

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name === 'index.html') files.push(full);
  }
}
walk(root);

let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-snay3i-blog-priority-links="1"')) continue;

  const headMatch = html.match(/<main[\s\S]*?<article[\s\S]*?<\/article>/i);
  if (!headMatch) continue;

  const visibleText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const links = [];
  for (const cluster of clusters) {
    if (cluster.test.test(visibleText)) {
      for (const [url, label] of cluster.links) {
        if (!html.includes(`href="${url}"`)) links.push([url, label]);
      }
    }
  }
  if (!links.length) continue;

  const section = `<section data-snay3i-blog-priority-links="1"><h2>Professionnels à découvrir</h2><p>${links.map(([url,label]) => `<a href="${url}">${label}</a>`).join(' · ')}</p><p>Consultez les informations disponibles sur chaque profil et vérifiez directement les tarifs, disponibilités et conditions avant toute prestation.</p></section>`;
  html = html.replace('</main>', `${section}</main>`);
  fs.writeFileSync(file, html, 'utf8');
  changed += 1;
}

console.log(`Blog priority-link enrichment applied to ${changed} page(s)`);
