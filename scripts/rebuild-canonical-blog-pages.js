const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceFile = path.join(root, 'src', 'Blog.js');
const contentFile = path.join(root, 'content', 'canonical-guide-content.json');
const blogRoot = path.join(root, 'public', 'blog');

const CANONICAL = Object.keys(JSON.parse(fs.readFileSync(contentFile, 'utf8')));

function esc(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function inlineMd(value){return value.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');}
function markdownToHtml(markdown){
  const lines=markdown.replace(/\r/g,'').split('\n'); const out=[]; let p=[]; let list=null;
  const flush=()=>{if(!p.length)return;out.push(`<p>${inlineMd(esc(p.join(' ').trim()))}</p>`);p=[];};
  const close=()=>{if(!list)return;out.push(`</${list}>`);list=null;};
  for(const raw of lines){const line=raw.trim(); if(!line){flush();close();continue;} const h=line.match(/^##\s+(.+)$/); if(h){flush();close();out.push(`<h2>${inlineMd(esc(h[1]))}</h2>`);continue;} const ol=line.match(/^\d+\.\s+(.+)$/); if(ol){flush();if(list!=='ol'){close();out.push('<ol>');list='ol';}out.push(`<li>${inlineMd(esc(ol[1]))}</li>`);continue;} const ul=line.match(/^[-*]\s+(.+)$/); if(ul){flush();if(list!=='ul'){close();out.push('<ul>');list='ul';}out.push(`<li>${inlineMd(esc(ul[1]))}</li>`);continue;} close();p.push(line);} flush();close(); return out.join('\n');
}
function field(block,name){const m=block.match(new RegExp(`${name}:\\s*(['"])([\\s\\S]*?)\\1`,'m'));return m?m[2]:'';}
function extract(source,slug){
  const marker=`slug: '${slug}'`; const start=source.indexOf(marker); if(start<0)throw new Error(`[canonical blog] source article not found: ${slug}`);
  const cm=source.indexOf('content: `',start); if(cm<0)throw new Error(`[canonical blog] content marker not found: ${slug}`);
  const cs=cm+'content: `'.length; const ce=source.indexOf('`\n  }',cs); if(ce<0)throw new Error(`[canonical blog] content terminator not found: ${slug}`);
  const block=source.slice(start,ce+1); const title=field(block,'title'); const description=field(block,'description'); const date=field(block,'date'); const readTime=field(block,'readTime'); const content=source.slice(cs,ce).trim();
  if(!title||!description||!content)throw new Error(`[canonical blog] incomplete article: ${slug}`);
  return {slug,title,description,date,readTime,content};
}
function htmlFor(a){const body=markdownToHtml(a.content);return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(a.title)} — Snay3i.ma</title><meta name="description" content="${esc(a.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="https://snay3i.ma/blog/${a.slug}"><meta name="twitter:card" content="summary_large_image"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script><style>body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.7}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav{max-width:920px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:900px;margin:auto;padding:36px 16px}section{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:26px;margin:0 0 16px}h1{font-size:34px;line-height:1.2;margin:0 0 12px}h2{font-size:22px;color:#0d1b2a;margin-top:30px}.meta{color:#6f6a64;font-size:14px}.article p,.article li{font-size:17px}.article h2{margin-top:30px}ul,ol{padding-left:24px}@media(max-width:640px){main{padding:24px 14px}h1{font-size:28px}.article p,.article li{font-size:16px}section{padding:20px}nav{gap:10px;font-size:14px}}</style></head><body><header><nav><a href="/">Accueil</a><a href="/blog">Blog</a><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/privacy">Confidentialité</a><a href="/terms">CGU</a></nav></header><main><div data-snay3i-article-cover="1" role="img" aria-label="${esc(a.title)}" style="height:260px;margin:0 0 24px;border-radius:20px;background:linear-gradient(135deg,#0D1B2A,#1B263B);display:flex;align-items:flex-end;padding:22px;box-sizing:border-box;color:#fff"><strong style="background:rgba(13,27,42,.82);padding:8px 12px;border-radius:999px;font-size:14px">🇲🇦 Snay3i.ma</strong></div><article class="article"><section><p class="meta">Guide Snay3i.ma${a.date?` • ${esc(a.date)}`:''}${a.readTime?` • ${esc(a.readTime)}`:''}</p><h1>${esc(a.title)}</h1><p>${esc(a.description)}</p></section><section>${body}</section></article><section><h2>À propos de ce guide</h2><p>Ce guide est conçu pour aider les particuliers à mieux préparer une demande de service. Les prix, disponibilités et conditions dépendent du professionnel, de la ville et du travail demandé.</p><p><a href="/blog">Voir les autres guides</a> · <a href="/contact">Nous contacter</a></p></section></main><footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">Confidentialité</a> · <a href="/terms">CGU</a> · <a href="/contact">Contact</a></div></footer></body></html>`;}
if(!fs.existsSync(sourceFile))throw new Error('[canonical blog] Blog.js missing');
if(!fs.existsSync(contentFile))throw new Error('[canonical blog] content registry missing');
const source=fs.readFileSync(sourceFile,'utf8'); if(!fs.existsSync(blogRoot))fs.mkdirSync(blogRoot,{recursive:true});
for(const slug of CANONICAL){const a=extract(source,slug);const dir=path.join(blogRoot,slug);if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),htmlFor(a),'utf8');}
console.log(`[canonical blog] rebuilt ${CANONICAL.length} canonical article pages`);
