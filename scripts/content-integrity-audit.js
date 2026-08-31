const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const rules = {
  'trouver-bon-plombier-maroc': ['plombier','plomberie','fuite','canalisation'],
  'tarif-electricien-maroc-2026': ['electricien','électricien','électricité','disjoncteur','tableau'],
  'renovation-maison-maroc-guide': ['rénovation','renovation','maison','travaux'],
  'climatisation-maroc-installation': ['climatisation','climatiseur','entretien','installation'],
  'serrurier-urgence-maroc': ['serrurier','serrure','porte','clé'],
  'choisir-carreleur-maroc': ['carreleur','carrelage','zellige'],
  'macon-construction-maroc': ['maçon','macon','maçonnerie','construction','béton'],
  'urgence-plomberie-casablanca': ['plomberie','plombier','fuite','eau','casablanca']
};

function decode(s){return s.replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&nbsp;/gi,' ');}
function text(html){return decode(html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim().toLowerCase();}
function paragraphs(html){
  const article=(html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)||[,''])[1];
  return [...article.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>decode(m[1].replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().toLowerCase()).filter(p=>p.length>=80);
}
function countWords(html){
  const article=(html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)||[,''])[1];
  const clean=decode(article.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
  return (clean.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g)||[]).length;
}
function h1(html){return decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[,''])[1]).replace(/<[^>]+>/g,'').trim().toLowerCase();}
function meta(html,name){return decode((html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)`,'i'))||[,''])[1]);}
function images(html){
  const native=(html.match(/<img\b[^>]*>/gi)||[]).map(x=>({alt:(x.match(/\balt=["']([^"']+)/i)||[,''])[1],kind:'img'}));
  const safe=(html.match(/<(?:div|figure)\b[^>]*(?:data-snay3i-safe-photo|data-snay3i-inline-photo|data-snay3i-photo-upgrade|data-snay3i-article-cover|data-snay3i-blog-photo)=["']1["'][^>]*>/gi)||[]).map(x=>({alt:(x.match(/(?:aria-label|alt)=["']([^"']+)/i)||[,''])[1],kind:'safe'}));
  return native.concat(safe);
}

if(!fs.existsSync(blogRoot)) throw new Error('[integrity] public/blog missing');
const failures=[]; const rows=[];
for(const [slug,tokens] of Object.entries(rules)){
  const file=path.join(blogRoot,slug,'index.html');
  if(!fs.existsSync(file)){failures.push(`${slug}: missing canonical page`);continue;}
  const html=fs.readFileSync(file,'utf8');
  const corpus=`${h1(html)} ${meta(html,'description')} ${text(html)}`;
  const hits=tokens.filter(t=>corpus.includes(t.toLowerCase())).length;
  const wordCount=countWords(html);
  if(hits<2) failures.push(`${slug}: topic mismatch (${hits}/${tokens.length} topic markers)`);
  const ps=paragraphs(html); const counts=new Map(); for(const p of ps) counts.set(p,(counts.get(p)||0)+1);
  for(const [p,n] of counts) if(n>=2) failures.push(`${slug}: repeated paragraph x${n}: ${p.slice(0,120)}`);
  const title=meta(html,'title') || decode((html.match(/<title>([\s\S]*?)<\/title>/i)||[,''])[1]);
  const desc=meta(html,'description');
  if((html.match(/<h1\b/gi)||[]).length!==1) failures.push(`${slug}: expected exactly one H1`);
  if(!/<link\s+rel=["']canonical["']/i.test(html)) failures.push(`${slug}: missing canonical`);
  if(wordCount<800) failures.push(`${slug}: editorial depth below 800 words (${wordCount})`);
  if(title.length<35||title.length>70) failures.push(`${slug}: title length ${title.length}`);
  if(desc.length<90||desc.length>165) failures.push(`${slug}: description length ${desc.length}`);
  const imgs=images(html); if(imgs.length<2) failures.push(`${slug}: fewer than 2 article visual blocks (${imgs.length})`);
  const missingAlt=imgs.filter(i=>!i.alt||i.alt.length<8).length; if(missingAlt) failures.push(`${slug}: ${missingAlt} article visual blocks missing useful alt/ARIA text`);
  rows.push({slug,wordCount,titleLen:title.length,descLen:desc.length,visuals:imgs.length});
}

const allRows=Object.entries(rules).map(([slug])=>rows.find(r=>r.slug===slug)).filter(Boolean);
const total=allRows.reduce((s,r)=>s+r.wordCount,0); const avg=total/(allRows.length||1);
console.log('=== CANONICAL CONTENT RELEASE GATE ===');
for(const r of allRows) console.log(`${r.slug} | ${r.wordCount} words | title ${r.titleLen} | desc ${r.descLen} | visuals ${r.visuals}`);
console.log(`Total canonical words: ${total}`);
console.log(`Average canonical article length: ${avg.toFixed(0)} words`);
if(failures.length){console.error(`BLOCKED: ${failures.length} integrity failure(s)\n${failures.join('\n')}`);process.exit(1);}
console.log(`[integrity] PASS: ${allRows.length} canonical articles pass topic, duplication, depth, metadata and visual checks`);
