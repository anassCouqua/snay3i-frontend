const fs = require("fs");
const path = require("path");

const tradeData = {
  "plombier": {
    title: "Plomberie et Dépannage d'Urgence",
    role: "plombier professionnel",
    issues: "fuites d'eau invisibles, engorgement de canalisations, dysfonctionnement de chauffe-eau et installation de sanitaires",
    tips: "Coupez immédiatement la vanne d'arrêt générale en cas de fuite majeure et évitez d'utiliser des produits chimiques corrosifs qui abîment la tuyauterie en cuivre ou en PVC."
  },
  "electricien": {
    title: "Installations et Mises aux Normes Électriques",
    role: "électricien qualifié",
    issues: "pannes de tableaux électriques, courts-circuits, surcharges de réseau et pose de luminaires",
    tips: "Ne touchez jamais à un équipement sous tension sans avoir disjoncté l'alimentation principale du logement et confiez toujours vos mises à la terre à un professionnel certifié."
  },
  "carreleur": {
    title: "Pose de Carrelage, Faïence et Sols",
    role: "carreleur expert",
    issues: "pose de zellige traditionnel, carrelage grand format, marbre et étanchéité des sols de salles de bains",
    tips: "Préparez un plancher parfaitement nivelé et propre avant la pose pour garantir l'adhérence optimale des colles et éviter les fissures de joints à long terme."
  },
  "macon": {
    title: "Travaux de Maçonnerie et Gros Œuvre",
    role: "maçon du bâtiment",
    issues: "rénovation de murs porteurs, cloisons en briques, chapes de béton et travaux d'agrandissement",
    tips: "Respectez scrupuleusement les temps de séchage des bétons et mortiers avant d'entamer les finitions pour garantir la solidité structurelle de votre ouvrage."
  },
  "menuisier": {
    title: "Menuiserie Bois, Aluminium et Agencement",
    role: "menuisier-ébéniste",
    issues: "fabrication de placards sur mesure, pose de portes, fenêtres double vitrage et cuisines intégrées",
    tips: "Traitez régulièrement le bois massif avec des vernis ou huiles protectrices adaptés pour le préserver de l'humidité et des variations de température."
  },
  "peintre": {
    title: "Peinture, Décoration et Revêtements Muraux",
    role: "peintre en bâtiment",
    issues: "application de peintures décoratives, enduits de lissage, pose de papier peint et traitement de l'humidité",
    tips: "P poncez soigneusement et appliquez une sous-couche d'impression de qualité pour éviter que le support n'absorbe irrégulièrement la peinture finale."
  },
  "serrurier": {
    title: "Serrurerie, Blindage et Dépannage d'Urgence",
    role: "serrurier professionnel",
    issues: "ouverture de portes claquées sans dégâts, remplacement de serrures multipoints et installation de blindages",
    tips: "Lubrifiez vos cylindres de serrure une fois par an avec un spray graphite sec plutôt qu'avec de l'huile grasse qui attire la poussière."
  },
  "climatisation": {
    title: "Installation, Climatisation et Froid",
    role: "technicien climaticien",
    issues: "pose de climatiseurs split inverter, maintenance des filtres, recharge de gaz et dépannage de compresseurs",
    tips: "Nettoyez les filtres à air de vos unités intérieures tous les trois mois pour optimiser la consommation énergétique et préserver la qualité de l'air ambiant."
  }
};

const cityInfo = {
  "casablanca": {
    name: "Casablanca",
    areaDesc: "Maarif, Anfa, Racine, Sidi Bernoussi, Ain Diab, et Bourgogne",
    marketContext: "la capitale économique marocaine, où la forte densité urbaine et le dynamisme de l'immobilier requièrent des interventions rapides, ponctuelles et rigoureuses."
  },
  "rabat": {
    name: "Rabat",
    areaDesc: "Agdal, Hay Riad, Souissi, Hassan, et Océan",
    marketContext: "la capitale administrative, caractérisée par des exigences architecturales élevées et un besoin constant en maintenance résidentielle haut de gamme."
  }
};

function generateUniqueArtisanContent(tradeKey, cityKey) {
  const trade = tradeData[tradeKey] || { title: "Travaux et Services", role: "artisan qualifié", issues: "maintenance et rénovation", tips: "Planifiez vos interventions en amont." };
  const city = cityInfo[cityKey] || { name: "Maroc", areaDesc: "tous les quartiers", marketContext: "un marché en pleine expansion." };

  return `
    <div class="unique-seo-content" style="display:block;visibility:visible;opacity:1;position:relative;z-index:10;max-width:900px;margin:40px auto;padding:32px;line-height:1.8;color:#1e293b;background:#ffffff;border-radius:12px;border:1px solid #cbd5e1;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.05);">
      <h2 style="color:#0f172a;font-size:1.8rem;margin-bottom:16px;border-bottom:2px solid #e2e8f0;padding-bottom:10px;">Expertise Locale : ${trade.title} à ${city.name}</h2>
      <p>Vous recherchez un <strong>${trade.role}</strong> de confiance à <strong>${city.name}</strong> (${city.areaDesc}) ? <strong>Snay3i.ma</strong> vous connecte directement avec les meilleurs spécialistes de ${city.marketContext}</p>
      
      <h3 style="color:#1e293b;font-size:1.3rem;margin-top:24px;">Spécificités et Interventions Courantes à ${city.name}</h3>
      <p>Les chantiers de ${trade.issues} nécessitent une maîtrise technique irréprochable. Nos professionnels partenaires à ${city.name} interviennent rapidement pour diagnostiquer, réparer ou installer vos équipements dans le respect total des normes de sécurité en vigueur au Maroc.</p>
      <ul>
        <li><strong>Intervention rapide de proximité :</strong> Disponibles dans les principaux secteurs de ${city.name} (${city.areaDesc}) pour limiter vos temps d'attente.</li>
        <li><strong>Transparence tarifaire 2026 :</strong> Devis clairs, détaillés et conformes aux grilles de prix pratiquées sur le marché local, sans frais cachés.</li>
        <li><strong>Savoir-faire certifié :</strong> Artisans rigoureusement sélectionnés pour leur expérience sur le terrain et leurs réalisations validées.</li>
      </ul>

      <h3 style="color:#1e293b;font-size:1.3rem;margin-top:24px;">Conseils d'Expert pour Vos Travaux</h3>
      <p>${trade.tips} En faisant appel à un expert certifié via notre plateforme, vous bénéficiez de garanties sur la qualité des matériaux utilisés et sur la durabilité des interventions réalisées chez vous.</p>
      <p>Consultez dès maintenant les profils vérifiés de nos ${trade.role}s à ${city.name}, lisez les avis clients authentiques et contactez directement votre prestataire par téléphone ou messagerie pour planifier votre intervention.</p>
    </div>
  `;
}

// Recursive walker to inject unique content based on path parsing
function walkAndInject(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndInject(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = fs.readFileSync(fullPath, "utf8");
      
      // Check if it's an artisan page by examining the path
      if (fullPath.includes("artisan") && !html.includes("unique-seo-content")) {
        // Extract trade and city from path e.g. build/artisan/plombier/casablanca/index.html
        const parts = fullPath.split(path.sep);
        const artisanIndex = parts.indexOf("artisan");
        if (artisanIndex !== -1 && parts.length > artisanIndex + 2) {
          const tradeKey = parts[artisanIndex + 1];
          const cityKey = parts[artisanIndex + 2];
          
          const uniqueBlock = generateUniqueArtisanContent(tradeKey, cityKey);
          if (html.includes("</body>")) {
            html = html.replace("</body>", `${uniqueBlock}\n</body>`);
          } else {
            html += uniqueBlock;
          }
          fs.writeFileSync(fullPath, html, "utf8");
          console.log(`✅ Injected unique content for ${tradeKey} in ${cityKey}`);
        }
      }
    }
  }
}

walkAndInject(path.join(process.cwd(), "build"));
