const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i;

function decode(s) {
  return s.replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&nbsp;/gi,' ');
}
function visibleText(html) {
  let s = html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  const article = s.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (article) s = article[1];
  s = s.replace(/<[^>]+>/g,' ');
  return decode(s).replace(/\s+/g,' ').trim();
}
function words(text) { return (text.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g) || []).length; }
function headingCount(html, tag) { return (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length; }
function internalLinks(html) { return (html.match(/<a[^>]+href=["']\/(?!\/)[^"']*["']/gi) || []).length; }
function images(html) { return [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]); }
function shingleSet(text, n=5) { const a=text.toLowerCase().match(/[a-zà-ÿ0-9]+/g)||[]; const set=new Set(); for(let i=0;i<=a.length-n;i++) set.add(a.slice(i,i+n).join(' ')); return set; }
function jaccard(a,b){if(!a.size&&!b.size)return 1; let inter=0; for(const x of a) if(b.has(x)) inter++; const union=a.size+b.size-inter; return union?inter/union:0;}

const dirs = fs.existsSync(blogRoot) ? fs.readdirSync(blogRoot,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name).sort() : [];
const rows=[];
for(const slug of dirs){
  const file=path.join(blogRoot,slug,'index.html'); if(!fs.existsSync(file)) continue;
  const html=fs.readFileSync(file,'utf8');
  const text=visibleText(html); const w=words(text); const imgs=images(html);
  const imageAltOk=imgs.filter(x=>/\balt=["'][^"']+/.test(x)).length;
  const title=(html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||'';
  const desc=(html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)||[])[1]||'';
  const canonical=(html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)/i)||[])[1]||'';
  rows.push({slug,words:w,h1:headingCount(html,'h1'),h2:headingCount(html,'h2'),paragraphs:headingCount(html,'p'),images:imgs.length,altOk:imageAltOk,links:internalLinks(html),titleLen:decode(title).length,descLen:decode(desc).length,canonical:!!canonical,indexable:!noindex.test(html),shingles:shingleSet(text)});
}

console.log('\n=== SNAY3I BLOG CONTENT MICROSCOPE ===');
console.log(`Article pages found: ${rows.length}`);
console.log('Note: Google AdSense does NOT publish a minimum word-count or minimum-article-count quota. The bands below are internal QA only.');
console.log('\nSlug | Words | H1 | H2 | P | Images | Alt | Links | Indexable | QA');
for(const r of rows){
  const qa=[]; if(r.words<500)qa.push('THIN<500'); else if(r.words<800)qa.push('SHORT<800'); if(r.h1!==1)qa.push('H1'); if(r.images>0&&r.altOk<r.images)qa.push('ALT'); if(!r.canonical)qa.push('CANON'); if(r.titleLen<30||r.titleLen>65)qa.push('TITLE'); if(r.descLen<70||r.descLen>165)qa.push('DESC');
  console.log(`${r.slug} | ${r.words} | ${r.h1} | ${r.h2} | ${r.paragraphs} | ${r.images} | ${r.altOk}/${r.images} | ${r.links} | ${r.indexable?'YES':'NO'} | ${qa.join(',')||'PASS'}`);
}

const indexable=rows.filter(r=>r.indexable); const avg=rows.reduce((s,r)=>s+r.words,0)/(rows.length||1); const idxAvg=indexable.reduce((s,r)=>s+r.words,0)/(indexable.length||1);
console.log(`\nTotal words across ${rows.length} article pages: ${rows.reduce((s,r)=>s+r.words,0)}`);
console.log(`Average article length: ${avg.toFixed(0)} words`);
console.log(`Indexable article pages: ${indexable.length}`);
console.log(`Average indexable article length: ${idxAvg.toFixed(0)} words`);

console.log('\n=== HIGH-OVERLAP PAIRS (5-word shingle Jaccard >= 0.18) ===');
let pairs=0;
for(let i=0;i<rows.length;i++) for(let j=i+1;j<rows.length;j++){
  const score=jaccard(rows[i].shingles,rows[j].shingles);
  if(score>=0.18){ console.log(`${score.toFixed(3)} | ${rows[i].slug} <-> ${rows[j].slug}`); pairs++; }
}
if(!pairs) console.log('None');

console.log('\n=== INDEXABILITY SUMMARY ===');
console.log(`Indexable: ${indexable.length}/${rows.length}`);
console.log(`Noindex: ${rows.length-indexable.length}/${rows.length}`);
console.log('Internal QA thresholds are not Google requirements; they are used to catch risk before AdSense review.');
