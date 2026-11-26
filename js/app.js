/* =========================================================
   Jyotirling Agro Mart — app
   ========================================================= */
(function () {
  'use strict';
  var C = window.SITE_CONFIG, T = window.I18N, D = window.SITE_DATA;
  var LI = { mr: 0, hi: 1, en: 2 };
  var LOCALE = { mr: 'mr-IN-u-nu-deva', hi: 'hi-IN-u-nu-latn', en: 'en-IN' };
  var HTML_LANG = { mr: 'mr', hi: 'hi', en: 'en' };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');

  /* ---------------- helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('jam_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('jam_' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  var lang = store.get('lang', 'mr');
  if (!LI.hasOwnProperty(lang)) lang = 'mr';
  function t(k) { var v = T[k]; if (!v) { if (window.console) console.warn('missing i18n', k); return k; } return v[LI[lang]]; }
  function tr(arr) { return Array.isArray(arr) ? (arr[LI[lang]] || arr[2] || '') : (arr || ''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n, dec) {
    if (n == null || isNaN(n)) return '—';
    try { return new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: dec || 0, minimumFractionDigits: 0 }).format(n); }
    catch (e) { return String(Math.round(n * Math.pow(10, dec || 0)) / Math.pow(10, dec || 0)); }
  }
  function digits(s) { return lang === 'mr' ? String(s).replace(/[0-9]/g, function (d) { return '०१२३४५६७८९'[d]; }) : String(s); }
  function rupee(n) { return '₹' + num(Math.round(n)); }
  function waLink(text) { return 'https://wa.me/' + C.whatsapp + (text ? '?text=' + encodeURIComponent(text) : ''); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function icon(id, cls) { return '<svg class="ico' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.error('[' + name + ']', e); } }
  function debounce(fn, ms) { var to; return function () { var a = arguments, s = this; clearTimeout(to); to = setTimeout(function () { fn.apply(s, a); }, ms); }; }
  function fetchJSON(url, ms) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 12000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }, function (e) { clearTimeout(timer); throw e; });
  }
  // India time, independent of the visitor's device time zone
  function nowIST() {
    var d = new Date(Date.now() + 5.5 * 3600 * 1000);
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
    return { y: y, m: m, d: day, h: d.getUTCHours(), min: d.getUTCMinutes(), date: y + '-' + String(m).padStart(2, '0') + '-' + String(day).padStart(2, '0') };
  }
  function dateFromStr(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)); }
  function fmtDate(s, opts) { try { return new Intl.DateTimeFormat(LOCALE[lang], Object.assign({ timeZone: 'UTC' }, opts)).format(dateFromStr(s)); } catch (e) { return s; } }
  var PERIOD = { mr: ['रात्री', 'पहाटे', 'सकाळी', 'दुपारी', 'संध्या.', 'रात्री'], hi: ['रात', 'तड़के', 'सुबह', 'दोपहर', 'शाम', 'रात'] };
  function periodOf(h) { return h < 4 ? 0 : h < 6 ? 1 : h < 12 ? 2 : h < 17 ? 3 : h < 20 ? 4 : 5; }
  function fmtHM(h, m) {
    h = ((h % 24) + 24) % 24;
    var h12 = h % 12 === 0 ? 12 : h % 12, mm = m == null ? '' : ':' + String(m).padStart(2, '0');
    if (lang === 'en') return h12 + mm + (h < 12 ? ' am' : ' pm');
    return PERIOD[lang][periodOf(h)] + ' ' + digits(h12 + mm);
  }
  function fmtHour(h) { return fmtHM(h, null); }
  function fmtClock(iso) { var hm = (iso.split('T')[1] || '00:00').split(':'); return fmtHM(+hm[0], +hm[1]); }

  /* ---------------- toast ---------------- */
  function toast(msg) {
    var box = $('#toasts'); if (!box) return;
    var el = document.createElement('div');
    el.className = 'toast'; el.innerHTML = icon('i-check') + '<span>' + esc(msg) + '</span>';
    box.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 320); }, 2200);
  }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { /* ignore */ } ta.remove(); toast(t('toastCopied'));
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { toast(t('toastCopied')); }, fallback);
    else fallback();
  }

  /* ---------------- animated numbers ---------------- */
  function animateNum(el, to, fmt) {
    if (!el) return;
    var from = parseFloat(el.getAttribute('data-v'));
    el.setAttribute('data-v', to);
    if (isNaN(from) || reduceMotion || from === to) { el.textContent = fmt(to); return; }
    var start = null, dur = 550;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
     LANGUAGE
     ========================================================= */
  var renderers = [];
  function applyStatic() {
    document.documentElement.lang = HTML_LANG[lang];
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('[data-wa]').forEach(function (el) { el.href = waLink(t(el.getAttribute('data-wa'))); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    document.title = t('siteTitle');
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('metaDesc'));
  }
  function setLang(l, announce) {
    if (!LI.hasOwnProperty(l)) return;
    lang = l; store.set('lang', l);
    applyStatic();
    renderers.forEach(function (r) { safe(r.fn, r.name); });
    if (announce) {
      document.body.classList.remove('lang-swap'); void document.body.offsetWidth; document.body.classList.add('lang-swap');
      toast(t('toastLang'));
    }
  }
  function onLang(name, fn) { renderers.push({ name: name, fn: fn }); }

  /* =========================================================
     OPEN / CLOSED
     ========================================================= */
  function renderOpen() {
    var n = nowIST(), open = n.h >= C.openHour && n.h < C.closeHour;
    var b = $('#openBadge'), tx = $('#openText'), pill = $('#openPill');
    if (b) b.classList.toggle('closed', !open);
    if (tx) tx.textContent = t(open ? 'openNow' : 'closedNow');
    if (pill) { pill.textContent = t(open ? 'openNow' : 'closedNow'); pill.classList.toggle('closed', !open); }
  }

  /* =========================================================
     SEASON
     ========================================================= */
  function renderSeason() {
    var m = nowIST().m;
    var s = D.seasons.filter(function (x) { return x.months.indexOf(m) > -1; })[0] || D.seasons[0];
    $('#seasonHead').textContent = tr(s.head);
    $('#seasonTitle').textContent = tr(s.title);
    $('#seasonGrid').innerHTML = s.items.map(function (it, i) {
      return '<article class="season-card"><span class="season-n">' + digits('0' + (i + 1)) + '</span><h3>' + esc(tr(it.t)) + '</h3><p>' + esc(tr(it.d)) +
        '</p><button type="button" class="link-btn" data-goto-cat="' + it.tag + '">' + esc(t('cat' + cap(it.tag))) + ' ' + icon('i-arrow') + '</button></article>';
    }).join('');
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* =========================================================
     SHOP + CART
     ========================================================= */
  var shop = { cat: 'all', q: '' };
  var cart = store.get('cart', {});
  if (typeof cart !== 'object' || cart === null || Array.isArray(cart)) cart = {};
  function prodById(id) { for (var i = 0; i < D.products.length; i++) if (D.products[i].id === id) return D.products[i]; return null; }
  Object.keys(cart).forEach(function (id) { if (!prodById(id) || !(cart[id] > 0)) delete cart[id]; });
  function norm(s) { return String(s).toLowerCase().normalize ? String(s).toLowerCase().normalize('NFC') : String(s).toLowerCase(); }
  function prodMatches(p, q) {
    if (!q) return true;
    var hay = norm(p.n.join(' ') + ' ' + p.d.join(' ') + ' ' + p.id + ' ' + (T['cat' + cap(p.cat)] || []).join(' '));
    return norm(q).split(/\s+/).every(function (w) { return !w || hay.indexOf(w) > -1; });
  }
  function renderCats() {
    var counts = { all: D.products.length };
    D.products.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    $('#catBar').innerHTML = ['all'].concat(D.categories).map(function (c) {
      return '<button type="button" role="tab" class="cat" data-cat="' + c + '" aria-selected="' + (shop.cat === c) + '">' + esc(t('cat' + cap(c))) + ' <span class="n">' + num(counts[c] || 0) + '</span></button>';
    }).join('');
  }
  function renderProducts(animate) {
    var list = D.products.filter(function (p) { return (shop.cat === 'all' || p.cat === shop.cat) && prodMatches(p, shop.q); });
    var grid = $('#productGrid');
    grid.innerHTML = list.map(function (p, i) {
      var inBag = cart[p.id] > 0;
      var media = p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : '<svg aria-hidden="true"><use href="#c-' + p.cat + '"/></svg>';
      return '<article class="product' + (animate ? ' enter' : '') + '" data-id="' + p.id + '" style="animation-delay:' + Math.min(i * 40, 400) + 'ms">' +
        '<div class="p-media c-' + p.cat + '">' + media + '<span class="p-cat">' + esc(t('cat' + cap(p.cat))) + '</span></div>' +
        '<h3 class="p-name">' + esc(tr(p.n)) + '</h3><p class="p-desc">' + esc(tr(p.d)) + '</p>' +
        (p.price ? '<span class="p-price">' + rupee(p.price) + '</span>' : '') +
        '<div class="p-actions"><button type="button" class="btn ' + (inBag ? 'btn-lime added' : 'btn-primary') + '" data-add="' + p.id + '">' + icon(inBag ? 'i-check' : 'i-bag') + '<span>' + esc(t(inBag ? 'inBag' : 'addBag')) + '</span></button>' +
        '<a class="btn btn-outline" target="_blank" rel="noopener" href="' + esc(waLink(t('waAskProduct') + ' ' + tr(p.n))) + '">' + icon('i-wa') + '<span>' + esc(t('askPrice')) + '</span></a></div></article>';
    }).join('');
    $('#productEmpty').hidden = list.length > 0;
    var note = $('#searchNote');
    note.hidden = !shop.q;
    $('#searchTerm').textContent = shop.q;
    bindTilt();
  }
  function setCat(c, scroll) {
    shop.cat = c;
    $$('#catBar .cat').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-cat') === c ? 'true' : 'false'); });
    renderProducts(true);
    if (scroll) $('#shop').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function cartCount() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k]; }, 0); }
  function saveCart() { store.set('cart', cart); }
  function renderCart() {
    var ids = Object.keys(cart);
    var c = $('#bagCount'); c.textContent = num(cartCount());
    $('#bagBtn').setAttribute('aria-label', t('bag') + ' — ' + num(cartCount()) + ' ' + t('items'));
    $('#cartList').innerHTML = ids.map(function (id) {
      var p = prodById(id); if (!p) return '';
      return '<li class="cart-item"><span class="ci-ico"><svg aria-hidden="true"><use href="#c-' + p.cat + '"/></svg></span><span><span class="ci-n">' + esc(tr(p.n)) + '</span><br>' +
        '<button type="button" class="ci-rm" data-rm="' + id + '">' + esc(t('remove')) + '</button></span>' +
        '<span class="qty"><button type="button" data-q="-1" data-id="' + id + '" aria-label="' + esc(t('qtyLess')) + '">' + icon('i-minus') + '</button><output>' + num(cart[id]) + '</output>' +
        '<button type="button" data-q="1" data-id="' + id + '" aria-label="' + esc(t('qtyMore')) + '">' + icon('i-plus') + '</button></span></li>';
    }).join('');
    $('#cartEmpty').hidden = ids.length > 0;
    $('#cartFoot').hidden = ids.length === 0;
    updateCartLink();
  }
  function updateCartLink() {
    var lines = [t('waOrderHead')];
    Object.keys(cart).forEach(function (id, i) { var p = prodById(id); if (p) lines.push((i + 1) + '. ' + tr(p.n) + ' × ' + cart[id]); });
    var name = ($('#cartName').value || '').trim(), vil = ($('#cartVillage').value || '').trim();
    if (name) lines.push(t('waName') + ': ' + name);
    if (vil) lines.push(t('waVillage') + ': ' + vil);
    $('#cartSend').href = waLink(lines.join('\n'));
  }
  function addToCart(id, srcEl) {
    if (!prodById(id)) return;
    cart[id] = (cart[id] || 0) + 1; saveCart();
    flyToBag(srcEl);
    renderCart(); renderProducts(false);
    var b = $('#bagCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    toast(t('toastAdded') + ': ' + tr(prodById(id).n));
  }
  function flyToBag(src) {
    if (reduceMotion || !src || !src.getBoundingClientRect) return;
    var target = $('#bagBtn'), a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!b.width) target = $('#menuBtn'), b = target.getBoundingClientRect();
    var dot = document.createElement('span'); dot.className = 'fly-dot';
    dot.style.left = (a.left + a.width / 2 - 9) + 'px'; dot.style.top = (a.top + a.height / 2 - 9) + 'px';
    document.body.appendChild(dot);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    if (dot.animate) {
      dot.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 120) + 'px) scale(1.3)', offset: 0.5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.4)', opacity: 0.6 }],
        { duration: 750, easing: 'cubic-bezier(.5,0,.5,1)' }).onfinish = function () { dot.remove(); };
    } else dot.remove();
  }
  function initShop() {
    $('#catBar').addEventListener('click', function (e) { var b = e.target.closest('.cat'); if (b) setCat(b.getAttribute('data-cat')); });
    $('#productGrid').addEventListener('click', function (e) { var b = e.target.closest('[data-add]'); if (b) addToCart(b.getAttribute('data-add'), b); });
    $('#seasonGrid').addEventListener('click', function (e) { var b = e.target.closest('[data-goto-cat]'); if (b) { shop.q = ''; setCat(b.getAttribute('data-goto-cat'), true); } });
    $('#clearSearch').addEventListener('click', function () { shop.q = ''; $('#searchInput').value = ''; renderProducts(true); });
    $('#cartList').addEventListener('click', function (e) {
      var q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
      if (q) { var id = q.getAttribute('data-id'); cart[id] = (cart[id] || 0) + (+q.getAttribute('data-q')); if (cart[id] <= 0) delete cart[id]; }
      else if (rm) delete cart[rm.getAttribute('data-rm')];
      else return;
      saveCart(); renderCart(); renderProducts(false);
    });
    $('#cartClear').addEventListener('click', function () { cart = {}; saveCart(); renderCart(); renderProducts(false); toast(t('toastCleared')); });
    ['#cartName', '#cartVillage'].forEach(function (s) { $(s).addEventListener('input', updateCartLink); });
    $('#cartName').value = store.get('cartName', ''); $('#cartVillage').value = store.get('cartVillage', '');
    $('#cartName').addEventListener('change', function () { store.set('cartName', this.value); });
    $('#cartVillage').addEventListener('change', function () { store.set('cartVillage', this.value); });
    $('#bagBtn').addEventListener('click', function () { openDrawer('#cartDrawer'); });
  }
  /* card tilt */
  function bindTilt() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.product:not([data-tilt])').forEach(function (card) {
      card.setAttribute('data-tilt', '1');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* =========================================================
     SEARCH (header)
     ========================================================= */
  var sections = [['home', 'navHome', 'i-home'], ['shop', 'navShop', 'i-shop'], ['weather', 'navWeather', 'i-sun'], ['calc', 'navCalc', 'i-calc'], ['mandi', 'navMandi', 'i-chart'], ['care', 'navCare', 'i-wrench'], ['ledger', 'navLedger', 'i-book'], ['schemes', 'navSchemes', 'i-bank'], ['contact', 'navContact', 'i-map']];
  var sIdx = -1, sItems = [];
  function initSearch() {
    var inp = $('#searchInput'), list = $('#searchList');
    function close() { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); sIdx = -1; }
    function build() {
      var q = inp.value.trim();
      if (!q) { close(); return; }
      var prods = D.products.filter(function (p) { return prodMatches(p, q); }).slice(0, 6);
      var secs = sections.filter(function (s) { return norm(T[s[1]].join(' ')).indexOf(norm(q)) > -1; }).slice(0, 3);
      sItems = [];
      var h = '';
      if (prods.length) {
        h += '<li class="grp" role="presentation">' + esc(t('searchProducts')) + '</li>';
        prods.forEach(function (p) { sItems.push({ type: 'p', id: p.id, label: tr(p.n) }); h += '<li role="option" id="so' + (sItems.length - 1) + '" data-i="' + (sItems.length - 1) + '"><span class="s-ico"><svg class="ico" aria-hidden="true"><use href="#c-' + p.cat + '"/></svg></span><span><b>' + esc(tr(p.n)) + '</b><br><span class="s-sub">' + esc(t('cat' + cap(p.cat))) + '</span></span></li>'; });
      }
      if (secs.length) {
        h += '<li class="grp" role="presentation">' + esc(t('searchSections')) + '</li>';
        secs.forEach(function (s) { sItems.push({ type: 's', id: s[0] }); h += '<li role="option" id="so' + (sItems.length - 1) + '" data-i="' + (sItems.length - 1) + '"><span class="s-ico">' + icon(s[2]) + '</span><b>' + esc(t(s[1])) + '</b></li>'; });
      }
      if (!sItems.length) h = '<li class="none" role="presentation">' + esc(t('searchNone')) + '</li>';
      list.innerHTML = h; list.hidden = false; inp.setAttribute('aria-expanded', 'true'); sIdx = -1;
    }
    function choose(i) {
      var it = sItems[i];
      if (!it) { // plain search → filter shop
        shop.q = inp.value.trim(); shop.cat = 'all'; renderCats(); renderProducts(true);
        $('#shop').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); close(); return;
      }
      if (it.type === 's') { close(); inp.value = ''; var el = document.getElementById(it.id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
      shop.q = it.label; shop.cat = 'all'; inp.value = it.label; renderCats(); renderProducts(true); close();
      $('#shop').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    function mark() {
      $$('li[role=option]', list).forEach(function (li) { li.setAttribute('aria-selected', li.getAttribute('data-i') == sIdx ? 'true' : 'false'); });
      inp.setAttribute('aria-activedescendant', sIdx > -1 ? 'so' + sIdx : '');
    }
    var tg = $('#searchToggle');
    tg.addEventListener('click', function () {
      var open = !$('#header').classList.contains('search-open');
      $('#header').classList.toggle('search-open', open); tg.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) setTimeout(function () { inp.focus(); }, 30); else close();
    });
    inp.addEventListener('input', debounce(build, 120));
    inp.addEventListener('focus', function () { if (inp.value.trim()) build(); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) build(); sIdx = Math.min(sItems.length - 1, sIdx + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sIdx = Math.max(-1, sIdx - 1); mark(); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(sIdx); }
      else if (e.key === 'Escape') { close(); }
    });
    inp.addEventListener('search', function () { if (!inp.value) { close(); if (shop.q) { shop.q = ''; renderProducts(true); } } });
    list.addEventListener('mousedown', function (e) { var li = e.target.closest('li[role=option]'); if (li) { e.preventDefault(); choose(+li.getAttribute('data-i')); } });
    document.addEventListener('click', function (e) { if (!e.target.closest('#search')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/input|textarea|select/i.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); inp.focus(); }
    });
  }

  /* =========================================================
     WEATHER
     ========================================================= */
  var W = { data: null, sel: 0, loading: false, ts: 0 };
  function wType(code) {
    if (code === 0) return ['clear', 'wc0']; if (code === 1) return ['clear', 'wc1']; if (code === 2) return ['partly', 'wc2']; if (code === 3) return ['cloud', 'wc3'];
    if (code === 45 || code === 48) return ['fog', 'wcFog'];
    if (code >= 51 && code <= 57) return ['drizzle', 'wcDrizzle'];
    if ((code >= 61 && code <= 67)) return ['rain', 'wcRain'];
    if (code >= 71 && code <= 77) return ['snow', 'wcSnow'];
    if (code >= 80 && code <= 86) return ['rain', 'wcShower'];
    if (code >= 95) return ['storm', 'wcStorm'];
    return ['cloud', 'wc3'];
  }
  function wIcon(code, isDay) {
    var ty = wType(code)[0], night = isDay === 0;
    var sun = night ? '<path class="moon" d="M30 10a14 14 0 1 0 10 22A12 12 0 0 1 30 10z"/>' :
      '<g class="sun-r"><path d="M24 4v5M24 39v5M4 24h5M39 24h5M10 10l3.5 3.5M34.5 34.5L38 38M10 38l3.5-3.5M34.5 13.5L38 10"/></g><circle class="sun-c" cx="24" cy="24" r="9"/>';
    var cloud = function (dark, dx, dy) { return '<path class="cloud' + (dark ? ' dark' : '') + '" transform="translate(' + (dx || 0) + ' ' + (dy || 0) + ')" d="M14 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-1 18z"/>'; };
    var drops = '<line class="drop" x1="18" y1="40" x2="16" y2="45"/><line class="drop" x1="26" y1="40" x2="24" y2="45"/><line class="drop" x1="34" y1="40" x2="32" y2="45"/>';
    var g = '';
    if (ty === 'clear') g = sun;
    else if (ty === 'partly') g = '<g transform="translate(-6 -8) scale(.8)">' + sun + '</g>' + cloud(false, 4, 2);
    else if (ty === 'cloud') g = cloud(false, -4, -6) + cloud(true, 4, 2);
    else if (ty === 'fog') g = cloud(false, 0, -6) + '<line class="fog" x1="8" y1="38" x2="36" y2="38"/><line class="fog" x1="14" y1="44" x2="42" y2="44"/>';
    else if (ty === 'drizzle' || ty === 'rain') g = cloud(ty === 'rain', 0, -6) + drops;
    else if (ty === 'storm') g = cloud(true, 0, -6) + '<path class="bolt" d="M25 32l-5 9h5l-3 7 9-11h-5l3-5z"/>';
    else g = cloud(false, 0, -4);
    return '<svg class="wi" viewBox="0 0 48 48" aria-hidden="true">' + g + '</svg>';
  }
  function wUrl() {
    return 'https://api.open-meteo.com/v1/forecast?latitude=' + C.lat + '&longitude=' + C.lon +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m' +
      '&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max' +
      '&timezone=Asia%2FKolkata&forecast_days=7';
  }
  function loadWeather(force) {
    if (W.loading) return;
    var cached = store.get('wcache', null);
    if (!force && cached && cached.data && Date.now() - cached.t < 20 * 60 * 1000) { W.data = cached.data; W.ts = cached.t; renderWeather(); return; }
    W.loading = true;
    showW('loading');
    fetchJSON(wUrl(), 12000).then(function (d) {
      if (!d || !d.daily || !d.hourly || !d.current) throw new Error('bad data');
      W.data = d; W.ts = Date.now(); store.set('wcache', { t: W.ts, data: d });
    }).catch(function (e) {
      if (cached && cached.data) { W.data = cached.data; W.ts = cached.t; }
      else W.data = null;
      if (window.console) console.warn('weather', e);
    }).then(function () { W.loading = false; renderWeather(); });
  }
  function showW(state) {
    $('#wLoading').hidden = state !== 'loading';
    $('#wError').hidden = state !== 'error';
    $('#wContent').hidden = state !== 'ok';
  }
  function hourIdx(dayIdx) { // indexes into hourly arrays for a given day
    var d = W.data, date = d.daily.time[dayIdx], out = [];
    for (var i = 0; i < d.hourly.time.length; i++) if (d.hourly.time[i].indexOf(date) === 0) out.push(i);
    return out;
  }
  function sprayOk(i) {
    var h = W.data.hourly, hr = +h.time[i].slice(11, 13);
    return hr >= 6 && hr <= 18 && h.wind_speed_10m[i] < 12 && (h.precipitation_probability[i] == null || h.precipitation_probability[i] < 30) && h.temperature_2m[i] < 32 && h.precipitation[i] < 0.2;
  }
  function sprayWindows(idxs) {
    var wins = [], cur = null;
    idxs.forEach(function (i) {
      var hr = +W.data.hourly.time[i].slice(11, 13);
      if (sprayOk(i)) { if (cur && cur.end === hr - 1) cur.end = hr; else { cur = { start: hr, end: hr }; wins.push(cur); } }
      else cur = null;
    });
    return wins;
  }
  function winLabel(w) { return fmtHour(w.start) + ' – ' + fmtHour(w.end + 1); }
  function dayName(i) { return i === 0 ? t('wToday') : i === 1 ? t('wTomorrow') : fmtDate(W.data.daily.time[i], { weekday: 'short' }); }
  function renderWeather() {
    if (!W.data) { showW(W.loading ? 'loading' : 'error'); renderMiniWeather(); return; }
    showW('ok');
    var d = W.data, c = d.current, dl = d.daily, n = nowIST();
    var todayIdx = Math.max(0, dl.time.indexOf(n.date));
    if (W.sel < todayIdx) W.sel = todayIdx;
    $('#wNowIcon').innerHTML = wIcon(c.weather_code, c.is_day);
    animateNum($('#wNowTemp'), c.temperature_2m, function (v) { return num(Math.round(v)) + '°'; });
    $('#wNowDesc').textContent = t(wType(c.weather_code)[1]);
    $('#wNowFeels').textContent = num(Math.round(c.apparent_temperature)) + '°';
    var stats = [
      ['i-drop', t('wHumidity'), num(c.relative_humidity_2m) + '%'],
      ['i-wind', t('wWind'), num(Math.round(c.wind_speed_10m)) + ' ' + t('wKmh')],
      ['i-thermo', t('wRainChance'), num(dl.precipitation_probability_max[todayIdx] || 0) + '%'],
      ['i-sunrise', t('wSunrise'), fmtClock(dl.sunrise[todayIdx])],
      ['i-sunset', t('wSunset'), fmtClock(dl.sunset[todayIdx])],
      ['i-uv', t('wUv'), num(dl.uv_index_max[todayIdx] || 0, 1)]
    ];
    $('#wStats').innerHTML = stats.map(function (s) { return '<div class="w-stat">' + icon(s[0]) + '<span>' + esc(s[1]) + '<b>' + esc(s[2]) + '</b></span></div>'; }).join('');
    var todayRest = hourIdx(todayIdx).filter(function (i) { return +d.hourly.time[i].slice(11, 13) >= n.h; });
    var wins = sprayWindows(todayRest);
    $('#wSprayToday').innerHTML = '<b>' + esc(t('wSprayGood')) + ':</b> ' + (wins.length ? wins.map(function (w) { return '<span class="slot">' + esc(winLabel(w)) + '</span>'; }).join('') : '<span class="slot bad">' + esc(t('wSprayAvoid')) + '</span>');
    var mins = Math.max(0, Math.round((Date.now() - W.ts) / 60000));
    var ud = new Date(W.ts + 5.5 * 3600 * 1000); $('#wUpdated').textContent = mins < 1 ? t('wNow') : fmtHM(ud.getUTCHours(), ud.getUTCMinutes());
    $('#wDays').innerHTML = dl.time.map(function (ds, i) {
      if (i < todayIdx) return '';
      return '<button type="button" role="tab" class="w-day" data-day="' + i + '" aria-selected="' + (i === W.sel) + '">' +
        '<span class="d-name">' + esc(dayName(i)) + '</span><span class="d-date">' + esc(fmtDate(ds, { day: 'numeric', month: 'short' })) + '</span>' +
        wIcon(dl.weather_code[i], 1) + '<span class="d-t">' + num(Math.round(dl.temperature_2m_max[i])) + '° <i>' + num(Math.round(dl.temperature_2m_min[i])) + '°</i></span>' +
        '<span class="d-r">' + icon('i-drop') + num(dl.precipitation_probability_max[i] || 0) + '%</span></button>';
    }).join('');
    renderHourly();
    renderMiniWeather();
  }
  function renderHourly() {
    var d = W.data, h = d.hourly, dl = d.daily, n = nowIST(), sel = W.sel;
    var idxs = hourIdx(sel), isToday = dl.time[sel] === n.date;
    $('#wHourDay').textContent = dayName(sel) + ', ' + fmtDate(dl.time[sel], { day: 'numeric', month: 'long' });
    $('#wDaySum').textContent = t(wType(dl.weather_code[sel])[1]) + ' · ' + t('wMax') + ' ' + num(Math.round(dl.temperature_2m_max[sel])) + '° · ' + t('wMin') + ' ' + num(Math.round(dl.temperature_2m_min[sel])) + '° · ' + t('wRain') + ' ' + num(dl.precipitation_sum[sel] || 0, 1) + ' ' + t('wMm');
    // chart
    var temps = idxs.map(function (i) { return h.temperature_2m[i]; }), rain = idxs.map(function (i) { return h.precipitation_probability[i] || 0; });
    var W_ = Math.max(320, Math.round(($('#wChart').clientWidth || 960))), H_ = 150, pad = 22, every = W_ < 640 ? 4 : 3, mn = Math.min.apply(null, temps) - 1, mx = Math.max.apply(null, temps) + 1;
    var xs = function (k) { return pad + k * (W_ - pad * 2) / Math.max(1, temps.length - 1); };
    var ys = function (v) { return 20 + (H_ - 50) * (1 - (v - mn) / Math.max(1, mx - mn)); };
    var path = temps.map(function (v, k) { return (k ? 'L' : 'M') + xs(k).toFixed(1) + ' ' + ys(v).toFixed(1); }).join(' ');
    var area = path + ' L' + xs(temps.length - 1).toFixed(1) + ' ' + (H_ - 22) + ' L' + xs(0).toFixed(1) + ' ' + (H_ - 22) + ' Z';
    var bars = rain.map(function (r, k) { var bh = (r / 100) * 40; return '<rect class="rain" x="' + (xs(k) - 6).toFixed(1) + '" y="' + (H_ - 22 - bh).toFixed(1) + '" width="12" height="' + bh.toFixed(1) + '" rx="3" opacity=".7"/>'; }).join('');
    var labels = temps.map(function (v, k) { return k % every === 0 ? '<circle class="pt" cx="' + xs(k).toFixed(1) + '" cy="' + ys(v).toFixed(1) + '" r="4"/><text class="lbl" x="' + xs(k).toFixed(1) + '" y="' + (ys(v) - 10).toFixed(1) + '" text-anchor="middle">' + num(Math.round(v)) + '°</text><text class="lbl" x="' + xs(k).toFixed(1) + '" y="' + (H_ - 4) + '" text-anchor="middle" opacity=".7">' + esc(fmtHour(+h.time[idxs[k]].slice(11, 13))) + '</text>' : ''; }).join('');
    var nowLine = '';
    if (isToday) { var k = idxs.findIndex(function (i) { return +h.time[i].slice(11, 13) === n.h; }); if (k > -1) nowLine = '<line class="now" x1="' + xs(k) + '" x2="' + xs(k) + '" y1="8" y2="' + (H_ - 22) + '"/>'; }
    $('#wChart').innerHTML = '<svg viewBox="0 0 ' + W_ + ' ' + H_ + '" role="img" aria-label="' + esc(t('wTemp')) + '"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A2F" stop-opacity=".25"/><stop offset="1" stop-color="#FF7A2F" stop-opacity="0"/></linearGradient></defs>' +
      bars + '<path class="area" d="' + area + '"/><g class="drawn"><path class="line" d="' + path + '" style="--len:2400"/></g>' + nowLine + labels + '</svg>';
    // hour cards
    $('#wHours').innerHTML = idxs.map(function (i, k) {
      var hr = +h.time[i].slice(11, 13), now = isToday && hr === n.h;
      return '<div class="w-hour' + (sprayOk(i) ? ' good' : '') + (now ? ' now' : '') + '" style="animation-delay:' + Math.min(k * 25, 500) + 'ms" title="' + esc(sprayOk(i) ? t('wSprayOk') : '') + '">' +
        '<span class="h-t">' + esc(now ? t('wNow') : fmtHour(hr)) + '</span>' + wIcon(h.weather_code[i], h.is_day[i]) +
        '<span class="h-temp">' + num(Math.round(h.temperature_2m[i])) + '°</span>' +
        '<span class="h-meta">' + icon('i-drop') + num(h.precipitation_probability[i] || 0) + '%</span>' +
        '<span class="h-meta">' + icon('i-wind') + num(Math.round(h.wind_speed_10m[i])) + '</span>' +
        '<span class="h-meta">' + num(h.relative_humidity_2m[i]) + '% ' + esc(t('wRH')) + '</span></div>';
    }).join('');
    if (isToday) { var strip = $('#wHours'), nowEl = $('.w-hour.now', strip); if (nowEl) strip.scrollLeft = Math.max(0, nowEl.offsetLeft - strip.offsetLeft - 10); }
    else $('#wHours').scrollLeft = 0;
    var wins = sprayWindows(idxs);
    $('#wDaySpray').innerHTML = '<b>' + esc(t('wSprayGood')) + ':</b> ' + (wins.length ? wins.map(function (w) { return '<span class="slot">' + esc(winLabel(w)) + '</span>'; }).join('') : '<span class="slot bad">' + esc(t('wSprayNone')) + '</span>') + '<span class="rule">' + esc(t('wSprayRule')) + '</span>';
  }
  function renderMiniWeather() {
    var body = $('#mwBody'), days = $('#mwDays'), sp = $('#sprayMini');
    if (!W.data) {
      if (!W.loading) { body.innerHTML = '<span class="mw-txt">' + esc(t('wError')) + '</span>'; days.innerHTML = ''; $('#mwMeta').innerHTML = ''; sp.textContent = t('wError'); }
      return;
    }
    var d = W.data, c = d.current, dl = d.daily, n = nowIST(), ti = Math.max(0, dl.time.indexOf(n.date));
    body.innerHTML = wIcon(c.weather_code, c.is_day) + '<span class="mw-temp">' + num(Math.round(c.temperature_2m)) + '°</span><span class="mw-txt"><b>' + esc(t(wType(c.weather_code)[1])) + '</b>' +
      esc(t('wWind')) + ' ' + num(Math.round(c.wind_speed_10m)) + ' ' + esc(t('wKmh')) + ' · ' + esc(t('wHumidity')) + ' ' + num(c.relative_humidity_2m) + '%</span>';
    $('#mwMeta').innerHTML = [['i-drop', t('wRainChance'), num(dl.precipitation_probability_max[ti] || 0) + '%'], ['i-sunrise', t('wSunrise'), fmtClock(dl.sunrise[ti])], ['i-sunset', t('wSunset'), fmtClock(dl.sunset[ti])]]
      .map(function (m) { return '<span>' + icon(m[0]) + '<span>' + esc(m[1]) + '<b>' + esc(m[2]) + '</b></span></span>'; }).join('');
    var html = '';
    for (var i = ti; i < Math.min(dl.time.length, ti + 5); i++) html += '<span class="mw-day"><span>' + esc(dayName(i)) + '</span>' + wIcon(dl.weather_code[i], 1) + '<b>' + num(Math.round(dl.temperature_2m_max[i])) + '°</b></span>';
    days.innerHTML = html;
    var rest = hourIdx(ti).filter(function (i) { return +d.hourly.time[i].slice(11, 13) >= n.h; });
    var wins = sprayWindows(rest);
    sp.innerHTML = wins.length ? '<span class="spray-good">' + esc(t('wSprayOk')) + ': ' + wins.map(winLabel).map(esc).join(', ') + '</span>' : '<span class="spray-bad">' + esc(t('wSprayNone')) + '</span>';
  }
  function initWeather() {
    $('#wDays').addEventListener('click', function (e) {
      var b = e.target.closest('.w-day'); if (!b) return;
      W.sel = +b.getAttribute('data-day');
      $$('.w-day').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      renderHourly();
    });
    $('#wDays').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var btns = $$('.w-day'), i = btns.indexOf(document.activeElement); if (i < 0) return;
      var nb = btns[clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, btns.length - 1)]; nb.focus(); nb.click();
    });
    $('#wRefresh').addEventListener('click', function () { loadWeather(true); });
    $('#wRetry').addEventListener('click', function () { loadWeather(true); });
    loadWeather(false);
    window.addEventListener('resize', debounce(function () { if (W.data && !$('#wContent').hidden) renderHourly(); }, 250));
    setInterval(function () { if (!document.hidden) loadWeather(false); }, 30 * 60 * 1000);
  }

  /* =========================================================
     CALCULATORS
     ========================================================= */
  var CS = store.get('calc', null) || {};
  var CDEF = {
    fert: { crop: 0, acres: 2 },
    pest: { dose: 2, tank: 16, water: 200, acres: 1 },
    fuel: { acres: 2, manDays: 10, wage: 400, hrs: 6, fuel: 1, fuelPrice: 105 },
    chaff: { animals: 5, fodder: 25, before: 30, after: 8, price: 3 },
    spray: { tank: 16, flow: 1, speed: 0.5, swath: 1 }
  };
  Object.keys(CDEF).forEach(function (k) { CS[k] = Object.assign({}, CDEF[k], CS[k] || {}); });
  var activeTab = store.get('calcTab', 'fert'); if (!CDEF[activeTab]) activeTab = 'fert';
  var FIELDS = {
    pest: [['dose', 'pDose', 0.1, 20, 0.1, 'unit:pUnit'], ['tank', 'pTank', 5, 500, 1, 'unit:unitL'], ['water', 'pWater', 50, 1000, 10, 'unit:unitL'], ['acres', 'pArea', 0.25, 50, 0.25, 'unit:fAcre']],
    fuel: [['acres', 'uArea', 0.25, 50, 0.25, 'unit:fAcre'], ['manDays', 'uManDays', 1, 40, 1, ''], ['wage', 'uWage', 100, 1500, 10, '₹'], ['hrs', 'uHrs', 1, 20, 0.5, 'unit:unitHr'], ['fuel', 'uFuel', 0.2, 4, 0.1, 'unit:unitL'], ['fuelPrice', 'uFuelPrice', 60, 200, 1, '₹']],
    chaff: [['animals', 'chAnimals', 1, 200, 1, ''], ['fodder', 'chFodder', 5, 60, 1, 'unit:unitKg'], ['before', 'chWasteBefore', 5, 60, 1, '%'], ['after', 'chWasteAfter', 0, 30, 1, '%'], ['price', 'chPrice', 0.5, 15, 0.5, '₹']],
    spray: [['tank', 'spTank', 5, 500, 1, 'unit:unitL'], ['flow', 'spFlow', 0.2, 10, 0.1, ''], ['speed', 'spSpeed', 0.2, 2, 0.05, ''], ['swath', 'spSwath', 0.5, 12, 0.1, '']]
  };
  function fieldHTML(calc, f) {
    var v = CS[calc][f[0]];
    return '<div class="field"><label for="f-' + calc + '-' + f[0] + '">' + esc(t(f[1])) + '</label>' +
      '<input type="number" id="f-' + calc + '-' + f[0] + '" data-c="' + calc + '" data-k="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '" value="' + v + '" inputmode="decimal">' +
      '<input type="range" aria-label="' + esc(t(f[1])) + '" data-c="' + calc + '" data-k="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '" value="' + v + '"></div>';
  }
  function resOut(id, label, extra, cls) { return '<div class="res ' + (cls || '') + '"><span>' + esc(label) + '</span><b id="' + id + '">—</b>' + (extra ? '<small id="' + id + 'x">' + esc(extra) + '</small>' : '') + '</div>'; }
  function actions(calc) { return '<div class="out-actions"><a class="btn btn-primary" id="share-' + calc + '" href="#" target="_blank" rel="noopener">' + icon('i-wa') + '<span>' + esc(t('cShare')) + '</span></a><button type="button" class="btn btn-outline" data-reset="' + calc + '">' + icon('i-refresh') + '<span>' + esc(t('cReset')) + '</span></button></div>'; }
  function renderCalc() {
    var s = CS.fert;
    var fert = '<div class="panel" data-panel="fert" role="tabpanel"><div class="p-in"><span class="f-label">1. ' + esc(t('fCrop')) + '</span><div class="crop-grid">' +
      D.crops.map(function (c, i) { return '<button type="button" class="crop" data-crop="' + i + '" aria-pressed="' + (i === s.crop) + '"><b>' + esc(tr(c.n)) + '</b><small>NPK ' + digits(c.npk.join(':')) + '</small></button>'; }).join('') +
      '</div><div class="row-between"><span class="f-label">2. ' + esc(t('fArea')) + '</span><div class="stepper"><button type="button" data-step="-0.5" aria-label="−">' + icon('i-minus') + '</button><output id="fAcres"></output><button type="button" data-step="0.5" aria-label="+">' + icon('i-plus') + '</button></div></div>' +
      '<input type="range" aria-label="' + esc(t('fArea')) + '" data-c="fert" data-k="acres" min="0.5" max="50" step="0.5" value="' + s.acres + '" style="width:100%;accent-color:#2E7D4F">' +
      '<p class="note">' + esc(t('fNote')) + '</p></div>' +
      '<div class="p-out"><div class="out-head"><span class="out-title" id="fTitle"></span><span class="tag-peach">' + esc(t('fNeed')) + '</span></div>' +
      '<div class="bars">' + ['N', 'P', 'K'].map(function (k, i) { return '<div class="bar-row"><span>' + esc(t('f' + k)) + '</span><span class="bar-track"><span class="bar-fill" id="fb' + k + '" style="width:0;background:' + ['#2E7D4F', '#FF7A2F', '#8FC23F'][i] + '"></span></span><b id="fv' + k + '"></b></div>'; }).join('') + '</div>' +
      '<span class="f-label">' + esc(t('fBags')) + '</span><div class="res-grid">' + resOut('fUrea', t('fUrea'), ' ', 'hl') + resOut('fDap', t('fDap'), ' ') + resOut('fMop', t('fMop'), ' ') + '</div>' +
      '<p class="note">' + esc(t('fSplit')) + '</p>' + actions('fert') + '</div></div>';
    function simple(calc, outs) {
      return '<div class="panel" data-panel="' + calc + '" role="tabpanel" hidden><div class="p-in"><span class="f-label">' + esc(t('cAssume')) + '</span>' + FIELDS[calc].map(function (f) { return fieldHTML(calc, f); }).join('') + '</div>' +
        '<div class="p-out"><div class="out-head"><span class="out-title">' + esc(t('cResult')) + '</span></div><div class="res-grid">' + outs + '</div><p class="note">' + esc(t(calc === 'pest' ? 'pNote' : calc === 'fuel' ? 'uNote' : calc === 'chaff' ? 'chNote' : 'spNote')) + '</p>' + actions(calc) + '</div></div>';
    }
    var pest = simple('pest', resOut('pTanks', t('pTanks'), '', 'hl') + resOut('pPerTank', t('pPerTank'), '') + resOut('pTotal', t('pTotal'), '') + resOut('pTotalWater', t('pTotalWater'), '', 'wide'));
    var fuel = simple('fuel', resOut('uManual', t('uManual'), ' ') + resOut('uMachine', t('uMachine'), ' ') + resOut('uSave', t('uSave'), ' ', 'hl') + resOut('uTime', t('uTimeSave'), '', 'wide'));
    var chaff = simple('chaff', resOut('chDay', t('chSavedDay'), '') + resOut('chMonth', t('chSavedMonth'), '') + resOut('chValue', t('chValue'), '', 'hl wide'));
    var spray = simple('spray', resOut('spArea', t('spAreaTank'), ' ') + resOut('spTanks', t('spTanksAcre'), '', 'hl') + resOut('spWater', t('spWaterAcre'), '') + resOut('spTime', t('spTimeAcre'), '', 'wide'));
    $('#calcPanels').innerHTML = fert + pest + fuel + chaff + spray;
    $('#calcLic').textContent = 'LCFRD0920260404SNG';
    showTab(activeTab, false);
    Object.keys(CDEF).forEach(updateCalc);
  }
  function showTab(name, focus) {
    activeTab = name; store.set('calcTab', name);
    $$('#calcTabs .tab').forEach(function (b) { var on = b.getAttribute('data-tab') === name; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    $$('#calcPanels .panel').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
  }
  function setOut(id, v, fmt) { animateNum(document.getElementById(id), v, fmt || function (x) { return num(Math.round(x)); }); }
  function setX(id, s) { var e = document.getElementById(id + 'x'); if (e) e.textContent = s; }
  function setShare(calc, lines) { var a = document.getElementById('share-' + calc); if (a) a.href = waLink(lines.join('\n')); }
  function mlFmt(v) { return v >= 1000 ? num(v / 1000, 2) + ' ' + t('unitL') : num(Math.round(v)) + ' ' + ({ mr: 'मिली/ग्रॅ', hi: 'मिली/ग्रा', en: 'ml/g' })[lang]; }
  function updateCalc(calc) {
    var s = CS[calc];
    if (calc === 'fert') {
      var c = D.crops[s.crop] || D.crops[0], a = s.acres;
      var N = c.npk[0] * a, P = c.npk[1] * a, K = c.npk[2] * a;
      var dap = P / 0.46, urea = Math.max(0, (N - dap * 0.18) / 0.46), mop = K / 0.6, mx = Math.max(N, P, K) || 1;
      $('#fAcres').textContent = num(a, 2) + ' ' + t('fAcre') + ' (' + num(Math.round(a * 40)) + ' ' + t('fGuntha') + ')';
      $('#fTitle').textContent = tr(c.n) + ' · ' + num(a, 2) + ' ' + t('fAcre');
      [['N', N], ['P', P], ['K', K]].forEach(function (x) { $('#fb' + x[0]).style.width = Math.max(3, x[1] / mx * 100) + '%'; setOut('fv' + x[0], x[1], function (v) { return num(Math.round(v)) + ' kg'; }); });
      setOut('fUrea', Math.ceil(urea / 45)); setX('fUrea', num(45) + ' ' + t('fBagOf') + ' · ' + num(Math.round(urea)) + ' kg');
      setOut('fDap', Math.ceil(dap / 50)); setX('fDap', num(50) + ' ' + t('fBagOf') + ' · ' + num(Math.round(dap)) + ' kg');
      setOut('fMop', Math.ceil(mop / 50)); setX('fMop', num(50) + ' ' + t('fBagOf') + ' · ' + num(Math.round(mop)) + ' kg');
      $$('.crop').forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-crop') === s.crop ? 'true' : 'false'); });
      var r = $('input[type=range][data-c=fert]'); if (r) r.value = a;
      setShare('fert', [t('waAskProduct'), tr(c.n) + ' — ' + a + ' ' + t('fAcre'), t('fUrea') + ': ' + Math.ceil(urea / 45) + ' × 45 kg', t('fDap') + ': ' + Math.ceil(dap / 50) + ' × 50 kg', t('fMop') + ': ' + Math.ceil(mop / 50) + ' × 50 kg']);
    } else if (calc === 'pest') {
      var tw = s.water * s.acres, tanks = Math.ceil(tw / s.tank), per = s.dose * s.tank, tot = s.dose * tw;
      setOut('pTanks', tanks);
      setOut('pPerTank', per, mlFmt); setOut('pTotal', tot, mlFmt);
      setOut('pTotalWater', tw, function (v) { return num(Math.round(v)) + ' ' + t('unitL'); });
      setShare('pest', [t('tabPest'), t('pArea') + ': ' + s.acres + ' ' + t('fAcre'), t('pTanks') + ': ' + tanks, t('pPerTank') + ': ' + per + ' ml/g', t('pTotal') + ': ' + tot + ' ml/g']);
    } else if (calc === 'fuel') {
      var manual = s.acres * s.manDays * s.wage, mHrs = s.acres * s.hrs, machine = mHrs * s.fuel * s.fuelPrice + (mHrs / 8) * s.wage, save = manual - machine;
      setOut('uManual', manual, rupee); setX('uManual', num(s.acres * s.manDays) + ' ' + t('uDays'));
      setOut('uMachine', machine, rupee); setX('uMachine', num(mHrs, 1) + ' ' + t('unitHr'));
      setOut('uSave', save, rupee); setX('uSave', manual > 0 ? num(Math.round(save / manual * 100)) + '%' : '');
      setOut('uTime', Math.max(0, s.acres * s.manDays - mHrs / 8), function (v) { return num(v, 1) + ' ' + t('uDays'); });
      setShare('fuel', [t('tabFuel'), t('uManual') + ': ' + Math.round(manual), t('uMachine') + ': ' + Math.round(machine), t('uSave') + ': ' + Math.round(save), t('waAskProduct') + ' ' + tr(prodById('power-weeder').n)]);
    } else if (calc === 'chaff') {
      var pct = Math.max(0, s.before - s.after) / 100, day = s.animals * s.fodder * pct;
      setOut('chDay', day, function (v) { return num(v, 1) + ' ' + t('unitKg'); });
      setOut('chMonth', day * 30, function (v) { return num(Math.round(v)) + ' ' + t('unitKg'); });
      setOut('chValue', day * 30 * s.price, rupee);
      setShare('chaff', [t('tabChaff'), t('chAnimals') + ': ' + s.animals, t('chValue') + ': ₹' + Math.round(day * 30 * s.price), t('waAskProduct') + ' ' + tr(prodById('chaff-electric').n)]);
    } else if (calc === 'spray') {
      var tmin = s.tank / s.flow, area = tmin * 60 * s.speed * s.swath, acre = 4046.86;
      setOut('spArea', area / 101.17, function (v) { return num(v, 1) + ' ' + t('unitGuntha'); }); setX('spArea', num(Math.round(area)) + ' m²');
      setOut('spTanks', acre / area, function (v) { return num(v, 1); });
      setOut('spWater', acre / area * s.tank, function (v) { return num(Math.round(v)) + ' ' + t('unitL'); });
      setOut('spTime', acre / (s.speed * s.swath) / 60, function (v) { return v >= 60 ? num(v / 60, 1) + ' ' + t('unitHr') : num(Math.round(v)) + ' ' + t('unitMin'); });
      setShare('spray', [t('tabSpray'), t('spTanksAcre') + ': ' + (acre / area).toFixed(1), t('spWaterAcre') + ': ' + Math.round(acre / area * s.tank) + ' L']);
    }
    store.set('calc', CS);
  }
  function initCalc() {
    $('#calcTabs').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) showTab(b.getAttribute('data-tab'), false); });
    $('#calcTabs').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var tabs = $$('#calcTabs .tab'), i = tabs.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); var nt = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; showTab(nt.getAttribute('data-tab'), true);
    });
    var panels = $('#calcPanels');
    panels.addEventListener('click', function (e) {
      var cb = e.target.closest('[data-crop]'), st = e.target.closest('[data-step]'), rs = e.target.closest('[data-reset]');
      if (cb) { CS.fert.crop = +cb.getAttribute('data-crop'); updateCalc('fert'); }
      else if (st) { CS.fert.acres = clamp(Math.round((CS.fert.acres + parseFloat(st.getAttribute('data-step'))) * 2) / 2, 0.5, 50); updateCalc('fert'); }
      else if (rs) { var k = rs.getAttribute('data-reset'); CS[k] = Object.assign({}, CDEF[k]); renderCalc(); showTab(k, false); }
    });
    function onInput(e) {
      var el = e.target; if (!el.hasAttribute('data-c')) return;
      var c = el.getAttribute('data-c'), k = el.getAttribute('data-k'), v = parseFloat(el.value);
      if (isNaN(v)) return;
      var min = parseFloat(el.min), max = parseFloat(el.max);
      if (e.type === 'change' || el.type === 'range') v = clamp(v, min, max);
      else if (v < min || v > max) return;
      CS[c][k] = v;
      $$('[data-c="' + c + '"][data-k="' + k + '"]', panels).forEach(function (o) { if (o !== el) o.value = v; });
      if (e.type === 'change') el.value = v;
      updateCalc(c);
    }
    panels.addEventListener('input', onInput);
    panels.addEventListener('change', onInput);
  }

  /* =========================================================
     MANDI
     ========================================================= */
  var M = { rows: null, state: 'loading', market: 'all', q: '', date: '' };
  function commodityName(raw) {
    var r = norm(raw), keys = Object.keys(D.commodities);
    keys.sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < keys.length; i++) if (r.indexOf(keys[i]) > -1) return tr(D.commodities[keys[i]]);
    return raw;
  }
  function marketName(raw) { var k = norm(raw || '').replace(/\(.*\)/, '').trim(); var m = D.markets && D.markets[k]; return m ? tr(m) : raw; }
  function mandiUrl(district, variant) {
    var base = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=' + encodeURIComponent(C.dataGovApiKey) + '&format=json&limit=500';
    var st = variant === 0 ? 'filters%5Bstate.keyword%5D' : 'filters%5Bstate%5D';
    var di = variant === 0 ? 'filters%5Bdistrict%5D' : 'filters%5Bdistrict%5D';
    return base + '&' + st + '=' + encodeURIComponent(C.mandiState) + '&' + di + '=' + encodeURIComponent(district);
  }
  function loadMandi(force) {
    var cached = store.get('mcache', null);
    if (!force && cached && cached.rows && Date.now() - cached.t < 60 * 60 * 1000) { M.rows = cached.rows; M.state = cached.rows.length ? 'ok' : 'empty'; renderMandi(); return; }
    M.state = 'loading'; renderMandi();
    var wanted = C.mandiDistricts.map(norm);
    function one(district) {
      return fetchJSON(mandiUrl(district, 0), 12000).then(function (d) {
        if (d && d.records && d.records.length) return d.records;
        return fetchJSON(mandiUrl(district, 1), 12000).then(function (d2) { return (d2 && d2.records) || []; });
      });
    }
    Promise.all(C.mandiDistricts.map(function (dn) { return one(dn).catch(function () { return null; }); })).then(function (res) {
      if (res.every(function (r) { return r === null; })) throw new Error('mandi unavailable');
      var rows = [];
      res.forEach(function (r) { (r || []).forEach(function (x) {
        if (!x || wanted.indexOf(norm(x.district || '')) < 0) return;
        rows.push({ market: x.market, commodity: x.commodity, variety: x.variety, date: x.arrival_date, min: +x.min_price, max: +x.max_price, modal: +x.modal_price });
      }); });
      rows = rows.filter(function (r) { return r.modal > 0; });
      M.rows = rows; M.state = rows.length ? 'ok' : 'empty';
      store.set('mcache', { t: Date.now(), rows: rows });
    }).catch(function (e) {
      if (cached && cached.rows && cached.rows.length) { M.rows = cached.rows; M.state = 'ok'; }
      else { M.rows = null; M.state = 'error'; }
      if (window.console) console.warn('mandi', e);
    }).then(renderMandi);
  }
  function renderMandi() {
    var body = $('#mandiBody'), chips = $('#mkChips');
    if (M.state === 'loading') { chips.innerHTML = ''; body.innerHTML = '<div class="mandi-state"><span class="spinner"></span>' + esc(t('mLoading')) + '</div>'; renderTicker(); return; }
    if (M.state !== 'ok') {
      chips.innerHTML = '';
      body.innerHTML = '<div class="mandi-state"><p>' + esc(t(M.state === 'error' ? 'mError' : 'mEmpty')) + '</p><div class="acts">' +
        '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + esc(waLink(t('waRates'))) + '">' + icon('i-wa') + '<span>' + esc(t('mAskWa')) + '</span></a>' +
        '<a class="btn btn-outline" target="_blank" rel="noopener" href="https://agmarknet.gov.in/">' + esc(t('mOpenAgmark')) + '</a>' +
        '<button type="button" class="btn btn-outline" id="mRetry">' + icon('i-refresh') + '<span>' + esc(t('mRetry')) + '</span></button></div></div>';
      $('#mandiDate').textContent = '';
      renderTicker(); return;
    }
    var markets = []; M.rows.forEach(function (r) { if (markets.indexOf(r.market) < 0) markets.push(r.market); });
    markets.sort();
    if (M.market !== 'all' && markets.indexOf(M.market) < 0) M.market = 'all';
    chips.innerHTML = ['all'].concat(markets).map(function (m) { return '<button type="button" class="mk" data-mk="' + esc(m) + '" aria-pressed="' + (M.market === m) + '">' + esc(m === 'all' ? t('mAll') : marketName(m)) + '</button>'; }).join('');
    var q = norm(M.q);
    var rows = M.rows.filter(function (r) { return (M.market === 'all' || r.market === M.market) && (!q || norm(r.commodity + ' ' + commodityName(r.commodity) + ' ' + r.variety + ' ' + r.market + ' ' + marketName(r.market)).indexOf(q) > -1); });
    rows.sort(function (a, b) { return commodityName(a.commodity).localeCompare(commodityName(b.commodity)); });
    var mx = Math.max.apply(null, rows.map(function (r) { return r.modal; }).concat([1]));
    if (!rows.length) { body.innerHTML = '<div class="mandi-state"><p>' + esc(t('mNoMatch')) + '</p></div>'; }
    else body.innerHTML = '<div class="table-wrap"><table class="mtable"><thead><tr><th>' + esc(t('mCommodity')) + '</th><th>' + esc(t('mVariety')) + '</th><th>' + esc(t('mMarket')) + '</th><th>' + esc(t('mMin')) + '</th><th>' + esc(t('mMax')) + '</th><th>' + esc(t('mModal')) + '</th><th>' + esc(t('mDate')) + '</th></tr></thead><tbody>' +
      rows.map(function (r, i) { return '<tr><td><b>' + esc(commodityName(r.commodity)) + '</b></td><td>' + esc(r.variety) + '</td><td>' + esc(marketName(r.market)) + '</td><td class="num">' + rupee(r.min) + '</td><td class="num">' + rupee(r.max) + '</td><td class="num td-modal">' + rupee(r.modal) + '<span class="bar-mini" style="width:' + Math.max(6, r.modal / mx * 100) + '%;animation-delay:' + Math.min(i * 30, 600) + 'ms"></span></td><td>' + esc(digits(r.date || '')) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var dates = M.rows.map(function (r) { return r.date; }).filter(Boolean);
    $('#mandiDate').textContent = dates.length ? t('mDate') + ': ' + digits(dates[0]) : '';
    renderTicker();
  }
  function renderTicker() {
    var tk = $('#ticker');
    if (M.state === 'loading') { tk.className = 'ticker'; tk.innerHTML = '<span class="skeleton sk-md" style="width:300px"></span>'; return; }
    if (M.state !== 'ok') { tk.className = 'ticker'; tk.innerHTML = '<span class="ticker-msg">' + esc(t(M.state === 'error' ? 'mError' : 'mEmpty')) + ' <a href="' + esc(waLink(t('waRates'))) + '" target="_blank" rel="noopener">' + esc(t('mAskWa')) + '</a></span>'; return; }
    var seen = {}, items = [];
    M.rows.forEach(function (r) { var k = commodityName(r.commodity); if (!seen[k] && items.length < 14) { seen[k] = 1; items.push(r); } });
    var html = items.map(function (r) { return '<span class="tk"><span>' + esc(commodityName(r.commodity)) + '</span><b>' + rupee(r.modal) + '</b><small>' + esc(marketName(r.market)) + '</small></span>'; }).join('');
    tk.innerHTML = html + html; tk.className = 'ticker' + (reduceMotion ? '' : ' run');
  }
  function initMandi() {
    $('#mkChips').addEventListener('click', function (e) { var b = e.target.closest('.mk'); if (b) { M.market = b.getAttribute('data-mk'); renderMandi(); } });
    $('#mandiBody').addEventListener('click', function (e) { if (e.target.closest('#mRetry')) loadMandi(true); });
    $('#mandiSearch').addEventListener('input', debounce(function () { M.q = this.value.trim(); renderMandi(); }, 150));
    loadMandi(false);
  }

  /* =========================================================
     CARE
     ========================================================= */
  var careSel = 0;
  var CARE_ICON = { sprayer: 'c-sprayers', chaff: 'c-machinery', weeder: 'c-spares', milking: 'c-dairy' };
  function renderCare() {
    $('#careTabs').innerHTML = D.care.map(function (m, i) { return '<button type="button" role="tab" class="care-tab" data-care="' + i + '" aria-selected="' + (i === careSel) + '"><svg aria-hidden="true"><use href="#' + CARE_ICON[m.id] + '"/></svg>' + esc(tr(m.n)) + '</button>'; }).join('');
    var m = D.care[careSel];
    $('#careSteps').innerHTML = m.steps.map(function (s, i) { return '<li style="animation-delay:' + i * 70 + 'ms">' + esc(tr(s)) + '</li>'; }).join('');
    $('#careAsk').href = waLink(t('waCare') + ' ' + tr(m.n));
  }
  function initCare() { $('#careTabs').addEventListener('click', function (e) { var b = e.target.closest('.care-tab'); if (b) { careSel = +b.getAttribute('data-care'); renderCare(); } }); }

  /* =========================================================
     LEDGER
     ========================================================= */
  var LCATS = ['lcFert', 'lcPest', 'lcSeed', 'lcLabour', 'lcFuel', 'lcMachine', 'lcOther', 'lcIncome'];
  var LCOL = ['#2E7D4F', '#FF7A2F', '#8FC23F', '#2F5D8A', '#B8460F', '#6B7F3A', '#7A8C80', '#3F9A2E'];
  var ledger = store.get('ledger', []); if (!Array.isArray(ledger)) ledger = [];
  var lgFilter = 'all';
  function saveLedger() { store.set('ledger', ledger); }
  function renderLedger() {
    var sel = $('#lgCat'), cur = sel.value;
    sel.innerHTML = LCATS.map(function (k) { return '<option value="' + k + '">' + esc(t(k)) + '</option>'; }).join('');
    if (cur) sel.value = cur;
    var plots = []; ledger.forEach(function (e) { if (e.plot && plots.indexOf(e.plot) < 0) plots.push(e.plot); });
    if (lgFilter !== 'all' && plots.indexOf(lgFilter) < 0) lgFilter = 'all';
    $('#lgFilter').innerHTML = '<option value="all">' + esc(t('lgAllPlots')) + '</option>' + plots.map(function (p) { return '<option value="' + esc(p) + '"' + (p === lgFilter ? ' selected' : '') + '>' + esc(p) + '</option>'; }).join('');
    $('#lgPlotList').innerHTML = plots.map(function (p) { return '<option value="' + esc(p) + '">'; }).join('');
    var rows = ledger.filter(function (e) { return lgFilter === 'all' || e.plot === lgFilter; });
    var exp = 0, inc = 0, byCat = {};
    rows.forEach(function (e) { if (e.cat === 'lcIncome') inc += e.amt; else { exp += e.amt; byCat[e.cat] = (byCat[e.cat] || 0) + e.amt; } });
    var prof = inc - exp;
    $('#lgSum').innerHTML = '<div class="lg-s"><span>' + esc(t('lgExpense')) + '</span><b id="lgE"></b></div><div class="lg-s"><span>' + esc(t('lgIncome')) + '</span><b id="lgI"></b></div><div class="lg-s ' + (prof >= 0 ? 'pos' : 'neg') + '"><span>' + esc(t('lgProfit')) + '</span><b id="lgP"></b></div>';
    setOut('lgE', exp, rupee); setOut('lgI', inc, rupee); setOut('lgP', prof, function (v) { return (v < 0 ? '−' : '') + rupee(Math.abs(v)); });
    var mx = Math.max.apply(null, Object.keys(byCat).map(function (k) { return byCat[k]; }).concat([1]));
    $('#lgBars').innerHTML = Object.keys(byCat).length ? '<span class="f-label" style="font-size:15px">' + esc(t('lgByCat')) + '</span>' + LCATS.filter(function (k) { return byCat[k]; }).map(function (k) {
      return '<div class="bar-row"><span>' + esc(t(k)) + '</span><span class="bar-track"><span class="bar-fill" style="width:' + Math.max(3, byCat[k] / mx * 100) + '%;background:' + LCOL[LCATS.indexOf(k)] + '"></span></span><b>' + rupee(byCat[k]) + '</b></div>'; }).join('') : '';
    rows = rows.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id; });
    $('#lgList').innerHTML = rows.length ? rows.map(function (e) {
      return '<li class="lg-item" data-id="' + e.id + '"><span><span class="t">' + esc(t(e.cat)) + (e.note ? ' — ' + esc(e.note) : '') + '</span><br><span class="s">' + esc(fmtDate(e.date, { day: 'numeric', month: 'short', year: 'numeric' })) + (e.plot ? ' · ' + esc(e.plot) : '') + '</span></span>' +
        '<span class="v' + (e.cat === 'lcIncome' ? ' inc' : '') + '">' + (e.cat === 'lcIncome' ? '+' : '−') + rupee(e.amt) + '</span><button type="button" class="icon-btn" data-del="' + e.id + '" aria-label="' + esc(t('lgDelete')) + '">' + icon('i-trash') + '</button></li>'; }).join('')
      : '<li class="lg-empty">' + esc(t('lgEmpty')) + '</li>';
  }
  function initLedger() {
    var n = nowIST(); $('#lgDate').value = n.date;
    $('#lgForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var amtEl = $('#lgAmount'), dateEl = $('#lgDate'), amt = parseFloat(amtEl.value);
      amtEl.classList.remove('invalid'); dateEl.classList.remove('invalid');
      var ok = true;
      if (!(amt > 0) || amt > 1e9) { void amtEl.offsetWidth; amtEl.classList.add('invalid'); ok = false; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateEl.value)) { void dateEl.offsetWidth; dateEl.classList.add('invalid'); ok = false; }
      if (!ok) { toast(t('lgNeedAmount')); (amt > 0 ? dateEl : amtEl).focus(); return; }
      ledger.push({ id: Date.now(), date: dateEl.value, plot: $('#lgPlot').value.trim().slice(0, 40), cat: $('#lgCat').value, amt: Math.round(amt), note: $('#lgNote').value.trim().slice(0, 80) });
      saveLedger(); renderLedger(); toast(t('toastSaved'));
      amtEl.value = ''; $('#lgNote').value = ''; amtEl.focus();
    });
    $('#lgList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-del]'); if (!b) return;
      var id = +b.getAttribute('data-del'), li = b.closest('li');
      li.classList.add('out');
      setTimeout(function () { ledger = ledger.filter(function (x) { return x.id !== id; }); saveLedger(); renderLedger(); toast(t('toastDeleted')); }, reduceMotion ? 0 : 280);
    });
    $('#lgFilter').addEventListener('change', function () { lgFilter = this.value; renderLedger(); });
    $('#lgExport').addEventListener('click', function () {
      var head = [t('lgDate'), t('lgPlot'), t('lgCat'), t('lgNote'), t('lgAmount')];
      var lines = [head].concat(ledger.map(function (e) { return [e.date, e.plot, t(e.cat), e.note, (e.cat === 'lcIncome' ? '' : '-') + e.amt]; }))
        .map(function (r) { return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
      var blob = new Blob(['﻿' + lines], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'vahikhate-' + nowIST().date + '.csv';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    $('#lgClear').addEventListener('click', function () {
      if (!ledger.length) { toast(t('lgEmpty')); return; }
      confirmBox(t('lgConfirmClear'), function () { ledger = []; saveLedger(); renderLedger(); toast(t('toastCleared')); });
    });
  }

  /* =========================================================
     SCHEMES + DOCS
     ========================================================= */
  var docsDone = store.get('docs', []); if (!Array.isArray(docsDone)) docsDone = [];
  var openSchemes = {};
  var liveSchemes = null; // set by loadSchemes if the Sheet loads successfully

  /* Parse one CSV row respecting quoted fields */
  function parseCSVRow(row) {
    var fields = [], cur = '', inQ = false;
    for (var i = 0; i < row.length; i++) {
      var ch = row[i];
      if (inQ) { if (ch === '"' && row[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') { inQ = false; } else { cur += ch; } }
      else if (ch === '"') { inQ = true; }
      else if (ch === ',') { fields.push(cur); cur = ''; }
      else { cur += ch; }
    }
    fields.push(cur);
    return fields;
  }

  /* Convert a flat CSV row array into a scheme object.
     Expected columns (see template sheet):
     id, tag_mr, tag_hi, tag_en, warn, big,
     t_mr, t_hi, t_en, d_mr, d_hi, d_en,
     elig_mr, elig_hi, elig_en, how_mr, how_hi, how_en, url */
  function rowToScheme(cols) {
    if (!cols[0]) return null;
    return {
      id:   cols[0].trim(),
      tag:  [cols[1], cols[2], cols[3]],
      warn: cols[4].trim().toLowerCase() === 'true',
      big:  cols[5].trim(),
      t:    [cols[6],  cols[7],  cols[8]],
      d:    [cols[9],  cols[10], cols[11]],
      elig: [cols[12], cols[13], cols[14]],
      how:  [cols[15], cols[16], cols[17]],
      url:  cols[18] ? cols[18].trim() : '#'
    };
  }

  function loadSchemes() {
    var url = C.schemesSheetUrl;
    if (!url) return; // no sheet configured — use data.js
    var cacheKey = 'scache', ttl = 3 * 3600 * 1000; // 3-hour cache
    var cached = store.get(cacheKey, null);
    if (cached && cached.ts && (Date.now() - cached.ts < ttl) && Array.isArray(cached.data)) {
      liveSchemes = cached.data; renderSchemes(); return;
    }
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (csv) {
      var rows = csv.split(/\r?\n/);
      var schemes = [];
      for (var i = 1; i < rows.length; i++) { // skip header row
        if (!rows[i].trim()) continue;
        var s = rowToScheme(parseCSVRow(rows[i]));
        if (s) schemes.push(s);
      }
      if (schemes.length) {
        liveSchemes = schemes;
        store.set(cacheKey, { ts: Date.now(), data: schemes });
        renderSchemes();
      }
    }).catch(function (e) {
      if (window.console) console.warn('[schemes] Sheet load failed, using built-in data', e);
      // liveSchemes stays null → renderSchemes uses D.schemes
    });
  }

  /* Load products from Google Sheet (set via SITE_CONFIG.productsSheetUrl).
     Falls back silently to D.products from data.js if the Sheet is not configured
     or fails to load. Re-renders the shop after a successful fetch. */
  function loadProducts() {
    var url = C.productsSheetUrl;
    if (!url) return;
    var cacheKey = 'pcache', ttl = 3 * 3600 * 1000; // 3-hour cache
    var cached = store.get(cacheKey, null);
    if (cached && cached.ts && (Date.now() - cached.ts < ttl) && Array.isArray(cached.data) && cached.data.length) {
      D.products = cached.data; renderCats(); renderProducts(true); return;
    }
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (csv) {
      var rows = csv.split(/\r?\n/);
      var list = [];
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i].trim();
        if (!row) continue;
        var c = parseCSVRow(row);
        if (!c[0] || !c[0].trim()) continue;
        var p = { id: c[0].trim(), cat: c[1].trim(), n: [c[2]||'', c[3]||'', c[4]||''], d: [c[5]||'', c[6]||'', c[7]||''] };
        if (c[8] && c[8].trim() !== '') p.price = parseFloat(c[8]);
        if (c[9] && c[9].trim() !== '') p.img   = c[9].trim();
        list.push(p);
      }
      if (list.length) {
        D.products = list;
        store.set(cacheKey, { ts: Date.now(), data: list });
        renderCats(); renderProducts(true);
      }
    }).catch(function (e) {
      if (window.console) console.warn('[products] Sheet load failed, using built-in data', e);
    });
  }

  function renderSchemes() {
    var schemes = liveSchemes || D.schemes;
    $('#schemeGrid').innerHTML = schemes.map(function (s, i) {
      var open = !!openSchemes[s.id];
      return '<article class="scheme' + (open ? ' open' : '') + '"><span class="tag' + (s.warn ? ' warn' : '') + '">' + esc(tr(s.tag)) + '</span>' +
        '<span class="big">' + esc(digits(s.big)) + '</span><h3>' + esc(tr(s.t)) + '</h3><p>' + esc(tr(s.d)) + '</p>' +
        '<div class="more" id="more-' + s.id + '"><div><h4>' + esc(t('scElig')) + '</h4><p>' + esc(tr(s.elig)) + '</p><h4>' + esc(t('scHow')) + '</h4><p>' + esc(tr(s.how)) + '</p></div></div>' +
        '<div class="s-acts"><button type="button" class="link-btn" data-sch="' + s.id + '" aria-expanded="' + open + '" aria-controls="more-' + s.id + '">' + esc(t(open ? 'scLess' : 'scMore')) + '</button>' +
        '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(t('scPortal')) + ' ↗</a></div></article>';
    }).join('');
    $('#docsList').innerHTML = D.docs.map(function (d, i) {
      var on = docsDone.indexOf(i) > -1;
      return '<label class="doc"><input type="checkbox" data-doc="' + i + '"' + (on ? ' checked' : '') + '><span class="box">' + icon('i-check') + '</span>' + esc(tr(d)) + '</label>';
    }).join('');
    $('#docsCount').textContent = num(docsDone.length) + '/' + num(D.docs.length) + ' ' + t('scReady');
  }
  function initSchemes() {
    $('#schemeGrid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sch]'); if (!b) return;
      var id = b.getAttribute('data-sch'); openSchemes[id] = !openSchemes[id];
      var card = b.closest('.scheme'); card.classList.toggle('open', openSchemes[id]);
      b.setAttribute('aria-expanded', openSchemes[id] ? 'true' : 'false'); b.textContent = t(openSchemes[id] ? 'scLess' : 'scMore');
    });
    $('#docsList').addEventListener('change', function (e) {
      var i = +e.target.getAttribute('data-doc'); if (isNaN(i)) return;
      docsDone = docsDone.filter(function (x) { return x !== i; }); if (e.target.checked) docsDone.push(i);
      store.set('docs', docsDone);
      $('#docsCount').textContent = num(docsDone.length) + '/' + num(D.docs.length) + ' ' + t('scReady');
    });
  }

  /* =========================================================
     CONTACT, LICENCES, MAP, QR
     ========================================================= */
  function renderLic() {
    $('#licList').innerHTML = C.licences.map(function (l) {
      return '<li><span class="k">' + esc(t(l.key)) + '</span><span class="v">' + esc(l.value) + '</span><button type="button" class="icon-btn" data-copy="' + esc(l.value) + '" aria-label="' + esc(t('cCopy') + ' ' + t(l.key)) + '">' + icon('i-copy') + '</button></li>';
    }).join('');
  }
  function siteUrl() { return C.siteUrl || location.href.split('#')[0]; }
  function qrData(cell) {
    if (typeof window.qrcode !== 'function') return null;
    try { var q = window.qrcode(0, 'M'); q.addData(siteUrl()); q.make(); return q.createDataURL(cell, 2); } catch (e) { return null; }
  }
  function renderQR() {
    var big = qrData(8), small = qrData(4);
    $('#qrBig').innerHTML = big ? '<img src="' + big + '" alt="QR">' : '';
    $('#qrSmall').innerHTML = small ? '<img src="' + small + '" alt="QR">' : '';
    $('#qrUrl').textContent = siteUrl();
    $('#qrDownload').href = big || '#';
  }
  function initContact() {
    $('#dirLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.mapQuery);
    $('#licList').addEventListener('click', function (e) { var b = e.target.closest('[data-copy]'); if (b) copyText(b.getAttribute('data-copy')); });
    var box = $('#mapBox');
    function loadMap() {
      if (box.getAttribute('data-done')) return; box.setAttribute('data-done', '1');
      var f = document.createElement('iframe');
      f.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(C.mapQuery) + '&z=15&output=embed';
      f.loading = 'lazy'; f.title = t('cMapTitle'); f.referrerPolicy = 'no-referrer-when-downgrade';
      box.innerHTML = ''; box.appendChild(f);
    }
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { loadMap(); io.disconnect(); } }, { rootMargin: '400px' }); io.observe(box); }
    else loadMap();
    $('#qrBtn').addEventListener('click', function () { openModal('#qrModal'); });
    $('#qrBtn2').addEventListener('click', function () { closeAll(); openModal('#qrModal'); });
    $('#qrCopy').addEventListener('click', function () { copyText(siteUrl()); });
    $('#qrShare').addEventListener('click', function () {
      if (navigator.share) navigator.share({ title: t('brand'), text: t('brandSub'), url: siteUrl() }).catch(function () { /* cancelled */ });
      else copyText(siteUrl());
    });
    $('#qrDownload').addEventListener('click', function (e) { if (this.getAttribute('href') === '#') e.preventDefault(); });
    renderQR();
  }

  /* =========================================================
     DRAWERS & MODALS
     ========================================================= */
  var lastFocus = null;
  function openDrawer(sel) {
    closeAll(true);
    lastFocus = document.activeElement;
    var d = $(sel), ov = $('#overlay');
    ov.hidden = false; requestAnimationFrame(function () { ov.classList.add('show'); });
    d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
    if (sel === '#drawerNav') $('#menuBtn').setAttribute('aria-expanded', 'true');
    setTimeout(function () { var f = $('button, a, input', d); (f || d).focus(); }, 60);
  }
  function openModal(sel) {
    closeAll(true);
    lastFocus = document.activeElement;
    var m = $(sel); m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
    setTimeout(function () { var f = $('.modal-card button:not(.modal-x), .modal-card [data-close]', m) || $('.modal-card', m); f.focus(); }, 60);
  }
  function closeAll(silent) {
    var any = false;
    $$('.drawer.open, .modal.open').forEach(function (x) { any = true; x.classList.remove('open'); x.setAttribute('aria-hidden', 'true'); });
    var ov = $('#overlay'); ov.classList.remove('show'); setTimeout(function () { if (!ov.classList.contains('show')) ov.hidden = true; }, 300);
    document.body.classList.remove('lock');
    $('#menuBtn').setAttribute('aria-expanded', 'false');
    if (any && !silent && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
  }
  var confirmCb = null;
  function confirmBox(text, cb) { confirmCb = cb; $('#confirmText').textContent = text; openModal('#confirmModal'); }
  function initOverlays() {
    $('#overlay').addEventListener('click', function () { closeAll(); });
    document.addEventListener('click', function (e) {
      var c = e.target.closest('[data-close]'); if (c) { var href = c.getAttribute('href'); closeAll(!!href); }
      var m = e.target.classList && e.target.classList.contains('modal') ? e.target : null; if (m) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
      if (e.key === 'Tab') { // simple focus trap
        var box = $('.drawer.open') || $('.modal.open .modal-card'); if (!box) return;
        var f = $$('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])', box).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    $('#confirmYes').addEventListener('click', function () { var cb = confirmCb; confirmCb = null; closeAll(); if (cb) cb(); });
    $('#menuBtn').addEventListener('click', function () { openDrawer('#drawerNav'); });
    $('#drawerLinks').addEventListener('click', function (e) { if (e.target.closest('a')) closeAll(true); });
  }
  function renderDrawerNav() {
    $('#drawerLinks').innerHTML = $$('#mainNav a').map(function (a, i) { return '<a href="' + a.getAttribute('href') + '" style="transition-delay:' + (80 + i * 40) + 'ms">' + a.innerHTML + '</a>'; }).join('');
  }

  /* =========================================================
     SCROLL EFFECTS, REVEAL, SCROLLSPY, RIPPLE, PARALLAX
     ========================================================= */
  function initScroll() {
    var header = $('#header'), prog = $('#scrollProgress'), top = $('#toTop'), ring = $('#topRing'), ticking = false;
    function onScroll() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight, p = h > 0 ? y / h : 0;
      if (y > 40) header.classList.add('scrolled'); else if (y < 8) header.classList.remove('scrolled');
      prog.style.transform = 'scaleX(' + p + ')';
      top.classList.toggle('show', y > 700);
      ring.style.strokeDashoffset = 132 * (1 - p);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    // reveal
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(function (e) { e.classList.add('in'); }); }
    else {
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (e, i) { if (e.parentElement && e.parentElement.classList.contains('bento')) e.style.transitionDelay = (i * 80) + 'ms'; io.observe(e); });
    }
    // scrollspy
    if ('IntersectionObserver' in window) {
      var ids = sections.map(function (s) { return s[0]; });
      var spy = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (!x.isIntersecting) return;
          var id = x.target.id;
          $$('#mainNav .pill, #drawerLinks a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      ids.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
    }
  }
  function initRipple() {
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.btn'); if (!b || reduceMotion) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
      sp.className = 'ripple'; sp.style.width = sp.style.height = s + 'px'; sp.style.left = (e.clientX - r.left - s / 2) + 'px'; sp.style.top = (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(sp); setTimeout(function () { sp.remove(); }, 650);
    });
  }
  function initParallax() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var hero = $('.hero'), gear = $('.hero-gear'), chips = $('.hero-chips');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      if (chips) chips.style.transform = 'translate(' + x * -18 + 'px,' + y * -14 + 'px)';
      if (gear) gear.style.translate = (x * 24) + 'px ' + (y * 24) + 'px';
    });
    hero.addEventListener('mouseleave', function () { if (chips) chips.style.transform = ''; if (gear) gear.style.translate = ''; });
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left) / r.width - 0.5) * 10 + 'px,' + ((e.clientY - r.top) / r.height - 0.5) * 8 + 'px)'; });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* =========================================================
     BOOT
     ========================================================= */
  function finishLoading() {
    var pl = $('#preloader');
    document.body.classList.remove('is-loading');
    if (pl) pl.classList.add('done');
    requestAnimationFrame(function () { document.body.classList.add('loaded'); });
    setTimeout(function () { if (pl) pl.remove(); }, 700);
  }
  function boot() {
    $('#year').textContent = nowIST().y;
    applyStatic();
    safe(renderDrawerNav, 'drawerNav');
    safe(initOverlays, 'overlays');
    safe(function () { renderOpen(); setInterval(renderOpen, 60000); }, 'open');
    safe(renderSeason, 'season');
    safe(function () { renderCats(); renderProducts(true); renderCart(); initShop(); loadProducts(); }, 'shop');
    safe(initSearch, 'search');
    safe(function () { renderCalc(); initCalc(); }, 'calc');
    safe(function () { renderCare(); initCare(); }, 'care');
    safe(function () { renderLedger(); initLedger(); }, 'ledger');
    safe(function () { renderSchemes(); initSchemes(); loadSchemes(); }, 'schemes');
    safe(function () { renderLic(); initContact(); }, 'contact');
    safe(initWeather, 'weather');
    safe(initMandi, 'mandi');
    safe(initScroll, 'scroll');
    safe(initRipple, 'ripple');
    safe(initParallax, 'parallax');
    $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { if (b.getAttribute('data-lang') !== lang) setLang(b.getAttribute('data-lang'), true); }); });
    onLang('open', renderOpen); onLang('season', renderSeason);
    onLang('shop', function () { renderCats(); renderProducts(false); renderCart(); });
    onLang('calc', renderCalc); onLang('care', renderCare); onLang('ledger', renderLedger); onLang('schemes', renderSchemes);
    onLang('lic', renderLic); onLang('weather', renderWeather); onLang('mandi', renderMandi); onLang('drawer', renderDrawerNav);
    if (document.readyState === 'complete') setTimeout(finishLoading, reduceMotion ? 0 : 450);
    else { window.addEventListener('load', function () { setTimeout(finishLoading, reduceMotion ? 0 : 300); }); setTimeout(finishLoading, 1800); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
