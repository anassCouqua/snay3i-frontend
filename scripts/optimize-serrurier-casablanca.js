const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'public', 'seo', 'artisan', 'serrurier', 'casablanca', 'index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');

html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Serrurier à Casablanca — Urgence, dépannage et serrure | Snay3i.ma</title>'
);
html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Besoin d’un serrurier à Casablanca ? Préparez un dépannage de porte ou serrure, vérifiez le déplacement, les pièces et le prix avant l’intervention.">'
);

const marker = '<section data-snay3i-locksmith-growth="1">';
if (!html.includes(marker)) {
  const section = `${marker}<h2>Serrurier en urgence à Casablanca</h2><p>Pour une porte bloquée, une clé perdue ou une serrure qui ne fonctionne plus, indiquez la situation exacte sans partager de codes ou d’informations sensibles. En cas d’urgence, demandez le coût du déplacement et de l’intervention avant de confirmer lorsque la situation le permet.</p><ul><li>Préciser le quartier et les conditions d’accès</li><li>Demander si le déplacement est facturé</li><li>Faire confirmer le prix des pièces avant remplacement</li><li>Vérifier si la serrure sera réparée ou remplacée</li><li>Tester la porte et la serrure avant la fin de l’intervention</li></ul><h3>Recherche locale</h3><p>Pour comparer des professionnels à Casablanca, consultez les informations disponibles sur les profils et vérifiez directement les tarifs, disponibilités, délais et conditions avant toute prestation.</p></section>`;
  html = html.replace('</main>', `${section}</main>`);
}

fs.writeFileSync(file, html, 'utf8');
