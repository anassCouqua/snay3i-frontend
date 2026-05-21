with open('src/App.js', 'r') as f:
    content = f.read()

old = '''      {/* ══ JOIN ROW ═══════════════════════════════════════════ */}
          <div className="srow join-row" onClick={()=>setShowRegister(true)}>
            <div className="sicon" style={{background:"rgba(196,98,45,0.12)"}}>🛠️</div>
            <span style={{flex:1,fontSize:13,fontWeight:600,color:"var(--ink)"}}>{lang==="fr"?"Vous êtes artisan ? Rejoignez-nous":"\u0623\u0646\u062a \u0645\u0639\u0644\u0645\u061f \u0627\u0646\u0636\u0645 \u0625\u0644\u064a\u0646\u0627"}</span>
            <span style={{color:"#C4622D",fontWeight:700,fontSize:13}}>{lang==="fr"?"Gratuit \u2192":"\u0645\u062c\u0627\u0646\u064a \u2192"}</span>
          </div>

      {/* \u2550\u2550 LOCATE BANNER \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}'''

new = '      {/* \u2550\u2550 LOCATE BANNER \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}'

content = content.replace(old, new)
with open('src/App.js', 'w') as f:
    f.write(content)
print("Removed! join-row remaining:", content.count('join-row'))
