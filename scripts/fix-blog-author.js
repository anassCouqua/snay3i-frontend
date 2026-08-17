const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
let content = fs.readFileSync(file, 'utf8');
content = content.replace("const AUTHOR_TITLE = 'Fondateur de Snay3i.ma | Expert en services artisanaux au Maroc';", "const AUTHOR_TITLE = 'Fondateur de Snay3i.ma | Guides pratiques pour les travaux au Maroc';");
fs.writeFileSync(file, content, 'utf8');
console.log('Blog author positioning normalized');
