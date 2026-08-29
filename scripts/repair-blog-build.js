const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
if (!fs.existsSync(file)) throw new Error('src/Blog.js is missing');

let source = fs.readFileSync(file, 'utf8');

// Repair the known malformed boundary where ArticlePage's function was left
// open immediately before Blog's top-level export. Keep this deliberately
// narrow so the build never rewrites unrelated source.
const broken = '  return (<div dangerouslySetInnerHTML={{ __html: article.content }} />);\n\nexport default function Blog';
const fixed = '  return (<div dangerouslySetInnerHTML={{ __html: article.content }} />);\n}\n\nexport default function Blog';

if (source.includes(broken)) {
  source = source.replace(broken, fixed);
  fs.writeFileSync(file, source, 'utf8');
  console.log('[Blog build repair] inserted missing ArticlePage closing brace');
} else {
  console.log('[Blog build repair] no repair needed');
}
