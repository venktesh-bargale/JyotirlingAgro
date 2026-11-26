JYOTIRLING AGRO MART — WEBSITE
================================

WHAT'S IN THIS FOLDER
  index.html          the website (one page, Marathi / Hindi / English)
  css/style.css       design and animations
  js/config.js        YOUR SETTINGS: phone, WhatsApp, hours, licences, map, API key
  js/data.js          YOUR CONTENT: products, crops, schemes, care tips, seasons
  js/i18n.js          all the text in 3 languages
  js/app.js           how everything works (no need to edit)
  assets/             logo and icons
  manifest.json       lets farmers "Add to home screen" on their phone

TRY IT ON YOUR COMPUTER
  Double-click index.html. It opens in Chrome / Edge. Everything works,
  including live weather (needs internet).

PUT IT ONLINE (pick one)
  A) Netlify (free, easiest)
     1. Go to https://app.netlify.com/drop
     2. Drag this whole folder onto the page. You get a link in seconds.
     3. Later: Site settings → Domain management → add your own domain.
  B) Hostinger / any cPanel hosting
     1. Open File Manager → public_html
     2. Upload everything in this folder (keep the css, js, assets folders).
  After hosting, open js/config.js and set  siteUrl: 'https://your-domain.in'
  so the QR code always points to the real website.

LIVE DATA
  Weather   — Open-Meteo, free, no key needed. Updates every 30 minutes.
              Tap any day to see hour-by-hour weather and good spray hours.
  Mandi     — data.gov.in (Agmarknet). The key in config.js is the public
              SAMPLE key, which is very limited. Get your own free key:
              https://data.gov.in → Sign up → My Account → "Generate API key"
              and paste it into  dataGovApiKey  in js/config.js.
              If rates can't be loaded (Sunday, holiday, no internet) the site
              shows "Ask today's rates on WhatsApp" and a link to Agmarknet —
              it never shows made-up prices.

WHAT IS SAVED ON THE VISITOR'S PHONE (not on any server)
  Language choice, shopping bag, name/village in the order form,
  farm ledger (वहीखाते) entries, document checklist, calculator values.

ORDERS
  There is no online payment. "Send order on WhatsApp" opens WhatsApp with
  the item list, name and village already typed, sent to 98814 60302.

EDITING COMMON THINGS
  Phone / WhatsApp / hours / licences ........ js/config.js
  Add or remove a product .................... js/data.js → products
  Add a product photo ........................ put photo in assets/, then add
                                               img: 'assets/photo.jpg' to the product
  Show a price ............................... add  price: 12500  to the product
  Fertilizer doses per crop .................. js/data.js → crops (kg per ACRE)
  Change any text ............................ js/i18n.js  [Marathi, Hindi, English]

PLEASE CHECK BEFORE LAUNCH
  - Product list: it's a starting list built from your old website and
    screenshots. Remove anything you don't sell.
  - Fertilizer doses (js/data.js → crops) were copied from your reference
    site. Have your agronomist confirm them — your fertilizer licence number
    is shown next to the calculator.
  - Scheme figures were checked in November 2026. Rules change; review them
    every season (js/data.js → schemes).
