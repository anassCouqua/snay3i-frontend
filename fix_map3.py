with open('src/App.js', 'r') as f:
    content = f.read()

# Change to warm colorful style
content = content.replace(
    'style: "mapbox://styles/mapbox/outdoors-v12"',
    'style: "mapbox://styles/mapbox/streets-v12"'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done! Style:", "streets-v12" in content)
