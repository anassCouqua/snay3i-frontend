const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'build');
if (!fs.existsSync(root)) throw new Error('Build directory is missing');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const legacyClaims = [
  'artisans vérifiés',
  'artisan vérifié',
  '21 villes du Maroc',
  '35 villes du Maroc',
  '100+ artisans',
  '+200 professionnels',
  'Tous nos artisans sont vérifiés',
  'en moins de 30 secondes'
];

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
const violations = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8').toLowerCase();
  for (const claim of legacyClaims) {
    if (html.includes(claim.toLowerCase())) violations.push(`${path.relative(root, file)} contains: ${claim}`);
  }
}

if (violations.length) {
  console.error('Publisher-output verification failed:');
  violations.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

const home = path.join(root, 'index.html');
if (!fs.existsSync(home)) throw new Error('build/index.html is missing');

console.log(`Publisher-output verification passed for ${htmlFiles.length} HTML files.`);
