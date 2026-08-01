/* ==========================================================================
   views.js — todas las pantallas de la aplicación
   ========================================================================== */

import {
  TRIP, PEOPLE, CITIES, DAYS, FLIGHTS, TRANSFERS, STAYS, EXCURSIONS,
  PLACES, EXPENSE_CATS, LISTS, NOTICES, INFO, CONTACTS, REFS, CHECKIN_URL,
  DOCS, DOCS_FOLDER, FOOD, PRICES,
} from './data.js';
import { store } from './store.js';
import { photos, comprimir } from './photos.js';
import {
  $, $$, el, esc, icon, avatar, initials, toast, sheet, confirmSheet,
  fmtDate, fmtTime, isoDate, toDate, daysBetween, timeIn, mins,
  money, mapsUrl, telUrl, waUrl, copy, quickActions, emptyState,
  downloadText, icsEvent, colorFor, addMinutes, addDays,
} from './core.js';

/* --------------------------------------------------------------- Ayudas - */

const TYPE = {
  vuelo:     { icon: 'plane',    label: 'Vuelo' },
  traslado:  { icon: 'car',      label: 'Traslado' },
  hotel:     { icon: 'bed',      label: 'Alojamiento' },
  excursion: { icon: 'compass',  label: 'Excursión' },
  comida:    { icon: 'utensils', label: 'Comida' },
  visita:    { icon: 'building', label: 'Visita' },
  libre:     { icon: 'sun',      label: 'Tiempo libre' },
  aviso:     { icon: 'info',     label: 'Aviso' },
  otros:     { icon: 'star',     label: 'Otros' },
};
const cls = t => `c-${t === 'aviso' || t === 'otros' ? 'otros' : t}`;

const STATUS = {
  confirmado:  ['pill-ok',    'Confirmado'],
  pendiente:   ['pill-warn',  'Pendiente'],
  recomendado: ['pill-muted', 'Recomendado'],
  pagado:      ['pill-ok',    'Pagado'],
};
const statusPill = s => s && STATUS[s]
  ? `<span class="pill ${STATUS[s][0]}">${STATUS[s][1]}</span>` : '';

const person = id => PEOPLE.find(p => p.id === id);

/** "Del 9 al 17 de agosto de 2026" */
function dateRange(a, b) {
  const x = toDate(a), y = toDate(b);
  if (!x || !y) return '';
  return x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()
    ? `Del ${x.getDate()} al ${fmtDate(b, 'long')}`
    : `Del ${fmtDate(a, 'short')} al ${fmtDate(b, 'long')}`;
}

/** Cabecera visual: solo si hay una foto de verdad */
function banner(photo, h = 150) {
  if (!photo) return '';
  return `<img src="${esc(photo)}" alt="" loading="lazy" onerror="this.remove()"
    style="width:100%;height:${h}px;object-fit:cover">`;
}

export const today = () => isoDate(new Date());

/** Convierte el texto sencillo de data.js en HTML (negritas y saltos) */
function rich(t) {
  return esc(t || '')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

/** Los items de un día: los del itinerario más los que se hayan añadido */
function itemsOfDay(d) {
  const propios = store.activitiesOf(d.date).map(a => ({ ...a, userId: a.id }));
  return [...d.items, ...propios]
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
}

/** Todos los momentos del viaje en orden, para "próxima actividad" */
function timeline() {
  const out = [];
  DAYS.forEach(d => itemsOfDay(d).forEach((it, i) => {
    out.push({ ...it, date: d.date, city: d.city, dayTitle: d.title, idx: i });
  }));
  return out.sort((a, b) =>
    (a.date + (a.time || '99:99')).localeCompare(b.date + (b.time || '99:99')));
}

function nextUp() {
  const now = new Date();
  const stamp = `${isoDate(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return timeline().find(i => `${i.date} ${i.time || '00:00'}` >= stamp) || null;
}

function currentStay() {
  const t = today();
  return STAYS.find(s => t >= s.checkin && t < s.checkout) || null;
}

/** Las tareas sin marcar con fecha límite más cercana */
function upcomingTasks(n = 4) {
  const out = [];
  LISTS.forEach(l => store.itemsOf(l.id).forEach(i => {
    if (i.due && !store.isDone(i.key)) out.push({ ...i, list: l.name, listId: l.id });
  }));
  return out.sort((a, b) => a.due.localeCompare(b.due)).slice(0, n);
}

function activeNotices() {
  const t = today();
  return NOTICES.filter(n => !n.until || n.until >= t);
}

/* ==========================================================================
   NOTAS  ·  se pueden poner en cualquier ficha
   ========================================================================== */

/** Botón compacto de nota. Muestra si ya hay algo escrito. */
export function notaBtn(key, titulo) {
  const v = store.note(key);
  return `<button class="btn ${v ? 'soft' : 'ghost'} block" data-nota="${esc(key)}"
    data-nota-t="${esc(titulo)}" style="margin-top:12px">
    ${icon('edit', 16)} ${v ? 'Ver la nota' : 'Añadir una nota'}
    ${v ? `<span class="pill pill-ok" style="margin-left:4px">1</span>` : ''}
  </button>
  ${v ? `<div class="card card-pad" style="margin-top:8px;background:var(--sand-100);border-color:var(--sand-300)">
    <div class="tiny muted strong" style="text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px">Nota</div>
    <div style="font-size:13.5px;line-height:1.55;white-space:pre-wrap">${esc(v)}</div>
  </div>` : ''}`;
}

/** Bloque de nota siempre abierto, para las fichas grandes */
export function notaBlock(key, etiqueta = 'Nota del grupo', placeholder = '') {
  return `
  <div class="section-head"><h2>${esc(etiqueta)}</h2></div>
  <textarea class="textarea" data-note="${esc(key)}"
    placeholder="${esc(placeholder || 'Escribe aquí lo que quieras recordar…')}">${esc(store.note(key))}</textarea>`;
}

export function openNota(key, titulo) {
  sheet({
    title: titulo || 'Nota',
    sub: 'Se guarda en este móvil',
    body: `<div class="field">
        <label>Nota</label>
        <textarea class="textarea" style="min-height:180px" data-n
          placeholder="Lo que quieras recordar: un horario, un nombre, una idea…">${esc(store.note(key))}</textarea>
      </div>`,
    foot: `<button class="btn ghost" data-borra>${icon('trash', 15)} Borrar</button>
           <button class="btn" data-ok>Guardar</button>`,
    onMount(root, close) {
      root.querySelector('[data-borra]').onclick = () => {
        store.setNote(key, '');
        close(); toast('Nota borrada', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
      root.querySelector('[data-ok]').onclick = () => {
        store.setNote(key, root.querySelector('[data-n]').value);
        close(); toast('Nota guardada', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

/* ==========================================================================
   CONVERSOR DE MONEDA
   ========================================================================== */
export function converterCard() {
  const rate = store.rate();
  return `
  <div class="card card-pad c-hotel" data-conv-card>
    <div class="row-between" style="margin-bottom:12px">
      <b style="font-size:15px">${icon('swap', 16)} Euros y bahts</b>
      <span class="pill pill-info">1 € = ${rate.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
    </div>
    <div class="grid-2">
      <div class="field" style="margin:0"><label>Euros</label>
        <input class="input num" type="number" inputmode="decimal" data-cv="eur" placeholder="0"></div>
      <div class="field" style="margin:0"><label>Bahts</label>
        <input class="input num" type="number" inputmode="decimal" data-cv="thb" placeholder="0"></div>
    </div>
    <div class="row wrap" style="gap:6px;margin-top:12px">
      ${[50, 100, 200, 500, 1000, 2000, 5000].map(v =>
        `<button class="chip" data-quick-thb="${v}">${v} ฿</button>`).join('')}
    </div>
    <div class="tiny muted" style="margin-top:10px">${store.rateInfo()
      ? 'Cambio actualizado el ' + fmtDate(store.rateInfo().at.slice(0, 10), 'short')
      : 'Cambio orientativo. Se actualiza solo cuando hay conexión.'}</div>
  </div>`;
}

/** El conversor, abierto desde cualquier pantalla */
export function converterSheet() {
  sheet({
    title: 'Euros y bahts',
    sub: 'Para saber si algo es caro sin hacer cuentas',
    body: converterCard() + `
      <div class="section-head"><h2>Para hacerse una idea</h2></div>
      <div class="card">
        ${[['Agua pequeña', 15], ['Café', 60], ['Plato de comida callejera', 60],
           ['Comida en restaurante local', 200], ['Trayecto corto en Grab', 100],
           ['Cena bonita en Phuket', 800], ['Masaje de una hora', 400]]
          .map(([k, thb]) => `<div class="lrow" style="padding:11px 15px">
            <div class="grow"><div class="tt" style="font-size:13.5px">${esc(k)}</div></div>
            <div class="rt"><div class="strong num" style="color:var(--ink);font-size:14px">${thb} ฿</div>
              <div class="tiny muted num">${money(thb / store.rate(), 'EUR')}</div></div>
          </div>`).join('')}
      </div>
      <p class="tiny muted center mt">Precios orientativos, para calibrar el oído.</p>`,
    foot: `<button class="btn block" data-close>Cerrar</button>`,
    onMount(root, close) { root.querySelector('[data-close]').onclick = close; },
  });
}

/* ==========================================================================
   INICIO
   ========================================================================== */
export function viewHome() {
  const t = today();
  const d = daysBetween(t, TRIP.start);
  const total = daysBetween(TRIP.start, TRIP.end) + 1;
  const dayNo = daysBetween(TRIP.start, t) + 1;
  const inTrip = t >= TRIP.start && t <= TRIP.end;
  const after = t > TRIP.end;

  const nx = nextUp();
  const stay = currentStay();
  const nextFlight = FLIGHTS.find(f => f.date >= t);
  const nextTransfer = TRANSFERS.find(x => x.date >= t);
  const notices = activeNotices();

  const cd = inTrip
    ? `<div class="cd-live">${icon('sparkle', 18)} Día ${dayNo} de ${total} · ${esc(DAYS.find(x => x.date === t)?.city || '')}</div>`
    : after
      ? `<div class="cd-live">${icon('heart', 18)} Viaje terminado. ¡Que hayan sido unos días estupendos!</div>`
      : `<div class="cd-lead">
           <b>${d}</b>
           <span>${d === 0 ? '¡hoy salís!' : d === 1 ? 'día para salir' : 'días para salir'}</span>
         </div>
         <div class="countdown three">
           ${[[total, 'jornadas'],
              [CITIES.reduce((n, c) => n + (c.nights || 0), 0), 'noches'],
              [TRIP.travellers, 'viajeros']]
             .map(([v, k]) => `<div class="cd-cell"><b>${v}</b><span>${k}</span></div>`).join('')}
         </div>`;

  return `
  <section class="hero">
    <div class="hero-in">
      <div class="eyebrow">${esc(TRIP.subtitle)}</div>
      <h2>${esc(TRIP.name)}</h2>
      <div class="dates">${dateRange(TRIP.start, TRIP.end)}</div>
      ${cd}
    </div>
  </section>

  <div class="section-head"><h2>Ahora mismo</h2></div>
  <div class="stack">
    <div class="card card-pad">
      <div class="row-between">
        <div>
          <div class="tiny muted strong">España</div>
          <div style="font-size:27px;font-weight:800;letter-spacing:-.04em" class="num" data-clock="${TRIP.homeTz}">${timeIn(TRIP.homeTz)}</div>
        </div>
        <div style="color:var(--ink-4)">${icon('arrowRight', 20)}</div>
        <div style="text-align:right">
          <div class="tiny muted strong">Tailandia</div>
          <div style="font-size:27px;font-weight:800;letter-spacing:-.04em;color:var(--green-700)" class="num" data-clock="${TRIP.tz}">${timeIn(TRIP.tz)}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="tiny muted">${esc(TRIP.tzDiff)}</div>
    </div>
    <div id="weather-box"></div>
  </div>

  ${notices.length ? `
    <div class="section-head"><h2>Avisos importantes</h2></div>
    <div class="stack">
      ${notices.map(n => `
        <div class="banner ${n.level === 'urgente' ? 'danger' : n.level === 'aviso' ? 'warn' : 'info'}">
          ${icon(n.level === 'info' ? 'info' : 'alert', 18)}
          <div class="grow">
            <b>${esc(n.title)}</b>${esc(n.body)}
            ${n.link ? `<div style="margin-top:8px"><a href="${esc(n.link[1])}" target="_blank" rel="noopener" class="btn sm soft">${icon('link', 15)} ${esc(n.link[0])}</a></div>` : ''}
          </div>
        </div>`).join('')}
    </div>` : ''}

  ${nx ? `
    <div class="section-head"><h2>Próxima actividad</h2>
      <a class="link" href="#/agenda">Ver agenda</a></div>
    <button class="card card-btn ${cls(nx.type)}" data-go="#/dia/${nx.date}">
      <div class="lrow">
        <div class="ic tinted">${icon(TYPE[nx.type]?.icon || 'star', 19)}</div>
        <div class="grow">
          <div class="tt">${esc(nx.title)}</div>
          <div class="st">${fmtDate(nx.date, 'weekshort')}${nx.time ? ' · ' + nx.time + ' h' : ''}${nx.subtitle ? ' · ' + esc(nx.subtitle) : ''}</div>
        </div>
        <div class="chev">${icon('chevron', 17)}</div>
      </div>
    </button>` : ''}

  ${(() => {
    const tasks = upcomingTasks(4);
    if (!tasks.length || after) return '';
    return `
    <div class="section-head"><h2>Lo próximo que hay que hacer</h2>
      <a class="link" href="#/listas">Ver todo</a></div>
    <div class="card">
      ${tasks.map(i => {
        const late = i.due < t;
        return `<div class="chk" data-chk="${esc(i.key)}">
          <div class="box">${icon('check', 14)}</div>
          <div class="grow">
            <div class="tt" style="font-size:14px">${esc(i.t)}</div>
            <div class="meta">
              <span class="${late ? 'pill pill-danger' : 'pill pill-muted'}">${icon('clock', 12)}
                ${late ? 'venció el' : 'antes del'} ${fmtDate(i.due, 'short')}</span>
              <span>${esc(i.list)}</span>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  })()}

  <div class="section-head"><h2>Accesos rápidos</h2></div>
  <div class="quick">
    ${[
      ['#/reservas',  'ticket',   'Reservas',  'c-vuelo'],
      ['#/documentos','file',     'Documentos','c-comida'],
      ['#/comer',     'utensils', 'Comer',     'c-visita'],
      ['#/notas',     'edit',     'Notas',     'c-libre'],
      ['#/listas',    'list',     'Listas',    'c-hotel'],
      ['#/info',      'info',     'Info útil', 'c-traslado'],
      ['#/contactos', 'phone',    'Contactos', 'c-tren'],
      ['#/refs',      'copy',     'Localizadores', 'c-otros'],
    ].map(([h, ic, l, c]) => `
      <a class="quick-item ${c}" href="${h}">
        <span class="ic tinted">${icon(ic, 20)}</span><span>${l}</span>
      </a>`).join('')}
  </div>

  <div class="section-head"><h2>Estado del viaje</h2></div>
  <div class="stack">
    ${stay ? card('bed', 'c-hotel', 'Alojamiento actual', stay.name,
        `Hasta el ${fmtDate(stay.checkout, 'short')} · ${esc(stay.city)}`, `#/reservas?t=hoteles`) : ''}
    ${nextFlight ? card('plane', 'c-vuelo', 'Próximo vuelo',
        `${nextFlight.number} · ${nextFlight.from} → ${nextFlight.to}`,
        `${fmtDate(nextFlight.date, 'weekshort')} · ${nextFlight.depart} h`, `#/reservas?t=vuelos`) : ''}
    ${nextTransfer ? card('car', 'c-traslado', 'Próximo traslado', nextTransfer.title,
        `${fmtDate(nextTransfer.date, 'weekshort')} · ${nextTransfer.time} h · ${esc(nextTransfer.company)}`,
        `#/reservas?t=traslados`) : ''}
  </div>

  <div class="section-head"><h2>Itinerario por ciudades</h2>
    <a class="link" href="#/agenda">Día a día</a></div>
  <div class="card">
    ${CITIES.filter(c => c.nights > 0 || c.layover).map((c, i, arr) => `
      <div class="lrow">
        <div class="ic" style="background:${c.layover ? 'var(--surface-2)' : 'var(--green-100)'};color:${c.layover ? 'var(--ink-3)' : 'var(--green-700)'}">
          ${c.layover ? icon('plane', 18) : `<b style="font-size:14px">${i + 1}</b>`}
        </div>
        <div class="grow">
          <div class="tt">${esc(c.name)}</div>
          <div class="st">${c.layover ? 'Escala' : `${c.nights} noche${c.nights > 1 ? 's' : ''}`} · ${fmtDate(c.from, 'short')} — ${fmtDate(c.to, 'short')}</div>
        </div>
      </div>`).join('')}
  </div>

  <div class="section-head"><h2>Progreso de los preparativos</h2>
    <a class="link" href="#/listas">Ver listas</a></div>
  <div class="card card-pad">
    ${LISTS.slice(0, 3).map(l => {
      const p = store.listProgress(l.id);
      return `<div style="margin-bottom:12px">
        <div class="row-between tiny strong"><span>${esc(l.name)}</span><span class="muted">${p.done}/${p.total}</span></div>
        <div class="progress"><i style="width:${p.pct}%"></i></div>
      </div>`;
    }).join('')}
    <a class="btn soft block" href="#/listas">${icon('list', 16)} Todas las listas</a>
  </div>

  <p class="tiny muted center" style="margin-top:26px">
    ${esc(TRIP.agency)} · localizador ${esc(TRIP.locator)}<br>
    Reserva a nombre de ${esc(TRIP.holder.name)}
  </p>`;
}

const card = (ic, c, k, title, sub, href) => `
  <a class="card card-btn ${c}" href="${href}">
    <div class="lrow">
      <div class="ic tinted">${icon(ic, 19)}</div>
      <div class="grow">
        <div class="tiny muted strong" style="text-transform:uppercase;letter-spacing:.06em">${esc(k)}</div>
        <div class="tt" style="margin-top:2px">${esc(title)}</div>
        <div class="st">${sub}</div>
      </div>
      <div class="chev">${icon('chevron', 17)}</div>
    </div>
  </a>`;

/* ==========================================================================
   AGENDA
   ========================================================================== */
export function viewAgenda(params) {
  const mode = params.get('v') || 'lista';
  const t = today();

  return `
  <div class="seg" style="margin-bottom:14px">
    <button class="${mode === 'lista' ? 'on' : ''}" data-go="#/agenda?v=lista">Cronológica</button>
    <button class="${mode === 'cal' ? 'on' : ''}" data-go="#/agenda?v=cal">Calendario</button>
  </div>
  ${mode === 'cal' ? calendarView() : DAYS.map(d => dayBlock(d, t)).join('')}
  <button class="fab" data-add-act aria-label="Añadir al calendario">${icon('plus', 25)}</button>

  <div class="card card-pad mt">
    <div class="row-between">
      <div><b>Descargar toda la agenda</b>
        <div class="tiny muted">Se añade a Google Calendar, Apple Calendario u Outlook</div></div>
    </div>
    <button class="btn soft block mt" data-ics-all>${icon('download', 16)} Añadir al calendario</button>
  </div>`;
}

function dayBlock(d, t) {
  const isToday = d.date === t;
  const n = daysBetween(TRIP.start, d.date) + 1;
  const items = itemsOfDay(d);
  const overlaps = findOverlaps(items);

  return `
  <div class="day-head ${isToday ? 'today' : ''}">
    <div class="num"><b>${n}</b><span>día</span></div>
    <div class="grow">
      <div class="lbl">${fmtDate(d.date, 'weekday')}</div>
      <div class="loc">${esc(d.city)} · ${esc(d.title)}</div>
    </div>
    ${isToday ? '<span class="pill solid" style="background:var(--coral-600)">Hoy</span>' : ''}
  </div>
  ${overlaps.length ? `<div class="banner warn" style="margin-bottom:10px">${icon('alert', 18)}
    <div><b>Horarios que se solapan</b>${overlaps.map(o => esc(o)).join('<br>')}</div></div>` : ''}
  ${store.note('dia:' + d.date) ? `
    <div class="card card-pad" style="margin-bottom:10px;background:var(--sand-100);border-color:var(--sand-300)">
      <div class="row-between" style="align-items:flex-start;gap:10px">
        <div class="grow">
          <div class="tiny muted strong" style="text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px">Nota del día</div>
          <div style="font-size:13.5px;line-height:1.55;white-space:pre-wrap">${esc(store.note('dia:' + d.date))}</div>
        </div>
        <button class="icon-btn" data-nota="dia:${esc(d.date)}"
          data-nota-t="Nota del ${esc(fmtDate(d.date, 'weekshort'))}">${icon('edit', 17)}</button>
      </div>
    </div>` : ''}
  <div class="tl">
    ${items.map(it => timelineItem(it, d)).join('')}
  </div>
  <div class="row" style="gap:8px;margin:2px 0 6px 66px">
    <button class="btn sm ghost" data-add-act="${esc(d.date)}">${icon('plus', 14)} Añadir algo este día</button>
    ${!store.note('dia:' + d.date) ? `<button class="btn sm ghost" data-nota="dia:${esc(d.date)}"
      data-nota-t="Nota del ${esc(fmtDate(d.date, 'weekshort'))}">${icon('edit', 14)} Nota</button>` : ''}
  </div>`;
}

function findOverlaps(items) {
  const out = [];
  const timed = items.filter(i => i.time && i.endTime && i.type !== 'aviso');
  for (let i = 0; i < timed.length; i++)
    for (let j = i + 1; j < timed.length; j++) {
      const a = timed[i], b = timed[j];
      if (mins(a.time) < mins(b.endTime) && mins(b.time) < mins(a.endTime))
        out.push(`«${a.title}» y «${b.title}»`);
    }
  return out;
}

function timelineItem(it, day) {
  const ty = TYPE[it.type] || TYPE.otros;
  const key = `${day.date}|${it.title}`;
  return `
  <div class="tl-item ${cls(it.type)}">
    ${it.time ? `<div class="time">${it.time}${it.endTime ? `<small>${it.endTime}</small>` : ''}</div>` : ''}
    <div class="knob"></div>
    <button class="card card-btn" ${it.userId ? `data-uitem="${esc(it.userId)}"` : `data-item="${esc(key)}"`}>
      <div class="card-pad">
        <div class="row wrap" style="gap:7px;align-items:flex-start">
          <span class="pill tinted">${icon(ty.icon, 13)} ${ty.label}</span>
          ${statusPill(it.status)}
          ${it.userId ? `<span class="pill pill-info">${icon('plus', 12)} añadida</span>` : ''}
        </div>
        <div class="tt" style="font-size:15px;font-weight:700;margin-top:8px;letter-spacing:-.015em">${esc(it.title)}</div>
        ${it.subtitle ? `<div class="tiny muted" style="margin-top:2px">${esc(it.subtitle)}</div>` : ''}
        ${it.where ? `<div class="tiny muted" style="margin-top:5px">${icon('mapPin', 12)} ${esc(it.where)}</div>` : ''}
        ${it.warn ? `<div class="banner warn" style="margin-top:9px;padding:9px 11px;font-size:12px">${icon('alert', 15)}<span>${esc(it.warn)}</span></div>` : ''}
        ${it.price ? `<div class="pill pill-info" style="margin-top:9px">${money(it.price.amount, it.price.currency)} ${esc(it.price.label || '')}</div>` : ''}
      </div>
    </button>
  </div>`;
}

/** Crear o editar una actividad añadida por el grupo */
export function addActivitySheet(id, fechaPorDefecto) {
  const a = id ? store.activity(id) : null;
  const dias = DAYS.map(d => [d.date, `${fmtDate(d.date, 'weekshort')} · ${d.city}`]);
  const tipos = [['visita', 'Visita'], ['comida', 'Comida'], ['excursion', 'Excursión'],
                 ['traslado', 'Traslado'], ['libre', 'Tiempo libre'], ['aviso', 'Recordatorio'],
                 ['vuelo', 'Vuelo'], ['hotel', 'Alojamiento'], ['otros', 'Otros']];

  sheet({
    title: a ? 'Editar' : 'Añadir al calendario',
    sub: a ? 'Actividad añadida por vosotros' : 'Se guarda en este móvil',
    size: 'full',
    body: `
      <div class="field"><label>¿Qué es?</label>
        <input class="input" data-f="title" placeholder="Ej. Masaje en Surin"
          value="${esc(a?.title || '')}" autofocus></div>

      <div class="field"><label>Día</label>
        <select class="select" data-f="date">
          ${dias.map(([v, l]) => `<option value="${v}" ${
            (a?.date || fechaPorDefecto || DAYS[0].date) === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}
        </select></div>

      <div class="grid-2">
        <div class="field"><label>Hora de inicio</label>
          <input class="input" type="time" data-f="time" value="${esc(a?.time || '')}"></div>
        <div class="field"><label>Hora de fin</label>
          <input class="input" type="time" data-f="endTime" value="${esc(a?.endTime || '')}"></div>
      </div>

      <div class="field"><label>Tipo</label>
        <select class="select" data-f="type">
          ${tipos.map(([v, l]) => `<option value="${v}" ${
            (a?.type || 'visita') === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}
        </select></div>

      <div class="field"><label>Sitio (opcional)</label>
        <input class="input" data-f="where" placeholder="Nombre o dirección"
          value="${esc(a?.where || '')}">
        <div class="hint">Con esto se activa el botón de abrir en Google Maps.</div></div>

      <div class="field"><label>Nota</label>
        <textarea class="textarea" data-f="note" placeholder="Precio, teléfono, qué llevar…">${esc(a?.note || '')}</textarea></div>`,
    foot: `${a ? '<button class="btn danger" data-del>Eliminar</button>'
              : '<button class="btn ghost" data-cancel>Cancelar</button>'}
           <button class="btn" data-ok>Guardar</button>`,
    onMount(root, close) {
      root.querySelector('[data-cancel]')?.addEventListener('click', close);
      root.querySelector('[data-del]')?.addEventListener('click', async () => {
        if (await confirmSheet('Eliminar', '¿Quitar esta actividad del calendario?')) {
          store.removeActivity(id);
          close(); toast('Eliminada', 'ok');
          window.dispatchEvent(new CustomEvent('render'));
        }
      });
      root.querySelector('[data-ok]').onclick = () => {
        const v = k => root.querySelector(`[data-f="${k}"]`).value.trim();
        if (!v('title')) return toast('Ponle un nombre', 'err');
        if (v('time') && v('endTime') && v('endTime') < v('time'))
          return toast('La hora de fin es anterior a la de inicio', 'err');
        const data = {
          title: v('title'), date: v('date'), time: v('time'), endTime: v('endTime'),
          type: v('type'), where: v('where'), note: v('note'), status: 'recomendado',
        };
        if (a) store.updateActivity(id, data); else store.addActivity(data);
        close(); toast('Guardado en el calendario', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

/** Ficha de una actividad añadida por el grupo */
export function openUserItem(id) {
  const a = store.activity(id);
  if (!a) return;
  const ty = TYPE[a.type] || TYPE.otros;
  const quien = a.by ? person(a.by) : null;

  sheet({
    title: a.title,
    sub: fmtDate(a.date, 'weekday'),
    body: `
      <div class="row wrap" style="gap:7px;margin-bottom:14px">
        <span class="pill ${cls(a.type)} tinted">${icon(ty.icon, 13)} ${ty.label}</span>
        <span class="pill pill-info">${icon('plus', 12)} añadida por vosotros</span>
        ${a.time ? `<span class="pill">${esc(a.time)}${a.endTime ? ' – ' + esc(a.endTime) : ''}</span>` : ''}
      </div>
      ${a.where ? `<p class="tiny muted" style="margin-bottom:12px">${icon('mapPin', 13)} ${esc(a.where)}</p>` : ''}
      ${a.note ? `<div class="card card-pad" style="margin-bottom:14px;background:var(--sand-100);border-color:var(--sand-300)">
        <div style="font-size:14px;line-height:1.55;white-space:pre-wrap">${esc(a.note)}</div></div>` : ''}
      ${a.where ? quickActions({ address: a.where }) : ''}
      ${quien ? `<div class="stamp">${icon('users', 13)} La añadió ${esc(quien.short)}</div>` : ''}`,
    foot: `<button class="btn ghost" data-edit>${icon('edit', 15)} Editar</button>
           <button class="btn" data-close>Cerrar</button>`,
    onMount(root, close) {
      root.querySelector('[data-close]').onclick = close;
      root.querySelector('[data-edit]').onclick = () => { close(); setTimeout(() => addActivitySheet(id), 320); };
    },
  });
}

/** Ficha completa de un momento del itinerario */
export function openItem(key) {
  const [date, title] = key.split('|');
  const day = DAYS.find(d => d.date === date);
  const it = day?.items.find(i => i.title === title);
  if (!it) return;
  const ty = TYPE[it.type] || TYPE.otros;
  const noteKey = `note:${date}:${title}`;

  const body = `
    <div class="row wrap" style="gap:7px;margin-bottom:14px">
      <span class="pill ${cls(it.type)} tinted">${icon(ty.icon, 13)} ${ty.label}</span>
      ${statusPill(it.status)}
      <span class="pill">${fmtDate(date, 'weekshort')}${it.time ? ' · ' + it.time : ''}</span>
    </div>
    ${it.subtitle ? `<p class="strong" style="font-size:15px;margin-bottom:10px">${esc(it.subtitle)}</p>` : ''}
    ${it.where ? `<p class="tiny muted" style="margin-bottom:12px">${icon('mapPin', 13)} ${esc(it.where)}</p>` : ''}
    ${it.warn ? `<div class="banner warn" style="margin-bottom:14px">${icon('alert', 18)}<span>${esc(it.warn)}</span></div>` : ''}
    ${it.note ? `<div class="prose" style="margin-bottom:14px"><p>${rich(it.note)}</p></div>` : ''}
    ${it.clocks ? `<div class="card card-pad" style="margin-bottom:14px">
      <div class="row-between">
        <div><div class="tiny muted strong">España</div><div class="strong num" style="font-size:17px">${esc(it.clocks.es)}</div></div>
        <div style="color:var(--ink-4)">${icon('arrowRight', 18)}</div>
        <div style="text-align:right"><div class="tiny muted strong">Tailandia</div><div class="strong num" style="font-size:17px;color:var(--green-700)">${esc(it.clocks.th)}</div></div>
      </div></div>` : ''}
    ${it.rows ? `<dl class="kv" style="margin-bottom:14px">
      ${it.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
    ${it.refs ? `<div class="card card-pad" style="margin-bottom:14px">
      ${it.refs.map(([k, v]) => `<div class="row-between" style="padding:4px 0">
        <span class="tiny muted strong">${esc(k)}</span>
        <button class="copyable" data-copy="${esc(v)}">${esc(v)}${icon('copy', 14)}</button></div>`).join('')}
    </div>` : ''}
    ${it.checklist ? `<div class="card" style="margin-bottom:14px">
      ${it.checklist.map(c => `<div class="lrow" style="padding:10px 15px">
        <div class="ic tinted" style="width:26px;height:26px;border-radius:9px">${icon('check', 13)}</div>
        <div class="grow" style="font-size:13.5px;font-weight:600">${esc(c)}</div></div>`).join('')}
    </div>` : ''}
    ${it.ideas ? `<div class="section-head" style="margin-top:0"><h2>Ideas</h2></div>
      <div class="card">${it.ideas.map(i => `<div class="lrow" style="padding:11px 15px">
        <div class="ic tinted" style="width:28px;height:28px;border-radius:9px">${icon('star', 13)}</div>
        <div class="grow" style="font-size:13.5px;font-weight:600">${esc(i)}</div>
        <a class="chev" href="${mapsUrl(i + ' ' + (day.cityId === 'phuket' ? 'Phuket' : 'Bangkok'))}" target="_blank" rel="noopener">${icon('mapPin', 16)}</a>
      </div>`).join('')}</div>` : ''}
    ${it.price ? `<div class="card card-pad" style="margin-top:14px">
      <div class="row-between"><span class="tiny muted strong">Precio</span>
      <span class="strong">${money(it.price.amount, it.price.currency)} <span class="tiny muted">${esc(it.price.label || '')}</span></span></div>
      <div class="row-between mt"><span class="tiny muted strong">Estado</span>${statusPill(it.price.status)}</div>
    </div>` : ''}
    ${it.phones ? `<div class="section-head"><h2>Teléfonos</h2></div>
      <div class="card">${it.phones.map(([l, p]) => phoneRow(l, p)).join('')}</div>` : ''}
    ${it.links ? `<div class="stack mt">${it.links.map(([l, u]) =>
      `<a class="btn ghost block" href="${esc(u)}" target="_blank" rel="noopener">${icon('link', 16)} ${esc(l)}</a>`).join('')}</div>` : ''}
    <div class="mt">${quickActions({ address: it.where, ...(it.maps || {}), mapsHref: it.maps ? mapsUrl(it.maps.q, it.maps.lat, it.maps.lng) : null })}</div>

    <div class="section-head"><h2>Nota del grupo</h2></div>
    <textarea class="textarea" data-note="${esc(noteKey)}" placeholder="Escribe aquí lo que quieras recordar de este momento…">${esc(store.note(noteKey))}</textarea>
  `;

  sheet({
    title: it.title, sub: fmtDate(date, 'weekday'), body,
    foot: `<button class="btn ghost" data-ics>${icon('calendar', 16)} Al calendario</button>
           <button class="btn" data-close>Cerrar</button>`,
    onMount(root, close) {
      root.querySelector('[data-close]').onclick = close;
      root.querySelector('[data-ics]').onclick = () => {
        downloadText(`${it.title.slice(0, 40).replace(/[^\w\s-]/g, '')}.ics`,
          icsEvent({ title: it.title, date, start: it.time || '09:00', end: it.endTime,
            description: [it.subtitle, it.note].filter(Boolean).join('\n'),
            location: it.where || it.maps?.q }), 'text/calendar');
        toast('Evento descargado', 'ok');
      };
      const ta = root.querySelector('[data-note]');
      ta && ta.addEventListener('change', () => store.setNote(noteKey, ta.value));
    },
  });
}

const phoneRow = (label, num) => `
  <div class="lrow" style="padding:11px 15px">
    <div class="ic tinted c-visita">${icon('phone', 16)}</div>
    <div class="grow"><div class="tt" style="font-size:13.5px">${esc(label)}</div>
      <div class="st num">${esc(num)}</div></div>
    <div class="row" style="gap:6px">
      <a class="icon-btn" href="${telUrl(num)}" aria-label="Llamar">${icon('phone', 17)}</a>
      <a class="icon-btn" href="${waUrl(num)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp', 17)}</a>
      <button class="icon-btn" data-copy="${esc(num)}" aria-label="Copiar">${icon('copy', 16)}</button>
    </div>
  </div>`;

const MESES_L = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
  'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const monthTitle = iso => {
  const d = toDate(iso);
  return `${MESES_L[d.getMonth()]} de ${d.getFullYear()}`;
};

function calendarView() {
  const start = toDate(TRIP.start);
  const y = start.getFullYear(), m = start.getMonth();
  const first = new Date(y, m, 1);
  const offset = (first.getDay() + 6) % 7; // lunes primero
  const days = new Date(y, m + 1, 0).getDate();
  const t = today();

  let cells = '';
  for (let i = 0; i < offset; i++) cells += '<div class="cal-day out"></div>';
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const day = DAYS.find(x => x.date === iso);
    const inTrip = iso >= TRIP.start && iso <= TRIP.end;
    const dots = day ? [...new Set(itemsOfDay(day).map(i => i.type))].slice(0, 4)
      .map(ty => `<i class="${cls(ty)}" style="background:var(--cc)"></i>`).join('') : '';
    cells += `<button class="cal-day ${inTrip ? 'in-trip' : ''} ${iso === t ? 'today' : ''}"
      ${day ? `data-go="#/dia/${iso}"` : ''}><b>${d}</b><div class="cal-dots">${dots}</div></button>`;
  }

  return `
  <div class="card card-pad">
    <h3 class="strong" style="font-size:16px;margin-bottom:12px">${monthTitle(TRIP.start)}</h3>
    <div class="cal">
      ${['L','M','X','J','V','S','D'].map(d => `<div class="dow">${d}</div>`).join('')}
      ${cells}
    </div>
  </div>
  <div class="section-head"><h2>Días del viaje</h2></div>
  <div class="card">
    ${DAYS.map(d => `
      <button class="lrow" data-go="#/dia/${d.date}">
        <div class="ic" style="background:var(--green-100);color:var(--green-700)">
          <b style="font-size:13px">${toDate(d.date).getDate()}</b></div>
        <div class="grow"><div class="tt">${esc(d.title)}</div>
          <div class="st">${fmtDate(d.date, 'weekshort')} · ${esc(d.city)} · ${itemsOfDay(d).length} actividades</div></div>
        <div class="chev">${icon('chevron', 17)}</div>
      </button>`).join('')}
  </div>`;
}

/* ==========================================================================
   DÍA SUELTO
   ========================================================================== */
export function viewDay(date) {
  const d = DAYS.find(x => x.date === date);
  if (!d) return emptyState('calendar', 'Día no encontrado', 'Vuelve a la agenda.');
  return dayBlock(d, today());
}

/* ==========================================================================
   RESERVAS  (vuelos · traslados · hoteles · excursiones)
   ========================================================================== */
export function viewBookings(params) {
  const tab = params.get('t') || 'vuelos';
  const tabs = [['vuelos', 'Vuelos', 'plane'], ['traslados', 'Traslados', 'car'],
                ['hoteles', 'Hoteles', 'bed'], ['excursiones', 'Excursiones', 'compass']];
  const bodies = { vuelos: flightsList, traslados: transfersList, hoteles: staysList, excursiones: excursionsList };

  return `
  <div class="chipbar">
    ${tabs.map(([k, l, ic]) => `<button class="chip ${tab === k ? 'on' : ''}" data-go="#/reservas?t=${k}">${icon(ic, 14)} ${l}</button>`).join('')}
  </div>
  ${bodies[tab]()}`;
}

function flightsList() {
  return `
  <div class="banner info" style="margin-bottom:14px">${icon('luggage', 18)}
    <div><b>Equipaje</b>Una maleta facturada de hasta 25 kg por persona. Los bonos de traslado indican 23 kg: conviene confirmarlo con las empresas de transporte.</div></div>
  <div class="stack">
    ${FLIGHTS.map(f => `
      <div class="card c-vuelo">
        <div class="card-pad">
          <div class="row-between">
            <span class="pill tinted">${icon('plane', 13)} ${esc(f.airline)}</span>
            ${statusPill(f.status)}
          </div>
          <div class="row" style="margin-top:14px;align-items:flex-start">
            <div style="flex:1">
              <div style="font-size:26px;font-weight:800;letter-spacing:-.04em">${esc(f.fromCode)}</div>
              <div class="tiny muted strong">${esc(f.from)}${f.fromTerminal ? ' · ' + esc(f.fromTerminal) : ''}</div>
              <div class="strong num" style="font-size:17px;margin-top:6px">${esc(f.depart)}</div>
            </div>
            <div style="flex:none;text-align:center;padding-top:10px;color:var(--ink-4)">
              ${icon('plane', 20)}
              <div class="tiny strong" style="margin-top:2px">${esc(f.number)}</div>
            </div>
            <div style="flex:1;text-align:right">
              <div style="font-size:26px;font-weight:800;letter-spacing:-.04em">${esc(f.toCode)}</div>
              <div class="tiny muted strong">${esc(f.to)}${f.toTerminal ? ' · Terminal ' + esc(f.toTerminal) : ''}</div>
              <div class="strong num" style="font-size:17px;margin-top:6px">${esc(f.arrive)}</div>
            </div>
          </div>
          <div class="divider"></div>
          <dl class="kv">
            <dt>Fecha</dt><dd>${fmtDate(f.date, 'weekday')}</dd>
            <dt>Localizador</dt><dd><button class="copyable" data-copy="${esc(f.locator)}">${esc(f.locator)}${icon('copy', 14)}</button></dd>
            <dt>Equipaje</dt><dd>${esc(f.baggage)}</dd>
            <dt>Hora España</dt><dd class="num">${esc(f.esTime)}</dd>
            <dt>Hora Tailandia</dt><dd class="num">${esc(f.thTime)}</dd>
          </dl>
          ${f.next ? `<div class="pill pill-muted" style="margin-top:10px">${icon('clock', 13)} ${esc(f.next)}</div>` : ''}
          ${notaBtn('vuelo:' + f.id, 'Nota · ' + f.number)}
        </div>
      </div>`).join('')}
  </div>
  <a class="btn block mt" href="${CHECKIN_URL}" target="_blank" rel="noopener">${icon('check', 16)} Hacer el check-in online</a>
  <p class="tiny muted center mt">El check-in se abre 48 horas antes de cada vuelo.</p>`;
}

function transfersList() {
  return `<div class="stack">
    ${TRANSFERS.map(x => `
      <div class="card c-traslado">
        <div class="card-pad">
          <div class="row-between">
            <span class="pill tinted">${icon('car', 13)} ${esc(x.company)}</span>
            ${statusPill(x.status)}
          </div>
          <div class="tt strong" style="font-size:16px;margin-top:10px">${esc(x.title)}</div>
          <div class="tiny muted">${fmtDate(x.date, 'weekday')} · ${esc(x.time)} h</div>
          <div class="divider"></div>
          <dl class="kv">
            <dt>Recogida</dt><dd>${esc(x.from)}</dd>
            <dt>Destino</dt><dd>${esc(x.to)}</dd>
            <dt>Vehículo</dt><dd>${esc(x.vehicle)}</dd>
            <dt>Pasajeros</dt><dd>${x.passengers}</dd>
            ${x.locator ? `<dt>Localizador</dt><dd><button class="copyable" data-copy="${esc(x.locator)}">${esc(x.locator)}${icon('copy', 14)}</button></dd>` : ''}
          </dl>
          ${x.note ? `<div class="banner ${x.status === 'pendiente' ? 'warn' : 'info'}" style="margin-top:12px">
            ${icon(x.status === 'pendiente' ? 'alert' : 'info', 18)}<span>${esc(x.note)}</span></div>` : ''}
          ${x.phones ? `<div class="divider"></div>${x.phones.map(([l, p]) => phoneRow(l, p)).join('')}` : ''}
          <div style="margin-top:12px">${quickActions({ lat: x.lat, lng: x.lng, address: x.from })}</div>
          ${notaBtn('traslado:' + x.id, 'Nota · ' + x.title)}
        </div>
      </div>`).join('')}
  </div>`;
}

function staysList() {
  return `<div class="stack">
    ${STAYS.map(s => `
      <div class="card c-hotel">
        ${banner(s.photo, 170)}
        <div class="card-pad">
          <div class="row-between">
            <span class="pill tinted">${icon('bed', 13)} ${esc(s.city)}</span>
            ${statusPill(s.status)}
          </div>
          <h3 class="strong" style="font-size:17px;margin-top:10px">${esc(s.name)}</h3>
          <div class="tiny" style="color:var(--amber-600);margin-top:2px">${'★'.repeat(s.stars)}</div>
          <div class="row-between" style="margin-top:14px;gap:12px">
            <div style="flex:1"><div class="tiny muted strong">ENTRADA</div>
              <div class="strong">${fmtDate(s.checkin, 'short')}</div>
              <div class="tiny muted num">desde las ${esc(s.checkinTime)}</div></div>
            <div class="pill pill-info">${s.nights} noches</div>
            <div style="flex:1;text-align:right"><div class="tiny muted strong">SALIDA</div>
              <div class="strong">${fmtDate(s.checkout, 'short')}</div>
              <div class="tiny muted num">antes de las ${esc(s.checkoutTime)}</div></div>
          </div>
          <div class="divider"></div>
          <dl class="kv">
            <dt>Habitación</dt><dd>${esc(s.room)}</dd>
            <dt>Régimen</dt><dd>${esc(s.board)}</dd>
            <dt>Dirección</dt><dd>${esc(s.address)}</dd>
            <dt>Teléfono</dt><dd><button class="copyable" data-copy="${esc(s.phone)}">${esc(s.phone)}${icon('copy', 14)}</button></dd>
            ${s.email ? `<dt>Correo</dt><dd><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></dd>` : ''}
            ${s.zip ? `<dt>Código postal</dt><dd class="num">${esc(s.zip)}</dd>` : ''}
            <dt>Noches</dt><dd>${s.nights}</dd>
          </dl>
          ${s.warn ? `<div class="banner warn" style="margin-top:12px">${icon('alert', 18)}<span>${esc(s.warn)}</span></div>` : ''}
          ${s.notes ? `<p class="tiny muted" style="margin-top:12px;line-height:1.5">${esc(s.notes)}</p>` : ''}
          <div class="section-head" style="margin-top:16px"><h2>Servicios</h2></div>
          <div class="row wrap" style="gap:6px">
            ${s.amenities.map(a => `<span class="pill">${esc(a)}</span>`).join('')}
            ${s.board.toLowerCase().includes('desayuno') ? '<span class="pill pill-ok">Desayuno incluido</span>' : ''}
          </div>
          <div style="margin-top:14px">${quickActions({ phone: s.phone, lat: s.lat, lng: s.lng, address: s.address, url: s.website })}</div>
          ${s.links ? `
            <div class="section-head"><h2>Enlaces del hotel</h2></div>
            <div class="stack">
              ${s.links.map(([l, u]) => `<a class="btn ghost block" href="${esc(u)}"
                target="_blank" rel="noopener">${icon('link', 16)} ${esc(l)}</a>`).join('')}
            </div>` : ''}
          ${notaBtn('hotel:' + s.id, 'Nota · ' + s.name)}
        </div>
      </div>`).join('')}
  </div>`;
}

function excursionsList() {
  return `<div class="stack">
    ${EXCURSIONS.map(x => `
      <button class="card card-btn c-excursion" data-exc="${esc(x.id)}">
        ${banner(x.photo, 145)}
        <div class="card-pad">
          <div class="row-between">
            <span class="pill tinted">${icon('compass', 13)} ${esc(x.provider)}</span>
            ${statusPill(x.status)}
          </div>
          <h3 class="strong" style="font-size:16px;margin-top:9px;line-height:1.3">${esc(x.title)}</h3>
          <div class="tiny muted" style="margin-top:4px">
            ${fmtDate(x.date, 'weekshort')}${x.start ? ' · ' + esc(x.start) + ' h' : ''} · ${esc(x.duration)}</div>
          <div class="row wrap" style="gap:6px;margin-top:10px">
            ${x.price != null ? `<span class="pill pill-info">${money(x.price, x.currency)} ${esc(x.priceLabel || '')}</span>` : '<span class="pill pill-warn">Precio por confirmar</span>'}
            ${x.booking ? `<span class="pill">Reserva ${esc(x.booking)}</span>` : ''}
            ${x.price == null ? `<span class="pill">${x.people} personas</span>` : ''}
          </div>
        </div>
      </button>`).join('')}
  </div>`;
}

export function openExcursion(id) {
  const x = EXCURSIONS.find(e => e.id === id);
  if (!x) return;
  const noteKey = `exc:${id}`;
  const list = (title, arr, ic) => arr?.length ? `
    <div class="section-head"><h2>${title}</h2></div>
    <div class="card">${arr.map(i => `<div class="lrow" style="padding:10px 15px">
      <div class="ic tinted c-excursion" style="width:26px;height:26px;border-radius:9px">${icon(ic, 12)}</div>
      <div class="grow" style="font-size:13.5px;font-weight:600">${esc(i)}</div></div>`).join('')}</div>` : '';

  sheet({
    title: x.title, sub: x.provider, size: 'full',
    body: `
      ${x.photo ? `<div style="border-radius:var(--r);overflow:hidden;margin-bottom:14px">${banner(x.photo, 160)}</div>` : ''}
      <div class="row wrap" style="gap:7px;margin-bottom:14px">
        ${statusPill(x.status)}
        ${x.payment ? statusPill(x.payment) : ''}
        <span class="pill">${fmtDate(x.date, 'weekshort')}</span>
        <span class="pill">${esc(x.duration)}</span>
      </div>
      <dl class="kv">
        ${x.start ? `<dt>Horario</dt><dd>${esc(x.start)} — ${esc(x.end)} h</dd>` : ''}
        ${x.meetTime ? `<dt>Encuentro</dt><dd>${esc(x.meetTime)} h</dd>` : ''}
        <dt>Punto de encuentro</dt><dd>${esc(x.meeting)}</dd>
        ${x.address ? `<dt>Dirección</dt><dd>${esc(x.address)}</dd>` : ''}
        <dt>Personas</dt><dd>${x.people} adultos</dd>
        ${x.price != null ? `<dt>Precio</dt><dd>${money(x.price, x.currency)} ${esc(x.priceLabel || '')}</dd>` : ''}
        ${x.booking ? `<dt>Nº de reserva</dt><dd><button class="copyable" data-copy="${esc(x.booking)}">${esc(x.booking)}${icon('copy', 14)}</button></dd>` : ''}
      </dl>
      <div class="section-head"><h2>Quién va</h2></div>
      <div class="card card-pad"><div class="row wrap" style="gap:8px">
        ${PEOPLE.map(p => `<span class="ppick on">${avatar(p.name, p.color, 'sm')} ${esc(p.short)}</span>`).join('')}
      </div></div>
      ${list('Qué incluye', x.includes, 'check')}
      ${list('Qué NO incluye', x.excludes, 'close')}
      ${list('Qué llevar', x.bring, 'luggage')}
      ${x.tips ? `<div class="banner info mt">${icon('info', 18)}<span>${esc(x.tips)}</span></div>` : ''}
      ${x.phone ? `<div class="section-head"><h2>Contacto</h2></div><div class="card">${phoneRow(x.provider, x.phone)}</div>` : ''}
      <div class="mt">${quickActions({ lat: x.lat, lng: x.lng, address: x.meeting, phone: x.phone })}</div>
      <div class="section-head"><h2>Valoración y notas</h2></div>
      <textarea class="textarea" data-note="${esc(noteKey)}" placeholder="Qué tal ha ido, qué recordar para la próxima…">${esc(store.note(noteKey))}</textarea>
    `,
    foot: `<button class="btn ghost" data-ics>${icon('calendar', 16)} Al calendario</button>
           <button class="btn" data-close>Cerrar</button>`,
    onMount(root, close) {
      root.querySelector('[data-close]').onclick = close;
      root.querySelector('[data-ics]').onclick = () => {
        downloadText(`${x.id}.ics`, icsEvent({
          title: x.title, date: x.date, start: x.meetTime || x.start || '09:00', end: x.end,
          description: `${x.provider}\nReserva ${x.booking}`, location: x.meeting,
        }), 'text/calendar');
        toast('Evento descargado', 'ok');
      };
      const ta = root.querySelector('[data-note]');
      ta && ta.addEventListener('change', () => store.setNote(noteKey, ta.value));
    },
  });
}

/* ==========================================================================
   LISTAS
   ========================================================================== */
let openList = null;   // qué lista está desplegada

export function viewLists() {
  if (openList === null) openList = LISTS[0]?.id || '';
  return `
  <div class="chipbar" style="position:sticky;top:calc(var(--topbar-h) + var(--safe-t));z-index:20;
       background:var(--bg);padding-top:6px;margin-top:-6px">
    ${LISTS.map(l => {
      const p = store.listProgress(l.id);
      return `<button class="chip ${openList === l.id ? 'on' : ''}" data-openlist="${esc(l.id)}">
        ${icon(l.icon, 13)} ${esc(l.name)}
        <span style="opacity:.7">${p.done}/${p.total}</span></button>`;
    }).join('')}
  </div>

  <div class="stack-lg" style="margin-top:8px">
    ${LISTS.map(l => {
      const p = store.listProgress(l.id);
      const open = openList === l.id;
      const items = store.itemsOf(l.id);
      return `
      <div id="lista-${esc(l.id)}">
        <button class="card card-btn" data-openlist="${esc(l.id)}" style="margin-bottom:${open ? '10px' : '0'}">
          <div class="lrow" style="padding:14px 16px">
            <div class="ic tinted ${open ? 'c-hotel' : 'c-otros'}">${icon(l.icon, 18)}</div>
            <div class="grow">
              <div class="tt">${esc(l.name)}</div>
              <div class="st">${p.done} de ${p.total} · ${p.pct}%${l.subtitle ? ' · ' + esc(l.subtitle) : ''}</div>
              <div class="progress" style="margin-top:7px"><i style="width:${p.pct}%"></i></div>
            </div>
            <div class="chev" style="transform:rotate(${open ? 180 : 0}deg);transition:transform .2s">
              ${icon('chevronDown', 18)}</div>
          </div>
        </button>

        ${open ? `
        <div class="card">
          ${items.map(i => {
            if (i.h) return `<div class="list-head">${esc(i.h)}</div>`;
            const info = store.checkInfo(i.key);
            const who = info?.by ? person(info.by) : null;
            const late = i.due && i.due < today() && !info?.done;
            return `
            <div class="chk ${info?.done ? 'done' : ''}" data-chk="${esc(i.key)}">
              <div class="box">${icon('check', 14)}</div>
              <div class="grow">
                <div class="tt">${esc(i.t)}</div>
                <div class="meta">
                  ${i.due ? `<span class="${late ? 'pill pill-danger' : 'pill pill-muted'}">${icon('clock', 12)}
                    ${late ? 'venció el' : 'antes del'} ${fmtDate(i.due, 'short')}</span>` : ''}
                  ${who ? `<span>${avatar(who.name, who.color, 'sm')} ${esc(who.short)}</span>` : ''}
                </div>
              </div>
              ${!i.base ? `<button class="icon-btn" data-del-item="${esc(l.id)}|${esc(i.id)}" aria-label="Eliminar">${icon('trash', 16)}</button>` : ''}
            </div>`;
          }).join('')}
          <button class="chk" data-add-item="${esc(l.id)}" style="color:var(--green-700)">
            <div class="box" style="border-style:dashed">${icon('plus', 13)}</div>
            <div class="grow"><div class="tt" style="color:var(--green-700)">Añadir algo a esta lista</div></div>
          </button>
        </div>
        ${notaBtn('lista:' + l.id, 'Nota · ' + l.name)}` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

export function setOpenList(id) { openList = openList === id ? '' : id; }

export function addItemSheet(listId) {
  const l = LISTS.find(x => x.id === listId);
  sheet({
    title: 'Añadir a ' + (l?.name || 'la lista'),
    body: `
      <div class="field"><label>Qué hay que hacer o llevar</label>
        <input class="input" data-f="t" placeholder="Ej. Comprar adaptador de enchufe" autofocus></div>
      <div class="field"><label>Fecha límite (opcional)</label>
        <input class="input" type="date" data-f="due"></div>`,
    foot: `<button class="btn ghost" data-cancel>Cancelar</button>
           <button class="btn" data-ok>Añadir</button>`,
    onMount(root, close) {
      root.querySelector('[data-cancel]').onclick = close;
      root.querySelector('[data-ok]').onclick = () => {
        const t = root.querySelector('[data-f="t"]').value.trim();
        if (!t) return toast('Escribe algo primero', 'err');
        store.addItem(listId, t, root.querySelector('[data-f="due"]').value);
        openList = listId;
        close(); toast('Añadido', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

/* ==========================================================================
   GASTOS
   ========================================================================== */
export function viewExpenses() {
  const list = store.allExpenses();
  const rate = store.rate();
  const toEur = e => e.currency === 'THB' ? e.amount / rate : e.amount;
  const totalEur = list.reduce((s, e) => s + toEur(e), 0);
  const budget = store.budget();
  const pct = budget ? Math.min(100, Math.round(totalEur / budget * 100)) : 0;
  const perPerson = totalEur / PEOPLE.length;

  // Por categorías
  const byCat = {};
  list.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + toEur(e); });
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  // Balances
  const bal = {}; PEOPLE.forEach(p => bal[p.id] = 0);
  list.forEach(e => {
    const eur = toEur(e);
    const split = (e.split && e.split.length) ? e.split : PEOPLE.map(p => p.id);
    const share = eur / split.length;
    if (bal[e.paidBy] !== undefined) bal[e.paidBy] += eur;
    split.forEach(id => { if (bal[id] !== undefined) bal[id] -= share; });
  });

  return `
  <div class="card card-pad">
    <div class="row-between">
      <div><div class="tiny muted strong" style="text-transform:uppercase;letter-spacing:.06em">Gastado hasta ahora</div>
        <div style="font-size:31px;font-weight:800;letter-spacing:-.04em" class="num">${money(totalEur, 'EUR')}</div>
        <div class="tiny muted num">≈ ${money(totalEur * rate, 'THB', 0)}</div></div>
      <button class="icon-btn" data-edit-budget aria-label="Editar presupuesto">${icon('edit', 18)}</button>
    </div>
    <div class="progress" style="height:9px;margin-top:14px"><i style="width:${pct}%;background:${pct > 90 ? 'var(--coral-600)' : 'var(--green-500)'}"></i></div>
    <div class="row-between tiny muted" style="margin-top:6px">
      <span>${pct}% del presupuesto</span><span class="num">${money(budget, 'EUR', 0)}</span>
    </div>
  </div>

  <div class="stats mt">
    <div class="stat"><div class="k">Por persona</div><div class="v">${money(perPerson, 'EUR', 0)}</div></div>
    <div class="stat"><div class="k">Apuntes</div><div class="v">${list.length}</div></div>
    <div class="stat"><div class="k">Tickets</div><div class="v">${photos.cache.size}</div></div>
  </div>

  <div class="section-head"><h2>Conversor</h2></div>
  ${converterCard()}

  <div class="section-head"><h2>Balance del grupo</h2></div>
  <div class="card">
    ${PEOPLE.map(p => {
      const v = bal[p.id];
      const c = Math.abs(v) < 0.5 ? 'zero' : v > 0 ? 'pos' : 'neg';
      const txt = Math.abs(v) < 0.5 ? 'En paz' : v > 0 ? 'le deben' : 'debe';
      return `<div class="balance">
        ${avatar(p.name, p.color)}
        <div><div class="strong" style="font-size:14px">${esc(p.short)}</div>
          <div class="tiny muted">${txt}</div></div>
        <div class="amt ${c}">${money(Math.abs(v), 'EUR', 0)}</div>
      </div>`;
    }).join('')}
  </div>
  <p class="tiny muted center mt">Todo lo del paquete lo adelantó ${esc(person('montse').short)}.</p>

  <div class="section-head"><h2>Por categorías</h2></div>
  <div class="card card-pad"><div class="bars">
    ${cats.map(([k, v]) => {
      const c = EXPENSE_CATS[k] || EXPENSE_CATS.otros;
      return `<div class="bar-row" style="--cc:${c.color}">
        <div class="row-between"><span>${esc(c.label)}</span>
          <span class="amt num">${money(v, 'EUR', 0)}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(v / totalEur * 100)}%"></div></div>
      </div>`;
    }).join('')}
  </div></div>

  <div class="section-head"><h2>Todos los gastos</h2>
    <button class="link" data-export-exp>Exportar CSV</button></div>
  <div class="card">
    ${list.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(e => {
      const c = EXPENSE_CATS[e.cat] || EXPENSE_CATS.otros;
      const p = person(e.paidBy);
      return `<button class="lrow" data-exp="${esc(e.id)}">
        <div class="ic" style="background:${c.color}1a;color:${c.color}">${icon('wallet', 17)}</div>
        <div class="grow"><div class="tt">${esc(e.title)}
          ${photos.tiene(e.id) ? `<span style="color:var(--teal-700);margin-left:5px">${icon('camera', 13)}</span>` : ''}</div>
          <div class="st">${esc(c.label)} · ${fmtDate(e.date, 'short')}${p ? ' · ' + esc(p.short) : ''}</div></div>
        <div class="rt"><div class="strong num" style="font-size:14px;color:var(--ink)">${money(e.amount, e.currency, 0)}</div>
          ${e.currency === 'THB' ? `<div class="tiny muted num">${money(e.amount / rate, 'EUR', 0)}</div>` : ''}</div>
      </button>`;
    }).join('')}
  </div>
  <button class="fab" data-add-exp aria-label="Añadir gasto">${icon('plus', 25)}</button>`;
}

export function addExpenseSheet(existing) {
  const e = existing || { cat: 'comida', currency: 'THB' };
  const sel = (id) => (e.split || PEOPLE.map(p => p.id)).includes(id);
  sheet({
    title: existing ? 'Editar gasto' : 'Nuevo gasto', size: 'full',
    body: `
      <div class="field"><label>Concepto</label>
        <input class="input" data-f="title" value="${esc(e.title || '')}" placeholder="Ej. Cena en Chinatown"></div>
      <div class="grid-2">
        <div class="field"><label>Importe</label>
          <input class="input" type="number" inputmode="decimal" step="0.01" data-f="amount" value="${e.amount ?? ''}"></div>
        <div class="field"><label>Moneda</label>
          <select class="select" data-f="currency">
            <option value="THB" ${e.currency === 'THB' ? 'selected' : ''}>Baht ฿</option>
            <option value="EUR" ${e.currency === 'EUR' ? 'selected' : ''}>Euro €</option>
          </select></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Categoría</label>
          <select class="select" data-f="cat">
            ${Object.entries(EXPENSE_CATS).map(([k, v]) =>
              `<option value="${k}" ${e.cat === k ? 'selected' : ''}>${v.label}</option>`).join('')}
          </select></div>
        <div class="field"><label>Fecha</label>
          <input class="input" type="date" data-f="date" value="${esc(e.date || today())}"></div>
      </div>
      <div class="field"><label>Quién ha pagado</label>
        <div class="people-pick" data-paid>
          ${PEOPLE.map(p => `<button type="button" class="ppick ${e.paidBy === p.id || (!e.paidBy && p.id === (store.me() || 'montse')) ? 'on' : ''}" data-p="${p.id}">
            ${avatar(p.name, p.color, 'sm')} ${esc(p.short)}</button>`).join('')}
        </div></div>
      <div class="field"><label>Se reparte entre</label>
        <div class="people-pick" data-split>
          ${PEOPLE.map(p => `<button type="button" class="ppick ${sel(p.id) ? 'on' : ''}" data-p="${p.id}">
            ${avatar(p.name, p.color, 'sm')} ${esc(p.short)}</button>`).join('')}
        </div>
        <div class="hint">Toca para quitar o poner a cada persona.</div></div>
      <div class="field"><label>Notas</label>
        <textarea class="textarea" data-f="note">${esc(e.note || '')}</textarea></div>

      <div class="section-head" style="margin-top:6px"><h2>Foto del ticket</h2></div>
      <div id="ticket-box"></div>
      <input type="file" accept="image/*" capture="environment" data-ticket hidden>
      <button class="btn ghost block" data-ticket-btn style="margin-top:10px">
        ${icon('camera', 16)} Hacer foto del ticket</button>
      <p class="tiny muted center" style="margin-top:8px">
        La foto se guarda en este móvil, no se sube a internet.</p>`,
    foot: `${existing && !store.isBaseExpense(existing.id)
        ? '<button class="btn danger" data-del>Eliminar</button>' : '<button class="btn ghost" data-cancel>Cancelar</button>'}
      <button class="btn" data-ok>Guardar</button>`,
    onMount(root, close) {
      /* ---- foto del ticket ---- */
      let pendiente = null;      // blob nuevo, aún sin guardar
      let borrar = false;
      const box = root.querySelector('#ticket-box');
      const input = root.querySelector('[data-ticket]');

      const pintaFoto = async () => {
        let blob = pendiente;
        if (!blob && !borrar && existing && photos.tiene(existing.id)) {
          blob = await photos.get(existing.id);
        }
        if (!blob) { box.innerHTML = ''; return; }
        const url = URL.createObjectURL(blob);
        box.innerHTML = `
          <div class="card" style="overflow:hidden">
            <a href="${url}" target="_blank" rel="noopener">
              <img src="${url}" alt="Ticket" style="width:100%;max-height:280px;object-fit:contain;background:var(--surface-2)">
            </a>
            <div class="row-between" style="padding:10px 14px">
              <span class="tiny muted">Toca la foto para verla grande</span>
              <button class="btn sm ghost" style="color:var(--red-600)" data-quita>
                ${icon('trash', 14)} Quitar</button>
            </div>
          </div>`;
        box.querySelector('[data-quita]').onclick = () => {
          pendiente = null; borrar = true; pintaFoto();
        };
      };
      pintaFoto();

      root.querySelector('[data-ticket-btn]').onclick = () => input.click();
      input.onchange = async () => {
        const f = input.files && input.files[0];
        if (!f) return;
        try {
          pendiente = await comprimir(f);
          borrar = false;
          await pintaFoto();
        } catch (err) {
          toast('No se ha podido usar esa foto', 'err');
        }
        input.value = '';
      };

      root.querySelector('[data-cancel]')?.addEventListener('click', close);
      root.querySelector('[data-paid]').addEventListener('click', ev => {
        const b = ev.target.closest('[data-p]'); if (!b) return;
        root.querySelectorAll('[data-paid] .ppick').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
      });
      root.querySelector('[data-split]').addEventListener('click', ev => {
        const b = ev.target.closest('[data-p]'); if (!b) return;
        b.classList.toggle('on');
      });
      root.querySelector('[data-del]')?.addEventListener('click', async () => {
        if (await confirmSheet('Eliminar gasto', '¿Seguro que quieres eliminar este gasto?')) {
          store.removeExpense(existing.id);
          try { await photos.remove(existing.id); } catch {}
          close(); toast('Gasto eliminado', 'ok');
          window.dispatchEvent(new CustomEvent('render'));
        }
      });
      root.querySelector('[data-ok]').addEventListener('click', () => {
        const v = k => root.querySelector(`[data-f="${k}"]`).value;
        const title = v('title').trim();
        const amount = parseFloat(v('amount'));
        if (!title) return toast('Falta el concepto', 'err');
        if (!(amount > 0)) return toast('Falta el importe', 'err');
        const paidBy = root.querySelector('[data-paid] .ppick.on')?.dataset.p || 'montse';
        const split = [...root.querySelectorAll('[data-split] .ppick.on')].map(x => x.dataset.p);
        if (!split.length) return toast('Elige al menos una persona para repartir', 'err');
        const data = { title, amount, currency: v('currency'), cat: v('cat'),
                       date: v('date'), paidBy, split, status: 'pagado', note: v('note').trim() };
        let id;
        if (existing && !store.isBaseExpense(existing.id)) {
          store.updateExpense(existing.id, data); id = existing.id;
        } else if (existing) {
          id = existing.id;               // gasto del paquete: solo se le añade la foto
        } else {
          id = store.addExpense(data);
        }

        const guardaFoto = pendiente ? photos.save(id, pendiente)
          : borrar ? photos.remove(id)
          : Promise.resolve();

        guardaFoto
          .catch(() => toast('La foto no se ha podido guardar', 'err'))
          .finally(() => {
            close(); toast('Gasto guardado', 'ok');
            window.dispatchEvent(new CustomEvent('render'));
          });
      });
    },
  });
}

export function exportExpenses() {
  const rate = store.rate();
  const rows = [['Fecha', 'Concepto', 'Categoría', 'Importe', 'Moneda', 'Importe €', 'Pagado por', 'Repartido entre', 'Notas']];
  store.allExpenses().forEach(e => {
    const eur = e.currency === 'THB' ? e.amount / rate : e.amount;
    rows.push([e.date, e.title, (EXPENSE_CATS[e.cat] || {}).label || e.cat,
      e.amount.toFixed(2), e.currency, eur.toFixed(2),
      person(e.paidBy)?.short || '',
      (e.split || []).map(id => person(id)?.short || id).join(' / '), e.note || '']);
  });
  const csv = '﻿' + rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  downloadText('gastos-tailandia.csv', csv, 'text/csv;charset=utf-8');
  toast('CSV descargado', 'ok');
}

/* ==========================================================================
   INFORMACIÓN ÚTIL
   ========================================================================== */
export function viewInfo() {
  return `
  ${converterCard()}

  <div class="stack-lg" style="margin-top:20px">
    ${INFO.map(s => `
      <div class="card">
        <button class="lrow" data-acc="${esc(s.id)}" style="padding:15px 16px">
          <div class="ic tinted c-visita">${icon(s.icon, 18)}</div>
          <div class="grow"><div class="tt">${esc(s.title)}</div></div>
          <div class="chev" data-arrow>${icon('chevronDown', 18)}</div>
        </button>
        <div class="acc-body" id="acc-${esc(s.id)}" hidden>
          <div style="padding:0 16px 16px">
            ${s.body ? `<div class="prose"><p>${rich(s.body)}</p></div>` : ''}
            ${s.phrases ? `<div class="card" style="margin-top:12px">
              ${s.phrases.map(([es, th, ph]) => `<div class="lrow" style="padding:11px 14px">
                <div class="grow"><div class="tiny muted">${esc(es)}</div>
                  <div class="strong" style="font-size:14.5px">${esc(th)}</div>
                  <div class="tiny" style="color:var(--teal-700)">se dice: ${esc(ph)}</div></div>
                <button class="icon-btn" data-copy="${esc(th)}">${icon('copy', 16)}</button>
              </div>`).join('')}</div>` : ''}
            ${s.calls ? `<div class="card" style="margin-top:12px">
              ${s.calls.map(([l, n]) => phoneRow(l, n)).join('')}</div>` : ''}
            ${s.actions ? `<div class="stack" style="margin-top:12px">
              ${s.actions.map(([l, h]) => `<a class="btn soft block" href="${esc(h)}">${icon('phone', 16)} ${esc(l)}</a>`).join('')}</div>` : ''}
            ${s.links ? `<div class="stack" style="margin-top:10px">
              ${s.links.map(([l, h]) => `<a class="btn ghost block" href="${esc(h)}" target="_blank" rel="noopener">${icon('link', 16)} ${esc(l)}</a>`).join('')}</div>` : ''}
            ${notaBtn('info:' + s.id, 'Nota · ' + s.title)}
          </div>
        </div>
      </div>`).join('')}
  </div>`;
}

/* ==========================================================================
   CONTACTOS Y LOCALIZADORES
   ========================================================================== */
export function viewContacts() {
  return `
  <div class="banner danger" style="margin-bottom:16px">${icon('alert', 18)}
    <div><b>En caso de emergencia en Tailandia</b>
      Policía turística 1155 · Emergencias médicas 1669 · Seguro +34 911 976 256</div></div>
  ${notaBlock('contactos', 'Otros teléfonos', 'Apunta aquí cualquier teléfono nuevo: el conductor, el guía, el restaurante que habéis reservado…')}

  ${CONTACTS.map(g => `
    <div class="section-head"><h2>${esc(g.group)}</h2></div>
    <div class="card">
      ${g.items.map(c => `
        <div class="lrow">
          <div class="ic tinted ${g.group.includes('Emergencias') ? 'c-excursion' : 'c-visita'}">${icon('phone', 17)}</div>
          <div class="grow"><div class="tt" style="font-size:13.5px">${esc(c.name)}</div>
            <div class="st num">${esc(c.phone)}</div>
            ${c.email ? `<div class="tiny"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>` : ''}</div>
          <div class="row" style="gap:5px">
            <a class="icon-btn" href="${telUrl(c.phone)}" aria-label="Llamar">${icon('phone', 17)}</a>
            ${c.phone.startsWith('+') ? `<a class="icon-btn" href="${waUrl(c.phone)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp', 17)}</a>` : ''}
            <button class="icon-btn" data-copy="${esc(c.phone)}" aria-label="Copiar">${icon('copy', 16)}</button>
          </div>
        </div>`).join('')}
    </div>`).join('')}`;
}

export function viewRefs() {
  return `
  <p class="tiny muted" style="margin-bottom:14px">Toca cualquier número para copiarlo.</p>
  <div class="card">
    ${REFS.map(([k, v]) => `
      <button class="lrow" data-copy="${esc(v)}">
        <div class="ic tinted c-libre">${icon('ticket', 17)}</div>
        <div class="grow"><div class="tt" style="font-size:13.5px">${esc(k)}</div>
          <div class="st num strong" style="font-size:14px;color:var(--ink);letter-spacing:.03em">${esc(v)}</div></div>
        <div class="chev">${icon('copy', 17)}</div>
      </button>`).join('')}
  </div>
  ${notaBlock('refs', 'Otras referencias', 'Números de reserva nuevos, códigos, lo que sea.')}

  <div class="section-head"><h2>Datos de la reserva</h2></div>
  <div class="card card-pad">
    <dl class="kv">
      <dt>Agencia</dt><dd>${esc(TRIP.agency)}</dd>
      <dt>Titular</dt><dd>${esc(TRIP.holder.name)}</dd>
      <dt>Teléfono</dt><dd>${esc(TRIP.holder.phone)}</dd>
      <dt>Correo</dt><dd>${esc(TRIP.holder.email)}</dd>
      <dt>Viajeros</dt><dd>${PEOPLE.map(p => esc(p.name)).join('<br>')}</dd>
    </dl>
  </div>`;
}

/* ==========================================================================
   DOCUMENTOS
   ========================================================================== */
export function viewDocs() {
  const grupos = [...new Set(DOCS.map(d => d.group))];
  const conEnlace = DOCS.filter(d => d.url || store.note('doc:' + d.id)).length;

  const carpeta = DOCS_FOLDER.url || store.note('docs:folder');
  const carpetaCompartida = !!DOCS_FOLDER.url;

  return `
  ${carpeta ? `
    <a class="card card-btn" href="${esc(carpeta)}" target="_blank" rel="noopener"
       style="background:linear-gradient(120deg,var(--green-800),var(--teal-700));color:#fff;border:0">
      <div class="lrow" style="padding:18px 16px">
        <div class="ic" style="background:rgba(255,255,255,.18);color:#fff">${icon('file', 20)}</div>
        <div class="grow">
          <div class="tt" style="color:#fff">${esc(DOCS_FOLDER.label)}</div>
          <div class="st" style="color:rgba(255,255,255,.8)">
            ${carpetaCompartida ? 'Compartida con todo el grupo' : 'Guardada solo en este móvil'}</div>
        </div>
        <div class="chev" style="color:rgba(255,255,255,.9)">${icon('link', 18)}</div>
      </div>
    </a>` : `
    <button class="card card-btn" data-folder style="border:1.5px dashed var(--line)">
      <div class="lrow" style="padding:18px 16px">
        <div class="ic tinted c-hotel">${icon('plus', 20)}</div>
        <div class="grow">
          <div class="tt">Añadir la carpeta de Drive</div>
          <div class="st">Lo más rápido: una carpeta con todo dentro</div>
        </div>
        <div class="chev">${icon('chevron', 17)}</div>
      </div>
    </button>`}

  ${passportCard()}

  <div class="card card-pad" style="margin-top:12px">
    <div class="row-between">
      <div class="grow">
        <b style="font-size:14px">Fichas por documento</b>
        <div class="tiny muted" style="margin-top:3px">
          ${conEnlace} de ${DOCS.length} tienen enlace guardado</div>
      </div>
      <button class="btn sm ghost" data-folder>${icon('edit', 14)} Carpeta</button>
    </div>
    <div class="progress" style="margin-top:12px">
      <i style="width:${Math.round(conEnlace / DOCS.length * 100)}%"></i></div>
  </div>

  <div class="banner info" style="margin-top:14px">${icon('info', 18)}
    <div><b>Dónde van los archivos</b>Los documentos no se guardan dentro de la app:
    se suben a Google Drive (o Dropbox) y aquí se guarda el enlace. Así pesan poco y
    los abre cualquiera desde el móvil.</div></div>

  ${grupos.map(g => `
    <div class="section-head"><h2>${esc(g)}</h2></div>
    <div class="card">
      ${DOCS.filter(d => d.group === g).map(d => {
        const propio = store.note('doc:' + d.id);
        const tiene = d.url || propio;
        return `
        <button class="lrow" data-doc="${esc(d.id)}">
          <div class="ic tinted ${tiene ? 'c-hotel' : 'c-otros'}">${icon(d.icon, 18)}</div>
          <div class="grow">
            <div class="tt">${esc(d.title)}</div>
            <div class="st">${tiene ? 'Enlace guardado' : 'Sin enlace todavía'}${d.sensitive ? ' · información sensible' : ''}</div>
          </div>
          ${tiene ? `<span class="pill pill-ok">${icon('check', 12)}</span>` : ''}
          <div class="chev">${icon('chevron', 17)}</div>
        </button>`;
      }).join('')}
    </div>`).join('')}

  <div class="banner warn mt">${icon('lock', 18)}
    <div><b>Con los pasaportes, cuidado</b>No subáis la foto del pasaporte a ningún sitio
    público. Guardadla en una carpeta privada de Drive compartida solo con los cuatro, o
    llevadla en el móvil sin más.</div></div>`;
}

export function openFolder() {
  const propio = store.note('docs:folder');
  sheet({
    title: 'Carpeta de documentos',
    sub: 'Una sola carpeta con todo dentro',
    body: `
      <div class="prose" style="margin-bottom:16px"><p>
        <b>Cómo hacerlo:</b><br>
        1. Entra en Google Drive y crea una carpeta, por ejemplo «Tailandia 2026».<br>
        2. Mete dentro los billetes, los bonos, las pólizas y las copias.<br>
        3. Pulsa <b>Compartir</b> y añade los correos de los cuatro. No la pongas en
        «cualquiera con el enlace» si dentro hay copias de pasaportes.<br>
        4. Copia el enlace de la carpeta y pégalo aquí.
      </p></div>
      <div class="field">
        <label>Enlace de la carpeta</label>
        <input class="input" data-folderlink placeholder="https://drive.google.com/…" value="${esc(propio)}">
        <div class="hint">Se guarda en este móvil. Para que lo vean los cuatro sin
          tener que pegarlo cada uno, ponlo en <b>js/data.js</b> → <b>DOCS_FOLDER</b>.</div>
      </div>`,
    foot: `<button class="btn ghost" data-close>Cerrar</button>
           <button class="btn" data-save>Guardar</button>`,
    onMount(root, close) {
      root.querySelector('[data-close]').onclick = close;
      root.querySelector('[data-save]').onclick = () => {
        const v = root.querySelector('[data-folderlink]').value.trim();
        if (v && !/^https?:\/\//i.test(v)) return toast('El enlace debe empezar por https://', 'err');
        store.setNote('docs:folder', v);
        close();
        toast(v ? 'Carpeta guardada' : 'Carpeta borrada', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

/* --------------------------------------------------------------- Pasaportes */

/** Tailandia pide 6 meses de validez desde la entrada */
const LIMITE_PASAPORTE = addDays(TRIP.start, 185);

function passportOk(p) {
  return p.passportExpiry && p.passportExpiry >= LIMITE_PASAPORTE;
}

export function passportCard() {
  const todos = PEOPLE.every(passportOk);
  return `
  <div class="section-head"><h2>Pasaportes</h2></div>
  <div class="card">
    <div class="banner ${todos ? 'info' : 'danger'}" style="border-radius:0;margin:0">
      ${icon(todos ? 'check' : 'alert', 18)}
      <div><b>${todos ? 'Los cuatro sirven para este viaje' : 'Hay algún pasaporte que no llega'}</b>
        Tailandia pide seis meses de validez desde la entrada, es decir, hasta
        el ${fmtDate(LIMITE_PASAPORTE, 'long')}.</div>
    </div>
    ${PEOPLE.map(p => {
      const ok = passportOk(p);
      const num = store.note('pasaporte:' + p.id);
      return `<button class="lrow" data-pasaporte="${p.id}">
        ${avatar(p.name, p.color)}
        <div class="grow" style="margin-left:2px">
          <div class="tt" style="font-size:13.5px">${esc(p.short)}</div>
          <div class="st">Caduca el ${fmtDate(p.passportExpiry, 'medium')}${num ? ' · nº guardado' : ''}</div>
        </div>
        <span class="pill ${ok ? 'pill-ok' : 'pill-danger'}">${ok ? 'Válido' : 'Revisar'}</span>
        <div class="chev">${icon('chevron', 17)}</div>
      </button>`;
    }).join('')}
  </div>`;
}

export function openPassport(id) {
  const p = person(id);
  if (!p) return;
  const key = 'pasaporte:' + id;
  const ok = passportOk(p);

  sheet({
    title: 'Pasaporte de ' + p.short,
    sub: p.name,
    body: `
      <div class="banner ${ok ? 'info' : 'danger'}" style="margin-bottom:14px">
        ${icon(ok ? 'check' : 'alert', 18)}
        <div><b>${ok ? 'Sirve para este viaje' : 'No llega a los seis meses'}</b>
          Caduca el ${fmtDate(p.passportExpiry, 'long')}. Para entrar en Tailandia
          el ${fmtDate(TRIP.start, 'short')} tiene que valer al menos hasta el
          ${fmtDate(LIMITE_PASAPORTE, 'long')}.</div>
      </div>

      <div class="field">
        <label>Nº de pasaporte</label>
        <input class="input" data-num placeholder="Ej. PAX000000" value="${esc(store.note(key))}"
          autocapitalize="characters" spellcheck="false">
        <div class="hint">Va bien tenerlo a mano para rellenar la TDAC.</div>
      </div>

      <div class="banner warn">${icon('lock', 18)}
        <div><b>Esto no sale de tu móvil</b>El número se guarda solo aquí, en este
        teléfono. No se sube a internet, no viaja al repositorio y los demás no lo ven.
        Aun así, no lo pongas en un móvil que no sea tuyo.</div></div>`,
    foot: `<button class="btn ghost" data-borra>Borrar</button>
           <button class="btn" data-ok>Guardar</button>`,
    onMount(root, close) {
      root.querySelector('[data-borra]').onclick = () => {
        store.setNote(key, '');
        close(); toast('Borrado', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
      root.querySelector('[data-ok]').onclick = () => {
        store.setNote(key, root.querySelector('[data-num]').value.trim().toUpperCase());
        close(); toast('Guardado en este móvil', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

export function openDoc(id) {
  const d = DOCS.find(x => x.id === id);
  if (!d) return;
  const key = 'doc:' + id;

  sheet({
    title: d.title, sub: d.group,
    body: `
      ${d.sensitive ? `<div class="banner warn" style="margin-bottom:14px">${icon('lock', 18)}
        <span>Información sensible: compártela solo con el grupo.</span></div>` : ''}
      ${d.detail ? `<div class="prose" style="margin-bottom:14px"><p>${rich(d.detail)}</p></div>` : ''}
      ${d.refs ? `<div class="card card-pad" style="margin-bottom:14px">
        ${d.refs.map(([k, v]) => `<div class="row-between" style="padding:4px 0">
          <span class="tiny muted strong">${esc(k)}</span>
          <button class="copyable" data-copy="${esc(v)}">${esc(v)}${icon('copy', 14)}</button></div>`).join('')}
      </div>` : ''}
      ${d.url ? `<a class="btn block" href="${esc(d.url)}" target="_blank" rel="noopener">
        ${icon('download', 16)} Abrir el documento</a>
        <p class="tiny muted center" style="margin-top:8px">Enlace compartido con todo el grupo</p>` : ''}
      ${d.links ? `<div class="stack mt">${d.links.map(([l, u]) =>
        `<a class="btn ghost block" href="${esc(u)}" target="_blank" rel="noopener">${icon('link', 16)} ${esc(l)}</a>`).join('')}</div>` : ''}
      ${d.phones ? `<div class="section-head"><h2>Teléfonos</h2></div>
        <div class="card">${d.phones.map(([l, n]) => phoneRow(l, n)).join('')}</div>` : ''}

      <div class="section-head"><h2>Tu enlace</h2></div>
      <div class="field">
        <label>Pega aquí el enlace de Drive, Dropbox o el que sea</label>
        <input class="input" data-doclink placeholder="https://…" value="${esc(store.note(key))}">
        <div class="hint">Se guarda solo en este móvil.</div>
      </div>
      <div id="doc-open"></div>
      ${notaBlock('docnota:' + id, 'Nota', 'Dónde está el original, qué falta, a quién se lo pediste…')}`,
    foot: `<button class="btn ghost" data-close>Cerrar</button>
           <button class="btn" data-save>Guardar enlace</button>`,
    onMount(root, close) {
      const inp = root.querySelector('[data-doclink]');
      const box = root.querySelector('#doc-open');
      const pinta = () => {
        const v = store.note(key);
        box.innerHTML = v
          ? `<a class="btn soft block" href="${esc(v)}" target="_blank" rel="noopener">
               ${icon('link', 16)} Abrir mi enlace</a>`
          : '';
      };
      pinta();
      root.querySelector('[data-close]').onclick = close;
      root.querySelector('[data-save]').onclick = () => {
        const v = inp.value.trim();
        if (v && !/^https?:\/\//i.test(v)) return toast('El enlace debe empezar por https://', 'err');
        store.setNote(key, v);
        pinta();
        toast(v ? 'Enlace guardado' : 'Enlace borrado', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

/* ==========================================================================
   COMER Y COMPRAR
   ========================================================================== */
export function viewFood(params) {
  const ciudad = params.get('c') || FOOD[0].city;
  const f = FOOD.find(x => x.city === ciudad) || FOOD[0];
  const rate = store.rate();

  const bloque = (titulo, ico, items) => `
    <div class="section-head"><h2>${titulo}</h2></div>
    <div class="stack">
      ${items.map(i => `
        <div class="card card-pad">
          <div class="row-between" style="align-items:flex-start;gap:10px">
            <div class="grow">
              <div class="row" style="gap:8px;margin-bottom:6px">
                <span class="pill tinted c-comida">${icon(ico, 13)} ${esc(i.kind)}</span>
              </div>
              <div class="strong" style="font-size:15px;letter-spacing:-.015em">${esc(i.name)}</div>
              <div class="tiny" style="color:var(--green-700);font-weight:800;margin-top:4px">${esc(i.price)}</div>
              ${i.note ? `<div class="tiny muted" style="margin-top:6px;line-height:1.5">${esc(i.note)}</div>` : ''}
            </div>
            <div class="row" style="gap:4px;flex:none">
              <button class="icon-btn" data-nota="comer:${esc(i.name)}"
                data-nota-t="Nota · ${esc(i.name)}"
                aria-label="Nota">${icon('edit', 18)}</button>
              <a class="icon-btn" href="${mapsUrl(i.q || i.name)}" target="_blank" rel="noopener"
                 aria-label="Ver en el mapa">${icon('mapPin', 19)}</a>
            </div>
          </div>
          ${store.note('comer:' + i.name) ? `<div class="card card-pad" style="margin-top:10px;background:var(--sand-100);border-color:var(--sand-300)">
            <div style="font-size:13px;line-height:1.5;white-space:pre-wrap">${esc(store.note('comer:' + i.name))}</div></div>` : ''}
        </div>`).join('')}
    </div>`;

  return `
  <div class="seg" style="margin-bottom:14px">
    ${FOOD.map(x => `<button class="${x.city === ciudad ? 'on' : ''}" data-go="#/comer?c=${encodeURIComponent(x.city)}">${esc(x.city)}</button>`).join('')}
  </div>

  <div class="card card-pad c-comida">
    <div class="row" style="gap:10px;align-items:flex-start">
      <div class="ic tinted" style="width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex:none">
        ${icon('utensils', 19)}</div>
      <div class="grow">
        <div class="strong" style="font-size:14px">${esc(f.hotel)}</div>
        <div class="tiny muted" style="margin-top:4px;line-height:1.5">${esc(f.intro)}</div>
      </div>
    </div>
  </div>

  ${bloque('Dónde comer', 'utensils', f.eat)}
  ${bloque('Dónde comprar', 'wallet', f.shop)}

  ${notaBlock('comerciudad:' + f.city, 'Notas de ' + f.city,
    'Sitios que os han gustado, precios reales, lo que hay que repetir…')}

  <div class="section-head"><h2>Precios de referencia</h2></div>
  <div class="stack">
    ${PRICES.map(p => `
      <div class="card card-pad">
        <b style="font-size:14px">${esc(p.title)}</b>
        <div class="divider"></div>
        ${p.rows.map(([k, v]) => `<div class="row-between" style="padding:6px 0;font-size:13.5px">
          <span class="muted">${esc(k)}</span>
          <span class="strong" style="text-align:right">${esc(v)}</span></div>`).join('')}
      </div>`).join('')}
  </div>

  <div class="banner info mt">${icon('swap', 18)}
    <div><b>En bahts</b>Hoy 1 € son unos ${rate.toLocaleString('es-ES', { maximumFractionDigits: 1 })} ฿.
    Una comida local de 5 € son unos ${Math.round(5 * rate)} ฿.
    <a href="#/info" style="font-weight:700">Conversor completo</a></div></div>`;
}

/* ==========================================================================
   NOTAS
   ========================================================================== */

/** Convierte la clave interna de una nota en algo legible */
function noteLabel(key) {
  const [tipo, ...resto] = key.split(':');
  const r = resto.join(':');
  if (key === 'contactos') return { ic: 'phone', t: 'Otros teléfonos', go: '#/contactos' };
  if (key === 'refs') return { ic: 'copy', t: 'Otras referencias', go: '#/refs' };
  switch (tipo) {
    case 'dia':      return { ic: 'calendar', t: 'Día ' + fmtDate(r, 'weekshort'), go: '#/dia/' + r };
    case 'vuelo':    return { ic: 'plane', t: 'Vuelo ' + (FLIGHTS.find(f => f.id === r)?.number || ''), go: '#/reservas?t=vuelos' };
    case 'traslado': return { ic: 'car', t: TRANSFERS.find(x => x.id === r)?.title || 'Traslado', go: '#/reservas?t=traslados' };
    case 'hotel':    return { ic: 'bed', t: STAYS.find(x => x.id === r)?.name || 'Alojamiento', go: '#/reservas?t=hoteles' };
    case 'exc':      return { ic: 'compass', t: EXCURSIONS.find(x => x.id === r)?.title || 'Excursión', go: '#/reservas?t=excursiones' };
    case 'docnota':  return { ic: 'file', t: DOCS.find(x => x.id === r)?.title || 'Documento', go: '#/documentos' };
    case 'doc':      return { ic: 'link', t: 'Enlace · ' + (DOCS.find(x => x.id === r)?.title || ''), go: '#/documentos' };
    case 'docs':     return { ic: 'file', t: 'Carpeta de documentos', go: '#/documentos' };
    case 'comer':    return { ic: 'utensils', t: r, go: '#/comer' };
    case 'comerciudad': return { ic: 'utensils', t: 'Comer y comprar · ' + r, go: '#/comer?c=' + encodeURIComponent(r) };
    case 'info':     return { ic: 'info', t: INFO.find(x => x.id === r)?.title || 'Información útil', go: '#/info' };
    case 'lista':    return { ic: 'list', t: LISTS.find(x => x.id === r)?.name || 'Lista', go: '#/listas' };
    case 'contactos':return { ic: 'phone', t: 'Otros teléfonos', go: '#/contactos' };
    case 'refs':     return { ic: 'copy', t: 'Otras referencias', go: '#/refs' };
    case 'note': {
      const [fecha, ...tit] = r.split(':');
      return { ic: 'star', t: tit.join(':') || 'Actividad', go: '#/dia/' + fecha, sub: fmtDate(fecha, 'weekshort') };
    }
    default: return { ic: 'edit', t: key, go: '' };
  }
}

export function viewNotes() {
  const libres = store.freeNotes();
  const enFichas = Object.entries(store.get().notes)
    .filter(([k, v]) => v && v.trim()
      && !k.startsWith('doc:')          // enlaces, no notas
      && !k.startsWith('pasaporte:')    // datos sensibles, no se listan aquí
      && k !== 'docs:folder');

  return `
  <button class="btn block" data-add-note>${icon('plus', 16)} Escribir una nota</button>

  ${libres.length ? `
    <div class="section-head"><h2>Mis notas</h2></div>
    <div class="stack">
      ${libres.map(n => {
        const quien = n.by ? person(n.by) : null;
        return `
        <button class="card card-btn" data-note-id="${esc(n.id)}"
          style="background:var(--sand-100);border-color:var(--sand-300)">
          <div class="card-pad">
            ${n.title ? `<div class="strong" style="font-size:15px;margin-bottom:5px">${esc(n.title)}</div>` : ''}
            <div style="font-size:13.5px;line-height:1.55;white-space:pre-wrap;color:var(--ink-2)">${esc(n.body)}</div>
            <div class="stamp">${quien ? avatar(quien.name, quien.color, 'sm') + ' ' + esc(quien.short) + ' · ' : ''}
              ${fmtDate(n.at.slice(0, 10), 'short')}</div>
          </div>
        </button>`;
      }).join('')}
    </div>` : ''}

  ${enFichas.length ? `
    <div class="section-head"><h2>Notas puestas en fichas</h2></div>
    <div class="card">
      ${enFichas.map(([k, v]) => {
        const l = noteLabel(k);
        return `<button class="lrow" data-nota="${esc(k)}" data-nota-t="${esc(l.t)}">
          <div class="ic tinted c-libre">${icon(l.ic, 17)}</div>
          <div class="grow">
            <div class="tt" style="font-size:13.5px">${esc(l.t)}</div>
            <div class="st" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(v)}</div>
          </div>
          <div class="chev">${icon('chevron', 17)}</div>
        </button>`;
      }).join('')}
    </div>` : ''}

  ${!libres.length && !enFichas.length ? emptyState('edit', 'Todavía no hay notas',
    'Puedes escribir notas sueltas aquí, y también dentro de cada día, vuelo, hotel, excursión o documento. Todas acaban apareciendo en esta pantalla.') : ''}

  <div class="banner info mt">${icon('info', 18)}
    <div><b>Dónde se guardan</b>Las notas se guardan en este móvil. Para que las vea
    todo el grupo, pásalas por el chat o pídemelas y las dejo fijas en la app.</div></div>`;
}

export function openFreeNote(id) {
  const n = id ? store.freeNote(id) : null;
  sheet({
    title: n ? 'Nota' : 'Nueva nota',
    size: 'full',
    body: `
      <div class="field"><label>Título (opcional)</label>
        <input class="input" data-f="title" placeholder="Ej. Ideas para el día libre"
          value="${esc(n?.title || '')}"></div>
      <div class="field"><label>Nota</label>
        <textarea class="textarea" style="min-height:220px" data-f="body"
          placeholder="Escribe lo que quieras…" ${n ? '' : 'autofocus'}>${esc(n?.body || '')}</textarea></div>`,
    foot: `${n ? '<button class="btn danger" data-del>Eliminar</button>'
              : '<button class="btn ghost" data-cancel>Cancelar</button>'}
           <button class="btn" data-ok>Guardar</button>`,
    onMount(root, close) {
      root.querySelector('[data-cancel]')?.addEventListener('click', close);
      root.querySelector('[data-del]')?.addEventListener('click', async () => {
        if (await confirmSheet('Eliminar nota', '¿Seguro que quieres borrarla?')) {
          store.removeFreeNote(id);
          close(); toast('Nota eliminada', 'ok');
          window.dispatchEvent(new CustomEvent('render'));
        }
      });
      root.querySelector('[data-ok]').onclick = () => {
        const t = root.querySelector('[data-f="title"]').value.trim();
        const b = root.querySelector('[data-f="body"]').value.trim();
        if (!b && !t) return toast('La nota está vacía', 'err');
        if (n) store.updateFreeNote(id, { title: t, body: b });
        else store.addFreeNote(t, b);
        close(); toast('Nota guardada', 'ok');
        window.dispatchEvent(new CustomEvent('render'));
      };
    },
  });
}

/* ==========================================================================
   MÁS  (menú)
   ========================================================================== */
export function viewMore() {
  const me = store.me();
  const items = [
    ['#/reservas',   'ticket', 'Reservas',        'Vuelos, traslados, hoteles y excursiones'],
    ['#/documentos', 'file',   'Documentos',      'Billetes, bonos, seguros y copias'],
    ['#/comer',      'utensils','Comer y comprar','Restaurantes y supermercados con precios'],
    ['#/notas',      'edit',   'Notas',           'Todo lo que habéis apuntado, junto'],
    ['#/listas',     'list',   'Listas',          'Equipaje, documentación y pendientes'],
    ['#/info',      'info',   'Información útil','Moneda, clima, costumbres y frases'],
    ['#/contactos', 'phone',  'Contactos',       'Agencia, hoteles, seguro y emergencias'],
    ['#/refs',      'copy',   'Localizadores',   'Todas las referencias para copiar'],
    ['#/grupo',     'users',  'Grupo y ajustes', 'Viajeros, copia de seguridad y app'],
  ];
  return `
  <div class="card card-pad c-hotel" style="margin-bottom:16px">
    <div class="row" style="gap:12px">
      ${me ? avatar(person(me)?.name, person(me)?.color, 'lg') :
        `<div class="av lg" style="background:var(--surface-2);color:var(--ink-3)">?</div>`}
      <div class="grow">
        <div class="strong" style="font-size:15px">${me ? esc(person(me)?.name) : 'Sin identificar'}</div>
        <div class="tiny muted">${me ? 'Así se firman tus cambios' : 'Dinos quién eres para firmar tus cambios'}</div>
      </div>
      <button class="btn sm ghost" data-who>${me ? 'Cambiar' : 'Elegir'}</button>
    </div>
  </div>
  <div class="card">
    ${items.map(([h, ic, t, s]) => `
      <a class="lrow" href="${h}">
        <div class="ic tinted c-visita">${icon(ic, 18)}</div>
        <div class="grow"><div class="tt">${esc(t)}</div><div class="st">${esc(s)}</div></div>
        <div class="chev">${icon('chevron', 17)}</div>
      </a>`).join('')}
  </div>`;
}

/* ==========================================================================
   GRUPO Y AJUSTES
   ========================================================================== */
export function viewGroup() {
  const me = store.me();
  return `
  <div class="section-head" style="margin-top:0"><h2>Viajeros</h2></div>
  <div class="card">
    ${PEOPLE.map(p => `
      <button class="lrow" data-setme="${p.id}">
        ${avatar(p.name, p.color)}
        <div class="grow" style="margin-left:2px"><div class="tt">${esc(p.name)}</div>
          <div class="st">${p.id === 'montse' ? 'Titular de la reserva' : 'Viajero'}</div></div>
        ${me === p.id ? '<span class="pill pill-ok">Soy yo</span>' : ''}
      </button>`).join('')}
  </div>

  <div class="section-head"><h2>Compartir esta app</h2></div>
  <div class="card card-pad">
    <p class="tiny muted" style="margin-bottom:12px">Pásales la dirección web a los demás. En el móvil pueden instalarla desde el navegador: <b>Compartir → Añadir a pantalla de inicio</b>.</p>
    <button class="btn block" data-share>${icon('share', 16)} Compartir enlace</button>
  </div>

  <div class="section-head"><h2>Copia de seguridad</h2></div>
  <div class="card card-pad">
    <p class="tiny muted" style="margin-bottom:12px">Lo que marcas en las listas y los gastos que añades se guardan en este móvil. Puedes descargar una copia y pasarla a otro dispositivo.</p>
    <div class="stack">
      <button class="btn ghost block" data-backup>${icon('download', 16)} Descargar copia</button>
      <button class="btn ghost block" data-restore>${icon('upload', 16)} Restaurar copia</button>
      <button class="btn ghost block" style="color:var(--red-600)" data-reset>${icon('refresh', 16)} Empezar de cero</button>
    </div>
  </div>

  <div class="section-head"><h2>Sobre la aplicación</h2></div>
  <div class="card card-pad">
    <dl class="kv">
      <dt>Viaje</dt><dd>${esc(TRIP.name)} · ${esc(TRIP.subtitle)}</dd>
      <dt>Fechas</dt><dd>${fmtDate(TRIP.start, 'short')} — ${fmtDate(TRIP.end, 'medium')}</dd>
      <dt>Versión</dt><dd>1.0</dd>
      <dt>Sin conexión</dt><dd id="sw-state">Comprobando…</dd>
    </dl>
    <p class="tiny muted mt">La agenda, las reservas, los teléfonos y la información útil funcionan sin conexión. El mapa necesita internet para cargar las calles.</p>
  </div>`;
}
