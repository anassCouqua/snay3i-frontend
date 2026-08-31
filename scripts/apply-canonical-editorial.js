const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceFile = path.join(root, 'src', 'Blog.js');
const contentFile = path.join(root, 'content', 'canonical-guide-content.json');
const metaFile = path.join(root, 'content', 'canonical-guide-meta.json');
const expansionContentFile = path.join(root, 'content', 'canonical-guide-content-expansion.json');
const expansionMetaFile = path.join(root, 'content', 'canonical-guide-meta-expansion.json');
const additionsFile = path.join(root, 'content', 'canonical-guide-additions.json');

for (const file of [sourceFile, contentFile, metaFile, expansionContentFile, expansionMetaFile, additionsFile]) {
  if (!fs.existsSync(file)) throw new Error(`[editorial] missing ${path.relative(root, file)}`);
}

let source = fs.readFileSync(sourceFile, 'utf8');
const baseEditorial = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
const expansionEditorial = JSON.parse(fs.readFileSync(expansionContentFile, 'utf8'));
const editorial = { ...baseEditorial, ...expansionEditorial };
const baseMeta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
const expansionMeta = JSON.parse(fs.readFileSync(expansionMetaFile, 'utf8'));
const meta = { ...baseMeta, ...expansionMeta };
const additions = JSON.parse(fs.readFileSync(additionsFile, 'utf8'));

function findArticleStart(sourceText, slug) {
  const marker = `slug: '${slug}'`;
  const index = sourceText.indexOf(marker);
  if (index === -1) throw new Error(`[editorial] article not found in Blog.js: ${slug}`);
  return index;
}

function jsSingle(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function insertArticleIfMissing(sourceText, slug, content, values) {
  if (sourceText.includes(`slug: '${slug}'`)) return sourceText;
  const arrayStart = sourceText.indexOf('const ARTICLES = [');
  if (arrayStart === -1) throw new Error('[editorial] ARTICLES array missing');
  const arrayEnd = sourceText.indexOf('\n];', arrayStart);
  if (arrayEnd === -1) throw new Error('[editorial] ARTICLES array terminator missing');
  const safeContent = String(content).replace(/`/g, '\\`');
  const article = `\n  {\n    slug: '${jsSingle(slug)}',\n    title: '${jsSingle(values.title)}',\n    titleAr: '',\n    description: '${jsSingle(values.description)}',\n    category: '${jsSingle(values.category || 'Guide pratique')}',\n    emoji: '${jsSingle(values.emoji || '🏠')}',\n    date: '31 Août 2026',\n    readTime: '8 min',\n    content: \`\n${safeContent}\n    \`\n  },\n`;
  return sourceText.slice(0, arrayEnd) + article + sourceText.slice(arrayEnd);
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

function appendContentOnce(sourceText, slug, addition) {
  if (!addition) return sourceText;
  const start = findArticleStart(sourceText, slug);
  const contentMarker = sourceText.indexOf('content: `', start);
  if (contentMarker === -1) throw new Error(`[editorial] content marker missing for addition: ${slug}`);
  const contentStart = contentMarker + 'content: `'.length;
  const contentEnd = sourceText.indexOf('`\n  }', contentStart);
  if (contentEnd === -1) throw new Error(`[editorial] content terminator missing for addition: ${slug}`);
  const current = sourceText.slice(contentStart, contentEnd);
  const plainAddition = String(addition).replace(/\\`/g, '`');
  if (current.includes(plainAddition.trim())) return sourceText;
  const safeAddition = plainAddition.replace(/`/g, '\\`');
  const separator = current.endsWith('\n') ? '\n' : '\n\n';
  return sourceText.slice(0, contentStart) + current + separator + safeAddition + sourceText.slice(contentEnd);
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

for (const [slug, content] of Object.entries(expansionEditorial)) {
  const values = expansionMeta[slug];
  if (!values) throw new Error(`[editorial] expansion metadata missing: ${slug}`);
  source = insertArticleIfMissing(source, slug, content, values);
}
for (const [slug, content] of Object.entries(editorial)) source = replaceContent(source, slug, content);
for (const [slug, addition] of Object.entries(additions)) source = appendContentOnce(source, slug, addition);
for (const [slug, values] of Object.entries(meta)) {
  if (values.title) source = replaceSingleQuotedField(source, slug, 'title', values.title);
  if (values.description) source = replaceSingleQuotedField(source, slug, 'description', values.description);
}

fs.writeFileSync(sourceFile, source, 'utf8');
console.log(`[editorial] applied ${Object.keys(editorial).length} canonical guides (${Object.keys(expansionEditorial).length} category expansion), ${Object.keys(additions).length} depth additions and metadata to Blog.js`);
