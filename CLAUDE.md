# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A one-page, three-language (Marathi default, Hindi, English) website for **Jyotirling Agro Mart**, a farm machinery and licensed fertilizer/pesticide/seed shop on Mhaisal Ves Road, Vakhar Bhag, Miraj 416410 (Sangli district, Maharashtra). Audience: farmers and dairy owners, mostly on phones, often in bright sunlight.

Orders are **not** paid online. Customers add items to a "bag" and send the list to the shop on WhatsApp (919881460302).

## Tech stack — keep it this way

- Plain **HTML + CSS + vanilla JavaScript** (ES5-style, inside one IIFE). No framework, no build step, no npm, no bundler.
- Must work by **double-clicking index.html** (`file://`) and on any static host (Netlify, Hostinger). Never use `fetch()` for local JSON files. Local data lives in `.js` files that set `window.*` globals.
- Only external runtime dependencies: Google Fonts (Baloo 2, Hind, JetBrains Mono), Open-Meteo API, data.gov.in API, Google Maps embed iframe. The QR library is vendored at `js/vendor/qrcode.js` (qrcode-generator 1.4.4, MIT).
- Script order in index.html **must** be: `config → i18n → data → vendor/qrcode → app`.

## File map

```
index.html          All markup. Text comes from data-i18n attributes; dynamic areas are empty containers with ids.
css/style.css       All styles + animations. Light palette. Responsive breakpoints 1200 / 1100 / 900 / 600px.
js/config.js        window.SITE_CONFIG — phone, WhatsApp, hours, lat/lon, map query, licences, siteUrl, data.gov.in key.
js/i18n.js          window.I18N — every UI string as  key: [Marathi, Hindi, English].
js/data.js          window.SITE_DATA — products, categories, crops (NPK), seasons, care tips, schemes, docs checklist, commodity & market name translations.
js/app.js           All behaviour. Do not edit unless changing behaviour.
js/vendor/qrcode.js QR generator (do not edit).
assets/             logo-emblem.png, logo-full.jpg, favicon/icons.
manifest.json       PWA "add to home screen".
README.txt          Owner-facing setup guide.
```

## Page sections (ids, in order)

`#home` hero bento → `#season` → `#shop` → `#weather` → `#calc` → `#mandi` → `#care` + `#ledger` → `#schemes` → `#contact` → footer.

Overlays: `#cartDrawer`, `#drawerNav`, `#qrModal`, `#confirmModal`, `#toasts`, `#preloader`.

## Translation system (most important rule)

- **Every visible string must exist in all 3 languages.** Never hard-code text in HTML or JS.
- Static text: use `data-i18n="key"` (textContent), `data-i18n-ph="key"` (placeholder), `data-i18n-aria="key"` (aria-label), `data-wa="key"` (WhatsApp link) on the element, and add the key to `js/i18n.js`.
- Dynamic text in JS: `t('key')` for I18N strings, `tr([mr, hi, en])` for data arrays.
- Numbers: `num(n, decimals)` (Marathi → Devanagari digits, Hindi/English → Latin), `rupee(n)`, `digits(str)`. Times: `fmtHour(h)`, `fmtClock(iso)`. Dates: `fmtDate('YYYY-MM-DD', opts)`.
- Any section rendered by JS must be re-rendered on language change: register it with `onLang('name', renderFn)` inside `boot()`.
- In `js/data.js`, Marathi strings use Devanagari digits (०-९).

## app.js structure

One IIFE. Key helpers: `$`, `$$`, `store` (localStorage wrapper, keys prefixed `jam_`), `t`, `tr`, `esc` (HTML-escape — **always use for any text put into innerHTML, especially user input**), `num`, `rupee`, `waLink(text)`, `fetchJSON(url, timeoutMs)`, `nowIST()`, `toast(msg)`, `copyText`, `animateNum`, `icon(id)`.

Modules (each has `render*` and `init*`; all called from `boot()` inside `safe()` so one failure can't break others):
- **Open badge**: `renderOpen` — open if `openHour <= IST hour < closeHour`.
- **Season**: `renderSeason` — picks `SITE_DATA.seasons` entry by current IST month.
- **Shop/cart**: `renderCats`, `renderProducts`, `renderCart`, `addToCart`, `flyToBag`, `bindTilt` — state `shop = {cat, q}`; `cart = {productId: qty}` in `jam_cart`. WhatsApp order built in `updateCartLink`.
- **Search**: `initSearch` — header combobox; suggests products + sections; on ≤900px hidden behind `#searchToggle`.
- **Weather**: `loadWeather`, `renderWeather`, `renderHourly`, `renderMiniWeather` — Open-Meteo, cached 20 min in `jam_wcache`, auto-refresh 30 min. Spray-OK rule in `sprayOk()`: 6–18h, wind < 12 km/h, rain chance < 30%, temp < 32°, precip < 0.2 mm. Icons drawn by `wIcon(code, isDay)`.
- **Calculators**: `renderCalc`, `updateCalc(calc)`, `initCalc` — 5 tabs: `fert` (NPK → urea 45 kg / DAP 50 kg / MOP 50 kg bags), `pest`, `fuel`, `chaff`, `spray`. State in `jam_calc`, active tab in `jam_calcTab`.
- **Mandi**: `loadMandi`, `renderMandi`, `renderTicker` — data.gov.in resource `9ef84268-d588-465a-a308-a864a43d0070`, cached 1 h in `jam_mcache`. **Never show invented prices**; on failure show WhatsApp + Agmarknet fallback.
- **Care**: `renderCare` — tabs from `SITE_DATA.care`.
- **Ledger**: `renderLedger`, `initLedger` — entries `{id, date, plot, cat, amt, note}` in `jam_ledger`; CSV export with BOM.
- **Schemes/docs**: `renderSchemes`, `initSchemes` — checklist state in `jam_docs`.
- **Contact/QR**: `renderLic`, `initContact`, `renderQR` — QR encodes `SITE_CONFIG.siteUrl` or current URL; map iframe lazy-loads on scroll.

Stored keys (all prefixed `jam_`): `lang`, `cart`, `cartName`, `cartVillage`, `wcache`, `mcache`, `calc`, `calcTab`, `ledger`, `docs`. Nothing is sent to any server.

## Data shapes (js/data.js)

- **Product**: `{ id, cat, n:[mr,hi,en], d:[mr,hi,en], img?: 'assets/x.jpg', price?: number }`. `cat` must match a `categories` entry; each category needs an I18N key (e.g. `catSprayers`) and an SVG symbol `#c-<cat>` in index.html.
- **Crop**: `{ id, n:[...], npk:[N,P,K] }` — kg **per acre** for the whole season.
- **Season**: `{ months:[1-12], title, head, items:[{t, d, tag}] }`.
- **Care**: `{ id, n, steps:[[mr,hi,en], ...] }`.
- **Scheme**: `{ id, tag, warn?, big, t, d, elig, how, url }`.

## Design system

Light palette: bg `#FBFCF7`, ink `#0D1B13`, muted `#4F5D54`, primary green `#2E7D4F` (dark `#1F5C3B`), mint `#EAF6DA`, lime `#C6EE6A`, leaf `#8FC23F`, peach `#FFE6D4`, orange `#FF7A2F`, sun `#FFB547`.

Fonts: headings `var(--fh)` Baloo 2, body `var(--fb)` Hind, numbers/codes `var(--fm)` JetBrains Mono.

**Owner's explicit preference**: light colours, no gradient washes, no glassmorphism, no emoji icons. Icons are inline SVG symbols (`#i-*` UI, `#c-*` category).

## Rules / pitfalls

- `[hidden]{display:none!important}` is global — use the `hidden` attribute; don't give a hidden-able element a class that sets `display`.
- Don't reuse the class name `.modal` (it's the dialog overlay — this already broke a table column once).
- Don't change the sticky header's height based on scroll position (caused a flicker loop).
- Keep all `fetch` calls with a timeout and a visible fallback; the site must never show a blank or broken section.
- Always use `esc()` for any text put into innerHTML, especially user input.
- Text contrast ≥ 4.5:1; touch targets ≥ 44px; keep `prefers-reduced-motion` support.

## Testing after any change

1. `node --check js/*.js`
2. Translation keys complete: every `data-i18n*` / `data-wa` key in index.html and every `t('...')` in app.js must exist in `I18N` with exactly 3 non-empty strings.
3. Open `index.html`, switch मराठी / हिंदी / EN — no leftover text in the wrong language; console has no errors.
4. Check 390px phone width: no horizontal scroll; header is one row.
5. Turn off the internet: weather and mandi show their error/fallback states, everything else works.

## Open items / likely next tasks

- **Owner-editable products/schemes** without touching code. Options discussed: (1) public Google Sheet published as CSV with `data.js` as fallback; (2) `/admin` page on Firebase/Supabase with photo upload. Not decided — ask the owner before building.
- Add "माहिती तपासली: `<month year>`" line to the schemes section.
- Replace product placeholder icons with real photos (`img` field) when owner provides them.
- Confirm product list and per-crop NPK doses with owner/agronomist.
- Scheme figures last checked Nov 2026: MahaDBT mechanisation 40–50%; micro-irrigation 55%/45% + state top-up ~80%; PMFBY farmer share kharif 2%, rabi 1.5%, commercial 5%; PM-KISAN ₹6,000/year in 3 instalments (₹1 crop insurance ended 2025).
