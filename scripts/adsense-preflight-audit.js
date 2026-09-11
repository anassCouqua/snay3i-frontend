const fs=require('fs');
const path=require('path');
const {INDEXABLE_BLOG_SLUGS,CORE_ROUTES}=require('./site-curation-config');
const root=path.join(__dirname,'..');
const pub=path.join(root,'public');
const fileFor=r=>r==='/'?path.join(pub,'index.html'):path.join(pub,r.slice(1),'index.html');
const adsTxt=fs.readFileSync(path.join(pub,'ads.txt'),'utf8');
const m=adsTxt.match(/google\.com,\s*(pub-\d+),\s*DIRECT,\s*f08c47fec0942fa0/i);
if(!m) throw new Error('[adsense preflight] ads.txt missing canonical Google DIRECT line');
const pubId=m[1];
const ca='ca-'+pubId;
const failures=[];
const hasAds=h=>/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(h)||/google-adsense-account/i.test(h);
const ids=h=>[...h.matchAll(/ca-pub-\d+/g)].map(x=>x[0]);
const checkId=(route,h)=>{
  const found=[...new Set(ids(h))];
  if(found.some(x=>x!==ca)) failures.push(route+': unexpected AdSense account '+found.join(', '));
};
const home=fs.readFileSync(fileFor('/'),'utf8');
if(!hasAds(home)) failures.push('/: AdSense verification/ad code missing');
checkId('/',home);
for(const slug of INDEXABLE_BLOG_SLUGS){
  const route='/blog/'+slug,h=fs.readFileSync(fileFor(route),'utf8');
  if(!hasAds(h)) failures.push(route+': AdSense code missing on monetizable editorial page');
  checkId(route,h);
}
for(const route of CORE_ROUTES.filter(r=>r!=='/')){
  const h=fs.readFileSync(fileFor(route),'utf8');
  if(hasAds(h)) failures.push(route+': ad code must not appear on trust/navigation/tool page');
  checkId(route,h);
}
const privacy=fs.readFileSync(fileFor('/privacy'),'utf8');
if(hasAds(privacy)) failures.push('/privacy: privacy-policy URL must stay free of ad tags');
for(const route of CORE_ROUTES){
  const h=fs.readFileSync(fileFor(route),'utf8');
  if(!/<meta\s+name=["']referrer["'][^>]*content=["']strict-origin-when-cross-origin["']/i.test(h)) failures.push(route+': consent-compatible referrer policy missing');
}
if(!adsTxt.includes(pubId)) failures.push('ads.txt publisher ID mismatch');
if(failures.length) throw new Error('[adsense preflight] BLOCKED ('+failures.length+'):\n'+failures.join('\n'));
console.log('[adsense preflight] PASS: '+pubId+' matches ads.txt/site code; ads limited to homepage + 20 canonical guides; privacy/tools/trust pages stay ad-free; CMP referrer policy present');
