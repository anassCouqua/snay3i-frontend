const fs = require('fs');
const path = require('path');

const roots = [
  path.join(process.cwd(), 'public', 'blog'),
  path.join(process.cwd(), 'public', 'seo', 'blog'),
];

const TAGS = ['h1','h2','h3','h4','h5','h6','p','ul','ol','li','strong','b','em','br'];
const tagPattern = TAGS.join('|');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function repair(file) {
  if (!file.endsWith('.html')) return false;
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Some generated pages contain article markup that was HTML-escaped and then
  // placed inside paragraph elements, e.g. <p>&lt;h3&gt;...&lt;/h3&gt;</p>.
  // Convert only known formatting tags; leave ordinary text safely escaped.
  html = html.replace(
    new RegExp(`<p>\\s*&(?:lt;|#60;)(${tagPattern})\\b[^&]*(?:&gt;|#62;)([\\s\\S]*?)&(?:lt;|#60;)/\\1(?:&gt;|#62;)\\s*</p>`, 'gi'),
    '<$1>$2</$1>'
  );

  // Handle the common entity form explicitly, including attributes on headings.
  html = html.replace(/&lt;(h[1-6])([^&]*)&gt;([\s\S]*?)&lt;\/\1&gt;/gi, '<$1$2>$3</$1>');
  html = html.replace(/&lt;(strong|b|em)([^&]*)&gt;([\s\S]*?)&lt;\/\1&gt;/gi, '<$1$2>$3</$1>');
  html = html.replace(/&lt;(li)([^&]*)&gt;([\s\S]*?)&lt;\/\1&gt;/gi, '<$1$2>$3</$1>');
  html = html.replace(/&lt;\/(ul|ol|p|br)&gt;/gi, '</$1>');
  html = html.replace(/&lt;(ul|ol|p|br)\s*&gt;/gi, '<$1>');

  // Handle backslash-escaped markup produced by some content generators.
  html = html.replace(/\\<(h[1-6]|p|ul|ol|li|strong|b|em|br)([^>]*)>/gi, '<$1$2>');
  html = html.replace(/\\<\/(h[1-6]|p|ul|ol|li|strong|b|em|br)>/gi, '</$1>');

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    console.log(`[static blog repair] repaired ${path.relative(process.cwd(), file)}`);
    return true;
  }
  return false;
}

let changed = 0;
for (const root of roots) {
  for (const file of walk(root)) changed += repair(file) ? 1 : 0;
}
console.log(`[static blog repair] complete; changed ${changed} file(s)`);
