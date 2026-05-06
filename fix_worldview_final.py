with open('src/App.js', 'r') as f:
    content = f.read()

# Replace the border hiding code with the proper worldview filter
old = '''      map.getStyle().layers.forEach(layer => {
        if (layer.id.includes("disputed") || layer.id.includes("admin-0-boundary")) {
          try { map.setPaintProperty(layer.id, "line-opacity", 0); } catch(e) {}
        }
      });
      if (map.getLayer("admin-0-boundary-disputed")) {
        map.setPaintProperty("admin-0-boundary-disputed", "line-opacity", 0);
        map.setPaintProperty("admin-0-boundary-disputed", "line-width", 0);
      }'''

new = '''      // Set Morocco worldview - removes disputed border and Western Sahara label
      const WORLD_VIEW = "MA";
      const adminLayers = [
        "admin-0-boundary", "admin-1-boundary", "admin-0-boundary-disputed",
        "admin-1-boundary-bg", "admin-0-boundary-bg", "country-label"
      ];
      adminLayers.forEach((adminLayer) => {
        if (map.getLayer(adminLayer)) {
          map.setFilter(adminLayer, ["match", ["get", "worldview"], ["all", WORLD_VIEW], true, false]);
        }
      });'''

if old in content:
    content = content.replace(old, new)
    print("Fixed with MA worldview filter!")
else:
    print("Not found - searching...")
    idx = content.find('admin-0-boundary-disputed')
    print(repr(content[idx-100:idx+200]))

with open('src/App.js', 'w') as f:
    f.write(content)
