const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
let content = fs.readFileSync(file, 'utf8');

// Remove any unmatched Markdown bold markers that could leak into generated HTML.
content = content.replace(/\*\*/g, '');

fs.writeFileSync(file, content, 'utf8');
console.log('Blog markdown marker cleanup applied');
