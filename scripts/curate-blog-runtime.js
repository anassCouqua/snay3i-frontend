const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const file = path.join(__dirname, '..', 'src', 'Blog.js');
if (!fs.existsSync(file)) throw new Error('[blog runtime] Blog.js missing');

let source = fs.readFileSync(file, 'utf8');
if (!source.includes('const ARTICLES = [')) throw new Error('[blog runtime] ARTICLES array missing');

const anchor = '\n];\n\nfunction normalizeArticleContent';
if (!source.includes(anchor) && !source.includes('const INDEXABLE_ARTICLE_SLUGS = new Set([')) {
  throw new Error('[blog runtime] ARTICLES terminator not found');
}

const slugLines = INDEXABLE_BLOG_SLUGS.map((slug) => `  '${slug}',`).join('\n');
const canonicalBlock = `\n\nconst INDEXABLE_ARTICLE_SLUGS = new Set([\n${slugLines}\n]);\nconst INDEXABLE_ARTICLES = ARTICLES.filter((a) => INDEXABLE_ARTICLE_SLUGS.has(a.slug));`;

if (/const INDEXABLE_ARTICLE_SLUGS = new Set\(\[[\s\S]*?const INDEXABLE_ARTICLES = ARTICLES\.filter\(\(a\) => INDEXABLE_ARTICLE_SLUGS\.has\(a\.slug\)\);/.test(source)) {
  source = source.replace(/\n\nconst INDEXABLE_ARTICLE_SLUGS = new Set\(\[[\s\S]*?const INDEXABLE_ARTICLES = ARTICLES\.filter\(\(a\) => INDEXABLE_ARTICLE_SLUGS\.has\(a\.slug\)\);/, canonicalBlock);
} else {
  source = source.replace(anchor, `\n];${canonicalBlock}\n\nfunction normalizeArticleContent`);
}

source = source.replace(/const article = ARTICLES\.find\(a => a\.slug === slug\);/g, 'const article = INDEXABLE_ARTICLES.find(a => a.slug === slug);');
source = source.replace(/const relatedArticles = ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const relatedArticles = INDEXABLE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/const otherArticles = ARTICLES\.filter\(a => a\.slug !== article\.slug/g, 'const otherArticles = INDEXABLE_ARTICLES.filter(a => a.slug !== article.slug');
source = source.replace(/\{ARTICLES\.map\(article => \(/g, '{INDEXABLE_ARTICLES.map(article => (');

for (const slug of INDEXABLE_BLOG_SLUGS) {
  if (!source.includes(`'${slug}'`)) throw new Error(`[blog runtime] curated slug missing after patch: ${slug}`);
}

fs.writeFileSync(file, source, 'utf8');
console.log(`[blog runtime] public blog and related links now use all ${INDEXABLE_BLOG_SLUGS.length} curated guides`);