with open('src/App.js', 'r') as f:
    content = f.read()

# Move addWorkerMarkers before useEffect by converting to useCallback
content = content.replace(
    '  const addWorkerMarkers = (map, workerList, currentFilter) => {',
    '  const addWorkerMarkers = useCallback((map, workerList, currentFilter) => {'
)

# Close the useCallback
content = content.replace(
    '      markersRef.current.push(marker);\n    });\n  };\n\n  useEffect(() => {\n    if (!mapRef.current) return;',
    '      markersRef.current.push(marker);\n    });\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);\n\n  useEffect(() => {\n    if (!mapRef.current) return;'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
