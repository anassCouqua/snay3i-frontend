const fs = require('fs');
const path = require('path');
const { INDEXABLE_SERVICE_CITY_ROUTES } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public');

function htmlToText(html) {
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [null, html])[1];
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(text) {
  return text.toLowerCase().match(/[a-zà-ÿ0-9’'-]+/gi) || [];
}

function shingles(tokens, size = 5) {
  const out = new Set();
  for (let i = 0; i <= tokens.length - size; i += 1) out.add(tokens.slice(i, i + size).join(' '));
  return out;
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection || 1);
}

const rows = [];
for (const route of INDEXABLE_SERVICE_CITY_ROUTES) {
  const file = path.join(publicRoot, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[service quality] missing ${route}`);
  const html = fs.readFileSync(file, 'utf8');
  const text = htmlToText(html);
  const tokenList = words(text);
  rows.push({
    route,
    html,
    words: tokenList.length,
    h1: (html.match(/<h1\b/gi) || []).length,
    h2: (html.match(/<h2\b/gi) || []).length,
    paragraphs: (html.match(/<p\b/gi) || []).length,
    links: (html.match(/<a\s/gi) || []).length,
    shingleSet: shingles(tokenList),
  });
}

console.log('=== SNAY3I CURATED SERVICE-CITY MICROSCOPE ===');
console.log('Route | Words | H1 | H2 | P | Links');
for (const row of rows) console.log(`${row.route} | ${row.words} | ${row.h1} | ${row.h2} | ${row.paragraphs} | ${row.links}`);

const total = rows.reduce((sum, row) => sum + row.words, 0);
console.log(`Total curated service-city words: ${total}`);
console.log(`Average curated service-city length: ${Math.round(total / rows.length)} words`);

const pairs = [];
for (let i = 0; i < rows.length; i += 1) {
  for (let j = i + 1; j < rows.length; j += 1) {
    const score = jaccard(rows[i].shingleSet, rows[j].shingleSet);
    pairs.push({ a: rows[i].route, b: rows[j].route, score });
  }
}
pairs.sort((a, b) => b.score - a.score);
console.log('=== HIGHEST SERVICE-PAGE OVERLAP (5-word shingle Jaccard) ===');
for (const pair of pairs.slice(0, 12)) console.log(`${pair.score.toFixed(3)} | ${pair.a} <> ${pair.b}`);

const suspicious = pairs.filter((pair) => pair.score >= 0.30);
if (suspicious.length) console.log(`[service quality] REVIEW: ${suspicious.length} pair(s) have overlap >= 0.30`);
else console.log('[service quality] PASS: no curated service-page pair has overlap >= 0.30');
