const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'App.js');
if (!fs.existsSync(file)) throw new Error('[runtime a11y] App.js missing');
let source = fs.readFileSync(file, 'utf8');
let changed = 0;

const replacements = [
  ['<button className="chat-close-btn" onClick={onClose}>✕</button>', '<button className="chat-close-btn" aria-label="Fermer la messagerie" onClick={onClose}>✕</button>'],
  ['<button className="profile-back" onClick={onClose}>←</button>', '<button className="profile-back" aria-label="Fermer le profil" onClick={onClose}>←</button>'],
  ['<span className="chat-status">', '<span className="chat-status" aria-live="polite">'],
  ['<button key={k}\n              className={`sort-btn${sort===k?" active":""}`}', '<button key={k}\n              aria-label={k==="rating"?"Trier par note":k==="price"?"Trier par prix":"Trier par distance"}\n              className={`sort-btn${sort===k?" active":""}`}'],
  ['className={`locate-btn${locating?" spin":""}${userLoc?" located":""}`}\n                onClick={handleLocate} title="Me localiser"', 'className={`locate-btn${locating?" spin":""}${userLoc?" located":""}`}\n                aria-label={lang==="fr"?"Me localiser":"تحديد موقعي"}\n                onClick={handleLocate} title="Me localiser"'],
  ['<a href={"tel:" + worker.phone} className="chat-call-btn" title="Appeler">', '<a href={"tel:" + worker.phone} className="chat-call-btn" aria-label={`Appeler ${worker.name}`} title="Appeler">'],
  ['target="_blank" rel="noreferrer" className="chat-wa-btn" title="WhatsApp"', 'target="_blank" rel="noopener noreferrer" className="chat-wa-btn" aria-label={`Contacter ${worker.name} sur WhatsApp`} title="WhatsApp"'],
];

for (const [from, to] of replacements) {
  const before = source;
  source = source.split(from).join(to);
  if (source !== before) changed += 1;
}

fs.writeFileSync(file, source, 'utf8');

const failures = [];
const required = [
  ['chat close label', /className="chat-close-btn"[^>]*aria-label=/],
  ['profile back label', /className="profile-back"[^>]*aria-label=/],
  ['chat live status', /className="chat-status"[^>]*aria-live="polite"/],
  ['map button label', /className="sort-btn map-toggle-btn"[^>]*aria-label="Ouvrir la carte"/],
  ['favourite label', /className=\{`btn-fav[^>]*aria-label=/],
  ['worker call label', /className="btn-call"[^>]*aria-label=/],
  ['worker chat label', /className="btn-chat-icon"[^>]*aria-label=/],
];
for (const [label, re] of required) if (!re.test(source)) failures.push(`${label} missing`);

for (const cls of ['modal-portfolio-img', 'portfolio-thumb', 'profile-photo']) {
  const re = new RegExp(`<img[^>]*className=["']${cls}["'][^>]*>`, 'g');
  const tags = source.match(re) || [];
  for (const tag of tags) if (!/\balt=\{?[^>]*Réalisation/i.test(tag)) failures.push(`${cls}: non-descriptive alt remains`);
}

const externalTargets = source.match(/<a\b[^>]*target=["']_blank["'][^>]*>/g) || [];
for (const tag of externalTargets) {
  if (!/rel=["'][^"']*(?:noopener|noreferrer)[^"']*["']/i.test(tag)) failures.push(`target=_blank link lacks noopener/noreferrer: ${tag.slice(0,120)}`);
}

if (failures.length) throw new Error(`[runtime a11y] BLOCKED (${failures.length}):\n${failures.join('\n')}`);
console.log(`[runtime a11y] PASS: ${changed} accessibility patch rule(s) applied; key icon controls, chat status, portfolio alts and external links are labelled safely`);
