const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceFile = path.join(root, 'src', 'Blog.js');
const contentFile = path.join(root, 'content', 'canonical-guide-content.json');

if (!fs.existsSync(sourceFile)) throw new Error('[editorial] Blog.js missing');
if (!fs.existsSync(contentFile)) throw new Error('[editorial] canonical-guide-content.json missing');

const source = fs.readFileSync(sourceFile, 'utf8');
const editorial = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
let updated = source;

for (const [slug, content] of Object.entries(editorial)) {
  const marker = `slug: '${slug}'`;
  const start = updated.indexOf(marker);
  if (start === -1) throw new Error(`[editorial] article not found in Blog.js: ${slug}`);

  const contentMarker = updated.indexOf('content: `', start);
  if (contentMarker === -1) throw new Error(`[editorial] content marker missing: ${slug}`);

  const contentStart = contentMarker + 'content: `'.length;
  const contentEnd = updated.indexOf('`\n  }', contentStart);
  if (contentEnd === -1) throw new Error(`[editorial] content terminator missing: ${slug}`);

  const replacement = content.replace(/\\`/g, '`').replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  updated = updated.slice(0, contentStart) + replacement + updated.slice(contentEnd);
}

fs.writeFileSync(sourceFile, updated, 'utf8');
console.log(`[editorial] applied ${Object.keys(editorial).length} canonical guide(s) to Blog.js`);
