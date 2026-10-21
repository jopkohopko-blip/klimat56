// Собирает js/icons.js только из тех иконок Lucide, что используются на сайте
const fs = require('fs');
const path = require('path');
const { icons } = require('lucide');

const site = process.argv[2];
const files = [
  ...fs.readdirSync(site).filter(f => f.endsWith('.html')).map(f => path.join(site, f)),
  ...fs.readdirSync(path.join(site, 'js')).filter(f => f.endsWith('.js') && f !== 'icons.js').map(f => path.join(site, 'js', f)),
];
const names = new Set();
for (const f of files) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/data-lucide="([a-z0-9-]+)"/g)) names.add(m[1]);
}
const pascal = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
const out = {};
const missing = [];
for (const n of [...names].sort()) {
  const icon = icons[pascal(n)];
  if (!icon) { missing.push(n); continue; }
  out[n] = icon[2];
}
const js = `/* Иконки Lucide (https://lucide.dev, лицензия ISC) — только те, что используются на сайте.
   Файл собирается автоматически, руками не править. */
const ICONS = ${JSON.stringify(out)};

function renderIcons(root = document) {
  const NS = 'http://www.w3.org/2000/svg';
  root.querySelectorAll('i[data-lucide]').forEach(el => {
    const children = ICONS[el.dataset.lucide];
    if (!children) return;
    const svg = document.createElementNS(NS, 'svg');
    const attrs = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'lucide lucide-' + el.dataset.lucide };
    for (const k in attrs) svg.setAttribute(k, attrs[k]);
    for (const [tag, a] of children) {
      const node = document.createElementNS(NS, tag);
      for (const k in a) node.setAttribute(k, a[k]);
      svg.appendChild(node);
    }
    el.replaceWith(svg);
  });
}
`;
fs.writeFileSync(path.join(site, 'js', 'icons.js'), js);
console.log('icons:', Object.keys(out).length, 'missing:', missing.join(',') || 'none', 'bytes:', js.length);
