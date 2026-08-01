/* ==========================================================================
   data.js — TODOS LOS DATOS DEL VIAJE
   --------------------------------------------------------------------------
   Este es el único archivo que hay que tocar para cambiar información.
   No hace falta saber programar: busca el apartado, cambia el texto entre
   comillas y guarda. Respeta siempre las comas y las comillas.
   ========================================================================== */

export const TRIP = {
  name: 'Tailandia',
  subtitle: 'Bangkok y Phuket',
  start: '2026-08-09',
  end:   '2026-08-17',
  tz:     'Asia/Bangkok',
  homeTz: 'Europe/Madrid',
  tzDiff: '+5 h respecto a España',
  agency: 'Logitravel',
  locator: '1296377948',
  invoice: '7600655989',
  airlineLocator: '7RUF9V',
  travellers: 4,
  budget: 12000,           // presupuesto orientativo en € (editable desde la app)
  holder: {
    name: 'Montserrat Torrelles Teixidó',
    phone: '+34 639 087 024',
    email: 'montsetorrelles@gmail.com',
  },
};

/* --------------------------------------------------------------------------
   VIAJEROS
   Aquí solo va la fecha de caducidad del pasaporte, que es lo que hace falta
   comprobar antes de viajar. El NÚMERO de pasaporte no se pone nunca aquí:
   esta aplicación está publicada en un repositorio público.
   Cada uno puede guardar su número desde la propia app, y se queda en su móvil.
   -------------------------------------------------------------------------- */
export const PEOPLE = [
  { id: 'montse', name: 'Montserrat Torrelles Teixidó', short: 'Montse', color: '#0E6B5C',
    passportExpiry: '2034-06-25' },
  { id: 'carmen', name: 'Carmen Teixidó Ortiz',         short: 'Carmen', color: '#E8664B',
    passportExpiry: '2033-09-22' },
  { id: 'alba',   name: 'Alba Puiggros Torrelles',      short: 'Alba',   color: '#0FA3A3',
    passportExpiry: '2028-08-03' },
  { id: 'biel',   name: 'Biel Puiggros Torrelles',      short: 'Biel',   color: '#7A5AF8',
    passportExpiry: '2029-06-25' },
];

export const CITIES = [
  { id: 'lleida',    name: 'Lleida',    country: 'España',   from: '2026-08-09', to: '2026-08-09', lat: 41.6176, lng: 0.6200,   nights: 0 },
  { id: 'barcelona', name: 'Barcelona', country: 'España',   from: '2026-08-09', to: '2026-08-09', lat: 41.2974, lng: 2.0833,   nights: 0 },
  { id: 'doha',      name: 'Doha',      country: 'Catar',    from: '2026-08-09', to: '2026-08-10', lat: 25.2731, lng: 51.6081,  nights: 0, layover: true },
  { id: 'bangkok',   name: 'Bangkok',   country: 'Tailandia',from: '2026-08-10', to: '2026-08-13', lat: 13.7563, lng: 100.5018, nights: 3 },
  { id: 'phuket',    name: 'Phuket',    country: 'Tailandia',from: '2026-08-13', to: '2026-08-17', lat: 7.8804,  lng: 98.3923,  nights: 4 },
];

/* --------------------------------------------------------------------------
   ITINERARIO DÍA A DÍA
   type: vuelo · traslado · hotel · excursion · comida · visita · libre · aviso
   status: confirmado · pendiente · recomendado
   -------------------------------------------------------------------------- */
export const DAYS = [

/* ===== DOMINGO 9 DE AGOSTO ============================================== */
{
  date: '2026-08-09', city: 'Lleida → Barcelona → Doha', cityId: 'barcelona',
  title: 'Salida hacia Tailandia',
  items: [
    {
      time: '11:45', endTime: '12:00', type: 'traslado', status: 'recomendado',
      title: 'Salida desde Lleida', where: 'Lleida',
      note: 'Trayecto hasta Barcelona-El Prat de aproximadamente 1 h 45 min – 2 h.',
      clocks: { es: '11:45 – 12:00', th: '16:45 – 17:00' },
      maps: { q: 'Lleida, España', lat: 41.6176, lng: 0.6200 },
    },
    {
      time: '13:45', endTime: '14:00', type: 'aviso', status: 'recomendado',
      title: 'Llegada al aeropuerto de Barcelona · Terminal 1',
      note: 'Para vuelos de larga distancia se recomienda presentarse con un mínimo de 120 minutos de antelación.',
      checklist: ['Facturar el equipaje', 'Control de seguridad', 'Buscar la puerta de embarque'],
      maps: { q: 'Aeropuerto Josep Tarradellas Barcelona-El Prat Terminal 1', lat: 41.2870, lng: 2.0700 },
    },
    {
      time: '16:35', type: 'vuelo', status: 'confirmado',
      title: 'Vuelo QR146 · Barcelona → Doha', subtitle: 'Qatar Airways',
      rows: [
        ['Salida', 'Barcelona-El Prat T1 · 16:35'],
        ['Llegada', 'Doha (DOH) · 23:50 hora local de Catar'],
        ['Equipaje facturado', '1 maleta de hasta 25 kg por persona'],
      ],
      clocks: { es: '16:35', th: '21:35' },
      refs: [['Localizador', '7RUF9V']],
      links: [['Check-in Qatar Airways', 'https://www.qatarairways.com/es-es/checkin.html']],
    },
    {
      time: '23:50', type: 'aviso', status: 'confirmado',
      title: 'Llegada a Doha · escala de 2 h 10 min',
      note: 'No hay que salir del aeropuerto. Buscar la puerta del siguiente vuelo y pasar los controles correspondientes.\n\nHora en España 22:50 · en Tailandia serán las 03:50 del día 10.',
      maps: { q: 'Hamad International Airport Doha', lat: 25.2731, lng: 51.6081 },
    },
  ],
},

/* ===== LUNES 10 DE AGOSTO =============================================== */
{
  date: '2026-08-10', city: 'Doha → Bangkok', cityId: 'bangkok',
  title: 'Llegada a Bangkok',
  items: [
    {
      time: '02:00', type: 'vuelo', status: 'confirmado',
      title: 'Vuelo QR834 · Doha → Bangkok', subtitle: 'Qatar Airways',
      rows: [
        ['Salida', 'Doha (DOH) · 02:00 hora local'],
        ['Llegada', 'Bangkok Suvarnabhumi (BKK) · 12:55'],
      ],
      clocks: { es: '01:00', th: '06:00' },
      refs: [['Localizador', '7RUF9V']],
    },
    {
      time: '12:55', type: 'aviso', status: 'confirmado',
      title: 'Llegada a Bangkok · Aeropuerto Suvarnabhumi',
      note: 'Después de aterrizar hay varios trámites antes de salir. El punto de encuentro con el conductor es la Puerta de salida 4, segunda planta.',
      clocks: { es: '07:55', th: '12:55' },
      maps: { q: 'Suvarnabhumi Airport Bangkok', lat: 13.6900, lng: 100.7501 },
      checklist: [
        'Control de inmigración',
        'Recogida de equipaje',
        'Cambio de moneda o cajero',
        'Conexión a internet (eSIM o SIM)',
        'Ir a la Puerta de salida 4, 2ª planta',
      ],
    },
    {
      time: '14:00', endTime: '15:00', type: 'traslado', status: 'confirmado',
      title: 'Traslado privado al hotel', subtitle: 'ONWAYTRANSFERS',
      where: 'Aeropuerto Suvarnabhumi → Royal Orchid Sheraton',
      note: 'El conductor llevará un cartel con el nombre de la reserva.',
      refs: [['Localizador', 'OWT-337654']],
      phones: [['Conductor / traslado', '+66 95 858 0087'], ['Asistencia 24 h', '+34 871 153 847']],
      rows: [['Vehículo', 'Coche privado · categoría económica'], ['Pasajeros', '4']],
    },
    {
      time: '15:00', type: 'hotel', status: 'confirmado',
      title: 'Check-in · Royal Orchid Sheraton Riverside',
      subtitle: 'Bangkok · 3 noches', stayId: 'sheraton',
      rows: [
        ['Estancia', 'Del 10 al 13 de agosto'],
        ['Habitación', 'Deluxe con vistas al río · 4 personas'],
        ['Régimen', 'Alojamiento y desayuno'],
      ],
      phones: [['Hotel', '+66 2 266 0123']],
      warn: 'En el check-in piden un depósito reembolsable con tarjeta de crédito. También se paga aquí el resort fee y la tasa por noche.',
      maps: { q: 'Royal Orchid Sheraton Hotel Bangkok', lat: 13.7263, lng: 100.5122 },
    },
    {
      time: '15:00', endTime: '18:00', type: 'libre', status: 'recomendado',
      title: 'Descanso en el hotel y piscina',
      note: 'Día tranquilo para recuperaros del viaje.',
    },
    {
      time: '18:00', endTime: '20:00', type: 'visita', status: 'recomendado',
      title: 'Paseo por River City Bangkok e ICONSIAM',
      note: 'ICONSIAM está al otro lado del río: hay barcos lanzadera gratuitos desde varios embarcaderos.',
      ideas: ['River City Bangkok', 'ICONSIAM', 'Paseo en barco por el Chao Phraya'],
      maps: { q: 'ICONSIAM Bangkok', lat: 13.7264, lng: 100.5100 },
    },
    {
      time: '20:00', type: 'comida', status: 'recomendado',
      title: 'Cena junto al río',
      ideas: ['Charoen Krung', 'Bang Rak', 'Asiatique The Riverfront', 'ICONSIAM'],
    },
  ],
},

/* ===== MARTES 11 DE AGOSTO ============================================== */
{
  date: '2026-08-11', city: 'Bangkok', cityId: 'bangkok',
  title: 'Mercado flotante y mercado ferroviario',
  items: [
    { time: '07:15', type: 'comida', status: 'recomendado', title: 'Desayuno en el hotel' },
    {
      time: '07:45', type: 'traslado', status: 'recomendado',
      title: 'Salida hacia Banglamphu',
      note: 'En taxi o Grab, calculad unos 30–45 minutos con tráfico.',
      maps: { q: 'Banglamphu Bangkok', lat: 13.7590, lng: 100.4977 },
    },
    {
      time: '08:45', type: 'excursion', status: 'confirmado',
      title: 'Llegada al punto de encuentro',
      subtitle: 'Heladería Swensen’s Bang Lamphu',
      where: '2 Thanon Tanao, Talat Yot, Bangkok · junto a Banglamphu Square',
      warn: 'La excursión NO incluye recogida en el hotel: hay que llegar por cuenta propia.',
      maps: { q: "Swensen's Bang Lamphu, Thanon Tanao, Bangkok", lat: 13.7590, lng: 100.4988 },
    },
    {
      time: '09:00', endTime: '17:00', type: 'excursion', status: 'confirmado',
      title: 'Mercado flotante y mercado sobre la vía del tren',
      subtitle: 'Civitatis · ASKDISCOVERY Tailandia', excId: 'mercados',
      rows: [
        ['Duración aproximada', '6 – 8 horas'],
        ['Participantes', '4 adultos'],
        ['Regreso aproximado', '15:00 – 17:00 h'],
      ],
      refs: [['Nº de reserva', 'A40188327']],
      phones: [['Proveedor local', '+66 81 492 6380']],
      price: { amount: 196, currency: 'EUR', status: 'pagado', label: 'total 4 personas' },
    },
    {
      time: '17:00', endTime: '19:00', type: 'libre', status: 'recomendado',
      title: 'Descanso en el hotel',
    },
    {
      time: '19:30', type: 'comida', status: 'recomendado',
      title: 'Cena y paseo por Chinatown / Yaowarat',
      ideas: ['Yaowarat Road', 'Talat Noi', 'Wat Traimit', 'Puestos de comida callejera'],
      maps: { q: 'Yaowarat Road Chinatown Bangkok', lat: 13.7400, lng: 100.5100 },
    },
  ],
},

/* ===== MIÉRCOLES 12 DE AGOSTO =========================================== */
{
  date: '2026-08-12', city: 'Bangkok', cityId: 'bangkok',
  title: 'Templos y tour en tuk-tuk',
  items: [
    { time: '08:00', type: 'comida', status: 'recomendado', title: 'Desayuno en el hotel' },
    {
      time: '09:00', endTime: '11:00', type: 'visita', status: 'recomendado',
      title: 'Gran Palacio y Wat Phra Kaew',
      warn: 'Código de vestimenta estricto: hombros y rodillas cubiertos.',
      maps: { q: 'Gran Palacio de Bangkok', lat: 13.7500, lng: 100.4913 },
    },
    {
      time: '11:00', endTime: '12:30', type: 'visita', status: 'recomendado',
      title: 'Wat Pho · el Buda reclinado',
      maps: { q: 'Wat Pho Bangkok', lat: 13.7465, lng: 100.4927 },
    },
    {
      time: '12:30', endTime: '14:00', type: 'comida', status: 'recomendado',
      title: 'Comida en Tha Tien',
      note: 'Desde el embarcadero de Tha Tien salen los barcos que cruzan a Wat Arun.',
      maps: { q: 'Tha Tien Pier Bangkok', lat: 13.7434, lng: 100.4924 },
    },
    {
      time: '14:00', endTime: '15:30', type: 'visita', status: 'recomendado',
      title: 'Wat Arun · el Templo del Amanecer',
      maps: { q: 'Wat Arun Bangkok', lat: 13.7437, lng: 100.4889 },
    },
    {
      time: '15:30', endTime: '16:30', type: 'visita', status: 'recomendado',
      title: 'Chinatown o Talat Noi',
      ideas: ['Yaowarat', 'Talat Noi', 'Callejones con arte urbano'],
      maps: { q: 'Talat Noi Bangkok', lat: 13.7350, lng: 100.5130 },
    },
    { time: '16:30', type: 'libre', status: 'recomendado', title: 'Regreso al hotel y descanso' },
    {
      time: '17:15', type: 'traslado', status: 'recomendado',
      title: 'Salida hacia Hua Lamphong',
      note: 'En taxi, Grab o con la línea azul del metro hasta MRT Hua Lamphong.',
      maps: { q: 'Hua Lamphong Railway Station Bangkok', lat: 13.7379, lng: 100.5170 },
    },
    {
      time: '18:15', type: 'excursion', status: 'confirmado',
      title: 'Llegada a Bun Coffee', subtitle: 'Punto de encuentro del tour',
      where: '191 Rama IV Road · estación de tren de Hua Lamphong',
      maps: { q: 'Hua Lamphong Railway Station Bangkok', lat: 13.7379, lng: 100.5170 },
    },
    {
      time: '18:30', endTime: '21:30', type: 'excursion', status: 'confirmado',
      title: 'Tour en tuk-tuk por Bangkok',
      subtitle: 'Civitatis · audioguía en español', excId: 'tuktuk',
      rows: [['Duración', '3 horas'], ['Final aproximado', '21:30 h'], ['Participantes', '4 adultos']],
      refs: [['Nº de reserva', 'A40188349']],
      price: { amount: 136, currency: 'EUR', status: 'pagado', label: 'total 4 personas' },
      warn: 'Hay que llevar auriculares propios para escuchar la audioguía.',
    },
    {
      time: '21:30', type: 'comida', status: 'recomendado',
      title: 'Cena en Chinatown o regreso al hotel',
      ideas: ['Chinatown / Yaowarat', 'Talat Noi', 'Charoen Krung'],
    },
  ],
},

/* ===== JUEVES 13 DE AGOSTO ============================================== */
{
  date: '2026-08-13', city: 'Bangkok → Phuket', cityId: 'phuket',
  title: 'Vuelo interno a Phuket',
  items: [
    {
      time: '06:10', type: 'aviso', status: 'confirmado',
      title: 'Estar preparados en recepción',
      note: 'Maletas hechas y check-out resuelto antes de las 06:10.',
      checklist: ['Maletas cerradas', 'Check-out y depósito devuelto', 'Nada olvidado en la caja fuerte'],
    },
    {
      time: '06:25', type: 'traslado', status: 'confirmado',
      title: 'Traslado al aeropuerto', subtitle: 'HOTELBEDS / Holiday Taxis',
      where: 'Royal Orchid Sheraton → Aeropuerto Suvarnabhumi',
      refs: [['Localizador', '321-10856084']],
      phones: [['Teléfono de emergencia', '+34 871 180 153']],
      rows: [['Vehículo', 'Private shuttle'], ['Pasajeros', '4']],
    },
    {
      time: '10:50', type: 'vuelo', status: 'confirmado',
      title: 'Vuelo TG207 · Bangkok → Phuket', subtitle: 'Thai Airways',
      rows: [
        ['Salida', 'Bangkok Suvarnabhumi (BKK) · 10:50'],
        ['Llegada', 'Phuket (HKT) · 12:20 · Terminal D'],
      ],
      clocks: { es: '05:50', th: '10:50' },
      refs: [['Localizador', '7RUF9V']],
    },
    {
      time: '12:20', endTime: '14:00', type: 'traslado', status: 'pendiente',
      title: 'Traslado por cuenta propia hasta el hotel',
      warn: 'El traslado en Phuket no está contratado: taxi, Grab o traslado privado.',
      note: 'El trayecto desde el aeropuerto hasta Surin Beach son unos 30–40 minutos.',
      maps: { q: 'Phuket International Airport', lat: 8.1132, lng: 98.3169 },
    },
    {
      time: '14:00', type: 'hotel', status: 'confirmado',
      title: 'Check-in · Twinpalms Surin Beach Phuket',
      subtitle: 'Phuket · 4 noches', stayId: 'twinpalms',
      rows: [
        ['Estancia', 'Del 13 al 17 de agosto'],
        ['Habitación', 'Dúplex Loft · 4 personas'],
        ['Régimen', 'Alojamiento y desayuno'],
      ],
      phones: [['Hotel', '+66 76 316 500']],
      maps: { q: 'Twinpalms Surin Beach Phuket', lat: 7.9776, lng: 98.2790 },
    },
    {
      time: '14:00', endTime: '18:30', type: 'libre', status: 'recomendado',
      title: 'Descanso, piscina y hotel',
      note: 'Primera tarde de descanso en Phuket.',
    },
    {
      time: '19:30', type: 'comida', status: 'recomendado',
      title: 'Cena cerca de Surin Beach',
      ideas: ['Restaurantes de Surin Beach Road', 'Cherngtalay', 'Bang Tao'],
      maps: { q: 'Surin Beach Phuket', lat: 7.9800, lng: 98.2760 },
    },
  ],
},

/* ===== VIERNES 14 DE AGOSTO ============================================= */
{
  date: '2026-08-14', city: 'Phuket', cityId: 'phuket',
  title: 'Día de hotel y playa',
  items: [
    { time: '08:00', endTime: '09:30', type: 'comida', status: 'recomendado', title: 'Desayuno en el hotel' },
    {
      time: '09:30', endTime: '13:00', type: 'libre', status: 'recomendado',
      title: 'Piscina, hotel y descanso',
      note: 'Día prácticamente completo de descanso.',
    },
    { time: '13:00', endTime: '14:30', type: 'comida', status: 'recomendado', title: 'Comida en el hotel o cerca' },
    {
      time: '15:00', endTime: '18:00', type: 'libre', status: 'recomendado',
      title: 'Surin Beach',
      warn: 'En agosto el mar puede estar movido: hacer caso de las banderas rojas.',
      maps: { q: 'Surin Beach Phuket', lat: 7.9800, lng: 98.2760 },
    },
    {
      time: '18:00', endTime: '19:30', type: 'visita', status: 'recomendado',
      title: 'Paseo por Bang Tao',
      maps: { q: 'Bang Tao Beach Phuket', lat: 8.0000, lng: 98.2930 },
    },
    {
      time: '20:00', type: 'comida', status: 'recomendado',
      title: 'Cena en un restaurante local',
      ideas: ['Cherngtalay', 'Surin', 'Bang Tao'],
    },
  ],
},

/* ===== SÁBADO 15 DE AGOSTO ============================================== */
{
  date: '2026-08-15', city: 'Phuket', cityId: 'phuket',
  title: 'Excursión opcional de día completo',
  items: [
    {
      time: '', type: 'aviso', status: 'pendiente',
      title: 'Una única excursión de día completo',
      note: 'La recomendación es hacer solo una excursión larga este día para no saturar el viaje.',
      warn: 'Pendiente de reservar.',
    },
    {
      time: '07:00', endTime: '08:00', type: 'traslado', status: 'pendiente',
      title: 'Recogida en el hotel',
      note: 'La mayoría de excursiones a Phang Nga recogen entre las 07:00 y las 08:00.',
    },
    {
      time: '09:00', endTime: '17:00', type: 'excursion', status: 'pendiente',
      title: 'Bahía de Phang Nga · James Bond Island',
      subtitle: 'Opción recomendada', excId: 'phangnga',
      note: 'La bahía de Phang Nga suele ser una opción más protegida para navegar.',
      ideas: ['James Bond Island', 'Bahía de Phang Nga', 'Cuevas e islas', 'Paseo en barco o kayak'],
      maps: { q: 'Ao Phang Nga National Park', lat: 8.2740, lng: 98.5000 },
    },
    {
      time: '', type: 'excursion', status: 'pendiente',
      title: 'Alternativa · Phi Phi y Maya Bay', excId: 'phiphi',
      note: 'También es posible, pero en agosto conviene confirmar el estado del mar y reservar con cancelación flexible: la mejor época suele ser de noviembre a abril.',
      ideas: ['Phi Phi Don', 'Phi Phi Leh', 'Maya Bay', 'Snorkel', 'Pi Leh Lagoon'],
      maps: { q: 'Phi Phi Islands Thailand', lat: 7.7407, lng: 98.7784 },
    },
    { time: '18:00', type: 'libre', status: 'recomendado', title: 'Regreso al hotel' },
    { time: '20:00', type: 'comida', status: 'recomendado', title: 'Cena y descanso' },
  ],
},

/* ===== DOMINGO 16 DE AGOSTO ============================================= */
{
  date: '2026-08-16', city: 'Phuket', cityId: 'phuket',
  title: 'Último día de hotel',
  items: [
    { time: '08:00', endTime: '09:30', type: 'comida', status: 'recomendado', title: 'Desayuno en el hotel' },
    {
      time: '09:30', endTime: '13:00', type: 'libre', status: 'recomendado',
      title: 'Piscina, hotel y descanso',
      note: 'Segundo día casi completo de descanso.',
    },
    { time: '13:00', endTime: '14:30', type: 'comida', status: 'recomendado', title: 'Comida' },
    {
      time: '15:00', endTime: '17:30', type: 'libre', status: 'recomendado',
      title: 'Última tarde de playa en Surin',
      maps: { q: 'Surin Beach Phuket', lat: 7.9800, lng: 98.2760 },
    },
    {
      time: '17:30', endTime: '19:00', type: 'visita', status: 'recomendado',
      title: 'Compras en Lotus’s Cherngtalay o mercado local',
      maps: { q: "Lotus's Cherngtalay Phuket", lat: 7.9930, lng: 98.3040 },
    },
    { time: '20:00', type: 'comida', status: 'recomendado', title: 'Última cena en Phuket' },
    {
      time: '21:30', type: 'aviso', status: 'recomendado',
      title: 'Preparar maletas',
      checklist: [
        'Hacer las maletas',
        'Confirmar el traslado al aeropuerto',
        'Descargar las tarjetas de embarque',
        'Revisar el horario del vuelo',
        'Dejar preparada la documentación',
        'Avisar en recepción de la salida temprana',
      ],
    },
  ],
},

/* ===== LUNES 17 DE AGOSTO =============================================== */
{
  date: '2026-08-17', city: 'Phuket → Doha → Barcelona', cityId: 'barcelona',
  title: 'Regreso a casa',
  items: [
    {
      time: '05:30', endTime: '05:45', type: 'traslado', status: 'pendiente',
      title: 'Salida del hotel hacia el aeropuerto',
      warn: 'No hay traslado contratado desde el hotel al aeropuerto.',
      rows: [
        ['Trayecto al aeropuerto', 'Aproximadamente 40 – 60 minutos'],
        ['Llegada recomendada', 'Sobre las 06:30 h'],
      ],
      clocks: { es: '00:30 – 00:45', th: '05:30 – 05:45' },
    },
    {
      time: '09:20', type: 'vuelo', status: 'confirmado',
      title: 'Vuelo QR843 · Phuket → Doha', subtitle: 'Qatar Airways',
      rows: [
        ['Salida', 'Phuket (HKT) · Terminal I · 09:20'],
        ['Llegada', 'Doha (DOH) · 11:50 hora local'],
      ],
      clocks: { es: '04:20', th: '09:20' },
      refs: [['Localizador', '7RUF9V']],
    },
    {
      time: '11:50', type: 'aviso', status: 'confirmado',
      title: 'Llegada a Doha · escala de 3 h 45 min',
      note: 'Hora en España 10:50 · en Tailandia 15:50.',
      maps: { q: 'Hamad International Airport Doha', lat: 25.2731, lng: 51.6081 },
    },
    {
      time: '15:35', type: 'vuelo', status: 'confirmado',
      title: 'Vuelo QR141 · Doha → Barcelona', subtitle: 'Qatar Airways',
      rows: [
        ['Salida', 'Doha (DOH) · 15:35 hora local'],
        ['Llegada', 'Barcelona-El Prat T1 · 21:15'],
      ],
      clocks: { es: '14:35', th: '19:35' },
      refs: [['Localizador', '7RUF9V']],
    },
    {
      time: '21:15', type: 'aviso', status: 'confirmado',
      title: 'Llegada a Barcelona-El Prat · Terminal 1',
      note: 'Hora en España 21:15 · en Tailandia serán las 02:15 del martes 18.\n\nEl traslado de Barcelona a Lleida no está incluido en la documentación.',
      maps: { q: 'Aeropuerto Josep Tarradellas Barcelona-El Prat', lat: 41.2974, lng: 2.0833 },
    },
  ],
},
];

/* --------------------------------------------------------------------------
   VUELOS  (ficha resumida para el apartado Reservas)
   -------------------------------------------------------------------------- */
export const FLIGHTS = [
  {
    id: 'qr146', airline: 'Qatar Airways', number: 'QR146',
    from: 'Barcelona', fromCode: 'BCN', fromTerminal: 'T1',
    to: 'Doha', toCode: 'DOH', toTerminal: '',
    date: '2026-08-09', depart: '16:35', arrive: '23:50', arriveDate: '2026-08-09',
    locator: '7RUF9V', status: 'confirmado',
    baggage: '1 maleta facturada de hasta 25 kg por persona',
    next: 'Escala en Doha de 2 h 10 min',
    esTime: '16:35', thTime: '21:35',
  },
  {
    id: 'qr834', airline: 'Qatar Airways', number: 'QR834',
    from: 'Doha', fromCode: 'DOH', to: 'Bangkok', toCode: 'BKK',
    date: '2026-08-10', depart: '02:00', arrive: '12:55', arriveDate: '2026-08-10',
    locator: '7RUF9V', status: 'confirmado',
    baggage: '1 maleta facturada de hasta 25 kg por persona',
    esTime: '01:00', thTime: '06:00',
  },
  {
    id: 'tg207', airline: 'Thai Airways', number: 'TG207',
    from: 'Bangkok', fromCode: 'BKK', to: 'Phuket', toCode: 'HKT', toTerminal: 'D',
    date: '2026-08-13', depart: '10:50', arrive: '12:20', arriveDate: '2026-08-13',
    locator: '7RUF9V', status: 'confirmado',
    baggage: '1 maleta facturada de hasta 25 kg por persona',
    esTime: '05:50', thTime: '10:50',
  },
  {
    id: 'qr843', airline: 'Qatar Airways', number: 'QR843',
    from: 'Phuket', fromCode: 'HKT', fromTerminal: 'I', to: 'Doha', toCode: 'DOH',
    date: '2026-08-17', depart: '09:20', arrive: '11:50', arriveDate: '2026-08-17',
    locator: '7RUF9V', status: 'confirmado',
    baggage: '1 maleta facturada de hasta 25 kg por persona',
    next: 'Escala en Doha de 3 h 45 min',
    esTime: '04:20', thTime: '09:20',
  },
  {
    id: 'qr141', airline: 'Qatar Airways', number: 'QR141',
    from: 'Doha', fromCode: 'DOH', to: 'Barcelona', toCode: 'BCN', toTerminal: 'T1',
    date: '2026-08-17', depart: '15:35', arrive: '21:15', arriveDate: '2026-08-17',
    locator: '7RUF9V', status: 'confirmado',
    baggage: '1 maleta facturada de hasta 25 kg por persona',
    esTime: '14:35', thTime: '19:35',
  },
];

export const CHECKIN_URL = 'https://www.qatarairways.com/es-es/checkin.html';

/* --------------------------------------------------------------------------
   TRASLADOS
   -------------------------------------------------------------------------- */
export const TRANSFERS = [
  {
    id: 'owt', title: 'Aeropuerto de Bangkok → Hotel',
    company: 'ONWAYTRANSFERS', locator: 'OWT-337654',
    date: '2026-08-10', time: '12:55',
    from: 'Aeropuerto Suvarnabhumi (BKK) · Puerta de salida 4, 2ª planta',
    to: 'Royal Orchid Sheraton Riverside Hotel',
    vehicle: 'Coche privado · categoría económica',
    passengers: 4, status: 'confirmado',
    phones: [['Conductor / traslado', '+66 95 858 0087'], ['Asistencia 24 h', '+34 871 153 847']],
    note: 'El conductor llevará un cartel con el nombre de la reserva.',
    lat: 13.6900, lng: 100.7501,
  },
  {
    id: 'hb', title: 'Hotel → Aeropuerto de Bangkok',
    company: 'HOTELBEDS / Holiday Taxis', locator: '321-10856084',
    date: '2026-08-13', time: '06:25',
    from: 'Royal Orchid Sheraton Riverside Hotel',
    to: 'Aeropuerto Suvarnabhumi (BKK)',
    vehicle: 'Private shuttle',
    passengers: 4, status: 'confirmado',
    phones: [['Teléfono de emergencia', '+34 871 180 153']],
    note: 'Estar preparados en recepción a las 06:10.',
    lat: 13.7263, lng: 100.5122,
  },
  {
    id: 'hkt-in', title: 'Aeropuerto de Phuket → Hotel',
    company: 'Sin contratar', locator: '',
    date: '2026-08-13', time: '12:20',
    from: 'Aeropuerto Internacional de Phuket (HKT)',
    to: 'Twinpalms Surin Beach',
    vehicle: 'Taxi, Grab o traslado privado',
    passengers: 4, status: 'pendiente',
    note: 'Trayecto aproximado de 30–40 minutos. Pendiente de organizar.',
    lat: 8.1132, lng: 98.3169,
  },
  {
    id: 'hkt-out', title: 'Hotel → Aeropuerto de Phuket',
    company: 'Sin contratar', locator: '',
    date: '2026-08-17', time: '05:30',
    from: 'Twinpalms Surin Beach',
    to: 'Aeropuerto Internacional de Phuket (HKT)',
    vehicle: 'Taxi, Grab o traslado privado',
    passengers: 4, status: 'pendiente',
    note: 'Salida recomendada 05:30–05:45. Trayecto de 40–60 min. Pendiente de organizar.',
    lat: 7.9776, lng: 98.2790,
  },
];

/* --------------------------------------------------------------------------
   ALOJAMIENTOS
   -------------------------------------------------------------------------- */
export const STAYS = [
  {
    id: 'sheraton',
    name: 'Royal Orchid Sheraton Riverside Hotel',
    city: 'Bangkok', stars: 5,
    checkin: '2026-08-10', checkinTime: '15:00',
    checkout: '2026-08-13', checkoutTime: '12:00',
    nights: 3,
    address: '2 Charoen Krung Road Soi 30 (Captain Bush Lane), Siphya, Bangrak, Bangkok',
    phone: '+66 2 266 0123',
    room: 'Habitación Doble Deluxe con vistas al río · 4 adultos',
    board: 'Alojamiento y desayuno',
    status: 'confirmado',
    lat: 13.7263, lng: 100.5122,
    website: 'https://www.marriott.com/en-us/hotels/bkksi-royal-orchid-sheraton-riverside-hotel-bangkok/overview/',
    email: 'royalorchid.sheraton@sheraton.com',
    zip: '10500',
    links: [
      ['Web oficial del hotel', 'https://www.marriott.com/en-us/hotels/bkksi-royal-orchid-sheraton-riverside-hotel-bangkok/overview/'],
      ['Cómo llegar y qué hay alrededor', 'https://www.marriott.com/en-us/hotels/bkksi-royal-orchid-sheraton-riverside-hotel-bangkok/maps-directions/'],
      ['Restaurantes del hotel', 'https://www.marriott.com/en-us/hotels/bkksi-royal-orchid-sheraton-riverside-hotel-bangkok/dining/'],
      ['Ver en Google Maps', 'https://www.google.com/maps/search/?api=1&query=Royal+Orchid+Sheraton+Riverside+Hotel+Bangkok'],
    ],
    photo: '',   // pega aquí la URL de una foto real si quieres
    amenities: ['2 piscinas exteriores', 'Spa', 'Centro de bienestar 24 h', 'Pista de tenis',
                'Wifi gratis', 'Conserjería', 'Transporte gratuito hasta 1 km', 'Aparcamiento'],
    warn: 'A pagar en destino: resort fee de 3.000 a 9.000 THB por noche y tasa de 531 a 1.593 THB por noche.',
    notes: 'El hotel pide un depósito de seguridad reembolsable en el check-in. El titular de la reserva debe tener 21 años o más y presentar documento de identidad con foto y tarjeta de crédito.',
  },
  {
    id: 'twinpalms',
    name: 'Twinpalms Surin Beach Phuket',
    city: 'Phuket', stars: 5,
    checkin: '2026-08-13', checkinTime: '14:00',
    checkout: '2026-08-17', checkoutTime: '12:00',
    nights: 4,
    address: '106/46 Moo 3, Surin Beach Road, Cherngtalay, Phuket',
    phone: '+66 76 316 500',
    room: 'Dúplex Loft · 4 adultos',
    board: 'Alojamiento y desayuno',
    status: 'confirmado',
    lat: 7.9776, lng: 98.2790,
    website: 'https://www.twinpalms-phuket.com/',
    email: 'book@twinpalms-phuket.com',
    zip: '83110',
    links: [
      ['Web oficial del hotel', 'https://www.twinpalms-phuket.com/'],
      ['Restaurantes y bares', 'https://www.twinpalms-phuket.com/restaurants-bars/'],
      ['Cómo llegar', 'https://www.twinpalms-phuket.com/contact-us/'],
      ['Ver en Google Maps', 'https://www.google.com/maps/search/?api=1&query=Twinpalms+Surin+Beach+Phuket'],
    ],
    photo: '',   // pega aquí la URL de una foto real si quieres
    amenities: ['Piscina exterior', 'Baño turco', 'Gimnasio', 'Spa', 'Wifi gratis',
                'Transporte gratuito a la playa', 'Recepción 24 h', 'Tintorería'],
    notes: 'El día 17 hay que salir muy temprano hacia el aeropuerto: conviene avisar en recepción la noche anterior y pedir desayuno para llevar si es posible.',
  },
];

/* --------------------------------------------------------------------------
   EXCURSIONES
   -------------------------------------------------------------------------- */
export const EXCURSIONS = [
  {
    id: 'mercados',
    title: 'Mercado flotante y mercado sobre la vía del tren',
    provider: 'Civitatis · ASKDISCOVERY Tailandia',
    date: '2026-08-11', start: '09:00', end: '17:00',
    duration: '6 – 8 horas',
    meeting: 'Heladería Swensen’s Bang Lamphu, junto a Banglamphu Square',
    address: '2 Thanon Tanao, Talat Yot, Bangkok',
    meetTime: '08:45',
    lat: 13.7590, lng: 100.4988,
    people: 4, price: 196, currency: 'EUR', priceLabel: 'total 4 personas',
    booking: 'A40188327', status: 'confirmado', payment: 'pagado',
    phone: '+66 81 492 6380',
    photo: '',   // pega aquí la URL de una foto si quieres
    includes: ['Guía', 'Transporte durante la excursión', 'Visita al mercado flotante',
               'Visita al mercado sobre la vía del tren'],
    excludes: ['Recogida en el hotel', 'Comidas', 'Paseo opcional en barca de remos'],
    bring: ['Gorra o sombrero', 'Protector solar', 'Agua', 'Efectivo en bahts', 'Calzado cómodo'],
    tips: 'Hay que llegar por cuenta propia al punto de encuentro. Desde el hotel, en taxi o Grab, calculad unos 30–40 minutos con tráfico.',
  },
  {
    id: 'tuktuk',
    title: 'Tour en tuk-tuk por Bangkok',
    provider: 'Civitatis',
    date: '2026-08-12', start: '18:30', end: '21:30',
    duration: '3 horas',
    meeting: 'Cafetería Bun Coffee, estación de tren de Hua Lamphong',
    address: '191 Rama IV Road, Bangkok',
    meetTime: '18:15',
    lat: 13.7379, lng: 100.5170,
    people: 4, price: 136, currency: 'EUR', priceLabel: 'total 4 personas',
    booking: 'A40188349', status: 'confirmado', payment: 'pagado',
    photo: '',   // pega aquí la URL de una foto si quieres
    includes: ['Tuk-tuk', 'Audioguía en español', 'Recorrido nocturno por la ciudad'],
    excludes: ['Auriculares', 'Comidas y bebidas', 'Entradas a monumentos'],
    bring: ['Auriculares propios (imprescindibles)', 'Ropa cómoda', 'Chubasquero fino'],
    tips: 'Se puede llegar en taxi, Grab o con la línea azul del metro hasta MRT Hua Lamphong.',
  },
  {
    id: 'phangnga',
    title: 'Bahía de Phang Nga · James Bond Island',
    provider: 'Por reservar',
    date: '2026-08-15', start: '', end: '',
    duration: 'Día completo',
    meeting: 'Por confirmar',
    lat: 8.2740, lng: 98.5000,
    people: 4, price: null, currency: 'THB',
    booking: '', status: 'pendiente', payment: 'pendiente',
    photo: '',   // pega aquí la URL de una foto si quieres
    includes: ['Paseo en barco', 'Cuevas y formaciones rocosas', 'Kayak (según excursión)'],
    excludes: [],
    bring: ['Bañador', 'Toalla', 'Protector solar', 'Calzado de agua', 'Bolsa impermeable'],
    tips: 'Opción interesante en agosto porque la bahía está más protegida que otras zonas marítimas.',
  },
  {
    id: 'phiphi',
    title: 'Islas Phi Phi y Maya Bay',
    provider: 'Por reservar',
    date: '2026-08-15', start: '', end: '',
    duration: 'Día completo',
    meeting: 'Por confirmar',
    lat: 7.7407, lng: 98.7784,
    people: 4, price: null, currency: 'THB',
    booking: '', status: 'pendiente', payment: 'pendiente',
    photo: '',   // pega aquí la URL de una foto si quieres
    includes: ['Phi Phi Don', 'Phi Phi Leh', 'Maya Bay', 'Snorkel', 'Pi Leh Lagoon'],
    excludes: [],
    bring: ['Bañador', 'Snorkel', 'Protector solar sin oxibenzona', 'Toalla', 'Pastillas para el mareo'],
    tips: 'En agosto puede haber oleaje y excursiones canceladas por el tiempo: conviene reservar con cancelación flexible.',
  },
];

/* --------------------------------------------------------------------------
   PUNTOS DEL MAPA
   cat: ciudad · aeropuerto · hotel · excursion · restaurante · monumento ·
        playa · compras · transporte · hospital · farmacia · embajada · interes
   -------------------------------------------------------------------------- */
export const PLACES = [
  // Ciudades
  { name: 'Bangkok', cat: 'ciudad', lat: 13.7563, lng: 100.5018, note: '10 – 13 de agosto' },
  { name: 'Phuket', cat: 'ciudad', lat: 7.8804, lng: 98.3923, note: '13 – 17 de agosto' },

  // Aeropuertos
  { name: 'Aeropuerto Suvarnabhumi (BKK)', cat: 'aeropuerto', lat: 13.6900, lng: 100.7501,
    note: 'Llegada 10 ago · Salida 13 ago' },
  { name: 'Aeropuerto Internacional de Phuket (HKT)', cat: 'aeropuerto', lat: 8.1132, lng: 98.3169,
    note: 'Llegada 13 ago · Salida 17 ago' },
  { name: 'Aeropuerto Barcelona-El Prat (BCN)', cat: 'aeropuerto', lat: 41.2974, lng: 2.0833,
    note: 'Terminal 1' },

  // Hoteles
  { name: 'Royal Orchid Sheraton Riverside', cat: 'hotel', lat: 13.7263, lng: 100.5122,
    note: 'Bangkok · 10-13 ago', phone: '+66 2 266 0123' },
  { name: 'Twinpalms Surin Beach', cat: 'hotel', lat: 7.9776, lng: 98.2790,
    note: 'Phuket · 13-17 ago', phone: '+66 76 316 500' },

  // Excursiones y puntos de encuentro
  { name: 'Punto de encuentro · Swensen’s Bang Lamphu', cat: 'excursion', lat: 13.7590, lng: 100.4988,
    note: '11 ago · 08:45 h' },
  { name: 'Punto de encuentro · Bun Coffee, Hua Lamphong', cat: 'excursion', lat: 13.7379, lng: 100.5170,
    note: '12 ago · 18:15 h' },
  { name: 'Bahía de Phang Nga', cat: 'excursion', lat: 8.2740, lng: 98.5000, note: 'Excursión opcional' },
  { name: 'Islas Phi Phi', cat: 'excursion', lat: 7.7407, lng: 98.7784, note: 'Excursión opcional' },

  // Monumentos y visitas · Bangkok
  { name: 'Gran Palacio y Wat Phra Kaew', cat: 'monumento', lat: 13.7500, lng: 100.4913,
    note: 'Hombros y rodillas cubiertos' },
  { name: 'Wat Pho (Buda reclinado)', cat: 'monumento', lat: 13.7465, lng: 100.4927 },
  { name: 'Wat Arun (Templo del Amanecer)', cat: 'monumento', lat: 13.7437, lng: 100.4889 },
  { name: 'Wat Saket y Golden Mount', cat: 'monumento', lat: 13.7538, lng: 100.5065 },
  { name: 'Wat Bowonniwet', cat: 'monumento', lat: 13.7601, lng: 100.4977 },
  { name: 'Khao San Road', cat: 'interes', lat: 13.7590, lng: 100.4977 },
  { name: 'Chinatown · Yaowarat', cat: 'interes', lat: 13.7400, lng: 100.5100 },
  { name: 'Talat Noi', cat: 'interes', lat: 13.7350, lng: 100.5130 },
  { name: 'Tha Tien', cat: 'transporte', lat: 13.7434, lng: 100.4924, note: 'Embarcadero para Wat Arun' },
  { name: 'Estación Hua Lamphong (MRT línea azul)', cat: 'transporte', lat: 13.7379, lng: 100.5170 },

  // Compras · Bangkok
  { name: 'ICONSIAM', cat: 'compras', lat: 13.7264, lng: 100.5100, note: 'Al otro lado del río' },
  { name: 'River City Bangkok', cat: 'compras', lat: 13.7305, lng: 100.5136 },

  // Phuket
  { name: 'Surin Beach', cat: 'playa', lat: 7.9800, lng: 98.2760, note: 'Playa del hotel' },
  { name: 'Bang Tao Beach', cat: 'playa', lat: 8.0000, lng: 98.2930 },
  { name: 'Kamala Beach', cat: 'playa', lat: 7.9540, lng: 98.2830 },
  { name: 'Kata Beach', cat: 'playa', lat: 7.8180, lng: 98.2980 },
  { name: 'Karon Beach y mirador', cat: 'playa', lat: 7.8460, lng: 98.2950 },
  { name: 'Phuket Old Town', cat: 'interes', lat: 7.8846, lng: 98.3878 },
  { name: 'Wat Chalong', cat: 'monumento', lat: 7.8460, lng: 98.3370 },
  { name: 'Big Buddha', cat: 'monumento', lat: 7.8277, lng: 98.3120 },
  { name: 'Promthep Cape', cat: 'interes', lat: 7.7620, lng: 98.3050, note: 'Puesta de sol' },
  { name: 'Cherngtalay', cat: 'interes', lat: 7.9930, lng: 98.3040, note: 'Mercado local' },
  { name: "Lotus's Market Cherngtalay", cat: 'compras', lat: 7.9930, lng: 98.3040 },

  // Comer y comprar
  { name: 'Tops Market · Robinson Bang Rak', cat: 'compras', lat: 13.7205, lng: 100.5155,
    note: 'Supermercado · 08:00-22:00', q: 'Tops Robinson Bang Rak Charoen Krung Bangkok' },
  { name: 'Street food de Bang Rak', cat: 'restaurante', lat: 13.7250, lng: 100.5160,
    note: 'Comida callejera · 1,30-4 € por plato', q: 'Bang Rak street food Charoen Krung Bangkok' },
  { name: 'Boat Avenue y Porto de Phuket', cat: 'compras', lat: 7.9968, lng: 98.2965,
    note: 'Restaurantes y supermercados · mercado los viernes 16:00-21:00',
    q: 'Boat Avenue Cherngtalay Phuket' },
  { name: 'Villa Market · Boat Avenue', cat: 'compras', lat: 7.9968, lng: 98.2968,
    note: 'Supermercado · 10:00-22:00', q: 'Villa Market Boat Avenue Phuket' },
  { name: 'Restaurantes de Surin Beach Road', cat: 'restaurante', lat: 7.9790, lng: 98.2775,
    note: '6,50-15,50 € por persona', q: 'restaurants Surin Beach Road Phuket' },

  // Salud y emergencias
  { name: 'Bumrungrad International Hospital', cat: 'hospital', lat: 13.7470, lng: 100.5527,
    note: 'Bangkok · atención a extranjeros', phone: '+66 2 066 8888' },
  { name: 'BNH Hospital', cat: 'hospital', lat: 13.7290, lng: 100.5370,
    note: 'Bangkok · céntrico', phone: '+66 2 022 0700' },
  { name: 'Bangkok Hospital Phuket', cat: 'hospital', lat: 7.8890, lng: 98.3820,
    note: 'Phuket', phone: '+66 76 254 425' },
  { name: 'Embajada de España en Bangkok', cat: 'embajada', lat: 13.7253, lng: 100.5600,
    note: 'Lake Rajada Office Complex, 193/98 Ratchadapisek Rd', phone: '+66 2 661 8284' },
];

/* --------------------------------------------------------------------------
   GASTOS YA CONOCIDOS
   -------------------------------------------------------------------------- */
export const BASE_EXPENSES = [
  { id: 'b1', title: 'Paquete Logitravel: vuelos, hoteles y traslados',
    amount: 5813.16, currency: 'EUR', cat: 'vuelos', date: '2026-06-25',
    paidBy: 'montse', split: ['montse','carmen','alba','biel'], status: 'pagado',
    note: 'Precio base 5.923,16 € menos 110,00 € de rebajas de verano.' },
  { id: 'b2', title: 'Tasas aéreas',
    amount: 1958.84, currency: 'EUR', cat: 'vuelos', date: '2026-06-25',
    paidBy: 'montse', split: ['montse','carmen','alba','biel'], status: 'pagado',
    note: '489,71 € por persona.' },
  { id: 'b3', title: 'Seguro multirriesgo de anulación y asistencia',
    amount: 397.44, currency: 'EUR', cat: 'seguro', date: '2026-06-25',
    paidBy: 'montse', split: ['montse','carmen','alba','biel'], status: 'pagado',
    note: '99,36 € por persona. No reembolsable.' },
  { id: 'b4', title: 'Excursión mercado flotante y mercado ferroviario',
    amount: 196, currency: 'EUR', cat: 'excursiones', date: '2026-07-01',
    paidBy: 'montse', split: ['montse','carmen','alba','biel'], status: 'pagado',
    note: 'Civitatis · reserva A40188327.' },
  { id: 'b5', title: 'Tour en tuk-tuk por Bangkok',
    amount: 136, currency: 'EUR', cat: 'excursiones', date: '2026-07-01',
    paidBy: 'montse', split: ['montse','carmen','alba','biel'], status: 'pagado',
    note: 'Civitatis · reserva A40188349.' },
];

export const EXPENSE_CATS = {
  vuelos:      { label: 'Vuelos',      color: '#2563EB' },
  alojamiento: { label: 'Alojamiento', color: '#12876F' },
  transporte:  { label: 'Transporte',  color: '#7A5AF8' },
  comida:      { label: 'Comida',      color: '#D98A0B' },
  excursiones: { label: 'Excursiones', color: '#E8664B' },
  entradas:    { label: 'Entradas',    color: '#19C2BE' },
  compras:     { label: 'Compras',     color: '#DB2777' },
  seguro:      { label: 'Seguro',      color: '#0B7F8C' },
  salud:       { label: 'Salud',       color: '#DC2626' },
  otros:       { label: 'Otros',       color: '#6D827D' },
};

/* --------------------------------------------------------------------------
   LISTAS Y EQUIPAJE
   -------------------------------------------------------------------------- */
export const LISTS = [
  {
    id: 'semana-antes', name: 'Una semana antes', icon: 'clock',
    subtitle: 'Repasadla el domingo 2 de agosto',
    items: [
      { h: '1 · Documentación' },
      { t: 'Comprobar que los cuatro pasaportes tienen 6 meses de validez — COMPROBADO, los cuatro sirven', due: '2026-08-02' },
      { t: 'Revisar que los nombres de los billetes coincidan exactamente con los pasaportes', due: '2026-08-02' },
      { t: 'Descargar en el móvil los billetes de avión', due: '2026-08-03' },
      { t: 'Descargar en el móvil los bonos de los hoteles', due: '2026-08-03' },
      { t: 'Descargar en el móvil los bonos de los traslados', due: '2026-08-03' },
      { t: 'Descargar en el móvil los bonos de las excursiones', due: '2026-08-03' },
      { t: 'Descargar en el móvil las pólizas de seguro y el contrato del viaje', due: '2026-08-03' },
      { t: 'Guardar una copia de todo en Google Drive o similar', due: '2026-08-03' },
      { t: 'Imprimir una copia de los documentos principales', due: '2026-08-04' },
      { t: 'Comprobar la normativa oficial de visado antes de salir', due: '2026-08-04' },

      { h: '2 · Thailand Digital Arrival Card' },
      { t: 'Reunir los datos: pasaportes, número de vuelo, fecha de llegada, dirección del hotel de Bangkok y correo', due: '2026-08-07' },
      { t: 'Completar la TDAC de los cuatro (a partir del 8 de agosto)', due: '2026-08-08' },
      { t: 'Descargar y guardar el comprobante de la TDAC', due: '2026-08-08' },

      { h: '3 · Traslados pendientes' },
      { t: 'Contratar el traslado aeropuerto de Phuket → Twinpalms Surin Beach (13 de agosto)', due: '2026-08-05' },
      { t: 'Contratar el traslado Twinpalms Surin Beach → aeropuerto de Phuket (17 de agosto)', due: '2026-08-05' },
      { t: 'Confirmar la hora exacta de recogida de los dos traslados', due: '2026-08-05' },
      { t: 'Confirmar el precio', due: '2026-08-05' },
      { t: 'Confirmar vehículo para cuatro personas y espacio para cuatro maletas', due: '2026-08-05' },
      { t: 'Preguntar si aceptan maletas de hasta 25 kg (los bonos indican 23 kg)', due: '2026-08-05' },

      { h: '4 · Excursiones' },
      { t: 'Decidir sobre la excursión de los mercados antes del 4 de agosto a las 09:00 de Bangkok', due: '2026-08-04' },
      { t: 'Revisar y guardar el bono del mercado flotante (11 ago · 09:00 · estar a las 08:45)', due: '2026-08-05' },
      { t: 'Revisar y guardar el bono del tour en tuk-tuk (12 ago · 18:30 · estar a las 18:15)', due: '2026-08-05' },
      { t: 'Reservar la excursión opcional de Phuket con cancelación flexible', due: '2026-08-06' },

      { h: '5 · Vuelos' },
      { t: 'Confirmar los vuelos en la web de Qatar Airways', due: '2026-08-07' },
      { t: 'Confirmar el vuelo interno en la web de Thai Airways', due: '2026-08-07' },
      { t: 'Revisar horarios, terminales y posibles cambios', due: '2026-08-07' },
      { t: 'Comprobar cuándo se abre el check-in online (unas 48 h antes)', due: '2026-08-07' },
      { t: 'Descargar las tarjetas de embarque cuando estén disponibles', due: '2026-08-08' },

      { h: '6 · Salida desde Lleida' },
      { t: 'Confirmar la hora exacta de recogida con quien os lleva', due: '2026-08-05' },
      { t: 'Confirmar el punto de salida', due: '2026-08-05' },
      { t: 'Confirmar el número de maletas que caben', due: '2026-08-05' },
      { t: 'Confirmar la hora prevista de llegada al aeropuerto (13:45–14:00)', due: '2026-08-05' },

      { h: '7 · Dinero y tarjetas' },
      { t: 'Avisar al banco de que viajáis a Tailandia', due: '2026-08-05' },
      { t: 'Comprobar límites y comisiones de las tarjetas', due: '2026-08-05' },
      { t: 'Preparar dos tarjetas Visa/Mastercard distintas', due: '2026-08-06' },
      { t: 'Guardar una tarjeta separada del resto', due: '2026-08-08' },
      { t: 'Llevar algo de efectivo en euros para cambiar a bahts', due: '2026-08-07' },
      { t: 'Descargar la aplicación bancaria en el móvil', due: '2026-08-06' },

      { h: '8 · Móvil e internet' },
      { t: 'Contratar una eSIM o preparar una tarjeta SIM', due: '2026-08-06' },
      { t: 'Comprobar que el móvil está liberado', due: '2026-08-04' },
      { t: 'Descargar Google Maps para usarlo sin conexión', due: '2026-08-06' },
      { t: 'Descargar Grab para taxis y desplazamientos', due: '2026-08-06' },
      { t: 'Descargar un traductor con tailandés sin conexión', due: '2026-08-06' },
      { t: 'Preparar cargadores y baterías externas', due: '2026-08-08' },
      { t: 'Guardar en favoritos los hoteles, aeropuertos y puntos de encuentro', due: '2026-08-06' },

      { h: '9 · Seguro' },
      { t: 'Guardar los teléfonos de asistencia en el móvil', due: '2026-08-06' },
      { t: 'Apuntar los números de póliza: ESF54-I24-600A y ESF76-I24-50A', due: '2026-08-06' },

      { h: '10 · Equipaje' },
      { t: 'Preparar una maleta ligera y dejar espacio para las compras', due: '2026-08-08' },
      { t: 'Repasar la lista de ropa y equipaje', due: '2026-08-08' },
      { t: 'Repasar el botiquín', due: '2026-08-08' },
      { t: 'No olvidar los auriculares para la excursión en tuk-tuk', due: '2026-08-08' },

      { h: '11 · Si vais a conducir en Phuket' },
      { t: 'Solicitar el permiso internacional de conducción en la DGT (10,51 € · se puede pedir online)', due: '2026-08-03' },
      { t: 'Llevar los DOS permisos juntos: el español y el internacional', due: '2026-08-08' },
      { t: 'Comprobar si el seguro cubre conducir coche o moto', due: '2026-08-05' },
      { t: 'Recordar: el casco es obligatorio y la policía lo controla', due: '2026-08-08' },

      { h: '12 · Salud y seguridad' },
      { t: 'Consultar las recomendaciones sanitarias oficiales', due: '2026-08-04' },
      { t: 'Llevar medicación suficiente y siempre en su envase original', due: '2026-08-08' },
      { t: 'Recordar: beber siempre agua embotellada' },
      { t: 'Recordar: no dejar pasaportes ni tarjetas en la maleta facturada' },
    ],
  },
  {
    id: 'dia-antes', name: 'El día antes de salir', icon: 'check',
    subtitle: 'Sábado 8 de agosto · última comprobación',
    items: [
      { t: 'Pasaportes', due: '2026-08-08' },
      { t: 'Billetes', due: '2026-08-08' },
      { t: 'TDAC', due: '2026-08-08' },
      { t: 'Tarjetas de embarque', due: '2026-08-08' },
      { t: 'Dinero y tarjetas', due: '2026-08-08' },
      { t: 'Móvil y cargadores', due: '2026-08-08' },
      { t: 'Traslado Lleida – Barcelona confirmado', due: '2026-08-08' },
      { t: 'Traslado aeropuerto – hotel en Phuket confirmado', due: '2026-08-08' },
      { t: 'Traslado hotel – aeropuerto en Phuket confirmado', due: '2026-08-08' },
      { t: 'Bonos de las excursiones', due: '2026-08-08' },
      { t: 'Seguro', due: '2026-08-08' },
      { t: 'Medicación', due: '2026-08-08' },
      { t: 'Equipaje cerrado', due: '2026-08-08' },
    ],
  },
  {
    id: 'documentacion', name: 'Documentación que llevar', icon: 'file',
    items: [
      { t: 'Pasaporte original en vigor (validez mínima de 6 meses)' },
      { t: 'Copia digital del pasaporte' },
      { t: 'Copia impresa del pasaporte' },
      { t: 'Comprobante de la TDAC' },
      { t: 'Billete de salida de Tailandia' },
      { t: 'Reservas de los hoteles' },
      { t: 'Bonos de los traslados' },
      { t: 'Bonos de las excursiones' },
      { t: 'Pólizas del seguro' },
      { t: 'Tarjetas de embarque' },
      { t: 'Localizadores de vuelos y reservas' },
      { t: 'DNI' },
      { t: 'Permiso de conducir español (si vais a alquilar coche o moto)' },
      { t: 'Permiso internacional de conducción (obligatorio junto al español)' },
      { t: 'Tarjeta sanitaria y receta de la medicación habitual' },
    ],
  },
  {
    id: 'ropa', name: 'Ropa y equipaje', icon: 'luggage',
    items: [
      { t: 'Ropa fresca y transpirable (algodón o lino)' },
      { t: 'Chubasquero fino o paraguas plegable' },
      { t: 'Ropa para templos: hombros y rodillas cubiertos' },
      { t: 'Bañador y pareo' },
      { t: 'Sandalias y chanclas' },
      { t: 'Calzado cómodo de andar' },
      { t: 'Calzado que se quite fácil (templos)' },
      { t: 'Gafas de sol y gorra o sombrero' },
      { t: 'Una prenda de manga larga (aire acondicionado y aviones)' },
      { t: 'Bolsa de tela para la ropa sucia' },
      { t: 'Mochila pequeña para el día a día' },
      { t: 'Bolsa impermeable para móvil y documentos' },
    ],
  },
  {
    id: 'botiquin', name: 'Botiquín', icon: 'pill',
    items: [
      { t: 'Medicación habitual en su envase original + receta' },
      { t: 'Paracetamol e ibuprofeno' },
      { t: 'Antidiarreico y suero oral' },
      { t: 'Antihistamínico' },
      { t: 'Repelente de mosquitos' },
      { t: 'Protector solar 50+ y aftersun' },
      { t: 'Tiritas y gasas' },
      { t: 'Gel hidroalcohólico' },
      { t: 'Pastillas para el mareo (excursiones en barco)' },
    ],
  },
  {
    id: 'higiene', name: 'Higiene', icon: 'heart',
    items: [
      { t: 'Neceser' },
      { t: 'Cepillo y pasta de dientes' },
      { t: 'Desodorante' },
      { t: 'Champú y gel (tamaño viaje)' },
      { t: 'Toallitas húmedas' },
      { t: 'Toalla de microfibra' },
    ],
  },
  {
    id: 'tecnologia', name: 'Tecnología', icon: 'plug',
    items: [
      { t: 'Adaptador de enchufe (tipos A, B y C)' },
      { t: 'Cargadores y cables' },
      { t: 'Batería externa (en el equipaje de mano)' },
      { t: 'Auriculares — imprescindibles para el tuk-tuk del día 12' },
      { t: 'Cámara de fotos' },
      { t: 'Funda impermeable para el móvil' },
      { t: 'eSIM o SIM tailandesa activada' },
    ],
  },
  {
    id: 'dinero', name: 'Dinero y tarjetas', icon: 'wallet',
    items: [
      { t: 'Dos tarjetas Visa/Mastercard' },
      { t: 'Tarjeta de crédito para el depósito del hotel de Bangkok' },
      { t: 'Efectivo en euros para cambiar' },
      { t: 'Bahts para el primer día' },
      { t: 'Una tarjeta guardada aparte del resto' },
      { t: 'Copia o foto de las tarjetas' },
      { t: 'Banco avisado del viaje' },
    ],
  },
  {
    id: 'compras', name: 'Compras comunes del grupo', icon: 'users',
    items: [
      { t: 'Agua embotellada' },
      { t: 'Snacks para las excursiones' },
      { t: 'Protector solar tamaño grande' },
      { t: 'Repelente de mosquitos para el grupo' },
    ],
  },
];

/* --------------------------------------------------------------------------
   AVISOS DEL INICIO
   -------------------------------------------------------------------------- */
export const NOTICES = [
  { level: 'urgente', title: 'Reembolso de la excursión de los mercados: hasta el 4 de agosto',
    body: 'La excursión del mercado flotante (reserva A40188327) tiene reembolso completo hasta el 4 de agosto a las 09:00, hora de Bangkok. A partir de esa hora las condiciones de devolución son más limitadas.',
    until: '2026-08-04' },
  { level: 'urgente', title: 'Traslados de Phuket sin contratar',
    body: 'Faltan los dos traslados de Phuket: aeropuerto → hotel el día 13 y hotel → aeropuerto el día 17 (con salida sobre las 05:30). Hay que organizarlos antes de viajar.',
    until: '2026-08-13' },
  { level: 'aviso', title: 'TDAC: prepararla a partir del 8 de agosto',
    body: 'Todos los viajeros deben completar la Thailand Digital Arrival Card dentro de los tres días anteriores a la llegada. Llegáis el 10 de agosto, así que se prepara a partir del 8. Es gratuita.',
    link: ['Rellenar la TDAC', 'https://tdac.immigration.go.th'],
    until: '2026-08-10' },
  { level: 'aviso', title: 'Tasas del hotel de Bangkok a pagar en destino',
    body: 'Resort fee de 3.000 a 9.000 THB por noche y tasa de 531 a 1.593 THB por noche. Además, el hotel pide un depósito reembolsable con tarjeta de crédito en el check-in.',
    until: '2026-08-13' },
  { level: 'info', title: 'Check-in online 48 horas antes',
    body: 'Localizador 7RUF9V. Conviene hacerlo en cuanto se abra para elegir asientos juntos.',
    link: ['Check-in Qatar Airways', 'https://www.qatarairways.com/es-es/checkin.html'],
    until: '2026-08-09' },
  { level: 'info', title: 'Auriculares para el tour en tuk-tuk',
    body: 'La audioguía en español del día 12 necesita auriculares propios. Que no se olviden.',
    until: '2026-08-12' },
];

/* --------------------------------------------------------------------------
   INFORMACIÓN ÚTIL
   -------------------------------------------------------------------------- */
export const INFO = [
  {
    id: 'semana-antes', icon: 'clock', title: 'Qué hacer una semana antes',
    body: `La salida es el **domingo 9 de agosto**, así que esta lista corresponde aproximadamente al **domingo 2 de agosto**.

**1. Documentación**
· Comprobar que todos los pasaportes tienen una validez mínima de seis meses desde la entrada en Tailandia.
· Revisar que los nombres de los billetes coincidan exactamente con los pasaportes.
· Descargar en el móvil: billetes de avión, bonos de hoteles, bonos de traslados, bonos de excursiones, pólizas de seguro y contrato del viaje.
· Guardar una copia en Google Drive o similar.
· Llevar también una copia impresa de los documentos principales.

Para ciudadanos españoles actualmente no se exige visado para estancias turísticas, pero conviene comprobar la normativa oficial antes de salir.

**2. Thailand Digital Arrival Card**
La TDAC debe cumplimentarse dentro de los tres días anteriores a la llegada. Como llegáis el 10 de agosto, prepararla a partir del 8 de agosto.

Necesitaréis: datos del pasaporte, número de vuelo, fecha de llegada, dirección del hotel de Bangkok, información del viaje y correo electrónico. Después, descargar y guardar el comprobante.

**3. Traslados pendientes**
Confirmar los dos traslados que no aparecen contratados:
· Aeropuerto de Phuket → Twinpalms Surin Beach, el 13 de agosto.
· Twinpalms Surin Beach → aeropuerto de Phuket, el 17 de agosto.

Conviene confirmar también la hora exacta de recogida, el precio, el tipo de vehículo para cuatro personas, el espacio para cuatro maletas y si aceptan equipaje de hasta 25 kg.

Los bonos de traslado indican un límite de 23 kg por maleta, mientras que los vuelos incluyen hasta 25 kg.

**4. Excursiones**
Revisar y guardar los dos bonos.

**11 de agosto** — Mercado flotante y mercado ferroviario. Punto de encuentro: Swensen's Bang Lamphu. Hora: 09:00 h, estar allí a las 08:45 h.

**12 de agosto** — Tour en tuk-tuk. Punto de encuentro: Bun Coffee, estación Hua Lamphong. Hora: 18:30 h, estar allí a las 18:15 h. Llevar auriculares propios.

La primera excursión tenía reembolso completo hasta el 4 de agosto a las 09:00 h de Bangkok. Después de esa fecha las condiciones de devolución son más limitadas.

**5. Vuelos**
· Confirmar los vuelos en la web de Qatar Airways y Thai Airways.
· Revisar horarios, terminales y posibles cambios.
· Comprobar cuándo se abre el check-in online, normalmente unas 48 horas antes.
· Descargar las tarjetas de embarque cuando estén disponibles.
· Confirmar el localizador: 7RUF9V.

**6. Salida desde Lleida**
Confirmar con la persona que os lleva la hora exacta de recogida, el punto de salida, el número de maletas y la hora prevista de llegada al aeropuerto.

Como orientación: salida de Lleida 11:45–12:00 h, llegada al aeropuerto de Barcelona 13:45–14:00 h, vuelo a las 16:35 h desde la Terminal 1.

**7. Dinero y tarjetas**
· Avisar al banco de que viajaréis a Tailandia.
· Comprobar límites y comisiones de las tarjetas.
· Llevar dos tarjetas diferentes y guardar una separada del resto.
· Llevar algo de efectivo en euros para cambiar a bahts.
· Descargar la aplicación bancaria.
· No depender únicamente de pagos con tarjeta o códigos QR.

Visa y Mastercard funcionan en hoteles, aeropuertos, supermercados y centros comerciales, pero para mercados, taxis, puestos callejeros y restaurantes pequeños hace falta efectivo.

**8. Móvil e internet**
· Contratar una eSIM o preparar una tarjeta SIM.
· Comprobar que el móvil esté liberado.
· Descargar Google Maps para utilizarlo sin conexión.
· Descargar Grab para taxis y desplazamientos.
· Descargar una aplicación de traducción con tailandés sin conexión.
· Llevar cargadores y baterías externas.
· Guardar en favoritos los hoteles, aeropuertos y puntos de encuentro.

**9. Seguro**
Guardar los teléfonos de asistencia y llevar siempre a mano los números de póliza: Inclusión ESF54-I24-600A y Multirriesgo Basic ESF76-I24-50A.

**10. Equipaje**
Preparar una maleta ligera y dejar espacio para las compras. Imprescindibles: ropa fresca y transpirable, chubasquero fino, calzado cómodo, sandalias, bañador, protector solar, repelente de mosquitos, medicación habitual, botiquín básico, adaptador de enchufe, auriculares para la excursión en tuk-tuk, copia del pasaporte y bolsa impermeable para móvil y documentos.

**11. Salud y seguridad**
· Consultar las recomendaciones sanitarias oficiales.
· Llevar medicación suficiente y siempre en su envase original.
· Beber agua embotellada.
· Contratar excursiones marítimas con cancelación flexible por el tiempo en Phuket.
· No dejar pasaportes ni tarjetas en la maleta facturada.

**12. Última comprobación antes de salir**
El día anterior, revisar: pasaportes, billetes, TDAC, tarjetas de embarque, dinero y tarjetas, móvil y cargadores, traslado Lleida–Barcelona, los dos traslados de Phuket, bonos de excursiones, seguro, medicación y equipaje.`,
    links: [
      ['Rellenar la TDAC (web oficial)', 'https://tdac.immigration.go.th'],
      ['Recomendaciones de viaje · Exteriores', 'https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=tailandia'],
      ['Check-in Qatar Airways', 'https://www.qatarairways.com/es-es/checkin.html'],
    ],
  },
  {
    id: 'ritmo', icon: 'heart', title: 'El ritmo del viaje',
    body: `**Bangkok** — dos excursiones contratadas y una tarde de templos.

**Phuket** — una excursión opcional de día completo.

**Descanso en el hotel de Phuket:**
· 13 de agosto por la tarde
· 14 de agosto prácticamente todo el día
· 16 de agosto prácticamente todo el día

**Playas:** 14 y 16 de agosto.

**Excursión recomendada en Phuket:** bahía de Phang Nga.

La idea es no saturar el viaje: días intensos en Bangkok y descanso real en Phuket.`,
  },
  {
    id: 'equipaje', icon: 'luggage', title: 'Equipaje',
    body: `Los vuelos incluyen **una maleta facturada de hasta 25 kg por persona**.

Sin embargo, los bonos de traslado indican como límite **una maleta de 23 kg por persona**, por lo que conviene confirmarlo con las empresas de transporte.`,
    actions: [['Llamar a Logitravel', 'tel:+34971747676']],
  },
  {
    id: 'documentacion', icon: 'file', title: 'Documentación y entrada en Tailandia',
    body: `**Pasaporte** en vigor con una validez mínima de seis meses desde la entrada en Tailandia, según las recomendaciones del Ministerio de Asuntos Exteriores español.

**Visado:** actualmente los ciudadanos españoles no necesitan visado para estancias turísticas, aunque conviene comprobar la normativa justo antes de viajar porque puede cambiar.

**TDAC:** todos los viajeros extranjeros deben completar la Thailand Digital Arrival Card dentro de los tres días anteriores a la llegada. Se tramita gratuitamente en la web oficial.

Es recomendable llevar:
· Pasaporte original
· Copia digital del pasaporte
· Billete de salida de Tailandia
· Reservas de los hoteles
· Seguro de viaje
· Tarjetas de embarque
· Localizadores de vuelos y reservas`,
    links: [
      ['Rellenar la TDAC (web oficial)', 'https://tdac.immigration.go.th'],
      ['Recomendaciones de viaje · Exteriores', 'https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=tailandia'],
    ],
  },
  {
    id: 'seguros', icon: 'shield', title: 'Seguros',
    body: `Están contratados **dos seguros** para los cuatro viajeros.

**Seguro de Inclusión** — póliza ESF54-I24-600A
· Cobertura del 9 al 17 de agosto
· Asistencia médica mundial hasta 3.000 €
· Repatriación médica ilimitada
· Pérdida de equipaje hasta 300 €
· Cobertura por quiebra de proveedores y fuerza mayor

**Seguro Multirriesgo Basic** — póliza ESF76-I24-50A
· Asistencia médica mundial hasta 60.000 €
· Repatriación ilimitada
· Anulación hasta 2.000 €
· Interrupción del viaje hasta 1.500 €
· Pérdida de equipaje hasta 1.500 €
· Responsabilidad civil hasta 40.000 €
· Compensación por problemas de vuelos hasta 610 €`,
    actions: [['Asistencia 24 h', 'tel:+34911976256']],
    links: [['Parte de siniestro', 'https://claims.mana-uw.com/']],
  },
  {
    id: 'pagos', icon: 'wallet', title: 'Pagos con QR y dinero',
    body: `Tailandia utiliza mucho **PromptPay**, un sistema de pago mediante códigos QR. Sin embargo, una tarjeta española o una aplicación bancaria española no siempre puede escanear directamente los códigos QR tailandeses.

Existe la opción **TAGTHAi Easy Pay**, vinculada a una tarjeta prepago PAY&TOUR para turistas, que permite utilizar pagos QR PromptPay. Para obtenerla, normalmente hay que acudir a un punto de cambio de KBank con el pasaporte.

**Recomendación para este viaje:**
1. No depender de una aplicación especial.
2. Llevar dos tarjetas Visa/Mastercard.
3. Sacar o cambiar una cantidad inicial de bahts.
4. Utilizar efectivo en mercados y restaurantes pequeños.
5. Usar tarjeta en hoteles, supermercados y centros comerciales.`,
  },
  {
    id: 'horarios', icon: 'clock', title: 'Diferencia horaria',
    body: `En agosto, **Tailandia está 5 horas por delante de España**.

Doha está 1 hora por delante de España, es decir, 4 horas por detrás de Tailandia.

Todos los horarios de vuelos que aparecen en esta aplicación son **horas locales** de cada aeropuerto.`,
  },
  {
    id: 'clima', icon: 'rain', title: 'Clima en agosto',
    body: `Agosto es **temporada de lluvias** en Tailandia, tanto en Bangkok como en Phuket.

Lo habitual son chaparrones fuertes pero cortos, sobre todo por la tarde, con mucha humedad y temperaturas entre 26 y 33 grados.

En Phuket el mar puede estar movido: conviene **hacer caso de las banderas rojas** de las playas y reservar las excursiones en barco con cancelación flexible.

Llevad chubasquero fino o paraguas plegable y ropa que seque rápido.`,
  },
  {
    id: 'electricidad', icon: 'plug', title: 'Enchufes y electricidad',
    body: `Tailandia funciona a **220 V y 50 Hz**, igual que España.

Los enchufes son de tipo **A, B y C**. Los enchufes españoles (tipo C, dos clavijas redondas) encajan en la mayoría de bases de los hoteles, pero **conviene llevar un adaptador universal** por si acaso.`,
  },
  {
    id: 'sim', icon: 'wifi', title: 'SIM y eSIM',
    body: `Los principales operadores son **AIS**, **TrueMove H** y **dtac**.

Hay dos opciones:
· **eSIM** contratada antes de salir, que se activa al aterrizar. Es lo más cómodo.
· **SIM turística** comprada en el propio aeropuerto de Bangkok, en los mostradores de la zona de llegadas.

Para 8 días con datos suficientes para mapas, mensajería y algo de vídeo, lo normal es moverse en un rango de precio bajo. Comprobad que el móvil esté **libre** y que admita eSIM si escogéis esa opción.`,
  },
  {
    id: 'transporte', icon: 'train', title: 'Transporte local',
    body: `**Bangkok**
· BTS Skytrain y MRT (metro): rápidos, con aire acondicionado y sin atascos. La mejor opción en hora punta.
· Barcos por el río Chao Phraya: muy útiles desde el hotel, que está justo en el río.
· Taxis: exigid siempre **taxímetro** ("meter, please").
· Grab y Bolt: aplicaciones tipo Uber, con precio cerrado. Muy recomendables.
· Tuk-tuk: hay que **negociar el precio antes** de subir.

**Phuket**
· Apenas hay transporte público. Lo habitual es Grab, taxi o alquilar una moto.
· Los taxis suelen ir a precio cerrado: acordadlo antes.
· El hotel ofrece transporte gratuito a la playa.`,
  },
  {
    id: 'costumbres', icon: 'globe', title: 'Costumbres y recomendaciones',
    body: `**Templos:** hombros y rodillas cubiertos, y quitarse los zapatos al entrar. No señalar las imágenes de Buda con el pie ni darles la espalda en las fotos.

**La monarquía** merece el máximo respeto: cualquier comentario o gesto irrespetuoso puede tener consecuencias legales serias.

**El saludo (wai):** juntar las palmas a la altura del pecho e inclinar levemente la cabeza. Se devuelve siempre.

**La cabeza** es la parte más sagrada del cuerpo: no toquéis la cabeza de nadie, ni siquiera a los niños.

**Los pies** son lo menos noble: no señaléis con ellos ni los apuntéis hacia personas o imágenes religiosas.

**Mantener la calma:** levantar la voz o enfadarse en público se considera una falta de educación grave y no ayuda a resolver nada.

**Propinas:** no son obligatorias, pero se agradecen. Redondear al alza está bien visto.

**Regateo:** normal en mercados y con los tuk-tuk. Nunca en tiendas, supermercados ni restaurantes.

**Agua:** beber siempre agua embotellada y comprobar que el precinto esté intacto.`,
  },
  {
    id: 'frases', icon: 'sparkle', title: 'Frases básicas en tailandés',
    phrases: [
      ['Hola / adiós', 'Sawasdee khrap (hombre) · Sawasdee kha (mujer)', 'sa-wat-dí'],
      ['Gracias', 'Khop khun khrap / kha', 'kop-kun'],
      ['Por favor', 'Karuna', 'ka-ru-ná'],
      ['Sí', 'Chai', 'chái'],
      ['No', 'Mai chai', 'mái chái'],
      ['Perdón / disculpe', 'Kho thot', 'ko-tót'],
      ['¿Cuánto cuesta?', 'Tao rai?', 'táo rái'],
      ['Muy caro', 'Phaeng mak', 'peng mák'],
      ['No picante, por favor', 'Mai phet', 'mái pet'],
      ['Delicioso', 'Aroi', 'a-rói'],
      ['Agua', 'Nam', 'nám'],
      ['La cuenta, por favor', 'Check bin', 'chek bin'],
      ['¿Dónde está el baño?', 'Hong nam yu thi nai?', 'jong nám yu ti nái'],
      ['No entiendo', 'Mai khao jai', 'mái káo yái'],
      ['Ayuda', 'Chuay duay', 'chúai dúai'],
    ],
  },
  {
    id: 'emergencias', icon: 'alert', title: 'Teléfonos de emergencia',
    calls: [
      ['Emergencias médicas', '1669'],
      ['Policía', '191'],
      ['Bomberos', '199'],
      ['Policía turística', '1155'],
      ['Seguro · asistencia 24 h', '+34 911 976 256'],
      ['Embajada de España en Bangkok', '+66 2 661 8284'],
    ],
    body: 'La policía turística (1155) atiende en inglés y es la primera opción para cualquier problema como turista.',
  },
  {
    id: 'salud', icon: 'cross', title: 'Salud y hospitales',
    body: `Los hospitales privados de Bangkok y Phuket tienen muy buen nivel y atienden en inglés. Guardad siempre el **número de póliza del seguro** a mano.

**Precauciones básicas:** agua embotellada, fruta pelada, repelente de mosquitos (dengue), protección solar alta y cuidado con el hielo en puestos muy pequeños.`,
    calls: [
      ['Bumrungrad International · Bangkok', '+66 2 066 8888'],
      ['BNH Hospital · Bangkok', '+66 2 022 0700'],
      ['Bangkok Hospital Phuket', '+66 76 254 425'],
    ],
  },
];

/* --------------------------------------------------------------------------
   CARPETA COMPARTIDA
   Lo más cómodo: crea UNA carpeta en Google Drive con todos los documentos,
   compártela con los cuatro y pega aquí su enlace. Aparecerá arriba del todo
   en la pantalla de Documentos y lo verá todo el grupo.
   -------------------------------------------------------------------------- */
export const DOCS_FOLDER = {
  url: 'https://drive.google.com/drive/folders/1XTQPb-i7J2PXqJqridng5CWSUeN9XZE8?usp=sharing',
  label: 'Carpeta del viaje en Drive',
  note: 'Todos los documentos, en una sola carpeta compartida con los cuatro.',
};

/* --------------------------------------------------------------------------
   DOCUMENTOS
   Para compartir un documento con el grupo, pega su enlace (Google Drive,
   Dropbox, WeTransfer…) en el campo "url" de la ficha correspondiente.
   Cada persona puede además guardar sus propios enlaces desde la propia app.
   -------------------------------------------------------------------------- */
export const DOCS = [
  {
    id: 'billetes', title: 'Billetes de avión', icon: 'ticket', group: 'Viaje',
    detail: 'Los cinco vuelos van con el mismo localizador.',
    refs: [['Localizador', '7RUF9V']],
    url: '',
    links: [['Qatar Airways · gestionar reserva', 'https://www.qatarairways.com/es-es/manage-booking.html']],
  },
  {
    id: 'embarque', title: 'Tarjetas de embarque', icon: 'plane', group: 'Viaje',
    detail: 'Se descargan cuando se abre el check-in, unas 48 horas antes de cada vuelo.',
    url: '',
    links: [['Check-in Qatar Airways', 'https://www.qatarairways.com/es-es/checkin.html']],
  },
  {
    id: 'tdac', title: 'TDAC · tarjeta de llegada', icon: 'file', group: 'Viaje',
    detail: 'Obligatoria para los cuatro. Se rellena a partir del 8 de agosto y hay que guardar el comprobante.',
    url: '',
    links: [['Rellenar la TDAC (web oficial)', 'https://tdac.immigration.go.th']],
  },
  {
    id: 'hoteles', title: 'Bonos de los hoteles', icon: 'bed', group: 'Reservas',
    detail: 'Royal Orchid Sheraton Bangkok (10–13 ago) y Twinpalms Surin Beach Phuket (13–17 ago).',
    url: '',
  },
  {
    id: 'traslados', title: 'Bonos de los traslados', icon: 'car', group: 'Reservas',
    detail: 'Los dos traslados de Bangkok. Los de Phuket están sin contratar.',
    refs: [['Llegada · ONWAYTRANSFERS', 'OWT-337654'], ['Salida · Holiday Taxis', '321-10856084']],
    url: '',
  },
  {
    id: 'excursiones', title: 'Bonos de las excursiones', icon: 'compass', group: 'Reservas',
    detail: 'Mercado flotante (11 ago) y tour en tuk-tuk (12 ago).',
    refs: [['Mercados', 'A40188327'], ['Tuk-tuk', 'A40188349']],
    url: '',
  },
  {
    id: 'seguro', title: 'Pólizas del seguro', icon: 'shield', group: 'Seguridad',
    detail: 'Las dos pólizas cubren a los cuatro viajeros del 9 al 17 de agosto.',
    refs: [['Seguro de Inclusión', 'ESF54-I24-600A'], ['Multirriesgo Basic', 'ESF76-I24-50A']],
    url: '',
    links: [['Parte de siniestro', 'https://claims.mana-uw.com/']],
    phones: [['Asistencia 24 h', '+34 911 976 256']],
  },
  {
    id: 'contrato', title: 'Contrato y factura del viaje', icon: 'wallet', group: 'Reservas',
    detail: 'Documentación del paquete contratado con Logitravel.',
    refs: [['Localizador', '1296377948'], ['Factura', '7600655989']],
    url: '',
    phones: [['Logitravel', '+34 971 747 676']],
  },
  {
    id: 'pasaportes', title: 'Copias de los pasaportes', icon: 'lock', group: 'Personal',
    detail: `Copia digital de los cuatro pasaportes, más una copia impresa. Guardadlas separadas del original.

**No las pongas en la carpeta general de Drive**, porque su enlace está a la vista en esta aplicación. Para los pasaportes, crea una carpeta aparte en modo restringido y compártela por correo solo con los cuatro. Ese enlace no lo pegues aquí.`,
    sensitive: true,
    url: '',
  },
  {
    id: 'conducir', title: 'Permisos de conducir', icon: 'car', group: 'Personal',
    detail: 'Solo hace falta si vais a alquilar coche o moto en Phuket. Se necesitan LOS DOS: el permiso español y el permiso internacional de conducción.',
    sensitive: true,
    url: '',
    links: [['Solicitar el permiso internacional · DGT', 'https://sede.dgt.gob.es/es/permisos-de-conducir/permiso-internacional/']],
  },
  {
    id: 'emergencia', title: 'Contactos de emergencia', icon: 'phone', group: 'Seguridad',
    detail: 'Teléfonos de casa y de contacto de cada viajero, por si hiciera falta.',
    url: '',
  },
  {
    id: 'facturas', title: 'Facturas y justificantes', icon: 'file', group: 'Seguridad',
    detail: 'Guardad los tickets de los gastos importantes, sobre todo si hay que reclamar al seguro.',
    url: '',
  },
];

/* --------------------------------------------------------------------------
   COMER Y COMPRAR CERCA DE LOS HOTELES
   -------------------------------------------------------------------------- */
export const FOOD = [
  {
    city: 'Bangkok',
    hotel: 'Royal Orchid Sheraton Riverside',
    intro: 'El hotel está en Bang Rak, un barrio con mucha comida callejera buena y barata a un paseo corto.',
    eat: [
      { name: 'Street food y mercados de Bang Rak', kind: 'Comida callejera',
        price: '1,30 – 4 € por plato',
        note: 'Lo mejor de la zona y lo más barato. Los puestos de Charoen Krung y las calles de alrededor.',
        q: 'Bang Rak street food Charoen Krung Bangkok' },
      { name: 'Tuang by Chef Yip', kind: 'Dim sum',
        price: 'Piezas de 1,30 – 1,50 € · 5 – 10 € por persona',
        note: 'Dim sum barato y muy resultón para una comida rápida.',
        q: 'Tuang by Chef Yip Bangkok' },
      { name: 'Feast', kind: 'Buffet del hotel',
        price: '15 – 21 € por persona',
        note: 'Dentro del propio hotel. Cómodo el primer día, cuando llegáis cansados.',
        q: 'Feast Royal Orchid Sheraton Bangkok' },
      { name: 'Siam Yacht Club', kind: 'Buffet del hotel',
        price: '30 – 31 € por persona',
        note: 'La opción cara del hotel. Para una cena especial junto al río.',
        q: 'Siam Yacht Club Royal Orchid Sheraton Bangkok' },
    ],
    shop: [
      { name: 'Tops Market · Robinson Bang Rak', kind: 'Supermercado',
        price: 'Abierto de 08:00 a 22:00',
        note: 'Supermercado completo dentro del centro Robinson, en Charoen Krung. Lo más práctico para agua, fruta y snacks.',
        q: 'Tops Robinson Bang Rak Charoen Krung Bangkok' },
      { name: '7-Eleven', kind: 'Tienda 24 h',
        price: 'Hay varios a menos de 5 minutos',
        note: 'Agua, bebidas, sándwiches y platos preparados. Abiertos día y noche.',
        q: '7-Eleven Charoen Krung Bang Rak Bangkok' },
      { name: 'River City Bangkok', kind: 'Centro comercial',
        price: 'A un paseo del hotel',
        note: 'Cafeterías y restaurantes con aire acondicionado.',
        q: 'River City Bangkok' },
      { name: 'ICONSIAM', kind: 'Centro comercial',
        price: 'Al otro lado del río',
        note: 'Enorme, con un mercado de comida en la planta baja (SookSiam) y supermercado. Hay barco lanzadera gratis.',
        q: 'ICONSIAM Bangkok' },
    ],
  },
  {
    city: 'Phuket',
    hotel: 'Twinpalms Surin Beach',
    intro: 'La zona de Surin y Cherngtalay tiene desde restaurantes locales muy baratos hasta beach clubs caros. La diferencia de precio es enorme según dónde entréis.',
    eat: [
      { name: 'Restaurantes locales tailandeses', kind: 'Local',
        price: '2,50 – 6,50 € por persona',
        note: 'Los de Cherngtalay y las calles de detrás de la playa. La mejor relación calidad-precio.',
        q: 'Thai restaurant Cherngtalay Phuket' },
      { name: 'Restaurantes de playa y turísticos', kind: 'Turístico',
        price: '6,50 – 15,50 € por persona',
        note: 'Los de Surin Beach Road y el paseo de Bang Tao.',
        q: 'restaurants Surin Beach Road Phuket' },
      { name: 'Beach clubs', kind: 'Beach club',
        price: '15,50 – 38 € o más por persona',
        note: 'Bonitos y caros. Para una tarde concreta, no para todos los días.',
        q: 'beach club Surin Bang Tao Phuket' },
      { name: 'Restaurantes del Twinpalms', kind: 'Hotel',
        price: '20 – 40 € o más por persona',
        note: 'Los más caros de todos. El desayuno sí está incluido.',
        q: 'Twinpalms Surin Beach Phuket restaurant' },
      { name: 'Boat Avenue y Porto de Phuket', kind: 'Zona de restaurantes',
        price: 'De todo, según el sitio',
        note: 'En Cherngtalay, a unos minutos en coche. Docenas de restaurantes juntos. Los viernes hay mercado nocturno de 16:00 a 21:00.',
        q: 'Boat Avenue Cherngtalay Phuket' },
    ],
    shop: [
      { name: 'Villa Market · Boat Avenue', kind: 'Supermercado',
        price: 'Abierto de 10:00 a 22:00',
        note: 'Supermercado grande con producto fresco y bastante producto importado.',
        q: 'Villa Market Boat Avenue Phuket' },
      { name: "Lotus's Cherngtalay", kind: 'Supermercado',
        price: 'El más económico',
        note: 'Para la compra grande del grupo: agua, snacks, protector solar.',
        q: "Lotus's Cherngtalay Phuket" },
      { name: 'Tops Food Hall · Porto de Phuket', kind: 'Supermercado',
        price: 'Junto a Boat Avenue',
        note: 'Más cuidado y algo más caro que Lotus\'s.',
        q: 'Tops Food Hall Porto de Phuket' },
      { name: '7-Eleven', kind: 'Tienda 24 h',
        price: 'Por toda la zona',
        note: 'Agua, bebidas y comida rápida a cualquier hora.',
        q: '7-Eleven Cherngtalay Surin Phuket' },
      { name: 'Mercado local de Cherngtalay', kind: 'Mercado',
        price: 'Lo más barato',
        note: 'Fruta, verdura y comida preparada a precio de tailandés.',
        q: 'Cherngtalay Market Phuket' },
    ],
  },
];

/* Precios de referencia, para hacerse una idea rápida */
export const PRICES = [
  {
    title: 'Supermercado y comida rápida',
    rows: [
      ['Agua pequeña', '0,25 – 0,50 €'],
      ['Bebida o refresco', '0,50 – 1,30 €'],
      ['Sándwich o snack de 7-Eleven', '1 – 2,30 €'],
      ['Plato preparado de 7-Eleven', '1,30 – 3 €'],
      ['Compra sencilla por persona y día', '4 – 8 €'],
    ],
  },
  {
    title: 'Un día en Phuket sin gastar de más',
    rows: [
      ['Desayuno', 'Incluido en el hotel'],
      ['Comida sencilla fuera', '4 – 8 € por persona'],
      ['Cena local', '5 – 10 € por persona'],
      ['Cena especial', '15 – 38 € o más por persona'],
    ],
  },
];

/* --------------------------------------------------------------------------
   CONTACTOS
   -------------------------------------------------------------------------- */
export const CONTACTS = [
  { group: 'Agencia y asistencia', items: [
    { name: 'Logitravel', phone: '+34 971 747 676', email: 'info@logitravel.com' },
    { name: 'WhatsApp de asistencia durante el viaje', phone: '+34 617 058 411', wa: true },
    { name: 'Seguro · asistencia 24 h', phone: '+34 911 976 256' },
  ]},
  { group: 'Traslados', items: [
    { name: 'Traslado de llegada en Bangkok · ONWAYTRANSFERS', phone: '+66 95 858 0087' },
    { name: 'Asistencia del traslado', phone: '+34 871 153 847' },
    { name: 'Traslado de salida en Bangkok · Holiday Taxis', phone: '+34 871 180 153' },
  ]},
  { group: 'Hoteles', items: [
    { name: 'Royal Orchid Sheraton · Bangkok', phone: '+66 2 266 0123' },
    { name: 'Twinpalms Surin Beach · Phuket', phone: '+66 76 316 500' },
  ]},
  { group: 'Excursiones', items: [
    { name: 'ASKDISCOVERY Tailandia (mercados)', phone: '+66 81 492 6380' },
  ]},
  { group: 'Emergencias en Tailandia', items: [
    { name: 'Emergencias médicas', phone: '1669' },
    { name: 'Policía', phone: '191' },
    { name: 'Bomberos', phone: '199' },
    { name: 'Policía turística', phone: '1155' },
    { name: 'Embajada de España en Bangkok', phone: '+66 2 661 8284' },
  ]},
];

/* Localizadores y referencias, para copiar rápido */
export const REFS = [
  ['Localizador Logitravel', '1296377948'],
  ['Localizador de los vuelos', '7RUF9V'],
  ['Factura Logitravel', '7600655989'],
  ['Traslado llegada Bangkok', 'OWT-337654'],
  ['Traslado salida Bangkok', '321-10856084'],
  ['Excursión mercados (Civitatis)', 'A40188327'],
  ['Tour en tuk-tuk (Civitatis)', 'A40188349'],
  ['Póliza Seguro de Inclusión', 'ESF54-I24-600A'],
  ['Póliza Multirriesgo Basic', 'ESF76-I24-50A'],
];
