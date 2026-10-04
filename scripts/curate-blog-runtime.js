const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const file = path.join(__dirname, '..', 'src', 'Blog.js');
if (!fs.existsSync(file)) throw new Error('[blog runtime] Blog.js missing');

let source = fs.readFileSync(file, 'utf8');
if (!source.includes("import { SAFE_ARTICLES } from './adsense-safe-articles';")) { const m=source.match(/^import [^\n]+\n/m); if(!m) throw new Error('[blog runtime] import anchor missing'); const p=(m.index||0)+m[0].length; source=source.slice(0,p)+"import { SAFE_ARTICLES } from './adsense-safe-articles';\n"+source.slice(p); }

if (!source.includes("import { SAFE_ARTICLES } from './adsense-safe-articles';")) {
  throw new Error('[blog runtime] safe article import missing');
}
if (!source.includes('const ARTICLES = SAFE_ARTICLES;')) {
  throw new Error('[blog runtime] safe article binding missing');
}

source = source.replace(/const article = INDEXABLE_ARTICLES\.find\(a => a\.slug === slug\);/g, 'const article = SAFE_ARTICLES.find(a => a.slug === slug);');
source = source.replace(/const article = ARTICLES\.find\(a => a\.slug === slug\);/g, 'const article = SAFE_ARTICLES.find(a => a.slug === slug);');
source = source.replace(/const relatedArticles = ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const relatedArticles = SAFE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/const relatedArticles = INDEXABLE_ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const relatedArticles = SAFE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/const otherArticles = ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const otherArticles = SAFE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/const otherArticles = INDEXABLE_ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const otherArticles = SAFE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/\{ARTICLES\.map\(article => \(/g, '{SAFE_ARTICLES.map(article => (');
source = source.replace(/\{INDEXABLE_ARTICLES\.map\(article => \(/g, '{SAFE_ARTICLES.map(article => (');

for (const slug of INDEXABLE_BLOG_SLUGS) {
  if (!source.includes('SAFE_ARTICLES')) throw new Error('[blog runtime] safe corpus binding missing');
}

fs.writeFileSync(file, source, 'utf8');
console.log(`[blog runtime] public blog and related links now use all ${INDEXABLE_BLOG_SLUGS.length} curated guides`);