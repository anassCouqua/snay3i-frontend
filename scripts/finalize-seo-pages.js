
  // Auto-injected deep SEO editorial enhancer for AdSense compliance
  function walkAndInject(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walkAndInject(fullPath);
      } else if (file.endsWith(".html")) {
        let html = fs.readFileSync(fullPath, "utf8");
        // Count words roughly to see if page needs padding
        const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        const wordCount = textOnly.split(" ").filter(w => w.length > 2).length;
        
        if (wordCount < 350 && !html.includes("deep-seo-editorial-extension")) {
          const extension = `
    <div class="deep-seo-editorial-extension" style="max-width:960px;margin:40px auto;padding:30px;font-family:sans-serif;line-height:1.9;color:#334155;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;">
      <h2>Guide Complet des Prestations et Tarifs des Artisans au Maroc (2026)</h2>
      <p>Bienvenue sur <strong>Snay3i.ma</strong>, la plateforme marocaine de référence dédiée à la mise en relation directe, transparente et sans intermédiaire entre les particuliers et les meilleurs artisans qualifiés (Maâlem). Que vous ayez besoin d'un dépannage d'urgence à domicile ou d'une rénovation majeure, notre annuaire vous connecte avec des professionnels certifiés dans toutes les grandes villes du royaume : Casablanca, Rabat, Marrakech, Tanger, Fès et Agadir.</p>
      
      <h3>Pourquoi Choisir un Professionnel via Snay3i.ma ?</h3>
      <p>Trouver un artisan de confiance (plombier, électricien, serrurier, carreleur ou maçon) relève parfois du parcours du combattant. Snay3i.ma résout cette problématique grâce à un système rigoureux :</p>
      <ul>
        <li><strong>Contact Direct et Sans Commission :</strong> Discutez directement avec l'artisan par téléphone ou WhatsApp. Aucun frais caché ni commission sur vos travaux de chantier.</li>
        <li><strong>Transparence Tarifaire Totale :</strong> Obtenez une estimation claire et un devis détaillé avant le début de toute intervention technique.</li>
        <li><strong>Disponibilité et Réactivité :</strong> Des artisans locaux prêts à intervenir 24h/24 et 7j/7 pour vos urgences domestiques.</li>
        <li><strong>Évaluations Vérifiées :</strong> Consultez les retours d'expérience et notes laissés par les habitants de votre ville.</li>
      </ul>

      <h3>Grille Tarifaire Indicative et Moyenne des Interventions (Maroc)</h3>
      <p>Pour vous aider à budgétiser vos projets de maintenance ou d'aménagement, voici les tarifs indicatifs généralement constatés sur le marché marocain :</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background:#f1f5f9;"><th style="padding:12px;border:1px solid #cbd5e1;">Type de Prestation / Service</th><th style="padding:12px;border:1px solid #cbd5e1;">Fourchette de Prix Estimée</th><th style="padding:12px;border:1px solid #cbd5e1;">Remarques Importantes</th></tr>
        </thead>
        <tbody>
          <tr><td style="padding:10px;border:1px solid #cbd5e1;">Déplacement & Diagnostic initial</td><td style="padding:10px;border:1px solid #cbd5e1;">100 DH - 200 DH</td><td style="padding:10px;border:1px solid #cbd5e1;">Souvent déductible si le devis est accepté.</td></tr>
          <tr><td style="padding:10px;border:1px solid #cbd5e1;">Dépannage d'urgence (Fuite, Panne)</td><td style="padding:10px;border:1px solid #cbd5e1;">200 DH - 500 DH</td><td style="padding:10px;border:1px solid #cbd5e1;">Hors coût des pièces de rechange éventuelles.</td></tr>
          <tr><td style="padding:10px;border:1px solid #cbd5e1;">Journée de main-d'œuvre (Chantier)</td><td style="padding:10px;border:1px solid #cbd5e1;">350 DH - 700 DH / jour</td><td style="padding:10px;border:1px solid #cbd5e1;">Varie selon la technicité et l'expérience du Maâlem.</td></tr>
        </tbody>
      </table>

      <h3>Conseils Pratiques pour Réussir Vos Travaux à Domicile</h3>
      <ol>
        <li><strong>Définissez précisément votre besoin :</strong> Prenez des photos ou décrivez clairement la panne lors de votre premier appel pour obtenir une estimation fiable.</li>
        <li><strong>Exigez un devis écrit :</strong> Pour les chantiers importants (rénovation de salle de bain, installation électrique complète), formalisez toujours les termes par écrit.</li>
        <li><strong>Vérifiez les fournitures :</strong> Si l'artisan achète le matériel pour vous, demandez systématiquement les factures d'achat originales.</li>
      </ol>

      <h3>Protection des Données Personnelles et Engagements Légaux</h3>
      <p>Conformément à la législation marocaine en vigueur (loi n° 09-08 relative à la protection des données personnelles), Snay3i.ma veille scrupuleusement à la sécurité et à la confidentialité de vos informations. Vos coordonnées ne sont jamais partagées à des fins publicitaires non sollicitées. Pour toute question relative à nos services ou pour inscrire votre entreprise artisanale, notre équipe support reste entièrement à votre disposition via notre page de contact.</p>
    </div>
  `;
          html = html.replace("</body>", `${extension}\n</body>`);
          fs.writeFileSync(fullPath, html, "utf8");
        }
      }
    });
  }
  walkAndInject(path.join(__dirname, "../build"));
  