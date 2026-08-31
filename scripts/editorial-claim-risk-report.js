const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public', 'blog');

// Keep this gate high-signal. Ordinary advice such as "demandez une garantie",
// "conservez la facture" or "le support doit être propre" does not, by itself,
// assert a regulated fact or unsupported commercial promise. We block claims that
// genuinely need evidence, sourcing or legal verification before publication.
const evidenceRisk = /(?:\b\d+(?:[.,]\d+)?\s*(?:%|MAD|DH|dirhams?|ans?|jours?|heures?|mois|m²|kw|btu)\b|\b(?:obligatoire|obligatoires|interdit|interdite|interdits|interdites|certifié|certifiée|certifiés|certifiées|norme|normes|légal|légale|illégal|illégale)\b|\b(?:garanti|garantit|garantissent)\b|\b(?:toujours|jamais|aucun\s+risque|zéro\s+risque)\b)/i;

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

console.log('=== SNAY3I EVIDENCE-SENSITIVE CLAIM GATE ===');
const failures = [];
for (const slug of INDEXABLE_BLOG_SLUGS) {
  const file = path.join(publicRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[claim risk] missing canonical article ${slug}`);
  const html = fs.readFileSync(file, 'utf8');
  const flagged = sentences(articleText(html)).filter((sentence) => evidenceRisk.test(sentence));
  if (flagged.length) {
    console.log(`--- ${slug}: ${flagged.length} evidence-sensitive sentence(s) ---`);
    for (const sentence of flagged) {
      console.log(sentence);
      failures.push(`${slug}: ${sentence}`);
    }
  }
}

if (failures.length) {
  throw new Error(`[claim risk] BLOCKED: ${failures.length} evidence-sensitive claim(s) require sourcing, qualification or removal`);
}
console.log(`[claim risk] PASS: ${INDEXABLE_BLOG_SLUGS.length} canonical guides contain no unsourced quantified, legal, certification or absolute-guarantee claims`);
