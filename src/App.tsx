import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, Modal, Linking, ActivityIndicator, Image,
  StatusBar, Dimensions, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';

const API_BASE = 'https://snay3i-backend.onrender.com';
const {width} = Dimensions.get('window');

const C = {
  ink:'#0D1B2A',terra:'#C4622D',terraL:'#FBE9DF',terraD:'#9B4A20',
  gold:'#D4A843',teal:'#1A7A6E',tealL:'#D8F0EC',tealD:'#0F5248',
  cream:'#FAF6EF',white:'#FFFFFF',muted:'#7A7065',border:'#E8E0D4',
  green:'#22C55E',greenD:'#1A6B3A',greenL:'#D8F5E4',
};

const CATEGORIES = [
  {id:'all',label:'Tous',ar:'الكل',emoji:'🏠'},
  {id:'plumber',label:'Plombier',ar:'سبّاك',emoji:'🔧'},
  {id:'electrician',label:'Électricien',ar:'كهربائي',emoji:'⚡'},
  {id:'builder',label:'Maçon',ar:'بنّاء',emoji:'🧱'},
  {id:'handyman',label:'Bricoleur',ar:'مصلح',emoji:'🔨'},
  {id:'painter',label:'Peintre',ar:'نقّاش',emoji:'🎨'},
  {id:'carpenter',label:'Menuisier',ar:'نجّار',emoji:'🪚'},
  {id:'tiler',label:'Carreleur',ar:'بلاّط',emoji:'🏛️'},
  {id:'ac_tech',label:'Climatisation',ar:'تكييف',emoji:'❄️'},
  {id:'locksmith',label:'Serrurier',ar:'قفّال',emoji:'🔑'},
  {id:'cleaner',label:'Ménage',ar:'تنظيف',emoji:'🧹'},
  {id:'gardener',label:'Jardinier',ar:'بستاني',emoji:'🌿'},
  {id:'welder',label:'Soudeur',ar:'لحّام',emoji:'🔥'},
];

const CITIES = [
  'Toutes','Casablanca','Rabat','Marrakech','Fes','Tanger','Agadir',
  'Meknes','Oujda','Nador','Tetouan','Sale','Kenitra',
  'Al Hoceima','Chefchaouen','Larache','El Jadida','Safi','Essaouira',
  'Settat','Mohammedia','Beni Mellal','Khouribga',
  'Ouarzazate','Errachidia','Taza','Berkane',
  'Taroudannt','Tiznit','Guelmim','Laayoune','Dakhla','Tan-Tan',
  'Temara','Sidi Kacem','Khemisset',
];

const CITY_COORDS:{[k:string]:{lat:number;lng:number}} = {
  Casablanca:{lat:33.5731,lng:-7.5898},Rabat:{lat:34.0209,lng:-6.8416},
  Marrakech:{lat:31.6295,lng:-7.9811},Fes:{lat:34.0181,lng:-5.0078},
  Tanger:{lat:35.7595,lng:-5.8340},Agadir:{lat:30.4278,lng:-9.5981},
  Meknes:{lat:33.8935,lng:-5.5473},Oujda:{lat:34.6814,lng:-1.9086},
  Nador:{lat:35.1680,lng:-2.9287},Tetouan:{lat:35.5785,lng:-5.3684},
  Sale:{lat:34.0531,lng:-6.7985},Kenitra:{lat:34.2610,lng:-6.5802},
  'Al Hoceima':{lat:35.2517,lng:-3.9372},Chefchaouen:{lat:35.1688,lng:-5.2636},
  Larache:{lat:35.1932,lng:-6.1561},'El Jadida':{lat:33.2316,lng:-8.5007},
  Safi:{lat:32.2994,lng:-9.2372},Essaouira:{lat:31.5085,lng:-9.7595},
  Settat:{lat:33.0016,lng:-7.6199},Mohammedia:{lat:33.6861,lng:-7.3832},
  'Beni Mellal':{lat:32.3372,lng:-6.3498},Khouribga:{lat:32.8811,lng:-6.9063},
  Ouarzazate:{lat:30.9189,lng:-6.8934},Errachidia:{lat:31.9299,lng:-4.4247},
  Taza:{lat:34.2100,lng:-4.0100},Berkane:{lat:34.9200,lng:-2.3200},
  Taroudannt:{lat:30.4728,lng:-8.8780},Tiznit:{lat:29.6978,lng:-9.7328},
  Guelmim:{lat:28.9870,lng:-10.0574},Laayoune:{lat:27.1536,lng:-13.2033},
  Dakhla:{lat:23.7136,lng:-15.9355},'Tan-Tan':{lat:28.4380,lng:-11.1012},
  Temara:{lat:33.9268,lng:-6.9069},'Sidi Kacem':{lat:34.2241,lng:-5.7062},
  Khemisset:{lat:33.8239,lng:-6.0660},
};

const AVATAR_COLORS = [
  ['#B85C2C','#FBE9DF'],['#1A5C4A','#D8F0E8'],['#6B3A9E','#EDE0F8'],
  ['#145080','#D5E8F5'],['#7A4F00','#FBF0DC'],['#9C2752','#F8DDE8'],
];

function avatarColor(name:string){return AVATAR_COLORS[name.charCodeAt(0)%AVATAR_COLORS.length];}
function initials(name:string){return name.split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase();}
function catLabel(s:string){return CATEGORIES.find(c=>c.id===s)?.label||s;}
function catEmoji(s:string){return CATEGORIES.find(c=>c.id===s)?.emoji||'🔧';}
function haversineKm(la1:number,ln1:number,la2:number,ln2:number){
  const R=6371,dL=((la2-la1)*Math.PI)/180,dN=((ln2-ln1)*Math.PI)/180;
  const a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dN/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function Stars({rating}:{rating:number}){
  return(
    <View style={{flexDirection:'row',alignItems:'center',gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <Text key={i} style={{fontSize:12,color:i<=Math.round(rating)?C.gold:'#DDD'}}>★</Text>
      ))}
      <Text style={{fontSize:12,fontWeight:'700',color:C.ink,marginLeft:3}}>{rating}</Text>
    </View>
  );
}

function ReviewsSection({workerId}:{workerId:number}){
  const [reviews,setReviews]=useState<any[]>([]);
  const [showForm,setShowForm]=useState(false);
  const [author,setAuthor]=useState('');
  const [rating,setRating]=useState(5);
  const [comment,setComment]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const load=()=>{fetch(`${API_BASE}/reviews/${workerId}`).then(r=>r.json()).then(d=>setReviews(Array.isArray(d)?d:[])).catch(()=>{});};
  useEffect(()=>{load();},[workerId]);
  const submit=async()=>{
    if(!author.trim()||!comment.trim()) return;
    setSubmitting(true);
    try{
      await fetch(`${API_BASE}/reviews`,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({worker_id:workerId,author,rating,comment})});
      setShowForm(false);setAuthor('');setComment('');setRating(5);load();
    }catch(e){}
    setSubmitting(false);
  };
  return(
    <View>
      <Text style={s.secLbl}>Avis ({reviews.length})</Text>
      {reviews.slice(0,5).map((r:any,i:number)=>(
        <View key={i} style={{marginBottom:10,padding:12,backgroundColor:C.cream,borderRadius:12}}>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
            <Text style={{fontWeight:'700',color:C.ink,flex:1}}>{r.author}</Text>
            <Stars rating={r.rating}/>
          </View>
          <Text style={{fontSize:13,color:C.muted,lineHeight:19}}>{r.comment}</Text>
        </View>
      ))}
      {reviews.length===0&&<Text style={{fontSize:13,color:C.muted,marginBottom:8}}>Aucun avis pour l'instant.</Text>}
      {!showForm?(
        <TouchableOpacity style={[s.btnP,{backgroundColor:C.terra,marginTop:4}]} onPress={()=>setShowForm(true)}>
          <Text style={s.btnPT}>✍️ Laisser un avis</Text>
        </TouchableOpacity>
      ):(
        <View style={{marginTop:8}}>
          <TextInput style={s.inp} placeholder="Votre nom" placeholderTextColor={C.muted} value={author} onChangeText={setAuthor}/>
          <View style={{flexDirection:'row',justifyContent:'center',gap:10,marginBottom:14}}>
            {[1,2,3,4,5].map(i=>(<TouchableOpacity key={i} onPress={()=>setRating(i)}><Text style={{fontSize:32,color:i<=rating?C.gold:'#DDD'}}>★</Text></TouchableOpacity>))}
          </View>
          <TextInput style={[s.inp,{height:90,textAlignVertical:'top'}]} placeholder="Votre commentaire..."
            placeholderTextColor={C.muted} multiline value={comment} onChangeText={setComment}/>
          <View style={{flexDirection:'row',gap:10}}>
            <TouchableOpacity style={[s.btnG,{flex:1}]} onPress={()=>setShowForm(false)}><Text style={s.btnGT}>Annuler</Text></TouchableOpacity>
            <TouchableOpacity style={[s.btnP,{flex:1,backgroundColor:C.terra},(!author||!comment||submitting)&&{opacity:0.4}]}
              disabled={!author||!comment||submitting} onPress={submit}>
              <Text style={s.btnPT}>{submitting?'⌛':'Publier'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function AiChat({worker}:{worker:any}){
  const [msgs,setMsgs]=useState<{sender:string;text:string}[]>([]);
  const [input,setInput]=useState('');
  const [sending,setSending]=useState(false);
  const [typing,setTyping]=useState(false);
  const scrollRef=useRef<ScrollView>(null);
  const send=async()=>{
    if(!input.trim()) return;
    const userMsg={sender:'client',text:input.trim()};
    const newMsgs=[...msgs,userMsg];
    setMsgs(newMsgs);setInput('');setSending(true);setTyping(true);
    const history=newMsgs.map(m=>({role:m.sender==='client'?'user':'assistant',content:m.text}));
    try{
      const res=await fetch(`${API_BASE}/ai-reply`,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({worker_id:worker.id,messages:history})});
      const data=await res.json();
      setMsgs(prev=>[...prev,{sender:'worker',text:data.text||'Je vous répondrai très vite!'}]);
    }catch{setMsgs(prev=>[...prev,{sender:'worker',text:'Je vous répondrai très vite!'}]);}
    setTyping(false);setSending(false);
    setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),100);
  };
  return(
    <View style={{marginTop:4}}>
      <Text style={s.secLbl}>Chat ✨ IA</Text>
      <View style={{backgroundColor:C.cream,borderRadius:14,padding:12,minHeight:80,maxHeight:200,marginBottom:10}}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          {msgs.length===0&&<Text style={{color:C.muted,fontSize:13,textAlign:'center',marginTop:16}}>Posez une question à {worker.name.split(' ')[0]} 👋</Text>}
          {msgs.map((m,i)=>(
            <View key={i} style={{alignSelf:m.sender==='client'?'flex-end':'flex-start',
              backgroundColor:m.sender==='client'?C.ink:C.white,
              borderRadius:12,padding:10,marginBottom:6,maxWidth:'80%'}}>
              <Text style={{color:m.sender==='client'?'#fff':C.ink,fontSize:13,lineHeight:18}}>{m.text}</Text>
            </View>
          ))}
          {typing&&<View style={{alignSelf:'flex-start',backgroundColor:C.white,borderRadius:12,padding:10,marginBottom:6}}>
            <Text style={{color:C.muted,fontSize:13}}>✨ En train de répondre...</Text>
          </View>}
        </ScrollView>
      </View>
      <View style={{flexDirection:'row',gap:8}}>
        <TextInput style={[s.inp,{flex:1,marginBottom:0,paddingVertical:10}]}
          placeholder="Votre message..." placeholderTextColor={C.muted}
          value={input} onChangeText={setInput} onSubmitEditing={send} returnKeyType="send"/>
        <TouchableOpacity style={[s.btnP,{paddingHorizontal:16,marginTop:0,opacity:sending?0.4:1}]} onPress={send} disabled={sending}>
          <Text style={s.btnPT}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ContactModal({worker,onClose}:{worker:any;onClose:()=>void}){
  const [bg,tc]=avatarColor(worker.name);
  return(
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={[s.sheetHdr,{backgroundColor:bg}]}>
            <View style={[s.mAvatar,{backgroundColor:'rgba(255,255,255,0.25)'}]}>
              <Text style={{fontSize:22,fontWeight:'700',color:tc}}>{initials(worker.name)}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={s.mName}>{worker.name}</Text>
              <Text style={s.mSub}>{catEmoji(worker.service)} {catLabel(worker.service)} • {worker.city}</Text>
              {worker.verified&&<View style={s.mVpill}><Text style={s.mVtxt}>✓ Vérifié</Text></View>}
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
            <View style={s.expRow}>
              {[{n:worker.years_exp,l:'ans exp.'},{n:worker.rating,l:'note /5'},{n:worker.reviews,l:'avis'}].map(e=>(
                <View key={e.l} style={s.expBox}><Text style={s.expN}>{e.n}</Text><Text style={s.expL}>{e.l}</Text></View>
              ))}
            </View>
            <Text style={s.secLbl}>À propos</Text>
            <Text style={{fontSize:14,color:C.muted,lineHeight:22,marginBottom:16}}>{worker.bio}</Text>
            <Text style={s.secLbl}>Adresse</Text>
            <Text style={{fontSize:14,color:C.ink,marginBottom:16}}>📍 {worker.address}</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:20}}>
              {worker.tags.map((t:string)=>(<View key={t} style={s.tag}><Text style={s.tagT}>{t}</Text></View>))}
            </View>
            <Text style={s.secLbl}>Contact • تواصل</Text>
            <TouchableOpacity style={s.cBtn} onPress={()=>Linking.openURL('tel:'+worker.phone)}>
              <Text style={{fontSize:18}}>📞</Text>
              <Text style={{fontSize:14,fontWeight:'600',color:C.tealD,flex:1}}>{worker.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.cBtn,{backgroundColor:C.greenL}]}
              onPress={()=>Linking.openURL('https://wa.me/'+(worker.whatsapp||'').replace(/\D/g,''))}>
              <Text style={{fontSize:18}}>💬</Text>
              <Text style={{fontSize:14,fontWeight:'600',color:C.greenD,flex:1}}>WhatsApp</Text>
            </TouchableOpacity>
            <AiChat worker={worker}/>
            <ReviewsSection workerId={worker.id}/>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function RegisterModal({onClose,lang}:{onClose:()=>void;lang:string}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:'',service:'',city:'',phone:'',whatsapp:'',address:'',bio:'',years_exp:'',tags:''});
  const [submitting,setSubmitting]=useState(false);
  const [done,setDone]=useState(false);
  const up=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const submit=async()=>{
    setSubmitting(true);
    try{
      const payload={...form,years_exp:parseInt(form.years_exp)||1,
        tags:form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),
        whatsapp:form.whatsapp||form.phone,verified:false,rating:5.0,reviews:0};
      const res=await fetch(`${API_BASE}/workers`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(res.ok) setDone(true); else Alert.alert('Erreur','Réessayez.');
    }catch(e){Alert.alert('Erreur réseau','Vérifiez votre connexion.');}
    setSubmitting(false);
  };
  return(
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1,justifyContent:'flex-end'}}>
          <View style={[s.sheet,{maxHeight:'95%'}]}>
            <View style={[s.sheetHdr,{backgroundColor:C.ink}]}>
              <View style={{flex:1}}>
                <Text style={s.mName}>{lang==='fr'?'Rejoindre Snay3i.ma':'انضم إلى صنايعي.ما'}</Text>
                <View style={{flexDirection:'row',gap:6,marginTop:8}}>
                  {[1,2,3].map(i=>(<View key={i} style={{width:28,height:4,borderRadius:2,backgroundColor:step>=i?C.terra:'rgba(255,255,255,0.25)'}}/>))}
                </View>
              </View>
              <TouchableOpacity style={s.closeBtn} onPress={onClose}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>✕</Text></TouchableOpacity>
            </View>
            {done?(
              <View style={{padding:40,alignItems:'center'}}>
                <Text style={{fontSize:60,marginBottom:16}}>🎉</Text>
                <Text style={{fontSize:22,fontWeight:'700',color:C.ink,textAlign:'center',marginBottom:8}}>Bienvenue sur Snay3i.ma!</Text>
                <Text style={{fontSize:14,color:C.muted,textAlign:'center',lineHeight:22,marginBottom:32}}>Votre profil est maintenant en ligne.</Text>
                <TouchableOpacity style={[s.btnP,{width:'100%'}]} onPress={onClose}><Text style={s.btnPT}>Voir les maalems →</Text></TouchableOpacity>
              </View>
            ):(
              <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {step===1&&(
                  <View>
                    <Text style={{fontSize:40,marginBottom:8}}>👷</Text>
                    <Text style={s.stepT}>{lang==='fr'?'Qui êtes-vous ?':'من أنت؟'}</Text>
                    <Text style={s.stepS}>{lang==='fr'?'Votre identité et métier':'هويتك ومهنتك'}</Text>
                    <Text style={s.fLbl}>Nom complet</Text>
                    <TextInput style={s.inp} placeholder="Ex: Hassan Benali" placeholderTextColor={C.muted} value={form.name} onChangeText={v=>up('name',v)}/>
                    <Text style={s.fLbl}>Votre métier</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:16}}>
                      {CATEGORIES.filter(c=>c.id!=='all').map(cat=>(
                        <TouchableOpacity key={cat.id} style={[s.svcBtn,form.service===cat.id&&s.svcBtnA]} onPress={()=>up('service',cat.id)}>
                          <Text style={{fontSize:20}}>{cat.emoji}</Text>
                          <Text style={[{fontSize:10,fontWeight:'700',color:C.muted},form.service===cat.id&&{color:'rgba(255,255,255,0.9)'}]}>{cat.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={s.fLbl}>Ville</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
                      <View style={{flexDirection:'row',gap:8,paddingVertical:4}}>
                        {CITIES.filter(c=>c!=='Toutes').map(ct=>(
                          <TouchableOpacity key={ct} style={[s.cityChip,form.city===ct&&s.cityChipA]} onPress={()=>up('city',ct)}>
                            <Text style={[s.cityChipT,form.city===ct&&{color:'#fff'}]}>{ct}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                    <Text style={s.fLbl}>Années d'expérience</Text>
                    <TextInput style={s.inp} placeholder="Ex: 10" keyboardType="numeric" placeholderTextColor={C.muted} value={form.years_exp} onChangeText={v=>up('years_exp',v)}/>
                    <TouchableOpacity style={[s.btnP,(!form.name||!form.service||!form.city)&&{opacity:0.4}]}
                      disabled={!form.name||!form.service||!form.city} onPress={()=>setStep(2)}>
                      <Text style={s.btnPT}>Suivant →</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {step===2&&(
                  <View>
                    <Text style={{fontSize:40,marginBottom:8}}>📞</Text>
                    <Text style={s.stepT}>{lang==='fr'?'Comment vous joindre ?':'كيف يتواصلون معك؟'}</Text>
                    <Text style={s.stepS}>{lang==='fr'?'Vos coordonnées':'معلومات التواصل'}</Text>
                    <Text style={s.fLbl}>Téléphone</Text>
                    <TextInput style={s.inp} placeholder="06XX-XXXXXX" keyboardType="phone-pad" placeholderTextColor={C.muted} value={form.phone} onChangeText={v=>up('phone',v)}/>
                    <Text style={s.fLbl}>WhatsApp (si différent)</Text>
                    <TextInput style={s.inp} placeholder="06XX-XXXXXX" keyboardType="phone-pad" placeholderTextColor={C.muted} value={form.whatsapp} onChangeText={v=>up('whatsapp',v)}/>
                    <Text style={s.fLbl}>Adresse / Quartier</Text>
                    <TextInput style={s.inp} placeholder="Ex: Hay Mohammadi, Casablanca" placeholderTextColor={C.muted} value={form.address} onChangeText={v=>up('address',v)}/>
                    <View style={{flexDirection:'row',gap:10}}>
                      <TouchableOpacity style={[s.btnG,{flex:1}]} onPress={()=>setStep(1)}><Text style={s.btnGT}>← Retour</Text></TouchableOpacity>
                      <TouchableOpacity style={[s.btnP,{flex:1},!form.phone&&{opacity:0.4}]} disabled={!form.phone} onPress={()=>setStep(3)}><Text style={s.btnPT}>Suivant →</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
                {step===3&&(
                  <View>
                    <Text style={{fontSize:40,marginBottom:8}}>✨</Text>
                    <Text style={s.stepT}>{lang==='fr'?'Votre expertise':'خبرتك'}</Text>
                    <Text style={s.stepS}>{lang==='fr'?'Décrivez votre travail':'صف عملك'}</Text>
                    <Text style={s.fLbl}>Description</Text>
                    <TextInput style={[s.inp,{height:100,textAlignVertical:'top'}]}
                      placeholder="Ex: Plombier 10 ans exp." placeholderTextColor={C.muted} multiline value={form.bio} onChangeText={v=>up('bio',v)}/>
                    <Text style={s.fLbl}>Spécialités (séparées par virgule)</Text>
                    <TextInput style={s.inp} placeholder="Ex: Urgences, Chauffe-eau" placeholderTextColor={C.muted} value={form.tags} onChangeText={v=>up('tags',v)}/>
                    <View style={{flexDirection:'row',gap:10}}>
                      <TouchableOpacity style={[s.btnG,{flex:1}]} onPress={()=>setStep(2)}><Text style={s.btnGT}>← Retour</Text></TouchableOpacity>
                      <TouchableOpacity style={[s.btnP,{flex:1,backgroundColor:C.terra},(!form.bio||submitting)&&{opacity:0.4}]}
                        disabled={!form.bio||submitting} onPress={submit}>
                        <Text style={s.btnPT}>{submitting?'⌛ Envoi...':'🚀 Publier'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function WorkerCard({worker,onPress,userLoc,faved,onFav}:{worker:any;onPress:()=>void;userLoc:any;faved:boolean;onFav:()=>void}){
  const [bg,tc]=avatarColor(worker.name);
  const c=CITY_COORDS[worker.city];
  const dist=userLoc&&c?haversineKm(userLoc.lat,userLoc.lng,c.lat,c.lng):null;
  const distLabel=dist!=null?(dist<1?Math.round(dist*1000)+'m':dist.toFixed(1)+'km'):null;
  return(
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.cardStrip,{backgroundColor:bg}]}/>
      <View style={s.cardHead}>
        <View style={[s.avatar,{backgroundColor:bg}]}>
          <Text style={{fontSize:16,fontWeight:'700',color:tc}}>{initials(worker.name)}</Text>
          <View style={s.avatarBadge}><Text style={{fontSize:11}}>{catEmoji(worker.service)}</Text></View>
        </View>
        <View style={{flex:1,minWidth:0}}>
          <View style={{flexDirection:'row',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
            <Text style={s.wName} numberOfLines={1}>{worker.name}</Text>
            {worker.verified&&<View style={s.vPill}><Text style={s.vT}>✓</Text></View>}
          </View>
          <View style={s.sPill}><Text style={s.sPillT}>{catEmoji(worker.service)} {catLabel(worker.service)}</Text></View>
        </View>
        <TouchableOpacity onPress={onFav} style={{padding:6}}>
          <Text style={{fontSize:22,color:faved?'#E63950':'#DDD'}}>{faved?'♥':'♡'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',gap:8,marginVertical:10}}>
        <View style={{width:9,height:9,borderRadius:5,backgroundColor:C.terra}}/>
        <Text style={{fontSize:12,fontWeight:'600',color:C.muted}}>📍 {worker.city}</Text>
        {distLabel&&<Text style={{fontSize:12,fontWeight:'700',color:C.terra}}> • {distLabel}</Text>}
        <View style={{flex:1}}/>
        <View style={{width:7,height:7,borderRadius:4,backgroundColor:C.green}}/>
        <Text style={{fontSize:11,fontWeight:'600',color:C.greenD}}>Disponible</Text>
      </View>
      <Text style={s.bio} numberOfLines={2}>{worker.bio}</Text>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <Stars rating={worker.rating}/>
        <Text style={{fontSize:12,color:C.muted}}>{worker.reviews} avis • {worker.years_exp} ans</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
        <View style={{flexDirection:'row',gap:6}}>
          {worker.tags.map((t:string)=>(<View key={t} style={s.tag}><Text style={s.tagT}>{t}</Text></View>))}
        </View>
      </ScrollView>
      <View style={{flexDirection:'row',gap:8}}>
        <TouchableOpacity style={s.btnCall} onPress={()=>Linking.openURL('tel:'+worker.phone)}>
          <Text style={{fontSize:20}}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnWa} onPress={()=>Linking.openURL('https://wa.me/'+(worker.whatsapp||'').replace(/\D/g,''))}>
          <Text style={{fontSize:20}}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btnMain,{flex:1}]} onPress={onPress}>
          <Text style={s.btnMainT}>👤 Profil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function App(){
  const [query,setQuery]=useState('');
  const [cityInput,setCityInput]=useState('');
  const [city,setCity]=useState('Toutes');
  const [category,setCategory]=useState('all');
  const [workers,setWorkers]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState<any>(null);
  const [showReg,setShowReg]=useState(false);
  const [lang,setLang]=useState('fr');
  const [sort,setSort]=useState('rating');
  const [distKm,setDistKm]=useState<number|null>(null);
  const [userLoc,setUserLoc]=useState<{lat:number;lng:number}|null>(null);
  const [locating,setLocating]=useState(false);
  const [favIds,setFavIds]=useState<Set<number>>(new Set());
  const favStore=useRef<{[k:number]:boolean}>({});

  const toggleFav=(id:number)=>{
    favStore.current[id]=!favStore.current[id];
    setFavIds(new Set(Object.entries(favStore.current).filter(([,v])=>v).map(([k])=>Number(k))));
  };

  const handleLocate=()=>{
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos=>{setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude});setLocating(false);},
      ()=>{Alert.alert('Localisation','Activez la localisation dans Réglages.');setLocating(false);}
    );
  };

  const fetchWorkers=useCallback(async(svc:string,ct:string,q:string)=>{
    setLoading(true);
    try{
      const p=new URLSearchParams();
      if(q&&q.trim())p.set('q',q.trim());
      if(ct&&ct!=='Toutes')p.set('city',ct);
      if(svc&&svc!=='all')p.set('service',svc);
      let res=await fetch(`${API_BASE}/search?${p}`);
      if(!res.ok){
        const ep=svc&&svc!=='all'?`${API_BASE}/workers/${svc}`:`${API_BASE}/workers`;
        const p2=new URLSearchParams();
        if(ct&&ct!=='Toutes')p2.set('city',ct);
        res=await fetch(p2.toString()?`${ep}?${p2}`:ep);
      }
      const data=await res.json();
      setWorkers(Array.isArray(data)?data:[]);
    }catch(e){setWorkers([]);}
    setLoading(false);
  },[]);

  useEffect(()=>{
    const delay=query.trim()?350:0;
    const t=setTimeout(()=>fetchWorkers(category,city,query),delay);
    return()=>clearTimeout(t);
  },[category,city,query,fetchWorkers]);

  const sorted=[...workers]
    .filter((w:any)=>{
      if(distKm&&userLoc){
        const c=CITY_COORDS[w.city];
        if(c&&haversineKm(userLoc.lat,userLoc.lng,c.lat,c.lng)>distKm) return false;
      }
      return true;
    })
    .sort((a:any,b:any)=>{
      if(sort==='distance'&&userLoc){
        const ca=CITY_COORDS[a.city],cb=CITY_COORDS[b.city];
        if(ca&&cb) return haversineKm(userLoc.lat,userLoc.lng,ca.lat,ca.lng)-haversineKm(userLoc.lat,userLoc.lng,cb.lat,cb.lng);
      }
      return b.rating-a.rating;
    });

  const ListHeader=()=>(
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal:16,paddingTop:12,paddingBottom:8,gap:10}}>
        {CATEGORIES.map(cat=>(
          <TouchableOpacity key={cat.id} style={[s.catBtn,category===cat.id&&s.catBtnA]} onPress={()=>setCategory(cat.id)}>
            <Text style={{fontSize:20}}>{cat.emoji}</Text>
            <Text style={[s.catL,category===cat.id&&{color:'rgba(255,255,255,0.85)'}]}>{cat.label}</Text>
            <Text style={[s.catA,category===cat.id&&{color:'rgba(255,255,255,0.7)'}]}>{cat.ar}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal:16,paddingVertical:8,gap:8}}>
        {CITIES.map(ct=>(
          <TouchableOpacity key={ct} style={[s.cityChip,city===ct&&s.cityChipA]}
            onPress={()=>{setCity(ct);setCityInput(ct==='Toutes'?'':ct);}}>
            <Text style={[s.cityChipT,city===ct&&{color:'#fff'}]}>{ct}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{paddingHorizontal:16,paddingBottom:10,gap:10}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <TouchableOpacity onPress={handleLocate}
            style={{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:12,paddingVertical:7,borderRadius:20,
              backgroundColor:userLoc?C.tealL:C.terraL,borderWidth:1.5,borderColor:userLoc?C.teal:C.terra}}>
            <Text style={{fontSize:13}}>{locating?'⌛':userLoc?'✅':'🎯'}</Text>
            <Text style={{fontSize:12,fontWeight:'700',color:userLoc?C.tealD:C.terraD}}>
              {locating?'GPS...':userLoc?'Localisé':'Me localiser'}
            </Text>
          </TouchableOpacity>
          {userLoc&&[5,10,20].map(km=>(
            <TouchableOpacity key={km} onPress={()=>setDistKm(distKm===km?null:km)}
              style={{paddingHorizontal:12,paddingVertical:7,borderRadius:20,
                backgroundColor:distKm===km?C.terra:C.white,borderWidth:1.5,borderColor:distKm===km?C.terra:C.border}}>
              <Text style={{fontSize:12,fontWeight:'700',color:distKm===km?'#fff':C.muted}}>{'<'}{km}km</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{fontSize:13,color:C.muted}}>
            <Text style={{fontWeight:'700',color:C.ink}}>{sorted.length}</Text> maalem{sorted.length!==1?'s':''} trouvé{sorted.length!==1?'s':''}
          </Text>
          <View style={{flexDirection:'row',gap:6}}>
            {[{k:'rating',icon:'⭐'},{k:'distance',icon:'📍'}].map(({k,icon})=>(
              <TouchableOpacity key={k}
                onPress={()=>{if(k==='distance'&&!userLoc)handleLocate();else setSort(k);}}
                style={{paddingHorizontal:10,paddingVertical:5,borderRadius:16,
                  backgroundColor:sort===k?C.ink:C.white,borderWidth:1.5,borderColor:sort===k?C.ink:C.border}}>
                <Text style={{fontSize:13}}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const ListFooter=()=>(
    <View style={s.cta}>
      <Text style={{fontSize:36,marginBottom:10}}>🛠️</Text>
      <Text style={s.ctaT}>{lang==='fr'?'Vous êtes Maalem ?':'أنت معلم؟'}</Text>
      <Text style={s.ctaS}>{lang==='fr'?'Rejoignez Snay3i.ma gratuitement':'انضم إلى صنايعي.ما مجاناً'}</Text>
      <TouchableOpacity style={[s.btnP,{backgroundColor:C.terra,marginTop:14,width:'100%'}]} onPress={()=>setShowReg(true)}>
        <Text style={s.btnPT}>{lang==='fr'?'Rejoindre →':'انضم الآن →'}</Text>
      </TouchableOpacity>
    </View>
  );

  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.ink}}>
      <StatusBar barStyle="light-content" backgroundColor={C.ink}/>
      <View style={s.header}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <Image source={require('./assets/logo.png')} style={{width:130,height:44,resizeMode:'contain'}}/>
          <TouchableOpacity style={s.langBtn} onPress={()=>setLang(l=>l==='fr'?'ar':'fr')}>
            <Text style={s.langT}>{lang==='fr'?'عربي':'FR'}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.searchCard}>
          <View style={s.searchRow}>
            <Text style={{fontSize:15}}>🔍</Text>
            <TextInput style={s.searchInp}
              placeholder={lang==='fr'?'Quel service cherchez-vous ?':'ما هي الخدمة التي تبحث عنها؟'}
              placeholderTextColor={C.muted} value={query} onChangeText={setQuery}/>
            {query.length>0&&<TouchableOpacity onPress={()=>setQuery('')}><Text style={{fontSize:16,color:C.muted}}>✕</Text></TouchableOpacity>}
          </View>
          <View style={s.searchDivider}/>
          <View style={s.searchRow}>
            <Text style={{fontSize:15}}>📍</Text>
            <TextInput style={s.searchInp}
              placeholder={lang==='fr'?'Ville (ex: Casablanca)':'المدينة'}
              placeholderTextColor={C.muted} value={cityInput}
              onChangeText={v=>setCityInput(v)}
              returnKeyType="search"
              onSubmitEditing={()=>{
                const v=cityInput.trim();
                if(!v){setCity('Toutes');return;}
                const match=CITIES.find(c=>c.toLowerCase().startsWith(v.toLowerCase()));
                if(match){setCity(match);setCityInput(match);}
                else{setCity('Toutes');setCityInput('');}
              }}
              onEndEditing={()=>{if(!cityInput.trim())setCity('Toutes');}}/>
            {cityInput.length>0&&<TouchableOpacity onPress={()=>{setCityInput('');setCity('Toutes');}}><Text style={{fontSize:16,color:C.muted}}>✕</Text></TouchableOpacity>}
          </View>
        </View>
      </View>
      {loading?(
        <View style={{flex:1,backgroundColor:C.cream,alignItems:'center',justifyContent:'center',gap:12}}>
          <ActivityIndicator size="large" color={C.terra}/>
          <Text style={{fontSize:14,color:C.muted}}>Chargement...</Text>
        </View>
      ):(
        <FlatList
          data={sorted}
          keyExtractor={(item:any)=>item.id.toString()}
          renderItem={({item}:{item:any})=>(
            <WorkerCard worker={item} onPress={()=>setSelected(item)}
              userLoc={userLoc} faved={favIds.has(item.id)} onFav={()=>toggleFav(item.id)}/>
          )}
          ListHeaderComponent={<ListHeader/>}
          ListFooterComponent={<ListFooter/>}
          ListEmptyComponent={
            <View style={{alignItems:'center',padding:48}}>
              <Text style={{fontSize:48,marginBottom:12}}>🔍</Text>
              <Text style={{fontSize:18,fontWeight:'700',color:C.ink,marginBottom:6}}>Aucun maalem trouvé</Text>
              <Text style={{fontSize:14,color:C.muted,textAlign:'center'}}>Essayez une autre catégorie ou ville</Text>
            </View>
          }
          contentContainerStyle={{paddingHorizontal:16,gap:14,paddingBottom:32,backgroundColor:C.cream}}
          style={{backgroundColor:C.cream}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
      {selected&&<ContactModal worker={selected} onClose={()=>setSelected(null)}/>}
      {showReg&&<RegisterModal onClose={()=>setShowReg(false)} lang={lang}/>}
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  header:{backgroundColor:C.ink,paddingHorizontal:20,paddingTop:10,paddingBottom:20},
  langBtn:{paddingHorizontal:14,paddingVertical:7,borderRadius:20,borderWidth:1.5,borderColor:'rgba(255,255,255,0.25)',backgroundColor:'rgba(255,255,255,0.08)'},
  langT:{fontSize:13,fontWeight:'600',color:'rgba(255,255,255,0.85)'},
  searchCard:{backgroundColor:C.white,borderRadius:14,overflow:'hidden'},
  searchRow:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,paddingVertical:13,gap:10},
  searchDivider:{height:1,backgroundColor:C.border,marginHorizontal:14},
  searchInp:{flex:1,fontSize:15,color:C.ink,fontWeight:'500'},
  catBtn:{alignItems:'center',paddingVertical:10,paddingHorizontal:12,borderRadius:14,borderWidth:2,borderColor:C.border,backgroundColor:C.white,minWidth:68},
  catBtnA:{backgroundColor:C.ink,borderColor:C.ink},
  catL:{fontSize:10,fontWeight:'700',color:C.muted,marginTop:3},
  catA:{fontSize:9,color:C.muted,marginTop:1},
  cityChip:{paddingHorizontal:14,paddingVertical:8,borderRadius:20,borderWidth:1.5,borderColor:C.border,backgroundColor:C.white},
  cityChipA:{backgroundColor:C.terra,borderColor:C.terra},
  cityChipT:{fontSize:13,fontWeight:'600',color:C.muted},
  card:{backgroundColor:C.white,borderRadius:18,padding:16,borderWidth:1.5,borderColor:C.border,overflow:'hidden'},
  cardStrip:{position:'absolute',top:0,left:0,right:0,height:4},
  cardHead:{flexDirection:'row',alignItems:'flex-start',gap:12,marginTop:6},
  avatar:{width:50,height:50,borderRadius:14,alignItems:'center',justifyContent:'center',position:'relative'},
  avatarBadge:{position:'absolute',bottom:-4,right:-4,width:20,height:20,borderRadius:6,backgroundColor:C.white,alignItems:'center',justifyContent:'center'},
  vPill:{backgroundColor:C.greenL,paddingHorizontal:7,paddingVertical:2,borderRadius:20},
  vT:{fontSize:10,fontWeight:'700',color:C.greenD},
  sPill:{backgroundColor:C.terraL,paddingHorizontal:9,paddingVertical:3,borderRadius:20,alignSelf:'flex-start'},
  sPillT:{fontSize:11,fontWeight:'600',color:C.terra},
  wName:{fontSize:15,fontWeight:'700',color:C.ink,flexShrink:1},
  bio:{fontSize:13,color:C.muted,lineHeight:19,marginBottom:10},
  tag:{backgroundColor:C.cream,borderWidth:1,borderColor:C.border,paddingHorizontal:9,paddingVertical:3,borderRadius:20},
  tagT:{fontSize:11,color:C.muted},
  btnMain:{flex:1,backgroundColor:C.ink,paddingVertical:12,borderRadius:11,alignItems:'center'},
  btnMainT:{color:'#fff',fontWeight:'700',fontSize:13},
  btnCall:{width:44,height:44,borderRadius:11,borderWidth:1.5,borderColor:'#D5E8F5',backgroundColor:'#EAF4FB',alignItems:'center',justifyContent:'center'},
  btnWa:{width:44,height:44,borderRadius:11,borderWidth:1.5,borderColor:'#C8E6C0',backgroundColor:'#F0FBF0',alignItems:'center',justifyContent:'center'},
  cta:{backgroundColor:C.ink,borderRadius:20,padding:24,alignItems:'center',marginTop:8,marginBottom:8},
  ctaT:{fontSize:18,fontWeight:'700',color:'#fff',marginBottom:6},
  ctaS:{fontSize:13,color:'rgba(255,255,255,0.6)',textAlign:'center'},
  overlay:{flex:1,backgroundColor:'rgba(13,27,42,0.65)',justifyContent:'flex-end'},
  sheet:{backgroundColor:C.white,borderRadius:28,maxHeight:'92%'},
  sheetHdr:{flexDirection:'row',alignItems:'flex-end',padding:22,gap:14,borderRadius:28},
  mAvatar:{width:60,height:60,borderRadius:16,alignItems:'center',justifyContent:'center'},
  mName:{fontSize:19,fontWeight:'700',color:'#fff',marginBottom:4},
  mSub:{fontSize:12,color:'rgba(255,255,255,0.75)',marginBottom:6},
  mVpill:{backgroundColor:'rgba(255,255,255,0.2)',paddingHorizontal:9,paddingVertical:3,borderRadius:20,alignSelf:'flex-start'},
  mVtxt:{fontSize:11,fontWeight:'700',color:'#fff'},
  closeBtn:{position:'absolute',top:16,right:16,width:32,height:32,borderRadius:16,backgroundColor:'rgba(255,255,255,0.25)',alignItems:'center',justifyContent:'center'},
  secLbl:{fontSize:10,fontWeight:'700',color:C.muted,letterSpacing:1,textTransform:'uppercase',marginBottom:8,marginTop:14},
  expRow:{flexDirection:'row',gap:10,marginBottom:4},
  expBox:{flex:1,backgroundColor:C.cream,borderRadius:12,padding:12,alignItems:'center'},
  expN:{fontSize:20,fontWeight:'700',color:C.ink},
  expL:{fontSize:11,color:C.muted,marginTop:2},
  cBtn:{flexDirection:'row',alignItems:'center',gap:12,padding:14,borderRadius:12,backgroundColor:C.tealL,marginBottom:10},
  stepT:{fontSize:24,fontWeight:'700',color:C.ink,marginBottom:4},
  stepS:{fontSize:14,color:C.muted,marginBottom:20},
  fLbl:{fontSize:13,fontWeight:'700',color:C.ink,marginBottom:7},
  inp:{borderWidth:2,borderColor:C.border,borderRadius:12,padding:13,fontSize:14,color:C.ink,backgroundColor:C.white,marginBottom:14},
  svcBtn:{alignItems:'center',padding:10,borderRadius:12,borderWidth:2,borderColor:C.border,backgroundColor:C.white,width:(width-56)/3,gap:3},
  svcBtnA:{backgroundColor:C.ink,borderColor:C.ink},
  btnP:{backgroundColor:C.ink,paddingVertical:14,borderRadius:12,alignItems:'center',marginTop:6},
  btnPT:{color:'#fff',fontWeight:'700',fontSize:14},
  btnG:{paddingVertical:14,borderRadius:12,alignItems:'center',borderWidth:2,borderColor:C.border,marginTop:6},
  btnGT:{color:C.muted,fontWeight:'600',fontSize:14},
});
