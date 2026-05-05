with open('src/App.js', 'r') as f:
    content = f.read()

# Add Carte button
content = content.replace(
    '{error&&<span className="err-msg">{error}</span>}',
    '{error&&<span className="err-msg">{error}</span>}<button onClick={()=>setShowMap(true)} style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:13,fontWeight:600,color:"var(--ink)"}}>🗺 Carte</button>'
)

# Add modal render
content = content.replace(
    '      </main>\n    </div>\n  );\n}',
    '      </main>\n      {showMap&&<MapModal workers={sorted} onClose={()=>setShowMap(false)} userLoc={userLoc} activeCategory={category}/>}\n    </div>\n  );\n}'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done! Button:", "🗺 Carte" in content, "Modal:", "showMap&&<MapModal" in content)
