/* ==========================================================================
   core.js — utilidades, iconos, componentes base
   ========================================================================== */

/* ------------------------------------------------------------- Iconos --- */
const P = {
  home:'M3 10.5 12 3l9 7.5M5 9.8V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.8',
  calendar:'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  map:'M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3ZM9 3v15M15 6v15',
  wallet:'M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M3 7v3h15a2 2 0 0 1 0 4H3M17.5 12h.01',
  menu:'M4 7h16M4 12h16M4 17h16',
  plane:'M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8L8 11l-2 2H4l-1 1 3 1 1 3 1-1v-2l2-2 3.9 3.7a.5.5 0 0 0 .8-.5Z',
  car:'M5 17h14M6.5 17a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm14 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 13.5 4.7 8A2 2 0 0 1 6.6 6.6h10.8A2 2 0 0 1 19.3 8L21 13.5M3 13.5h18M3 13.5V17M21 13.5V17',
  bus:'M4 17V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11M4 11h16M8 17v2M16 17v2M7.5 14.5h.01M16.5 14.5h.01M2 17h20',
  bed:'M3 18V7M3 12h13a4 4 0 0 1 4 4v2M3 18h18M7 9.5h.01M7 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  compass:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  file:'M14 2v6h6M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z',
  check:'M4 12.5 9 17.5 20 6.5',
  list:'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-5M12 8h.01',
  users:'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  settings:'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z',
  chevron:'M9 5l7 7-7 7',
  chevronDown:'M6 9l6 6 6-6',
  back:'M15 5l-7 7 7 7',
  close:'M18 6 6 18M6 6l12 12',
  plus:'M12 5v14M5 12h14',
  edit:'M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6M18.4 2.6a2 2 0 0 1 2.8 2.8L12 14.6l-4 1 1-4 9.4-9Z',
  trash:'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6',
  copy:'M9 9V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4M13 9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z',
  phone:'M15.5 21A13.5 13.5 0 0 1 3 8.5 3 3 0 0 1 6 5.5h1.6a1 1 0 0 1 1 .8l.7 3a1 1 0 0 1-.3 1l-1.4 1.3a12 12 0 0 0 4.8 4.8l1.3-1.4a1 1 0 0 1 1-.3l3 .7a1 1 0 0 1 .8 1V18a3 3 0 0 1-3 3Z',
  whatsapp:'M20.5 11.6A8.4 8.4 0 0 1 7.9 19l-4.4 1.2 1.2-4.3A8.4 8.4 0 1 1 20.5 11.6Z M8.6 8.6c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6a7 7 0 0 0 3.2 2.8c.3.1.5.1.6-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.4.3v.6c-.1.4-.6 1-1.2 1.1-.5.1-1.2.2-3.6-.8a9 9 0 0 1-4-3.9c-.4-.7-.7-1.5-.7-2.2 0-.7.3-1.1.5-1.3Z',
  mapPin:'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6.5V12l3.5 2',
  alert:'M12 9v4M12 17h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  filter:'M3 5h18M6 12h12M10 19h4',
  sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  cloud:'M17.5 19a4.5 4.5 0 0 0 .3-9A6.5 6.5 0 0 0 5.2 11.4 3.8 3.8 0 0 0 6 19h11.5Z',
  rain:'M16 13a4 4 0 0 0 .3-8A6 6 0 0 0 4.8 6.6 3.5 3.5 0 0 0 5.5 13H16ZM8 16.5 7 19M12 16.5 11 19M16 16.5 15 19',
  camera:'M14.5 4h-5L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-1.5-3ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  upload:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 9l5-5 5 5M12 4v12',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  link:'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  euro:'M18 7A7.5 7.5 0 0 0 7 10.5m0 3A7.5 7.5 0 0 0 18 17M3 10.5h9M3 13.5h9',
  ticket:'M4 6h16a1 1 0 0 1 1 1v3.2a2.4 2.4 0 0 0 0 3.6V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.2a2.4 2.4 0 0 0 0-3.6V7a1 1 0 0 1 1-1Z M14 6.5v2 M14 11v2 M14 15.5v2',
  shield:'M12 22s8-4 8-10V5.5L12 2 4 5.5V12c0 6 8 10 8 10ZM9 12l2 2 4-4',
  heart:'M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.3-8.5 11.3Z',
  star:'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z',
  utensils:'M4 3v7a3 3 0 0 0 6 0V3M7 10v11M17 3c-1.5 1-2.5 3-2.5 5.5 0 2 1 3.5 2.5 3.5s2.5-1.5 2.5-3.5C19.5 6 18.5 4 17 3ZM17 12v9',
  building:'M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 9h3a2 2 0 0 1 2 2v10M2 21h20M8 7h2M8 11h2M8 15h2',
  cross:'M12 4v16M4 12h16',
  pill:'M8 6h8a6 6 0 0 1 0 12H8A6 6 0 0 1 8 6Z M12 6v12',
  flag:'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1v15ZM4 22v-7',
  train:'M8 3h8a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM4 10h16M9 18l-3 4M15 18l3 4M8.5 14h.01M15.5 14h.01',
  ship:'M3 17.5c1.5 0 1.5 1.2 3 1.2s1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2M5 15l1.5-5.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 15M12 3v5',
  bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  globe:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z',
  luggage:'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2ZM10 21v1M14 21v1M12 10v7',
  chart:'M3 3v18h18M7 15l3.5-4 3 2.5L20 7',
  refresh:'M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6',
  share:'M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13',
  eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  lock:'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM7.5 11V7a4.5 4.5 0 1 1 9 0v4',
  wifi:'M2 8.8a16 16 0 0 1 20 0M5 12.5a11 11 0 0 1 14 0M8.5 16a6 6 0 0 1 7 0M12 20h.01',
  plug:'M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5',
  mail:'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  arrowRight:'M5 12h14M13 6l6 6-6 6',
  sparkle:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
  swap:'M7 4v13M7 4L4 7M7 4l3 3M17 20V7M17 20l3-3M17 20l-3-3',
};

export function icon(name, size = 20, cls = '') {
  const d = P[name] || P.info;
  return `<svg class="${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${d.split(' M').map((s, i) => `<path d="${i ? 'M' + s : s}"/>`).join('')}</svg>`;
}

/* ---------------------------------------------------------------- DOM --- */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** Delegación de eventos por [data-act] */
export function on(root, event, selector, fn) {
  root.addEventListener(event, e => {
    const t = e.target.closest(selector);
    if (t && root.contains(t)) fn(e, t);
  });
}

/* ---------------------------------------------------------- Fechas ------ */
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio',
  'agosto','septiembre','octubre','noviembre','diciembre'];
const MESES_C = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const DIAS_C = ['dom','lun','mar','mié','jue','vie','sáb'];

/** Interpreta 'YYYY-MM-DD' como fecha local (evita el desfase UTC) */
export function toDate(iso) {
  if (!iso) return null;
  if (iso instanceof Date) return iso;
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(iso);
  return isNaN(d) ? null : d;
}

export const isoDate = d => {
  const x = d instanceof Date ? d : toDate(d);
  if (!x) return '';
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;

export function fmtDate(iso, style = 'long') {
  const d = toDate(iso); if (!d) return '';
  if (style === 'long')  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  if (style === 'medium')return `${d.getDate()} ${MESES_C[d.getMonth()]} ${d.getFullYear()}`;
  if (style === 'short') return `${d.getDate()} ${MESES_C[d.getMonth()]}`;
  if (style === 'weekday') return cap(`${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`);
  if (style === 'weekshort') return cap(`${DIAS_C[d.getDay()]} ${d.getDate()} ${MESES_C[d.getMonth()]}`);
  return isoDate(d);
}

export const fmtTime = t => t ? String(t).slice(0, 5) : '';

export function daysBetween(a, b) {
  const x = toDate(a), y = toDate(b);
  if (!x || !y) return 0;
  return Math.round((y - x) / 86400000);
}

export function addDays(iso, n) {
  const d = toDate(iso); if (!d) return '';
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

/** Minutos desde medianoche */
export const mins = t => {
  if (!t) return null;
  const [h, m] = String(t).split(':').map(Number);
  return h * 60 + (m || 0);
};

export function durationText(m) {
  if (m == null || m < 0) return '';
  const h = Math.floor(m / 60), r = m % 60;
  return h ? `${h}h${r ? ' ' + r + 'm' : ''}` : `${r}m`;
}

/** Hora actual en una zona horaria dada */
export function timeIn(tz) {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date());
  } catch { return '--:--'; }
}
export function dayIn(tz) {
  try {
    return new Intl.DateTimeFormat('es-ES', { timeZone: tz, weekday: 'short', day: 'numeric' })
      .format(new Date());
  } catch { return ''; }
}

/* --------------------------------------------------------------- Cifras - */
export function money(n, cur = 'EUR', dec = 2) {
  if (n === null || n === undefined || n === '' || isNaN(n)) return '—';
  const s = Number(n).toLocaleString('es-ES', {
    minimumFractionDigits: dec, maximumFractionDigits: dec
  });
  return cur === 'THB' ? `${s} ฿` : cur === 'EUR' ? `${s} €` : `${s} ${cur}`;
}
export const money0 = (n, c) => money(n, c, 0);

/* --------------------------------------------------------------- Varios - */
export const uid = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }));

export const initials = name => (name || '?').trim().split(/\s+/)
  .slice(0, 2).map(w => w[0]).join('').toUpperCase();

const PALETTE = ['#0E6B5C','#0FA3A3','#E8664B','#7A5AF8','#D98A0B','#DB2777','#2563EB','#12876F'];
export const colorFor = key => {
  const s = String(key || '');
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

export const mapsUrl = (q, lat, lng) =>
  (lat != null && lng != null && lat !== '' && lng !== '')
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q || '')}`;

export const telUrl = p => `tel:${String(p || '').replace(/[^\d+]/g, '')}`;
export const waUrl = (p, txt = '') =>
  `https://wa.me/${String(p || '').replace(/[^\d]/g, '')}${txt ? '?text=' + encodeURIComponent(txt) : ''}`;

export async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copiado: ' + text, 'ok');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('Copiado', 'ok'); }
    catch { toast('No se ha podido copiar', 'err'); }
    ta.remove();
  }
}

export function debounce(fn, ms = 250) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* --------------------------------------------------------------- Toast -- */
export function toast(msg, kind = '', ms = 2600) {
  const root = $('#toast-root');
  if (!root) return;
  const n = el(`<div class="toast ${kind}">${kind === 'ok' ? icon('check', 16) :
    kind === 'err' ? icon('alert', 16) : ''}<span>${esc(msg)}</span></div>`);
  root.appendChild(n);
  setTimeout(() => { n.style.opacity = '0'; n.style.transform = 'translateY(8px)';
    n.style.transition = 'all .25s'; setTimeout(() => n.remove(), 260); }, ms);
}

/* -------------------------------------------------------- Hoja / modal -- */
let sheetCount = 0;

export function sheet({ title, sub, body, foot, onMount, onClose, size }) {
  const id = 'sh' + (++sheetCount);
  const back = el(`
    <div class="sheet-back" id="${id}">
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title || '')}"
           ${size === 'full' ? 'style="height:92dvh"' : ''}>
        <div class="sheet-head">
          <h3>${esc(title || '')}</h3>
          ${sub ? `<div class="sub">${esc(sub)}</div>` : ''}
          <button class="icon-btn sheet-x" data-x aria-label="Cerrar">${icon('close', 19)}</button>
        </div>
        <div class="sheet-body">${body || ''}</div>
        ${foot ? `<div class="sheet-foot">${foot}</div>` : ''}
      </div>
    </div>`);

  $('#modal-root').appendChild(back);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => back.classList.add('on'));

  const close = () => {
    back.classList.remove('on');
    document.body.style.overflow = '';
    setTimeout(() => back.remove(), 300);
    onClose && onClose();
    document.removeEventListener('keydown', esckey);
  };
  const esckey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', esckey);

  back.addEventListener('click', e => { if (e.target === back) close(); });
  back.querySelector('[data-x]').addEventListener('click', close);

  onMount && onMount(back.querySelector('.sheet'), close);
  return { el: back, close };
}

export function confirmSheet(title, text, { danger = true, okLabel = 'Eliminar' } = {}) {
  return new Promise(resolve => {
    let done = false;
    const s = sheet({
      title,
      body: `<p style="font-size:14.5px;line-height:1.55;color:var(--ink-2)">${esc(text)}</p>`,
      foot: `<button class="btn ghost" data-no>Cancelar</button>
             <button class="btn ${danger ? 'danger' : ''}" data-yes>${esc(okLabel)}</button>`,
      onMount(root, close) {
        root.querySelector('[data-no]').onclick = () => { done = true; close(); resolve(false); };
        root.querySelector('[data-yes]').onclick = () => { done = true; close(); resolve(true); };
      },
      onClose() { if (!done) resolve(false); }
    });
    return s;
  });
}

/* ------------------------------------------------------------ Plantillas */
export const avatar = (name, color, cls = '') =>
  `<div class="av ${cls}" style="background:${color || colorFor(name)}" title="${esc(name || '')}">${esc(initials(name))}</div>`;

export const emptyState = (ico, title, text, action = '') => `
  <div class="empty">
    <div class="ic">${icon(ico, 29)}</div>
    <b>${esc(title)}</b>
    <p>${esc(text)}</p>
    ${action ? `<div class="mt">${action}</div>` : ''}
  </div>`;

export const copyChip = (label, value) => value
  ? `<button class="copyable" data-copy="${esc(value)}">${esc(value)}${icon('copy', 14)}</button>`
  : '';

/** Acciones rápidas: llamar / WhatsApp / mapa / web */
export function quickActions({ phone, address, lat, lng, url, mapsHref }) {
  const a = [];
  if (phone) a.push(`<a class="act tel" href="${telUrl(phone)}">${icon('phone')}<span>Llamar</span></a>`);
  if (phone) a.push(`<a class="act wa" href="${waUrl(phone)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a>`);
  if (address || (lat != null && lng != null) || mapsHref)
    a.push(`<a class="act map" href="${esc(mapsHref || mapsUrl(address, lat, lng))}" target="_blank" rel="noopener">${icon('mapPin')}<span>Mapa</span></a>`);
  if (url) a.push(`<a class="act" href="${esc(url)}" target="_blank" rel="noopener">${icon('link')}<span>Web</span></a>`);
  return a.length ? `<div class="actions-grid">${a.join('')}</div>` : '';
}

/** Descarga de un texto como archivo */
export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* -------------------------------------------------------- Archivo .ics -- */
export function icsEvent({ title, date, start, end, description, location, tz = 'Asia/Bangkok' }) {
  const stamp = s => s.replace(/[-:]/g, '');
  const dt = (d, t) => `${stamp(d)}T${stamp(t || '09:00')}00`;
  const endT = end || (start ? addMinutes(start, 60) : '10:00');
  const fold = s => String(s || '').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thailand Trip Hub//ES', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid()}@thailandtriphub`,
    `DTSTAMP:${stamp(isoDate(new Date()))}T000000Z`,
    `DTSTART;TZID=${tz}:${dt(date, start)}`,
    `DTEND;TZID=${tz}:${dt(date, endT)}`,
    `SUMMARY:${fold(title)}`,
    description ? `DESCRIPTION:${fold(description)}` : '',
    location ? `LOCATION:${fold(location)}` : '',
    'END:VEVENT', 'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
}

export function addMinutes(t, n) {
  const m = mins(t) + n;
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
