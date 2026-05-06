with open('src/App.js', 'r') as f:
    content = f.read()

# Add workers dependency to map useEffect so it re-renders when workers arrive
content = content.replace(
    '    return () => map.remove();\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);',
    '    return () => map.remove();\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [workers]);'
)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
