with open('src/App.js', 'r') as f:
    content = f.read()

content = content.replace(
    'style: "mapbox://styles/mapbox/light-v11"',
    'style: "mapbox://styles/mapbox/navigation-night-v1"'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done! Style:", "navigation-night-v1" in content)
