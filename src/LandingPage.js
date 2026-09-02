import React, { useState, useEffect } from 'react';

const API_BASE = 'https://snay3i-backend.onrender.com';

function trackEvent(action, service, city) {
  if (window.gtag) {
    window.gtag('event', action, {
      'event_category': 'engagement',
      'event_label': `${service}_${city}`,
    });
  }
}


function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}


const SERVICE_MAP = {
  plombier:      { id:'plumber',       label:'Plombier',      ar:'سبّاك',    emoji:'🔧', desc:'Fuites, débouchage, chauffe-eau, sanitaires', pro:'plombier', proPlural:'plombiers' },
  electricien:   { id:'electrician',   label:'Électricien',   ar:'كهربائي',  emoji:'⚡', desc:'Tableau électrique, installations, dépannage', pro:'électricien', proPlural:'électriciens' },
  macon:         { id:'builder',       label:'Maçon',         ar:'بنّاء',    emoji:'🧱', desc:'Construction, rénovation, enduit, ravalement', pro:'maçon', proPlural:'maçons' },
  bricoleur:     { id:'handyman',      label:'Bricoleur',     ar:'مصلح',    emoji:'🔨', desc:'Montage, petits travaux, réparations diverses', pro:'bricoleur', proPlural:'bricoleurs' },
  peintre:       { id:'painter',       label:'Peintre',       ar:'نقّاش',   emoji:'🎨', desc:'Intérieur, extérieur, tadelakt, badigeon', pro:'peintre', proPlural:'peintres' },
  menuisier:     { id:'carpenter',     label:'Menuisier',     ar:'نجّار',   emoji:'🪚', desc:'Portes, fenêtres, placards, cuisine sur mesure', pro:'menuisier', proPlural:'menuisiers' },
  carreleur:     { id:'tiler',         label:'Carreleur',     ar:'بلاّط',   emoji:'🏛️', desc:'Zellige, grès cérame, salle de bain, terrasse', pro:'carreleur', proPlural:'carreleurs' },
  climatisation: { id:'ac_tech',       label:'Climatisation', ar:'تكييف',   emoji:'❄️', desc:'Installation, entretien, recharge, dépannage', pro:'technicien climatisation', proPlural:'techniciens climatisation' },
  serrurier:     { id:'locksmith',     label:'Serrurier',     ar:'قفّال',   emoji:'🔑', desc:'Ouverture porte, blindage, serrures multipoints', pro:'serrurier', proPlural:'serruriers' },
  menage:        { id:'cleaner',       label:'Ménage',        ar:'تنظيف',   emoji:'🧹', desc:'Maisons, bureaux, fin de chantier, vitres', pro:'agent de ménage', proPlural:'agents de ménage' },
  jardinier:     { id:'gardener',      label:'Jardinier',     ar:'بستاني',  emoji:'🌿', desc:'Création jardins, entretien, arrosage automatique', pro:'jardinier', proPlural:'jardiniers' },
  soudeur:       { id:'welder',        label:'Soudeur',       ar:'لحّام',   emoji:'🔥', desc:'Portails, grilles, garde-corps, ferronnerie', pro:'soudeur', proPlural:'soudeurs' },
};

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

const CITY_MAP = {
  casablanca:'Casablanca', rabat:'Rabat', marrakech:'Marrakech', fes:'Fes',
  tanger:'Tanger', agadir:'Agadir', meknes:'Meknes', oujda:'Oujda',
  nador:'Nador', tetouan:'Tetouan', sale:'Sale', kenitra:'Kenitra',
  'al-hoceima':'Al Hoceima', chefchaouen:'Chefchaouen', larache:'Larache',
  'el-jadida':'El Jadida', safi:'Safi', essaouira:'Essaouira', settat:'Settat',
  mohammedia:'Mohammedia', 'beni-mellal':'Beni Mellal', khouribga:'Khouribga',
  ouarzazate:'Ouarzazate', errachidia:'Errachidia', taza:'Taza', berkane:'Berkane',
  taroudannt:'Taroudannt', tiznit:'Tiznit', guelmim:'Guelmim', laayoune:'Laayoune',
  dakhla:'Dakhla', temara:'Temara', 'tan-tan':'Tan-Tan', 'sidi-kacem':'Sidi Kacem',
  khemisset:'Khemisset', khenifra:'Khenifra', martil:'Martil', bouskoura:'Bouskoura', 'el-aioun':'El Aioun', ifrane:'Ifrane',
};

const NEARBY = {
  casablanca:['mohammedia','rabat','settat'],
  rabat:['sale','temara','kenitra'],
  marrakech:['casablanca','agadir','essaouira'],
  tanger:['tetouan','chefchaouen','larache'],
  agadir:['marrakech','tiznit','guelmim'],
  fes:['meknes','taza','ifrane'],
  meknes:['fes','rabat','khemisset'],
  oujda:['nador','berkane','taza'],
};

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function setOG(prop, content) {
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function injectSchema(data) {
  let el = document.getElementById('ld-json-landing');
  if (!el) { el = document.createElement('script'); el.id = 'ld-json-landing'; el.type = 'application/ld+json'; document.head.appendChild(el); }
  el.textContent = JSON.stringify(data);
}

export default function LandingPage({ serviceSlug, citySlug }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const svc = SERVICE_MAP[serviceSlug];
  const city = CITY_MAP[citySlug];

  useEffect(() => {
    if (!svc || !city) return;

    const title = `${svc.label} à ${city} — profils et contact | Snay3i.ma`;
    const desc = `Recherchez un ${svc.pro} à ${city} sur Snay3i.ma. Consultez les informations disponibles et contactez directement le professionnel pour préciser votre besoin et demander un devis. 🇲🇦`;
    document.title = title;
    setMeta('description', desc);
    setCanonical(`https://snay3i.ma/artisan/${serviceSlug}/${citySlug}`);
    setMeta('keywords', `${svc.label.toLowerCase()} ${city.toLowerCase()}, ${svc.ar} ${city}, artisan ${city.toLowerCase()}, maalem ${city.toLowerCase()}, ${svc.label.toLowerCase()} maroc`);
    setOG('og:title', title);
    setOG('og:description', desc);
    setOG('og:url', `https://snay3i.ma/artisan/${serviceSlug}/${citySlug}`);

    // FAQ + Service Schema
    injectSchema([
      {
        "@context":"https://schema.org",
        "@type":"CollectionPage",
        "name":`${svc.label} à ${city}`,
        "description":`${svc.desc} à ${city}. Consultez les informations disponibles sur les profils et contactez directement le professionnel.`,
        "isPartOf":{"@type":"WebSite","name":"Snay3i.ma","url":"https://snay3i.ma"},
        "about":{"@type":"Thing","name":svc.label},
        "spatialCoverage":{"@type":"City","name":city,"addressCountry":"MA"}
      },
      {
        "@context":"https://schema.org",
        "@type":"FAQPage",
        "mainEntity":[
          {"@type":"Question","name":`Quel est le tarif d'un ${svc.pro} à ${city}?`,"acceptedAnswer":{"@type":"Answer","text":`Les tarifs varient selon l'intervention. Contactez les ${svc.proPlural} proposés à ${city} pour demander un devis et confirmer les conditions.`}},
          {"@type":"Question","name":`Y a-t-il des ${svc.proPlural} dont les horaires peuvent varier selon le professionnel à ${city}?`,"acceptedAnswer":{"@type":"Answer","text":`La disponibilité dépend de chaque professionnel. Vérifiez directement les horaires et les conditions d'intervention avant de vous déplacer ou de demander un rendez-vous.`}},
          {"@type":"Question","name":`Comment trouver un ${svc.pro} fiable à ${city}?`,"acceptedAnswer":{"@type":"Answer","text":`Consultez les informations réellement affichées sur chaque profil et posez vos questions au professionnel avant de confirmer la prestation.`}},
          {"@type":"Question","name":`Comment contacter un ${svc.pro} à ${city}?`,"acceptedAnswer":{"@type":"Answer","text":`Cliquez sur le profil du ${svc.pro} sur Snay3i.ma puis utilisez les coordonnées affichées pour confirmer directement le besoin et les conditions.`}},
        ]
      }
    ]);

    fetch(`${API_BASE}/search?service=${svc.id}&city=${encodeURIComponent(city)}`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : [];
        setWorkers(list);
        setLoading(false);
        setMeta('robots', 'noindex, follow');
      })
      .catch(() => setLoading(false));
  }, [svc, city, serviceSlug, citySlug]);

  if (!svc || !city) return (
    <div style={{textAlign:'center',padding:60,fontFamily:'system-ui,sans-serif'}}>
      <h1 style={{color:'#0D1B2A'}}>Page introuvable</h1>
      <a href="/" style={{color:'#C4622D',fontWeight:700}}>← Retour à Snay3i.ma</a>
    </div>
  );

  const nearby = (NEARBY[citySlug] || []).slice(0,3);
  const otherServices = Object.entries(SERVICE_MAP).filter(([k])=>k!==serviceSlug).slice(0,4);

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>

      {/* Header */}
      <div style={{background:'#0D1B2A',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:10}}>
          <picture><source srcSet="/logo.webp" type="image/webp"/><img src="/logo.png" alt="Snay3i.ma" width="40" height="40" style={{height:40,objectFit:'contain'}}/></picture>
        </a>
        <a href="/" style={{color:'#D4A843',fontWeight:700,fontSize:13,textDecoration:'none'}}>Voir tous les artisans →</a>
      </div>

      {/* Breadcrumb */}
      <div style={{background:'#F0EAE0',padding:'8px 24px',fontSize:12,color:'#7A7065'}}>
        <a href="/" style={{color:'#C4622D',textDecoration:'none'}}>Snay3i.ma</a>
        {' › '}
        <a href={`/artisan/${serviceSlug}/casablanca`} style={{color:'#C4622D',textDecoration:'none'}}>{svc.label}</a>
        {' › '}
        <span style={{color:'#0D1B2A',fontWeight:600}}>{city}</span>
      </div>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0D1B2A 0%,#1A2E42 100%)',padding:'40px 24px',textAlign:'center'}}>
        <div style={{fontSize:52,marginBottom:10}}>{svc.emoji}</div>
        <h1 style={{fontSize:28,fontWeight:800,color:'#fff',margin:'0 0 8px',lineHeight:1.3}}>
          {svc.label} à {city}
        </h1>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:15,margin:'0 0 6px'}}>
          {svc.desc} — Consultez les profils disponibles
        </p>
        <p style={{color:'#D4A843',fontSize:13,margin:0}}>{svc.ar} • {city} • 🇲🇦 Profils et contact direct</p>
      </div>

      {/* Stats */}
      <div style={{background:'#C4622D',padding:'10px 24px',display:'flex',justifyContent:'center',gap:28,flexWrap:'wrap'}}>
        {[
          {n:loading?'..':workers.length, l:`${svc.proPlural} trouvés`},
          {n:'Infos', l:'Profils disponibles'},
          {n:'Direct', l:'Contact professionnel'},
          {n:'Devis', l:'Conditions à confirmer'},
        ].map(s=>(
          <div key={s.l} style={{textAlign:'center',color:'#fff'}}>
            <div style={{fontSize:18,fontWeight:800}}>{s.n}</div>
            <div style={{fontSize:10,opacity:0.9}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:720,margin:'0 auto',padding:'24px 16px'}}>

        {/* H2: Results */}
        <h2 style={{fontSize:18,fontWeight:700,color:'#0D1B2A',marginBottom:16}}>
          {svc.emoji} {cap(svc.proPlural)} proposés à {city}
        </h2>

        {loading ? (
          <div style={{textAlign:'center',padding:40,color:'#7A7065'}}>Chargement...</div>
        ) : workers.length === 0 ? (
          <div style={{textAlign:'center',padding:40,background:'#fff',borderRadius:16,border:'1.5px solid #E8E0D4'}}>
            <p style={{color:'#7A7065',marginBottom:8,fontWeight:700}}>Aucun professionnel inscrit ici pour le moment.</p>
            <p style={{color:'#7A7065',marginBottom:16,fontSize:13}}>Soyez parmi les premiers artisans de cette ville sur Snay3i.ma.</p>
            <a href="/" style={{background:'#C4622D',color:'#fff',padding:'12px 24px',borderRadius:24,textDecoration:'none',fontWeight:700}}>Voir tous les artisans →</a>
          </div>
        ) : workers.map((w,i) => (
          <div key={i} style={{background:'#fff',borderRadius:16,padding:20,marginBottom:12,border:'1.5px solid #E8E0D4',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:10}}>
              <div style={{width:46,height:46,borderRadius:12,background:'#0D1B2A',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,flexShrink:0}}>
                {w.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                  <span style={{fontWeight:700,color:'#0D1B2A',fontSize:15}}>{w.name}</span>
                </div>
                <div style={{fontSize:12,color:'#7A7065',marginTop:3}}>📍 {w.city} • {w.years_exp} ans exp.</div>
              </div>
            </div>
            {w.bio && <p style={{fontSize:13,color:'#7A7065',lineHeight:1.6,margin:'0 0 12px'}}>{w.bio}</p>}
            <div style={{display:'flex',gap:8}}>
              <a onClick={()=>trackEvent('call_click', serviceSlug, citySlug)} href={`tel:${w.phone}`} style={{flex:1,background:'#EAF4FB',color:'#0F5248',border:'1.5px solid #D5E8F5',borderRadius:10,padding:'10px',textAlign:'center',textDecoration:'none',fontWeight:700,fontSize:13}}>📞 Appeler</a>
              <a onClick={()=>trackEvent('whatsapp_click', serviceSlug, citySlug)} href={`https://wa.me/${(w.whatsapp||'').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{flex:1,background:'#F0FBF0',color:'#1A6B3A',border:'1.5px solid #C8E6C0',borderRadius:10,padding:'10px',textAlign:'center',textDecoration:'none',fontWeight:700,fontSize:13}}>💬 WhatsApp</a>
            </div>
          </div>
        ))}

        {/* H2: Why Snay3i */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:20,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:16,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>
            Pourquoi choisir Snay3i.ma pour trouver un {svc.pro} à {city}?
          </h2>
          {[
            ['🔎','Recherche structurée','Consultez les profils proposés pour ce métier et cette ville.'],
            ['⭐','Informations de profil','Comparez les informations, avis et réalisations lorsqu’ils sont disponibles.'],
            ['📞','Contact à confirmer','La disponibilité, le prix et les conditions dépendent de chaque professionnel.'],
            ['🇲🇦','Métiers et villes','Les profils disponibles varient selon le métier, la ville et les données publiées.'],
          ].map(([icon,title,text])=>(
            <div key={title} style={{display:'flex',gap:12,marginBottom:12}}>
              <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
              <div>
                <div style={{fontWeight:700,color:'#0D1B2A',fontSize:13,marginBottom:2}}>{title}</div>
                <div style={{color:'#7A7065',fontSize:12,lineHeight:1.5}}>{text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* H2: SEO text */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:12,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:16,fontWeight:700,color:'#0D1B2A',marginBottom:10}}>
            {svc.label} à {city} — Tout ce que vous devez savoir
          </h2>
          <p style={{fontSize:13,color:'#7A7065',lineHeight:1.8,margin:0}}>
            Snay3i.ma aide à rechercher un {svc.pro} à {city} et à consulter les informations publiées sur les profils proposés.
            Pour {svc.desc.toLowerCase()}, décrivez précisément votre besoin et comparez les éléments disponibles avant de contacter un professionnel.
            Les avis, badges, coordonnées et autres informations varient selon chaque profil et ne constituent pas une garantie de résultat.
            Confirmez directement le prix, la disponibilité, le déplacement et les conditions avant toute prestation.
          </p>
        </div>

        {/* FAQ */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:12,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:16,fontWeight:700,color:'#0D1B2A',marginBottom:16}}>
            ❓ FAQ — {svc.label} à {city}
          </h2>
          {[
            [`Quel est le tarif d'un ${svc.pro} à ${city}?`, `Les tarifs varient selon l'intervention et le professionnel. Demandez un devis et confirmez ce qu’il comprend avant de vous engager.`],
            [`Y a-t-il des ${svc.proPlural} dont les horaires peuvent varier selon le professionnel à ${city}?`, `La disponibilité dépend de chaque professionnel. Vérifiez directement les horaires et les conditions d'intervention avant de vous déplacer ou de demander un rendez-vous.`],
            [`Comment trouver un ${svc.pro} fiable à ${city}?`, `Consultez les informations, avis et réalisations lorsqu’ils sont disponibles, puis posez vos questions au professionnel avant de confirmer.`],
            [`Comment contacter un ${svc.pro} sur Snay3i.ma?`, `Cliquez sur un profil puis utilisez les coordonnées affichées pour contacter directement le professionnel.`],
          ].map(([q,a],i)=>(
            <div key={i} style={{borderBottom:i<3?'1px solid #F0EAE0':'none',paddingBottom:12,marginBottom:12}}>
              <div style={{fontWeight:700,color:'#0D1B2A',fontSize:13,marginBottom:4}}>Q: {q}</div>
              <div style={{color:'#7A7065',fontSize:12,lineHeight:1.6}}>→ {a}</div>
            </div>
          ))}
        </div>

        {/* Internal links: other services in same city */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:12,border:'1.5px solid #E8E0D4'}}>
          <h2 style={{fontSize:14,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>
            Autres métiers à {city}
          </h2>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {otherServices.map(([slug,s])=>(
              <a key={slug} href={`/artisan/${slug}/${citySlug}`} style={{background:'#F5EFE8',color:'#C4622D',padding:'6px 14px',borderRadius:20,textDecoration:'none',fontSize:12,fontWeight:600}}>
                {s.emoji} {s.label} {city}
              </a>
            ))}
          </div>
        </div>

        {/* Internal links: same service in nearby cities */}
        {nearby.length>0 && (
          <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:12,border:'1.5px solid #E8E0D4'}}>
            <h2 style={{fontSize:14,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>
              {cap(svc.proPlural)} dans les villes proches
            </h2>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {nearby.map(slug=>(
                <a key={slug} href={`/artisan/${serviceSlug}/${slug}`} style={{background:'#F5EFE8',color:'#C4622D',padding:'6px 14px',borderRadius:20,textDecoration:'none',fontSize:12,fontWeight:600}}>
                  {svc.emoji} {svc.label} {CITY_MAP[slug]||slug}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{background:'#0D1B2A',borderRadius:20,padding:28,textAlign:'center',marginTop:16}}>
          <div style={{fontSize:32,marginBottom:8}}>{svc.emoji}</div>
          <h3 style={{color:'#fff',fontSize:16,fontWeight:700,margin:'0 0 6px'}}>
            Vous êtes {svc.pro} à {city}?
          </h3>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:12,margin:'0 0 16px'}}>
            Créez votre profil sur Snay3i.ma et présentez clairement vos services et votre zone d’intervention
          </p>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'12px 28px',borderRadius:24,textDecoration:'none',fontWeight:800,fontSize:14}}>
            Créer mon profil →
          </a>
        </div>

        <div style={{textAlign:'center',marginTop:20,paddingBottom:32}}>
          <a href="/" style={{color:'#C4622D',fontWeight:700,textDecoration:'none',fontSize:13}}>
            ← Retour à Snay3i.ma — Rechercher des artisans au Maroc 🇲🇦
          </a>
        </div>
      </div>
    </div>
  );
}
