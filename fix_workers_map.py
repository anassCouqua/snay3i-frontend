with open('src/App.js', 'r') as f:
    content = f.read()

# Add a useEffect to add markers when workers change
old = '''    return () => map.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers]);'''

new = '''    return () => map.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-add markers when workers load
  useEffect(() => {
    if (!mapInst.current || !workers.length) return;
    const map = mapInst.current;
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const SERVICE_EMOJI_W = {plumber:"🔧",electrician:"⚡",builder:"🧱",handyman:"🔨",painter:"🎨",carpenter:"🪚"};
    const SERVICE_COLOR_W = {plumber:"#1A5C82",electrician:"#D4A843",builder:"#8B4513",handyman:"#2E8B57",painter:"#9C2752",carpenter:"#6B3A9E"};
    const CITY_COORDS_W = {
      Casablanca:[-7.5898,33.5731],Rabat:[-6.8416,34.0209],Marrakech:[-7.9811,31.6295],
      Fes:[-5.0078,34.0181],Tanger:[-5.8340,35.7595],Agadir:[-9.5981,30.4278],
      Meknes:[-5.5547,33.8935],Oujda:[-1.9067,34.6867],Kenitra:[-6.5858,34.2610],
      Tetouan:[-5.3626,35.5785],Sale:[-6.7972,34.0531],
    };
    workers.forEach((worker) => {
      const coords = CITY_COORDS_W[worker.city];
      if (!coords) return;
      const jitter = [coords[0]+(Math.random()-0.5)*0.12, coords[1]+(Math.random()-0.5)*0.12];
      const color = SERVICE_COLOR_W[worker.service] || "#C4622D";
      const emoji = SERVICE_EMOJI_W[worker.service] || "🔧";
      const el = document.createElement("div");
      el.style.cssText = "width:44px;height:54px;cursor:pointer;display:flex;flex-direction:column;align-items:center;";
      el.innerHTML = \`<div style="width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:\${color};border:3px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:20px">\${emoji}</span></div>\`;
      el.addEventListener("click", () => setSelectedWorker(worker));
      const marker = new mapboxgl.Marker({element:el, anchor:"bottom"}).setLngLat(jitter).addTo(map);
      markersRef.current.push(marker);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers]);'''

if old in content:
    content = content.replace(old, new)
    print("Fixed!")
else:
    print("Not found!")

with open('src/App.js', 'w') as f:
    f.write(content)
