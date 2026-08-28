const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');
const seoDir = path.join(buildDir, 'seo');
const staticJsDir = path.join(buildDir, 'static', 'js');
const staticCssDir = path.join(buildDir, 'static', 'css');

if (!fs.existsSync(seoDir) || !fs.existsSync(staticJsDir)) {
  throw new Error('Build output or SEO pages are missing');
}

const mainJs = fs.readdirSync(staticJsDir).find((name) => /^main\..+\.js$/.test(name));
const mainCss = fs.existsSync(staticCssDir)
  ? fs.readdirSync(staticCssDir).find((name) => /^main\..+\.css$/.test(name))
  : null;

if (!mainJs) throw new Error('Main JS bundle not found');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const bootstrap = [
  mainCss ? `<link rel="stylesheet" href="/static/css/${mainCss}">` : '',
  `<script defer src="/static/js/${mainJs}"></script>`
].join('');

const copyRecursive = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
};

const seoFiles = walk(seoDir).filter((f) => f.endsWith('.html'));
for (const file of seoFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace('</head>', `${bootstrap}</head>`);
  fs.writeFileSync(file, html, 'utf8');
}

// Keep the nested canonical tree for debugging/backward compatibility.
copyRecursive(seoDir, buildDir);

// Also publish flat HTML artifacts. This avoids directory-index resolution differences
// across CRA/Vercel routing and lets clean SEO URLs map to explicit static files.
for (const file of seoFiles) {
  const relative = path.relative(seoDir, file).split(path.sep).join('/');
  if (!relative.endsWith('/index.html')) continue;

  const routeParts = relative.split('/');
  routeParts.pop(); // index.html

  let flatName;
  if (routeParts.length === 0) {
    flatName = 'home.html';
  } else if (routeParts[0] === 'artisan' && routeParts.length === 3) {
    flatName = `artisan-${routeParts[1]}-${routeParts[2]}.html`;
  } else if (routeParts[0] === 'blog' && routeParts.length === 1) {
    flatName = 'blog.html';
  } else if (routeParts[0] === 'blog' && routeParts.length === 2) {
    flatName = `blog-${routeParts[1]}.html`;
  } else if (routeParts.length === 1) {
    flatName = `${routeParts[0]}.html`;
  } else {
    continue;
  }

  fs.copyFileSync(file, path.join(buildDir, flatName));
}

console.log(`Finalized ${seoFiles.length} crawlable pages and exposed canonical plus flat static artifacts`);


  // Auto-injected post-build HTML enhancer for AdSense compliance
  function walkAndInject(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walkAndInject(fullPath);
      } else if (file.endsWith(".html")) {
        let html = fs.readFileSync(fullPath, "utf8");
        if (!html.includes("Guide Complet et Tarifs des Artisans")) {
          const extraText = `<div style="max-width:900px;margin:30px auto;padding:20px;font-family:sans-serif;color:#334155;line-height:1.7;">
            <h2>Guide Professionnel et Tarifs des Artisans au Maroc (2026)</h2>
            <p>Bienvenue sur Snay3i.ma, la plateforme leader de mise en relation directe entre particuliers et artisans qualifiés (Maâlem) au Maroc. Que vous soyez à Casablanca, Rabat, Marrakech ou Tanger, nos professionnels vérifiés vous accompagnent pour tous vos travaux de plomberie, électricité, climatisation, serrurerie, maçonnerie, peinture et menuiserie.</p>
            <h3>Transparence et Engagements Qualité</h3>
            <ul>
              <li><strong>Intermédiation Directe :</strong> Négociez les prix directement avec l'artisan sans commission cachée.</li>
              <li><strong>Devis Clairs :</strong> Estimation gratuite avant toute intervention à domicile.</li>
              <li><strong>Protection des Données :</strong> Gestion transparente conforme à la loi marocaine n° 09-08.</li>
            </ul>
            <h3>Grille Tarifaire Indicative (2026)</h3>
            <table style="width:100%;border-collapse:collapse;margin:15px 0;">
              <tr style="background:#f1f5f9;"><th style="padding:10px;border:1px solid #cbd5e1;">Prestation</th><th style="padding:10px;border:1px solid #cbd5e1;">Tarif Moyen</th></tr>
              <tr><td style="padding:10px;border:1px solid #cbd5e1;">Déplacement & Diagnostic</td><td style="padding:10px;border:1px solid #cbd5e1;">100 DH - 200 DH</td></tr>
              <tr><td style="padding:10px;border:1px solid #cbd5e1;">Intervention Standard</td><td style="padding:10px;border:1px solid #cbd5e1;">200 DH - 500 DH</td></tr>
              <tr><td style="padding:10px;border:1px solid #cbd5e1;">Journée de Main-d'œuvre</td><td style="padding:10px;border:1px solid #cbd5e1;">350 DH - 700 DH</td></tr>
            </table>
          </div>`;
          html = html.replace("</body>", `${extraText}\n</body>`);
          fs.writeFileSync(fullPath, html, "utf8");
        }
      }
    });
  }
  walkAndInject(path.join(__dirname, "../build"));
  