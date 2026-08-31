const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public', 'blog');
const risk = /(?:\b\d+(?:[.,]\d+)?\s*(?:%|MAD|DH|dirhams?|ans?|jours?|heures?|mois|m²|kw|btu)\b|\b(?:obligatoire|obligatoires|interdit|interdite|garanti|garantie|garantit|toujours|jamais|doit|doivent|minimum|maximum|certifié|certifiée|norme|normes|légal|légale|illégal|illégale|assurance|assuré|assurée|sans risque|aucun risque)\b)/i;

function decode(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&[a-z0-9#]+;/gi, ' ');
}

function articleText(html) {
  const article = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || [null, ''])[1];
  return decode(article
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function sentences(text) {
  return text.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÝÉÈÊÎÔÙÇ])/).map((s) => s.trim()).filter(Boolean);
}

console.log('=== SNAY3I SENTENCE-LEVEL CLAIM RISK REPORT ===');
let total = 0;
for (const slug of INDEXABLE_BLOG_SLUGS) {
  const file = path.join(publicRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[claim risk] missing canonical article ${slug}`);
  const html = fs.readFileSync(file, 'utf8');
  const flagged = sentences(articleText(html)).filter((sentence) => risk.test(sentence));
  console.log(`--- ${slug}: ${flagged.length} flagged sentence(s) ---`);
  for (const sentence of flagged) console.log(sentence);
  total += flagged.length;
}
console.log(`[claim risk] ${total} sentence(s) require human/evidence review across ${INDEXABLE_BLOG_SLUGS.length} canonical guides`);
