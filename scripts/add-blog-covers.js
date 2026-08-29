const fs = require('fs');
const path = require('path');

const publicRoot = path.join(process.cwd(), 'public');
const coverRoot = path.join(publicRoot, 'blog-images');
const blogRoots = [
  path.join(publicRoot, 'blog'),
  path.join(publicRoot, 'seo', 'blog'),
];

const escHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const escXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const titleFrom = (html) => html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  ?.replace(/<[^>]+>/g, '')
  .trim() || 'Guide pratique Snay3i.ma';

const descriptionFrom = (html) => html.match(/<meta name="description" content="([\s\S]*?)">/i)?.[1]
  ?.replace(/&quot;/g, '"').replace(/&#39;/g, "'") || '';

const slugFromFile = (root, file) => {
  const relative = path.relative(root, file).split(path.sep).join('/');
  if (relative === 'index.html') return 'blog';
  return relative.slice(0, -'/index.html'.length).split('/').pop() || 'blog';
};

const topicFor = (slug, title) => {
  const value = `${slug} ${title}`.toLowerCase();
  if (value.includes('plomb')) return ['PLOMBERIE', 'Plomberie au Maroc', 'Fuite • dépannage • devis'];
  if (value.includes('electric')) return ['ÉLECTRICITÉ', 'Électricité au Maroc', 'Sécurité • dépannage • devis'];
  if (value.includes('carreleur') || value.includes('carrel')) return ['CARRELAGE', 'Carrelage au Maroc', 'Pose • matériaux • préparation'];
  if (value.includes('peint')) return ['PEINTURE', 'Peinture au Maroc', 'Préparation • finition • devis'];
  if (value.includes('menuis')) return ['MENUISERIE', 'Menuiserie au Maroc', 'Cuisine • portes • sur mesure'];
  if (value.includes('climatisation')) return ['CLIMATISATION', 'Climatisation au Maroc', 'Installation • entretien • diagnostic'];
  if (value.includes('serrur')) return ['SERRURERIE', 'Serrurerie au Maroc', 'Porte • serrure • sécurité'];
  if (value.includes('macon')) return ['MAÇONNERIE', 'Maçonnerie au Maroc', 'Rénovation • chantier • préparation'];
  if (value.includes('jardin')) return ['JARDIN', 'Jardinage au Maroc', 'Entretien • plantation • aménagement'];
  if (value.includes('ménage') || value.includes('menage')) return ['ENTRETIEN', 'Entretien de la maison', 'Organisation • nettoyage • conseils'];
  if (value.includes('soudeur') || value.includes('ferronn')) return ['MÉTALLERIE', 'Soudure & ferronnerie', 'Portails • grilles • fabrication'];
  if (value.includes('renovation')) return ['RÉNOVATION', 'Rénovation au Maroc', 'Budget • ordre des travaux • artisans'];
  return ['TRAVAUX & SERVICES', 'Guides Snay3i.ma', 'Conseils pratiques pour votre maison'];
};

const coverSvg = (slug, title) => {
  const [label, topic, sub] = topicFor(slug, title);
  const safeTitle = escXml(title.length > 78 ? `${title.slice(0, 75)}…` : title);
  const safeTopic = escXml(topic);
  const safeSub = escXml(sub);
  const safeLabel = escXml(label);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${safeTitle}</title>
  <desc id="desc">${safeTopic} — ${safeSub}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d1b2a"/>
      <stop offset="1" stop-color="#b34f24"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" rx="36" fill="url(#bg)"/>
  <circle cx="1030" cy="120" r="120" fill="#ffffff" fill-opacity="0.10"/>
  <circle cx="1100" cy="610" r="180" fill="#ffffff" fill-opacity="0.08"/>
  <rect x="72" y="72" width="320" height="52" rx="26" fill="#ffffff" fill-opacity="0.14"/>
  <text x="104" y="107" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" letter-spacing="1.5">${safeLabel}</text>
  <text x="72" y="215" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800">${safeTopic}</text>
  <text x="72" y="282" fill="#ffffff" fill-opacity="0.92" font-family="Arial, Helvetica, sans-serif" font-size="27">${safeSub}</text>
  <text x="72" y="408" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="700">${safeTitle}</text>
  <g transform="translate(875 335)" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">
    <rect x="-88" y="-72" width="176" height="128" rx="18"/>
    <path d="M-52 18h104M-52 -16h58"/>
    <circle cx="62" cy="-18" r="8" fill="#ffffff" stroke="none"/>
  </g>
  <text x="72" y="594" fill="#ffffff" fill-opacity="0.78" font-family="Arial, Helvetica, sans-serif" font-size="24">Snay3i.ma • Guides pratiques</text>
</svg>`;
};

const walkHtml = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walkHtml(full) : [full];
  }).filter((file) => path.basename(file) === 'index.html');
};

fs.mkdirSync(coverRoot, { recursive: true });

let articles = 0;
let images = 0;
let indexPages = 0;

for (const root of blogRoots) {
  for (const file of walkHtml(root)) {
    let html = fs.readFileSync(file, 'utf8');
    const slug = slugFromFile(root, file);

    if (slug === 'blog') {
      if (!html.includes('data-snay3i-blog-cover="1"')) {
        const cover = `<div data-snay3i-blog-cover="1" style="margin:0 0 24px;border-radius:20px;overflow:hidden;box-shadow:0 12px 30px rgba(13,27,42,.12)"><img src="/blog-images/blog.svg" alt="Guides pratiques Snay3i.ma pour les travaux au Maroc" style="display:block;width:100%;height:auto" loading="eager"></div>`;
        html = html.replace(/(<main[^>]*>)/i, `$1${cover}`);
      }

      html = html.replace(/(<div class="card">\s*)(<h3>\s*<a href="\/blog\/([^"/]+)">[\s\S]*?<\/a>\s*<\/h3>)/gi, (match, prefix, heading, cardSlug) => {
        const existing = new RegExp(`<img[^>]+data-snay3i-cover="${cardSlug}"`, 'i');
        if (existing.test(match)) return match;
        const thumb = `<img data-snay3i-cover="${escHtml(cardSlug)}" src="/blog-images/${escHtml(cardSlug)}.svg" alt="Guide Snay3i.ma : ${escHtml(cardSlug)}" style="display:block;width:100%;max-width:520px;border-radius:14px;margin:0 0 14px" loading="lazy">`;
        return `${prefix}${thumb}${heading}`;
      });

      const cardRe = /(<div class="card">\s*<img data-snay3i-cover="([^"]+)"[^>]*>[\s\S]*?<h3>\s*<a href="\/blog\/[^"/]+">[\s\S]*?<\/a>\s*<\/h3>\s*)<p>([\s\S]*?)<\/p>/gi;
      html = html.replace(cardRe, (match, prefix, cardSlug, desc) => {
        const targetFiles = blogRoots.flatMap((r) => walkHtml(r)).filter((f) => f.endsWith(`/${cardSlug}/index.html`));
        const sourceFile = targetFiles[0];
        if (!sourceFile) return match;
        const article = fs.readFileSync(sourceFile, 'utf8');
        const description = descriptionFrom(article) || desc.replace(/<[^>]+>/g, '').trim();
        return `${prefix}<p>${description}</p>`;
      });

      fs.writeFileSync(file, html, 'utf8');
      indexPages += 1;
      continue;
    }

    const title = titleFrom(html);
    const coverFile = path.join(coverRoot, `${slug}.svg`);
    fs.writeFileSync(coverFile, coverSvg(slug, title), 'utf8');

    const img = `<div data-snay3i-article-cover="1" style="margin:0 0 26px;border-radius:20px;overflow:hidden;box-shadow:0 12px 30px rgba(13,27,42,.12)"><img src="/blog-images/${escHtml(slug)}.svg" alt="${escHtml(title)}" style="display:block;width:100%;height:auto" width="1200" height="675" loading="eager"></div>`;
    if (!html.includes('data-snay3i-article-cover="1"')) {
      html = html.replace(/(<main[^>]*>)/i, `$1${img}`);
    }

    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/i)?.[1];
    const imageUrl = canonical ? `${canonical}.svg`.replace(/\.html\.svg$/, '.svg') : `https://snay3i.ma/blog-images/${slug}.svg`;
    if (!html.includes('property="og:image"')) {
      html = html.replace('</head>', `<meta property="og:image" content="https://snay3i.ma/blog-images/${escHtml(slug)}.svg">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="https://snay3i.ma/blog-images/${escHtml(slug)}.svg">\n</head>`);
    }

    fs.writeFileSync(file, html, 'utf8');
    articles += 1;
    images += 1;
  }
}

fs.writeFileSync(path.join(coverRoot, 'blog.svg'), coverSvg('blog', 'Guides pratiques pour les travaux et services au Maroc'), 'utf8');

console.log(`[Blog covers] ${articles} article pages updated, ${images} covers generated, ${indexPages} guide indexes updated`);