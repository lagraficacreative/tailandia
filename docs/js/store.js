/* ==========================================================================
   store.js — guarda en el propio móvil lo que cada persona va marcando
   (listas, gastos añadidos, notas). No necesita servidor ni cuenta.
   ========================================================================== */

import { LISTS, BASE_EXPENSES, TRIP } from './data.js';
import { uid, isoDate } from './core.js';

const KEY = 'tth.v1';

const DEFAULTS = {
  checks: {},        // { "listId:index": {done, by, at} }
  extraItems: {},    // { listId: [{id, t, due, assigned}] }
  expenses: [],      // gastos añadidos por el grupo
  notes: {},         // { key: texto }
  budget: TRIP.budget,
  activities: [],    // actividades añadidas por el grupo desde la app
  freeNotes: [],     // notas sueltas
  me: '',            // quién soy (para firmar los cambios)
  rate: null,        // { thbPerEur, at }
  seen: {},
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...structuredClone(DEFAULTS), ...JSON.parse(raw) } : structuredClone(DEFAULTS);
  } catch { return structuredClone(DEFAULTS); }
}

let saveTimer;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, 120);
  window.dispatchEvent(new CustomEvent('store:change'));
}

export const store = {
  get: () => state,

  /* ---- Quién soy ---- */
  me: () => state.me,
  setMe(id) { state.me = id; persist(); },

  /* ---- Listas ---- */
  itemsOf(listId) {
    const base = (LISTS.find(l => l.id === listId)?.items || [])
      .map((it, i) => ({ ...it, key: `${listId}:${i}`, base: true }));
    const extra = (state.extraItems[listId] || [])
      .map(it => ({ ...it, key: `${listId}:x:${it.id}`, base: false }));
    return [...base, ...extra];
  },
  isDone(key) { return !!state.checks[key]?.done; },
  checkInfo(key) { return state.checks[key] || null; },
  toggle(key) {
    const cur = state.checks[key];
    if (cur?.done) delete state.checks[key];
    else state.checks[key] = { done: true, by: state.me, at: new Date().toISOString() };
    persist();
  },
  addItem(listId, text, due = '', assigned = '') {
    (state.extraItems[listId] ||= []).push({ id: uid().slice(0, 8), t: text, due, assigned });
    persist();
  },
  removeItem(listId, id) {
    state.extraItems[listId] = (state.extraItems[listId] || []).filter(i => i.id !== id);
    persist();
  },
  listProgress(listId) {
    const items = this.itemsOf(listId).filter(i => !i.h);
    const done = items.filter(i => this.isDone(i.key)).length;
    return { done, total: items.length, pct: items.length ? Math.round(done / items.length * 100) : 0 };
  },

  /* ---- Gastos ---- */
  allExpenses() { return [...BASE_EXPENSES, ...state.expenses]; },
  addExpense(e) {
    const id = uid().slice(0, 8);
    state.expenses.push({ ...e, id, date: e.date || isoDate(new Date()) });
    persist();
    return id;
  },
  updateExpense(id, patch) {
    const i = state.expenses.findIndex(x => x.id === id);
    if (i >= 0) { state.expenses[i] = { ...state.expenses[i], ...patch }; persist(); }
  },
  removeExpense(id) {
    state.expenses = state.expenses.filter(e => e.id !== id);
    persist();
  },
  isBaseExpense(id) { return BASE_EXPENSES.some(e => e.id === id); },

  budget() { return state.budget ?? TRIP.budget; },
  setBudget(v) { state.budget = Number(v) || 0; persist(); },

  /* ---- Actividades añadidas desde la app ---- */
  activities() { return state.activities; },
  activitiesOf(date) {
    return state.activities.filter(a => a.date === date);
  },
  activity(id) { return state.activities.find(a => a.id === id) || null; },
  addActivity(a) {
    const id = 'u' + uid().slice(0, 7);
    state.activities.push({ ...a, id, by: state.me, at: new Date().toISOString() });
    persist();
    return id;
  },
  updateActivity(id, patch) {
    const i = state.activities.findIndex(a => a.id === id);
    if (i >= 0) { state.activities[i] = { ...state.activities[i], ...patch }; persist(); }
  },
  removeActivity(id) {
    state.activities = state.activities.filter(a => a.id !== id);
    persist();
  },

  /* ---- Notas sueltas ---- */
  freeNotes() { return state.freeNotes; },
  freeNote(id) { return state.freeNotes.find(n => n.id === id) || null; },
  addFreeNote(title, body) {
    const id = 'n' + uid().slice(0, 7);
    state.freeNotes.unshift({ id, title, body, by: state.me, at: new Date().toISOString() });
    persist();
    return id;
  },
  updateFreeNote(id, patch) {
    const i = state.freeNotes.findIndex(n => n.id === id);
    if (i >= 0) {
      state.freeNotes[i] = { ...state.freeNotes[i], ...patch, at: new Date().toISOString() };
      persist();
    }
  },
  removeFreeNote(id) {
    state.freeNotes = state.freeNotes.filter(n => n.id !== id);
    persist();
  },

  /* ---- Cuántas notas hay puestas ---- */
  noteCount() {
    return Object.keys(state.notes).length + state.freeNotes.length;
  },

  /* ---- Notas ---- */
  note(k) { return state.notes[k] || ''; },
  setNote(k, v) {
    if (v && v.trim()) state.notes[k] = v.trim(); else delete state.notes[k];
    persist();
  },

  /* ---- Cambio EUR/THB ---- */
  rate() { return state.rate?.thbPerEur || 38.5; },
  rateInfo() { return state.rate; },
  setRate(v) { state.rate = { thbPerEur: v, at: new Date().toISOString() }; persist(); },

  /* ---- Exportar / importar ---- */
  export() { return JSON.stringify(state, null, 2); },
  import(json) {
    try {
      const data = JSON.parse(json);
      state = { ...structuredClone(DEFAULTS), ...data };
      persist();
      return true;
    } catch { return false; }
  },
  reset() { state = structuredClone(DEFAULTS); persist(); },
};

/* Actualiza el cambio EUR→THB una vez al día si hay conexión */
export async function refreshRate() {
  const info = store.rateInfo();
  if (info && Date.now() - new Date(info.at).getTime() < 12 * 3600 * 1000) return;
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=EUR&to=THB');
    const j = await r.json();
    if (j?.rates?.THB) store.setRate(j.rates.THB);
  } catch { /* sin conexión: se usa el último valor guardado */ }
}
