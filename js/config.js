/* ==========================================================
   JYOTIRLING AGRO MART — SITE SETTINGS
   Edit this file to change phone numbers, hours, licences etc.
   ========================================================== */
window.SITE_CONFIG = {
  // WhatsApp number with country code, digits only
  whatsapp: '919881460302',
  phones: [
    { label: '98814 60302', tel: '+919881460302' },
    { label: '86685 74660', tel: '+918668574660' }
  ],
  email: 'jyotirlingagromart3@gmail.com',

  // Store hours (24h clock, India time). Used for the "Open now" badge.
  openHour: 7,
  closeHour: 21,

  // Shop location (Miraj) — used for weather and the map
  lat: 16.8222,
  lon: 74.6450,
  mapQuery: 'Jyotirling Agro Mart, Mhaisal Ves Road, Vakhar Bhag, Miraj 416410',

  // Website address once hosted (leave empty to use the current page address for the QR code)
  siteUrl: '',

  // Registrations & licences
  licences: [
    { key: 'gstin', value: '27EDMPM3907F1ZD' },
    { key: 'licPesticide', value: 'LCID0920260326SNG' },
    { key: 'licFertilizer', value: 'LCFRD0920260404SNG' },
    { key: 'licSeed', value: 'LCSD0920260367SNG' }
  ],

  // Live APMC mandi rates (data.gov.in / Agmarknet).
  // The key below is the public SAMPLE key (very limited). Get your own free key at
  // https://data.gov.in (Sign up → My Account → API key) and paste it here.
  dataGovApiKey: '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b',
  mandiState: 'Maharashtra',
  mandiDistricts: ['Sangli', 'Kolhapur'],

  // ── Admin & Google Sheets ──────────────────────────────
  // Password for /admin.html. Change this before going live.
  adminPassword: 'agro1234',

  // Google Sheet (Products tab) published as CSV.
  // HOW: File → Share → Publish to web → Products → CSV → Publish → copy URL.
  // Leave empty to use the built-in product list from data.js.
  productsSheetUrl: '',

  // Google Apps Script web app URL (lets admin.html write back to the Sheet).
  // HOW: See the Setup Guide inside admin.html.
  // Leave empty if you haven't deployed the script yet.
  appsScriptUrl: '',

  // Google Sheet (Schemes tab) published as CSV — same sheet, different tab.
  // HOW: same as above but publish the Schemes tab.
  // Leave empty to use the built-in scheme data from data.js.
  schemesSheetUrl: ''
};
