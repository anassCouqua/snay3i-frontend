const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "../build");
const indexFile = path.join(buildDir, "index.html");

if (fs.existsSync(indexFile)) {
  const baseHtml = fs.readFileSync(indexFile, "utf8");
  const legalPages = [
    {
      route: "politique-de-confidentialite",
      title: "Politique de Confidentialité — Snay3i.ma",
      content: "<h1>Politique de Confidentialité</h1><p>Snay3i.ma respecte votre vie privée. Nous collectons des données minimales nécessaires à la mise en relation avec des artisans au Maroc. Google AdSense utilise des cookies pour diffuser des annonces adaptées.</p>"
    },
    {
      route: "cgu",
      title: "Conditions Générales d'Utilisation — Snay3i.ma",
      content: "<h1>Conditions Générales d'Utilisation</h1><p>En utilisant Snay3i.ma, vous acceptez nos conditions d'utilisation de la plateforme de mise en relation d'artisans au Maroc.</p>"
    },
    {
      route: "a-propos",
      title: "À Propos de Snay3i.ma",
      content: "<h1>À Propos de Snay3i.ma</h1><p>Snay3i.ma est la plateforme marocaine de référence pour trouver des artisans qualifiés (plombiers, électriciens, peintres) dans toutes les villes du Maroc.</p>"
    }
  ];

  legalPages.forEach(({ route, title, content }) => {
    const routeDir = path.join(buildDir, route);
    if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
    let pageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, "<title>" + title + "</title>")
      .replace("<noscript>", "<noscript>" + content);
    fs.writeFileSync(path.join(routeDir, "index.html"), pageHtml, "utf8");
  });
  console.log("✅ Prerendered static fallback HTML for legal pages.");
}
