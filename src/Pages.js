import React, { useEffect } from 'react';

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}


const HEADER = () => (
  <div style={{background:'#0D1B2A',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
    <a href="/"><img src="/logo.png" alt="Snay3i.ma" style={{height:40,objectFit:'contain'}}/></a>
    <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
      <a href="/blog" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>Blog</a>
      <a href="/about" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>À propos</a>
      <a href="/contact" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>Contact</a>
      <a href="/" style={{background:'#C4622D',color:'#fff',padding:'8px 16px',borderRadius:20,fontSize:13,textDecoration:'none',fontWeight:700}}>Trouver un artisan →</a>
    </div>
  </div>
);

const FOOTER = () => (
  <div style={{background:'#0D1B2A',padding:'32px 24px',marginTop:40}}>
    <div style={{maxWidth:760,margin:'0 auto',display:'flex',flexWrap:'wrap',gap:24,justifyContent:'space-between'}}>
      <div>
        <img src="/logo.png" alt="Snay3i.ma" style={{height:36,marginBottom:12}}/>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:12,margin:0,maxWidth:240}}>Le réseau des professionnels référencés au Maroc. Consultez les profils et contactez directement les professionnels disponibles. 🇲🇦</p>
      </div>
      <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
        <div>
          <p style={{color:'#D4A843',fontSize:12,fontWeight:700,marginBottom:8}}>PLATEFORME</p>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <a href="/" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Accueil</a>
            <a href="/blog" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Blog</a>
            <a href="/about" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>À propos</a>
            <a href="/contact" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Contact</a>
          </div>
        </div>
        <div>
          <p style={{color:'#D4A843',fontSize:12,fontWeight:700,marginBottom:8}}>LÉGAL</p>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <a href="/privacy" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Politique de confidentialité</a>
            <a href="/terms" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </div>
    <div style={{maxWidth:760,margin:'24px auto 0',borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:16,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
      <p style={{color:'rgba(255,255,255,0.3)',fontSize:11,margin:0}}>© 2026 Snay3i.ma — Tous droits réservés</p>
      <p style={{color:'rgba(255,255,255,0.3)',fontSize:11,margin:0}}>contact@snay3i.ma</p>
    </div>
  </div>
);

export function AboutPage() {
  useEffect(() => {
    document.title = 'À propos de Snay3i.ma — Le réseau des artisans marocains';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Snay3i.ma est une plateforme marocaine qui connecte les clients avec des artisans et professionnels locaux. Notre mission: rendre l\'accès aux services à domicile simple, pratique et accessible.');
    setCanonical('https://snay3i.ma/about');
  }, []);

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <HEADER />
      <div style={{maxWidth:760,margin:'0 auto',padding:'40px 16px'}}>

        {/* Hero */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:48,marginBottom:12}}>🇲🇦</div>
          <h1 style={{fontSize:32,fontWeight:800,color:'#0D1B2A',margin:'0 0 12px'}}>À propos de Snay3i.ma</h1>
          <p style={{color:'#7A7065',fontSize:16,lineHeight:1.7,maxWidth:560,margin:'0 auto'}}>
            Une plateforme marocaine qui aide les particuliers à rechercher des professionnels pour leurs travaux et services à domicile.
          </p>
        </div>

        {/* Mission */}
        <div style={{background:'#fff',borderRadius:16,padding:28,marginBottom:16,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>🎯 Notre mission</h2>
          <p style={{color:'#5A5050',fontSize:15,lineHeight:1.8,margin:'0 0 12px'}}>
            Snay3i.ma est né d'un constat simple: trouver un artisan fiable au Maroc est souvent compliqué et stressant. 
            Trop souvent, les Marocains se retrouvent à demander à des amis ou à chercher sur des forums sans garantie de qualité.
          </p>
          <p style={{color:'#5A5050',fontSize:15,lineHeight:1.8,margin:0}}>
            Notre mission est de changer ça. Nous avons créé une plateforme simple, gratuite et accessible qui connecte 
            directement les clients avec des professionnels locaux — sans intermédiaire, sans commission, sans complications.
          </p>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:16}}>
          {[
            {n:'Profils',l:'Professionnels référencés'},
            {n:'Plusieurs',l:'Villes proposées'},
            {n:'12',l:'Catégories de services'},
            {n:'Simple',l:'Recherche gratuite'},
          ].map(s=>(
            <div key={s.l} style={{background:'#fff',borderRadius:16,padding:20,textAlign:'center',border:'1.5px solid #E8E0D4'}}>
              <div style={{fontSize:28,fontWeight:800,color:'#C4622D',marginBottom:4}}>{s.n}</div>
              <div style={{fontSize:12,color:'#7A7065'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div style={{background:'#fff',borderRadius:16,padding:28,marginBottom:16,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>📖 Notre histoire</h2>
          <p style={{color:'#5A5050',fontSize:15,lineHeight:1.8,margin:'0 0 12px'}}>
            Snay3i.ma a été fondé par Anass Couqua, un entrepreneur marocain basé à Londres, avec la vision de moderniser 
            l'accès aux services artisanaux au Maroc. Le nom "Snay3i" (صنايعي) est le mot marocain pour "artisan" — 
            un terme que tout Marocain connaît et utilise au quotidien.
          </p>
          <p style={{color:'#5A5050',fontSize:15,lineHeight:1.8,margin:0}}>
            Aujourd'hui, Snay3i.ma référence des professionnels dans plusieurs villes du Maroc, avec des informations en français et en arabe pour faciliter la recherche et la prise de contact.
          </p>
        </div>

        {/* Values */}
        <div style={{background:'#fff',borderRadius:16,padding:28,marginBottom:16,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#0D1B2A',marginBottom:16}}>💡 Nos valeurs</h2>
          {[
            ['🤝','Confiance','Consultez les informations disponibles sur chaque profil et les avis lorsqu\'ils sont proposés avant de contacter un professionnel.'],
            ['💰','Gratuité','La recherche sur Snay3i.ma est proposée sans frais pour les visiteurs. Les conditions applicables à une prestation sont convenues directement avec le professionnel.'],
            ['⚡','Rapidité','Recherchez par service et par ville, puis contactez directement le professionnel qui correspond à votre besoin.'],
            ['🇲🇦','Marocanité','Une plateforme 100% marocaine, bilingue français-arabe, adaptée aux réalités locales.'],
          ].map(([icon,title,text])=>(
            <div key={title} style={{display:'flex',gap:14,marginBottom:16,paddingBottom:16,borderBottom:'1px solid #F5EFE8'}}>
              <span style={{fontSize:24,flexShrink:0}}>{icon}</span>
              <div>
                <div style={{fontWeight:700,color:'#0D1B2A',fontSize:14,marginBottom:4}}>{title}</div>
                <div style={{color:'#7A7065',fontSize:13,lineHeight:1.6}}>{text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'#0D1B2A',borderRadius:16,padding:28,textAlign:'center'}}>
          <h3 style={{color:'#fff',fontSize:18,fontWeight:700,margin:'0 0 8px'}}>Vous êtes artisan au Maroc?</h3>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,margin:'0 0 16px'}}>Rejoignez la communauté de professionnels sur Snay3i.ma — gratuit et sans commission</p>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'12px 28px',borderRadius:24,textDecoration:'none',fontWeight:800,fontSize:14}}>Créer mon profil gratuit →</a>
        </div>
      </div>
      <FOOTER />
    </div>
  );
}

export function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Snay3i.ma — Nous contacter';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Contactez l\'équipe Snay3i.ma. Email, WhatsApp ou réseaux sociaux — nous sommes là pour vous aider.');
    setCanonical('https://snay3i.ma/contact');
  }, []);

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <HEADER />
      <div style={{maxWidth:680,margin:'0 auto',padding:'40px 16px'}}>
        <h1 style={{fontSize:30,fontWeight:800,color:'#0D1B2A',margin:'0 0 8px'}}>📬 Contactez-nous</h1>
        <p style={{color:'#7A7065',fontSize:15,margin:'0 0 28px'}}>Une question, un problème ou une suggestion? Contactez-nous et nous vous répondrons dès que possible.</p>

        {/* Contact cards */}
        <div style={{display:'grid',gap:12,marginBottom:24}}>
          {[
            {icon:'📧',title:'Email',value:'contact@snay3i.ma',link:'mailto:contact@snay3i.ma',color:'#EAF4FB'},
            {icon:'💬',title:'WhatsApp',value:'+44 7999 393 290',link:'https://wa.me/447999393290',color:'#F0FBF0'},
            {icon:'📘',title:'Facebook',value:'Snay3i.ma',link:'https://facebook.com/snay3i.ma',color:'#EEF2FF'},
            {icon:'🎵',title:'TikTok',value:'@snay3i.ma',link:'https://tiktok.com/@snay3i.ma',color:'#FDF4FF'},
          ].map(c=>(
            <a key={c.title} href={c.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
              <div style={{background:'#fff',borderRadius:16,padding:20,border:'1.5px solid #E8E0D4',display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{c.icon}</div>
                <div>
                  <div style={{fontWeight:700,color:'#0D1B2A',fontSize:14}}>{c.title}</div>
                  <div style={{color:'#C4622D',fontSize:13,fontWeight:600}}>{c.value}</div>
                </div>
                <div style={{marginLeft:'auto',color:'#C4622D',fontSize:18}}>→</div>
              </div>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div style={{background:'#fff',borderRadius:16,padding:24,border:'1.5px solid #E8E0D4',marginBottom:16}}>
          <h2 style={{fontSize:17,fontWeight:700,color:'#0D1B2A',marginBottom:16}}>Questions fréquentes</h2>
          {[
            ['Comment signaler un problème avec un artisan?','Envoyez-nous un email à contact@snay3i.ma avec le nom de l\'artisan et la description du problème. Nous traiterons votre demande dans les meilleurs délais.'],
            ['Comment ajouter mon profil d\'artisan?','Rendez-vous sur snay3i.ma et cliquez sur "Rejoindre" — c\'est gratuit et prend moins de 2 minutes.'],
            ['Snay3i.ma est-il gratuit?','Oui, totalement gratuit pour les clients et les artisans. Pas de commission, pas d\'abonnement.'],
            ['Dans quelles villes êtes-vous disponibles?','Les villes disponibles évoluent avec les professionnels référencés. Consultez les résultats par ville directement sur la plateforme.'],
          ].map(([q,a],i)=>(
            <div key={i} style={{borderBottom:i<3?'1px solid #F5EFE8':'none',paddingBottom:12,marginBottom:12}}>
              <div style={{fontWeight:700,color:'#0D1B2A',fontSize:13,marginBottom:4}}>❓ {q}</div>
              <div style={{color:'#7A7065',fontSize:13,lineHeight:1.6}}>{a}</div>
            </div>
          ))}
        </div>

        <div style={{background:'#0D1B2A',borderRadius:16,padding:24,textAlign:'center'}}>
          <p style={{color:'#fff',fontWeight:700,fontSize:15,margin:'0 0 8px'}}>Vous êtes artisan? 🔧</p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,margin:'0 0 16px'}}>Rejoignez Snay3i.ma gratuitement</p>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'10px 24px',borderRadius:24,textDecoration:'none',fontWeight:700,fontSize:13}}>Rejoindre →</a>
        </div>
      </div>
      <FOOTER />
    </div>
  );
}

export function PrivacyPage() {
  useEffect(() => {
    document.title = 'Politique de confidentialité — Snay3i.ma';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Politique de confidentialité de Snay3i.ma. Comment nous collectons, utilisons et protégeons vos données personnelles.');
    setCanonical('https://snay3i.ma/privacy');
  }, []);

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <HEADER />
      <div style={{maxWidth:760,margin:'0 auto',padding:'40px 16px'}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'#0D1B2A',margin:'0 0 4px'}}>🔒 Politique de confidentialité</h1>
        <p style={{color:'#7A7065',fontSize:13,margin:'0 0 28px'}}>Dernière mise à jour: 16 Juin 2026</p>

        {[
          ['1. Introduction',`Snay3i.ma ("nous", "notre", "la plateforme") s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme disponible sur snay3i.ma.`],
          ['2. Informations que nous collectons',`Nous collectons les informations suivantes:\n\n- Informations de contact: nom, adresse email, numéro de téléphone (pour les artisans inscrits)\n- Informations de localisation: ville et région pour vous connecter aux artisans proches\n- Données d'utilisation: pages visitées, recherches effectuées, artisans consultés\n- Informations techniques: adresse IP, type de navigateur, appareil utilisé\n- Avis et évaluations: commentaires et notes que vous laissez sur les artisans`],
          ['3. Comment nous utilisons vos informations',`Nous utilisons vos informations pour:\n\n- Vous connecter avec des artisans dans votre ville\n- Améliorer notre plateforme et nos services\n- Vous envoyer des notifications importantes sur votre compte\n- Analyser l'utilisation de la plateforme pour l'améliorer\n- Respecter nos obligations légales`],
          ['4. Partage des informations',`Nous ne vendons jamais vos données personnelles à des tiers. Nous pouvons partager vos informations dans les cas suivants:\n\n- Avec les artisans: quand vous les contactez, votre nom et votre numéro peuvent être partagés\n- Avec nos prestataires: hébergement, analyse (Google Analytics)\n- En cas d'obligation légale: si requis par la loi marocaine ou internationale`],
          ['5. Cookies et technologies de suivi',`Snay3i.ma utilise des cookies et des technologies similaires pour:\n\n- Mémoriser vos préférences (langue, ville)\n- Analyser le trafic via Google Analytics\n- Afficher, le cas échéant, des publicités pertinentes via les services publicitaires Google une fois activés sur la plateforme\n\nLes fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures d'un utilisateur sur notre site ou sur d'autres sites. L'utilisation de cookies publicitaires par Google permet à Google et à ses partenaires de diffuser des annonces à nos utilisateurs en fonction de leurs visites sur nos sites et/ou d'autres sites sur Internet. Les utilisateurs peuvent désactiver la publicité personnalisée dans les paramètres des annonces Google.\n\nVous pouvez désactiver les cookies dans les paramètres de votre navigateur.`],
          ['6. Sécurité des données',`Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données:\n\n- Connexion HTTPS sécurisée sur tout le site\n- Accès restreint aux données personnelles\n- Surveillance régulière de nos systèmes\n\nCependant, aucun système n'est totalement infaillible. Nous vous encourageons à utiliser des mots de passe forts.`],
          ['7. Vos droits',`Conformément à la loi marocaine 09-08 sur la protection des données, vous avez le droit de:\n\n- Accéder à vos données personnelles\n- Corriger des informations inexactes\n- Supprimer votre compte et vos données\n- Vous opposer au traitement de vos données\n\nPour exercer ces droits, contactez-nous à contact@snay3i.ma`],
          ['8. Conservation des données',`Nous conservons vos données tant que votre compte est actif. Si vous supprimez votre compte, nous supprimons vos données dans un délai de 30 jours, sauf obligation légale de conservation.`],
          ['9. Modifications de cette politique',`Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons des changements importants par email ou notification sur la plateforme.`],
          ['10. Contact',`Pour toute question concernant cette politique de confidentialité:\n\nEmail: contact@snay3i.ma\nWhatsApp: +44 7999 393 290\nSnay3i.ma — Londres, Royaume-Uni`],
        ].map(([title, content])=>(
          <div key={title} style={{background:'#fff',borderRadius:16,padding:24,marginBottom:12,border:'1.5px solid #E8E0D4'}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#0D1B2A',marginBottom:10}}>{title}</h2>
            <p style={{color:'#5A5050',fontSize:14,lineHeight:1.8,margin:0,whiteSpace:'pre-line'}}>{content}</p>
          </div>
        ))}
      </div>
      <FOOTER />
    </div>
  );
}

export function TermsPage() {
  useEffect(() => {
    document.title = 'Conditions d\'utilisation — Snay3i.ma';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Conditions générales d\'utilisation de Snay3i.ma. Règles d\'utilisation de la plateforme pour les clients et les artisans.');
    setCanonical('https://snay3i.ma/terms');
  }, []);

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <HEADER />
      <div style={{maxWidth:760,margin:'0 auto',padding:'40px 16px'}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'#0D1B2A',margin:'0 0 4px'}}>📋 Conditions d'utilisation</h1>
        <p style={{color:'#7A7065',fontSize:13,margin:'0 0 28px'}}>Dernière mise à jour: 16 Juin 2026</p>

        {[
          ['1. Acceptation des conditions',`En utilisant Snay3i.ma, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.`],
          ['2. Description du service',`Snay3i.ma est une plateforme de mise en relation entre clients et artisans au Maroc. Nous ne sommes pas un employeur d'artisans et ne garantissons pas la qualité des services fournis par les artisans référencés.`],
          ['3. Utilisation de la plateforme',`Vous vous engagez à:\n\n- Utiliser la plateforme uniquement à des fins légales\n- Fournir des informations exactes lors de l'inscription\n- Ne pas publier de faux avis ou de fausses informations\n- Respecter les autres utilisateurs et artisans\n- Ne pas utiliser la plateforme à des fins commerciales non autorisées`],
          ['4. Responsabilité des artisans',`Les artisans référencés sur Snay3i.ma sont des professionnels indépendants. Snay3i.ma ne peut être tenu responsable:\n\n- De la qualité des travaux réalisés\n- Des accidents ou dommages survenus lors d'une intervention\n- Des différends entre clients et artisans\n- Du non-respect des délais ou devis`],
          ['5. Avis et évaluations',`Les avis publiés sur Snay3i.ma doivent être honnêtes et basés sur une expérience réelle. Snay3i.ma se réserve le droit de supprimer tout avis jugé faux, offensant ou inapproprié.`],
          ['6. Propriété intellectuelle',`Tout le contenu de Snay3i.ma (logo, design, textes, code) est protégé par les droits d'auteur et appartient à Snay3i.ma. Toute reproduction non autorisée est interdite.`],
          ['7. Modification des conditions',`Snay3i.ma se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur la plateforme.`],
          ['8. Contact',`Pour toute question: contact@snay3i.ma`],
        ].map(([title, content])=>(
          <div key={title} style={{background:'#fff',borderRadius:16,padding:24,marginBottom:12,border:'1.5px solid #E8E0D4'}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#0D1B2A',marginBottom:10}}>{title}</h2>
            <p style={{color:'#5A5050',fontSize:14,lineHeight:1.8,margin:0,whiteSpace:'pre-line'}}>{content}</p>
          </div>
        ))}
      </div>
      <FOOTER />
    </div>
  );
}
