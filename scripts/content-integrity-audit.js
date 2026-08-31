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
  'urgence-plomberie-casablanca': ['plomberie','plombier','fuite','eau','Casablanca']
};

function decode(s){return s.replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&nbsp;/gi,' ');}
function text(html){return decode(html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim().toLowerCase();}
function paragraphs(html){
  const article=(html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)||[,''])[1];
  return [...article.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>decode(m[1].replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().toLowerCase()).filter(p=>p.length>=80);
}
function h1(html){return decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[,''])[1]).replace(/<[^>]+>/g,'').trim().toLowerCase();}
function desc(html){return decode((html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)||[,''])[1]).toLowerCase();}

if(!fs.existsSync(blogRoot)) throw new Error('[integrity] public/blog missing');
const failures=[];
for(const [slug,tokens] of Object.entries(rules)){
  const file=path.join(blogRoot,slug,'index.html');
  if(!fs.existsSync(file)){failures.push(`${slug}: missing canonical page`);continue;}
  const html=fs.readFileSync(file,'utf8');
  const corpus=`${h1(html)} ${desc(html)} ${text(html)}`;
  const hits=tokens.filter(t=>corpus.includes(t.toLowerCase())).length;
  if(hits<2) failures.push(`${slug}: topic mismatch (${hits}/${tokens.length} topic markers)`);
  const ps=paragraphs(html); const counts=new Map(); for(const p of ps) counts.set(p,(counts.get(p)||0)+1);
  for(const [p,n] of counts) if(n>=2) failures.push(`${slug}: repeated paragraph x${n}: ${p.slice(0,120)}`);
  if((html.match(/<h1\b/gi)||[]).length!==1) failures.push(`${slug}: expected exactly one H1`);
  if(!/<link\s+rel=["']canonical["']/i.test(html)) failures.push(`${slug}: missing canonical`);
}

if(failures.length){console.error('[integrity] BLOCKED:\n'+failures.join('\n'));process.exit(1);}
console.log(`[integrity] PASS: ${Object.keys(rules).length} canonical articles match topic markers and contain no repeated long paragraphs`);
