import React, { useState, useEffect } from 'react';

const API_BASE = 'https://snay3i-backend.onrender.com';

const SERVICE_MAP = {
  plombier: { id: 'plumber', label: 'Plombier', ar: 'سبّاك', emoji: '🔧' },
  electricien: { id: 'electrician', label: 'Electricien', ar: 'كهربائي', emoji: '⚡' },
  macon: { id: 'builder', label: 'Macon', ar: 'بنّاء', emoji: '🧱' },
  bricoleur: { id: 'handyman', label: 'Bricoleur', ar: 'مصلح', emoji: '🔨' },
  peintre: { id: 'painter', label: 'Peintre', ar: 'نقّاش', emoji: '🎨' },
  menuisier: { id: 'carpenter', label: 'Menuisier', ar: 'نجّار', emoji: '🪚' },
  carreleur: { id: 'tiler', label: 'Carreleur', ar: 'بلاّط', emoji: '🏛️' },
  climatisation: { id: 'ac_tech', label: 'Climatisation', ar: 'تكييف', emoji: '❄️' },
  serrurier: { id: 'locksmith', label: 'Serrurier', ar: 'قفّال', emoji: '🔑' },
  menage: { id: 'cleaner', label: 'Menage', ar: 'تنظيف', emoji: '🧹' },
  jardinier: { id: 'gardener', label: 'Jardinier', ar: 'بستاني', emoji: '🌿' },
  soudeur: { id: 'welder', label: 'Soudeur', ar: 'لحّام', emoji: '🔥' },
};

const CITY_MAP = {
  casablanca:'Casablanca',rabat:'Rabat',marrakech:'Marrakech',fes:'Fes',
  tanger:'Tanger',agadir:'Agadir',meknes:'Meknes',oujda:'Oujda',
  nador:'Nador',tetouan:'Tetouan',sale:'Sale',kenitra:'Kenitra',
  'al-hoceima':'Al Hoceima',chefchaouen:'Chefchaouen',larache:'Larache',
  'el-jadida':'El Jadida',safi:'Safi',essaouira:'Essaouira',settat:'Settat',
  mohammedia:'Mohammedia','beni-mellal':'Beni Mellal',khouribga:'Khouribga',
  ouarzazate:'Ouarzazate',errachidia:'Errachidia',taza:'Taza',berkane:'Berkane',
  taroudannt:'Taroudannt',tiznit:'Tiznit',guelmim:'Guelmim',laayoune:'Laayoune',
  dakhla:'Dakhla',temara:'Temara','tan-tan':'Tan-Tan','sidi-kacem':'Sidi Kacem',
  khemisset:'Khemisset',
};

export default function LandingPage({ serviceSlug, citySlug }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const svc = SERVICE_MAP[serviceSlug];
  const city = CITY_MAP[citySlug];

  useEffect(() => {
    if (!svc || !city) return;
    document.title = svc.label + ' ' + city + ' — Snay3i.ma | Artisan verifie au Maroc';
    fetch(API_BASE + '/search?service=' + svc.id + '&city=' + encodeURIComponent(city))
      .then(r => r.json())
      .then(d => { setWorkers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [svc, city]);

  if (!svc || !city) return (
    <div style={{textAlign:'center',padding:60}}>
      <h1>Page introuvable</h1>
      <a href="/">Retour a Snay3i.ma</a>
    </div>
  );

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <div style={{background:'#0D1B2A',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/"><img src="/logo.png" alt="Snay3i.ma" style={{height:44}}/></a>
        <a href="/" style={{color:'#D4A843',fontWeight:700,fontSize:14,textDecoration:'none'}}>Voir tous les artisans</a>
      </div>
      <div style={{background:'#0D1B2A',padding:'48px 24px',textAlign:'center'}}>
        <div style={{fontSize:48}}>{svc.emoji}</div>
        <h1 style={{fontSize:32,fontWeight:800,color:'#fff',margin:'12px 0 8px'}}>{svc.label} a {city}</h1>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:16,margin:0}}>Trouvez un artisan verifie — gratuitement</p>
      </div>
      <div style={{maxWidth:720,margin:'0 auto',padding:'24px 16px'}}>
        <h2 style={{fontSize:18,fontWeight:700,color:'#0D1B2A',marginBottom:16}}>
          {svc.emoji} {workers.length} {svc.label}s trouves a {city}
        </h2>
        {loading ? (
          <p style={{textAlign:'center',color:'#7A7065'}}>Chargement...</p>
        ) : workers.map((w,i) => (
          <div key={i} style={{background:'#fff',borderRadius:16,padding:20,marginBottom:14,border:'1.5px solid #E8E0D4'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div>
                <span style={{fontWeight:700,color:'#0D1B2A',fontSize:15}}>{w.name}</span>
                {w.verified && <span style={{marginLeft:8,background:'#D8F5E4',color:'#1A6B3A',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:20}}>Verifie</span>}
                <div style={{fontSize:12,color:'#7A7065',marginTop:4}}>{w.city} • {w.years_exp} ans exp.</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontWeight:700,color:'#D4A843'}}>{w.rating} ★</div>
                <div style={{fontSize:11,color:'#7A7065'}}>{w.reviews} avis</div>
              </div>
            </div>
            <p style={{fontSize:13,color:'#7A7065',marginBottom:14}}>{w.bio}</p>
            <div style={{display:'flex',gap:8}}>
              <a href={'tel:'+w.phone} style={{flex:1,background:'#EAF4FB',color:'#0F5248',border:'1.5px solid #D5E8F5',borderRadius:10,padding:10,textAlign:'center',textDecoration:'none',fontWeight:700}}>Appeler</a>
              <a href={'https://wa.me/'+(w.whatsapp||'').replace(/\D/g,'')} style={{flex:1,background:'#F0FBF0',color:'#1A6B3A',border:'1.5px solid #C8E6C0',borderRadius:10,padding:10,textAlign:'center',textDecoration:'none',fontWeight:700}}>WhatsApp</a>
            </div>
          </div>
        ))}
        <div style={{background:'#0D1B2A',borderRadius:20,padding:32,textAlign:'center',marginTop:24}}>
          <h3 style={{color:'#fff',fontSize:18,fontWeight:700,marginBottom:8}}>Vous etes {svc.label} a {city}?</h3>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:20}}>Rejoignez Snay3i.ma gratuitement</p>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'14px 32px',borderRadius:24,textDecoration:'none',fontWeight:800}}>Creer mon profil gratuit</a>
        </div>
        <div style={{textAlign:'center',marginTop:24,paddingBottom:32}}>
          <a href="/" style={{color:'#C4622D',fontWeight:700,textDecoration:'none'}}>Retour a Snay3i.ma</a>
        </div>
      </div>
    </div>
  );
}
