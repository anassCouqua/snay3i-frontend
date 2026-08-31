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
const HERO_IMAGE_MAP = {
  'trouver-bon-plombier-maroc': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=82',
  'tarif-electricien-maroc-2026': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=82',
  'renovation-maison-maroc-guide': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=82',
  'climatisation-maroc-installation': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=82',
  'serrurier-urgence-maroc': 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=82',
  'choisir-carreleur-maroc': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=82',
  'macon-construction-maroc': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=82',
  'urgence-plomberie-casablanca': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=82'
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
function visual(slug,title,kind){
  const hero=kind==='hero';
  const heroSrc=HERO_IMAGE_MAP[slug];
  const inlineFile=path.join(blogImageRoot,`${slug}.svg`);
  if(!heroSrc)throw new Error(`[canonical blog] missing hero image: ${slug}`);
  if(!fs.existsSync(inlineFile))throw new Error(`[canonical blog] missing inline artwork: ${slug}`);
  const src=hero?heroSrc:`/blog-images/${slug}.svg`;
  const block=hero?'article-cover':'inline-photo';
  const label=hero?title:`Repères visuels — ${title}`;
  return `<figure data-snay3i-${block}="1" style="margin:${hero?'0 0 24px':'28px 0'};border-radius:20px;overflow:hidden;background:#0D1B2A;border:1px solid #E8E0D4"><img src="${src}" alt="${esc(label)}" ${hero?'fetchpriority="high"':'loading="lazy"'} width="${hero?'1600':'1200'}" height="${hero?'900':'675'}" style="display:block;width:100%;height:${hero?'280':'auto'};max-height:${hero?'280':'360'}px;object-fit:cover"><figcaption style="padding:10px 14px;font-size:12px;color:#6f6a64;background:#fff">${esc(label)}</figcaption></figure>`;
}
function htmlFor(a){const body=markdownToHtml(a.content);const hero=visual(a.slug,a.title,'hero');const inline=visual(a.slug,a.title,'inline');return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(a.title)}</title><meta name="description" content="${esc(a.description)}"><meta name="robots" content="index,follow"><meta name="google-adsense-account" content="ca-pub-7772621804003550"><link rel="canonical" href="https://snay3i.ma/blog/${a.slug}"><meta property="og:title" content="${esc(a.title)}"><meta property="og:description" content="${esc(a.description)}"><meta property="og:image" content="${HERO_IMAGE_MAP[a.slug]}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${HERO_IMAGE_MAP[a.slug]}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script><style>body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav{max-width:920px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:900px;margin:auto;padding:36px 16px}section{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:26px;margin:0 0 16px}h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:22px;color:#0d1b2a;margin-top:30px}h3{font-size:18px;color:#0d1b2a}.meta{color:#6f6a64;font-size:14px}.article p,.article li{font-size:17px}.article h2{margin-top:30px}figure{margin-left:0;margin-right:0}figcaption{line-height:1.5}@media(max-width:640px){main{padding:24px 14px}h1{font-size:28px}.article p,.article li{font-size:16px}section{padding:20px}nav{gap:10px;font-size:14px}}</style></head><body><header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header><main>${hero}<article class="article"><section><p class="meta">Guide Snay3i.ma${a.date?` • ${esc(a.date)}`:''}</p><h1>${esc(a.title)}</h1><p>${esc(a.description)}</p></section><section>${body}</section>${inline}</article><section><h2>À propos de ce guide</h2><p>Ce guide aide les particuliers à préparer une demande de service, comparer des professionnels et poser les bonnes questions. Les prix, disponibilités et conditions dépendent du professionnel, de la ville et du travail demandé.</p><p><a href="/blog">Voir les autres guides</a> · <a href="/contact">Nous contacter</a></p></section></main><footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer></body></html>`;}

const source=fs.readFileSync(sourceFile,'utf8');
if(!fs.existsSync(blogRoot))fs.mkdirSync(blogRoot,{recursive:true});
for(const slug of CANONICAL){const content=extractContent(source,slug);const m=meta[slug];if(!m)throw new Error(`[canonical blog] metadata missing: ${slug}`);const a={slug,title:m.title,description:m.description,date:'2026',readTime:'Guide pratique',content};const dir=path.join(blogRoot,slug);if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),htmlFor(a),'utf8');}
console.log(`[canonical blog] rebuilt ${CANONICAL.length} canonical article pages with distinct hero photography and local inline artwork`);