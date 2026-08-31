const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'blog-images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const guides = {
  'petites-reparations-bricoleur-maison-maroc': {
    kicker: 'BRICOLAGE', title: 'Une journée de petites réparations bien préparée',
    steps: ['Lister et photographier', 'Regrouper les tâches', 'Préparer les pièces', 'Tester chaque réparation']
  },
  'repeindre-maison-maroc-guide': {
    kicker: 'PEINTURE', title: 'La qualité commence avant la première couche',
    steps: ['Observer la lumière', 'Réparer le support', 'Protéger la pièce', 'Contrôler les finitions']
  },
  'rangement-sur-mesure-menuisier-maroc': {
    kicker: 'MENUISERIE', title: 'Un rangement sur mesure pensé pour vos gestes',
    steps: ['Inventorier les objets', 'Mesurer les contraintes', 'Dessiner l’intérieur', 'Valider matériaux et pose']
  },
  'nettoyage-profond-maison-guide': {
    kicker: 'MÉNAGE', title: 'Nettoyer toute la maison sans revenir en arrière',
    steps: ['Ranger avant de laver', 'Travailler du haut vers le bas', 'Adapter le produit au support', 'Finir par les sols']
  },
  'creer-beau-jardin-maroc': {
    kicker: 'JARDINAGE', title: 'Créer un jardin agréable de zéro',
    steps: ['Observer soleil et vent', 'Dessiner les usages', 'Préparer sol et arrosage', 'Planter puis entretenir']
  },
  'projet-soudure-ferronnerie-maroc': {
    kicker: 'FERRONNERIE', title: 'Un ouvrage métallique se décide avant l’atelier',
    steps: ['Définir la fonction', 'Confirmer les mesures', 'Choisir finition et mécanismes', 'Valider pose et entretien']
  }
};

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

for (const [slug, guide] of Object.entries(guides)) {
  const cards = guide.steps.map((step, i) => {
    const x = 90 + (i % 2) * 520;
    const y = 285 + Math.floor(i / 2) * 150;
    return `<g><rect x="${x}" y="${y}" width="470" height="112" rx="22" fill="#fff" fill-opacity="0.96"/><circle cx="${x + 55}" cy="${y + 56}" r="28" fill="#C4622D"/><text x="${x + 55}" y="${y + 65}" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">${i + 1}</text><text x="${x + 105}" y="${y + 64}" font-size="24" font-weight="700" fill="#0D1B2A">${esc(step)}</text></g>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc"><title id="title">${esc(guide.title)}</title><desc id="desc">Infographie Snay3i.ma en quatre étapes pour ${esc(guide.kicker.toLowerCase())}.</desc><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0D1B2A"/><stop offset="1" stop-color="#1B3A4B"/></linearGradient><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#fff" fill-opacity="0.05"/></pattern></defs><rect width="1200" height="675" fill="url(#bg)"/><rect width="1200" height="675" fill="url(#dots)"/><text x="90" y="82" font-family="Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#E9A66F">SNAY3I.MA · ${esc(guide.kicker)}</text><text x="90" y="145" font-family="Arial,sans-serif" font-size="42" font-weight="800" fill="#fff">${esc(guide.title)}</text><text x="90" y="195" font-family="Arial,sans-serif" font-size="22" fill="#D7E0E8">4 repères simples pour préparer le projet avant de commencer.</text>${cards}<text x="90" y="635" font-family="Arial,sans-serif" font-size="18" fill="#AFC0CD">Guide pratique · Snay3i.ma</text></svg>`;
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), svg, 'utf8');
}
console.log(`[category artwork] generated ${Object.keys(guides).length} topic-specific Snay3i guide visuals`);
