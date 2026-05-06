with open('src/App.js', 'r') as f:
    content = f.read()

# Add berm/wall hiding after worldview filter
old = '''      });'''

new = '''      });
      // Hide the berm/sand wall line
      map.getStyle().layers.forEach(layer => {
        if (layer.id.includes("berm") || layer.id.includes("wall") || layer.id.includes("barrier")) {
          try { map.setLayoutProperty(layer.id, "visibility", "none"); } catch(e) {}
        }
      });'''

# Only replace the first occurrence (inside map.on load)
idx = content.find('      adminLayers.forEach')
end = content.find('      });', idx) + len('      });')
content = content[:end] + '\n      // Hide the berm/sand wall line\n      map.getStyle().layers.forEach(layer => {\n        if (layer.id.includes("berm") || layer.id.includes("wall") || layer.id.includes("barrier")) {\n          try { map.setLayoutProperty(layer.id, "visibility", "none"); } catch(e) {}\n        }\n      });' + content[end:]

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
