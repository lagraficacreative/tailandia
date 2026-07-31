/* ==========================================================================
   app.js — arranque, navegación y acciones
   ========================================================================== */

import { TRIP, PEOPLE, PLACES, CITIES, DAYS } from './data.js';
import { store, refreshRate } from './store.js';
import {
  $, $$, el, esc, icon, toast, sheet, confirmSheet, copy, timeIn,
  fmtDate, isoDate, downloadText, avatar, emptyState, mapsUrl,
} from './core.js';
import * as V from './views.js';

/* ------------------------------------------------------------- Rutas ---- */
const ROUTES = {
  '/':          { title: 'Thailand Trip Hub', sub: TRIP.subtitle, render: V.viewHome, tab: 'inicio' },
  '/agenda':    { title: 'Agenda', sub: 'Día a día', render: V.viewAgenda, tab: 'agenda' },
  '/mapa':      { title: 'Mapa del viaje', render: renderMap, tab: 'mapa', bare: true },
  '/gastos':    { title: 'Gastos', sub: 'Presupuesto y balances', render: V.viewExpenses, tab: 'gastos' },
  '/mas':       { title: 'Más', render: V.viewMore, tab: 'mas' },
  '/reservas':  { title: 'Reservas', sub: 'Vuelos, hoteles y excursiones', render: V.viewBookings, back: '#/mas' },
  '/listas':    { title: 'Listas', sub: 'Equipaje y pendientes', render: V.viewLists, back: '#/mas' },
  '/documentos':{ title: 'Documentos', sub: 'La carpeta del viaje', render: V.viewDocs, back: '#/mas' },
  '/comer':     { title: 'Comer y comprar', sub: 'Cerca de los hoteles', render: V.viewFood, back: '#/mas' },
  '/info':      { title: 'Información útil', render: V.viewInfo, back: '#/mas' },
  '/contactos': { title: 'Contactos', render: V.viewContacts, back: '#/mas' },
  '/refs':      { title: 'Localizadores', render: V.viewRefs, back: '#/mas' },
  '/grupo':     { title: 'Grupo y ajustes', render: V.viewGroup, back: '#/mas' },
};

const TABS = [
  ['inicio', '#/',       'home',     'Inicio'],
  ['agenda', '#/agenda', 'calendar', 'Agenda'],
  ['mapa',   '#/mapa',   'map',      'Mapa'],
  ['gastos', '#/gastos', 'wallet',   'Gastos'],
  ['mas',    '#/mas',    'menu',     'Más'],
];

function parseHash() {
  const raw = (location.hash || '#/').slice(1);
  const [path, qs] = raw.split('?');
  return { path: path || '/', params: new URLSearchParams(qs || '') };
}

let current = null;
let mapInstance = null;

function render() {
  const { path, params } = parseHash();

  // Día suelto: #/dia/2026-08-11
  if (path.startsWith('/dia/')) {
    const date = path.slice(5);
    const d = DAYS.find(x => x.date === date);
    paint({ title: d ? d.title : 'Día', sub: d ? fmtDate(date, 'weekday') : '',
            back: '#/agenda', tab: 'agenda' }, V.viewDay(date));
    return;
  }

  const r = ROUTES[path] || ROUTES['/'];
  current = r;
  paint(r, r.render(params));
}

function paint(r, html) {
  const view = $('#view');
  if (mapInstance) {
    try { mapInstance.stop(); } catch {}
    try { mapInstance.remove(); } catch {}
    mapInstance = null; layers = {};
  }

  $('#topbar').innerHTML = `
    <div class="topbar-inner">
      ${r.back ? `<button class="icon-btn" data-back aria-label="Volver">${icon('back', 20)}</button>` : ''}
      <h1>${esc(r.title)}${r.sub ? `<span class="sub">${esc(r.sub)}</span>` : ''}</h1>
      ${r.tab === 'inicio' ? `<button class="icon-btn" data-install hidden aria-label="Instalar">${icon('download', 19)}</button>` : ''}
      ${r.tab === 'inicio' ? `<a class="icon-btn" href="#/grupo" aria-label="Ajustes">${icon('settings', 19)}</a>` : ''}
    </div>`;

  view.innerHTML = html;
  view.scrollTop = 0;
  window.scrollTo(0, 0);

  $('#tabbar').innerHTML = `<div class="tabbar-inner">
    ${TABS.map(([k, h, ic, l]) => `
      <a class="tab ${r.tab === k ? 'active' : ''}" href="${h}">${icon(ic, 23)}<span>${l}</span></a>`).join('')}
  </div>`;

  if (r.tab === 'mapa') initMap();
  if (r.tab === 'inicio') { loadWeather(); startClocks(); }
  if (r.render === V.viewGroup) checkSw();
  refreshInstallBtn();
}

/* --------------------------------------------------------- Relojes ------ */
let clockTimer;
function startClocks() {
  clearInterval(clockTimer);
  clockTimer = setInterval(() => {
    $$('[data-clock]').forEach(n => { n.textContent = timeIn(n.dataset.clock); });
  }, 20000);
}

/* ---------------------------------------------------------- Mapa -------- */
const PLACE_STYLE = {
  ciudad:      ['#0E6B5C', 'building'], aeropuerto: ['#2563EB', 'plane'],
  hotel:       ['#12876F', 'bed'],      excursion:  ['#E8664B', 'compass'],
  restaurante: ['#D98A0B', 'utensils'], monumento:  ['#7A5AF8', 'star'],
  playa:       ['#19C2BE', 'sun'],      compras:    ['#DB2777', 'wallet'],
  transporte:  ['#0B7F8C', 'train'],    hospital:   ['#DC2626', 'cross'],
  farmacia:    ['#059669', 'pill'],     embajada:   ['#C9503A', 'flag'],
  interes:     ['#6D827D', 'mapPin'],
};
const PLACE_LABEL = {
  ciudad: 'Ciudades', aeropuerto: 'Aeropuertos', hotel: 'Hoteles', excursion: 'Excursiones',
  restaurante: 'Restaurantes', monumento: 'Monumentos', playa: 'Playas', compras: 'Compras',
  transporte: 'Transporte', hospital: 'Hospitales', farmacia: 'Farmacias',
  embajada: 'Embajada', interes: 'Lugares de interés',
};

function renderMap() {
  const cats = [...new Set(PLACES.map(p => p.cat))];
  return `
  <div class="map-wrap">
    <div class="map-filters">
      <button class="chip on" data-mapcat="all">Todo</button>
      ${cats.map(c => `<button class="chip" data-mapcat="${c}">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${PLACE_STYLE[c][0]}"></span>
        ${PLACE_LABEL[c] || c}</button>`).join('')}
    </div>
    <div id="map"></div>
  </div>`;
}

let layers = {};
function initMap() {
  if (typeof L === 'undefined') {
    $('#map').innerHTML = `<div class="empty" style="padding-top:80px">
      <div class="ic">${icon('map', 29)}</div><b>Mapa no disponible</b>
      <p>Hace falta conexión a internet la primera vez para cargar el mapa.</p></div>`;
    return;
  }
  const map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([11.5, 99.5], 6);
  mapInstance = map;
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap © CARTO',
  }).addTo(map);

  layers = {};
  PLACES.forEach(p => {
    const [color, ic] = PLACE_STYLE[p.cat] || PLACE_STYLE.interes;
    const m = L.marker([p.lat, p.lng], {
      icon: L.divIcon({
        className: '', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28],
        html: `<div class="pin" style="background:${color}">${icon(ic, 14)}</div>`,
      }),
    }).bindPopup(`
      <b>${esc(p.name)}</b>
      ${p.note ? `<div style="color:#6D827D;font-size:12.5px">${esc(p.note)}</div>` : ''}
      <div style="margin-top:9px;display:flex;gap:7px">
        <a href="${p.q ? mapsUrl(p.q) : mapsUrl(p.name, p.lat, p.lng)}" target="_blank" rel="noopener"
           style="font-weight:700;font-size:12.5px">Abrir en Google Maps</a>
        ${p.phone ? `<a href="tel:${p.phone.replace(/[^\d+]/g, '')}" style="font-weight:700;font-size:12.5px">Llamar</a>` : ''}
      </div>`);
    (layers[p.cat] ||= L.layerGroup().addTo(map)).addLayer(m);
  });

  // Línea del itinerario
  const route = CITIES.filter(c => c.nights > 0).map(c => [c.lat, c.lng]);
  if (route.length > 1) L.polyline(route, { color: '#0E6B5C', weight: 3, dashArray: '7 7', opacity: .65 }).addTo(map);

  // Si el usuario ya ha cambiado de pantalla, no tocar el mapa
  setTimeout(() => {
    if (mapInstance !== map || !document.getElementById('map')) return;
    try {
      map.invalidateSize();
      map.fitBounds(
        L.latLngBounds(PLACES.filter(p => p.lat > 5 && p.lat < 25).map(p => [p.lat, p.lng])).pad(0.12),
        { animate: false });
    } catch {}
  }, 150);
}

function filterMap(cat) {
  if (!mapInstance) return;
  Object.entries(layers).forEach(([k, lg]) => {
    try {
      if (cat === 'all' || k === cat) lg.addTo(mapInstance);
      else mapInstance.removeLayer(lg);
    } catch {}
  });
}

/* ------------------------------------------------------- Meteorología --- */
const WCODE = c =>
  c === 0 ? ['sun', 'Despejado'] :
  c <= 3 ? ['cloud', 'Nubes'] :
  c <= 48 ? ['cloud', 'Niebla'] :
  c <= 67 ? ['rain', 'Lluvia'] :
  c <= 82 ? ['rain', 'Chubascos'] :
  ['rain', 'Tormenta'];

async function loadWeather() {
  const box = $('#weather-box');
  if (!box) return;
  const t = isoDate(new Date());
  const city = t >= '2026-08-13' ? CITIES.find(c => c.id === 'phuket') : CITIES.find(c => c.id === 'bangkok');
  box.innerHTML = `<div class="card card-pad"><div class="skeleton" style="height:56px"></div></div>`;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=Asia%2FBangkok&forecast_days=6`;
    const r = await fetch(url);
    const j = await r.json();
    const d = j.daily;
    box.innerHTML = `
      <div class="card card-pad">
        <div class="row-between" style="margin-bottom:12px">
          <b style="font-size:14px">Tiempo en ${esc(city.name)}</b>
          <a class="tiny strong" href="#/info" style="color:var(--teal-700)">Clima en agosto</a>
        </div>
        <div class="row" style="gap:6px;overflow-x:auto;scrollbar-width:none">
          ${d.time.map((day, i) => {
            const [ic, lb] = WCODE(d.weather_code[i]);
            return `<div style="flex:none;text-align:center;min-width:58px;padding:8px 4px;border-radius:12px;background:var(--surface-2)">
              <div class="tiny muted strong" style="text-transform:capitalize">${i === 0 ? 'Hoy' : fmtDate(day, 'weekshort').split(' ')[0]}</div>
              <div style="color:var(--teal-700);margin:5px 0">${icon(ic, 20)}</div>
              <div class="strong num" style="font-size:13px">${Math.round(d.temperature_2m_max[i])}°</div>
              <div class="tiny muted num">${Math.round(d.temperature_2m_min[i])}°</div>
              <div class="tiny" style="color:var(--blue-600);margin-top:3px">${d.precipitation_probability_max[i] ?? 0}%</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  } catch {
    box.innerHTML = `<div class="card card-pad tiny muted">
      ${icon('cloud', 16)} La previsión del tiempo necesita conexión a internet.</div>`;
  }
}

/* --------------------------------------------------------- Acciones ----- */
document.addEventListener('click', async e => {
  const t = e.target;

  const go = t.closest('[data-go]');
  if (go) { e.preventDefault(); location.hash = go.dataset.go; return; }

  const back = t.closest('[data-back]');
  if (back) { e.preventDefault(); history.length > 1 ? history.back() : (location.hash = '#/'); return; }

  const cp = t.closest('[data-copy]');
  if (cp) { e.preventDefault(); copy(cp.dataset.copy); return; }

  const item = t.closest('[data-item]');
  if (item) { V.openItem(item.dataset.item); return; }

  const exc = t.closest('[data-exc]');
  if (exc) { V.openExcursion(exc.dataset.exc); return; }

  if (t.closest('[data-folder]')) { V.openFolder(); return; }

  const doc = t.closest('[data-doc]');
  if (doc) { V.openDoc(doc.dataset.doc); return; }

  const chk = t.closest('[data-chk]');
  if (chk) {
    if (!store.me()) { whoAmI(() => { store.toggle(chk.dataset.chk); render(); }); return; }
    store.toggle(chk.dataset.chk);
    chk.classList.toggle('done');
    updateProgress(chk.dataset.chk);
    return;
  }

  const addI = t.closest('[data-add-item]');
  if (addI) { V.addItemSheet(addI.dataset.addItem); return; }

  const ol = t.closest('[data-openlist]');
  if (ol) {
    V.setOpenList(ol.dataset.openlist);
    render();
    const n = document.getElementById('lista-' + ol.dataset.openlist);
    if (n) n.scrollIntoView({ block: 'start', behavior: 'smooth' });
    return;
  }

  const delI = t.closest('[data-del-item]');
  if (delI) {
    e.stopPropagation();
    const [list, id] = delI.dataset.delItem.split('|');
    if (await confirmSheet('Eliminar', '¿Quitar este elemento de la lista?')) { store.removeItem(list, id); render(); }
    return;
  }

  if (t.closest('[data-add-exp]')) { V.addExpenseSheet(); return; }

  const exp = t.closest('[data-exp]');
  if (exp) {
    const found = store.allExpenses().find(x => x.id === exp.dataset.exp);
    if (found) V.addExpenseSheet(found);
    return;
  }

  if (t.closest('[data-export-exp]')) { V.exportExpenses(); return; }
  if (t.closest('[data-edit-budget]')) { editBudget(); return; }

  const mc = t.closest('[data-mapcat]');
  if (mc) {
    $$('[data-mapcat]').forEach(b => b.classList.toggle('on', b === mc));
    filterMap(mc.dataset.mapcat);
    return;
  }

  const acc = t.closest('[data-acc]');
  if (acc) {
    const body = $('#acc-' + acc.dataset.acc);
    const open = !body.hidden;
    body.hidden = open;
    const arrow = acc.querySelector('[data-arrow]');
    if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
    return;
  }

  const qthb = t.closest('[data-quick-thb]');
  if (qthb) {
    const v = +qthb.dataset.quickThb;
    $('[data-cv="thb"]').value = v;
    $('[data-cv="eur"]').value = (v / store.rate()).toFixed(2);
    return;
  }

  const setme = t.closest('[data-setme]');
  if (setme) { store.setMe(setme.dataset.setme); render(); toast('Guardado', 'ok'); return; }

  if (t.closest('[data-who]')) { whoAmI(); return; }
  if (t.closest('[data-icsall]') || t.closest('[data-ics-all]')) { exportAllIcs(); return; }
  if (t.closest('[data-share]')) { shareApp(); return; }
  if (t.closest('[data-backup]')) {
    downloadText('copia-tailandia.json', store.export(), 'application/json');
    toast('Copia descargada', 'ok'); return;
  }
  if (t.closest('[data-restore]')) { restoreBackup(); return; }
  if (t.closest('[data-reset]')) {
    if (await confirmSheet('Empezar de cero',
      'Se borrarán las marcas de las listas, los gastos que hayas añadido y las notas. Los datos del viaje se mantienen.')) {
      store.reset(); render(); toast('Listo', 'ok');
    }
    return;
  }
  if (t.closest('[data-install]')) { doInstall(); return; }
});

/* Conversor de moneda en vivo */
document.addEventListener('input', e => {
  const f = e.target.closest('[data-cv]');
  if (!f) return;
  const r = store.rate();
  const v = parseFloat(f.value);
  const other = $(`[data-cv="${f.dataset.cv === 'eur' ? 'thb' : 'eur'}"]`);
  if (!other) return;
  if (isNaN(v)) { other.value = ''; return; }
  other.value = f.dataset.cv === 'eur' ? (v * r).toFixed(0) : (v / r).toFixed(2);
});

/** Actualiza la barra de progreso de una lista sin repintar la pantalla */
function updateProgress(key) {
  const listId = String(key || '').split(':')[0];
  const block = document.getElementById('lista-' + listId);
  if (!block) return;
  const p = store.listProgress(listId);
  const bar = block.querySelector('.progress i');
  const st = block.querySelector('.lrow .st');
  const chip = document.querySelector(`[data-openlist="${listId}"] span`);
  if (bar) bar.style.width = p.pct + '%';
  if (st) {
    const extra = st.textContent.split(' · ').slice(2).join(' · ');
    st.textContent = `${p.done} de ${p.total} · ${p.pct}%` + (extra ? ' · ' + extra : '');
  }
  if (chip) chip.textContent = `${p.done}/${p.total}`;
}

/* ----------------------------------------------------------- Diálogos --- */
function whoAmI(then) {
  sheet({
    title: '¿Quién eres?',
    sub: 'Así el resto sabe quién ha marcado cada cosa',
    body: `<div class="card">
      ${PEOPLE.map(p => `<button class="lrow" data-pick="${p.id}">
        ${avatar(p.name, p.color)}
        <div class="grow" style="margin-left:2px"><div class="tt">${esc(p.name)}</div></div>
      </button>`).join('')}</div>`,
    onMount(root, close) {
      root.addEventListener('click', ev => {
        const b = ev.target.closest('[data-pick]');
        if (!b) return;
        store.setMe(b.dataset.pick);
        close();
        then ? then() : render();
      });
    },
  });
}

function editBudget() {
  sheet({
    title: 'Presupuesto del viaje',
    body: `<div class="field"><label>Presupuesto total en euros</label>
      <input class="input num" type="number" inputmode="decimal" data-b value="${store.budget()}"></div>
      <p class="tiny muted">Es solo una referencia para la barra de progreso.</p>`,
    foot: `<button class="btn ghost" data-cancel>Cancelar</button><button class="btn" data-ok>Guardar</button>`,
    onMount(root, close) {
      root.querySelector('[data-cancel]').onclick = close;
      root.querySelector('[data-ok]').onclick = () => {
        store.setBudget(root.querySelector('[data-b]').value);
        close(); render(); toast('Presupuesto actualizado', 'ok');
      };
    },
  });
}

function restoreBackup() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'application/json';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    const txt = await f.text();
    if (store.import(txt)) { render(); toast('Copia restaurada', 'ok'); }
    else toast('El archivo no es válido', 'err');
  };
  inp.click();
}

async function shareApp() {
  const url = location.origin + location.pathname;
  const data = { title: 'Thailand Trip Hub', text: 'Toda la información de nuestro viaje a Tailandia', url };
  if (navigator.share) { try { await navigator.share(data); return; } catch {} }
  copy(url);
}

function exportAllIcs() {
  const ev = [];
  DAYS.forEach(d => d.items.forEach(it => {
    if (!it.time) return;
    ev.push([
      'BEGIN:VEVENT',
      `UID:${d.date}-${it.time.replace(':', '')}@thailandtriphub`,
      `DTSTAMP:20260730T000000Z`,
      `DTSTART;TZID=${d.cityId === 'barcelona' || d.cityId === 'lleida' ? 'Europe/Madrid' : 'Asia/Bangkok'}:${d.date.replace(/-/g, '')}T${it.time.replace(':', '')}00`,
      `DTEND;TZID=${d.cityId === 'barcelona' || d.cityId === 'lleida' ? 'Europe/Madrid' : 'Asia/Bangkok'}:${d.date.replace(/-/g, '')}T${(it.endTime || it.time).replace(':', '')}00`,
      `SUMMARY:${it.title.replace(/,/g, '\\,')}`,
      it.subtitle ? `DESCRIPTION:${it.subtitle.replace(/,/g, '\\,')}` : '',
      it.where ? `LOCATION:${it.where.replace(/,/g, '\\,')}` : '',
      'END:VEVENT',
    ].filter(Boolean).join('\r\n'));
  }));
  downloadText('agenda-tailandia.ics',
    ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thailand Trip Hub//ES', ...ev, 'END:VCALENDAR'].join('\r\n'),
    'text/calendar');
  toast('Agenda descargada', 'ok');
}

/* --------------------------------------------------------- Instalar ----- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e; refreshInstallBtn();
});
function refreshInstallBtn() {
  const b = $('[data-install]');
  if (b) b.hidden = !deferredPrompt;
}
async function doInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null; refreshInstallBtn();
}

/* ------------------------------------------------------ Sin conexión ---- */
function updateOnline() {
  const bar = $('#offline-bar');
  document.body.classList.toggle('is-offline', !navigator.onLine);
  if (!navigator.onLine && !bar) {
    document.body.appendChild(el('<div class="offline-bar" id="offline-bar">Sin conexión · la agenda y las reservas siguen disponibles</div>'));
  } else if (navigator.onLine && bar) bar.remove();
}
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);

function checkSw() {
  const n = $('#sw-state');
  if (!n) return;
  if (!/^https?:$/.test(location.protocol)) { n.textContent = 'Al publicarla en internet'; return; }
  n.textContent = navigator.serviceWorker?.controller ? 'Activado' : 'Se activará al recargar';
}

/* --------------------------------------------------------- Arranque ----- */
window.addEventListener('hashchange', render);
window.addEventListener('render', render);
window.addEventListener('store:change', () => {
  if (current === ROUTES['/gastos']) { /* la vista se repinta desde la acción */ }
});

async function boot() {
  render();
  updateOnline();
  refreshRate().then(() => { if (parseHash().path === '/info') render(); });

  // El modo sin conexión solo se puede activar cuando la app está en internet
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    try { await navigator.serviceWorker.register('./sw.js'); } catch {}
  }

  $('#app').hidden = false;
  const b = $('#boot');
  b.classList.add('hide');
  setTimeout(() => b.remove(), 400);
}

boot();
