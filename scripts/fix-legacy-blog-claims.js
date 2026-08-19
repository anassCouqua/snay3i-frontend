const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  path.join(root, 'src', 'Blog.js'),
  path.join(root, 'src', 'Pages.js')
];

const generatedRoot = path.join(root, 'public', 'seo');

const replacements = [
  ['21 villes du Maroc', 'plusieurs villes du Maroc'],
  ['dans 21 villes', 'dans plusieurs villes'],
  ['plus de 100 artisans', 'les professionnels disponibles'],
  ['100+ artisans', 'des professionnels référencés'],
  ['100 artisans', 'des professionnels référencés'],
  ['artisans vérifiés', 'professionnels référencés'],
  ['artisan vérifié', 'professionnel référencé'],
  ['des artisans vérifiés', 'des professionnels référencés'],
  ['des électriciens vérifiés', 'des électriciens référencés'],
  ['des plombiers vérifiés', 'des plombiers référencés']
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function clean(file) {
  if (!fs.existsSync(file)) return false;
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8');
    return true;
  }
  return false;
}

const targets = [
  ...files,
  ...walk(generatedRoot).filter((file) => /\.(html|js|jsx)$/.test(file))
];

let changed = 0;
for (const file of targets) if (clean(file)) changed += 1;

console.log(`[Legacy claim cleanup] updated ${changed} file(s)`);
