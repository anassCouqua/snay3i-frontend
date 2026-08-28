const fs = require("fs");
const path = require("path");

function walkAndInject(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndInject(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = fs.readFileSync(fullPath, "utf8");
      
      // Calculate current text words
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, "")
                       .replace(/<style[\s\S]*?<\/style>/gi, "")
                       .replace(/<[^>]+>/g, " ")
                       .replace(/\s+/g, " ")
                       .trim();
      const words = text.split(" ").filter(w => w.length > 2).length;

      if (words < 400 && !html.includes("seo-universal-padding")) {
        const extraHtml = `
          <div class="seo-universal-padding" style="display:block;visibility:visible;opacity:1;position:relative;z-index:10;max-width:900px;margin:40px auto;padding:24px;line-height:1.8;color:#334155;background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;font-family:system-ui,-apple-system,sans-serif;">
            <h2>Guide Professionnel et Annuaire de Référence Snay3i.ma (2026)</h2>
            <p>Bienvenue sur <strong>Snay3i.ma</strong>, la plateforme incontournable de mise en relation entre particuliers et artisans qualifiés au Maroc. Notre objectif est de vous offrir un service rapide, transparent et sécurisé pour tous vos besoins en travaux de bâtiment, rénovation, dépannage d'urgence et maintenance à domicile (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, etc.).</p>
            
            <h3>Pourquoi Choisir Nos Artisans Partenaires ?</h3>
            <p>Trouver un artisan de confiance (plombier, électricien, menuisier, peintre, carreleur, maçon, serrurier, climaticien) peut s'avérer complexe. Sur Snay3i.ma, chaque professionnel fait l'objet d'une sélection rigoureuse pour garantir :</p>
            <ul>
              <li><strong>Un savoir-faire vérifié :</strong> Des années d'expérience sur le terrain et des chantiers contrôlés.</li>
              <li><strong>Des tarifs transparents 2026 :</strong> Respect des grilles tarifaires du marché marocain sans frais d'intermédiation cachés.</li>
              <li><strong>Une disponibilité accrue :</strong> Interventions rapides pour les urgences du quotidien ou les grands projets de rénovation.</li>
              <li><strong>Un contact direct :</strong> Échangez directement par téléphone ou via notre messagerie sécurisée pour planifier vos interventions en toute sérénité.</li>
            </ul>

            <h3>Nos Engagements pour Votre Sécurité et Votre Confort</h3>
            <p>Conformément aux normes en vigueur au Maroc, nous veillons à ce que nos prestations respectent les règles de sécurité les plus strictes. Que vous ayez besoin d'une installation électrique aux normes, d'une recherche de fuite d'eau non destructive, de travaux de maçonnerie ou de la pose de carrelage, notre annuaire vous met en relation avec les meilleurs experts de votre région.</p>
            <p>Parcourez nos profils, lisez les avis vérifiés de clients et confiez vos projets aux mains de professionnels passionnés et engagés.</p>
          </div>
        `;
        if (html.includes("</body>")) {
          html = html.replace("</body>", `${extraHtml}\n</body>`);
        } else {
          html += extraHtml;
        }
        fs.writeFileSync(fullPath, html, "utf8");
        console.log(`✅ Universally padded low-word page (${words} words): ${fullPath}`);
      }
    }
  }
}

walkAndInject(path.join(process.cwd(), "build"));
