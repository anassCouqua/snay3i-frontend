import React, { useEffect } from 'react';
import { SAFE_ARTICLES } from './adsense-safe-articles';


function getArticleImage(article) {
  if (article && article.image && typeof article.image === 'string' && article.image.startsWith('http')) {
    return article.image;
  }
  const slug = article?.slug || "";
  const directMap = {
    'trouver-bon-plombier-maroc': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
    'tarif-electricien-maroc': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80',
    'renover-maison-maroc': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    'peintre-batiment-maroc': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    'serrurier-urgence-maroc': 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    'clim-entretien-maroc': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80'
  };
  if (directMap[slug]) return directMap[slug];
  return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
}








function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

const AUTHOR = 'Rédaction Snay3i.ma';
const AUTHOR_TITLE = 'Équipe éditoriale';

const ARTICLES = SAFE_ARTICLES;
function normalizeArticleContent(content) {
  return String(content || '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) => {
      const clean = text.replace(/<[^>]+>/g, '').trim();
      return '#'.repeat(Number(level)) + ' ' + clean + '\n';
    })
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<br\s*\/?>(?=\s*)/gi, '\n')
    .replace(/<\/?(?:p|div|section|article)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderInlineMarkdown(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function Snay3iArticleContent({ content }) {
  const paragraphs = normalizeArticleContent(content).split('\n').map(line => line.trim()).filter(Boolean);
  return (
    <div style={{background:'#fff',borderRadius:16,padding:28,border:'1.5px solid #E8E0D4',lineHeight:1.9}}>
      {paragraphs.map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} style={{fontSize:18,fontWeight:700,color:'#0D1B2A',margin:'24px 0 10px'}}>{renderInlineMarkdown(line.slice(4))}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} style={{fontSize:20,fontWeight:700,color:'#0D1B2A',margin:'28px 0 12px',borderBottom:'2px solid #F5EFE8',paddingBottom:8}}>{renderInlineMarkdown(line.slice(3))}</h2>;
        if (line.startsWith('# ')) return <h2 key={i} style={{fontSize:22,fontWeight:800,color:'#0D1B2A',margin:'28px 0 12px'}}>{renderInlineMarkdown(line.slice(2))}</h2>;
        if (line.startsWith('- ')) return <li key={i} style={{color:'#4A4040',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:6}}>{renderInlineMarkdown(line.slice(2))}</li>;
        if (/^\d+[.)]\s/.test(line)) return <li key={i} style={{color:'#4A4040',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:6}}>{renderInlineMarkdown(line.replace(/^\d+[.)]\s/, ''))}</li>;
        if (line.startsWith('|')) return <p key={i} style={{color:'#4A4040',fontSize:13,fontFamily:'monospace',background:'#F5EFE8',padding:'4px 8px',borderRadius:4,margin:'4px 0',overflowX:'auto'}}>{line}</p>;
        return <p key={i} style={{color:'#4A4040',fontSize:15,lineHeight:1.9,margin:'10px 0'}}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

function ArticlePage({ slug }) {
  const article = ARTICLES.find(a => a.slug === slug);

  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | Blog Snay3i.ma`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', article.description);
    setCanonical(`https://snay3i.ma/blog/${article.slug}`);

    // Article Schema for Google
    let script = document.getElementById('ld-article');
    if (!script) { script = document.createElement('script'); script.id = 'ld-article'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "datePublished": "2026-06-" + article.date.split(' ')[0].padStart(2,'0'),
      "dateModified": "2026-06-16",
      "author": { "@type": "Person", "name": AUTHOR, "jobTitle": AUTHOR_TITLE, "url": "https://snay3i.ma/about" },
      "publisher": { "@type": "Organization", "name": "Snay3i.ma", "url": "https://snay3i.ma", "logo": { "@type": "ImageObject", "url": "https://snay3i.ma/logo.png" } },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://snay3i.ma/blog/${article.slug}` }
    });
  }, [article]);

  if (!article) return (
    <div style={{textAlign:'center',padding:60,fontFamily:'system-ui,sans-serif'}}>
      <h1>Article introuvable</h1>
      <a href="/blog" style={{color:'#C4622D',fontWeight:700}}>← Retour au blog</a>
    </div>
  );

  const relatedArticles = ARTICLES.filter(a => a.slug !== article.slug && (a.category === article.category || a.emoji === article.emoji)).slice(0,3);
  const otherArticles = ARTICLES.filter(a => a.slug !== article.slug).slice(0,3);
  const showRelated = relatedArticles.length > 0 ? relatedArticles : otherArticles;

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      {/* Header */}
      <div style={{background:'#0D1B2A',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <a href="/"><picture><source srcSet="/logo.webp" type="image/webp"/><img src="/logo.png" alt="Snay3i.ma" width="40" height="40" style={{height:40,objectFit:'contain'}}/></picture></a>
        <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap'}}>
          <a href="/blog" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>Blog</a>
          <a href="/about" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>À propos</a>
          <a href="/contact" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>Contact</a>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'8px 16px',borderRadius:20,fontSize:13,textDecoration:'none',fontWeight:700}}>Trouver un artisan →</a>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{background:'#F0EAE0',padding:'8px 24px',fontSize:12,color:'#7A7065'}}>
        <a href="/" style={{color:'#C4622D',textDecoration:'none'}}>Snay3i.ma</a>
        {' › '}
        <a href="/blog" style={{color:'#C4622D',textDecoration:'none'}}>Blog</a>
        {' › '}
        <span style={{color:'#0D1B2A'}}>{article.category}</span>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        {/* Meta */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>
          <span style={{background:'#F5EFE8',color:'#C4622D',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:600}}>{article.emoji} {article.category}</span>
          <span style={{color:'#7A7065',fontSize:12}}>{article.date}</span>
          <span style={{color:'#7A7065',fontSize:12}}>•</span>
          <span style={{color:'#7A7065',fontSize:12}}>{article.readTime} de lecture</span>
        </div>

        {/* Title */}
        <h1 style={{fontSize:28,fontWeight:800,color:'#0D1B2A',lineHeight:1.3,margin:'0 0 16px'}}>{article.title}</h1>
        
        
        {/* Article Hero Banner */}
        <div style={{margin:'0 0 24px', borderRadius:16, overflow:'hidden', border:'1.5px solid #E8E0D4', background:'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)', padding:'48px 24px', textAlign:'center', color:'#fff', boxShadow:'0 4px 20px rgba(13,27,42,0.15)'}}>
          <div style={{fontSize:56, marginBottom:12}}>{article.emoji || '🔧'}</div>
          <div style={{fontSize:13,fontWeight:700, background:'#C4622D', color:'#fff', padding:'6px 14px', borderRadius:20, display:'inline-block', marginBottom:16}}>{article.category}</div>
          <h1 style={{fontSize:26, fontWeight:800, color:'#fff', lineHeight:1.4, margin:0, maxWidth:680, marginLeft:'auto', marginRight:'auto'}}>{article.title}</h1>
        </div>

        {/* Description */}
        <p style={{color:'#5A5050',fontSize:16,lineHeight:1.7,margin:'0 0 24px',fontStyle:'italic',borderLeft:'3px solid #C4622D',paddingLeft:16}}>{article.description}</p>

        {/* Content */}
        <Snay3iArticleContent content={article.content} />

        {/* Author signature */}
        <div style={{background:'#F5EFE8',borderRadius:12,padding:16,marginTop:16,display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:'#C4622D',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,flexShrink:0}}>AC</div>
          <div>
            <div style={{fontWeight:700,color:'#0D1B2A',fontSize:13}}>Rédigé par {AUTHOR}</div>
            <div style={{color:'#7A7065',fontSize:12}}>Fondateur de Snay3i.ma — La référence des artisans marocains 🇲🇦</div>
          </div>
        </div>

        {/* Related articles */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:16,border:'1.5px solid #E8E0D4'}}>
          <h3 style={{fontSize:16,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>Articles recommandés</h3>
          {showRelated.map(a=>(
            <a key={a.slug} href={`/blog/${a.slug}`} style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',padding:'10px 0',borderBottom:'1px solid #F5EFE8'}}>
              <span style={{fontSize:22,flexShrink:0}}>{a.emoji}</span>
              <div>
                <div style={{color:'#0D1B2A',fontSize:13,fontWeight:600,marginBottom:2}}>{a.title}</div>
                <div style={{color:'#7A7065',fontSize:12}}>{a.readTime} de lecture</div>
              </div>
              <span style={{marginLeft:'auto',color:'#C4622D',fontSize:16,flexShrink:0}}>→</span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'#0D1B2A',borderRadius:16,padding:24,textAlign:'center',marginTop:16}}>
          <p style={{color:'#fff',fontWeight:700,fontSize:16,margin:'0 0 8px'}}>Trouvez votre artisan maintenant 🇲🇦</p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,margin:'0 0 16px'}}>+200 artisans vérifiés dans 21 villes du Maroc</p>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'12px 28px',borderRadius:24,textDecoration:'none',fontWeight:800,fontSize:14}}>Voir les artisans →</a>
        </div>

        <div style={{textAlign:'center',marginTop:20,paddingBottom:32}}>
          <a href="/blog" style={{color:'#C4622D',fontWeight:700,textDecoration:'none'}}>← Retour au blog Snay3i.ma</a>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:'#0D1B2A',padding:'24px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap',marginBottom:10}}>
          <a href="/" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Accueil</a>
          <a href="/blog" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Blog</a>
          <a href="/about" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>À propos</a>
          <a href="/contact" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Contact</a>
          <a href="/privacy" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Confidentialité</a>
          <a href="/terms" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>CGU</a>
        </div>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:11,margin:0}}>© 2026 Snay3i.ma — contact@snay3i.ma — 🇲🇦 Fait avec fierté au Maroc</p>
      </div>
    </div>
  );
}

export default function Blog({ articleSlug }) {
  useEffect(() => {
    if (!articleSlug) {
      document.title = 'Blog Snay3i.ma — Conseils artisans au Maroc | Guide 2026';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', 'Blog Snay3i.ma: guides et conseils pour trouver les meilleurs artisans au Maroc. Plombier, électricien, maçon, carreleur, menuisier — tarifs, conseils et astuces par Anass Couqua, fondateur de Snay3i.ma.');
      setCanonical('https://snay3i.ma/blog');
    }
  }, [articleSlug]);

  if (articleSlug) return <ArticlePage slug={articleSlug} />;

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      {/* Header */}
      <div style={{background:'#0D1B2A',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <a href="/"><picture><source srcSet="/logo.webp" type="image/webp"/><img src="/logo.png" alt="Snay3i.ma" width="40" height="40" style={{height:40,objectFit:'contain'}}/></picture></a>
        <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap'}}>
          <a href="/blog" style={{color:'#D4A843',fontSize:13,textDecoration:'none',fontWeight:700}}>Blog</a>
          <a href="/about" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>À propos</a>
          <a href="/contact" style={{color:'rgba(255,255,255,0.7)',fontSize:13,textDecoration:'none',fontWeight:600}}>Contact</a>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'8px 16px',borderRadius:20,fontSize:13,textDecoration:'none',fontWeight:700}}>Trouver un artisan →</a>
        </div>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        {/* Hero */}
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:30,fontWeight:800,color:'#0D1B2A',margin:'0 0 8px'}}>📝 Blog Snay3i.ma</h1>
          <p style={{color:'#7A7065',fontSize:15,margin:'0 0 4px'}}>Guides pratiques pour préparer des travaux et comparer des prestations au Maroc 🇲🇦</p>
          <p style={{color:'#7A7065',fontSize:13,margin:0}}>Par <strong style={{color:'#C4622D'}}>{AUTHOR}</strong></p>
        </div>

        {/* Articles grid */}
        {ARTICLES.map(article => (
          <a key={article.slug} href={`/blog/${article.slug}`} style={{textDecoration:'none',display:'block',marginBottom:14}}>
            <div style={{background:'#fff',borderRadius:16,padding:20,border:'1.5px solid #E8E0D4',display:'flex',gap:16,alignItems:'flex-start'}}>
              <div style={{fontSize:38,flexShrink:0,marginTop:2}}>{article.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{background:'#F5EFE8',color:'#C4622D',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{article.category}</span>
                  <span style={{color:'#7A7065',fontSize:11}}>{article.date}</span>
                  <span style={{color:'#7A7065',fontSize:11}}>•</span>
                  <span style={{color:'#7A7065',fontSize:11}}>{article.readTime}</span>
                </div>
                <h2 style={{fontSize:15,fontWeight:700,color:'#0D1B2A',margin:'0 0 6px',lineHeight:1.4}}>{article.title}</h2>
                <p style={{fontSize:13,color:'#7A7065',margin:0,lineHeight:1.5}}>{article.description}</p>
              </div>
              <div style={{color:'#C4622D',fontSize:20,flexShrink:0,alignSelf:'center'}}>→</div>
            </div>
          </a>
        ))}

        {/* Author bio */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:8,border:'1.5px solid #E8E0D4'}}>
          <h3 style={{fontSize:15,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>À propos de l'auteur</h3>
          <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
            <div style={{width:50,height:50,borderRadius:'50%',background:'#C4622D',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,flexShrink:0}}>AC</div>
            <div>
              <div style={{fontWeight:700,color:'#0D1B2A',fontSize:14,marginBottom:4}}>{AUTHOR}</div>
              <p style={{color:'#7A7065',fontSize:13,lineHeight:1.6,margin:0}}>
                Fondateur de Snay3i.ma, la plateforme marocaine de référence pour trouver des artisans qualifiés. 
                Passionné par le développement technologique au Maroc et l'amélioration des services aux particuliers.
                Basé entre Londres et le Maroc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:'#0D1B2A',padding:'24px',textAlign:'center',marginTop:32}}>
        <div style={{display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap',marginBottom:10}}>
          <a href="/" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Accueil</a>
          <a href="/blog" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Blog</a>
          <a href="/about" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>À propos</a>
          <a href="/contact" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Contact</a>
          <a href="/privacy" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>Confidentialité</a>
          <a href="/terms" style={{color:'rgba(255,255,255,0.6)',fontSize:12,textDecoration:'none'}}>CGU</a>
        </div>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:11,margin:0}}>© 2026 Snay3i.ma — contact@snay3i.ma — 🇲🇦 Fait avec fierté au Maroc</p>
      </div>
    </div>
  );
}
