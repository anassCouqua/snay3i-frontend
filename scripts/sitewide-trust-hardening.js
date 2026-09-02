const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function patchFile(rel, replacements) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`[trust hardening] missing ${rel}`);
  let source = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of replacements) {
    const before = source;
    source = typeof from === 'string' ? source.split(from).join(to) : source.replace(from, to);
    if (source !== before) changed += 1;
  }
  fs.writeFileSync(file, source, 'utf8');
  console.log(`[trust hardening] ${rel}: ${changed} replacement rule(s) applied`);
  return source;
}

const landing = patchFile('src/LandingPage.js', [
  ["const title = `${svc.label} ${city} — Trouvez un ${svc.pro} pas cher | Snay3i.ma`;", "const title = `${svc.label} à ${city} — profils et contact | Snay3i.ma`;"],
  ['"@type":"Service",', '"@type":"CollectionPage",'],
  ['"provider":{"@type":"Organization","name":"Snay3i.ma","url":"https://snay3i.ma"},\n        "areaServed":{"@type":"City","name":city,"addressCountry":"MA"},\n        "serviceType":svc.label', '"isPartOf":{"@type":"WebSite","name":"Snay3i.ma","url":"https://snay3i.ma"},\n        "about":{"@type":"Thing","name":svc.label},\n        "spatialCoverage":{"@type":"City","name":city,"addressCountry":"MA"}'],
  ['Contactez nos ${svc.proPlural} à ${city} pour un devis gratuit sans engagement.', 'Contactez les ${svc.proPlural} proposés à ${city} pour demander un devis et confirmer les conditions.'],
  ['Cliquez sur le profil du ${svc.pro} sur Snay3i.ma puis appelez directement ou envoyez un WhatsApp. Aucun intermédiaire.', 'Cliquez sur le profil du ${svc.pro} sur Snay3i.ma puis utilisez les coordonnées affichées pour confirmer directement le besoin et les conditions.'],
  ['{svc.desc} — Trouvez votre expert maintenant', '{svc.desc} — Consultez les profils disponibles'],
  ['{svc.ar} • {city} • 🇲🇦 Gratuit & sans intermédiaire', '{svc.ar} • {city} • 🇲🇦 Profils et contact direct'],
  ["{n:'100%', l:'Gratuit'},\n          {n:'⭐', l:'Vérifiés'},\n          {n:'Direct', l:'Sans intermédiaire'},", "{n:'Infos', l:'Profils disponibles'},\n          {n:'Direct', l:'Contact professionnel'},\n          {n:'Devis', l:'Conditions à confirmer'},"],
  ['{svc.emoji} {cap(svc.proPlural)} disponibles à {city}', '{svc.emoji} {cap(svc.proPlural)} proposés à {city}'],
  ["['✅','Gratuit et sans commission','Aucun frais caché, aucune commission. Contactez directement l\\'artisan.'],", "['🔎','Recherche structurée','Consultez les profils proposés pour ce métier et cette ville.'],"],
  ["['⭐','Professionnels référencés et notés','Les informations disponibles sur chaque profil peuvent vous aider à comparer les professionnels avant de les contacter.'],", "['⭐','Informations de profil','Comparez les informations, avis et réalisations lorsqu’ils sont disponibles.'],"],
  ["['⚡','Contact direct','Nos '+svc.proPlural+' à '+city+' sont dont la disponibilité dépend du professionnel et du type d’intervention.'],", "['📞','Contact à confirmer','La disponibilité, le prix et les conditions dépendent de chaque professionnel.'],"],
  ["['🇲🇦','Réseau marocain','Plus de 100 artisans dans plusieurs villes du Maroc. Bilingue français et arabe.'],", "['🇲🇦','Métiers et villes','Les profils disponibles varient selon le métier, la ville et les données publiées.'],"],
  ['Snay3i.ma est la plateforme marocaine de référence pour trouver un {svc.pro} qualifié à {city}.\n            Que vous ayez besoin de {svc.desc.toLowerCase()}, nos professionnels à {city} sont disponibles rapidement.\n            Tous nos {svc.proPlural} sont vérifiés, notés par leurs clients, et contactables directement par téléphone ou WhatsApp.\n            La mise en relation et les conditions éventuelles doivent être vérifiées sur la plateforme et avec le professionnel.', 'Snay3i.ma aide à rechercher un {svc.pro} à {city} et à consulter les informations publiées sur les profils proposés.\n            Pour {svc.desc.toLowerCase()}, décrivez précisément votre besoin et comparez les éléments disponibles avant de contacter un professionnel.\n            Les avis, badges, coordonnées et autres informations varient selon chaque profil et ne constituent pas une garantie de résultat.\n            Confirmez directement le prix, la disponibilité, le déplacement et les conditions avant toute prestation.'],
  ['Les tarifs varient selon l\'intervention et le professionnel. Demandez un devis gratuit directement sur Snay3i.ma.', 'Les tarifs varient selon l\'intervention et le professionnel. Demandez un devis et confirmez ce qu’il comprend avant de vous engager.'],
  ['Consultez les avis clients et les notes des artisans sur Snay3i.ma avant d\'appeler.', 'Consultez les informations, avis et réalisations lorsqu’ils sont disponibles, puis posez vos questions au professionnel avant de confirmer.'],
  ['Cliquez sur un profil puis appelez directement ou envoyez un WhatsApp. Aucun intermédiaire.', 'Cliquez sur un profil puis utilisez les coordonnées affichées pour contacter directement le professionnel.'],
  ['Autres artisans disponibles à {city}', 'Autres métiers à {city}'],
  ['Rejoignez professionnels référencés sur Snay3i.ma — gratuit et sans commission', 'Créez votre profil sur Snay3i.ma et présentez clairement vos services et votre zone d’intervention'],
  ['Créer mon profil gratuit →', 'Créer mon profil →'],
  ['← Retour à Snay3i.ma — Tous les artisans du Maroc 🇲🇦', '← Retour à Snay3i.ma — Rechercher des artisans au Maroc 🇲🇦'],
]);

const app = patchFile('src/App.js', [
  [/devis gratuit/gi, 'Demander un devis'],
  ['Contactez ce professionnel pour obtenir un devis sur place', 'Contactez ce professionnel pour demander un devis et confirmer les conditions'],
  ['Le réseau des artisans marocains', 'Annuaire d’artisans au Maroc'],
  [/<a href="#" onClick=\{\(e\)=>\{e\.preventDefault\(\);setLegalPage\("privacy"\);\}\}([^>]*)>Confidentialité<\/a>/g, '<a href="/privacy"$1>Confidentialité</a>'],
  [/<a href="#" onClick=\{\(e\)=>\{e\.preventDefault\(\);setLegalPage\("terms"\);\}\}([^>]*)>CGU<\/a>/g, '<a href="/terms"$1>CGU</a>'],
  [/\nconst LEGAL_CONTENT = \{[\s\S]*?\n\};\n\nfunction LegalModal\(\{page, onClose\}\)\{[\s\S]*?\n\}\n\nexport function RegisterPage/, '\nexport function RegisterPage'],
  [/\n\s*const \[legalPage,setLegalPage\]=useState\(null\);/g, ''],
  [/\n\s*\{legalPage&&<LegalModal page=\{legalPage\} onClose=\{\(\)=>setLegalPage\(null\)\}\/\>\}/g, ''],

  ['"✨ En train de répondre..."', '"✨ Assistant automatique en préparation..."'],
  ['`🟢 En ligne • ${catLabel(worker.service)} • ✨ IA`', '`🤖 Assistant automatique • ${catLabel(worker.service)}`'],
  ['`🟢 En ligne • ${catLabel(worker.service)}`', '`💬 Messagerie du profil • ${catLabel(worker.service)}`'],
  ['<div className="chat-welcome-bubble">\n                <strong>{worker.name}</strong>\n                <p>Bonjour ! Je suis {catLabel(worker.service)} a {worker.city}. Envoyez-moi votre demande et je vous repondrai rapidement.</p>\n              </div>', '<div className="chat-welcome-bubble">\n                <strong>Assistant Snay3i</strong>\n                <p>Ce chat peut utiliser une réponse automatisée pour le profil de {worker.name}. Pour une réponse directe du professionnel, utilisez Appeler ou WhatsApp.</p>\n              </div>'],
  ['let replyText = "Je vous répondrai très vite. Vous pouvez aussi m\'appeler directement.";', 'let replyText = "Réponse automatique indisponible pour le moment. Votre message a été enregistré ; vous pouvez aussi contacter directement le professionnel par téléphone ou WhatsApp.";'],
  ['replyText = aiData.text;\n            setAiActive(aiData.source === "ai");', 'replyText = aiData.source === "ai" ? `🤖 Réponse automatisée Snay3i : ${aiData.text}` : aiData.text;\n            setAiActive(aiData.source === "ai");'],

  ['zoomControl:false, attributionControl:false,', 'zoomControl:false, attributionControl:true,'],
  ['"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"', '"https://tile.openstreetmap.org/{z}/{x}/{y}.png"'],
  ['{subdomains:"abcd",maxZoom:19}', '{maxZoom:19,attribution:\'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>\'}'],
  ['.leaflet-control-attribution{display:none!important}', '.leaflet-control-attribution{font-size:9px!important;line-height:1.2!important}'],

  ['<img key={i} src={url} alt="" className="modal-portfolio-img"/>', '<img key={i} src={url} alt={`Réalisation de ${worker.name}`} className="modal-portfolio-img"/>'],
  ['<img key={i} src={url} alt="" className="portfolio-thumb"/>', '<img key={i} src={url} alt={`Réalisation de ${worker.name}`} className="portfolio-thumb"/>'],
  ['<img key={i} src={url} alt="" className="profile-photo"/>', '<img key={i} src={url} alt={`Réalisation de ${worker.name}`} className="profile-photo"/>'],
  ['<a className="btn-call" href={"tel:"+worker.phone} onClick={e=>e.stopPropagation()}>', '<a className="btn-call" aria-label={`Appeler ${worker.name}`} href={"tel:"+worker.phone} onClick={e=>e.stopPropagation()}>'],
  ['<button className="btn-chat-icon" onClick={e=>{e.stopPropagation();setChat(true);}}>', '<button className="btn-chat-icon" aria-label={`Envoyer un message à ${worker.name}`} onClick={e=>{e.stopPropagation();setChat(true);}}>'],
  ['<button className={`btn-fav${faved?" faved":""}`} onClick={toggleFav}>', '<button className={`btn-fav${faved?" faved":""}`} aria-label={faved?`Retirer ${worker.name} des favoris`:`Ajouter ${worker.name} aux favoris`} onClick={toggleFav}>'],
  ['<button className="sort-btn map-toggle-btn" onClick={()=>setShowMap(true)} title="Vue carte">', '<button className="sort-btn map-toggle-btn" aria-label="Ouvrir la carte" onClick={()=>setShowMap(true)} title="Vue carte">'],
  [/\n\s*<div className="modal-verified">\s*<span className="exp-pill">⏱ \{worker\.years_exp\} ans d'expérience<\/span>\s*<\/div>/g, ''],
  ['\n            <span className="modal-reviews">{worker.years_exp} ans d\'expérience déclarée</span>', ''],
  [/\n\s*<div className="card-rating-row">\s*<span className="card-reviews">\{worker\.years_exp\} ans d'expérience déclarée<\/span>\s*<\/div>/g, ''],
  ['\n                  <div style={{fontSize:11,color:"#7A7065"}}>{selectedWorker.years_exp} ans d\'expérience déclarée</div>', ''],
  [/\n\s*<div className="profile-rating-row">\s*<span className="profile-rating-text">\{worker\.years_exp\} ans d'expérience déclarée<\/span>\s*<\/div>/g, ''],
]);

const adsenseContent = patchFile('src/AdsenseContent.js', [
  ['dans l\'ensemble des villes marocaines.', 'dans les villes actuellement proposées sur la plateforme.'],
  ['le portail marocain dédié à la recherche rapide et transparente d\'artisans locaux', 'une plateforme marocaine dédiée à la recherche d\'artisans locaux'],
]);

const checks = [
  ['src/LandingPage.js', landing],
  ['src/App.js', app],
  ['src/AdsenseContent.js', adsenseContent],
];
const banned = [
  /plateforme marocaine de référence/i,
  /Tous nos .* vérifiés/i,
  /Plus de 100 artisans/i,
  /disponibles rapidement/i,
  /devis gratuit/i,
  /Gratuit\s*&\s*sans intermédiaire/i,
  /dans l'ensemble des villes marocaines/i,
  /Trouvez un .* pas cher \| Snay3i\.ma/i,
  />\s*✓?\s*Vérifié\b/i,
];
const failures = [];
for (const [rel, source] of checks) {
  for (const re of banned) {
    const match = source.match(re);
    if (match) failures.push(`${rel}: ${match[0]}`);
  }
}
for (const [rel, source] of [['src/LandingPage.js', landing], ['src/App.js', app]]) {
  const aggregateSignal = source.match(/(?:worker|w|selectedWorker)\.(?:rating|reviews)\b/);
  if (aggregateSignal) failures.push(`${rel}: unsupported aggregate profile signal remains (${aggregateSignal[0]})`);
}
if (/(?:worker|selectedWorker)\\.years_exp\\b/.test(app)) {
  failures.push('src/App.js: self-declared experience count remains visible on a public profile surface');
}
for (const staleLegal of [/LEGAL_CONTENT/, /function LegalModal/, /setLegalPage\(/]) {
  if (staleLegal.test(app)) failures.push(`src/App.js: duplicate legacy legal system remains (${staleLegal})`);
}
for (const staleUx of [
  /basemaps\.cartocdn\.com/,
  /attributionControl:false/,
  /leaflet-control-attribution\{display:none/i,
  /🟢 En ligne • .*✨ IA/,
  /Bonjour ! Je suis \{catLabel\(worker\.service\)\}/,
  /alt="" className="(?:modal-portfolio-img|portfolio-thumb|profile-photo)"/,
]) {
  if (staleUx.test(app)) failures.push(`src/App.js: stale/deceptive UX remains (${staleUx})`);
}
if (failures.length) throw new Error(`[trust hardening] BLOCKED:\n${failures.join('\n')}`);
console.log('[trust hardening] PASS: claims, legal routing, automated-chat disclosure, map attribution and key profile accessibility checks are clean');
