const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/App.js');

if (fs.existsSync(targetPath)) {
  let code = fs.readFileSync(targetPath, 'utf8');

  const addition = `            <button
              type="button"
              className="contact-btn share"
              onClick={async () => {
                const slug = value => String(value || '')
                  .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
                  .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const shareUrl = \`\${window.location.origin}/artisan/\${slug(worker.service)}/\${slug(worker.city)}\`;
                trackEvent('profile_share', worker.service + '_' + worker.city);
                try {
                  if (navigator.share) {
                    await navigator.share({ title: worker.name + ' • Snay3i.ma', url: shareUrl });
                  } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareUrl);
                    window.alert('Lien copié.');
                  }
                } catch (_) {}
              }}
            >
              <span>↗</span><span>Partager • مشاركة</span>
            </button>
`;

  if (!code.includes('profile_share')) {
    code = code.replace(
      /(\s*<a\s+href=\{`tel:\${worker\.phone\}`\})/g,
      `${addition}$1`
    );
    fs.writeFileSync(targetPath, code, 'utf8');
    console.log('Successfully injected profile sharing button.');
  }
}
