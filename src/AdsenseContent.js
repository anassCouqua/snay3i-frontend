import React from 'react';

export function LegalPages() {
  const path = window.location.pathname;

  if (path === '/politique-de-confidentialite') {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
        <h1>Politique de Confidentialité — Snay3i.ma</h1>
        <p>Dernière mise à jour : 2026</p>
        <p>La présente Politique de Confidentialité décrit la manière dont <strong>Snay3i.ma</strong> collecte, utilise et protège les informations des utilisateurs visitant notre plateforme de mise en relation d'artisans au Maroc.</p>
        <h2>1. Collecte des Données</h2>
        <p>Nous collectons des informations lorsque vous utilisez notre plateforme, notamment vos coordonnées si vous nous contactez ou vous inscrivez en tant qu'artisan.</p>
        <h2>2. Cookies et Google AdSense</h2>
        <p>Snay3i.ma utilise des cookies pour améliorer la navigation. Google, en tant que fournisseur tiers, utilise des cookies pour diffuser des annonces adaptées aux utilisateurs.</p>
        <h2>3. Contact</h2>
        <p>Pour toute question concernant vos données personnelles, contactez-nous via l'adresse support de Snay3i.ma.</p>
      </div>
    );
  }

  if (path === '/cgu') {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
        <h1>Conditions Générales d'Utilisation (CGU)</h1>
        <p><strong>Snay3i.ma</strong> est une plateforme de mise en relation facilitant la recherche d'artisans au Maroc. Snay3i.ma n'intervient pas directement dans les transactions financières entre clients et artisans.</p>
      </div>
    );
  }

  if (path === '/a-propos') {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
        <h1>À Propos de Snay3i.ma</h1>
        <p>Snay3i.ma est le portail marocain dédié à la recherche rapide et transparente d'artisans locaux (plombiers, électriciens, peintres, maçons) pour tous travaux de rénovation et de dépannage.</p>
      </div>
    );
  }

  return null;
}

export function CategorySEOIntro() {
  return (
    <section style={{ maxWidth: '1100px', margin: '20px auto', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2>Trouvez un Artisan Qualifié au Maroc pour vos Travaux</h2>
      <p>
        Sur <strong>Snay3i.ma</strong>, accédez rapidement aux profils de plombiers, électriciens, peintres et maçons à Casablanca, Rabat, Marrakech, Tanger et dans l'ensemble des villes marocaines.
      </p>
    </section>
  );
}
