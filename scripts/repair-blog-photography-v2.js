const fs = require('fs');
const path = require('path');
const { PHOTO_REGISTRY, normalizeSlug, categoryForSlug, photoForSlug } = require('./blog-photo-registry');

const root = path.join(__dirname, '..');
const blogPath = path.join(root, 'src', 'Blog.js');
const publicRoot = path.join(root, 'public', 'blog');

const FALLBACK = 'linear-gradient(135deg,#0D1B2A 0%,#1B263B 100%)';
const CATEGORY_EMOJI = {
  plomberie: '🔧', electricite: '⚡', renovation: '🏠', peinture: '🎨',
  serrurerie: '🔑', climatisation: '❄️', jardinage: '🌿', menuiserie: '🪚',
  carrelage: '🏛️', ferronnerie: '🔥', ville: '🇲🇦'
};

function jsMap() {
  return JSON.stringify(PHOTO_REGISTRY, null, 2);
}

function repairReactBlog() {
  if (!fs.existsSync(blogPath)) throw new Error(`[blog photography] Missing ${blogPath}`);
  let source = fs.readFileSync(blogPath, 'utf8');

  // Replace every previous image-selection implementation with one explicit registry.
  const imageFunction = `const ARTICLE_PHOTO_MAP = ${jsMap()};\n\nfunction getArticleImage(article) {\n  const slug = article && article.slug ? String(article.slug) : '';\n  return ARTICLE_PHOTO_MAP[slug] || '';\n}\n\n`;
  source = source.replace(/function getArticleImage\(article\)\s*\{[\s\S]*?\n\}\s*\n+/, imageFunction);

  // Remove the old generated card-photo helper if it survived a previous deployment.
  source = source.replace(/\nconst SNAY3I_CARD_PHOTOS = [\s\S]*?\nfunction setCanonical/, '\nfunction setCanonical');

  // Remove the old category-pool helper and replace it with a single safe image renderer.
  const safeHelper = `function SafeArticlePhoto({ src, alt, compact = false }) {\n  const fallback = '${FALLBACK}';\n  const height = compact ? 150 : 280;\n  return (\n    <div data-snay3i-photo="1" style={{position:'relative',width:'100%',minHeight:height,margin:compact?'0 0 14px':'24px 0',borderRadius:16,overflow:'hidden',background:fallback,border:'1.5px solid #E8E0D4',boxShadow:'0 5px 18px rgba(13,27,42,0.10)'}}>\n      {src ? <img src={src} alt={alt || 'Snay3i.ma — artisan au Maroc'} loading={compact?'eager':'lazy'} onError={(e)=>{e.currentTarget.style.display='none';e.currentTarget.parentElement?.setAttribute('data-image-fallback','1');}} style={{display:'block',width:'100%',height,objectFit:'cover'}} /> : null}\n      <div style={{position:'absolute',left:12,bottom:12,background:'rgba(13,27,42,.82)',color:'#fff',padding:'6px 10px',borderRadius:999,fontSize:12,fontWeight:700}}>🇲🇦 Snay3i.ma</div>\n    </div>\n  );\n}\n\n`;
  source = source.replace(/const ARTICLE_PHOTO_SETS = [\s\S]*?function Snay3iArticleContent\(/, `${safeHelper}function Snay3iArticleContent(`);

  // Remove the previous automatic "every 8 paragraphs" photo insertion.
  source = source.replace(/\n\s*const usablePhotos = Array\.isArray\(photos\) \? photos\.slice\(0,2\) : \[\];/g, '');
  source = source.replace(/\n\s*const photoIndex = Math\.floor\(i \/ 8\) - 1;\s*if \(i > 0 && i % 8 === 0 && usablePhotos\[photoIndex\]\) return <SafeArticlePhoto[^;]+;/g, '');
  source = source.replace(/function Snay3iArticleContent\(\{ content, photos = \[\] \}\)/g, 'function Snay3iArticleContent({ content })');
  source = source.replace(/\s+photos=\{articlePhotoSet\(article\.slug\)\}/g, '');
  source = source.replace(/articlePhotoSet\(article\.slug\)\[0\]/g, 'getArticleImage(article)');
  source = source.replace(/articlePhotoSet\(article\.slug\)/g, 'getArticleImage(article)');

  // Make any previous hero/card SafeArticlePhoto calls use the same explicit registry.
  source = source.replace(/snay3iCardPhoto\(article\?\.slug \|\| ''\)/g, 'getArticleImage(article)');

  fs.writeFileSync(blogPath, source, 'utf8');
  console.log(`[blog photography v2] React registry applied (${Object.keys(PHOTO_REGISTRY).length} curated articles)`);
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function emojiForSlug(slug) {
  return CATEGORY_EMOJI[categoryForSlug(slug)] || '🇲🇦';
}

function safePhotoBlock(url, alt, compact = false) {
  const height = compact ? 150 : 340;
  const image = url ? `background-image:linear-gradient(135deg,rgba(13,27,42,.12),rgba(27,38,59,.58)),url('${url}')` : `background-image:${FALLBACK}`;
  return `<div role="img" aria-label="${escapeHtml(alt)}" data-snay3i-safe-photo="1" style="min-height:${height}px;width:100%;border-radius:20px;background-color:#0D1B2A;${image};background-size:cover;background-position:center;display:flex;align-items:flex-end;box-sizing:border-box;padding:24px"><div style="background:rgba(13,27,42,.82);color:#fff;border-radius:999px;padding:7px 12px;font-size:14px;line-height:1">🇲🇦 Snay3i.ma</div></div>`;
}

function replaceMetaImage(html, imageUrl) {
  if (imageUrl) {
    html = html.replace(/(<meta\s+property=["']og:image["']\s+content=["'])[^"']*(["'][^>]*>)/gi, `$1${imageUrl}$2`);
    html = html.replace(/(<meta\s+name=["']twitter:image["']\s+content=["'])[^"']*(["'][^>]*>)/gi, `$1${imageUrl}$2`);
  } else {
    html = html.replace(/<meta\s+property=["']og:image["'][^>]*>\s*/gi, '');
    html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>\s*/gi, '');
  }
  return html;
}

function replaceCover(html, imageUrl, altText) {
  const re = /<div([^>]*data-snay3i-article-cover=["']1["'][^>]*)>[\s\S]*?<\/div>\s*<\/div>/i;
  return html.replace(re, `<div$1>${safePhotoBlock(imageUrl, altText)}</div>`);
}

function removeOldInlinePhotos(html) {
  return html.replace(/<div[^>]*data-snay3i-inline-photo=["']1["'][\s\S]*?<\/div>\s*<\/div>/gi, '');
}

function removeOldImageTags(html) {
  return html.replace(/<img([^>]*src=["'](?:\/)?blog-images\/[^"']+["'][^>]*)>/gi, '');
}

function processArticle(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('data-snay3i-article-cover')) return false;
  const relative = path.relative(publicRoot, filePath).split(path.sep);
  const slug = relative[0];
  const imageUrl = photoForSlug(slug);
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Snay3i.ma — Guide pratique';

  html = replaceMetaImage(html, imageUrl);
  html = removeOldInlinePhotos(html);
  html = removeOldImageTags(html);
  html = replaceCover(html, imageUrl, title);
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function processBlogIndex() {
  const filePath = path.join(publicRoot, 'index.html');
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove previous generated photo blocks so this pass is idempotent.
  html = html.replace(/<div[^>]*data-snay3i-blog-photo=["']1["'][^>]*>[\s\S]*?<\/div>\s*/gi, '');

  html = html.replace(/<div class="card">([\s\S]*?)<\/div>/gi, (card) => {
    const slugMatch = card.match(/href=["']\/blog\/([^"']+)["']/i);
    if (!slugMatch) return card;
    const slug = normalizeSlug(slugMatch[1]);
    const imageUrl = photoForSlug(slug);
    const emoji = emojiForSlug(slug);
    const titleMatch = card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const alt = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : `Guide ${slug}`;
    const image = imageUrl
      ? `<div data-snay3i-blog-photo="1" role="img" aria-label="${escapeHtml(alt)}" style="height:150px;width:100%;border-radius:14px;margin-bottom:12px;background-color:#0D1B2A;background-image:linear-gradient(135deg,rgba(13,27,42,.10),rgba(27,38,59,.58)),url('${imageUrl}');background-size:cover;background-position:center"></div>`
      : `<div data-snay3i-blog-photo="1" role="img" aria-label="${escapeHtml(alt)}" style="height:150px;width:100%;border-radius:14px;margin-bottom:12px;background:${FALLBACK};display:flex;align-items:flex-end;padding:12px;box-sizing:border-box"><span style="background:rgba(13,27,42,.82);color:#fff;border-radius:999px;padding:6px 9px;font-size:18px">${emoji}</span></div>`;
    return `<div class="card">\n${image}${card.replace(/^<div class="card">/, '').replace(/<\/div>\s*$/, '')}\n</div>`;
  });

  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function main() {
  repairReactBlog();
  if (fs.existsSync(publicRoot)) {
    for (const entry of fs.readdirSync(publicRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const filePath = path.join(publicRoot, entry.name, 'index.html');
      if (fs.existsSync(filePath)) processArticle(filePath);
    }
    processBlogIndex();
  }
  console.log('[blog photography v2] completed: explicit images only, no automatic category reuse, no automatic inline duplicates');
}

main();
