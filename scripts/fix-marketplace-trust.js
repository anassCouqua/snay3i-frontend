const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'App.js');
let source = fs.readFileSync(file, 'utf8');

const replacements = [
  ['<span className="avail">🟢 Disponible</span>', '<span className="avail">🟡 Disponibilité à confirmer</span>'],
  ['const [bg,tc]=avatarColor(worker.name);', 'const [bg,tc]=avatarColor(worker.name);'],
  ['rating: 5.0,', 'rating: 0,'],
  ['reviews: 0,', 'reviews: 0,'],
  ['<span className="card-reviews">{worker.reviews} avis • {worker.years_exp} ans exp.</span>', '<span className="card-reviews">{worker.reviews > 0 ? `${worker.reviews} avis` : "Aucun avis pour le moment"} • {worker.years_exp} ans exp.</span>'],
  ['<span className="modal-reviews">{worker.reviews} avis</span>', '<span className="modal-reviews">{worker.reviews > 0 ? `${worker.reviews} avis` : "Aucun avis pour le moment"}</span>'],
  ['Votre profil est en ligne. Les clients peuvent maintenant vous trouver et vous contacter.', 'Votre profil a été créé. Vérifiez les informations affichées et gardez-les à jour pour aider les clients à vous contacter.'],
  ['rating: 5.0,\n        reviews: 0,', 'rating: 0,\n        reviews: 0,'],
];

for (const [from, to] of replacements) source = source.split(from).join(to);
fs.writeFileSync(file, source);
console.log('Marketplace trust and initial-rating claims hardened.');
