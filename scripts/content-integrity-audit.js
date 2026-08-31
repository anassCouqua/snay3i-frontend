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
  'urgence-plomberie-casablanca': ['plomberie','plombier','fuite','eau','casablanca'],
  'petites-reparations-bricoleur-maison-maroc': ['bricoleur','réparation','fixation','maison','étagère'],
  'repeindre-maison-maroc-guide': ['peinture','peintre','mur','couleur','finition'],
  'rangement-sur-mesure-menuisier-maroc': ['menuisier','menuiserie','rangement','meuble','bois'],
  'nettoyage-profond-maison-guide': ['nettoyage','ménage','poussière','cuisine','salle de bain'],
  'creer-beau-jardin-maroc': ['jardin','jardinier','plantes','arrosage','sol'],
  'projet-soudure-ferronnerie-maroc': ['soudeur','soudure','ferronnerie','métal','portail']
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
function imageInfo(html){
  const imgs=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>({alt:(m[0].match(/\balt=["']([^"']+)/i)||[,''])[1],src:(m[0].match(/\bsrc=["']([^"']+)/i)||[,''])[1]}));
  const safeBlocks=[...html.matchAll(/<(?:figure|div)\b[^>]*(?:data-snay3i-safe-photo|data-snay3i-inline-photo|data-snay3i-photo-upgrade|data-snay3i-article-cover|data-snay3i-support-photo|data-snay3i-blog-photo)=["']1["'][^>]*>/gi)];
  return {visuals:Math.max(imgs.length,safeBlocks.length), imgs};
}

if(!fs.existsSync(blogRoot)) throw new Error('[integrity] public/blog missing');
const failures=[]; const rows=[]; const externalPhotoOwner=new Map();
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
  const title=decode((html.match(/<title>([\s\S]*?)<\/title>/i)||[,''])[1]);
  const desc=meta(html,'description');
  if((html.match(/<h1\b/gi)||[]).length!==1) failures.push(`${slug}: expected exactly one H1`);
  if(!/<link\s+rel=["']canonical["']/i.test(html)) failures.push(`${slug}: missing canonical`);
  if(wordCount<800) failures.push(`${slug}: editorial depth below 800 words (${wordCount})`);
  if(title.length<35||title.length>70) failures.push(`${slug}: title length ${title.length}`);
  if(desc.length<90||desc.length>165) failures.push(`${slug}: description length ${desc.length}`);
  const info=imageInfo(html);
  if(info.visuals<3 || info.imgs.length<3) failures.push(`${slug}: fewer than 3 native article visuals (${info.imgs.length})`);
  const missingAlt=info.imgs.filter(i=>!i.alt||i.alt.length<8).length;
  if(missingAlt) failures.push(`${slug}: ${missingAlt} native article images missing useful alt text`);
  const uniqueSources=new Set(info.imgs.map(i=>i.src).filter(Boolean));
  if(uniqueSources.size<3) failures.push(`${slug}: article visuals do not have 3 distinct image sources`);
  for(const img of info.imgs.filter(i=>/^https:\/\/(?:images\.)?unsplash\.com\//i.test(i.src))){
    if(externalPhotoOwner.has(img.src)) failures.push(`${slug}: external photo reused from ${externalPhotoOwner.get(img.src)}`);
    else externalPhotoOwner.set(img.src,slug);
  }
  rows.push({slug,wordCount,titleLen:title.length,descLen:desc.length,visuals:info.imgs.length,uniqueImages:uniqueSources.size});
}

const allRows=Object.entries(rules).map(([slug])=>rows.find(r=>r.slug===slug)).filter(Boolean);
const total=allRows.reduce((s,r)=>s+r.wordCount,0); const avg=total/(allRows.length||1);
console.log('=== CANONICAL CONTENT RELEASE GATE ===');
for(const r of allRows) console.log(`${r.slug} | ${r.wordCount} words | title ${r.titleLen} | desc ${r.descLen} | visuals ${r.visuals} | unique images ${r.uniqueImages}`);
console.log(`Total canonical words: ${total}`);
console.log(`Average canonical article length: ${avg.toFixed(0)} words`);
if(failures.length){console.error(`BLOCKED: ${failures.length} integrity failure(s)\n${failures.join('\n')}`);process.exit(1);}
console.log(`[integrity] PASS: ${allRows.length} canonical articles pass topic, duplication, depth, metadata and three-distinct-visual checks`);
