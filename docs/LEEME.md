# Thailand Trip Hub

Aplicación web para el viaje a Tailandia del **9 al 17 de agosto de 2026**.
Funciona en cualquier navegador, se instala en el móvil y sigue funcionando sin conexión.

---

## 0. Verla ahora mismo

Dentro de la carpeta hay un archivo suelto: **`tailandia-una-sola-pagina.html`**.

Se abre haciendo doble clic, sin instalar nada. Lleva dentro todo: diseño, agenda,
mapa, listas y gastos. Sirve para verla y para pasarla por WhatsApp o correo a los
demás si no queréis publicarla en internet.

Lo único que necesita internet es el mapa (las calles), la previsión del tiempo y
la actualización del cambio euro/baht.

Para que se instale como app en el móvil y funcione **completamente sin conexión**,
hay que publicarla en internet: es el paso siguiente y son dos minutos.

---

## 1. Publicarla

La app son archivos estáticos: no necesita servidor, base de datos ni compilación.
Todo lo necesario para GitHub y para Coolify ya está preparado dentro de la carpeta.

### Opción A · GitHub Pages

Es la más rápida y no cuesta nada.

1. Crea un repositorio nuevo en GitHub (puede ser **privado**, Pages funciona igual
   en cuentas de pago; si es gratuita, tendrá que ser público).
2. Sube la carpeta:

   ```bash
   cd thailand-trip-hub
   git init
   git add .
   git commit -m "Thailand Trip Hub"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/tailandia.git
   git push -u origin main
   ```

3. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
4. El flujo `.github/workflows/deploy-pages.yml` ya está incluido: publica solo.
5. En un minuto tendrás la dirección `https://TU-USUARIO.github.io/tailandia/`.

A partir de ahí, cada `git push` actualiza la web sola.

### Opción B · Coolify

Mejor si quieres tu propio dominio y poder ponerle contraseña.

1. En Coolify: **+ New → Resource → Public/Private Repository** y elige el repo de GitHub.
2. Build Pack: **Dockerfile** (ya está en la carpeta).
3. Port: **80**.
4. Asigna el dominio, por ejemplo `tailandia.lagraficacreative.com`, y despliega.

El `Dockerfile` levanta un nginx con la configuración de `nginx.conf`, que ya trae
compresión, caché correcta y la cabecera para que no la indexe ningún buscador.

**Para ponerle contraseña.** Esto solo se puede en Coolify, no en GitHub Pages
(Pages es alojamiento estático y no puede pedir contraseña). Es una protección real,
la pide el servidor antes de servir nada.

1. Genera el archivo de contraseñas:

   ```bash
   node crear-contrasena.mjs tailandia LA-QUE-QUIERAS
   ```

   Crea un archivo `.htpasswd` en la carpeta. (Si prefieres, sirve igual el comando
   `htpasswd -c .htpasswd tailandia`.)

2. En `nginx.conf`, descomenta estas dos líneas quitándoles la almohadilla:

   ```
   auth_basic           "Thailand Trip Hub";
   auth_basic_user_file /etc/nginx/.htpasswd;
   ```

3. En el `Dockerfile`, descomenta la línea `COPY .htpasswd /etc/nginx/.htpasswd`.
4. En `.gitignore`, borra la línea `.htpasswd` para que se suba al repositorio.
   **Ten el repositorio en privado si haces esto.**
5. Vuelve a desplegar.

A partir de ahí la web pedirá usuario y contraseña. Se las pasas al grupo por WhatsApp.

### Opción C · Netlify Drop (sin cuenta)

Para salir del paso: entra en https://app.netlify.com/drop y arrastra la carpeta
entera. Te da una dirección al momento, sin registrarte.

## 2. Instalarla en el móvil

Una vez abierta la dirección web en el móvil:

- **iPhone (Safari):** botón *Compartir* → **Añadir a pantalla de inicio**.
- **Android (Chrome):** menú de tres puntos → **Instalar aplicación** o *Añadir a pantalla de inicio*.

Queda con su icono, se abre a pantalla completa y funciona igual que una app.

---

## 3. Qué hay dentro

| Pantalla | Qué incluye |
|---|---|
| **Inicio** | Cuenta atrás, hora de España y de Tailandia, previsión del tiempo, avisos importantes, próxima actividad, **lo próximo que hay que hacer** (las tareas con la fecha límite más cercana), próximo vuelo y traslado, itinerario por ciudades y progreso de las listas |
| **Agenda** | Los 9 días hora a hora, en vista cronológica y en calendario. Cada momento se abre con todos los datos, teléfonos, mapa y notas. Detecta horarios que se solapan. Se pueden **añadir actividades propias** con el botón naranja y ponerle una **nota a cada día** |
| **Notas** | Notas sueltas y, además, todas las que hayáis puesto en los días, vuelos, hoteles, excursiones y documentos, reunidas en una sola pantalla |
| **Mapa** | 40 puntos con filtros por categoría: ciudades, aeropuertos, hoteles, excursiones, monumentos, playas, compras, hospitales y la embajada |
| **Gastos** | Presupuesto, balance de quién debe qué, gráfico por categorías, conversor euro/baht y exportación a CSV. Cada gasto puede llevar **foto del ticket**, hecha con la cámara y guardada en el propio móvil |
| **Reservas** | Los 5 vuelos, los 4 traslados, los 2 hoteles y las excursiones, con localizadores copiables |
| **Documentos** | **Pasaportes** con la fecha de caducidad de cada uno y el aviso de si sirve para el viaje (cada persona puede guardar su número, solo en su móvil). Y la carpeta del viaje: billetes, tarjetas de embarque, TDAC, bonos, pólizas, contrato, copias de pasaportes y permisos de conducir. Cada ficha guarda su enlace de Drive o Dropbox |
| **Comer y comprar** | Restaurantes y supermercados cerca de cada hotel, con precios reales en euros y tabla de referencia |
| **Listas** | 9 listas plegables con casillas. La primera, **Una semana antes**, tiene los 12 apartados de la guía previa (documentación, TDAC, traslados, excursiones, vuelos, salida de Lleida, dinero, móvil, seguro, equipaje y salud) con fecha límite en cada tarea. Después: **El día antes de salir**, documentación, ropa, botiquín, higiene, tecnología, dinero y compras del grupo |
| **Información útil** | Equipaje, documentación y TDAC, seguros, pagos con QR, diferencia horaria, clima, enchufes, SIM, transporte, costumbres, frases en tailandés, emergencias y hospitales |
| **Contactos** | Todos los teléfonos con botones de llamar, WhatsApp y copiar |
| **Localizadores** | Todas las referencias del viaje, a un toque para copiarlas |

---

## 4. Cómo cambiar la información

Todos los datos están en **un solo archivo**: `js/data.js`

Se abre con cualquier editor de texto (Bloc de notas, TextEdit, VS Code…).
Está organizado por apartados con comentarios en español:

```
TRIP        → nombre, fechas y presupuesto del viaje
PEOPLE      → los cuatro viajeros
CITIES      → ciudades del itinerario
DAYS        → la agenda día a día      ← lo que más se toca
FLIGHTS     → los vuelos
TRANSFERS   → los traslados
STAYS       → los hoteles
EXCURSIONS  → las excursiones
PLACES      → los puntos del mapa
DOCS_FOLDER → el enlace de la carpeta de Drive compartida  ← lo más rápido
DOCS        → las fichas de documentos (un enlace por documento)
FOOD        → restaurantes y supermercados cerca de los hoteles
PRICES      → tablas de precios de referencia
LISTS       → las listas de equipaje y pendientes
NOTICES     → los avisos del inicio
INFO        → la información útil
CONTACTS    → los teléfonos
REFS        → los localizadores
```

**Reglas para no romper nada:**

- Cambia solo lo que hay **entre comillas**.
- No borres las comas del final de cada línea.
- Las fechas van siempre en formato `'2026-08-14'` (año-mes-día).
- Las horas, en formato `'09:30'`.

Después de guardar el archivo, vuelve a subir la carpeta a Netlify y listo.

### Añadir una actividad nueva

Busca el día dentro de `DAYS` y añade un bloque como este dentro de `items`:

```js
{
  time: '16:00', endTime: '18:00',
  type: 'visita',            // vuelo, traslado, hotel, excursion, comida, visita, libre, aviso
  status: 'recomendado',     // confirmado, pendiente, recomendado
  title: 'Masaje tailandés',
  note: 'Reservar el día antes en recepción.',
  maps: { q: 'Surin Beach Phuket', lat: 7.98, lng: 98.276 },
},
```

### Poner la carpeta de documentos para todo el grupo

Lo más rápido: una sola carpeta de Drive con todo dentro. En `js/data.js`, busca
`DOCS_FOLDER` y pega el enlace:

```js
export const DOCS_FOLDER = {
  url: 'https://drive.google.com/drive/folders/…',   // ← aquí
  ...
};
```

Aparecerá arriba del todo en la pantalla de Documentos, en verde, y lo verán los cuatro.

> **Importante:** si dentro hay copias de pasaportes, comparte la carpeta **por correo
> con los cuatro**, no en modo «cualquiera con el enlace».

### Un enlace por documento

Si prefieres el detalle, en `DOCS` busca la ficha y rellena el campo `url`:

```js
{ id: 'hoteles', title: 'Bonos de los hoteles', ...
  url: 'https://drive.google.com/…',   // ← aquí
},
```

Así lo ven los cuatro. Si en lugar de eso lo pega cada uno desde la app, ese enlace
se queda solo en su móvil.

### Añadir un día nuevo

Copia un bloque entero de `DAYS` (desde `{ date:` hasta `},`), pégalo en el orden
que toque y cambia la fecha, la ciudad y las actividades.

---

### Qué NO hay que poner en esta carpeta

El repositorio de GitHub es **público**. Nunca metas ahí:

- Números de pasaporte, DNI o tarjetas
- Fotos o escaneos de pasaportes
- Contraseñas

En `js/data.js` solo van las **fechas de caducidad** de los pasaportes, que es lo que
hace falta para comprobar que sirven. Los números los guarda cada uno desde la app,
y se quedan en su móvil.

Para las copias de los pasaportes, usa una carpeta de Drive **aparte y restringida**,
compartida por correo solo con los cuatro. Su enlace no lo pongas en la app.

### Dónde se pueden poner notas

En todo: cada día de la agenda, cada actividad, cada vuelo, cada traslado, cada hotel,
cada excursión, cada documento, cada restaurante y supermercado, cada apartado de
información útil y cada lista. Más un campo libre en Contactos y en Localizadores para
apuntar teléfonos y referencias nuevas.

Y notas sueltas en la pantalla **Notas**, donde además aparecen recogidas todas las
demás para que no se pierda ninguna.

### Cómo está organizada

- **Barra de abajo (5 pestañas):** lo que se usa a todas horas — Inicio, Agenda,
  Mapa, Gastos y Más.
- **Accesos rápidos del inicio (8 botones):** todo lo demás, a un toque —
  Reservas, Documentos, Comer, Listas, Info útil, Contactos, Localizadores y Grupo.
- **Botón € de la barra de arriba:** el conversor euro/baht, desde cualquier pantalla.

---

## 5. Cómo se guardan las cosas

- **La información del viaje** (agenda, vuelos, hoteles, teléfonos…) viene del archivo
  `js/data.js` y es igual para todo el mundo.
- **Lo que cada uno marca** (casillas de las listas, gastos nuevos, notas) se guarda
  **en su propio móvil**. No se sincroniza entre personas.
- **Las fotos de los tickets** se guardan en el móvil de quien las hace, aparte del
  resto (usan el almacenamiento de imágenes del navegador). No se sincronizan ni se
  suben a internet, y **no van dentro de la copia de seguridad**: si vas a cambiar de
  móvil, guárdalas antes en el carrete o en Drive.
- En *Más → Grupo y ajustes* se puede **descargar una copia** de todo lo marcado y
  **restaurarla** en otro móvil.

---

## 6. Sin conexión

La primera vez que se abre con internet, la app se guarda entera en el móvil.
A partir de ahí funcionan sin conexión:

- La agenda completa
- Vuelos, traslados, hoteles y excursiones
- Todos los teléfonos y localizadores
- Las listas y los gastos
- La información útil y las frases en tailandés

Necesitan internet: el mapa (las calles), la previsión del tiempo y la
actualización del cambio euro/baht.

---

## 7. Archivos del proyecto

```
index.html                        punto de entrada
manifest.webmanifest              datos para instalarla como app
sw.js                             hace que funcione sin conexión
robots.txt                        impide que Google la indexe
css/styles.css                    todo el diseño
js/data.js                        ← TODOS LOS DATOS DEL VIAJE
js/core.js                        utilidades e iconos
js/store.js                       lo que se guarda en el móvil
js/photos.js                      las fotos de los tickets
js/views.js                       las pantallas
js/app.js                         navegación, mapa y acciones
vendor/                           Leaflet (el mapa)
assets/icons/                     iconos de la aplicación

tailandia-una-sola-pagina.html    la app entera en un archivo, para abrir sin publicar
construir-pagina-unica.mjs        vuelve a generar ese archivo (node construir-pagina-unica.mjs)

.github/workflows/deploy-pages.yml   publica sola en GitHub Pages
Dockerfile · nginx.conf              para desplegar en Coolify
netlify.toml · _redirects            para Netlify
```
