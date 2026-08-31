const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const DATE_ISO = '2026-08-31';
const DATE_FR = '31 août 2026';
const DATE_DARIJA = '31 غشت 2026';
const AUTHOR = 'Rédaction Snay3i.ma';

function decode(value='') {
  return value.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function get(html, re) { return decode((html.match(re) || [,''])[1].trim()); }

for (const slug of INDEXABLE_BLOG_SLUGS) {
  const file = path.join(blogRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[authorship] missing canonical article: ${slug}`);
  let html = fs.readFileSync(file, 'utf8');
  const isDarija = /<html[^>]*lang=["']ary["'][^>]*dir=["']rtl["']/i.test(html);
  const title = get(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const description = get(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const image = get(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const canonical = `https://snay3i.ma/blog/${slug}`;
  if (!title || !description) throw new Error(`[authorship] title/description missing: ${slug}`);

  const dateVisible = isDarija ? DATE_DARIJA : DATE_FR;
  const byline = isDarija
    ? `<p class="meta" data-snay3i-byline="1"><strong>فريق تحرير Snay3i.ma</strong> · تنشر ف <time datetime="${DATE_ISO}" data-date-published="1">${dateVisible}</time> · آخر تحديث <time datetime="${DATE_ISO}" data-date-modified="1">${dateVisible}</time> · <a href="/about">على Snay3i وطريقة التحرير</a></p>`
    : `<p class="meta" data-snay3i-byline="1"><strong>${AUTHOR}</strong> · Publié le <time datetime="${DATE_ISO}" data-date-published="1">${dateVisible}</time> · Mis à jour le <time datetime="${DATE_ISO}" data-date-modified="1">${dateVisible}</time> · <a href="/about">Méthode éditoriale et à propos</a></p>`;
  html = html.replace(/<p class="meta"[^>]*(?:data-snay3i-byline="1"[^>]*)?>[\s\S]*?<\/p>/i, byline);
  if (!html.includes('data-snay3i-byline="1"')) html = html.replace(/(<h1[^>]*>)/i, `${byline}$1`);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    inLanguage: isDarija ? 'ary-MA' : 'fr-MA',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    datePublished: DATE_ISO,
    dateModified: DATE_ISO,
    author: {
      '@type': 'Organization',
      name: AUTHOR,
      url: 'https://snay3i.ma/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Snay3i.ma',
      url: 'https://snay3i.ma/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://snay3i.ma/logo.png',
      },
    },
  };
  if (image) schema.image = image;

  const schemaTag = `<script type="application/ld+json" data-snay3i-authorship="1">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
  html = html.replace(/\s*<script[^>]*data-snay3i-authorship="1"[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace('</head>', `${schemaTag}</head>`);

  const note = isDarija
    ? `<section data-snay3i-editorial-note="1"><h2>التحرير وطريقة الخدمة</h2><p>هاد الدليل كيتكتب ويتراجع من طرف فريق تحرير Snay3i.ma باش يساعد الناس يحضرو المشروع، يقارنو الخدمات ويطرحو الأسئلة المناسبة. المعلومات اللي فالبروفايل أو المقال ماشي ضمان للجودة وما كتعوضش المعاينة أو الدراسة اللي خاص يديرها المهني المؤهل للمشروع.</p><p><a href="/about">عرف أكثر على Snay3i.ma وطريقة التحرير ديالنا</a></p></section>`
    : `<section data-snay3i-editorial-note="1"><h2>Rédaction et méthode</h2><p>Ce guide est rédigé et maintenu par la rédaction de Snay3i.ma pour aider les particuliers à préparer une demande, comparer des prestations et poser des questions utiles. Il ne présente pas les informations d’un profil comme une garantie de qualité et ne remplace pas un diagnostic réalisé sur place par le professionnel compétent.</p><p><a href="/about">En savoir plus sur Snay3i.ma et notre approche éditoriale</a></p></section>`;
  html = html.replace(/<section data-snay3i-editorial-note="1">[\s\S]*?<\/section>/i, '');
  if (isDarija) html = html.replace(/<section><h2>حول هاد الدليل<\/h2>/i, `${note}<section><h2>حول هاد الدليل</h2>`);
  else html = html.replace(/<section><h2>À propos de ce guide<\/h2>/i, `${note}<section><h2>À propos de ce guide</h2>`);

  const checks = [
    ['visible byline', /data-snay3i-byline="1"/],
    ['published date', new RegExp(`data-date-published="1">${dateVisible}`)],
    ['modified date', new RegExp(`data-date-modified="1">${dateVisible}`)],
    ['BlogPosting schema', /"@type":"BlogPosting"/],
    ['datePublished schema', new RegExp(`"datePublished":"${DATE_ISO}"`)],
    ['dateModified schema', new RegExp(`"dateModified":"${DATE_ISO}"`)],
    ['language schema', isDarija ? /"inLanguage":"ary-MA"/ : /"inLanguage":"fr-MA"/],
    ['mainEntityOfPage', new RegExp(`"@id":"https:\\/\\/snay3i\\.ma\\/blog\\/${slug}"`)],
    ['publisher logo', /"url":"https:\/\/snay3i\.ma\/logo\.png"/],
    ['author identity', new RegExp(`"name":"${AUTHOR.replace('.', '\\.')}"`)],
  ];
  for (const [label, re] of checks) if (!re.test(html)) throw new Error(`[authorship] ${slug}: missing ${label}`);
  fs.writeFileSync(file, html, 'utf8');
}
console.log(`[authorship] PASS: ${INDEXABLE_BLOG_SLUGS.length} canonical guides have localized visible dates, honest authorship and BlogPosting schema`);
