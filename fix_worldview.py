with open('src/App.js', 'r') as f:
    content = f.read()

old = '''    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: myPos ? [myPos.lng, myPos.lat] : [-7.0926, 31.7917],
      zoom: myPos ? 10 : 5,
      attributionControl: false,
    });'''

new = '''    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: myPos ? [myPos.lng, myPos.lat] : [-7.0926, 31.7917],
      zoom: myPos ? 10 : 5,
      attributionControl: false,
      transformRequest: (url) => {
        if (url.includes("api.mapbox.com") || url.includes("mapbox://")) {
          return { url: url.includes("?") ? url + "&worldview=MA" : url + "?worldview=MA" };
        }
        return { url };
      }
    });'''

if old in content:
    content = content.replace(old, new)
    print("Fixed!")
else:
    print("Not found!")

with open('src/App.js', 'w') as f:
    f.write(content)
