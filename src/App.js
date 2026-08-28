import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

function trackEvent(action, label) {
  if (window.gtag) {
    window.gtag('event', action, { 'event_category': 'engagement', 'event_label': label });
  }
}
function trackLeadEvent(method, label) {
  if (window.gtag) {
    window.gtag('event', 'lead_conversion', {
      event_category: 'lead',
      event_label: label,
      lead_method: method,
    });
  }
}


const API_BASE = "https://snay3i-backend.onrender.com";

const CATEGORIES = [
  { id: "all",         label: "Tous",          ar: "الكل",     emoji: "🏠" },
  { id: "plumber",     label: "Plombier",      ar: "سبّاك",    emoji: "🔧" },
  { id: "electrician", label: "Électricien",   ar: "كهربائي",  emoji: "⚡" },
  { id: "builder",     label: "Maçon",         ar: "بنّاء",    emoji: "🧱" },
  { id: "handyman",    label: "Bricoleur",     ar: "مصلح",     emoji: "🔨" },
  { id: "painter",     label: "Peintre",       ar: "نقّاش",    emoji: "🎨" },
  { id: "carpenter",   label: "Menuisier",     ar: "نجّار",    emoji: "🪚" },
  { id: "tiler",       label: "Carreleur",     ar: "بلاّط",    emoji: "🏛️" },
  { id: "ac_tech",     label: "Climatisation", ar: "تكييف",    emoji: "❄️" },
  { id: "locksmith",   label: "Serrurier",     ar: "قفّال",    emoji: "🔑" },
  { id: "cleaner",     label: "Ménage",        ar: "تنظيف",    emoji: "🧹" },
  { id: "gardener",    label: "Jardinier",     ar: "بستاني",   emoji: "🌿" },
  { id: "welder",      label: "Soudeur",       ar: "لحّام",    emoji: "🔥" },
];

const CITIES = [
  "Toutes",
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Nador","Tétouan","Salé","Kénitra",
  "Al Hoceima","Chefchaouen","Larache","Ksar El Kebir","Ouazzane",
  "El Jadida","Safi","Essaouira","Settat","Berrechid","Benslimane","Mohammedia",
  "Béni Mellal","Khouribga","Fkih Ben Salah","Azilal","Kasba Tadla",
  "Ouarzazate","Zagora","Tinghir","Errachidia","Midelt","Rissani",
  "Taroudannt","Tiznit","Guelmim","Inezgane","Ait Melloul","Sidi Ifni","Tan-Tan",
  "Laâyoune","Dakhla","Boujdour","Smara","Tarfaya","Aousserd",
  "Taza","Ifrane","Khénifra","Berkane","Taourirt","Guercif","Jerada",
  "Témara","Skhirat","Sidi Kacem","Sidi Slimane","Khémisset",
  "Fnideq","Martil","M'diq","Tetouan",
  "Youssoufia","Kelaa des Sraghna","Chichaoua",
  "Ait Benhaddou","Kelaat M'Gouna",
  "Nador","Berkane","Saïdia",
];

const CITY_COORDS = {
  // ── Major cities ─────────────────────────────────────────────
  Casablanca:    { lat:33.5731,  lng:-7.5898  },
  Rabat:         { lat:34.0209,  lng:-6.8416  },
  Marrakech:     { lat:31.6295,  lng:-7.9811  },
  Fes:           { lat:34.0181,  lng:-5.0078  },
  "Fès":         { lat:34.0181,  lng:-5.0078  },
  Tanger:        { lat:35.7595,  lng:-5.8340  },
  Agadir:        { lat:30.4278,  lng:-9.5981  },
  Meknes:        { lat:33.8935,  lng:-5.5473  },
  "Meknès":      { lat:33.8935,  lng:-5.5473  },
  Oujda:         { lat:34.6814,  lng:-1.9086  },
  Nador:         { lat:35.1680,  lng:-2.9287  },
  Tetouan:       { lat:35.5785,  lng:-5.3684  },
  "Tétouan":     { lat:35.5785,  lng:-5.3684  },
  Sale:          { lat:34.0531,  lng:-6.7985  },
  "Salé":        { lat:34.0531,  lng:-6.7985  },
  Kenitra:       { lat:34.2610,  lng:-6.5802  },
  "Kénitra":     { lat:34.2610,  lng:-6.5802  },
  // ── North ────────────────────────────────────────────────────
  "Al Hoceima":  { lat:35.2517,  lng:-3.9372  },
  Chefchaouen:   { lat:35.1688,  lng:-5.2636  },
  Larache:       { lat:35.1932,  lng:-6.1561  },
  "Ksar El Kebir":{ lat:35.0015, lng:-5.9070  },
  Berkane:       { lat:34.9200,  lng:-2.3200  },
  Taza:          { lat:34.2100,  lng:-4.0100  },
  Jerada:        { lat:34.3100,  lng:-2.1600  },
  Taourirt:      { lat:34.4067,  lng:-2.8942  },
  Guercif:       { lat:34.2285,  lng:-3.3556  },
  Fnideq:        { lat:35.8464,  lng:-5.3571  },
  Martil:        { lat:35.6186,  lng:-5.2747  },
  "M'diq":       { lat:35.6876,  lng:-5.3268  },
  "Saïdia":      { lat:35.0878,  lng:-2.2278  },
  // ── Atlantic coast ───────────────────────────────────────────
  Mohammedia:    { lat:33.6861,  lng:-7.3832  },
  Berrechid:     { lat:33.2650,  lng:-7.5886  },
  Benslimane:    { lat:33.6186,  lng:-7.1218  },
  "El Jadida":   { lat:33.2316,  lng:-8.5007  },
  Safi:          { lat:32.2994,  lng:-9.2372  },
  Essaouira:     { lat:31.5085,  lng:-9.7595  },
  // ── Rabat region ────────────────────────────────────────────
  "Témara":      { lat:33.9268,  lng:-6.9069  },
  Temara:        { lat:33.9268,  lng:-6.9069  },
  Skhirat:       { lat:33.8500,  lng:-7.0333  },
  "Sidi Kacem":  { lat:34.2241,  lng:-5.7062  },
  "Sidi Slimane":{ lat:34.2594,  lng:-5.9259  },
  "Khémisset":   { lat:33.8239,  lng:-6.0660  },
  // ── Centre & Settat ─────────────────────────────────────────
  Settat:        { lat:33.0016,  lng:-7.6199  },
  Khouribga:     { lat:32.8811,  lng:-6.9063  },
  Youssoufia:    { lat:32.2439,  lng:-8.5298  },
  "Kelaa des Sraghna":{ lat:32.0517, lng:-7.4100 },
  // ── Beni Mellal-Khenifra ────────────────────────────────────
  "Beni Mellal": { lat:32.3372,  lng:-6.3498  },
  "Béni Mellal": { lat:32.3372,  lng:-6.3498  },
  "Fkih Ben Salah":{ lat:32.5006, lng:-6.6869 },
  Azilal:        { lat:31.9654,  lng:-6.5706  },
  "Kasba Tadla": { lat:32.5960,  lng:-6.2681  },
  "Khénifra":    { lat:32.9381,  lng:-5.6667  },
  Ifrane:        { lat:33.5228,  lng:-5.1085  },
  Midelt:        { lat:32.6845,  lng:-4.7314  },
  // ── South-east ───────────────────────────────────────────────
  Ouarzazate:    { lat:30.9189,  lng:-6.8934  },
  Errachidia:    { lat:31.9299,  lng:-4.4247  },
  Tinghir:       { lat:31.5167,  lng:-5.5333  },
  Zagora:        { lat:30.3285,  lng:-5.8380  },
  Rissani:       { lat:31.2800,  lng:-4.2667  },
  "Kelaat M'Gouna":{ lat:31.2333, lng:-6.1333 },
  "Ait Benhaddou":{ lat:31.0469, lng:-7.1300  },
  // ── Souss-Massa ─────────────────────────────────────────────
  Taroudannt:    { lat:30.4728,  lng:-8.8780  },
  Tiznit:        { lat:29.6978,  lng:-9.7328  },
  Inezgane:      { lat:30.3570,  lng:-9.5382  },
  "Ait Melloul": { lat:30.3333,  lng:-9.5000  },
  "Sidi Ifni":   { lat:29.3797,  lng:-10.1726 },
  // ── Deep south ───────────────────────────────────────────────
  Guelmim:       { lat:28.9870,  lng:-10.0574 },
  "Tan-Tan":     { lat:28.4380,  lng:-11.1012 },
  "Laâyoune":    { lat:27.1536,  lng:-13.2033 },
  Laayoune:      { lat:27.1536,  lng:-13.2033 },
  Boujdour:      { lat:26.1249,  lng:-14.4850 },
  Smara:         { lat:26.7386,  lng:-11.6751 },
  Tarfaya:       { lat:27.9376,  lng:-12.9212 },
  Dakhla:        { lat:23.7136,  lng:-15.9355 },
  Aousserd:      { lat:22.9007,  lng:-14.3264 },
  Chichaoua:     { lat:31.5385,  lng:-8.7640  },
};

const AVATAR_COLORS = [
  ["#B85C2C","#FBE9DF"],["#1A5C4A","#D8F0E8"],["#6B3A9E","#EDE0F8"],
  ["#145080","#D5E8F5"],["#7A4F00","#FBF0DC"],["#9C2752","#F8DDE8"],
];

function haversineKm(la1,ln1,la2,ln2){
  const R=6371,dL=((la2-la1)*Math.PI)/180,dN=((ln2-ln1)*Math.PI)/180;
  const a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dN/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function getNearestCity(lat,lng){
  let nearest=null,min=Infinity;
  for(const [city,c] of Object.entries(CITY_COORDS)){
    const d=haversineKm(lat,lng,c.lat,c.lng);
    if(d<min){min=d;nearest=city;}
  }
  return {city:nearest,km:min};
}

function workerDist(worker,uLat,uLng){
  const c=CITY_COORDS[worker.city];
  if(!c)return null;
  const km=haversineKm(uLat,uLng,c.lat,c.lng);
  return km<1?`${Math.round(km*1000)} m`:`${km.toFixed(1)} km`;
}

function avatarColor(name){return AVATAR_COLORS[name.charCodeAt(0)%AVATAR_COLORS.length];}
function initials(name){return name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();}
function catEmoji(s){return CATEGORIES.find(c=>c.id===s)?.emoji||"🔧";}
function catLabel(s){return CATEGORIES.find(c=>c.id===s)?.label||s;}

// ── AUTHENTIC ZELLIGE SVG ─────────────────────────────────────────
function ZelligeSVG({id="z1"}){
  return(
    <svg width="0" height="0" style={{position:"absolute"}}>
      <defs>
        <pattern id={id} x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Outer 8-pointed star - terracotta */}
          <polygon points="60,6 69,26 90,15 79,36 100,42 82,52 92,72 70,66 67,90 60,72 53,90 50,66 28,72 38,52 20,42 41,36 30,15 51,26"
            fill="none" stroke="#C4622D" strokeWidth="1.5"/>
          {/* Inner star - gold */}
          <polygon points="60,18 67,32 82,26 75,40 90,45 76,53 84,67 68,63 66,80 60,65 54,80 52,63 36,67 44,53 30,45 45,40 38,26 53,32"
            fill="none" stroke="#D4A843" strokeWidth="1"/>
          {/* Diamond center - cobalt */}
          <polygon points="60,32 70,42 60,52 50,42" fill="none" stroke="#2355A0" strokeWidth="1.2"/>
          {/* Corner diamonds */}
          <polygon points="0,0 12,0 12,12 0,12" fill="none" stroke="#1E8A8A" strokeWidth="0.8" transform="rotate(45 6 6) translate(-4.2 -4.2)"/>
          <polygon points="108,0 120,0 120,12 108,12" fill="none" stroke="#1E8A8A" strokeWidth="0.8" transform="rotate(45 114 6) translate(-4.2 -4.2)"/>
          <polygon points="0,108 12,108 12,120 0,120" fill="none" stroke="#1E8A8A" strokeWidth="0.8" transform="rotate(45 6 114) translate(-4.2 -4.2)"/>
          <polygon points="108,108 120,108 120,120 108,120" fill="none" stroke="#1E8A8A" strokeWidth="0.8" transform="rotate(45 114 114) translate(-4.2 -4.2)"/>
          {/* Connecting lines */}
          <line x1="60" y1="0" x2="60" y2="120" stroke="#C4622D" strokeWidth="0.4" strokeDasharray="3,9"/>
          <line x1="0" y1="60" x2="120" y2="60" stroke="#C4622D" strokeWidth="0.4" strokeDasharray="3,9"/>
          <line x1="0" y1="0" x2="120" y2="120" stroke="#D4A843" strokeWidth="0.3" strokeDasharray="2,10"/>
          <line x1="120" y1="0" x2="0" y2="120" stroke="#D4A843" strokeWidth="0.3" strokeDasharray="2,10"/>
        </pattern>
      </defs>
    </svg>
  );
}

// ── STARS ─────────────────────────────────────────────────────────
function Stars({rating}){
  return(
    <div className="stars-row">
      {[1,2,3,4,5].map(s=>(
        <svg key={s} width="14" height="14" viewBox="0 0 14 14">
          <polygon points="7,1 8.8,5 13,5.4 9.8,8.3 10.8,12.6 7,10.4 3.2,12.6 4.2,8.3 1,5.4 5.2,5"
            fill={s<=Math.round(rating)?"#D4A843":"#E0D8CC"} />
        </svg>
      ))}
      <span className="rating-num">{rating}</span>
    </div>
  );
}

// ── CONTACT MODAL ────────────────────────────────────────────────
function ContactModal({worker, onClose}){
  const [bg] = avatarColor(worker.name);
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header" style={{background:bg}}>
          <ZelligeSVG id="mz"/>
          <div className="modal-header-inner" style={{backgroundImage:`url(#mz)`}}>
            <div className="modal-avatar" style={{background:"rgba(255,255,255,0.2)",color:"#fff"}}>
              {initials(worker.name)}
              <span className="modal-avatar-emoji">{catEmoji(worker.service)}</span>
            </div>
            <div className="modal-identity">
              <h2 className="modal-name">{worker.name}</h2>
              <p className="modal-service">{catEmoji(worker.service)} {catLabel(worker.service)} • {worker.city}</p>
              <div className="modal-verified">
                {worker.verified && <span className="vpill">✓ Vérifié • موثوق</span>}
                <span className="exp-pill">⏱ {worker.years_exp} ans d'expérience</span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h4 className="modal-section-title">À propos</h4>
            <p className="modal-bio">{worker.bio}</p>
          </div>
          <div className="modal-section">
            <h4 className="modal-section-title">Adresse • العنوان</h4>
            <div className="contact-row"><span>📍</span><span>{worker.address}</span></div>
          </div>
          <div className="modal-section">
            <h4 className="modal-section-title">Contact • تواصل</h4>
            <a onClick={() => { trackEvent('call_click','card_'+worker.service); trackLeadEvent('call','card_'+worker.service); }} className="contact-btn phone" href={`tel:${worker.phone}`} >
              <span>📞</span><span>{worker.phone}</span>
            </a>
            <a onClick={() => { trackEvent('whatsapp_click','card_'+worker.service); trackLeadEvent('whatsapp','card_'+worker.service); }} className="contact-btn whatsapp" href={`https://wa.me/${(worker.whatsapp||"").replace(/\D/g,"")}`} target="_blank" rel="noreferrer">
              <span>💬</span><span>WhatsApp • واتساب</span>
            </a>
          </div>
          {worker.photos && worker.photos.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">Réalisations • أعمالي</h4>
              <div className="modal-portfolio">
                {worker.photos.map((url,i) => (
                  <img key={i} src={url} alt="" className="modal-portfolio-img"/>
                ))}
              </div>
            </div>
          )}

          <div className="modal-tags">
            {worker.tags.map(t=><span key={t} className="modal-tag">{t}</span>)}
          </div>
          <div className="modal-price-row">
            <span className="modal-price">Devis gratuit</span>
            <Stars rating={worker.rating}/>
            <span className="modal-reviews">{worker.reviews > 0 ? `${worker.reviews} avis` : "Aucun avis pour le moment"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WORKER CARD ──────────────────────────────────────────────────
function WorkerCard({worker,index,userLoc}){
  const [bg,tc]=avatarColor(worker.name);
  const storageKey=`snay3i_fav_${worker.id}`;
  const [faved,setFaved]=useState(()=>{
    try{return localStorage.getItem(storageKey)==="1";}catch{return false;}
  });
  const toggleFav=e=>{
    e.stopPropagation();
    const next=!faved; setFaved(next);
    try{next?localStorage.setItem(storageKey,"1"):localStorage.removeItem(storageKey);}catch{}
  };
  const [chat,setChat]=useState(false);
  const [profile,setProfile]=useState(false);
  const [modal,setModal]=useState(false);
  const dist=userLoc?workerDist(worker,userLoc.lat,userLoc.lng):null;

  return(
    <>
      {modal && <ContactModal worker={worker} onClose={()=>setModal(false)}/>}
      {chat && <ChatWindow worker={worker} onClose={()=>setChat(false)}/>}
      {profile && <ProfilePage worker={worker} onClose={()=>setProfile(false)}/>}
      <div className="card" style={{animationDelay:`${index*80}ms`}}>
        {/* Zellige corner */}
        <div className="card-zel-corner">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="40,3 47,16 60,9 53,22 67,26 56,34 63,47 49,44 47,58 40,48 33,58 31,44 17,47 24,34 13,26 27,22 20,9 33,16"
              stroke="#C4622D" strokeWidth="1.2" opacity="0.25"/>
            <polygon points="40,13 45,21 55,17 49,27 60,30 51,36 57,47 45,44 44,55 40,47 36,55 35,44 23,47 29,36 20,30 31,27 25,17 35,21"
              stroke="#D4A843" strokeWidth="0.8" opacity="0.2"/>
          </svg>
        </div>

        <div className="card-top-strip" style={{background:bg}}/>

        <div className="card-head">
          <div className="card-avatar" style={{background:bg,color:tc}}>
            {initials(worker.name)}
            <span className="card-emoji">{catEmoji(worker.service)}</span>
          </div>
          <div className="card-meta-info">
            <div className="card-name-row">
              <span className="card-name">{worker.name}</span>
              {worker.verified&&<span className="v-pill">✓</span>}
            </div>
            <span className="card-service-pill">{catEmoji(worker.service)} {catLabel(worker.service)}</span>
          </div>
          <div className="card-price-tag">Devis gratuit</div>
        </div>

        {/* Location ping */}
        <div className="card-loc">
          <div className="ping"><div className="ping-core"/><div className="ping-ring"/></div>
          <span className="card-city">{worker.city}</span>
          {dist&&<span className="dist-chip">📍 {dist}</span>}
          <span className="avail">🟡 Disponibilité à confirmer</span>
        </div>

        <p className="card-bio">{worker.bio}</p>

        <div className="card-rating-row">
          <Stars rating={worker.rating}/>
          <span className="card-reviews">{worker.reviews > 0 ? `${worker.reviews} avis` : "Aucun avis pour le moment"} • {worker.years_exp} ans exp.</span>
        </div>

        <div className="card-tags">
          {worker.tags.map(t=><span key={t} className="card-tag">{t}</span>)}
        </div>

        {worker.photos && worker.photos.length > 0 && (
          <div className="card-portfolio">
            {worker.photos.slice(0,3).map((url,i) => (
              <img key={i} src={url} alt="" className="portfolio-thumb"/>
            ))}
            {worker.photos.length > 3 && (
              <div className="portfolio-more">+{worker.photos.length - 3}</div>
            )}
          </div>
        )}

        <div className="card-actions">
          <a className="btn-call" href={"tel:"+worker.phone} onClick={e=>e.stopPropagation()}>
            📞
          </a>
          <a className="btn-wa" aria-label="Contacter par WhatsApp" onClick={e=>{e.stopPropagation();trackEvent('whatsapp_click','list_'+worker.service);}} href={"https://wa.me/"+(worker.whatsapp||"").replace(/\D/g,"")} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <button className="btn-profile" onClick={e=>{e.stopPropagation();setProfile(true);}}>
            👤 Profil
          </button>
          <button className="btn-chat-icon" onClick={e=>{e.stopPropagation();setChat(true);}}>
            ✉️
          </button>

          <button className={`btn-fav${faved?" faved":""}`} onClick={toggleFav}>
            {faved?"♥":"♡"}
          </button>
        </div>
      </div>
    </>
  );
}

function SkeletonCard(){
  return(
    <div className="card skeleton-card">
      <div className="card-top-strip" style={{background:"#E8E2D9"}}/>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div className="skel" style={{width:56,height:56,borderRadius:16,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div className="skel" style={{width:"60%",height:14,marginBottom:8}}/>
          <div className="skel" style={{width:"40%",height:12}}/>
        </div>
      </div>
      <div className="skel" style={{width:"85%",height:12,marginBottom:8}}/>
      <div className="skel" style={{width:"95%",height:12,marginBottom:8}}/>
      <div className="skel" style={{width:"55%",height:12}}/>
    </div>
  );
}


// ── CHAT WINDOW ───────────────────────────────────────────────────
const SESSION_ID = "session_" + Math.random().toString(36).slice(2,9);

function ChatWindow({worker, onClose}){
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [aiActive, setAiActive] = useState(true); // tracks if AI is available
  const bottomRef = useRef(null);
  const [bg] = avatarColor(worker.name);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/${worker.id}/${SESSION_ID}`);
      const data = await res.json();
      if(Array.isArray(data)) setMsgs(data);
    } catch(e) {}
  }, [worker.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadMessages(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const sendMsg = async (text, sender="client") => {
    if(!text.trim()) return;
    setSending(true);
    try {
      // 1. Store client message
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id: worker.id, session_id: SESSION_ID, sender, text })
      });
      const msg = await res.json();
      setMsgs(prev => [...prev, msg]);

      // 2. Get AI reply
      if(sender === "client") {
        setTyping(true);

        // Build history: existing msgs + new client message, formatted for Claude
        const historyForAI = [...msgs, msg].map(m => ({
          role: m.sender === "client" ? "user" : "assistant",
          content: m.text,
        }));

        let replyText = "Je vous répondrai très vite. Vous pouvez aussi m'appeler directement.";
        try {
          const aiRes = await fetch(`${API_BASE}/ai-reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ worker_id: worker.id, messages: historyForAI })
          });
          if(aiRes.ok) {
            const aiData = await aiRes.json();
            replyText = aiData.text;
            setAiActive(aiData.source === "ai");
          }
        } catch(e) { setAiActive(false); }

        setTyping(false);

        // 3. Store AI reply in DB
        const r2 = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ worker_id: worker.id, session_id: SESSION_ID, sender: "worker", text: replyText })
        });
        const msg2 = await r2.json();
        setMsgs(prev => [...prev, msg2]);
      }
    } catch(e) {}
    setSending(false);
    setInput("");
  };

  const handleKey = (e) => {
    if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(input); }
  };

  return(
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-window" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="chat-header" style={{background: bg}}>
          <div className="chat-avatar">
            {initials(worker.name)}
            <span className="chat-online" />
          </div>
          <div className="chat-header-info">
            <span className="chat-name">{worker.name}</span>
            <span className="chat-status">
              {typing
                ? "✨ En train de répondre..."
                : aiActive
                  ? `🟢 En ligne • ${catLabel(worker.service)} • ✨ IA`
                  : `🟢 En ligne • ${catLabel(worker.service)}`
              }
            </span>
          </div>
          <div className="chat-header-actions">
            <a href={"tel:" + worker.phone} className="chat-call-btn" title="Appeler">📞</a>
            <a onClick={()=>trackEvent('whatsapp_click','chat_'+worker.service)} href={"https://wa.me/" + (worker.whatsapp||"").replace(/\D/g,"")} target="_blank" rel="noreferrer" className="chat-wa-btn" title="WhatsApp">💬</a>
            <button className="chat-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {/* Welcome bubble */}
          <div className="chat-date-sep">Aujourd hui</div>

          {msgs.length === 0 && (
            <div className="chat-welcome">
              <div className="chat-welcome-avatar" style={{background: bg}}>
                {initials(worker.name)}
              </div>
              <div className="chat-welcome-bubble">
                <strong>{worker.name}</strong>
                <p>Bonjour ! Je suis {catLabel(worker.service)} a {worker.city}. Envoyez-moi votre demande et je vous repondrai rapidement.</p>
              </div>
            </div>
          )}

          {msgs.map(m => (
            <div key={m.id} className={`chat-msg ${m.sender === "client" ? "sent" : "received"}`}>
              <div className="chat-bubble">
                <p>{m.text}</p>
                <span className="chat-time">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {typing && (
            <div className="chat-msg received">
              <div className="chat-bubble typing-bubble">
                <span className="dot"/><span className="dot"/><span className="dot"/>
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* Quick replies */}
        <div className="chat-quick-replies">
          {["Quel est votre disponibilite ?","Pouvez-vous faire un devis ?","Urgence — venez vite !"].map(q => (
            <button key={q} className="quick-reply-btn" onClick={() => sendMsg(q)}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <textarea
            className="chat-input"
            placeholder="Ecrivez votre message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMsg(input)}
            disabled={!input.trim() || sending}
          >
            {sending ? "⌛" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── REGISTRATION PAGE ─────────────────────────────────────────────
const SERVICES_LIST = [
  { id: "plumber",     label: "Plombier",      ar: "سبّاك",    emoji: "🔧" },
  { id: "electrician", label: "Electricien",   ar: "كهربائي",  emoji: "⚡" },
  { id: "builder",     label: "Macon",         ar: "بنّاء",    emoji: "🧱" },
  { id: "handyman",    label: "Bricoleur",     ar: "مصلح",     emoji: "🔨" },
  { id: "painter",     label: "Peintre",       ar: "نقّاش",    emoji: "🎨" },
  { id: "carpenter",   label: "Menuisier",     ar: "نجّار",    emoji: "🪚" },
  { id: "tiler",       label: "Carreleur",     ar: "بلاّط",    emoji: "🏛️" },
  { id: "ac_tech",     label: "Climatisation", ar: "تكييف",    emoji: "❄️" },
  { id: "locksmith",   label: "Serrurier",     ar: "قفّال",    emoji: "🔑" },
  { id: "cleaner",     label: "Menage",        ar: "تنظيف",    emoji: "🧹" },
  { id: "gardener",    label: "Jardinier",     ar: "بستاني",   emoji: "🌿" },
  { id: "welder",      label: "Soudeur",       ar: "لحّام",    emoji: "🔥" },
];

// ── LEGAL MODAL ────────────────────────────────────────────────────
const LEGAL_CONTENT = {
  about:{
    title:"À propos de Snay3i.ma",
    body:`Snay3i.ma est une plateforme marocaine de mise en relation entre particuliers et artisans professionnels.

Notre mission : rendre accessible à tous les Marocains un artisan de confiance, rapidement et gratuitement.

Fondée en 2025, Snay3i.ma couvre plus de 30 villes au Maroc et propose des professionnels référencés dans 13 corps de métier : plomberie, électricité, maçonnerie, menuiserie, peinture, carrelage, climatisation, serrurerie, ménage, jardinage, soudure et plus encore.

La plateforme est entièrement gratuite, aussi bien pour les clients que pour les artisans.

🇲🇦 Fait avec fierté pour le Maroc.`
  },
  legal:{
    title:"Mentions légales",
    body:`ÉDITEUR DU SITE
Nom : Anass Couqua
Domicile : Londres, Royaume-Uni
Email : a.couqua@gmail.com
WhatsApp : +44 7999 393 290

Le site snay3i.ma est exploité à titre personnel. Il n'est pas encore rattaché à une entité juridique enregistrée.

HÉBERGEMENT
Frontend : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
Backend : Render Services Inc., San Francisco, CA, États-Unis

PROPRIÉTÉ INTELLECTUELLE
L'ensemble du contenu (textes, logos, interface, code) est la propriété exclusive d'Anass Couqua. Toute reproduction sans autorisation écrite est interdite.

RESPONSABILITÉ
Snay3i.ma est une plateforme de mise en relation. Elle ne saurait être tenue responsable des prestations réalisées par les artisans référencés.`
  },
  terms:{
    title:"Conditions Générales d'Utilisation",
    body:`Dernière mise à jour : mai 2025

1. OBJET
Les présentes CGU régissent l'utilisation de snay3i.ma, plateforme de mise en relation entre clients et artisans au Maroc.

2. ACCÈS AU SERVICE
Le service est accessible gratuitement. Snay3i.ma se réserve le droit de modifier ou d'interrompre le service à tout moment.

3. INSCRIPTION DES ARTISANS
L'inscription est libre et gratuite. L'artisan certifie que ses informations sont exactes. Snay3i.ma peut supprimer tout profil contenant des informations fausses.

4. RESPONSABILITÉ
Snay3i.ma est un intermédiaire de mise en relation uniquement. Elle décline toute responsabilité quant à la qualité des prestations ou aux litiges entre clients et artisans.

5. PROPRIÉTÉ INTELLECTUELLE
Le contenu du site est protégé. Toute reproduction non autorisée est interdite.

6. DROIT APPLICABLE
Les présentes CGU sont soumises au droit marocain.

Contact : a.couqua@gmail.com`
  },
  privacy:{
    title:"Politique de Confidentialité",
    body:`Dernière mise à jour : mai 2025

1. DONNÉES COLLECTÉES

Pour les visiteurs : Aucune donnée personnelle n'est collectée. Pas de cookies publicitaires.

Pour les artisans inscrits :
— Nom complet
— Numéro de téléphone et WhatsApp
— Ville et adresse
— Métier, description, années d'expérience

Ces données sont publiques et visibles par tous les visiteurs.

2. UTILISATION
Les données sont utilisées uniquement pour afficher le profil de l'artisan. Elles ne sont ni vendues ni partagées à des fins commerciales.

3. VOS DROITS
Droit d'accès, rectification et suppression : a.couqua@gmail.com

4. COOKIES
Uniquement des cookies techniques nécessaires au fonctionnement. Pas de tracking publicitaire.

5. HÉBERGEMENT
Données hébergées sur Render (USA), certifié SOC 2 Type II.

Contact : a.couqua@gmail.com`
  },
  contact:{
    title:"Nous contacter",
    body:`FONDATEUR
Anass Couqua — Londres, Royaume-Uni

EMAIL
a.couqua@gmail.com
Réponse sous 24-48h ouvrables

WHATSAPP
+44 7999 393 290

ARTISANS — Modifier ou supprimer votre profil
Envoyez votre nom et votre ville par email ou WhatsApp.

CLIENTS — Signaler un problème
Email : a.couqua@gmail.com

PARTENARIATS & MÉDIAS
a.couqua@gmail.com

🇲🇦 Snay3i.ma — Fait avec fierté pour le Maroc`
  }
};

function LegalModal({page, onClose}){
  const content = LEGAL_CONTENT[page];
  if(!content) return null;
  return(
    <div style={{
      position:"fixed",inset:0,zIndex:3000,
      background:"rgba(13,27,42,0.7)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      backdropFilter:"blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background:"var(--white)",borderRadius:"24px 24px 0 0",
        width:"100%",maxWidth:680,maxHeight:"85vh",
        display:"flex",flexDirection:"column",
        boxShadow:"0 -8px 40px rgba(0,0,0,0.2)",
      }} onClick={e=>e.stopPropagation()}>
        <div style={{
          padding:"20px 24px 16px",
          borderBottom:"1px solid var(--border)",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          flexShrink:0,
        }}>
          <h2 style={{fontSize:17,fontWeight:800,color:"var(--ink)",margin:0}}>{content.title}</h2>
          <button onClick={onClose} style={{
            background:"var(--cream)",border:"none",width:32,height:32,
            borderRadius:"50%",cursor:"pointer",fontSize:16,color:"var(--muted)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>✕</button>
        </div>
        <div style={{
          overflowY:"auto",padding:"20px 24px 40px",
          fontSize:14,lineHeight:1.75,color:"var(--muted)",
          whiteSpace:"pre-wrap",
        }}>
          {content.body}
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onBack, lang }) {
  const [step, setStep] = useState(1);
  const [acquisitionSource, setAcquisitionSource] = useState('direct');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source') || params.get('source') || 'direct';
      const medium = params.get('utm_medium') || '';
      const campaign = params.get('utm_campaign') || '';
      const attribution = [source, medium, campaign].filter(Boolean).join(' / ');
      setAcquisitionSource(attribution || 'direct');
      sessionStorage.setItem('snay3i_acquisition_source', attribution || 'direct');
    } catch {}
  }, []);
  const [form, setForm] = useState({
    name: "", service: "", city: "", phone: "", whatsapp: "", address: "", bio: "", years_exp: "", tags: "", photos: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        acquisition_source: (() => {
          try { return sessionStorage.getItem("snay3i_acquisition_source") || acquisitionSource || "direct"; }
          catch { return acquisitionSource || "direct"; }
        })(),
        years_exp: parseInt(form.years_exp) || 1,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        whatsapp: form.whatsapp || form.phone,
        verified: false,
        rating: 0,
        reviews: 0,
      };
      const res = await fetch(`${API_BASE}/workers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur lors de l inscription");
      setDone(true);
    } catch(e) {
      setError(e.message);
    }
    setSubmitting(false);
  };

  if (done) return (
    <div className="reg-success">
      <div className="reg-success-icon">🎉</div>
      <h2 className="reg-success-title">Bienvenue sur Snay3i.ma !</h2>
      <p className="reg-success-sub">Votre profil a été créé. Vérifiez les informations affichées et gardez-les à jour pour aider les clients à vous contacter.</p>
      <p className="reg-success-ar">مرحباً بك في صنايعي.ما — ملفك الآن متاح للعملاء</p>
      <button className="reg-btn-primary" onClick={onBack}>Voir mon profil →</button>
    </div>
  );

  return (
    <div className="reg-page">
      {/* Header */}
      <div className="reg-header">
        <button className="reg-back" onClick={onBack}>←</button>
        <div className="reg-header-brand">
          <span className="reg-brand-fr">Snay3i</span>
          <span className="reg-brand-dot">.ma</span>
        </div>
        <div className="reg-steps">
          {[1,2,3].map(s => (
            <div key={s} className={`reg-step-dot ${step >= s ? "active" : ""}`}/>
          ))}
        </div>
      </div>

      <div className="reg-body">
        {/* Step 1 — Identity */}
        {step === 1 && (
          <div className="reg-step">
            <div className="reg-step-icon">👷</div>
            <h2 className="reg-step-title">
              {lang === "fr" ? "Qui êtes-vous ?" : "من أنت؟"}
            </h2>
            <p className="reg-step-sub">
              {lang === "fr" ? "Votre identité et votre métier" : "هويتك ومهنتك"}
            </p>
            <div style={{fontSize:11,color:'#8A8178',marginBottom:12}}>Source: {acquisitionSource === 'direct' ? 'direct' : acquisitionSource}</div>

            <div className="reg-field">
              <label className="reg-label">Nom complet • الاسم الكامل</label>
              <input className="reg-input" placeholder="Ex: Hassan Benali"
                value={form.name} onChange={e => update("name", e.target.value)}/>
            </div>

            <div className="reg-field">
              <label className="reg-label">Votre métier • مهنتك</label>
              <div className="reg-service-grid">
                {SERVICES_LIST.map(s => (
                  <button key={s.id}
                    className={`reg-service-btn ${form.service === s.id ? "active" : ""}`}
                    onClick={() => update("service", s.id)}>
                    <span className="reg-service-emoji">{s.emoji}</span>
                    <span className="reg-service-fr">{s.label}</span>
                    <span className="reg-service-ar">{s.ar}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label">Ville • المدينة</label>
              <select aria-label="Choisir une ville" className="reg-select" value={form.city} onChange={e => update("city", e.target.value)}>
                <option value="">Choisir une ville...</option>
                {["Casablanca","Rabat","Marrakech","Fes","Tanger","Agadir","Meknes","Oujda","Kenitra","Tetouan","Sale","El Jadida"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="reg-field">
              <label className="reg-label">Années d experience • سنوات الخبرة</label>
              <input className="reg-input" type="number" placeholder="Ex: 10"
                value={form.years_exp} onChange={e => update("years_exp", e.target.value)}/>
            </div>

            <button className="reg-btn-primary"
              disabled={!form.name || !form.service || !form.city}
              onClick={() => setStep(2)}>
              Suivant • التالي →
            </button>
          </div>
        )}

        {/* Step 2 — Contact */}
        {step === 2 && (
          <div className="reg-step">
            <div className="reg-step-icon">📞</div>
            <h2 className="reg-step-title">
              {lang === "fr" ? "Comment vous joindre ?" : "كيف يتواصلون معك؟"}
            </h2>
            <p className="reg-step-sub">
              {lang === "fr" ? "Vos coordonnées de contact" : "معلومات التواصل"}
            </p>

            <div className="reg-field">
              <label className="reg-label">📞 Téléphone • الهاتف</label>
              <input className="reg-input" type="tel" placeholder="06XX-XXXXXX"
                value={form.phone} onChange={e => update("phone", e.target.value)}/>
            </div>

            <div className="reg-field">
              <label className="reg-label">💬 WhatsApp (si different)</label>
              <input className="reg-input" type="tel" placeholder="06XX-XXXXXX"
                value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)}/>
            </div>

            <div className="reg-field">
              <label className="reg-label">📍 Adresse / Quartier • العنوان</label>
              <input className="reg-input" placeholder="Ex: Hay Mohammadi, Casablanca"
                value={form.address} onChange={e => update("address", e.target.value)}/>
            </div>

            <div className="reg-btn-row">
              <button className="reg-btn-ghost" onClick={() => setStep(1)}>← Retour</button>
              <button className="reg-btn-primary"
                disabled={!form.phone}
                onClick={() => setStep(3)}>
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Profile */}
        {step === 3 && (
          <div className="reg-step">
            <div className="reg-step-icon">✨</div>
            <h2 className="reg-step-title">
              {lang === "fr" ? "Decrivez votre expertise" : "صف خبرتك"}
            </h2>
            <p className="reg-step-sub">
              {lang === "fr" ? "Ce qui vous rend unique" : "ما يميزك عن غيرك"}
            </p>

            <div className="reg-field">
              <label className="reg-label">Description • وصف</label>
              <textarea className="reg-textarea"
                placeholder="Ex: Plombier avec 10 ans d experience. Specialise en urgences, chauffe-eau et salle de bain complete..."
                value={form.bio} onChange={e => update("bio", e.target.value)} rows={4}/>
            </div>

            <div className="reg-field">
              <label className="reg-label">Specialites (separees par virgule)</label>
              <input className="reg-input"
                placeholder="Ex: Urgences, Chauffe-eau, Hammam"
                value={form.tags} onChange={e => update("tags", e.target.value)}/>
            </div>

            <div className="reg-field">
              <label className="reg-label">📸 Photos de vos travaux <span className="reg-optional">(optionnel)</span></label>
              <div className="reg-photo-upload" onClick={() => document.getElementById("photo-input").click()}>
                <input id="photo-input" type="file" accept="image/*" multiple style={{display:"none"}}
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    const urls = files.map(f => URL.createObjectURL(f));
                    update("photos", urls);
                  }}/>
                {form.photos && form.photos.length > 0 ? (
                  <div className="reg-photos-preview">
                    {form.photos.map((url, i) => (
                      <img key={i} src={url} alt="" className="reg-photo-thumb"/>
                    ))}
                    <div className="reg-photo-add">+</div>
                  </div>
                ) : (
                  <div className="reg-photo-placeholder">
                    <span style={{fontSize:32}}>📷</span>
                    <p>Appuyez pour ajouter des photos</p>
                    <p className="reg-photo-hint">Avant/après, chantiers, realisations...</p>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="reg-error">{error}</p>}

            <div className="reg-preview">
              <div className="reg-preview-label">Apercu de votre profil</div>
              <div className="reg-preview-card">
                <div className="reg-preview-name">{form.name || "Votre nom"}</div>
                <div className="reg-preview-meta">
                  {SERVICES_LIST.find(s=>s.id===form.service)?.emoji} {SERVICES_LIST.find(s=>s.id===form.service)?.label} • {form.city}
                </div>
                <div className="reg-preview-phone">📞 {form.phone}</div>
              </div>
            </div>

            <div className="reg-btn-row">
              <button className="reg-btn-ghost" onClick={() => setStep(2)}>← Retour</button>
              <button className="reg-btn-primary"
                disabled={submitting || !form.bio}
                onClick={handleSubmit}>
                {submitting ? "⌛ Inscription..." : "🚀 Publier mon profil"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// ── MAP MODAL (Leaflet — fully CRA-compatible) ───────────────────
// Coords [lat, lng] — Leaflet convention
const MAP_PLOT = {
  Casablanca:[33.5731,-7.5898], Rabat:[34.0209,-6.8416],
  Marrakech:[31.6295,-7.9811], Fes:[34.0181,-5.0078],
  "Fès":[34.0181,-5.0078], Tanger:[35.7595,-5.8340],
  Agadir:[30.4278,-9.5981], Meknes:[33.8935,-5.5473],
  "Meknès":[33.8935,-5.5473], Oujda:[34.6814,-1.9086],
  Nador:[35.1680,-2.9287], Tetouan:[35.5785,-5.3684],
  "Tétouan":[35.5785,-5.3684], Sale:[34.0531,-6.7985],
  "Salé":[34.0531,-6.7985], Kenitra:[34.2610,-6.5802],
  "Kénitra":[34.2610,-6.5802], "Al Hoceima":[35.2517,-3.9372],
  Chefchaouen:[35.1688,-5.2636], Larache:[35.1932,-6.1561],
  "El Jadida":[33.2316,-8.5007], Safi:[32.2994,-9.2372],
  Essaouira:[31.5085,-9.7595], Settat:[33.0016,-7.6199],
  Mohammedia:[33.6861,-7.3832], "Témara":[33.9268,-6.9069],
  "Beni Mellal":[32.3372,-6.3498], Khouribga:[32.8811,-6.9063],
  Ouarzazate:[30.9189,-6.8934], Errachidia:[31.9299,-4.4247],
  Taza:[34.2100,-4.0100], Berkane:[34.9200,-2.3200],
  Taroudannt:[30.4728,-8.8780], Tiznit:[29.6978,-9.7328],
  Guelmim:[28.9870,-10.0574], Laayoune:[27.1536,-13.2033],
  "Laâyoune":[27.1536,-13.2033], Dakhla:[23.7136,-15.9355],
  "Tan-Tan":[28.4380,-11.1012],
};

const SVC_COLOR = {
  plumber:"#1A5C82", electrician:"#C4A000", builder:"#7B3F10",
  handyman:"#1E6B3A", painter:"#8B1A4A", carpenter:"#5A2E8A",
  tiler:"#C4622D", ac_tech:"#0480A4", locksmith:"#2D3748",
  cleaner:"#047857", gardener:"#15803D", welder:"#92400E",
};

function MapModal({workers, onClose, userLoc, activeCategory, activeCity}){
  const mapRef      = useRef(null);
  const mapInst     = useRef(null);
  const layersRef   = useRef([]);
  const userMkRef   = useRef(null);
  const [filter,setFilter]               = useState(activeCategory||"all");
  const [cityPanel,setCityPanel]         = useState(null);
  const [selectedWorker,setSelectedWorker] = useState(null);
  const [locating,setLocating]           = useState(false);
  const [myPos,setMyPos]                 = useState(userLoc||null);

  const dominant = ws => {
    const c={}; ws.forEach(w=>{c[w.service]=(c[w.service]||0)+1;});
    return Object.entries(c).sort((a,b)=>b[1]-a[1])[0]?.[0]||"plumber";
  };

  // Auto-fit map to show all visible markers
  const fitToMarkers = (map) => {
    const L=window.L; if(!L||layersRef.current.length===0) return;
    try{
      const bounds=L.latLngBounds(layersRef.current.map(m=>m.getLatLng()));
      map.fitBounds(bounds,{padding:[60,60],maxZoom:12,animate:true,duration:0.6});
    }catch(e){}
  };

  // Initial center: city if selected, user location, or full Morocco
  const getInitialView = () => {
    if(myPos) return {center:[myPos.lat,myPos.lng], zoom:11};
    if(activeCity && activeCity!=="Toutes" && MAP_PLOT[activeCity])
      return {center:MAP_PLOT[activeCity], zoom:11};
    return {center:[29.5,-7.5], zoom:5};
  };

  const addUserMarker = (map,pos) => {
    const L=window.L; if(!L) return;
    if(userMkRef.current) map.removeLayer(userMkRef.current);
    const icon = L.divIcon({
      className:"",
      html:`<div style="width:18px;height:18px;border-radius:50%;
        background:#1A7A6E;border:3px solid #fff;
        box-shadow:0 0 0 6px rgba(26,122,110,.2);"></div>`,
      iconSize:[18,18], iconAnchor:[9,9],
    });
    userMkRef.current = L.marker([pos.lat,pos.lng],{icon}).addTo(map);
  };

  const plotMarkers = (map,workerList,currentFilter) => {
    const L=window.L; if(!L) return;
    layersRef.current.forEach(m=>map.removeLayer(m));
    layersRef.current=[];
    const filtered = currentFilter==="all"
      ? workerList : workerList.filter(w=>w.service===currentFilter);
    const byCity={};
    filtered.forEach(w=>{ if(!byCity[w.city])byCity[w.city]=[]; byCity[w.city].push(w); });

    Object.entries(byCity).forEach(([city,ws])=>{
      const coords=MAP_PLOT[city]; if(!coords) return;
      const count=ws.length;
      const svc=dominant(ws);
      const color=SVC_COLOR[svc]||"#C4622D";
      const sz=count>9?54:count>4?48:42;
      const icon=L.divIcon({
        className:"",
        html:`<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
          <div style="
            position:relative;
            width:${sz}px;height:${sz}px;border-radius:50%;
            background:${color};border:3px solid #fff;
            box-shadow:0 4px 18px rgba(0,0,0,.3);
            display:flex;align-items:center;justify-content:center;
            font-size:${sz>48?22:19}px;
          ">
            ${catEmoji(svc)}
            ${count>1?`<div style="
              position:absolute;top:-5px;right:-5px;
              background:#C4622D;color:#fff;
              font-size:10px;font-weight:800;
              min-width:18px;height:18px;border-radius:9px;padding:0 4px;
              border:2px solid #fff;
              display:flex;align-items:center;justify-content:center;
              font-family:system-ui,sans-serif;
            ">${count}</div>`:""}
          </div>
          <div style="
            margin-top:3px;background:rgba(13,27,42,.75);backdrop-filter:blur(4px);
            color:#fff;font-size:9px;font-weight:700;padding:2px 7px;
            border-radius:10px;white-space:nowrap;max-width:80px;
            overflow:hidden;text-overflow:ellipsis;
          ">${city}</div>
        </div>`,
        iconSize:[sz, count>1?sz+22:sz],
        iconAnchor:[sz/2, count>1?(sz+22)/2:sz/2],
        popupAnchor:[0,-(sz/2)],
      });
      const mk=L.marker(coords,{icon}).addTo(map);
      mk.on("click",()=>{
        if(count===1){ setSelectedWorker(ws[0]); setCityPanel(null); }
        else { setCityPanel({city,workers:ws}); setSelectedWorker(null); map.setView(coords,Math.min(10,map.getZoom()+2)); }
      });
      layersRef.current.push(mk);
    });
  };

  useEffect(()=>{
    if(!mapRef.current||mapInst.current) return;

    const initMap = (L) => {
      if(!mapRef.current||mapInst.current) return;
      const {center,zoom}=getInitialView();
      const map=L.map(mapRef.current,{
        center, zoom,
        zoomControl:false, attributionControl:false,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {subdomains:"abcd",maxZoom:19}
      ).addTo(map);
      L.control.zoom({position:"topright"}).addTo(map);
      mapInst.current=map;
      plotMarkers(map,workers,filter);
      // If no specific city/location, auto-fit to all markers
      if(!myPos && (!activeCity||activeCity==="Toutes")){
        setTimeout(()=>fitToMarkers(map),300);
      }
      if(myPos) addUserMarker(map,myPos);
    };

    // Load Leaflet from CDN (no npm package needed)
    if(window.L){ initMap(window.L); return; }
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script=document.createElement("script");
    script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload=()=>initMap(window.L);
    document.head.appendChild(script);

    return()=>{ if(mapInst.current){mapInst.current.remove();mapInst.current=null;} };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleFilter=f=>{
    setFilter(f); setSelectedWorker(null); setCityPanel(null);
    if(mapInst.current){
      plotMarkers(mapInst.current,workers,f);
      setTimeout(()=>fitToMarkers(mapInst.current),100);
    }
  };

  const handleLocate=()=>{
    if(!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      const p={lat:pos.coords.latitude,lng:pos.coords.longitude};
      setMyPos(p); setLocating(false);
      if(mapInst.current){
        mapInst.current.setView([p.lat,p.lng],11);
        addUserMarker(mapInst.current,p);
      }
    },()=>setLocating(false));
  };

  const total=filter==="all"?workers.length:workers.filter(w=>w.service===filter).length;

  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",flexDirection:"column"}}>
      <style>{`
        .leaflet-control-attribution{display:none!important}
        .map-fp:hover{opacity:.82}
        .wrow:hover{background:rgba(196,98,45,.07)!important}
        @keyframes slideUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0D1B2A 0%,#162535 100%)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px 10px"}}>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,.1)",border:"none",color:"#fff",
            width:38,height:38,borderRadius:"50%",cursor:"pointer",fontSize:20,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>←</button>
          <div style={{flex:1}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:16}}>🗺️ Carte des Maalems</div>
            <div style={{color:"rgba(255,255,255,.45)",fontSize:11.5,marginTop:1}}>
              <strong style={{color:"rgba(255,255,255,.7)"}}>{total}</strong> artisan{total!==1?"s":""} · Maroc 🇲🇦 + Provinces du Sud
            </div>
          </div>
          <button onClick={handleLocate} className="map-fp" style={{
            background:myPos?"#1A7A6E":"rgba(255,255,255,.1)",border:"none",color:"#fff",
            padding:"8px 13px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700,
            display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",transition:"background .2s",flexShrink:0,
          }}>{locating?"⌛ GPS...":myPos?"✅ Localisé":"🎯 Me localiser"}</button>
        </div>
        {/* Filter pills */}
        <div style={{overflowX:"auto",paddingBottom:12}}>
          <div style={{display:"flex",gap:7,paddingInline:16,width:"max-content"}}>
            {[{id:"all",label:"Tous",emoji:"🏠"},...CATEGORIES.filter(c=>c.id!=="all")].map(cat=>(
              <button key={cat.id} className="map-fp" onClick={()=>handleFilter(cat.id)} style={{
                display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,
                border:filter===cat.id?"none":"1.5px solid rgba(255,255,255,.15)",
                background:filter===cat.id?"#C4622D":"rgba(255,255,255,.07)",
                color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all .15s",
              }}>{cat.emoji} {cat.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <div ref={mapRef} style={{width:"100%",height:"100%"}}/>

        {/* City drawer */}
        {cityPanel&&!selectedWorker&&(
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,background:"#fff",
            borderRadius:"22px 22px 0 0",boxShadow:"0 -10px 40px rgba(0,0,0,.18)",
            animation:"slideUp .22s ease",maxHeight:"55vh",display:"flex",flexDirection:"column",
          }}>
            <div style={{width:36,height:4,background:"#E0D8CC",borderRadius:2,margin:"12px auto 10px"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingInline:20,marginBottom:8}}>
              <div>
                <div style={{fontWeight:800,fontSize:17,color:"#0D1B2A"}}>{cityPanel.city}</div>
                <div style={{fontSize:12,color:"#9A9085",marginTop:2}}>{cityPanel.workers.length} artisans disponibles</div>
              </div>
              <button onClick={()=>setCityPanel(null)} style={{background:"#F5F0EB",border:"none",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,color:"#666",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{overflowY:"auto",paddingInline:12,paddingBottom:16,flex:1}}>
              {cityPanel.workers.map(w=>{
                const[bg]=avatarColor(w.name);
                return(
                  <div key={w.id} className="wrow" onClick={()=>setSelectedWorker(w)} style={{
                    display:"flex",alignItems:"center",gap:12,padding:"11px 8px",
                    borderRadius:12,cursor:"pointer",borderBottom:"1px solid #F5F0EB",
                  }}>
                    <div style={{width:44,height:44,borderRadius:12,flexShrink:0,background:bg,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13}}>{initials(w.name)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <span style={{fontWeight:700,fontSize:14,color:"#0D1B2A",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:160}}>{w.name}</span>
                        {w.verified&&<span style={{background:"#D8F5E4",color:"#1A6B3A",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:20,flexShrink:0}}>✓</span>}
                      </div>
                      <div style={{fontSize:12,color:"#C4622D",fontWeight:600,marginTop:1}}>{catEmoji(w.service)} {catLabel(w.service)}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#D4A843"}}>★ {w.rating}</div>
                      <div style={{fontSize:10,color:"#9A9085"}}>{w.reviews} avis</div>
                    </div>
                    <span style={{color:"#C4622D",fontSize:20,flexShrink:0}}>›</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Worker card */}
        {selectedWorker&&(
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,background:"#fff",
            borderRadius:"22px 22px 0 0",padding:"0 20px 32px",
            boxShadow:"0 -10px 40px rgba(0,0,0,.18)",animation:"slideUp .22s ease",
          }}>
            <div style={{width:36,height:4,background:"#E0D8CC",borderRadius:2,margin:"12px auto 16px"}}/>
            {cityPanel&&(
              <button onClick={()=>setSelectedWorker(null)} style={{background:"none",border:"none",color:"#C4622D",fontWeight:700,fontSize:13,cursor:"pointer",padding:"0 0 10px",display:"flex",alignItems:"center",gap:4}}>← {cityPanel.city}</button>
            )}
            {(()=>{const[bg,tc]=avatarColor(selectedWorker.name);return(
              <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                <div style={{width:58,height:58,borderRadius:16,flexShrink:0,background:bg,display:"flex",alignItems:"center",justifyContent:"center",color:tc,fontWeight:800,fontSize:15,position:"relative"}}>
                  {initials(selectedWorker.name)}
                  <span style={{position:"absolute",bottom:-4,right:-4,fontSize:16}}>{catEmoji(selectedWorker.service)}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:3}}>
                    <span style={{fontWeight:800,fontSize:16,color:"#0D1B2A"}}>{selectedWorker.name}</span>
                    {selectedWorker.verified&&<span style={{background:"#D8F5E4",color:"#1A6B3A",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20}}>✓ Vérifié</span>}
                  </div>
                  <div style={{fontSize:13,color:"#C4622D",fontWeight:700,marginBottom:4}}>{catLabel(selectedWorker.service)} · {selectedWorker.city}</div>
                  <div style={{display:"flex",alignItems:"center",gap:2}}>
                    {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=Math.round(selectedWorker.rating)?"#D4A843":"#DDD",fontSize:13}}>★</span>)}
                    <span style={{fontSize:11,color:"#7A7065",marginLeft:4}}>{selectedWorker.rating} · {selectedWorker.reviews} avis · {selectedWorker.years_exp} ans exp.</span>
                  </div>
                </div>
                <button onClick={()=>setSelectedWorker(null)} style={{background:"#F5F0EB",border:"none",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:15,color:"#666",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
              </div>
            );})()}
            <p style={{fontSize:13,color:"#5A5047",margin:"0 0 14px",lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{selectedWorker.bio}</p>
            {selectedWorker.tags?.length>0&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                {selectedWorker.tags.slice(0,4).map(t=><span key={t} style={{background:"#F5EDE5",color:"#C4622D",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20}}>{t}</span>)}
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <a onClick={()=>trackEvent('call_click','modal_'+selectedWorker.service)} href={`tel:${selectedWorker.phone}`} style={{flex:1,padding:"13px 8px",borderRadius:14,textAlign:"center",background:"#0D1B2A",color:"#fff",textDecoration:"none",fontWeight:800,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>📞 Appeler</a>
              <a onClick={()=>trackEvent('whatsapp_click','modal_'+selectedWorker.service)} href={`https://wa.me/${(selectedWorker.whatsapp||"").replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{flex:1,padding:"13px 8px",borderRadius:14,textAlign:"center",background:"#E8F9EE",color:"#1A6B3A",textDecoration:"none",fontWeight:800,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 WhatsApp</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── REVIEWS SECTION ───────────────────────────────────────────────
function ReviewsSection({worker, apiBase}) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${apiBase}/reviews/${worker.id}`)
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [worker.id, apiBase]);

  const submit = async () => {
    if (!author.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/reviews`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({worker_id: worker.id, author, rating, comment})
      });
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setAuthor(""); setComment(""); setRating(5);
    } catch(e) {}
    setSubmitting(false);
  };

  return (
    <div className="profile-section">
      <div className="reviews-header">
        <h3 className="profile-section-title">Avis clients • آراء العملاء</h3>
        <button className="reviews-add-btn" onClick={()=>setShowForm(!showForm)}>
          {showForm ? "✕" : "+ Avis"}
        </button>
      </div>

      {showForm && (
        <div className="review-form">
          <input
            className="review-input"
            placeholder="Votre prénom"
            value={author}
            onChange={e=>setAuthor(e.target.value)}
          />
          <div className="review-stars-pick">
            {[1,2,3,4,5].map(s=>(
              <span key={s} onClick={()=>setRating(s)}
                style={{fontSize:28,cursor:"pointer",color:s<=rating?"#FFD700":"#ddd"}}>★</span>
            ))}
          </div>
          <textarea
            className="review-textarea"
            placeholder="Votre avis sur ce professionnel..."
            value={comment}
            onChange={e=>setComment(e.target.value)}
            rows={3}
          />
          <button className="review-submit-btn" onClick={submit} disabled={submitting}>
            {submitting ? "⌛ Envoi..." : "✅ Publier mon avis"}
          </button>
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="reviews-empty">Soyez le premier à laisser un avis ⭐</p>
      )}

      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r.id} className="review-item">
            <div className="review-top">
              <div className="review-avatar">{r.author[0].toUpperCase()}</div>
              <div>
                <div className="review-author">{r.author}</div>
                <div className="review-stars-display">
                  {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                </div>
              </div>
            </div>
            <p className="review-comment">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────────
function ProfilePage({worker, onClose}) {
  const [bg] = avatarColor(worker.name);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-page" onClick={e=>e.stopPropagation()}>

        {/* HEADER */}
        <div className="profile-hero" style={{background:bg}}>
          <button className="profile-back" onClick={onClose}>←</button>
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" style={{background:"rgba(255,255,255,0.2)"}}>
              <span className="profile-avatar-text">{initials(worker.name)}</span>
            </div>
            {worker.verified && (
              <div className="profile-verified">✓</div>
            )}
          </div>
          <h1 className="profile-name">{worker.name}</h1>
          <div className="profile-meta">
            <span>{catEmoji(worker.service)} {catLabel(worker.service)}</span>
            <span className="profile-dot">•</span>
            <span>📍 {worker.city}</span>
          </div>
          <div className="profile-rating-row">
            <div className="profile-stars">
              {"★★★★★".slice(0, Math.round(worker.rating)).split("").map((s,i) => (
                <span key={i} style={{color:"#FFD700",fontSize:18}}>★</span>
              ))}
              {"★★★★★".slice(Math.round(worker.rating)).split("").map((s,i) => (
                <span key={i} style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>★</span>
              ))}
            </div>
            <span className="profile-rating-text">{worker.rating} · {worker.reviews} avis · {worker.years_exp} ans exp.</span>
          </div>
        </div>

        {/* BODY */}
        <div className="profile-body">

          {/* ACTION BUTTONS */}
          <div className="profile-actions">
            <a href={"tel:"+worker.phone} className="profile-btn-call">
              <span>📞</span>
              <span>Appeler</span>
            </a>
            <a onClick={()=>trackEvent('whatsapp_click','profile_'+worker.service)} href={"https://wa.me/"+(worker.whatsapp||"").replace(/\D/g,"")} target="_blank" rel="noreferrer" className="profile-btn-wa">
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
            <button className="profile-btn-chat" onClick={()=>setShowChat(true)}>
              <span>✉️</span>
              <span>Message</span>
            </button>
          </div>

          {/* ABOUT */}
          <div className="profile-section">
            <h3 className="profile-section-title">À propos • عن المعلم</h3>
            <p className="profile-bio">{worker.bio}</p>
          </div>

          {/* SPECIALITIES */}
          {worker.tags && worker.tags.length > 0 && (
            <div className="profile-section">
              <h3 className="profile-section-title">Spécialités • التخصصات</h3>
              <div className="profile-tags">
                {worker.tags.map(t => (
                  <span key={t} className="profile-tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* ADDRESS */}
          {worker.address && (
            <div className="profile-section">
              <h3 className="profile-section-title">Adresse • العنوان</h3>
              <div className="profile-address">
                <span className="profile-address-icon">📍</span>
                <span>{worker.address}</span>
              </div>
            </div>
          )}

          {/* PORTFOLIO */}
          <div className="profile-section">
            <h3 className="profile-section-title">Réalisations • أعمالي</h3>
            {worker.photos && worker.photos.length > 0 ? (
              <div className="profile-photos">
                {worker.photos.map((url, i) => (
                  <img key={i} src={url} alt="" className="profile-photo"/>
                ))}
              </div>
            ) : (
              <div className="profile-photos-empty">
                <div className="profile-photo-placeholder">📷</div>
                <div className="profile-photo-placeholder">🔧</div>
                <div className="profile-photo-placeholder">🏠</div>
                <p className="profile-photos-hint">Les photos de réalisations arrivent bientôt</p>
              </div>
            )}
          </div>


          {/* REVIEWS */}
          <ReviewsSection worker={worker} apiBase={API_BASE}/>
          {/* DEVIS GRATUIT */}
          <div className="profile-devis">
            <span className="profile-devis-icon">📋</span>
            <div>
              <strong>Devis gratuit</strong>
              <p>Contactez ce professionnel pour obtenir un devis sur place</p>
            </div>
          </div>
          <div className="srow join-row" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
            <div className="sicon" style={{background:"rgba(196,98,45,0.12)"}}>🛠️</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Vous êtes Snay3i ? / أنت صنايعي؟</div>
              <div style={{fontSize:11,color:"#D4A843",marginTop:2}}>Rejoignez gratuitement — انضم مجاناً</div>
            </div>
            <button style={{background:"#C4622D",color:"#fff",border:"none",borderRadius:24,padding:"10px 22px",fontSize:14,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>Rejoindre →</button>
          </div>

        </div>

        {showChat && <ChatWindow worker={worker} onClose={()=>setShowChat(false)}/>}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────
export default function App(){
  const [query,setQuery]=useState("");
  const [city,setCity]=useState("Toutes");
  const [category,setCategory]=useState("all");
  const [pendingService,setPendingService]=useState("all");
  const [pendingCity,setPendingCity]=useState("Toutes");
  const [workers,setWorkers]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [locating,setLocating]=useState(false);
  const [userLoc,setUserLoc]=useState(null);
  const [nearCity,setNearCity]=useState(null);
  const [locErr,setLocErr]=useState("");
  const [sort,setSort]=useState("rating");
  const [distKm,setDistKm]=useState(null); // null = all, 5 | 10 | 20
  const [lang,setLang]=useState("fr");
  const [showMap,setShowMap]=useState(false);
  const [showRegister,setShowRegister]=useState(false);
  const [legalPage,setLegalPage]=useState(null);

  const CITY_NORMALIZE = {
    "Fès":"Fes","Meknès":"Meknes","Kénitra":"Kenitra","Salé":"Sale",
    "Tétouan":"Tetouan","Témara":"Temara","Béni Mellal":"Beni Mellal",
    "Khénifra":"Khenifra","Laâyoune":"Laayoune","Saïdia":"Saidia",
    "Fkih Ben Salah":"Fes","Martil":"Martil","M\'diq":"Mdiq",
    "Sidi Kacem":"Sidi-Kacem","Ouazzane":"Ouazzane",
  };
  
  const fetchWorkers=useCallback(async(svc,ct,q)=>{
    setLoading(true);setError("");
    try{
      const p=new URLSearchParams();
      if(q&&q.trim())p.set("q",q.trim());
      const ctNorm = CITY_NORMALIZE[ct] || ct;
      if(ct&&ct!=="Toutes")p.set("city",ctNorm);
      if(svc&&svc!=="all")p.set("service",svc);
      let res=await fetch(`${API_BASE}/search?${p}`);
      // Fallback to original endpoint if /search fails or backend not updated
      if(!res.ok){
        const ep=svc&&svc!=="all"?`${API_BASE}/workers/${svc}`:`${API_BASE}/workers`;
        const p2=new URLSearchParams();
        if(ct&&ct!=="Toutes")p2.set("city",ct);
        res=await fetch(p2.toString()?`${ep}?${p2}`:ep);
      }
      if(!res.ok)throw new Error("Aucun snay3i trouvé");
      const d=await res.json();
      setWorkers(Array.isArray(d)?d:[]);
    }catch(e){setError(e.message);setWorkers([]);}
    finally{setLoading(false);}
  },[]);

  // Initial load only
  useEffect(()=>{fetchWorkers("all","Toutes","");},[fetchWorkers]);

  const handleSearch=()=>{
    setCategory(pendingService);
    setCity(pendingCity);
    fetchWorkers(pendingService,pendingCity,"");
  };

  const handleLocate=()=>{
    if(!navigator.geolocation){setLocErr("GPS non supporté");return;}
    setLocating(true);setLocErr("");
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const{latitude:lat,longitude:lng}=pos.coords;
        setUserLoc({lat,lng});
        const{city:nc}=getNearestCity(lat,lng);
        setNearCity(nc);setCity(nc);setSort("distance");setLocating(false);
      },
      ()=>{setLocating(false);setLocErr("Impossible d'accéder à votre position.");},
      {timeout:10000}
    );
  };

  const sorted=[...workers]
    .filter(w=>{
      if(distKm&&userLoc){
        const c=CITY_COORDS[w.city];
        if(c){
          const km=haversineKm(userLoc.lat,userLoc.lng,c.lat,c.lng);
          if(km>distKm)return false;
        }
      }
      return true;
    })
    .sort((a,b)=>{
      if(sort==="rating")return b.rating-a.rating;
      if(sort==="price")return parseInt(a.price)-parseInt(b.price);
      if(sort==="distance"&&userLoc){
        const ca=CITY_COORDS[a.city],cb=CITY_COORDS[b.city];
        if(!ca||!cb)return 0;
        return haversineKm(userLoc.lat,userLoc.lng,ca.lat,ca.lng)-haversineKm(userLoc.lat,userLoc.lng,cb.lat,cb.lng);
      }
      return 0;
    });

  if(showRegister) return <RegisterPage onBack={()=>setShowRegister(false)} lang={lang}/>;
  if(showMap) return <MapModal workers={workers} onClose={()=>setShowMap(false)} userLoc={userLoc} activeCategory={category} activeCity={city}/>;

  return(
    <div className="app" dir={lang==="ar"?"rtl":"ltr"}>
      <ZelligeSVG id="hz"/>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <header className="header">
        <div className="header-zellige">
          <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#hz)"/></svg>
        </div>
        <div className="header-overlay"/>

        <div className="hcontent">
          {/* TOP BAR */}
          <div className="topbar">
            <div className="brand">
              <picture><source srcSet="/logo.webp" type="image/webp"/><img src="/logo.png" alt="Snay3i.ma" width="48" height="48" style={{height:48,objectFit:"contain"}}/></picture>
            </div>
            <button className="lang-btn" onClick={()=>setLang(l=>l==="fr"?"ar":"fr")}>
              {lang==="fr"?"عربي":"FR"}
            </button>
          </div>

          {/* HERO */}
          <div className="hero">
            <div className="hero-badge">
              <span>🇲🇦</span>
              {lang==="fr"?"Le réseau des artisans marocains":"شبكة الحرفيين المغاربة"}
            </div>
            <h1 className="hero-h1">
              {lang==="fr"
                ?<>Votre <em>Snay3i</em><br/>à portée de main</>
                :<>صنايعيك<br/><em>في متناول يدك</em></>
              }
            </h1>
            <p className="hero-sub">
              {lang==="fr"
                ?"Plombiers · Électriciens · Maçons · Peintres · Menuisiers"
                :"سبّاكون · كهربائيون · بنّاؤون · نقّاشون · نجّارون"
              }
            </p>
          </div>

          {/* SEARCH CARD */}
          <div className="search-card">
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:10,background:"#F5F0EB",borderRadius:12,padding:"12px 16px"}}>
                <select aria-label="Filtrer par service" value={pendingService} onChange={e=>setPendingService(e.target.value)}
                  style={{flex:1,background:"transparent",border:"none",fontSize:14,fontWeight:600,color:"var(--ink)",outline:"none",cursor:"pointer"}}>
                  {CATEGORIES.map(c=>(<option key={c.id} value={c.id}>{c.emoji} {lang==="fr"?c.label:c.ar}</option>))}
                </select>
              </div>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:10,background:"#F5F0EB",borderRadius:12,padding:"12px 16px"}}>
                <span style={{fontSize:16}}>📍</span>
                <select aria-label="Filtrer par ville" className="scity" value={pendingCity} onChange={e=>setPendingCity(e.target.value)}
                  style={{flex:1,background:"transparent",border:"none",fontSize:14,fontWeight:600,color:"var(--ink)",outline:"none",cursor:"pointer"}}>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="srow srow-dist" style={{marginBottom:10}}>
              <div className="sicon navy">📏</div>
              <span className="dist-label">{lang==="fr"?"Distance":"المسافة"}</span>
              <div className="dist-chips-row">
                {[{label:"<5 km",km:5},{label:"<10 km",km:10},{label:"<20 km",km:20},{label:"Partout",km:null}].map(d=>(
                  <button key={d.label}
                    className={`dist-chip-sm${distKm===d.km?" active":""}`}
                    onClick={()=>{
                      if(d.km&&!userLoc){handleLocate();}
                      setDistKm(prev=>prev===d.km?null:d.km);
                    }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:10}}>
              <button onClick={handleSearch}
                style={{flex:1,background:"var(--terra)",border:"none",color:"#fff",fontWeight:800,fontSize:15,padding:"13px",borderRadius:12,cursor:"pointer"}}>
                🔍 {lang==="fr"?"Rechercher":"بحث"}
              </button>
              <button className={`locate-btn${locating?" spin":""}${userLoc?" located":""}`}
                onClick={handleLocate} title="Me localiser"
                style={{width:48,height:48,borderRadius:12,fontSize:20,background:"#F5F0EB",border:"none",cursor:"pointer"}}>
                {locating?"⌛":userLoc?"✅":"🎯"}
              </button>
            </div>
          </div>
          <div className="srow join-row" onClick={()=>setShowRegister(true)}>
            <div className="sicon" style={{background:"rgba(196,98,45,0.12)"}}>🛠️</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{lang==="fr"?"Vous êtes Snay3i ?":"أنت صنايعي؟"}</div>
              <div style={{fontSize:11,color:"#D4A843",marginTop:2}}>{lang==="fr"?"Rejoignez gratuitement":"انضم مجاناً"}</div>
            </div>
            <button style={{background:"#C4622D",color:"#fff",border:"none",borderRadius:24,padding:"10px 22px",fontSize:14,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{lang==="fr"?"Rejoindre →":"انضم →"}</button>
          </div>
          {locErr&&<p className="loc-err">{locErr}</p>}
        </div>
      </header>

      {/* ══ LOCATE BANNER ═══════════════════════════════════════ */}
      <div className="locate-banner-area">
        {userLoc?(
          <div className="loc-success">
            <span>📍</span>
            <span>Position détectée — <strong>{nearCity}</strong></span>
            <span className="loc-sub">Snay3is triés par distance</span>
          </div>
        ):(
          <div className="loc-cta" onClick={!locating?handleLocate:undefined}>
            <div className={`loc-pulse${locating?" spin":""}`}>{locating?"⌛":"🎯"}</div>
            <div className="loc-cta-text">
              <strong>{lang==="fr"?"Me localiser":"تحديد موقعي"}</strong>
              <span>{lang==="fr"?"Trouver les snay3is les plus proches":"ابحث عن أقرب المعلمين"}</span>
            </div>
            {!locating&&<span className="loc-arrow">→</span>}
          </div>
        )}
      </div>

      {/* ══ CATEGORIES ══════════════════════════════════════════ */}
      <div className="cats-wrap">
        <div className="cats-scroll">
          {CATEGORIES.map(cat=>(
            <button key={cat.id}
              className={`cat-btn${category===cat.id?" active":""}`}
              onClick={()=>setCategory(cat.id)}>
              <span className="cat-ico">{cat.emoji}</span>
              <span className="cat-fr">{cat.label}</span>
              <span className="cat-ar">{cat.ar}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ TOOLBAR ═════════════════════════════════════════════ */}
      <div className="toolbar">
        <span className="count-label">
          <strong>{sorted.length}</strong> snay3i{sorted.length!==1?"s":""}
          {nearCity&&<span className="near-tag"> · {nearCity}</span>}
          {distKm&&<span className="near-tag"> · &lt;{distKm} km</span>}
        </span>
        {error&&<span className="err-msg">{error}</span>}
        <div className="sort-row">
          {[["rating","⭐"],["price","💰"],["distance","📍"]].map(([k,ic])=>(
            <button key={k}
              className={`sort-btn${sort===k?" active":""}`}
              onClick={()=>{if(k==="distance"&&!userLoc)handleLocate();else setSort(k);}}>
              {ic}
            </button>
          ))}
          <button className="sort-btn map-toggle-btn" onClick={()=>setShowMap(true)} title="Vue carte">
            🗺️
          </button>
        </div>
      </div>

      {/* ══ CARDS ════════════════════════════════════════════════ */}
      <main className="main">
        {loading?(
          <div className="grid">{[1,2,3].map(i=><SkeletonCard key={i}/>)}</div>
        ):sorted.length===0?(
          <div className="empty">
            <div style={{fontSize:52,marginBottom:12}}>🔍</div>
            <p className="empty-title">{lang==="fr"?"Aucun snay3i trouvé":"لم يتم العثور على معلم"}</p>
            <p className="empty-sub">{lang==="fr"?"Essayez une autre catégorie ou ville":"جرّب فئة أو مدينة أخرى"}</p>
          </div>
        ):(
          <div className="grid">
            {sorted.map((w,i)=><WorkerCard key={w.id} worker={w} index={i} userLoc={userLoc}/>)}
          </div>
        )}

        {/* CTA */}
        <div className="cta">
          <div className="cta-zel">
            <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#hz)"/></svg>
          </div>
          <div className="cta-content">
            <div className="cta-icon">🛠️</div>
            <div>
              <p className="cta-title">{lang==="fr"?"Vous êtes Snay3i ?":"أنت معلم؟"}</p>
              <p className="cta-sub">{lang==="fr"?"Rejoignez Snay3i.ma — gratuit et rapide":"انضم إلى معلم.ما — مجاني وسريع"}</p>
            </div>
            <button className="cta-btn" onClick={()=>setShowRegister(true)}>
              {lang==="fr"?"Rejoindre →":"انضم الآن →"}
            </button>
          </div>
        </div>

        <div className="footer">
          <span>Snay3i.ma • صنايعي.ما</span>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginTop:8}}>
            <a href="/about" style={{color:"var(--muted)",fontSize:12,textDecoration:"none"}}>À propos</a>
            <a href="/blog" style={{color:"var(--muted)",fontSize:12,textDecoration:"none"}}>Blog</a>
            <a href="/privacy" style={{color:"var(--muted)",fontSize:12,textDecoration:"none"}}>Confidentialité</a>
            <a href="/terms" style={{color:"var(--muted)",fontSize:12,textDecoration:"none"}}>CGU</a>
            <a href="/contact" style={{color:"var(--muted)",fontSize:12,textDecoration:"none"}}>Contact</a>
          </div>
          <span style={{fontSize:11,color:"var(--muted)",marginTop:4}}>🇲🇦 Fait avec fierté au Maroc</span>
        </div>
      </main>
      {legalPage&&<LegalModal page={legalPage} onClose={()=>setLegalPage(null)}/>}
    </div>

  );
}
