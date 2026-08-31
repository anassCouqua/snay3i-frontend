const fs = require('fs');
const path = require('path');
const { content, meta } = require('../content/darija-guide-expansion');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
if (!fs.existsSync(blogRoot)) fs.mkdirSync(blogRoot, { recursive: true });

const D = (id) => `https://unsplash.com/photos/${id}/download?force=true`;
const IMAGE_SETS = {
  'jardin-anglais-maroc-darija': {
    hero: D('CUGep7Df0hM'), detail: D('rHOLDLX4lHc'), topic: D('IaBPwYmdYKY'),
    heroAlt: 'جردة إنجليزية فيها ورود ونباتات وممر طبيعي',
    detailAlt: 'تفاصيل نباتات وممر داخل جردة بأسلوب cottage garden',
    topicAlt: 'ممر متعرج وسط جردة كثيفة بالورود'
  },
  'cuisine-moderne-zero-maroc-darija': {
    hero: D('Jl5BfxX089Q'), detail: D('zJ_3ZDkPTJk'), topic: D('eTmXAuuCsL8'),
    heroAlt: 'كوزينة مودرن بخزائن خشبية وجزيرة وسطية',
    detailAlt: 'تفاصيل plan de travail والحوض فالجزيرة ديال كوزينة مودرن',
    topicAlt: 'كوزينة مودرن بخزائن داكنة وplan de travail واضح'
  },
  'escalier-suspendu-maison-maroc-darija': {
    hero: D('RAu0dfaNkEM'), detail: D('9WvgW6G-ZVA'), topic: D('GxQInQPa10c'),
    heroAlt: 'درج مودرن بهيكل خفيف وإضاءة مدمجة',
    detailAlt: 'تفاصيل درج مودرن مع structure معدنية وحاجز',
    topicAlt: 'درج مودرن بدرجات معدنية وحاجز خفيف'
  },
  'open-space-maison-maroc-darija': {
    hero: D('kQ7mY-ZHgmg'), detail: D('c1sP_yx6NEw'), topic: D('iZHohvoRoZA'),
    heroAlt: 'صالون وكوزينة ففضاء Open Space مودرن',
    detailAlt: 'Open Space فيه كوزينة وجلسة وتقسيم بصري واضح',
    topicAlt: 'فضاء مفتوح كيجمع الصالون والسفرة والكوزينة'
  },
  'villa-riad-piscine-jardin-maroc-darija': {
    hero: D('TFhl8b-rRPg'), detail: D('yzm55q5pA_A'), topic: D('m4F-2C_4Nbw'),
    heroAlt: 'رياض مغربي بفناء ومسبح وهندسة تقليدية',
    detailAlt: 'فناء رياض مغربي مضاء بالفوانيس والنباتات',
    topicAlt: 'فناء رياض مغربي بمسبح وباب خشبي تقليدي'
  },
  'hammam-beldi-maison-maroc-darija': {
    hero: D('9qYFu1NzpS8'), detail: D('Re1O5byZ8bY'), topic: D('uBErExl4564'),
    heroAlt: 'فضاء بخار مودرن بسطوح حجرية وإضاءة هادئة',
    detailAlt: 'حرفي كيطبق plaster على الحائط خلال أعمال التشطيب',
    topicAlt: 'زليج مغربي هندسي مناسب لتشطيب الحمام البلدي'
  }
};

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function inlineMd(value) {
  return value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
}
function markdownToHtml(markdown) {
  const lines = String(markdown).replace(/\r/g, '').split('\n');
  const out = []; let p = []; let list = null;
  const flush = () => { if (!p.length) return; out.push(`<p>${inlineMd(esc(p.join(' ').trim()))}</p>`); p = []; };
  const close = () => { if (!list) return; out.push(`</${list}>`); list = null; };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); close(); continue; }
    const h3 = line.match(/^###\s+(.+)$/); if (h3) { flush(); close(); out.push(`<h3>${inlineMd(esc(h3[1]))}</h3>`); continue; }
    const h2 = line.match(/^##\s+(.+)$/); if (h2) { flush(); close(); out.push(`<h2>${inlineMd(esc(h2[1]))}</h2>`); continue; }
    const ul = line.match(/^[-*]\s+(.+)$/); if (ul) { flush(); if (list !== 'ul') { close(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inlineMd(esc(ul[1]))}</li>`); continue; }
    const ol = line.match(/^\d+[.)]\s+(.+)$/); if (ol) { flush(); if (list !== 'ol') { close(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inlineMd(esc(ol[1]))}</li>`); continue; }
    close(); p.push(line);
  }
  flush(); close(); return out.join('\n');
}
function splitBody(body) {
  const headings = [...body.matchAll(/<h2\b/gi)];
  if (headings.length < 2) return [body, ''];
  const chosen = headings[Math.max(1, Math.floor(headings.length / 2))];
  return [body.slice(0, chosen.index), body.slice(chosen.index)];
}
function photoFigure(slug, kind) {
  const set = IMAGE_SETS[slug]; if (!set) throw new Error(`[darija blog] missing image set: ${slug}`);
  const hero = kind === 'hero'; const src = hero ? set.hero : set.detail; const alt = hero ? set.heroAlt : set.detailAlt;
  const caption = hero ? alt : `من داخل الدليل: ${alt}`;
  return `<figure data-snay3i-${hero ? 'article-cover' : 'support-photo'}="1" style="margin:${hero ? '0 0 24px' : '30px 0'};border-radius:20px;overflow:hidden;background:#0D1B2A;border:1px solid #E8E0D4"><img src="${src}" alt="${esc(alt)}" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} width="1600" height="900" style="display:block;width:100%;height:${hero ? '300px' : 'auto'};max-height:${hero ? '300' : '420'}px;object-fit:cover"><figcaption style="padding:10px 14px;font-size:13px;color:#6f6a64;background:#fff;text-align:right">${esc(caption)}</figcaption></figure>`;
}
function topicPhotoFigure(slug) {
  const set = IMAGE_SETS[slug];
  if (!set || !set.topic || !set.topicAlt) throw new Error(`[darija blog] missing third topic photo: ${slug}`);
  return `<figure data-snay3i-inline-photo="1" style="margin:30px 0;border-radius:20px;overflow:hidden;background:#0D1B2A;border:1px solid #E8E0D4"><img src="${set.topic}" alt="${esc(set.topicAlt)}" loading="lazy" width="1600" height="900" style="display:block;width:100%;height:auto;max-height:420px;object-fit:cover"><figcaption style="padding:10px 14px;font-size:13px;color:#6f6a64;background:#fff;text-align:right">صورة مرتبطة بموضوع الدليل: ${esc(set.topicAlt)}</figcaption></figure>`;
}
function htmlFor(slug, article) {
  const body = markdownToHtml(content[slug]); const [bodyA, bodyB] = splitBody(body); const imageSet = IMAGE_SETS[slug];
  const hero = photoFigure(slug, 'hero'); const detail = photoFigure(slug, 'detail'); const topicPhoto = topicPhotoFigure(slug);
  return `<!doctype html><html lang="ary" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(article.title)}</title><meta name="description" content="${esc(article.description)}"><meta name="robots" content="index,follow"><meta name="google-adsense-account" content="ca-pub-7772621804003550"><link rel="canonical" href="https://snay3i.ma/blog/${slug}"><meta property="og:title" content="${esc(article.title)}"><meta property="og:description" content="${esc(article.description)}"><meta property="og:image" content="${imageSet.hero}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${imageSet.hero}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script><style>body{margin:0;font-family:Tahoma,Arial,system-ui,sans-serif;background:#faf6ef;color:#17212b;line-height:1.9;direction:rtl;text-align:right}header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}nav{max-width:920px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}nav a,footer a{color:#fff;text-decoration:none}main{max-width:900px;margin:auto;padding:36px 16px}section{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:26px;margin:0 0 16px}h1{font-size:34px;line-height:1.45;margin:0 0 12px}h2{font-size:23px;color:#0d1b2a;margin-top:32px}h3{font-size:19px;color:#0d1b2a;margin-top:24px}.meta{color:#6f6a64;font-size:14px}.article p,.article li{font-size:17px}.article li{margin:6px 0}figure{margin-left:0;margin-right:0}figcaption{line-height:1.6}@media(max-width:640px){main{padding:24px 14px}h1{font-size:28px}.article p,.article li{font-size:16px}section{padding:20px}nav{gap:10px;font-size:14px}}</style></head><body><header><nav><a href="/">الرئيسية</a><a href="/blog">المدونة</a><a href="/about">من نحن</a><a href="/contact">تواصل معنا</a><a href="/privacy">الخصوصية</a><a href="/terms">الشروط</a></nav></header><main>${hero}<article class="article"><section><p class="meta">دليل Snay3i.ma · بالدارجة المغربية</p><h1>${esc(article.title)}</h1><p>${esc(article.description)}</p></section><section>${bodyA}${detail}${bodyB}</section>${topicPhoto}</article><section><h2>حول هاد الدليل</h2><p>هاد المحتوى كيساعدك تفهم المشروع، تحضر الأسئلة وتقارن الخدمات قبل الأشغال. التفاصيل التقنية كتختلف حسب الدار، المواد، التجهيزات والمهنيين المسؤولين على كل جزء.</p><p><a href="/blog">شوف باقي الأدلة</a> · <a href="/contact">تواصل معنا</a></p></section></main><footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">الخصوصية</a> · <a href="/terms">الشروط</a> · <a href="/contact">تواصل معنا</a></div></footer></body></html>`;
}

for (const [slug, article] of Object.entries(meta)) {
  if (!content[slug]) throw new Error(`[darija blog] content missing: ${slug}`);
  if (!IMAGE_SETS[slug]) throw new Error(`[darija blog] photography missing: ${slug}`);
  const dir = path.join(blogRoot, slug); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), htmlFor(slug, article), 'utf8');
}
console.log(`[darija blog] rebuilt ${Object.keys(meta).length} RTL Darija guides with three distinct topic-matched photographs`);
