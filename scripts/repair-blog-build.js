const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'Blog.js');
if (!fs.existsSync(file)) throw new Error('src/Blog.js is missing');

let source = fs.readFileSync(file, 'utf8');

// Keep the historical syntax repair in place for older Blog.js revisions.
const broken = '  return (<div dangerouslySetInnerHTML={{ __html: article.content }} />);\n\nexport default function Blog';
const fixed = '  return (<div dangerouslySetInnerHTML={{ __html: article.content }} />);\n}\n\nexport default function Blog';
if (source.includes(broken)) {
  source = source.replace(broken, fixed);
  console.log('[Blog build repair] inserted missing ArticlePage closing brace');
}

// Render article content as React elements instead of exposing raw HTML/Markdown.
// This intentionally supports the Markdown currently used by the blog and also
// normalizes common HTML tags produced by future content generators.
const rendererMarker = 'function Snay3iArticleContent({ content }) {';
if (!source.includes(rendererMarker)) {
  const articlePageMarker = 'function ArticlePage({ slug }) {';
  const renderer = `function normalizeArticleContent(content) {\n  return String(content || '')\n    .replace(/<h([1-6])[^>]*>([\\s\\S]*?)<\\/h\\1>/gi, (_, level, text) => {\n      const clean = text.replace(/<[^>]+>/g, '').trim();\n      return '#'.repeat(Number(level)) + ' ' + clean + '\\n';\n    })\n    .replace(/<strong[^>]*>([\\s\\S]*?)<\\/strong>/gi, '**$1**')\n    .replace(/<b[^>]*>([\\s\\S]*?)<\\/b>/gi, '**$1**')\n    .replace(/<li[^>]*>([\\s\\S]*?)<\\/li>/gi, '- $1\\n')\n    .replace(/<br\\s*\\/?>(?=\\s*)/gi, '\\n')\n    .replace(/<\\/?(?:p|div|section|article)[^>]*>/gi, '\\n')\n    .replace(/<[^>]+>/g, '')\n    .replace(/\\n{3,}/g, '\\n\\n')\n    .trim();\n}\n\nfunction renderInlineMarkdown(text) {\n  const parts = String(text).split(/(\\*\\*[^*]+\\*\\*)/g);\n  return parts.map((part, index) => {\n    if (part.startsWith('**') && part.endsWith('**')) {\n      return <strong key={index}>{part.slice(2, -2)}</strong>;\n    }\n    return part;\n  });\n}\n\nfunction Snay3iArticleContent({ content }) {\n  const paragraphs = normalizeArticleContent(content).split('\\n').map(line => line.trim()).filter(Boolean);\n  return (\n    <div style={{background:'#fff',borderRadius:16,padding:28,border:'1.5px solid #E8E0D4',lineHeight:1.9}}>\n      {paragraphs.map((line, i) => {\n        if (line.startsWith('### ')) return <h3 key={i} style={{fontSize:18,fontWeight:700,color:'#0D1B2A',margin:'24px 0 10px'}}>{renderInlineMarkdown(line.slice(4))}</h3>;\n        if (line.startsWith('## ')) return <h2 key={i} style={{fontSize:20,fontWeight:700,color:'#0D1B2A',margin:'28px 0 12px',borderBottom:'2px solid #F5EFE8',paddingBottom:8}}>{renderInlineMarkdown(line.slice(3))}</h2>;\n        if (line.startsWith('# ')) return <h2 key={i} style={{fontSize:22,fontWeight:800,color:'#0D1B2A',margin:'28px 0 12px'}}>{renderInlineMarkdown(line.slice(2))}</h2>;\n        if (line.startsWith('- ')) return <li key={i} style={{color:'#4A4040',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:6}}>{renderInlineMarkdown(line.slice(2))}</li>;\n        if (/^\\d+[.)]\\s/.test(line)) return <li key={i} style={{color:'#4A4040',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:6}}>{renderInlineMarkdown(line.replace(/^\\d+[.)]\\s/, ''))}</li>;\n        if (line.startsWith('|')) return <p key={i} style={{color:'#4A4040',fontSize:13,fontFamily:'monospace',background:'#F5EFE8',padding:'4px 8px',borderRadius:4,margin:'4px 0',overflowX:'auto'}}>{line}</p>;\n        return <p key={i} style={{color:'#4A4040',fontSize:15,lineHeight:1.9,margin:'10px 0'}}>{renderInlineMarkdown(line)}</p>;\n      })}\n    </div>\n  );\n}\n\n`;
  if (!source.includes(articlePageMarker)) throw new Error('ArticlePage marker not found');
  source = source.replace(articlePageMarker, renderer + articlePageMarker);
}

// Replace the old line-by-line renderer with the hardened renderer above.
const oldStart = "  const paragraphs = article.content.trim().split('\\n').filter(l => l.trim());\n";
if (source.includes(oldStart)) {
  source = source.replace(oldStart, '');
}

const oldRenderer = `        <div style={{background:'#fff',borderRadius:16,padding:28,border:'1.5px solid #E8E0D4',lineHeight:1.9}}>\n          {paragraphs.map((line, i) => {\n            if (line.startsWith('## ')) return <h2 key={i} style={{fontSize:20,fontWeight:700,color:'#0D1B2A',margin:'28px 0 12px',borderBottom:'2px solid #F5EFE8',paddingBottom:8}}>{line.replace('## ','')}</h2>;\n            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{fontWeight:700,color:'#0D1B2A',fontSize:15,margin:'16px 0 4px'}}>{line.replace(/\\*\\*/g,'')}</p>;\n            if (line.startsWith('- ')) return <li key={i} style={{color:'#4A4040',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:6}}>{line.replace('- ','')}</li>;\n            if (line.match(/^\\d\\./)) return <li key={i} style={{color:'#4A4040',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:6}}>{line.replace(/^\\d\\./,'')}</li>;\n            if (line.startsWith('|')) return <p key={i} style={{color:'#4A4040',fontSize:13,fontFamily:'monospace',background:'#F5EFE8',padding:'4px 8px',borderRadius:4,margin:'4px 0'}}>{line}</p>;\n            return <p key={i} style={{color:'#4A4040',fontSize:15,lineHeight:1.9,margin:'10px 0'}}>{line}</p>;\n          })}\n        </div>`;
if (source.includes(oldRenderer)) {
  source = source.replace(oldRenderer, '        <Snay3iArticleContent content={article.content} />');
} else if (!source.includes('<Snay3iArticleContent content={article.content} />')) {
  console.warn('[Blog build repair] old article renderer was not found; no renderer replacement made');
}

// Prevent broken remote/local image assets from showing the browser's native
// broken-image placeholder. A failed hero image simply disappears cleanly.
const oldImage = `<img src={getArticleImage(article)} alt={article.title} style={{width:'100%',height:'auto',maxHeight:384,objectFit:'cover',display:'block'}} />`;
const newImage = `<img src={getArticleImage(article)} alt={article.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{width:'100%',height:'auto',maxHeight:384,objectFit:'cover',display:'block'}} />`;
if (source.includes(oldImage)) {
  source = source.replace(oldImage, newImage);
}

fs.writeFileSync(file, source, 'utf8');
console.log('[Blog build repair] article renderer and image fallback applied');
