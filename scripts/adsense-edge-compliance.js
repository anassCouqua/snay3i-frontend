const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const privacyPath = path.join(root, 'public/privacy/index.html');
const appPath = path.join(root, 'src/App.js');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`[edge compliance] missing ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

// 1) Make Google's required advertising-cookie disclosure explicit.
let privacy = read(privacyPath);
const adsenseIntro = '<p>Snay3i.ma utilise Google AdSense sur les pages où la publicité est activée. Google et ses partenaires peuvent utiliser des cookies, identifiants ou technologies similaires pour fournir, mesurer et, selon les choix applicables, personnaliser les annonces.</p>';
const explicitDisclosure = '<p>Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures d’un utilisateur sur Snay3i.ma ou sur d’autres sites. L’utilisation des cookies publicitaires par Google permet à Google et à ses partenaires de diffuser des annonces en fonction des visites des utilisateurs sur Snay3i.ma et/ou d’autres sites sur Internet.</p>\n<p>Des tiers peuvent également placer ou lire des cookies dans le navigateur, ou utiliser des balises web, des adresses IP ou d’autres identifiants à la suite de la diffusion publicitaire. Les utilisateurs peuvent gérer ou désactiver la personnalisation des annonces dans <a href="https://adssettings.google.com/" rel="noopener noreferrer">les paramètres des annonces Google</a>.</p>';

if (!privacy.includes('visites antérieures d’un utilisateur')) {
  if (!privacy.includes(adsenseIntro)) {
    throw new Error('[edge compliance] Privacy AdSense section changed; explicit cookie disclosure was not inserted');
  }
  privacy = privacy.replace(adsenseIntro, `${adsenseIntro}\n${explicitDisclosure}`);
  fs.writeFileSync(privacyPath, privacy, 'utf8');
}

// 2) Turn the interactive zero-result state into a useful recovery state.
let app = read(appPath);
const oldEmpty = `<div className="empty">
            <div style={{fontSize:52,marginBottom:12}}>🔍</div>
            <p className="empty-title">{lang==="fr"?"Aucun snay3i trouvé":"لم يتم العثور على معلم"}</p>
            <p className="empty-sub">{lang==="fr"?"Essayez une autre catégorie ou ville":"جرّب فئة أو مدينة أخرى"}</p>
          </div>`;

const newEmpty = `<div className="empty">
            <div style={{fontSize:52,marginBottom:12}}>🔍</div>
            <p className="empty-title">{lang==="fr"?"Aucun snay3i trouvé pour cette recherche":"لم نعثر على صنايعي لهذه المعايير"}</p>
            <p className="empty-sub">{lang==="fr"?"La disponibilité des profils varie selon le métier, la ville et les informations actuellement publiées.":"تختلف الملفات المتاحة حسب المهنة والمدينة والمعلومات المنشورة حالياً."}</p>
            <div className="empty-help" style={{maxWidth:620,margin:"16px auto 0",padding:"16px 18px",background:"#fff",border:"1px solid var(--border)",borderRadius:14,lineHeight:1.6}}>
              <p style={{margin:"0 0 10px",fontSize:14,color:"var(--muted)"}}>{lang==="fr"?"Essayez d’élargir la ville ou le métier, puis comparez les profils disponibles. Vous pouvez aussi consulter nos guides pour préparer votre demande et les questions à poser avant de choisir un professionnel.":"جرّب توسيع المدينة أو المهنة، ثم قارن الملفات المتاحة. يمكنك أيضاً قراءة أدلتنا لتحضير طلبك والأسئلة التي ينبغي طرحها قبل اختيار المهني."}</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="/blog" style={{color:"var(--terra)",fontWeight:700,textDecoration:"none"}}>{lang==="fr"?"Consulter les guides":"تصفح الأدلة"}</a>
                <a href="/contact" style={{color:"var(--terra)",fontWeight:700,textDecoration:"none"}}>{lang==="fr"?"Nous contacter":"اتصل بنا"}</a>
              </div>
            </div>
          </div>`;

if (!app.includes('className="empty-help"')) {
  if (!app.includes(oldEmpty)) {
    throw new Error('[edge compliance] App empty-state template changed; helpful fallback was not inserted');
  }
  app = app.replace(oldEmpty, newEmpty);
}

// 3) Keep trust/legal links visible inside the dynamic profile experience too.
const chatMount = '        {showChat && <ChatWindow worker={worker} onClose={()=>setShowChat(false)}/>}';
const profileLegal = `        <div className="profile-legal-links" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",padding:"4px 18px 22px",fontSize:12}}>
          <a href="/privacy" style={{color:"var(--muted)",textDecoration:"none"}}>Confidentialité</a>
          <a href="/terms" style={{color:"var(--muted)",textDecoration:"none"}}>CGU</a>
          <a href="/contact" style={{color:"var(--muted)",textDecoration:"none"}}>Contact</a>
        </div>`;

if (!app.includes('className="profile-legal-links"')) {
  if (!app.includes(chatMount)) {
    throw new Error('[edge compliance] Profile chat mount changed; legal links were not inserted');
  }
  app = app.replace(chatMount, `${profileLegal}\n${chatMount}`);
}
fs.writeFileSync(appPath, app, 'utf8');

// Release assertions: fail the build rather than silently regress.
privacy = read(privacyPath);
app = read(appPath);
const failures = [];
if (!/fournisseurs tiers, y compris Google[\s\S]*visites antérieures/i.test(privacy)) failures.push('Privacy missing Google/previous-visits cookie disclosure');
if (!/balises web[\s\S]*adresses IP/i.test(privacy)) failures.push('Privacy missing web-beacon/IP ad-serving disclosure');
if (!/adssettings\.google\.com/i.test(privacy)) failures.push('Privacy missing Google Ads Settings opt-out link');
if (!/className="empty-help"[\s\S]*href="\/blog"[\s\S]*href="\/contact"/.test(app)) failures.push('Interactive empty state is not helpful/actionable');
if (!/className="profile-legal-links"[\s\S]*href="\/privacy"[\s\S]*href="\/terms"[\s\S]*href="\/contact"/.test(app)) failures.push('Dynamic profile is missing persistent trust links');
if (!/<a href="\/privacy"[^>]*>Confidentialité<\/a>/.test(app) || !/<a href="\/terms"[^>]*>CGU<\/a>/.test(app) || !/<a href="\/contact"[^>]*>Contact<\/a>/.test(app)) failures.push('Main app footer is missing canonical trust links');

if (failures.length) throw new Error(`[edge compliance] BLOCKED:\n${failures.join('\n')}`);
console.log('[edge compliance] PASS: explicit Google cookie disclosure, useful empty state and persistent legal/trust links are present');
