const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
const source = fs.readFileSync(file, 'utf8');
const malformed = "title: 'Serrurier autour de moi au Maroc — Porte bloquée: guide d'urgence',";
const corrected = `title: "Serrurier autour de moi au Maroc — Porte bloquée: guide d'urgence",`;

if (source.includes(malformed)) {
  fs.writeFileSync(file, source.replace(malformed, corrected), 'utf8');
  console.log('Fixed malformed serrurier article title in Blog.js');
} else {
  console.log('Blog.js syntax repair not needed');
}
