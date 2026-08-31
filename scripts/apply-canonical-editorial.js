const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceFile = path.join(root, 'src', 'Blog.js');
const contentFile = path.join(root, 'content', 'canonical-guide-content.json');
const metaFile = path.join(root, 'content', 'canonical-guide-meta.json');

if (!fs.existsSync(sourceFile)) throw new Error('[editorial] Blog.js missing');
if (!fs.existsSync(contentFile)) throw new Error('[editorial] canonical-guide-content.json missing');
if (!fs.existsSync(metaFile)) throw new Error('[editorial] canonical-guide-meta.json missing');

let source = fs.readFileSync(sourceFile, 'utf8');
const editorial = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

function findArticleStart(sourceText, slug) {
  const marker = `slug: '${slug}'`;
  const index = sourceText.indexOf(marker);
  if (index === -1) throw new Error(`[editorial] article not found in Blog.js: ${slug}`);
  return index;
}

function replaceContent(sourceText, slug, content) {
  const start = findArticleStart(sourceText, slug);
  const contentMarker = sourceText.indexOf('content: `', start);
  if (contentMarker === -1) throw new Error(`[editorial] content marker missing: ${slug}`);
  const contentStart = contentMarker + 'content: `'.length;
  const contentEnd = sourceText.indexOf('`\n  }', contentStart);
  if (contentEnd === -1) throw new Error(`[editorial] content terminator missing: ${slug}`);
  const safeContent = String(content).replace(/`/g, '\\`');
  return sourceText.slice(0, contentStart) + safeContent + sourceText.slice(contentEnd);
}

function replaceSingleQuotedField(sourceText, slug, fieldName, value) {
  const start = findArticleStart(sourceText, slug);
  const fieldStart = sourceText.indexOf(`${fieldName}:`, start);
  if (fieldStart === -1) throw new Error(`[editorial] ${fieldName} field missing: ${slug}`);
  const limit = sourceText.indexOf('\n  },', fieldStart);
  const scopeEnd = limit === -1 ? sourceText.length : limit;
  const scoped = sourceText.slice(fieldStart, scopeEnd);
  const fieldMatch = scoped.match(new RegExp(`${fieldName}:\\s*'((?:\\\\.|[^'])*)'`));
  if (!fieldMatch) throw new Error(`[editorial] could not parse ${fieldName}: ${slug}`);
  const quoteOffset = fieldMatch[0].indexOf("'");
  const absoluteStart = fieldStart + fieldMatch.index + quoteOffset + 1;
  const absoluteEnd = absoluteStart + fieldMatch[1].length;
  const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return sourceText.slice(0, absoluteStart) + escaped + sourceText.slice(absoluteEnd);
}

for (const [slug, content] of Object.entries(editorial)) source = replaceContent(source, slug, content);
for (const [slug, values] of Object.entries(meta)) {
  if (values.title) source = replaceSingleQuotedField(source, slug, 'title', values.title);
  if (values.description) source = replaceSingleQuotedField(source, slug, 'description', values.description);
}

fs.writeFileSync(sourceFile, source, 'utf8');
console.log(`[editorial] applied ${Object.keys(editorial).length} canonical guides plus metadata to Blog.js`);
