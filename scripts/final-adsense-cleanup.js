const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'public', 'seo');
const blogRoot = path.join(root, 'blog');

const INDEXABLE_BLOG = new Set([
  'trouver-bon-plombier-maroc',
  'tarif-electricien-maroc-2026',
  'renovation-maison-maroc-guide',
  'climatisation-maroc-installation',
  'serrurier-autour-de-moi-maroc',
  'choisir-carreleur-maroc',
  'urgence-plomberie-casablanca',
  'entretien-maison-maroc-checklist'
]);

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
};

if (fs.existsSync(blogRoot)) {
  for (const file of walk(blogRoot)) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(blogRoot, file).split(path.sep);
    const slug = rel[0];
    if (!slug || slug === 'index.html') continue;
    let html = fs.readFileSync(file, 'utf8');
    if (!INDEXABLE_BLOG.has(slug)) {
      if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
        html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow">');
      } else {
        html = html.replace('</head>', '<meta name="robots" content="noindex,follow">\n</head>');
      }
    }
    fs.writeFileSync(file, html, 'utf8');
  }
}

const trustReplacements = [
  [/plateforme marocaine qui vous connecte avec des plombiers vérifiés dans votre ville/gi, 'plateforme marocaine qui aide à rechercher des plombiers dans votre ville'],
  [/trouvez des électriciens vérifiés dans votre ville/gi, 'recherchez des électriciens dans votre ville'],
  [/électriciens vérifiés/gi, 'électriciens présents sur la plateforme'],
  [/electriciens vérifiés/gi, 'electriciens présents sur la plateforme'],
  [/tous les plombiers sont évalués par leurs clients réels/gi, 'les profils peuvent afficher les avis disponibles sur la plateforme'],
  [/tous nos artisans sont vérifiés et évalués par leurs clients/gi, 'consultez les informations disponibles sur les professionnels présents sur la plateforme'],
  [/artisans vérifiés/gi, 'professionnels présents sur la plateforme'],
  [/prix réels/gi, 'prix indicatifs'],
  [/prix réel/gi, 'prix indicatif'],
  [/qui est souvent aussi le plus disponible et le moins cher en frais de déplacement/gi, 'qui peut réduire les frais de déplacement selon sa disponibilité et sa localisation'],
  [/la géolocalisation vous montre l’électricien le plus proche/gi, 'la plateforme peut afficher des professionnels selon la ville et les informations disponibles']
];

for (const file of walk(root)) {
  if (!file.endsWith('.html')) continue;
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  for (const [pattern, replacement] of trustReplacements) html = html.replace(pattern, replacement);
  if (html !== original) fs.writeFileSync(file, html, 'utf8');
}

const electricianPath = path.join(blogRoot, 'tarif-electricien-maroc-2026', 'index.html');
if (fs.existsSync(electricianPath)) {
  let html = fs.readFileSync(electricianPath, 'utf8');
  const title = 'Tarif électricien Maroc 2026 — Guide complet des prix — Snay3i.ma';
  const description = 'Guide 2026 pour comprendre les tarifs d’un électricien au Maroc, comparer les devis, distinguer main-d’œuvre et matériel et éviter les mauvaises surprises.';
  const article = `
<article class="article">
<section><p class="meta">Guide Snay3i.ma • électricité</p><h1>${title}</h1><p>${description}</p></section>
<section><h2>Pourquoi le tarif varie selon l’intervention</h2><p>Le coût d’un électricien dépend de la nature du travail, du temps nécessaire, de l’accès au logement, des fournitures et du niveau d’urgence. Une petite réparation n’est pas comparable à une rénovation d’installation complète.</p><p>Un tarif présenté comme universel peut donc être trompeur. Le plus utile est de comprendre ce qui est inclus dans le devis et de comparer des prestations équivalentes.</p></section>
<section><h2>Les éléments à séparer dans un devis</h2><ul><li>Diagnostic ou déplacement éventuel.</li><li>Main-d’œuvre ou forfait d’intervention.</li><li>Pièces, câbles et autres fournitures.</li><li>Travaux supplémentaires éventuellement nécessaires après diagnostic.</li><li>Délais et conditions de paiement.</li></ul><p>Demander ces éléments séparément facilite la comparaison entre professionnels qui n’utilisent pas la même méthode de facturation.</p></section>
<section><h2>Comment comparer deux tarifs</h2><p>Décrivez exactement le même besoin aux professionnels : type de logement, panne ou travaux prévus, pièces concernées et contraintes d’accès. Comparez ensuite le périmètre du travail, les fournitures et les conditions plutôt que le montant seul.</p><p>Pour une rénovation importante, demandez un devis détaillé et un calendrier des étapes. Pour une panne, demandez ce qui a été diagnostiqué avant de valider un remplacement de matériel.</p></section>
<section><h2>Repères de prix indicatifs</h2><p>Les montants peuvent varier fortement selon la ville, l’urgence, l’accès et les fournitures. Utilisez les chiffres trouvés en ligne uniquement comme repères et demandez toujours une confirmation directe avant l’intervention.</p><ul><li>Petite réparation : souvent facturée comme une intervention courte ou un forfait de déplacement.</li><li>Recherche de panne : le temps de diagnostic peut représenter une part importante du prix.</li><li>Création ou modification de circuit : le matériel et la longueur des câbles peuvent changer sensiblement le coût.</li><li>Rénovation électrique : le prix dépend du nombre de pièces, du tableau, des protections et de l’état de l’installation existante.</li></ul></section>
<section><h2>Questions à poser avant de réserver</h2><ol><li>Le déplacement est-il inclus ?</li><li>Quelles fournitures sont comprises ?</li><li>Quel est le périmètre exact de l’intervention ?</li><li>Combien de temps l’intervention devrait-elle prendre ?</li><li>Dans quels cas le devis peut-il évoluer ?</li></ol></section>
<section><h2>Sécurité électrique</h2><p>Une panne ou une installation défectueuse peut présenter un risque réel. Évitez les manipulations improvisées lorsque vous n’êtes pas qualifié et demandez au professionnel quelles vérifications sont nécessaires avant toute réparation.</p></section>
<section><h2>Trouver un électricien au Maroc</h2><p>Sur Snay3i.ma, recherchez un professionnel par métier et par ville, consultez les informations réellement publiées sur son profil et contactez plusieurs professionnels lorsque la situation le permet pour comparer disponibilité et périmètre du travail.</p><p>Avant de confirmer une prestation, vérifiez directement le prix, le déplacement, les matériaux, le délai et les conditions de paiement.</p></section>
<section><h2>À retenir</h2><p>Il n’existe pas un tarif unique valable pour tous les travaux électriques au Maroc. Un devis utile explique le travail, le matériel et les conditions. Comparez des propositions équivalentes et adaptez votre décision à la situation réelle.</p></section>
</article>`;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}">`);
  html = html.replace(/<article class="article">[\s\S]*?<\/article>/i, article.trim());
  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i, `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","@id":"https://snay3i.ma/blog/tarif-electricien-maroc-2026#webpage","url":"https://snay3i.ma/blog/tarif-electricien-maroc-2026","name":"${title}","description":"${description}","inLanguage":"fr","isPartOf":{"@type":"WebSite","url":"https://snay3i.ma/","name":"Snay3i.ma"}}</script>`);
  fs.writeFileSync(electricianPath, html, 'utf8');
}

const sitemap = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  let xml = fs.readFileSync(sitemap, 'utf8');
  xml = xml.replace(/\s*<url>\s*<loc>https:\/\/snay3i\.ma\/blog\/([^<]+)<\/loc>[\s\S]*?<\/url>/g, (block, slug) => INDEXABLE_BLOG.has(slug) ? block : '');
  fs.writeFileSync(sitemap, xml, 'utf8');
}

console.log(`[AdSense cleanup] kept ${INDEXABLE_BLOG.size} flagship editorial URLs indexable; de-indexed weaker blog variants, normalized unsupported claims, and repaired electrician flagship content`);
