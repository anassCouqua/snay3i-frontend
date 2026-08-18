const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'public', 'seo', 'artisan', 'serrurier', 'kenitra', 'index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');

html = html
  .replace(/<title>[^<]*<\/title>/, '<title>Serrurier à Kénitra — Dépannage rapide et serrure | Snay3i.ma</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Besoin d’un serrurier à Kénitra ? Préparez un dépannage de porte ou serrure, vérifiez le déplacement, les pièces et le prix avant l’intervention.">')
  .replace(/<h1>[^<]*<\/h1>/, '<h1>Serrurier à Kénitra</h1>');

const growth = `<section data-snay3i-locksmith-growth="1"><h2>Serrurier à Kénitra en cas d’urgence</h2><p>En cas de porte bloquée, clé perdue ou serrure défaillante, décrivez la situation de façon précise sans partager de code, adresse complète ou autre information sensible. Avant l’intervention, confirmez le déplacement, le diagnostic, les pièces éventuelles et le montant total lorsque la situation le permet.</p><ul><li>Demander le coût du déplacement avant de confirmer</li><li>Faire préciser si la serrure sera réparée ou remplacée</li><li>Demander le prix du cylindre, de la serrure ou des autres pièces</li><li>Vérifier le délai d’intervention annoncé</li><li>Tester la porte et la serrure avant la fin du rendez-vous</li></ul></section>`;

if (!html.includes('data-snay3i-locksmith-growth="1"')) {
  html = html.replace(/<section data-seo-internal-links="1">/, `${growth}<section data-seo-internal-links="1">`);
}

fs.writeFileSync(file, html, 'utf8');
