with open('src/App.js', 'r') as f:
    content = f.read()

# Fix worldview - must be set as a transform request
old_map_init = '''    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center, zoom: myPos ? 10 : 5,
      attributionControl: false,
      worldview: "MA",
    });'''

new_map_init = '''    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center, zoom: myPos ? 10 : 5,
      attributionControl: false,
      transformRequest: (url) => {
        if (url.includes("mapbox.com")) {
          return { url: url + (url.includes("?") ? "&" : "?") + "worldview=MA" };
        }
        return { url };
      }
    });'''

if old_map_init in content:
    content = content.replace(old_map_init, new_map_init)
    print("Map init fixed!")
else:
    print("Map init not found - trying alternate...")
    # Try without worldview line
    old2 = '''    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center, zoom: myPos ? 10 : 5,
      attributionControl: false,
    });'''
    new2 = '''    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center, zoom: myPos ? 10 : 5,
      attributionControl: false,
      transformRequest: (url) => {
        if (url.includes("mapbox.com")) {
          return { url: url + (url.includes("?") ? "&" : "?") + "worldview=MA" };
        }
        return { url };
      }
    });'''
    if old2 in content:
        content = content.replace(old2, new2)
        print("Map init fixed (alternate)!")
    else:
        print("Not found either!")

# Also hide disputed border on load
old_borders = '''      ["country-label","state-label","admin-1-boundary","admin-0-boundary","admin-0-boundary-disputed"].forEach(layer => {
        if (map.getLayer(layer)) {
          if (layer.includes("boundary")) map.setPaintProperty(layer, "line-opacity", 0);
          if (layer.includes("label")) map.setLayoutProperty(layer, "visibility", "none");
        }
      });'''

new_borders = '''      map.getStyle().layers.forEach(layer => {
        if (layer.id.includes("disputed") || layer.id.includes("admin-0-boundary")) {
          try { map.setPaintProperty(layer.id, "line-opacity", 0); } catch(e) {}
        }
      });
      if (map.getLayer("admin-0-boundary-disputed")) {
        map.setPaintProperty("admin-0-boundary-disputed", "line-opacity", 0);
        map.setPaintProperty("admin-0-boundary-disputed", "line-width", 0);
      }'''

content = content.replace(old_borders, new_borders)

with open('src/App.js', 'w') as f:
    f.write(content)
print("All done!")
