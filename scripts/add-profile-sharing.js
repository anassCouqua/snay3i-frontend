const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'App.js');
if (!fs.existsSync(file)) throw new Error('src/App.js is missing');

let source = fs.readFileSync(file, 'utf8');

if (source.includes('profile_share')) {
  console.log('Profile sharing already present.');
  process.exit(0);
}

const marker = '            </a>\n          </div>\n          {worker.photos && worker.photos.length > 0 && (';

const addition = `            <button\n              type="button"\n              className="contact-btn share"\n              onClick={async () => {\n                const slug = value => String(value || '')\n                  .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')\n                  .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');\n                const shareUrl = \\`${'${window.location.origin}'}/artisan/\\${slug(worker.service)}/\\${slug(worker.city)}\\`;\n                trackEvent('profile_share', worker.service + '_' + worker.city);\n                try {\n                  if (navigator.share) {\n                    await navigator.share({ title: worker.name + ' • Snay3i.ma', url: shareUrl });\n                  } else if (navigator.clipboard) {\n                    await navigator.clipboard.writeText(shareUrl);\n                    window.alert('Lien copié.');\n                  }\n                } catch (_) {}\n              }}\n            >\n              <span>↗</span><span>Partager • مشاركة</span>\n            </button>\n`;

if (!source.includes(marker)) {
  throw new Error('Profile contact insertion point not found');
}

source = source.replace(marker, '            </a>\n' + addition + '          </div>\n          {worker.photos && worker.photos.length > 0 && (');
fs.writeFileSync(file, source);
console.log('Profile sharing added.');
