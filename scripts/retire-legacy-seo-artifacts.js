const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const legacyStatic = path.join(root, 'public', 'seo');
const forbidden = [
  path.join(root, 'api', 'seo.js'),
  path.join(root, 'api', 'seo', '[...route].js'),
  path.join(root, 'api', 'seo-pages.json'),
  path.join(root, 'scripts', 'build-seo-api.js'),
];

const failures = forbidden
  .filter((file) => fs.existsSync(file))
  .map((file) => `retired legacy SEO artifact reappeared: ${path.relative(root, file)}`);

if (failures.length) {
  throw new Error(`[legacy seo retirement] BLOCKED:\n${failures.join('\n')}`);
}

let removed = false;
if (fs.existsSync(legacyStatic)) {
  fs.rmSync(legacyStatic, { recursive: true, force: true });
  removed = true;
}

if (fs.existsSync(legacyStatic)) {
  throw new Error('[legacy seo retirement] BLOCKED: public/seo still exists after cleanup');
}

console.log(`[legacy seo retirement] PASS: retired API artifacts absent; public/seo ${removed ? 'removed from build workspace' : 'already absent'}`);
