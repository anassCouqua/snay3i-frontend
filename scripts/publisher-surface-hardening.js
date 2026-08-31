const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS, INDEXABLE_SERVICE_CITY_ROUTES, CORE_ROUTES } = require('./site-curation-config');

const root = process.cwd();
const appFile = path.join(root, 'src', 'App.js');
const landingFile = path.join(root, 'src', 'LandingPage.js');
const sitemapFile = path.join(root, 'public', 'sitemap.xml');
const indexFile = path.join(root, 'public', 'index.html');
const vercelFile = path.join(root, 'vercel.json');

for (const file of [appFile, landingFile, sitemapFile, indexFile, vercelFile]) {
  if (!fs.existsSync(file)) throw new Error(`[publisher surface] missing ${path.relative(root, file)}`);
}

let app = fs.readFileSync(appFile, 'utf8');
const guideBlock = `
        <section data-publisher-guides="1" style={{background:'#fff',border:'1.5px solid var(--border)',borderRadius:18,padding:'22px 20px',margin:'28px 0'}}>
          <div style={{fontSize:12,fontWeight:800,color:'var(--terra)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Guides Snay3i.ma · دلائل صنايعي</div>
          <h2 style={{fontSize:22,lineHeight:1.3,color:'var(--ink)',margin:'0 0 8px'}}>Des guides pratiques en français et en darija</h2>
          <p style={{fontSize:14,lineHeight:1.65,color:'var(--muted)',margin:'0 0 16px'}}>Préparez votre projet, comprenez les étapes et posez les bonnes questions avant de choisir un professionnel. <span lang="ary" dir="rtl">دلائل عملية باش تخطط مزيان قبل ما تبدا الأشغال.</span></p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:10,marginBottom:14}}>
            <a href="/blog/renovation-maison-maroc-guide" lang="fr" style={{display:'flex',alignItems:'center',gap:12,minHeight:82,padding:8,borderRadius:14,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>
              <img src="https://images.unsplash.com/photo-1768321902097-1d85e7735c5f?auto=format&fit=crop&w=320&q=78" alt="Chantier de rénovation intérieure" loading="lazy" width="72" height="72" style={{width:72,height:72,flex:'0 0 72px',objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
              <span><span style={{display:'inline-block',fontSize:10,fontWeight:800,color:'var(--terra)',letterSpacing:'.06em',marginBottom:4}}>FR</span><span style={{display:'block',fontSize:14,lineHeight:1.35}}>Rénovation maison au Maroc : étapes et artisans</span></span>
            </a>
            <a href="/blog/cuisine-moderne-zero-maroc-darija" lang="ary" dir="rtl" style={{display:'flex',alignItems:'center',gap:12,minHeight:82,padding:8,borderRadius:14,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700,textAlign:'right'}}>
              <img src="https://unsplash.com/photos/Jl5BfxX089Q/download?force=true&w=320" alt="كوزينة مودرن بخزائن خشبية وجزيرة وسطية" loading="lazy" width="72" height="72" style={{width:72,height:72,flex:'0 0 72px',objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
              <span><span style={{display:'inline-block',fontSize:10,fontWeight:800,color:'var(--terra)',marginBottom:4}}>بالدارجة</span><span style={{display:'block',fontSize:14,lineHeight:1.55}}>كيفاش تخطط لكوزينة مودرن من الصفر</span></span>
            </a>
            <a href="/blog/creer-beau-jardin-maroc" lang="fr" style={{display:'flex',alignItems:'center',gap:12,minHeight:82,padding:8,borderRadius:14,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>
              <img src="https://images.unsplash.com/photo-1771502674766-8fcbab194e67?auto=format&fit=crop&w=320&q=78" alt="Jardiniers aménageant un espace paysager" loading="lazy" width="72" height="72" style={{width:72,height:72,flex:'0 0 72px',objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
              <span><span style={{display:'inline-block',fontSize:10,fontWeight:800,color:'var(--terra)',letterSpacing:'.06em',marginBottom:4}}>FR</span><span style={{display:'block',fontSize:14,lineHeight:1.35}}>Créer un beau jardin au Maroc</span></span>
            </a>
            <a href="/blog/hammam-beldi-maison-maroc-darija" lang="ary" dir="rtl" style={{display:'flex',alignItems:'center',gap:12,minHeight:82,padding:8,borderRadius:14,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700,textAlign:'right'}}>
              <img src="https://unsplash.com/photos/9qYFu1NzpS8/download?force=true&w=320" alt="فضاء بخار مودرن بسطوح حجرية وإضاءة هادئة" loading="lazy" width="72" height="72" style={{width:72,height:72,flex:'0 0 72px',objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
              <span><span style={{display:'inline-block',fontSize:10,fontWeight:800,color:'var(--terra)',marginBottom:4}}>بالدارجة</span><span style={{display:'block',fontSize:14,lineHeight:1.55}}>كيفاش تخطط لحمام بلدي فدارك</span></span>
            </a>
            <a href="/blog/rangement-sur-mesure-menuisier-maroc" lang="fr" style={{display:'flex',alignItems:'center',gap:12,minHeight:82,padding:8,borderRadius:14,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>
              <img src="https://unsplash.com/photos/VMMoVcgTnbA/download?force=true&w=320" alt="Menuisier travaillant le bois en atelier" loading="lazy" width="72" height="72" style={{width:72,height:72,flex:'0 0 72px',objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
              <span><span style={{display:'inline-block',fontSize:10,fontWeight:800,color:'var(--terra)',letterSpacing:'.06em',marginBottom:4}}>FR</span><span style={{display:'block',fontSize:14,lineHeight:1.35}}>Rangements sur mesure : préparer son projet</span></span>
            </a>
            <a href="/blog/villa-riad-piscine-jardin-maroc-darija" lang="ary" dir="rtl" style={{display:'flex',alignItems:'center',gap:12,minHeight:82,padding:8,borderRadius:14,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700,textAlign:'right'}}>
              <img src="https://unsplash.com/photos/TFhl8b-rRPg/download?force=true&w=320" alt="رياض مغربي بفناء ومسبح وهندسة تقليدية" loading="lazy" width="72" height="72" style={{width:72,height:72,flex:'0 0 72px',objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
              <span><span style={{display:'inline-block',fontSize:10,fontWeight:800,color:'var(--terra)',marginBottom:4}}>بالدارجة</span><span style={{display:'block',fontSize:14,lineHeight:1.55}}>فيلا بروح الرياض مع مسبح وجردة</span></span>
            </a>
          </div>
          <a href="/blog" style={{display:'inline-block',color:'var(--terra)',fontWeight:800,textDecoration:'none'}}>Voir tous les guides · شوف الدلائل كاملة →</a>
        </section>
`;

let inserted = false;
if (!/data-publisher-guides=["']1["']/.test(app)) {
  const marker = '        {/* CTA */}';
  if (!app.includes(marker)) throw new Error('[publisher surface] homepage CTA marker missing; cannot insert editorial guide block safely');
  app = app.replace(marker, `${guideBlock}\n${marker}`);
  fs.writeFileSync(appFile, app, 'utf8');
  inserted = true;
}

const landing = fs.readFileSync(landingFile, 'utf8');
const sitemap = fs.readFileSync(sitemapFile, 'utf8');
const index = fs.readFileSync(indexFile, 'utf8');
const vercel = fs.readFileSync(vercelFile, 'utf8');
const failures = [];

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (sitemapLocs.some((url) => /\/(?:profile|profiles|worker|workers)\//i.test(url))) failures.push('sitemap exposes standalone artisan/profile URLs');
if (sitemapLocs.some((url) => /\/artisan\//i.test(url))) failures.push('sitemap exposes service-city template URLs while curated local set is intentionally empty');
const expectedRoutes = CORE_ROUTES.length + INDEXABLE_BLOG_SLUGS.length + INDEXABLE_SERVICE_CITY_ROUTES.length;
if (sitemapLocs.length !== expectedRoutes) failures.push(`expected ${expectedRoutes} curated sitemap URLs, found ${sitemapLocs.length}`);

const parameterHref = /href\s*=\s*(?:["'`])[^"'`]*\?(?:[^"'`]*&)?(?:sort|filter|page|category)=/i;
if (parameterHref.test(app)) failures.push('App.js contains crawlable filter/sort/page/category parameter links');
if (parameterHref.test(landing)) failures.push('LandingPage.js contains crawlable filter/sort/page/category parameter links');

const sourceCanonical = (index.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [null, ''])[1];
if (sourceCanonical !== 'https://snay3i.ma/') failures.push(`homepage canonical is not clean root (${sourceCanonical || 'missing'})`);
if (/[?#]/.test(sourceCanonical || '')) failures.push('homepage canonical contains a query or fragment');

if (/setMeta\(['"]robots['"],\s*['"]index,\s*follow['"]\s*\)/i.test(landing)) failures.push('LandingPage.js contains runtime index,follow override');
if (/list\.length[\s\S]{0,140}['"]index,\s*follow['"]/i.test(landing)) failures.push('LandingPage.js conditionally indexes populated local pages');

if (!/href=["']\/blog["']/.test(index)) failures.push('raw homepage fallback does not link to /blog');
const canonicalGuideLinks = [...app.matchAll(/href=["'](\/blog\/[^"']+)["']/g)].map((m) => m[1]);
if (new Set(canonicalGuideLinks).size < 4) failures.push('interactive homepage does not prominently expose at least four canonical editorial guides');
if (!/data-publisher-guides=["']1["']/.test(app)) failures.push('interactive homepage editorial guide module missing');

if (!/"src"\s*:\s*"\/rejoindre"[\s\S]{0,180}X-Robots-Tag["']?\s*:\s*["']noindex,\s*follow/i.test(vercel)) failures.push('/rejoindre is not explicitly noindex at the edge');
if (!/"dest"\s*:\s*"\/404\.html"[\s\S]{0,80}"status"\s*:\s*404/i.test(vercel)) failures.push('real 404 catchall missing from vercel.json');

if (failures.length) throw new Error(`[publisher surface] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[publisher surface] PASS: ${expectedRoutes}-route sitemap has no profile/service-template leaks; no crawlable filter permutations; runtime local pages stay noindex; bilingual editorial guide module ${inserted ? 'inserted' : 'present'}`);
