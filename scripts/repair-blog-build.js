const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'src', 'Blog.js');

const SAFE_IMAGE_HELPER = `\n\nfunction SafeArticleImage({ src, alt, emoji = '🔧' }) {\n  const [failed, setFailed] = React.useState(false);\n\n  if (failed || !src) {\n    return (\n      <div\n        role="img"\n        aria-label={alt}\n        data-snay3i-safe-article-image="fallback"\n        style={{\n          width: '100%',\n          minHeight: 280,\n          borderRadius: 16,\n          display: 'flex',\n          flexDirection: 'column',\n          alignItems: 'center',\n          justifyContent: 'center',\n          gap: 12,\n          padding: 32,\n          boxSizing: 'border-box',\n          background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)',\n          color: '#fff',\n          textAlign: 'center'\n        }}\n      >\n        <div style={{ fontSize: 56 }}>{emoji}</div>\n        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.82 }}>Snay3i.ma</div>\n      </div>\n    );\n  }\n\n  return (\n    <img\n      src={src}\n      alt={alt}\n      data-snay3i-safe-article-image="photo"\n      loading="lazy"\n      decoding="async"\n      style={{\n        display: 'block',\n        width: '100%',\n        minHeight: 280,\n        objectFit: 'cover',\n        borderRadius: 16,\n        background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)'\n      }}\n      onError={() => setFailed(true)}\n    />\n  );\n}\n`;

const HERO_MARKER = '        {/* Article Hero Banner */}';
const DESCRIPTION_MARKER = '        {/* Description */}';

function buildBlog() {
  if (!fs.existsSync(blogPath)) {
    console.warn('[Blog build repair] src/Blog.js not found; skipped');
    return;
  }

  let source = fs.readFileSync(blogPath, 'utf8');

  if (!source.includes('function SafeArticleImage(')) {
    const helperAnchor = "function setCanonical(url) {";
    if (!source.includes(helperAnchor)) {
      throw new Error('[Blog build repair] Could not find stable insertion point in Blog.js');
    }
    source = source.replace(helperAnchor, `${SAFE_IMAGE_HELPER}\n${helperAnchor}`);
  }

  if (source.includes('data-snay3i-safe-article-image="photo"')) {
    console.log('[Blog build repair] fail-safe photography already installed');
    fs.writeFileSync(blogPath, source);
    return;
  }

  const heroStart = source.indexOf(HERO_MARKER);
  const descriptionStart = source.indexOf(DESCRIPTION_MARKER, heroStart);

  if (heroStart === -1 || descriptionStart === -1) {
    throw new Error('[Blog build repair] Could not locate article hero block in Blog.js');
  }

  const heroBlock = `        {/* Article Hero Banner */}\n        <div style={{margin:'0 0 24px', borderRadius:16, overflow:'hidden'}}>\n          <SafeArticleImage\n            src={getArticleImage(article)}\n            alt={article.title}\n            emoji={article.emoji || '🔧'}\n          />\n        </div>\n\n`;

  source = source.slice(0, heroStart) + heroBlock + source.slice(descriptionStart);
  fs.writeFileSync(blogPath, source);
  console.log('[Blog build repair] installed fail-safe article photography');
}

buildBlog();
