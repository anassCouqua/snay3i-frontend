const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const UPDATED_ISO = '2026-08-31';
const UPDATED_FR = '31 août 2026';

function decode(value='') {
  return value.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function get(html, re) { return decode((html.match(re) || [,''])[1].trim()); }

for (const slug of INDEXABLE_BLOG_SLUGS) {
  const file = path.join(blogRoot, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`[authorship] missing canonical article: ${slug}`);
  let html = fs.readFileSync(file, 'utf8');
  const title = get(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const description = get(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const image = get(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const canonical = `https://snay3i.ma/blog/${slug}`;
  if (!title || !description) throw new Error(`[authorship] title/description missing: ${slug}`);

  const byline = `<p class="meta" data-snay3i-byline="1"><strong>Rédaction Snay3i.ma</strong> · Mis à jour le <time datetime="${UPDATED_ISO}">${UPDATED_FR}</time> · Guide pratique · <a href="/about">Notre approche éditoriale</a></p>`;
  html = html.replace(/<p class="meta"[^>]*>Guide Snay3i\.ma[\s\S]*?<\/p>/i, byline);
  if (!html.includes('data-snay3i-byline="1"')) {
    html = html.replace(/(<h1[^>]*>)/i, `${byline}$1`);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: canonical,
    dateModified: UPDATED_ISO,
    author: {
      '@type': 'Organization',
      name: 'Rédaction Snay3i.ma',
      url: 'https://snay3i.ma/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Snay3i.ma',
      url: 'https://snay3i.ma/'
    }
  };
  if (image) schema.image = image;
  const schemaTag = `<script type="application/ld+json" data-snay3i-authorship="1">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
  html = html.replace(/<script[^>]*data-snay3i-authorship="1"[^>]*>[\s\S]*?<\/script>/i, '');
  html = html.replace('</head>', `${schemaTag}</head>`);

  const note = `<section data-snay3i-editorial-note="1"><h2>Rédaction et méthode</h2><p>Ce guide est rédigé et maintenu par la rédaction de Snay3i.ma pour aider les particuliers à préparer une demande, comparer des prestations et poser des questions utiles. Il ne présente pas les informations d’un profil comme une garantie de qualité et ne remplace pas un diagnostic réalisé sur place par le professionnel compétent.</p><p><a href="/about">En savoir plus sur Snay3i.ma et notre approche éditoriale</a></p></section>`;
  html = html.replace(/<section data-snay3i-editorial-note="1">[\s\S]*?<\/section>/i, '');
  html = html.replace(/<section><h2>À propos de ce guide<\/h2>/i, `${note}<section><h2>À propos de ce guide</h2>`);

  const checks = [
    ['visible byline', /data-snay3i-byline="1"/],
    ['update date', new RegExp(`datetime="${UPDATED_ISO}"`)],
    ['Article schema', /data-snay3i-authorship="1"/],
    ['author link', /Rédaction Snay3i\.ma/]
  ];
  for (const [label, re] of checks) if (!re.test(html)) throw new Error(`[authorship] ${slug}: missing ${label}`);
  fs.writeFileSync(file, html, 'utf8');
}
console.log(`[authorship] PASS: ${INDEXABLE_BLOG_SLUGS.length} canonical guides have visible editorial authorship, update dates and Article schema`);
