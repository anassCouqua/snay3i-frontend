const { content, meta } = require('../content/darija-guide-expansion');

function tokens(text) {
  return String(text).toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
}
function shingles(text, n = 5) {
  const words = tokens(text); const set = new Set();
  for (let i = 0; i <= words.length - n; i += 1) set.add(words.slice(i, i + n).join(' '));
  return set;
}
function jaccard(a, b) {
  let hit = 0; for (const x of a) if (b.has(x)) hit += 1;
  return hit / (a.size + b.size - hit || 1);
}

const banned = [
  /أمان\s+تام/,
  /أفضل\s+الحرفيين/,
  /أحسن\s+جودة/,
  /جودة\s+مضمونة/,
  /مضمون(?:ة|ين)?\s*(?:100|١٠٠)?/,
  /بلا\s+أي\s+خطر/,
  /كيضمن\s+السلامة/,
];

const failures = [];
const rows = [];
for (const [slug, body] of Object.entries(content)) {
  const m = meta[slug];
  if (!m) { failures.push(`${slug}: metadata missing`); continue; }
  const count = tokens(body).length;
  const faq = /##\s+أسئلة\s+وأجوبة/.test(body);
  const checklist = /##\s+Checklist/i.test(body);
  const h2s = (body.match(/^##\s+/gm) || []).length;
  const h3s = (body.match(/^###\s+/gm) || []).length;
  const risky = banned.filter((re) => re.test(body)).map((re) => String(re));
  if (count < 800) failures.push(`${slug}: only ${count} Unicode words; Darija internal floor is 800`);
  if (!faq || h3s < 4) failures.push(`${slug}: FAQ/Q&A section is missing or too shallow (${h3s} questions)`);
  if (!checklist) failures.push(`${slug}: checklist missing`);
  if (h2s < 10) failures.push(`${slug}: article structure too shallow (${h2s} H2s)`);
  if (!m.title || m.title.length < 30 || m.title.length > 70) failures.push(`${slug}: title length ${m.title ? m.title.length : 0}`);
  if (!m.description || m.description.length < 70 || m.description.length > 165) failures.push(`${slug}: description length ${m.description ? m.description.length : 0}`);
  if (m.lang !== 'ary' || m.dir !== 'rtl') failures.push(`${slug}: Darija language/direction metadata must be ary/rtl`);
  if (risky.length) failures.push(`${slug}: banned trust/safety wording ${risky.join(', ')}`);
  rows.push({ slug, count, faq: h3s, h2s, shingles: shingles(body) });
}

for (let i = 0; i < rows.length; i += 1) {
  for (let j = i + 1; j < rows.length; j += 1) {
    const score = jaccard(rows[i].shingles, rows[j].shingles);
    if (score >= 0.20) failures.push(`Darija overlap ${score.toFixed(3)}: ${rows[i].slug} <> ${rows[j].slug}`);
  }
}

console.log('=== DARIJA EDITORIAL GATE ===');
for (const row of rows) console.log(`${row.slug} | ${row.count} words | ${row.h2s} H2 | ${row.faq} FAQ questions`);
if (failures.length) throw new Error(`[darija audit] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[darija audit] PASS: ${rows.length} Darija guides meet depth, FAQ, structure, metadata, claim-safety and overlap standards`);
