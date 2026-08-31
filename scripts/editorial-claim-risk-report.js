const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public', 'blog');

// High-signal evidence checks. Ordinary practical advice and explicit disclaimers
// must not be treated as unsupported claims simply because they contain words such
// as "garantie" or "toujours".
const quantifiedClaim = /\b\d+(?:[.,]\d+)?\s*(?:%|MAD|DH|dirhams?|ans?|jours?|heures?|mois|m²|kw|btu)\b/i;
const regulatedClaim = /\b(?:obligatoire|obligatoires|interdit|interdite|interdits|interdites|certifié|certifiée|certifiés|certifiées|norme|normes|légal|légale|illégal|illégale)\b/i;
const guaranteeClaim = /\b(?:garanti|garantit|garantissent)\b/i;
const absoluteClaim = /\b(?:toujours|aucun\s+risque|zéro\s+risque)\b/i;

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

function isExplicitDisclaimer(sentence) {
  return /(?:\bne\b|\bn['’])[^.!?]{0,120}\bgarant(?:i|it|issent)\b[^.!?]{0,80}\bpas\b/i.test(sentence)
    || /\bsans\s+faire\s+croire\b[^.!?]{0,120}\bgaranti\b/i.test(sentence)
    || /\bne\s+devrait\s+pas\s+être\s+présent(?:é|ée|és|ées)\b[^.!?]{0,120}\bgaranti\b/i.test(sentence)
    || /\bpas\s+toujours\b/i.test(sentence)
    || /\bn['’]est\s+pas\s+toujours\b/i.test(sentence);
}

function hasEvidenceRisk(sentence) {
  if (quantifiedClaim.test(sentence)) return true;
  if (regulatedClaim.test(sentence)) return true;
  if (/\b(?:aucun\s+risque|zéro\s+risque)\b/i.test(sentence)) return true;
  if (guaranteeClaim.test(sentence) && !isExplicitDisclaimer(sentence)) return true;
  if (absoluteClaim.test(sentence) && !isExplicitDisclaimer(sentence)) return true;
  return false;
}

console.log('=== SNAY3I EVIDENCE-SENSITIVE CLAIM GATE ===');
const failures = [];
for (const slug of INDEXABLE_BLOG_SLUGS) {
  const file = path.join(publicRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[claim risk] missing canonical article ${slug}`);
  const html = fs.readFileSync(file, 'utf8');
  const flagged = sentences(articleText(html)).filter(hasEvidenceRisk);
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
console.log(`[claim risk] PASS: ${INDEXABLE_BLOG_SLUGS.length} canonical guides contain no unsourced quantified, legal, certification or positive absolute-guarantee claims`);
