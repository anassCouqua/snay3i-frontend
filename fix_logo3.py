with open('src/App.js', 'r') as f:
    content = f.read()

old = ' className="brand">\n              <div className="brand-mark">\n                <svg viewBox="0 0 32 32" fill="none">\n                  <polygon points="16,2 19,11 29,11 21,17 24,27 16,21 8,27 11,17 3,11 13,11" fill="#fff" opacity="0.95"/>\n                </svg>\n              </div>\n              <div className="brand-name">\n                <span className="brand-fr">Snay3i</span>\n                <span className="brand-dot">.ma</span>\n              </div>\n              <span className="brand-ar">صنايعي</span>\n            </div>'

new = ' className="brand">\n              <img src="/logo.png" alt="Snay3i.ma" style={{height:48,objectFit:"contain"}}/>\n            </div>'

if old in content:
    content = content.replace(old, new)
    print("Logo fixed!")
else:
    print("Still not found")

with open('src/App.js', 'w') as f:
    f.write(content)
