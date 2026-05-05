with open('src/App.js', 'r') as f:
    content = f.read()

old = '''              <div className="brand">
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
            </div>'''

new = '''              <div className="brand">
              <img src="/logo.png" alt="Snay3i.ma" style={{height:48,objectFit:"contain"}}/>
            </div>'''

if old in content:
    content = content.replace(old, new)
    print("Logo replaced!")
else:
    print("Not found")

with open('src/App.js', 'w') as f:
    f.write(content)
