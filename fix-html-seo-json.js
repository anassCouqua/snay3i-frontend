const fs = require('fs');
const path = require('path');

const seoJsonPath = path.join(process.cwd(), 'api', 'seo-pages.json');

console.log('🛠️ Scanning and patching HTML strings in api/seo-pages.json...\n');

if (fs.existsSync(seoJsonPath)) {
  const data = JSON.parse(fs.readFileSync(seoJsonPath, 'utf8'));
  let fixedCount = 0;

  for (const [route, html] of Object.entries(data)) {
    // Target only artisan pages (e.g., /artisan/plombier/casablanca)
    if (route.startsWith('/artisan/')) {
      const parts = route.split('/');
      if (parts.length >= 4) {
        const trade = parts[2];
        const city = parts[3];
        const formattedTrade = trade.charAt(0).toUpperCase() + trade.slice(1);
        const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

        let updatedHtml = html;
        let modified = false;

        // 1. Optimize image alt text with localized keywords
        const targetAlt = `Artisan ${formattedTrade} professionnel qualifié à ${formattedCity}`;
        // Replace existing alt attributes or add them if missing/generic
        const altRegex = /alt="([^"]*)"/g;
        if (!updatedHtml.includes(targetAlt)) {
          updatedHtml = updatedHtml.replace(altRegex, `alt="${targetAlt}"`);
          modified = true;
        }

        // 2. Ensure title tag matches local SEO standard
        const expectedTitleTag = `<title>${formattedTrade} à ${formattedCity} | Devis Gratuit - Snay3i</title>`;
        const titleRegex = /<title>.*?<\/title>/;
        if (titleRegex.test(updatedHtml) && !updatedHtml.includes(`${formattedTrade} à ${formattedCity}`)) {
          updatedHtml = updatedHtml.replace(titleRegex, `<title>${formattedTrade} à ${formattedCity} | Devis Gratuit - Snay3i</title>`);
          modified = true;
        }

        if (modified) {
          data[route] = updatedHtml;
          fixedCount++;
          console.log(`✅ Patched SEO & Alt attributes for: ${route}`);
        }
      }
    }
  }

  fs.writeFileSync(seoJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n✨ Successfully patched ${fixedCount} artisan pages in api/seo-pages.json!`);
} else {
  console.log('⚠️ api/seo-pages.json not found.');
}
