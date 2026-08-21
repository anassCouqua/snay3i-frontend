const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'App.js');
if (!fs.existsSync(file)) throw new Error('src/App.js is missing');

let source = fs.readFileSync(file, 'utf8');

const anchor = 'function RegisterPage({ onBack, lang }) {\n  const [step, setStep] = useState(1);';
const replacement = `function RegisterPage({ onBack, lang }) {\n  const [step, setStep] = useState(1);\n  const [acquisitionSource, setAcquisitionSource] = useState('direct');\n\n  useEffect(() => {\n    try {\n      const params = new URLSearchParams(window.location.search);\n      const source = params.get('utm_source') || params.get('source') || 'direct';\n      const medium = params.get('utm_medium') || '';\n      const campaign = params.get('utm_campaign') || '';\n      const attribution = [source, medium, campaign].filter(Boolean).join(' / ');\n      setAcquisitionSource(attribution || 'direct');\n      sessionStorage.setItem('snay3i_acquisition_source', attribution || 'direct');\n    } catch {}\n  }, []);`;

if (!source.includes("sessionStorage.setItem('snay3i_acquisition_source'")) {
  if (!source.includes(anchor)) throw new Error('RegisterPage anchor not found');
  source = source.replace(anchor, replacement);
}

const payloadAnchor = 'const payload = {\n        ...form,';
const payloadReplacement = 'const payload = {\n        ...form,\n        acquisition_source: (() => {\n          try { return sessionStorage.getItem("snay3i_acquisition_source") || acquisitionSource || "direct"; }\n          catch { return acquisitionSource || "direct"; }\n        })(),';

if (!source.includes('acquisition_source: (() =>')) {
  if (!source.includes(payloadAnchor)) throw new Error('Registration payload anchor not found');
  source = source.replace(payloadAnchor, payloadReplacement);
}

const ctaAnchor = '<p className="reg-step-sub">\n              {lang === "fr" ? "Votre identité et votre métier" : "هويتك ومهنتك"}\n            </p>';
const ctaReplacement = `${ctaAnchor}\n            <div style={{fontSize:11,color:'#8A8178',marginBottom:12}}>Source: {acquisitionSource === 'direct' ? 'direct' : acquisitionSource}</div>`;
if (!source.includes('Source: {acquisitionSource')) {
  if (source.includes(ctaAnchor)) source = source.replace(ctaAnchor, ctaReplacement);
}

fs.writeFileSync(file, source);
console.log('Acquisition attribution added to artisan registration.');
