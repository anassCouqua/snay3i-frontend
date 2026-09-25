const fs=require('fs');
const path=require('path');
const {INDEXABLE_BLOG_SLUGS,INDEXABLE_SERVICE_CITY_ROUTES,CORE_ROUTES}=require('./site-curation-config');
const root=path.join(__dirname,'..');
const pub=path.join(root,'public');
const fileFor=r=>r==='/'?path.join(pub,'index.html'):path.join(pub,r.slice(1),'index.html');
const adsTxt=fs.readFileSync(path.join(pub,'ads.txt'),'utf8');
const m=adsTxt.match(/google\.com,\s*(pub-\d+),\s*DIRECT,\s*f08c47fec0942fa0/i);
if(!m) throw new Error('[adsense preflight] ads.txt missing canonical Google DIRECT line');
const pubId=m[1];
const ca='ca-'+pubId;
const failures=[];
const hasServingCode=h=>/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(h)||/<ins\b[^>]*class=["'][^"']*adsbygoogle/i.test(h);
const hasVerification=h=>/<meta\s+name=["']google-adsense-account["'][^>]*content=["']ca-pub-\d+["']/i.test(h);
const ids=h=>[...h.matchAll(/ca-pub-\d+/g)].map(x=>x[0]);
const checkId=(route,h)=>{
  const found=[...new Set(ids(h))];
  if(found.some(x=>x!==ca)) failures.push(route+': unexpected AdSense account '+found.join(', '));
};
const home=fs.readFileSync(fileFor('/'),'utf8');
if(!hasVerification(home)) failures.push('/: AdSense ownership meta tag missing');
if(hasServingCode(home)) failures.push('/: homepage must stay ad-free because it contains interactive directory, chat and signup flows');
checkId('/',home);
for(const slug of INDEXABLE_BLOG_SLUGS){
  const route='/blog/'+slug,h=fs.readFileSync(fileFor(route),'utf8');
  if(!hasServingCode(h)) failures.push(route+': AdSense serving code missing on monetizable editorial page');
  checkId(route,h);
}
for(const route of [...CORE_ROUTES.filter(r=>r!=='/'),...INDEXABLE_SERVICE_CITY_ROUTES]){
  const h=fs.readFileSync(fileFor(route),'utf8');
  if(hasServingCode(h)||hasVerification(h)) failures.push(route+': ad/verification tags must not appear on trust/tool/directory page');
  checkId(route,h);
}
const privacy=fs.readFileSync(fileFor('/privacy'),'utf8');
if(hasServingCode(privacy)||hasVerification(privacy)) failures.push('/privacy: privacy-policy URL must stay free of AdSense tags');
for(const route of [...CORE_ROUTES,...INDEXABLE_SERVICE_CITY_ROUTES]){
  const h=fs.readFileSync(fileFor(route),'utf8');
  if(!/<meta\s+name=["']referrer["'][^>]*content=["']strict-origin-when-cross-origin["']/i.test(h)) failures.push(route+': consent-compatible referrer policy missing');
}
if(!adsTxt.includes(pubId)) failures.push('ads.txt publisher ID mismatch');
if(failures.length) throw new Error('[adsense preflight] BLOCKED ('+failures.length+'):\n'+failures.join('\n'));
console.log('[adsense preflight] PASS: '+pubId+' matches ads.txt/site verification; tools/trust/directory pages are ad-free; ads remain limited to '+INDEXABLE_BLOG_SLUGS.length+' canonical editorial guides; CMP referrer policy present');
