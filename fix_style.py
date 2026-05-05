with open('src/App.js', 'r') as f:
    content = f.read()

# Use the most stunning dark navigation style
content = content.replace(
    'style: "mapbox://styles/mapbox/light-v11"',
    'style: "mapbox://styles/mapbox/navigation-night-v1"'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
