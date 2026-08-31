const fs = require('fs');
const path = require('path');

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
          <div style={{fontSize:12,fontWeight:800,color:'var(--terra)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Guides Snay3i.ma</div>
          <h2 style={{fontSize:22,lineHeight:1.3,color:'var(--ink)',margin:'0 0 8px'}}>Préparez vos travaux avant de contacter un artisan</h2>
          <p style={{fontSize:14,lineHeight:1.65,color:'var(--muted)',margin:'0 0 16px'}}>Consultez nos guides pratiques pour mieux décrire votre besoin, comparer un devis, comprendre les étapes d’une intervention et préparer les bonnes questions avant de choisir un professionnel.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10,marginBottom:14}}>
            <a href="/blog/trouver-bon-plombier-maroc" style={{padding:'12px 14px',borderRadius:12,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>🔧 Choisir un plombier</a>
            <a href="/blog/tarif-electricien-maroc-2026" style={{padding:'12px 14px',borderRadius:12,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>⚡ Préparer des travaux électriques</a>
            <a href="/blog/renovation-maison-maroc-guide" style={{padding:'12px 14px',borderRadius:12,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>🏠 Organiser une rénovation</a>
            <a href="/blog/urgence-plomberie-casablanca" style={{padding:'12px 14px',borderRadius:12,background:'var(--cream)',color:'var(--ink)',textDecoration:'none',fontWeight:700}}>🚰 Réagir à une urgence plomberie</a>
          </div>
          <a href="/blog" style={{display:'inline-block',color:'var(--terra)',fontWeight:800,textDecoration:'none'}}>Voir tous les guides pratiques →</a>
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

// Profiles are modal UI, not crawlable standalone publisher pages. Fail if a future
// sitemap starts exposing profile/worker URLs or retired service-city templates.
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (sitemapLocs.some((url) => /\/(?:profile|profiles|worker|workers)\//i.test(url))) {
  failures.push('sitemap exposes standalone artisan/profile URLs');
}
if (sitemapLocs.some((url) => /\/artisan\//i.test(url))) {
  failures.push('sitemap exposes service-city template URLs while curated local set is intentionally empty');
}
if (sitemapLocs.length !== 14) failures.push(`expected 14 curated sitemap URLs, found ${sitemapLocs.length}`);

// User-controlled filters are stateful UI today; they must not become crawlable URL
// permutations such as ?sort=, ?filter= or ?page= without a deliberate strategy.
const parameterHref = /href\s*=\s*(?:["'`])[^"'`]*\?(?:[^"'`]*&)?(?:sort|filter|page|category)=/i;
if (parameterHref.test(app)) failures.push('App.js contains crawlable filter/sort/page/category parameter links');
if (parameterHref.test(landing)) failures.push('LandingPage.js contains crawlable filter/sort/page/category parameter links');

// Every query-string variation of an indexable static route inherits a clean canonical
// because canonical URLs are query-free. Guard the source canonical itself as well.
const sourceCanonical = (index.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [null, ''])[1];
if (sourceCanonical !== 'https://snay3i.ma/') failures.push(`homepage canonical is not clean root (${sourceCanonical || 'missing'})`);
if (/[?#]/.test(sourceCanonical || '')) failures.push('homepage canonical contains a query or fragment');

// Service/city pages are retired regardless of whether API results exist. React must
// not flip a populated page back to index,follow after hydration.
if (/setMeta\(['"]robots['"],\s*['"]index,\s*follow['"]\s*\)/i.test(landing)) {
  failures.push('LandingPage.js contains runtime index,follow override');
}
if (/list\.length[\s\S]{0,140}['"]index,\s*follow['"]/i.test(landing)) {
  failures.push('LandingPage.js conditionally indexes populated local pages');
}

// Publisher/editorial surface must be obvious to both raw-HTML crawlers and people.
if (!/href=["']\/blog["']/.test(index)) failures.push('raw homepage fallback does not link to /blog');
const canonicalGuideLinks = [...app.matchAll(/href=["'](\/blog\/[^"']+)["']/g)].map((m) => m[1]);
if (new Set(canonicalGuideLinks).size < 4) failures.push('interactive homepage does not prominently expose at least four canonical editorial guides');
if (!/data-publisher-guides=["']1["']/.test(app)) failures.push('interactive homepage editorial guide module missing');

// Keep registration intentionally outside the index and preserve real 404 handling.
if (!/"src"\s*:\s*"\/rejoindre"[\s\S]{0,180}X-Robots-Tag["']?\s*:\s*["']noindex,\s*follow/i.test(vercel)) {
  failures.push('/rejoindre is not explicitly noindex at the edge');
}
if (!/"dest"\s*:\s*"\/404\.html"[\s\S]{0,80}"status"\s*:\s*404/i.test(vercel)) {
  failures.push('real 404 catchall missing from vercel.json');
}

if (failures.length) throw new Error(`[publisher surface] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[publisher surface] PASS: 14-route sitemap has no profile/service-template leaks; no crawlable filter permutations; runtime local pages stay noindex; editorial guide module ${inserted ? 'inserted' : 'present'}`);
