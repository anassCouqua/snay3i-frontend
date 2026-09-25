const fs = require('fs');
const path = require('path');
const { INDEXABLE_SERVICE_CITY_ROUTES } = require('./site-curation-config');

const publicRoot = path.join(process.cwd(), 'public');

function text(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(html) {
  return (text(html).match(/[a-zà-ÿ0-9’'-]+/gi) || []).length;
}

const failures = [];
const rows = [];

for (const route of INDEXABLE_SERVICE_CITY_ROUTES) {
  const file = path.join(publicRoot, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) {
    failures.push(`${route}: missing generated page`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const listings = (html.match(/data-directory-listing=/g) || []).length;
  const calls = (html.match(/data-lead-action="call"/g) || []).length;
  const whatsapps = (html.match(/data-lead-action="whatsapp"/g) || []).length;
  const words = wordCount(html);
  rows.push({ route, listings, calls, whatsapps, words });

  if (!/<meta\s+name="robots"\s+content="index,follow"/i.test(html)) failures.push(`${route}: not index,follow`);
  if (listings < 2) failures.push(`${route}: fewer than 2 real directory listings`);
  if (calls < listings) failures.push(`${route}: missing call action on a listing`);
  if (whatsapps < listings) failures.push(`${route}: missing WhatsApp action on a listing`);
  if (words < 250) failures.push(`${route}: thin generated page (${words} words)`);
  if (/adsbygoogle\.js|google-adsense-account/i.test(html)) failures.push(`${route}: AdSense must remain off directory pages during recovery`);
  if (/\b(?:4\.[0-9]|5\.0)\b|\bverified\b|\bvérifié\b|\breviews?\b/i.test(html)) failures.push(`${route}: unsupported rating/review/verification claim found`);
}

console.log('=== SNAY3I DIRECTORY VALUE GATE ===');
for (const row of rows) console.log(`${row.route} | profiles=${row.listings} | call=${row.calls} | whatsapp=${row.whatsapps} | words=${row.words}`);
if (failures.length) throw new Error(`[directory value gate] BLOCKED:\n${failures.join('\n')}`);
console.log(`[directory value gate] PASS: ${rows.length} indexable service-city pages have >=2 listings, direct contact actions, substantial HTML and no ad/ratings leakage`);
