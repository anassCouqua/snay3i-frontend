with open('src/App.js', 'r') as f:
    content = f.read()

old = '''            </div>
          </div>
          {locErr&&<p className="loc-err">{locErr}</p>}'''

new = '''            </div>
          </div>
          <div className="srow join-row" onClick={()=>setShowRegister(true)}>
            <div className="sicon" style={{background:"rgba(196,98,45,0.12)"}}>🛠️</div>
            <span style={{flex:1,fontSize:13,fontWeight:600,color:"var(--ink)"}}>{lang==="fr"?"Vous êtes artisan ?":"أنت معلم؟"}</span>
            <button style={{background:"#C4622D",color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{lang==="fr"?"Rejoindre →":"انضم →"}</button>
          </div>
          {locErr&&<p className="loc-err">{locErr}</p>}'''

if old in content:
    content = content.replace(old, new)
    print("Done!")
else:
    print("Not found!")

with open('src/App.js', 'w') as f:
    f.write(content)
