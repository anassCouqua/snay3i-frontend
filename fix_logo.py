with open('src/App.js', 'r') as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines[1019:1035], start=1020):
    print(f"{i}: {line}")
