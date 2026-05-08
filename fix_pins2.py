with open('src/App.js', 'r') as f:
    content = f.read()

old = '    if (!mapInst.current || !workers.length) return;\n    const map = mapInst.current;'

new = '''    if (!workers.length) return;
    // Wait for map to be ready
    const tryAddMarkers = () => {
      if (!mapInst.current) {
        setTimeout(tryAddMarkers, 500);
        return;
      }
      const map = mapInst.current;'''

content = content.replace(old, new)

# Also close the new function
old_end = '''    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers]);'''

new_end = '''    });
    };
    tryAddMarkers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers]);'''

content = content.replace(old_end, new_end)

with open('src/App.js', 'w') as f:
    f.write(content)
print("Done!")
