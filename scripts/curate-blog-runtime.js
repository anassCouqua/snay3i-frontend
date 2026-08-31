const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'Blog.js');
if (!fs.existsSync(file)) throw new Error('[blog runtime] Blog.js missing');

let source = fs.readFileSync(file, 'utf8');
if (!source.includes('const ARTICLES = [')) throw new Error('[blog runtime] ARTICLES array missing');

const anchor = '\n];\n\nfunction normalizeArticleContent';
if (!source.includes(anchor)) throw new Error('[blog runtime] ARTICLES terminator not found');

const canonicalBlock = `\n\nconst INDEXABLE_ARTICLE_SLUGS = new Set([\n  'trouver-bon-plombier-maroc',\n  'tarif-electricien-maroc-2026',\n  'renovation-maison-maroc-guide',\n  'climatisation-maroc-installation',\n  'serrurier-urgence-maroc',\n  'choisir-carreleur-maroc',\n  'macon-construction-maroc',\n  'urgence-plomberie-casablanca',\n]);\nconst INDEXABLE_ARTICLES = ARTICLES.filter((a) => INDEXABLE_ARTICLE_SLUGS.has(a.slug));`;

if (!source.includes('const INDEXABLE_ARTICLES = ARTICLES.filter')) {
  source = source.replace(anchor, `\n];${canonicalBlock}\n\nfunction normalizeArticleContent`);
}

source = source.replace(/const article = ARTICLES\.find\(a => a\.slug === slug\);/g, 'const article = INDEXABLE_ARTICLES.find(a => a.slug === slug);');
source = source.replace(/const relatedArticles = ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const relatedArticles = INDEXABLE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/const otherArticles = ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const otherArticles = INDEXABLE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/\{ARTICLES\.map\(article => \(/g, '{INDEXABLE_ARTICLES.map(article => (');

fs.writeFileSync(file, source, 'utf8');
console.log('[blog runtime] public blog and related links now use the canonical eight-guide set');
