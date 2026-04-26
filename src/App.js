import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000";

const CATEGORIES = [
  { id: "all",         label: "Tous",        ar: "الكل",         emoji: "🏠" },
  { id: "plumber",     label: "Plombier",    ar: "سبّاك",        emoji: "🔧" },
  { id: "electrician", label: "Électricien", ar: "كهربائي",      emoji: "⚡" },
  { id: "builder",     label: "Maçon",       ar: "بنّاء",        emoji: "🧱" },
  { id: "handyman",    label: "Bricoleur",   ar: "مصلح",         emoji: "🔨" },
  { id: "painter",     label: "Peintre",     ar: "نقّاش",        emoji: "🎨" },
  { id: "carpenter",   label: "Menuisier",   ar: "نجّار",        emoji: "🪚" },
];

const CITIES = ["Toutes","Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir"];

const CITY_COORDS = {
  Casablanca:{ lat:33.5731, lng:-7.5898 },
  Rabat:     { lat:34.0209, lng:-6.8416 },
  Marrakech: { lat:31.6295, lng:-7.9811 },
  Fès:       { lat:34.0181, lng:-5.0078 },
  Tanger:    { lat:35.7595, lng:-5.8340 },
  Agadir:    { lat:30.4278, lng:-9.5981 },
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
  const km=Math.max(0.3,haversineKm(uLat,uLng,c.lat,c.lng)+(Math.random()*3-1.5));
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
            <a className="contact-btn phone" href={`tel:${worker.phone}`}>
              <span>📞</span><span>{worker.phone}</span>
            </a>
            <a className="contact-btn whatsapp" href={`https://wa.me/${(worker.whatsapp||"").replace(/\D/g,"")}`} target="_blank" rel="noreferrer">
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
            <span className="modal-reviews">{worker.reviews} avis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WORKER CARD ──────────────────────────────────────────────────
function WorkerCard({worker,index,userLoc}){
  const [bg,tc]=avatarColor(worker.name);
  const [faved,setFaved]=useState(false);
  const [chat,setChat]=useState(false);
  const [modal,setModal]=useState(false);
  const dist=userLoc?workerDist(worker,userLoc.lat,userLoc.lng):null;

  return(
    <>
      {modal && <ContactModal worker={worker} onClose={()=>setModal(false)}/>}
      {chat && <ChatWindow worker={worker} onClose={()=>setChat(false)}/>}
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
          <span className="avail">🟢 Disponible</span>
        </div>

        <p className="card-bio">{worker.bio}</p>

        <div className="card-rating-row">
          <Stars rating={worker.rating}/>
          <span className="card-reviews">{worker.reviews} avis • {worker.years_exp} ans exp.</span>
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
          <button className="btn-main" onClick={()=>setModal(true)}>
            Contacter • تواصل
          </button>
          <a className="btn-wa" href={`https://wa.me/${(worker.whatsapp||"").replace(/\D/g,"")}`} target="_blank" rel="noreferrer">
            💬
          </a>
          <button className={`btn-fav${faved?" faved":""}`} onClick={()=>setFaved(!faved)}>
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
  const bottomRef = useRef(null);
  const [bg] = avatarColor(worker.name);

  // Auto responses simulate trader replies
  const AUTO_REPLIES = [
    "Bonjour ! Merci de me contacter. Comment puis-je vous aider ?",
    "Oui je suis disponible. Quelle est votre adresse ?",
    "D accord, je peux passer demain matin. Ca vous convient ?",
    "Pouvez-vous m envoyer une photo du probleme sur WhatsApp ?",
    "Je suis libre en fin de semaine. Je vous ferai un devis gratuit sur place.",
    "Pas de probleme, je m en occupe. Je serai la dans 30 minutes.",
  ];

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
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id: worker.id, session_id: SESSION_ID, sender, text })
      });
      const msg = await res.json();
      setMsgs(prev => [...prev, msg]);

      // Simulate trader auto-reply
      if(sender === "client") {
        setTyping(true);
        setTimeout(async () => {
          setTyping(false);
          const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
          const r2 = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ worker_id: worker.id, session_id: SESSION_ID, sender: "worker", text: reply })
          });
          const msg2 = await r2.json();
          setMsgs(prev => [...prev, msg2]);
        }, 1500 + Math.random() * 1000);
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
              {typing ? "En train d ecrire..." : "En ligne • " + catLabel(worker.service)}
            </span>
          </div>
          <div className="chat-header-actions">
            <a href={"tel:" + worker.phone} className="chat-call-btn" title="Appeler">📞</a>
            <a href={"https://wa.me/" + (worker.whatsapp||"").replace(/\D/g,"")} target="_blank" rel="noreferrer" className="chat-wa-btn" title="WhatsApp">💬</a>
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
  { id: "plumber",     label: "Plombier",    ar: "سبّاك",    emoji: "🔧" },
  { id: "electrician", label: "Electricien", ar: "كهربائي",  emoji: "⚡" },
  { id: "builder",     label: "Macon",       ar: "بنّاء",    emoji: "🧱" },
  { id: "handyman",    label: "Bricoleur",   ar: "مصلح",     emoji: "🔨" },
  { id: "painter",     label: "Peintre",     ar: "نقّاش",    emoji: "🎨" },
  { id: "carpenter",   label: "Menuisier",   ar: "نجّار",    emoji: "🪚" },
];

function RegisterPage({ onBack, lang }) {
  const [step, setStep] = useState(1);
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
        years_exp: parseInt(form.years_exp) || 1,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        whatsapp: form.whatsapp || form.phone,
        verified: false,
        rating: 5.0,
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
      <p className="reg-success-sub">Votre profil est en ligne. Les clients peuvent maintenant vous trouver et vous contacter.</p>
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
              <select className="reg-select" value={form.city} onChange={e => update("city", e.target.value)}>
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

// ── APP ───────────────────────────────────────────────────────────
export default function App(){
  const [query,setQuery]=useState("");
  const [city,setCity]=useState("Toutes");
  const [category,setCategory]=useState("all");
  const [workers,setWorkers]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [locating,setLocating]=useState(false);
  const [userLoc,setUserLoc]=useState(null);
  const [nearCity,setNearCity]=useState(null);
  const [locErr,setLocErr]=useState("");
  const [sort,setSort]=useState("rating");
  const [lang,setLang]=useState("fr");
  const [showRegister,setShowRegister]=useState(false);

  const fetchWorkers=useCallback(async(svc,ct)=>{
    setLoading(true);setError("");
    try{
      const ep=svc&&svc!=="all"?`${API_BASE}/workers/${svc}`:`${API_BASE}/workers`;
      const p=new URLSearchParams();
      if(ct&&ct!=="Toutes")p.set("city",ct);
      const url=p.toString()?`${ep}?${p}`:ep;
      const res=await fetch(url);
      if(!res.ok)throw new Error("Aucun snay3i trouvé");
      const d=await res.json();
      setWorkers(Array.isArray(d)?d:[]);
    }catch(e){setError(e.message);setWorkers([]);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{fetchWorkers(category,city);},[category,city,fetchWorkers]);

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
      if(!query)return true;
      const q=query.toLowerCase();
      return w.name.toLowerCase().includes(q)||w.bio.toLowerCase().includes(q)||w.city.toLowerCase().includes(q);
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
              <div className="brand-mark">
                <svg viewBox="0 0 32 32" fill="none">
                  <polygon points="16,2 19,11 29,11 21,17 24,27 16,21 8,27 11,17 3,11 13,11" fill="#fff" opacity="0.95"/>
                </svg>
              </div>
              <div className="brand-name">
                <span className="brand-fr">Snay3i</span>
                <span className="brand-dot">.ma</span>
              </div>
              <span className="brand-ar">صنايعي</span>
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
            <div className="srow">
              <div className="sicon orange">🔍</div>
              <input className="sinput" type="text"
                placeholder={lang==="fr"?"Quel service cherchez-vous ?":"ما هي الخدمة التي تبحث عنها؟"}
                value={query} onChange={e=>setQuery(e.target.value)}/>
            </div>
            <div className="srow">
              <div className="sicon teal">📍</div>
              <select className="scity" value={city} onChange={e=>setCity(e.target.value)}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <button
                className={`locate-btn${locating?" spin":""}${userLoc?" located":""}`}
                onClick={handleLocate} title="Me localiser">
                {locating?"⌛":userLoc?"✅":"🎯"}
              </button>
            </div>
            <div className="srow srow-dist">
              <div className="sicon navy">📏</div>
              <span className="dist-label">{lang==="fr"?"Distance":"المسافة"}</span>
              <div className="dist-chips-row">
                {["<5km","<10km","<20km","Partout"].map(d=>(
                  <button key={d} className="dist-chip-sm">{d}</button>
                ))}
              </div>
            </div>
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
          <span>🇲🇦 Fait avec fierté au Maroc</span>
        </div>
      </main>
    </div>
  );
}
