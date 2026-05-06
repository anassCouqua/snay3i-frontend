with open('src/App.js', 'r') as f:
    content = f.read()

content = content.replace(
    'style: "mapbox://styles/mapbox/navigation-night-v1"',
    'style: "mapbox://styles/couqua/cmotb531x00az01saghiv57iw"'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done! Custom style:", "couqua/cmotb531x00az01saghiv57iw" in content)
