with open('src/App.js', 'r') as f:
    content = f.read()

# Find addWorkerMarkers function
start = content.find('  const addWorkerMarkers = useCallback')
end = content.find('  }, []);\n\n  useEffect(() => {\n    if (!mapRef.current)', start)
end = end + len('  }, []);')

worker_func = content[start:end]
print("Function found, length:", len(worker_func))

# Remove it from current position
content = content[:start] + content[end+1:]

# Insert before the map useEffect
map_effect = '  useEffect(() => {\n    if (!mapRef.current) return;'
content = content.replace(map_effect, worker_func + '\n\n' + map_effect)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
