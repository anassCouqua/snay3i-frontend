const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceFile = path.join(root, 'src', 'Blog.js');
const contentFile = path.join(root, 'content', 'canonical-guide-content.json');
const metaFile = path.join(root, 'content', 'canonical-guide-meta.json');
const blogRoot = path.join(root, 'public', 'blog');
const blogImageRoot = path.join(root, 'public', 'blog-images');

if (!fs.existsSync(sourceFile)) throw new Error('[canonical blog] Blog.js missing');
if (!fs.existsSync(contentFile)) throw new Error('[canonical blog] content registry missing');
if (!fs.existsSync(metaFile)) throw new Error('[canonical blog] metadata registry missing');

const editorial = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
const CANONICAL = Object.keys(editorial);
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

// Editorially verified photography. These are deliberately mapped by article,
// not by generic category, so a plumbing page cannot silently inherit a
// cleaning/renovation image. All external photos below were checked as free
// Unsplash-licensed photographs before being added.
const IMAGE_SETS = {
  'trouver-bon-plombier-maroc': {
    hero: U('photo-1749532125405-70950966b0e5'),
    detail: U('photo-1503789146722-cf137a3c0fea'),
    heroAlt: 'Plombier intervenant sur une installation de salle de bain',
    detailAlt: 'Clés et outils utilisés pour des travaux de plomberie'
  },
  'tarif-electricien-maroc-2026': {
    hero: U('photo-1758101755915-462eddc23f57'),
    detail: U('photo-1753272691001-4d68806ac590'),
    heroAlt: 'Électricien testant un tableau électrique avec un multimètre',
    detailAlt: 'Tableau électrique avec câblage et composants visibles'
  },
  'renovation-maison-maroc-guide': {
    hero: U('photo-1768321902097-1d85e7735c5f'),
    detail: U('photo-1768321902794-c24fb1f00661'),
    heroAlt: 'Pièce intérieure en cours de rénovation avec cloisons apparentes',
    detailAlt: 'Chantier de rénovation intérieure avec matériaux et outils'
  },
  'climatisation-maroc-installation': {
    hero: U('photo-1698479603408-1a66a6d9e80f'),
    detail: U('photo-1726614846573-c1ac2e6161d1'),
    heroAlt: 'Unité extérieure de climatisation résidentielle',
    detailAlt: 'Équipement de climatisation installé à l’extérieur d’un bâtiment'
  },
  'serrurier-urgence-maroc': {
    hero: U('photo-1750614335370-fa6e54d970db'),
    detail: U('photo-1654944932733-bca31b703dd7'),
    heroAlt: 'Clés insérées dans la serrure d’une porte',
    detailAlt: 'Clé et serrure de porte vues de près'
  },
  'choisir-carreleur-maroc': {
    hero: U('photo-1523413307857-ef24c53571ae'),
    detail: U('photo-1703868669362-562283170216'),
    heroAlt: 'Pose manuelle de carrelage mural pendant des travaux',
    detailAlt: 'Cuisine finie avec carrelage mural et joints visibles'
  },
  'macon-construction-maroc': {
    hero: U('photo-1727786550996-4fa0512e633b'),
    detail: U('photo-1764697757348-e3c87b076310'),
    heroAlt: 'Maçon travaillant sur un mur en briques',
    detailAlt: 'Ouvrier réalisant des travaux de maçonnerie sur un mur'
  },
  'urgence-plomberie-casablanca': {
    hero: U('photo-1746095792963-74106bae8658'),
    detail: 'https://unsplash.com/photos/c314Gh8dXAo/download?force=true',
    heroAlt: 'Ouvriers réparant une canalisation pendant une intervention de plomberie',
    detailAlt: 'Plombier intervenant sous un évier sur les raccords et canalisations'
  }
};

function esc(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function inlineMd(value){return value.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');}
function markdownToHtml(markdown){
  const lines=markdown.replace(/\r/g,'').split('\n'); const out=[]; let p=[]; let list=null;
  const flush=()=>{if(!p.length)return;out.push(`<p>${inlineMd(esc(p.join(' ').trim()))}</p>`);p=[];};
  const close=()=>{if(!list)return;out.push(`</${list}>`);list=null;};
  for(const raw of lines){const line=raw.trim();if(!line){flush();close();continue;}const h3=line.match(/^###\s+(.+)$/);if(h3){flush();close();out.push(`<h3>${inlineMd(esc(h3[1]))}</h3>`);continue;}const h=line.match(/^##\s+(.+)$/);if(h){flush();close();out.push(`<h2>${inlineMd(esc(h[1]))}</h2>`);continue;}const ol=line.match(/^\d+\.\s+(.+)$/);if(ol){flush();if(list!=='ol'){close();out.push('<ol>');list='ol';}out.push(`<li>${inlineMd(esc(ol[1]))}</li>`);continue;}const ul=line.match(/^[-*]\s+(.+)$/);if(ul){flush();if(list!=='ul'){close();out.push('<ul>');list='ul';}out.push(`<li>${inlineMd(esc(ul[1]))}</li>`);continue;}close();p.push(line);}flush();close();return out.join('\n');
}
function extractContent(source,slug){const marker=`slug: '${slug}'`;const start=source.indexOf(marker);if(start<0)throw new Error(`[canonical blog] source article not found: ${slug}`);const cm=source.indexOf('content: `',start);if(cm<0)throw new Error(`[canonical blog] content marker not found: ${slug}`);const cs=cm+'content: `'.length;const ce=source.indexOf('`\n  }',cs);if(ce<0)throw new Error(`[canonical blog] content terminator not found: ${slug}`);return source.slice(cs,ce).trim();}
function splitBodyAtMidHeading(body){
  const headings=[...body.matchAll(/<h2\b/gi)];
  if(headings.length<2) return [body,''];
  const chosen=headings[Math.max(1,Math.floor(headings.length/2))];
  return [body.slice(0,chosen.index),body.slice(chosen.index)];
}
function photoFigure(slug,kind){
  const set=IMAGE_SETS[slug];
  if(!set)throw new Error(`[canonical blog] missing image set: ${slug}`);
  const hero=kind==='hero';
  const src=hero?set.hero:set.detail;
  const alt=hero?set.heroAlt:set.detailAlt;
  const label=hero?alt:`Dans le guide : ${alt.charAt(0).toLowerCase()}${alt.slice(1)}`;
  return `<figure data-snay3i-${hero?'article-cover':'support-photo'}="1" style="margin:${hero?'0 0 24px':'30px 0'};border-radius:20px;overflow:hidden;background:#0D1B2A;border:1px solid #E8E0D4"><img src="${src}" alt="${esc(alt)}" ${hero?'fetchpriority="high"':'loading="lazy"'} width="1600" height="900" style="display:block;width:100%;height:${hero?'300px':'auto'};max-height:${hero?'300':'420'}px;object-fit:cover"><figcaption style="padding:10px 14px;font-size:12px;color:#6f6a64;background:#fff">${esc(label)}</figcaption></figure>`;
}
function diagramFigure(slug,title){
  const inlineFile=path.join(blogImageRoot,`${slug}.svg`);
  if(!fs.existsSync(inlineFile))throw new Error(`[canonical blog] missing inline artwork: ${slug}`);
  const label=`Repères pratiques — ${title}`;
  return `<figure data-snay3i-inline-photo="1" style="margin:30px 0;border-radius:20px;overflow:hidden;background:#0D1B2A;border:1px solid #E8E0D4"><img src="/blog-images/${slug}.svg" alt="${esc(label)}" loading="lazy" width="1200" height="675" style="display:block;width:100%;height:auto;max-height:420px;object-fit:cover"><figcaption style="padding:10px 14px;font-size:12px;color:#6f6a64;background:#fff">${esc(label)}</figcaption></figure>`;
}
function htmlFor(a){
  const body=markdownToHtml(a.content);
  const [bodyA,bodyB]=splitBodyAtMidHeading(body);
  const hero=photoFigure(a.slug,'hero');
  const detail=photoFigure(a.slug,'detail');
  const diagram=diagramFigure(a.slug,a.title);
  const imageSet=IMAGE_SETS[a.slug];
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(a.title)}</title><meta name="description" content="${esc(a.description)}"><meta name="robots" content="index,follow"><meta name="google-adsense-account" content="ca-pub-7772621804003550"><link rel="canonical" href="https://snay3i.ma/blog/${a.slug}"><meta property="og:title" content="${esc(a.title)}"><meta property="og:description" content="${esc(a.description)}"><meta property="og:image" content="${imageSet.hero}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${imageSet.hero}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script><style>body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav{max-width:920px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:900px;margin:auto;padding:36px 16px}section{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:26px;margin:0 0 16px}h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:22px;color:#0d1b2a;margin-top:30px}h3{font-size:18px;color:#0d1b2a}.meta{color:#6f6a64;font-size:14px}.article p,.article li{font-size:17px}.article h2{margin-top:30px}figure{margin-left:0;margin-right:0}figcaption{line-height:1.5}@media(max-width:640px){main{padding:24px 14px}h1{font-size:28px}.article p,.article li{font-size:16px}section{padding:20px}nav{gap:10px;font-size:14px}}</style></head><body><header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header><main>${hero}<article class="article"><section><p class="meta">Guide Snay3i.ma${a.date?` • ${esc(a.date)}`:''}</p><h1>${esc(a.title)}</h1><p>${esc(a.description)}</p></section><section>${bodyA}${detail}${bodyB}</section>${diagram}</article><section><h2>À propos de ce guide</h2><p>Ce guide aide les particuliers à préparer une demande de service, comparer des professionnels et poser les bonnes questions. Les prix, disponibilités et conditions dépendent du professionnel, de la ville et du travail demandé.</p><p><a href="/blog">Voir les autres guides</a> · <a href="/contact">Nous contacter</a></p></section></main><footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer></body></html>`;
}

const source=fs.readFileSync(sourceFile,'utf8');
if(!fs.existsSync(blogRoot))fs.mkdirSync(blogRoot,{recursive:true});
for(const slug of CANONICAL){const content=extractContent(source,slug);const m=meta[slug];if(!m)throw new Error(`[canonical blog] metadata missing: ${slug}`);const a={slug,title:m.title,description:m.description,date:'2026',readTime:'Guide pratique',content};const dir=path.join(blogRoot,slug);if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),htmlFor(a),'utf8');}
console.log(`[canonical blog] rebuilt ${CANONICAL.length} canonical article pages with two topic-matched photographs plus local explanatory artwork`);
