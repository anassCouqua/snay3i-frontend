with open('src/App.js', 'r') as f:
    content = f.read()

# Add RTL plugin before map init
content = content.replace(
    'const map = new mapboxgl.Map({',
    '''if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === "unavailable") {
        mapboxgl.setRTLTextPlugin(
          "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js",
          null, true
        );
      }
      const map = new mapboxgl.Map({'''
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
