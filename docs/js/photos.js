/* ==========================================================================
   photos.js — guarda las fotos de los tickets en el propio móvil
   Usa IndexedDB porque las fotos no caben en el almacenamiento normal.
   ========================================================================== */

const DB = 'tth-fotos';
const STORE = 'tickets';
let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((ok, err) => {
    // Si el navegador bloquea el almacenamiento (modo incógnito, archivo local…),
    // no dejamos que la app se quede esperando para siempre.
    const corta = setTimeout(() => err(new Error('IndexedDB no disponible')), 4000);
    let r;
    try { r = indexedDB.open(DB, 1); }
    catch (e) { clearTimeout(corta); return err(e); }
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE);
    };
    r.onsuccess = () => { clearTimeout(corta); ok(r.result); };
    r.onerror   = () => { clearTimeout(corta); err(r.error); };
    r.onblocked = () => { clearTimeout(corta); err(new Error('IndexedDB bloqueado')); };
  }).catch(e => { dbp = null; throw e; });
  return dbp;
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((ok, err) => {
    const t = db.transaction(STORE, mode);
    const s = t.objectStore(STORE);
    const req = fn(s);
    t.oncomplete = () => ok(req ? req.result : undefined);
    t.onerror = () => err(t.error);
  });
}

/** Claves en memoria, para saber al vuelo qué gastos tienen foto */
const cache = new Set();

export const photos = {
  cache,
  tiene: id => cache.has(id),

  async refresh() {
    try {
      const ks = await tx('readonly', s => s.getAllKeys());
      cache.clear();
      (ks || []).forEach(k => cache.add(k));
    } catch { /* sin IndexedDB: se queda vacío */ }
    return cache;
  },

  async save(id, blob) { await tx('readwrite', s => s.put(blob, id)); cache.add(id); },
  get:    (id)       => tx('readonly',  s => s.get(id)),
  async remove(id) { await tx('readwrite', s => s.delete(id)); cache.delete(id); },
  keys:   ()         => tx('readonly',  s => s.getAllKeys()),

  /** Espacio ocupado, aproximado */
  async usage() {
    try {
      const e = await navigator.storage.estimate();
      return { used: e.usage || 0, quota: e.quota || 0 };
    } catch { return null; }
  },
};

/**
 * Reduce la foto antes de guardarla: 1400 px de lado mayor y JPEG de calidad
 * media. Un ticket queda en 100–250 KB en vez de los 3–5 MB de la cámara.
 */
export function comprimir(file, maxLado = 1400, calidad = 0.72) {
  return new Promise((ok, err) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width: w, height: h } = img;
      const escala = Math.min(1, maxLado / Math.max(w, h));
      w = Math.round(w * escala); h = Math.round(h * escala);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      c.toBlob(b => b ? ok(b) : err(new Error('No se ha podido procesar la foto')),
        'image/jpeg', calidad);
    };
    img.onerror = () => { URL.revokeObjectURL(url); err(new Error('Archivo de imagen no válido')); };
    img.src = url;
  });
}

export const bytes = n =>
  n > 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB'
              : Math.round(n / 1024) + ' KB';
