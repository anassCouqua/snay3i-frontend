const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'App.js');
if (!fs.existsSync(file)) throw new Error('App.js is missing');

let source = fs.readFileSync(file, 'utf8');
if (source.includes('export function RegisterPage(')) {
  console.log('RegisterPage already exported.');
  process.exit(0);
}

const from = 'function RegisterPage({ onBack, lang }) {';
const to = 'export function RegisterPage({ onBack, lang }) {';
if (!source.includes(from)) throw new Error('RegisterPage declaration not found');
source = source.replace(from, to);
fs.writeFileSync(file, source, 'utf8');
console.log('RegisterPage exported for direct onboarding route.');
