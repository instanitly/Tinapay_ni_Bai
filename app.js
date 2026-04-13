
;(function () {
  'use strict';

  
  var MENU_ITEMS = [
    { id: 1, name: 'Choco Lanay',        desc: 'Rich chocolate in soft bread.', price: 22, img: 'images/choco_lanay.jpg' },
    { id: 2, name: 'Spanish Bread',      desc: 'Sweet buttery rolled bread.', price: 15, img: 'images/spanish_bread.jpg' },
    { id: 3, name: 'Meat Bread',         desc: 'Savory meat-filled bun.', price: 25, img: 'images/meat_bread.jpg' },
    { id: 4, name: 'Loaf Bread',         desc: 'Fluffy loaf for everyday meals.', price: 48, img: 'images/loaf_bread.jpg' },
    { id: 5, name: 'Malunggay Pandesal', desc: 'Classic pandesal with malunggay.', price: 12, img: 'images/malunggay_pandesal.jpg' },
    { id: 6, name: 'Cheese Desal',       desc: 'Soft bread with cheesy center.', price: 18, img: 'images/cheese_desal.jpg' },
  ];

  var DELIVERY_FEE = 49;

  
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

  
  function openCart() { cartOverlay.hidden = false; }
  function closeCart() { cartOverlay.hidden = true; }

  cartToggleBtn.addEventListener('click', function () {
    if (!isLoggedIn()) { showAuth(); return; }
    openCart();
  });
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', function (e) { if (e.target === cartOverlay) closeCart(); });

  
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

  
  function refreshUI() {
    var loggedIn = isLoggedIn();

    loginBtn.hidden  = loggedIn;
    logoutBtn.hidden = !loggedIn;

    renderCart();
  }

  
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

  
  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  browseBtn.addEventListener('click', function () {
    qs('#menu').scrollIntoView({ behavior: 'smooth' });
  });
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

  
  renderMenu();
  refreshUI();

})();

