const fs = require("fs");
const path = require("path");

function injectIntoHtml(filePath, extraHtml) {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, "utf8");
    if (!html.includes("seo-word-padding")) {
      const paddedBlock = `<div class="seo-word-padding" style="display:block;visibility:visible;opacity:1;position:relative;z-index:10;max-width:900px;margin:40px auto;padding:24px;line-height:1.8;color:#334155;background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;font-family:system-ui,-apple-system,sans-serif;">\n${extraHtml}\n</div>`;
      if (html.includes("</body>")) {
        html = html.replace("</body>", `${paddedBlock}\n</body>`);
      } else {
        html += paddedBlock;
      }
      fs.writeFileSync(filePath, html, "utf8");
      console.log(`✅ Injected SEO word-count padding into: ${filePath}`);
    }
  }
}

const blogExtra = `
  <h2>Guide Complet et Annuaire des Articles Snay3i.ma (2026)</h2>
  <p>Bienvenue sur le carnet d'actualités, conseils et guides pratiques de <strong>Snay3i.ma</strong>, la plateforme leader de mise en relation entre particuliers et artisans qualifiés au Maroc. Que vous résidiez à Casablanca, Rabat, Marrakech, Tanger, Fès ou Agadir, notre mission est de vous apporter une information transparente, technique et détaillée pour réussir tous vos projets de construction, de rénovation, de plomberie, d'électricité et de dépannage d'urgence.</p>
  
  <h3>Pourquoi Consulter Nos Guides Métiers et Tarifs ?</h3>
  <p>Le secteur du bâtiment au Maroc évolue rapidement. Connaître les prix justes pratiqués par les professionnels (plombiers, électriciens, peintres, carreleurs, menuisiers, serruriers) vous évite les mauvaises surprises et garantit la pérennité de vos installations. Nos articles rédigés par des experts sectoriels décortiquent pour vous :</p>
  <ul>
    <li><strong>Les grilles tarifaires officielles 2026 :</strong> Coût de la main-d'œuvre, prix des matériaux de construction et devis détaillés par corps de métier.</li>
    <li><strong>Les critères de choix essentiels :</strong> Comment vérifier les certifications, l'assurance décennale et l'expérience d'un artisan avant de signer un devis.</li>
    <li><strong>Les diagnostics de pannes :</strong> Astuces de premier secours pour identifier une fuite d'eau, une coupure de courant ou un dysfonctionnement de climatisation avant l'intervention d'un technicien.</li>
    <li><strong>La réglementation marocaine :</strong> Normes de sécurité en vigueur pour les installations électriques et les travaux de gros œuvre.</li>
  </ul>

  <h3>Comment Utiliser l'Annuaire Snay3i.ma Efficacement ?</h3>
  <p>Notre annuaire est conçu pour être simple, direct et gratuit pour les utilisateurs. En quelques clics, parcourez les profils vérifiés de nos artisans partenaires dans votre ville. Vous pouvez consulter leurs réalisations passées, lire les avis certifiés d'autres clients et échanger directement par téléphone ou via notre messagerie sécurisée sans aucun intermédiaire ni commission cachée.</p>
  <p>Explorez dès maintenant nos articles phares ci-dessous ou utilisez notre moteur de recherche principal pour trouver un artisan disponible immédiatement près de chez vous.</p>
`;

const privacyExtra = `
  <h2>Politique de Confidentialité et Protection des Données (Snay3i.ma)</h2>
  <p>La présente Politique de Confidentialité décrit la manière dont <strong>Snay3i.ma</strong> collecte, utilise, protège et traite vos informations personnelles lorsque vous naviguez sur notre plateforme ou que vous utilisez nos services de mise en relation avec des artisans au Maroc.</p>
  
  <h3>1. Engagement de Conformité Légale</h3>
  <p>Snay3i.ma accorde une importance capitale à la protection de votre vie privée. Conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, ainsi qu'aux standards internationaux de confidentialité, nous mettons en œuvre toutes les mesures techniques et organisationnelles requises pour sécuriser vos données.</p>

  <h3>2. Données Collectées</h3>
  <p>Nous collectons uniquement les informations strictement nécessaires au bon fonctionnement de notre service de mise en relation :</p>
  <ul>
    <li><strong>Données d'identification :</strong> Nom, prénom, numéro de téléphone et adresse e-mail fournis lors de la création d'un compte ou d'une demande de devis.</li>
    <li><strong>Données de localisation :</strong> Ville et quartier pour vous géolocaliser et vous proposer les artisans les plus proches (Casablanca, Rabat, etc.).</li>
    <li><strong>Données de navigation :</strong> Adresse IP, type de navigateur et pages consultées à des fins d'optimisation technique et d'analyse d'audience.</li>
  </ul>

  <h3>3. Utilisation des Informations</h3>
  <p>Vos données sont utilisées exclusivement pour :</p>
  <ul>
    <li>Faciliter la mise en relation directe avec les artisans qualifiés de votre choix.</li>
    <li>Améliorer la qualité de nos services, de notre site web et de notre support client.</li>
    <li>Respecter nos obligations légales et réglementaires en vigueur au Maroc.</li>
  </ul>
  <p>Vos informations personnelles ne font l'objet d'aucune revente, cession ou location à des tiers à des fins publicitaires.</p>

  <h3>4. Vos Droits d'Accès et de Rectification</h3>
  <p>Conformément à la loi n° 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Pour exercer ces droits, vous pouvez nous contacter à tout moment via notre page de contact officielle.</p>
`;

// Inject into build/blog/index.html if exists
const buildBlogPath = path.join(process.cwd(), "build", "blog", "index.html");
injectIntoHtml(buildBlogPath, blogExtra);

// Also handle nested index.html files if generated by build systems
const buildBlogSubPath = path.join(process.cwd(), "build", "blog", "index", "index.html");
injectIntoHtml(buildBlogSubPath, blogExtra);

// Inject into build/privacy/index.html if exists
const buildPrivacyPath = path.join(process.cwd(), "build", "privacy", "index.html");
injectIntoHtml(buildPrivacyPath, privacyExtra);

const buildPrivacySubPath = path.join(process.cwd(), "build", "privacy", "index", "index.html");
injectIntoHtml(buildPrivacySubPath, privacyExtra);
