with open('src/App.js', 'r') as f:
    content = f.read()

# Add worldview MA to map init
content = content.replace(
    'attributionControl: false,',
    'attributionControl: false,\n      worldview: "MA",'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
