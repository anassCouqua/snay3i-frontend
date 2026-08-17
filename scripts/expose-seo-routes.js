const fs = require('fs');
const path = require('path');

const sourceRoot = path.join(process.cwd(), 'public', 'seo');
const targetRoot = path.join(process.cwd(), 'public');

if (!fs.existsSync(sourceRoot)) {
  throw new Error('SEO source directory is missing');
}

const copyRecursive = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
};

for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
  const from = path.join(sourceRoot, entry.name);
  const to = path.join(targetRoot, entry.name);
  if (entry.isDirectory()) copyRecursive(from, to);
  else fs.copyFileSync(from, to);
}

console.log('SEO pages exposed at their canonical public route paths');
