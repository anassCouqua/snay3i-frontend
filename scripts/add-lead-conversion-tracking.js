const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'App.js');
let source = fs.readFileSync(file, 'utf8');

const tracker = `\nfunction trackLeadEvent(method, label) {\n  if (window.gtag) {\n    window.gtag('event', 'lead_conversion', {\n      event_category: 'lead',\n      event_label: label,\n      lead_method: method,\n    });\n  }\n}\n`;

if (!source.includes('function trackLeadEvent')) {
  source = source.replace(/}\n\n\nconst API_BASE/, `}${tracker}\n\nconst API_BASE`);
}

source = source.replace(
  "<a onClick={()=>trackEvent('call_click','card_'+worker.service)} className=\"contact-btn phone\" href={`tel:${worker.phone}`}>",
  "<a onClick={() => { trackEvent('call_click','card_'+worker.service); trackLeadEvent('call','card_'+worker.service); }} className=\"contact-btn phone\" href={`tel:${worker.phone}`} >"
);

source = source.replace(
  "<a onClick={()=>trackEvent('whatsapp_click','card_'+worker.service)} className=\"contact-btn whatsapp\" href={`https://wa.me/${(worker.whatsapp||\"\").replace(/\\D/g,\"\")}`} target=\"_blank\" rel=\"noreferrer\">",
  "<a onClick={() => { trackEvent('whatsapp_click','card_'+worker.service); trackLeadEvent('whatsapp','card_'+worker.service); }} className=\"contact-btn whatsapp\" href={`https://wa.me/${(worker.whatsapp||\"\").replace(/\\D/g,\"\")}`} target=\"_blank\" rel=\"noreferrer\">"
);

fs.writeFileSync(file, source);
console.log('Lead conversion tracking applied safely.');
