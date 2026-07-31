/* Genera "tailandia-una-sola-pagina.html" juntando todo en un único archivo.
   Se ejecuta con:  node construir-pagina-unica.mjs                          */
import fs from 'fs';
const read = f => fs.readFileSync(f, 'utf8');
const plain = src => src
  .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
  .replace(/^import\s+['"][^'"]+['"];?\s*$/gm, '')
  .replace(/^export\s+(default\s+)?/gm, '');

const viewsSrc = read('js/views.js');
const exported = [...viewsSrc.matchAll(/^export\s+(?:async\s+)?(?:function|const|let)\s+(\w+)/gm)].map(m => m[1]);
const shim = `\n/* puente para las vistas */\nconst V = { ${exported.join(', ')} };\n`;

let js = ['js/core.js', 'js/data.js', 'js/store.js', 'js/views.js']
  .map(f => `\n/* ===== ${f} ===== */\n` + plain(read(f))).join('\n');
js += shim + `\n/* ===== js/app.js ===== */\n` + plain(read('js/app.js'));

const iconB64 = Buffer.from(read('assets/icons/icon.svg')).toString('base64');
const icon192 = fs.readFileSync('assets/icons/icon-192.png').toString('base64');
const icon512 = fs.readFileSync('assets/icons/icon-512.png').toString('base64');
const manifest = { name:'Thailand Trip Hub', short_name:'Tailandia', start_url:'.', scope:'.',
  display:'standalone', orientation:'portrait', background_color:'#0B4F45',
  theme_color:'#0B4F45', lang:'es',
  icons:[{src:'data:image/png;base64,'+icon192,sizes:'192x192',type:'image/png'},
         {src:'data:image/png;base64,'+icon512,sizes:'512x512',type:'image/png',purpose:'any maskable'}]};
const manifestUrl = 'data:application/manifest+json;base64,'+Buffer.from(JSON.stringify(manifest)).toString('base64');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5">
<title>Thailand Trip Hub · Bangkok y Phuket · 9-17 agosto 2026</title>
<meta name="description" content="Organizador del viaje a Tailandia.">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="googlebot" content="noindex, nofollow">
<meta name="theme-color" content="#0B4F45">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Tailandia">
<link rel="manifest" href="${manifestUrl}">
<link rel="icon" href="data:image/svg+xml;base64,${iconB64}" type="image/svg+xml">
<link rel="apple-touch-icon" href="data:image/png;base64,${icon192}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${read('vendor/leaflet.css')}
${read('css/styles.css')}
</style>
</head>
<body>
<div id="boot" class="boot">
  <div class="boot-mark">
    <svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="3"/>
      <circle cx="24" cy="24" r="22" fill="none" stroke="#FFB4A2" stroke-width="3"
              stroke-linecap="round" stroke-dasharray="34 104">
        <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24"
                          dur="1s" repeatCount="indefinite"/></circle>
    </svg>
    <p>Thailand Trip Hub</p>
  </div>
</div>
<div id="app" hidden>
  <header id="topbar" class="topbar"></header>
  <main id="view" class="view" tabindex="-1"></main>
  <nav id="tabbar" class="tabbar" aria-label="Navegación principal"></nav>
</div>
<div id="modal-root"></div>
<div id="toast-root" class="toast-root" role="status" aria-live="polite"></div>
<noscript><div style="padding:2rem;font-family:sans-serif">Esta página necesita JavaScript activado.</div></noscript>
<script>${read('vendor/leaflet.js')}</script>
<script>
(function () {
'use strict';
${js}
})();
</script>
</body>
</html>
`;
fs.writeFileSync('tailandia-una-sola-pagina.html', html);
console.log('Listo →', (html.length/1024).toFixed(0)+' KB');
