with open('src/App.js', 'r') as f:
    content = f.read()

old = '''      map.getStyle().layers.forEach(layer => {
        if (layer.id.includes("boundary") || layer.id.includes("border") || layer.id.includes("disputed")) {
          map.setPaintProperty(layer.id, "line-opacity", 0);
        }
        if (layer.id === "country-label" || layer.id.includes("country")) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });'''

new = '''      if (map.getLayer("admin-0-boundary-disputed")) {
        map.setPaintProperty("admin-0-boundary-disputed", "line-opacity", 0);
      }
      if (map.getLayer("country-label")) {
        map.setFilter("country-label", ["!=", "name_en", "Western Sahara"]);
      }'''

content = content.replace(old, new)
with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
