const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'src', 'Blog.js');

const PHOTO_SETS = {
  plumbing: [
    'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=82'
  ],
  electrical: [
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=82'
  ],
  renovation: [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=82'
  ],
  painting: [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1400&q=82'
  ],
  locksmith: [
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1400&q=82'
  ],
  climate: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1631545806609-9031d8f7b2e7?auto=format&fit=crop&w=1400&q=82'
  ],
  garden: [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1599685315640-3a7cfe58a4b9?auto=format&fit=crop&w=1400&q=82'
  ],
  carpentry: [
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1400&q=82'
  ],
  tile: [
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=82'
  ],
  metal: [
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82'
  ]
};

function keyForSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (s.includes('plomb') || s.includes('sanit')) return 'plumbing';
  if (s.includes('electric') || s.includes('tricien')) return 'electrical';
  if (s.includes('renov') || s.includes('macon') || s.includes('construction') || s.includes('salle-bain')) return 'renovation';
  if (s.includes('peint') || s.includes('sabbagh') || s.includes('naqqach')) return 'painting';
  if (s.includes('serrur') || s.includes('cadenas') || s.includes('locksmith')) return 'locksmith';
  if (s.includes('clim') || s.includes('frigo')) return 'climate';
  if (s.includes('jardin') || s.includes('paysag')) return 'garden';
  if (s.includes('menuis') || s.includes('cuisine')) return 'carpentry';
  if (s.includes('carrel') || s.includes('zellige')) return 'tile';
  if (s.includes('soud') || s.includes('ferronn')) return 'metal';
  return 'renovation';
}

const helper = `
const ARTICLE_PHOTO_SETS = ${JSON.stringify(PHOTO_SETS)};
function articlePhotoSet(slug) {
  return ARTICLE_PHOTO_SETS[${keyForSlug.toString()}(slug)] || ARTICLE_PHOTO_SETS.renovation;
}
function SafeArticlePhoto({ src, alt, compact = false }) {
  const fallback = 'linear-gradient(135deg,#0D1B2A 0%,#1B263B 100%)';
  return (
    <div data-snay3i-photo-upgrade="1" style={{position:'relative',width:'100%',minHeight:compact?150:280,margin:compact?'0 0 14px':'24px 0',borderRadius:16,overflow:'hidden',background:fallback,border:'1.5px solid #E8E0D4',boxShadow:'0 5px 18px rgba(13,27,42,0.10)'}}>
      <img src={src} alt={alt || 'Snay3i.ma — artisan au Maroc'} loading="lazy" onError={(e)=>{e.currentTarget.style.display='none';const p=e.currentTarget.parentElement;if(p){p.style.background=fallback;p.setAttribute('data-image-fallback','1');}}} style={{display:'block',width:'100%',height:compact?150:280,objectFit:'cover'}} />
      <div style={{position:'absolute',left:12,bottom:12,background:'rgba(13,27,42,.82)',color:'#fff',padding:'6px 10px',borderRadius:999,fontSize:12,fontWeight:700}}>🇲🇦 Snay3i.ma</div>
    </div>
  );
}
`;

function patch(source) {
  if (source.includes('data-snay3i-photo-upgrade')) return source;
  source = source.replace(
    "function Snay3iArticleContent({ content }) {",
    `${helper}\nfunction Snay3iArticleContent({ content, photos = [] }) {`
  );
  source = source.replace(
    "const paragraphs = normalizeArticleContent(content).split('\\n').map(line => line.trim()).filter(Boolean);",
    "const paragraphs = normalizeArticleContent(content).split('\\n').map(line => line.trim()).filter(Boolean);\n  const usablePhotos = Array.isArray(photos) ? photos.slice(0,2) : [];"
  );
  source = source.replace(
    "{paragraphs.map((line, i) => {",
    "{paragraphs.map((line, i) => {\n        const photoIndex = Math.floor(i / 8) - 1;\n        if (i > 0 && i % 8 === 0 && usablePhotos[photoIndex]) return <SafeArticlePhoto key={`photo-${i}`} src={usablePhotos[photoIndex]} alt=\"Illustration Snay3i.ma\" />;"
  );
  source = source.replace(
    "<Snay3iArticleContent content={article.content} />",
    "<Snay3iArticleContent content={article.content} photos={articlePhotoSet(article.slug)} />"
  );
  source = source.replace(
    "<div style={{fontSize:38,flexShrink:0,marginTop:2}}>{article.emoji}</div>",
    "<div style={{width:'100%',maxWidth:220,flexShrink:0}}><SafeArticlePhoto src={articlePhotoSet(article.slug)[0]} alt={article.title} compact /></div>"
  );
  return source;
}

if (!fs.existsSync(blogPath)) throw new Error(`[Blog build repair] Missing ${blogPath}`);
const original = fs.readFileSync(blogPath, 'utf8');
const repaired = patch(original);
if (repaired === original) console.log('[Blog build repair] already hardened');
else { fs.writeFileSync(blogPath, repaired); console.log('[Blog build repair] added photography to article content and cards'); }
