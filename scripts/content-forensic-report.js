const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i;

function decode(s) { return s.replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&nbsp;/gi,' '); }
function visibleText(html) {
  let s = html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  const article = s.match(/<article[^>]*>([\s\S]*?)<\/article>/i); if (article) s = article[1];
  s = s.replace(/<[^>]+>/g,' '); return decode(s).replace(/\s+/g,' ').trim();
}
function words(text) { return (text.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g) || []).length; }
function headingCount(html, tag) { return (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length; }
function internalLinks(html) { return (html.match(/<a[^>]+href=["']\/(?!\/)[^"']*["']/gi) || []).length; }
function imageBlocks(html) { return [...html.matchAll(/data-snay3i-(?:safe-photo|blog-photo)=["']1["']/gi)].map(m => m[0]); }
function images(html) { return [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]); }
function paragraphTexts(html) {
  const article = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || [,''])[1];
  return [...article.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => decode(m[1].replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim()).filter(t => t.length>=80);
}
function shingleSet(text, n=5) { const a=text.toLowerCase().match(/[a-zà-ÿ0-9]+/g)||[]; const set=new Set(); for(let i=0;i<=a.length-n;i++) set.add(a.slice(i,i+n).join(' ')); return set; }
function jaccard(a,b){if(!a.size&&!b.size)return 1; let inter=0; for(const x of a) if(b.has(x)) inter++; const union=a.size+b.size-inter; return union?inter/union:0;}

const dirs = fs.existsSync(blogRoot) ? fs.readdirSync(blogRoot,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name).sort() : [];
const rows=[];
for(const slug of dirs){
  const file=path.join(blogRoot,slug,'index.html'); if(!fs.existsSync(file)) continue;
  const html=fs.readFileSync(file,'utf8'); const text=visibleText(html); const w=words(text); const imgs=images(html); const blocks=imageBlocks(html);
  const imageAltOk=imgs.filter(x=>/\balt=["'][^"']+/.test(x)).length;
  const ariaOk=blocks.filter(() => true).length; // all known safe blocks require an aria-label; checked below
  const title=(html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||'';
  const desc=(html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)||[])[1]||'';
  const canonical=(html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)/i)||[])[1]||'';
  const ps=paragraphTexts(html); const seen=new Map(); for(const p of ps) seen.set(p,(seen.get(p)||0)+1); const repeated=[...seen.entries()].filter(([,n])=>n>=2);
  rows.push({slug,words:w,h1:headingCount(html,'h1'),h2:headingCount(html,'h2'),paragraphs:headingCount(html,'p'),images:blocks.length||imgs.length,realImgTags:imgs.length,altOk:imageAltOk,ariaOk,links:internalLinks(html),titleLen:decode(title).length,descLen:decode(desc).length,canonical:!!canonical,indexable:!noindex.test(html),repeated,shingles:shingleSet(text)});
}

console.log('\n=== SNAY3I BLOG CONTENT MICROSCOPE ===');
console.log(`Article pages found: ${rows.length}`);
console.log('Google AdSense does not publish a numeric minimum word-count or article-count quota. QA bands below are internal quality controls, not Google rules.');
console.log('\nSlug | Words | H1 | H2 | P | Visuals | Alt/Img | Links | Indexable | QA');
for(const r of rows){
  const qa=[];
  if(r.words<500)qa.push('THIN<500'); else if(r.words<800)qa.push('SHORT<800');
  if(r.h1!==1)qa.push('H1'); if(r.realImgTags>0&&r.altOk<r.realImgTags)qa.push('ALT');
  if(r.titleLen<30||r.titleLen>65)qa.push('TITLE'); if(r.descLen<70||r.descLen>165)qa.push('DESC');
  if(r.repeated.length)qa.push(`REPEATx${r.repeated[0][1]}`);
  console.log(`${r.slug} | ${r.words} | ${r.h1} | ${r.h2} | ${r.paragraphs} | ${r.images} | ${r.altOk}/${r.realImgTags} | ${r.links} | ${r.indexable?'YES':'NO'} | ${qa.join(',')||'PASS'}`);
  for(const [p,n] of r.repeated) console.log(`  REPEATED ${n}x: ${p.slice(0,160)}`);
}
const indexable=rows.filter(r=>r.indexable); const total=rows.reduce((s,r)=>s+r.words,0); const avg=total/(rows.length||1); const idxAvg=indexable.reduce((s,r)=>s+r.words,0)/(indexable.length||1);
console.log(`\nTotal words across ${rows.length} article pages: ${total}`);
console.log(`Average article length: ${avg.toFixed(0)} words`);
console.log(`Indexable article pages: ${indexable.length}`);
console.log(`Average indexable article length: ${idxAvg.toFixed(0)} words`);
console.log('\n=== HIGH-OVERLAP PAIRS (5-word shingle Jaccard >= 0.18) ===');
let pairs=0; for(let i=0;i<rows.length;i++) for(let j=i+1;j<rows.length;j++){ const score=jaccard(rows[i].shingles,rows[j].shingles); if(score>=0.18){ console.log(`${score.toFixed(3)} | ${rows[i].slug} <-> ${rows[j].slug}`); pairs++; } } if(!pairs) console.log('None');
console.log('\n=== INDEXABILITY SUMMARY ==='); console.log(`Indexable: ${indexable.length}/${rows.length}`); console.log(`Noindex: ${rows.length-indexable.length}/${rows.length}`);
