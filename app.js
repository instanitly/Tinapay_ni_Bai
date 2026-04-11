/**
 * Tinapay ni Chan — Client-Side Application
 * IIFE keeps all variables out of the global scope.
 */
;(function () {
  'use strict';

  /* ============================================
     MOCK DATABASE
     ============================================ */
  var MENU_ITEMS = [
    { id: 1,  name: 'Classic Butter Croissant', desc: 'Flaky, golden layers of buttery pastry, baked fresh every morning.', price: 120, img: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88f4?auto=format&fit=crop&w=500&q=80' },
    { id: 2,  name: 'Pain au Chocolat',         desc: 'Classic French pastry filled with two rich dark chocolate batons.', price: 145, img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=500&q=80' },
    { id: 3,  name: 'Ube Cheese Pandesal',       desc: 'Soft Filipino bread rolls stuffed with sweet ube halaya and melting cheese.', price: 85, img: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?auto=format&fit=crop&w=500&q=80' },
    { id: 4,  name: 'Classic Ensaymada',         desc: 'Soft, fluffy brioche topped with buttercream and freshly grated queso de bola.', price: 110, img: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=crop&w=500&q=80' },
    { id: 5,  name: 'Almond Croissant',          desc: 'Twice-baked croissant filled with frangipane and topped with toasted almonds.', price: 160, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80' },
    { id: 6,  name: 'Spanish Bread',             desc: 'Sweet, buttery breadcrumb filling rolled inside soft dough and baked golden.', price: 45, img: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=500&q=80' },
    { id: 7,  name: 'Monay',                     desc: 'Dense, slightly sweet oval bread with a soft crumb — a Filipino merienda staple.', price: 30, img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=500&q=80' },
    { id: 8,  name: 'Pan de Coco',               desc: 'Soft, pillowy bun filled with sweetened shredded coconut in every bite.', price: 35, img: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=500&q=80' },
    { id: 9,  name: 'Kalihim (Pan de Regla)',     desc: 'Classic red-filled bread with sweet bukayo or ube jam tucked inside soft dough.', price: 35, img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80' },
    { id: 10, name: 'Kababayan',                 desc: 'Buttery muffin-shaped Filipino bread with a golden top and tender, slightly sweet crumb.', price: 40, img: 'https://images.unsplash.com/photo-1558303628-e6a6088d8878?auto=format&fit=crop&w=500&q=80' },
    { id: 11, name: 'Hopia Ube',                 desc: 'Flaky Chinese-Filipino pastry with a creamy purple yam filling in every layer.', price: 55, img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=500&q=80' },
    { id: 12, name: 'Hopia Monggo',              desc: 'Traditional mung bean-filled hopia with a delicate, crumbly pastry shell.', price: 50, img: 'https://images.unsplash.com/photo-1620921568483-63e9a1ae55cf?auto=format&fit=crop&w=500&q=80' },
    { id: 13, name: 'Tasty Bread',               desc: 'Sweet, fluffy sliced loaf — the everyday Filipino breakfast bread, toasted or plain.', price: 65, img: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&w=500&q=80' },
    { id: 14, name: 'Putok (Star Bread)',         desc: 'Crunchy sugar-crusted bread with a soft, airy inside — named for its cracked-star shape.', price: 30, img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=500&q=80' },
    { id: 15, name: 'Pandesal (6 pcs)',           desc: 'The iconic Filipino morning roll — lightly sweet, best served warm with butter or coffee.', price: 60, img: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=500&q=80' },
    { id: 16, name: 'Cheese Cupcake',             desc: 'Dense, cheesy Filipino-style cupcake with a golden top and rich cheddar flavor.', price: 45, img: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=500&q=80' },
  ];

  var DELIVERY_FEE = 49;

  /* ============================================
     HELPERS
     ============================================ */
  function qs(sel) { return document.querySelector(sel); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (k === 'textContent') node.textContent = v;
        else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
        else node.setAttribute(k, v);
      });
    }
    if (children) {
      children.forEach(function (c) {
        if (typeof c === 'string') node.appendChild(document.createTextNode(c));
        else if (c) node.appendChild(c);
      });
    }
    return node;
  }

  function formatCurrency(n) { return '\u20B1' + n.toFixed(2); }

  /* ============================================
     LOCAL STORAGE
     ============================================ */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem('tnc_cart')) || []; }
    catch (_) { return []; }
  }
  function saveCart(c) { localStorage.setItem('tnc_cart', JSON.stringify(c)); }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem('tnc_users')) || []; }
    catch (_) { return []; }
  }
  function saveUsers(u) { localStorage.setItem('tnc_users', JSON.stringify(u)); }

  function getCurrentUser() { return localStorage.getItem('current_user') || ''; }
  function setCurrentUser(username) {
    if (username) localStorage.setItem('current_user', username);
    else localStorage.removeItem('current_user');
  }
  function isLoggedIn() { return !!getCurrentUser(); }

  var cart = loadCart();

  /* ============================================
     DOM REFERENCES
     ============================================ */
  var authOverlay     = qs('#auth-overlay');
  var authClose       = qs('#auth-close');
  var authForm        = qs('#auth-form');
  var authTitle       = qs('#auth-title');
  var authSub         = qs('#auth-sub');
  var authError       = qs('#auth-error');
  var authSuccess     = qs('#auth-success');
  var authUser        = qs('#auth-user');
  var authPass        = qs('#auth-pass');
  var authSubmit      = qs('#auth-submit');
  var tabLogin        = qs('#tab-login');
  var tabSignup       = qs('#tab-signup');
  var loginBtn        = qs('#login-btn');
  var logoutBtn       = qs('#logout-btn');

  var cartOverlay     = qs('#cart-overlay');
  var cartItemsEl     = qs('#cart-items');
  var cartTotalEl     = qs('#cart-total-value');
  var cartCountEl     = qs('#cart-count');
  var cartCloseBtn    = qs('#cart-close');
  var cartToggleBtn   = qs('#cart-toggle');
  var checkoutBtn     = qs('#checkout-btn');

  var checkoutOverlay = qs('#checkout-overlay');
  var checkoutItems   = qs('#checkout-items');
  var checkoutTotal   = qs('#checkout-total');
  var checkoutClose   = qs('#checkout-modal-close');
  var confirmOrderBtn = qs('#confirm-order-btn');

  var successOverlay  = qs('#success-overlay');
  var successClose    = qs('#success-close');

  var menuGrid        = qs('#menu-grid');
  var hamburger       = qs('#hamburger');
  var navLinks        = qs('#nav-links');
  var browseBtn       = qs('#browse-btn');
  var contactForm     = qs('#contact-form');

  var searchBtn       = qs('#search-btn');
  var searchBar       = qs('#search-bar');
  var searchInput     = qs('#search-input');
  var searchClear     = qs('#search-clear');
  var searchNoResults = qs('#search-no-results');

  /* ============================================
     AUTH MODE
     ============================================ */
  var authMode = 'login';

  function setAuthMode(mode) {
    authMode = mode;
    authError.hidden = true;
    authSuccess.hidden = true;
    authUser.value = '';
    authPass.value = '';

    if (mode === 'login') {
      authTitle.textContent = 'Welcome Back';
      authSub.textContent = 'Sign in to start ordering';
      authSubmit.textContent = 'Log In';
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
    } else {
      authTitle.textContent = 'Create Account';
      authSub.textContent = 'Sign up to get started';
      authSubmit.textContent = 'Sign Up';
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
    }
  }

  function showAuth() {
    setAuthMode('login');
    authOverlay.hidden = false;
    authUser.focus();
  }
  function hideAuth() { authOverlay.hidden = true; }

  function showError(msg) {
    authSuccess.hidden = true;
    authError.textContent = msg;
    authError.hidden = false;
  }
  function showSuccess(msg) {
    authError.hidden = true;
    authSuccess.textContent = msg;
    authSuccess.hidden = false;
  }

  tabLogin.addEventListener('click', function () { setAuthMode('login'); });
  tabSignup.addEventListener('click', function () { setAuthMode('signup'); });
  authClose.addEventListener('click', hideAuth);
  authOverlay.addEventListener('click', function (e) { if (e.target === authOverlay) hideAuth(); });

  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = authUser.value.trim();
    var password = authPass.value;

    if (!username || !password) { showError('Please fill in all fields.'); return; }

    var users = loadUsers();

    if (authMode === 'signup') {
      if (users.some(function (u) { return u.username === username; })) {
        showError('Username already taken.');
        return;
      }
      users.push({ username: username, password: password });
      saveUsers(users);
      showSuccess('Account created! You can now log in.');
      setTimeout(function () {
        setAuthMode('login');
        authUser.value = username;
        authPass.value = '';
        authPass.focus();
      }, 1200);
      return;
    }

    var match = users.find(function (u) {
      return u.username === username && u.password === password;
    });
    if (!match) { showError('Invalid username or password.'); return; }

    setCurrentUser(username);
    hideAuth();
    refreshUI();
  });

  loginBtn.addEventListener('click', showAuth);

  logoutBtn.addEventListener('click', function () {
    setCurrentUser(null);
    cart = [];
    saveCart(cart);
    refreshUI();
  });

  /* ============================================
     MENU RENDERING (event delegation, no globals)
     ============================================ */
  function renderMenu() {
    menuGrid.innerHTML = '';

    MENU_ITEMS.forEach(function (item, index) {
      var card = el('article', {
        class: 'menu-card',
        style: 'animation-delay:' + (index * 0.04) + 's'
      }, [
        el('div', { class: 'menu-img-wrapper' }, [
          el('img', { src: item.img, alt: item.name, loading: 'lazy' })
        ]),
        el('div', { class: 'menu-card-body' }, [
          el('div', { class: 'menu-card-header' }, [
            el('h3', { class: 'menu-card-name', textContent: item.name }),
            el('span', { class: 'menu-card-price', textContent: formatCurrency(item.price) })
          ]),
          el('p', { class: 'menu-card-desc', textContent: item.desc }),
          el('button', {
            class: 'add-btn',
            'aria-label': 'Add ' + item.name + ' to cart',
            'data-item-id': String(item.id),
            textContent: '+'
          })
        ])
      ]);
      menuGrid.appendChild(card);
    });
  }

  menuGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-item-id]');
    if (!btn) return;
    addToCart(Number(btn.dataset.itemId));
  });

  /* ============================================
     CART LOGIC
     ============================================ */
  function addToCart(itemId) {
    if (!isLoggedIn()) { showAuth(); return; }
    var existing = cart.find(function (c) { return c.id === itemId; });
    if (existing) existing.qty += 1;
    else cart.push({ id: itemId, qty: 1 });
    saveCart(cart);
    renderCart();
    cartToggleBtn.style.transform = 'scale(1.25)';
    setTimeout(function () { cartToggleBtn.style.transform = 'none'; }, 200);
  }

  function changeQty(itemId, delta) {
    var entry = cart.find(function (c) { return c.id === itemId; });
    if (!entry) return;
    entry.qty += delta;
    if (entry.qty <= 0) cart = cart.filter(function (c) { return c.id !== itemId; });
    saveCart(cart);
    renderCart();
  }

  function getCartTotal() {
    return cart.reduce(function (sum, entry) {
      var item = MENU_ITEMS.find(function (m) { return m.id === entry.id; });
      return sum + (item ? item.price * entry.qty : 0);
    }, 0);
  }

  function getCartCount() {
    return cart.reduce(function (sum, entry) { return sum + entry.qty; }, 0);
  }

  function renderCart() {
    var count = getCartCount();
    cartCountEl.textContent = String(count);
    cartCountEl.hidden = count === 0;

    var total = getCartTotal();
    cartTotalEl.textContent = formatCurrency(total);

    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.appendChild(el('p', { class: 'cart-empty', textContent: 'Your cart is empty.' }));
      return;
    }

    cart.forEach(function (entry) {
      var item = MENU_ITEMS.find(function (m) { return m.id === entry.id; });
      if (!item) return;

      var row = el('div', { class: 'cart-item' }, [
        el('img', { class: 'cart-item-img', src: item.img, alt: item.name }),
        el('div', { class: 'cart-item-info' }, [
          el('h4', { class: 'cart-item-name', textContent: item.name }),
          el('p', { class: 'cart-item-price', textContent: formatCurrency(item.price) })
        ]),
        el('div', { class: 'cart-item-qty' }, [
          el('button', { textContent: '\u2212', 'aria-label': 'Decrease', onClick: function () { changeQty(item.id, -1); } }),
          el('span', { textContent: String(entry.qty) }),
          el('button', { textContent: '+', 'aria-label': 'Increase', onClick: function () { changeQty(item.id, 1); } })
        ])
      ]);
      cartItemsEl.appendChild(row);
    });
  }

  /* Cart panel open / close */
  function openCart() { cartOverlay.hidden = false; }
  function closeCart() { cartOverlay.hidden = true; }

  cartToggleBtn.addEventListener('click', function () {
    if (!isLoggedIn()) { showAuth(); return; }
    openCart();
  });
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', function (e) { if (e.target === cartOverlay) closeCart(); });

  /* ============================================
     CHECKOUT FLOW
     ============================================ */
  checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) return;
    if (!isLoggedIn()) { closeCart(); showAuth(); return; }
    closeCart();
    openCheckout();
  });

  function openCheckout() {
    checkoutItems.innerHTML = '';

    var subtotal = 0;
    cart.forEach(function (entry) {
      var item = MENU_ITEMS.find(function (m) { return m.id === entry.id; });
      if (!item) return;
      var lineTotal = item.price * entry.qty;
      subtotal += lineTotal;

      var row = el('div', { class: 'checkout-row' }, [
        el('div', {}, [
          el('span', { class: 'item-name', textContent: item.name }),
          el('span', { class: 'item-qty', textContent: '  \u00D7 ' + entry.qty })
        ]),
        el('span', { class: 'item-line', textContent: formatCurrency(lineTotal) })
      ]);
      checkoutItems.appendChild(row);
    });

    checkoutTotal.textContent = formatCurrency(subtotal + DELIVERY_FEE);
    checkoutOverlay.hidden = false;
  }

  function closeCheckout() { checkoutOverlay.hidden = true; }

  checkoutClose.addEventListener('click', closeCheckout);
  checkoutOverlay.addEventListener('click', function (e) { if (e.target === checkoutOverlay) closeCheckout(); });

  confirmOrderBtn.addEventListener('click', function () {
    var name = qs('#co-name').value.trim();
    var address = qs('#co-address').value.trim();
    var phone = qs('#co-phone').value.trim();

    if (!name || !address || !phone) {
      qs('#co-name').reportValidity();
      qs('#co-address').reportValidity();
      qs('#co-phone').reportValidity();
      return;
    }

    cart = [];
    saveCart(cart);
    renderCart();
    closeCheckout();

    qs('#co-name').value = '';
    qs('#co-address').value = '';
    qs('#co-phone').value = '';

    successOverlay.hidden = false;
  });

  successClose.addEventListener('click', function () {
    successOverlay.hidden = true;
    qs('#menu').scrollIntoView({ behavior: 'smooth' });
  });
  successOverlay.addEventListener('click', function (e) {
    if (e.target === successOverlay) successOverlay.hidden = true;
  });

  /* ============================================
     UI STATE — strict auth toggle
     ============================================ */
  function refreshUI() {
    var loggedIn = isLoggedIn();

    loginBtn.hidden  = loggedIn;
    logoutBtn.hidden = !loggedIn;

    renderCart();
  }

  /* ============================================
     SEARCH
     ============================================ */
  function toggleSearch() {
    var isOpen = searchBar.hidden;
    searchBar.hidden = !isOpen;
    if (isOpen) {
      searchInput.value = '';
      searchInput.focus();
      searchClear.hidden = true;
      searchNoResults.hidden = true;
      qs('#menu').scrollIntoView({ behavior: 'smooth' });
    } else {
      searchInput.value = '';
      filterMenu('');
    }
  }

  function filterMenu(query) {
    var term = query.toLowerCase().trim();
    var cards = menuGrid.querySelectorAll('.menu-card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var name = card.querySelector('.menu-card-name').textContent.toLowerCase();
      var desc = card.querySelector('.menu-card-desc').textContent.toLowerCase();
      var match = !term || name.indexOf(term) !== -1 || desc.indexOf(term) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    searchNoResults.hidden = visibleCount > 0;
    searchClear.hidden = !term;
  }

  searchBtn.addEventListener('click', toggleSearch);

  searchInput.addEventListener('input', function () {
    filterMenu(searchInput.value);
  });

  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    filterMenu('');
    searchInput.focus();
  });

  /* ============================================
     NAVIGATION
     ============================================ */
  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  browseBtn.addEventListener('click', function () {
    qs('#menu').scrollIntoView({ behavior: 'smooth' });
  });

  // Active link tracking on scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  });

  /* ============================================
     CONTACT FORM
     ============================================ */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = contactForm.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.disabled = true;
    btn.style.background = '#2ecc71';
    contactForm.reset();
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
    }, 2500);
  });

  /* ============================================
     INIT
     ============================================ */
  renderMenu();
  refreshUI();

})();
