/* ==========================================================================
   Crea el archivo .htpasswd para proteger la web con contraseña.

   Uso:
       node crear-contrasena.mjs tailandia miContraseña

   Genera un archivo ".htpasswd" en esta misma carpeta.
   Después hay que descomentar las dos líneas de auth_basic en nginx.conf
   y la línea COPY .htpasswd del Dockerfile.
   ========================================================================== */

import crypto from 'crypto';
import fs from 'fs';

const ITOA64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function to64(v, n) {
  let out = '';
  while (--n >= 0) { out += ITOA64[v & 0x3f]; v >>= 6; }
  return out;
}

const md5 = (...bufs) => {
  const h = crypto.createHash('md5');
  bufs.forEach(b => h.update(b));
  return h.digest();
};

/** Hash APR1-MD5, el mismo formato que genera el comando htpasswd */
function apr1(password, salt) {
  const pw = Buffer.from(password, 'utf8');
  const sa = Buffer.from(salt, 'utf8');
  const magic = Buffer.from('$apr1$', 'utf8');

  let ctx1 = md5(pw, sa, pw);

  const parts = [pw, magic, sa];
  for (let i = pw.length; i > 0; i -= 16) parts.push(ctx1.subarray(0, Math.min(16, i)));
  for (let i = pw.length; i > 0; i >>= 1) {
    parts.push(i & 1 ? Buffer.from([0]) : pw.subarray(0, 1));
  }
  let final = md5(...parts);

  for (let i = 0; i < 1000; i++) {
    const p = [];
    if (i & 1) p.push(pw); else p.push(final);
    if (i % 3) p.push(sa);
    if (i % 7) p.push(pw);
    if (i & 1) p.push(final); else p.push(pw);
    final = md5(...p);
  }

  const out =
    to64((final[0] << 16) | (final[6] << 8) | final[12], 4) +
    to64((final[1] << 16) | (final[7] << 8) | final[13], 4) +
    to64((final[2] << 16) | (final[8] << 8) | final[14], 4) +
    to64((final[3] << 16) | (final[9] << 8) | final[15], 4) +
    to64((final[4] << 16) | (final[10] << 8) | final[5], 4) +
    to64(final[11], 2);

  return `$apr1$${salt}$${out}`;
}

const [user, pass] = process.argv.slice(2);
if (!user || !pass) {
  console.error('Uso: node crear-contrasena.mjs USUARIO CONTRASEÑA');
  console.error('Ejemplo: node crear-contrasena.mjs tailandia BangkokPhuket2026');
  process.exit(1);
}

const salt = [...crypto.randomBytes(8)].map(b => ITOA64[b & 0x3f]).join('');
fs.writeFileSync('.htpasswd', `${user}:${apr1(pass, salt)}\n`);

console.log('Listo. Se ha creado el archivo .htpasswd');
console.log('  Usuario:    ' + user);
console.log('  Contraseña: ' + pass);
console.log('');
console.log('Ahora descomenta las dos líneas de auth_basic en nginx.conf');
console.log('y la línea COPY .htpasswd del Dockerfile. Después, vuelve a desplegar.');
