with open('src/App.js', 'r') as f:
    content = f.read()

# Add resize after map loads
content = content.replace(
    'map.addControl(new mapboxgl.NavigationControl(), "top-right");',
    'map.addControl(new mapboxgl.NavigationControl(), "top-right");\n    setTimeout(() => map.resize(), 100);'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
