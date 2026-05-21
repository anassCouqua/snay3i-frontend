with open('src/App.js', 'r') as f:
    content = f.read()

# Find the distance row closing and add after it
old = '            </div>\n          </div>\n\n        </div>'
new = '''            </div>
          </div>
          <div className="srow join-row" onClick={()=>setShowRegister(true)}>
            <div className="sicon" style={{background:"rgba(196,98,45,0.12)"}}>🛠️</div>
            <span style={{flex:1,fontSize:13,fontWeight:600,color:"var(--ink)"}}>{lang==="fr"?"Vous êtes artisan ?":"أنت معلم؟"}</span>
            <button style={{background:"#C4622D",color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{lang==="fr"?"Rejoindre →":"انضم →"}</button>
          </div>

        </div>'''

if old in content:
    content = content.replace(old, new)
    print("Done!")
else:
    print("Not found - checking...")
    idx = content.find('</div>\n\n        </div>')
    print(repr(content[idx-100:idx+50]))

with open('src/App.js', 'w') as f:
    f.write(content)
