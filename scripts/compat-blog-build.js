const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'src', 'Blog.js');
let source = fs.readFileSync(blogPath, 'utf8');

// react-scripts 5 / its Babel parser can fail on optional chaining in this project.
// Keep the source compatible with the current production build pipeline.
const before = source;
source = source.replace(/article\?\.slug/g, '(article && article.slug)');

if (source !== before) {
  fs.writeFileSync(blogPath, source, 'utf8');
  console.log('[blog compatibility] removed unsupported optional chaining from Blog.js');
} else {
  console.log('[blog compatibility] no optional chaining replacement needed');
}
