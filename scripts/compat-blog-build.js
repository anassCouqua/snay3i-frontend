const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'src', 'Blog.js');
let source = fs.readFileSync(blogPath, 'utf8');

// react-scripts 5 / its Babel parser can fail on optional chaining in generated blog helpers.
// Normalize the generated helper signature first, then remove remaining optional chaining.
const before = source;
source = source.replace(
  /function\s+snay3iCardPhoto\(article\?\.slug\s*\|\|\s*(['"])(.*?)\1\)\s*\{/g,
  'function snay3iCardPhoto(article) {\n  const slug = (article && article.slug) || $1$2$1;'
);
source = source.replace(/\?\./g, '.');

if (source !== before) {
  fs.writeFileSync(blogPath, source, 'utf8');
  console.log('[blog compatibility] normalized generated Blog.js helpers');
} else {
  console.log('[blog compatibility] no compatibility replacement needed');
}
