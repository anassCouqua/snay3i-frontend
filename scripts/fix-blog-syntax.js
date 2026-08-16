const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
const source = fs.readFileSync(file, 'utf8');

// Normalize single-quoted metadata properties to JSON-safe double-quoted strings.
// This prevents unescaped French apostrophes (e.g. d'intervention) from breaking Babel.
const lines = source.split('\n');
const propertyPattern = /^(\s*)(title|titleAr|description|category|emoji|date|readTime): '(.*)'(,?)\s*$/;

let changed = false;
const normalized = lines.map((line) => {
  const match = line.match(propertyPattern);
  if (!match || !match[3].includes("'")) return line;

  const [, indent, key, value, comma] = match;
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  changed = true;
  return `${indent}${key}: "${escaped}"${comma}`;
});

if (changed) {
  fs.writeFileSync(file, normalized.join('\n'), 'utf8');
  console.log('Normalized apostrophe-containing Blog.js metadata strings');
} else {
  console.log('Blog.js metadata normalization not needed');
}
