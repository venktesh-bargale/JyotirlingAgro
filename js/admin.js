/* =========================================================
   Jyotirling Agro Mart — Admin panel
   Requires: js/config.js (window.SITE_CONFIG)
             js/data.js   (window.SITE_DATA)
   No external services needed. Edit products and download
   the updated data.js to upload to Hostinger.
   ========================================================= */
(function () {
  'use strict';

  var C = window.SITE_CONFIG;
  var D = window.SITE_DATA;

  if (!C) {
    document.body.innerHTML = '<div style="padding:40px;font-family:sans-serif;color:red"><strong>Error:</strong> js/config.js did not load.</div>';
    return;
  }
  if (!D) {
    document.body.innerHTML = '<div style="padding:40px;font-family:sans-serif;color:red"><strong>Error:</strong> js/data.js did not load.</div>';
    return;
  }

  var CATS = ['machinery', 'sprayers', 'dairy', 'livestock',
              'fertilizer', 'pesticide', 'seeds', 'spares'];

  /* ── state ── */
  var products  = JSON.parse(JSON.stringify(D.products || []));
  var editingId = null;
  var dirty     = false;

  /* ── dom ── */
  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slug(s) {
    return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /* ═══════════════════════════════════════════════════════
     AUTH
  ═══════════════════════════════════════════════════════ */
  function isLoggedIn() { return sessionStorage.getItem('adm_ok') === '1'; }

  function login(pwd) {
    if (pwd === C.adminPassword) {
      sessionStorage.setItem('adm_ok', '1');
      showAdmin();
    } else {
      el('loginErr').hidden = false;
      el('pwdInput').value  = '';
      el('pwdInput').focus();
    }
  }

  function logout() {
    sessionStorage.removeItem('adm_ok');
    el('loginErr').hidden    = true;
    el('pwdInput').value     = '';
    el('adminScreen').hidden = true;
    el('loginScreen').hidden = false;
    el('pwdInput').focus();
  }

  /* ═══════════════════════════════════════════════════════
     SHOW ADMIN
  ═══════════════════════════════════════════════════════ */
  function showAdmin() {
    el('loginScreen').hidden = true;
    el('adminScreen').hidden = false;
    el('sourceText').textContent = products.length + ' products loaded from data.js';
    populateCatSelect();
    renderList();
  }

  function populateCatSelect() {
    el('f-cat').innerHTML = CATS.map(function (c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════
     RENDER PRODUCT LIST
  ═══════════════════════════════════════════════════════ */
  function renderList() {
    var wrap = el('productList');
    if (!products.length) {
      wrap.innerHTML = '<p class="empty-msg">No products yet. Click <strong>+ Add Product</strong>.</p>';
      return;
    }
    wrap.innerHTML = products.map(function (p, i) {
      var nameEn   = (p.n && p.n[2]) || (p.n && p.n[0]) || '(no name)';
      var nameMr   = (p.n && p.n[0]) || '';
      var priceStr = (p.price != null)
        ? '₹' + Number(p.price).toLocaleString('en-IN') : null;
      return '<div class="prod-row">' +
        '<span class="prod-num">' + (i + 1) + '</span>' +
        '<span class="prod-cat-chip">' + esc(p.cat) + '</span>' +
        '<div class="prod-info">' +
          '<div class="prod-name">' + esc(nameEn) + '</div>' +
          '<div class="prod-name-sub">' + esc(nameMr) + ' · <code>' + esc(p.id) + '</code></div>' +
        '</div>' +
        (priceStr
          ? '<span class="prod-price">' + esc(priceStr) + '</span>'
          : '<span class="prod-ask">Ask price</span>') +
        '<div class="prod-actions">' +
          '<button class="btn btn-ghost btn-icon btn-sm" data-action="edit" data-idx="' + i + '" title="Edit">✏️</button>' +
          '<button class="btn btn-danger btn-icon btn-sm" data-action="del"  data-idx="' + i + '" title="Delete">🗑</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════
     ADD / EDIT FORM
  ═══════════════════════════════════════════════════════ */
  function openForm(p) {
    el('formWrap').hidden = false;
    el('formWrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (p) {
      el('formHeading').textContent = 'Edit Product';
      editingId                     = p.id;
      el('f-id').value              = p.id;
      el('f-id').disabled           = true;
      el('f-cat').value             = p.cat || CATS[0];
      el('f-n-mr').value            = (p.n && p.n[0]) || '';
      el('f-n-hi').value            = (p.n && p.n[1]) || '';
      el('f-n-en').value            = (p.n && p.n[2]) || '';
      el('f-d-mr').value            = (p.d && p.d[0]) || '';
      el('f-d-hi').value            = (p.d && p.d[1]) || '';
      el('f-d-en').value            = (p.d && p.d[2]) || '';
      el('f-price').value           = (p.price != null) ? p.price : '';
      el('f-img').value             = p.img || '';
    } else {
      el('formHeading').textContent = 'Add Product';
      editingId                     = null;
      el('f-id').disabled           = false;
      el('f-id').value = el('f-cat').value = '';
      el('f-cat').value = CATS[0];
      el('f-n-mr').value = el('f-n-hi').value = el('f-n-en').value = '';
      el('f-d-mr').value = el('f-d-hi').value = el('f-d-en').value = '';
      el('f-price').value = el('f-img').value = '';
      el('f-n-mr').focus();
    }
  }

  function closeForm() {
    el('formWrap').hidden = true;
    el('f-id').disabled   = false;
    editingId             = null;
  }

  function applyForm() {
    var id  = editingId || slug(el('f-id').value);
    var nMr = el('f-n-mr').value.trim();
    if (!id)  { alert('Product ID is required. Fill the English name — it will auto-fill.'); el('f-n-en').focus(); return; }
    if (!nMr) { alert('Marathi name is required.'); el('f-n-mr').focus(); return; }

    if (!editingId) {
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === id) {
          alert('ID "' + id + '" already exists. Change the English name or edit the ID.'); return;
        }
      }
    }

    var priceRaw = el('f-price').value.trim();
    var imgRaw   = el('f-img').value.trim();
    var newP = {
      id:  id,
      cat: el('f-cat').value,
      n:   [nMr, el('f-n-hi').value.trim(), el('f-n-en').value.trim()],
      d:   [el('f-d-mr').value.trim(), el('f-d-hi').value.trim(), el('f-d-en').value.trim()]
    };
    if (priceRaw !== '') newP.price = parseFloat(priceRaw);
    if (imgRaw   !== '') newP.img   = imgRaw;

    if (editingId) {
      for (var k = 0; k < products.length; k++) {
        if (products[k].id === editingId) { products[k] = newP; break; }
      }
    } else {
      products.push(newP);
    }

    dirty = true;
    closeForm();
    renderList();
    setStatus('Unsaved changes — click Download data.js', '');
  }

  /* ═══════════════════════════════════════════════════════
     GENERATE & DOWNLOAD data.js
  ═══════════════════════════════════════════════════════ */
  function productToJS(p) {
    var parts = [
      'id: ' + JSON.stringify(p.id),
      'cat: ' + JSON.stringify(p.cat),
      'n: ' + JSON.stringify(p.n),
      'd: ' + JSON.stringify(p.d)
    ];
    if (p.price != null) parts.push('price: ' + p.price);
    if (p.img)           parts.push('img: ' + JSON.stringify(p.img));
    return '    { ' + parts.join(', ') + ' }';
  }

  function downloadDataJS() {
    /* Rebuild data.js replacing only the products array.
       Everything else (crops, seasons, care, schemes, docs,
       markets, commodities) is taken from the live SITE_DATA. */
    var d = window.SITE_DATA;

    var lines = [];
    lines.push('/* ==========================================================');
    lines.push('   SITE CONTENT — products, crops, schemes, seasons, care tips');
    lines.push('   Text fields are [Marathi, Hindi, English].');
    lines.push('   Updated by admin panel — ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    lines.push('   ========================================================== */');
    lines.push('window.SITE_DATA = {');
    lines.push('');
    lines.push('  categories: ' + JSON.stringify(d.categories) + ',');
    lines.push('');
    lines.push('  products: [');
    products.forEach(function (p, i) {
      lines.push(productToJS(p) + (i < products.length - 1 ? ',' : ''));
    });
    lines.push('  ],');
    lines.push('');
    /* Keep everything else from the original SITE_DATA unchanged */
    lines.push('  crops: ' + JSON.stringify(d.crops, null, 4).replace(/\n/g, '\n  ') + ',');
    lines.push('');
    lines.push('  seasons: ' + JSON.stringify(d.seasons, null, 4).replace(/\n/g, '\n  ') + ',');
    lines.push('');
    lines.push('  care: ' + JSON.stringify(d.care, null, 4).replace(/\n/g, '\n  ') + ',');
    lines.push('');
    lines.push('  schemes: ' + JSON.stringify(d.schemes, null, 4).replace(/\n/g, '\n  ') + ',');
    lines.push('');
    lines.push('  docs: ' + JSON.stringify(d.docs, null, 4).replace(/\n/g, '\n  ') + ',');
    lines.push('');
    lines.push('  markets: ' + JSON.stringify(d.markets, null, 4).replace(/\n/g, '\n  ') + ',');
    lines.push('');
    lines.push('  commodities: ' + JSON.stringify(d.commodities, null, 4).replace(/\n/g, '\n  '));
    lines.push('');
    lines.push('};');

    var content = lines.join('\n');
    var blob    = new Blob([content], { type: 'text/javascript' });
    var url     = URL.createObjectURL(blob);
    var a       = document.createElement('a');
    a.href      = url;
    a.download  = 'data.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    dirty = false;
    setStatus('Downloaded! Upload data.js to your Hostinger public_html/js/ folder.', '');
  }

  /* ── status badge ── */
  function setStatus(msg, type) {
    var b = el('saveStatus');
    b.textContent = msg;
    b.className   = 'save-badge' + (type ? ' ' + type : '');
    b.hidden      = !msg;
  }

  /* ═══════════════════════════════════════════════════════
     EVENTS
  ═══════════════════════════════════════════════════════ */
  el('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    login(el('pwdInput').value);
  });

  el('logoutBtn').addEventListener('click', logout);

  el('addBtn').addEventListener('click', function () { openForm(null); });

  el('saveBtn').addEventListener('click', downloadDataJS);

  el('formCancel').addEventListener('click', closeForm);
  el('formApply').addEventListener('click', applyForm);

  el('productList').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var idx    = parseInt(btn.getAttribute('data-idx'), 10);
    var action = btn.getAttribute('data-action');
    if (action === 'edit') {
      openForm(products[idx]);
    } else if (action === 'del') {
      var name = (products[idx].n && products[idx].n[2]) || products[idx].id;
      if (window.confirm('Delete "' + name + '"?')) {
        products.splice(idx, 1);
        dirty = true;
        renderList();
        setStatus('Unsaved changes — click Download data.js', '');
      }
    }
  });

  /* auto-fill ID from English name */
  el('f-n-en').addEventListener('input', function () {
    if (!editingId) el('f-id').value = slug(this.value);
  });

  window.addEventListener('beforeunload', function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ── boot ── */
  if (isLoggedIn()) {
    showAdmin();
  } else {
    el('pwdInput').focus();
  }

})();
