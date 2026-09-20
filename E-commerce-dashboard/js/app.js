/**
 * MAIN RMK TEXTILES APP ROUTER & ROLE PERMISSION GUARD CONTROLLER
 */

// Retrieve currently authenticated staff session
function getAuthSession() {
  const sessionStr = sessionStorage.getItem('rmk_auth');
  return sessionStr ? JSON.parse(sessionStr) : null;
}

function logoutUser() {
  sessionStorage.removeItem('rmk_auth');
  const mainNavbar = document.getElementById('top-header-navbar');
  if (mainNavbar) mainNavbar.style.setProperty('display', 'none', 'important');
  showToast('Logged out of RMK Textiles session.', 'info');
  window.location.hash = '#/';
}

function redirectToUserDashboard(role) {
  const dashboards = {
    'admin': '#/admin/dashboard',
    'warehouse': '#/warehouse/dashboard',
    'dispatch': '#/dispatch/dashboard',
    'delivery': '#/delivery/dashboard',
    'support': '#/support/dashboard',
    'finance': '#/finance/dashboard'
  };
  window.location.hash = dashboards[role] || '#/';
}

function navigateToRoleLogin(role) {
  window.location.hash = `#/login/${role}`;
}

// --------------------------------------------------------------------------
// STEP 1 & 2 — ROLE SELECTION LANDING PAGE VIEW RENDERER
// --------------------------------------------------------------------------
function renderRoleSelectionView() {
  return `
    <div class="role-selection-wrapper">
      <!-- Top Header -->
      <header class="role-landing-header">
        <div class="brand-logo-area">
          <img src="image.png" alt="RMK Textiles Logo" class="role-logo-img">
        </div>
        <div class="role-landing-tagline">
          <div class="tagline-text-group">
            <div class="tagline-top-row">
              <span>SMART COMMERCE</span>
              <span class="tagline-accent-line"></span>
            </div>
            <div class="tagline-bottom-row">BETTER TOMORROW</div>
          </div>
        </div>
      </header>

      <!-- Center Hero Content -->
      <main class="role-landing-content">
        <div class="hero-blue-pill"></div>
        <h1 class="landing-main-title">Welcome to RMK Textiles</h1>
        <h2 class="landing-subtitle">Choose your role to continue</h2>
        <p class="landing-supporting-text">One platform. Everyone connected.</p>

        <!-- 3 x 2 Grid of 6 Operational Sector Cards -->
        <div class="role-cards-grid">
          <!-- CARD 1: ADMIN -->
          <div class="role-card" onclick="navigateToRoleLogin('admin')">
            <div class="role-icon-circle">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3 class="role-card-title">Admin</h3>
            <p class="role-card-desc">Manage business, products, orders and more</p>
            <div class="role-arrow-circle">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <!-- CARD 2: WAREHOUSE -->
          <div class="role-card" onclick="navigateToRoleLogin('warehouse')">
            <div class="role-icon-circle">
              <i class="fa-solid fa-cube"></i>
            </div>
            <h3 class="role-card-title">Warehouse</h3>
            <p class="role-card-desc">Pick, pack and manage inventory</p>
            <div class="role-arrow-circle">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <!-- CARD 3: DISPATCH -->
          <div class="role-card" onclick="navigateToRoleLogin('dispatch')">
            <div class="role-icon-circle">
              <i class="fa-solid fa-truck"></i>
            </div>
            <h3 class="role-card-title">Dispatch</h3>
            <p class="role-card-desc">Assign deliveries and manage shipments</p>
            <div class="role-arrow-circle">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <!-- CARD 4: DELIVERY -->
          <div class="role-card" onclick="navigateToRoleLogin('delivery')">
            <div class="role-icon-circle">
              <i class="fa-solid fa-motorcycle"></i>
            </div>
            <h3 class="role-card-title">Delivery</h3>
            <p class="role-card-desc">View assigned orders and update delivery status</p>
            <div class="role-arrow-circle">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <!-- CARD 5: SUPPORT -->
          <div class="role-card" onclick="navigateToRoleLogin('support')">
            <div class="role-icon-circle">
              <i class="fa-solid fa-headset"></i>
            </div>
            <h3 class="role-card-title">Support</h3>
            <p class="role-card-desc">Handle customer queries and returns</p>
            <div class="role-arrow-circle">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <!-- CARD 6: FINANCE -->
          <div class="role-card" onclick="navigateToRoleLogin('finance')">
            <div class="role-icon-circle">
              <i class="fa-solid fa-chart-column"></i>
            </div>
            <h3 class="role-card-title">Finance</h3>
            <p class="role-card-desc">View payments, refunds and financial reports</p>
            <div class="role-arrow-circle">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </main>

      <!-- Curved Dual-Layer SVG Wave Footer -->
      <footer class="role-landing-footer-wrapper">
        <svg class="footer-wave-svg" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <!-- Light Icy Blue Wave (Behind) -->
          <path d="M0 60 Q 360 140, 720 80 T 1440 30 L 1440 160 L 0 160 Z" fill="#D0E3F7" fill-opacity="0.9"/>
          <!-- Deep Dark Navy Wave (In Front) -->
          <path d="M0 90 Q 380 160, 760 100 T 1440 50 L 1440 160 L 0 160 Z" fill="#08335E"/>
        </svg>
        <div class="footer-dark-content-bar">
          <div class="footer-content">
            <div class="footer-copyright">© 2026 RMK Textiles. All rights reserved.</div>
            <div class="footer-values">
              <span>PEOPLE &nbsp;|&nbsp; PRODUCTS &nbsp;|&nbsp; PROGRESS</span>
              <span class="footer-value-line"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

// --------------------------------------------------------------------------
// STEP 3 & 4 — ROLE-SPECIFIC LOGIN VIEW RENDERER
// --------------------------------------------------------------------------
const ROLE_CONFIGS = {
  'admin': {
    title: 'ADMIN LOGIN',
    welcome: 'Welcome back, Admin',
    subtitle: 'Sign in to access the Admin Panel.',
    defaultEmail: 'admin@rmktextiles.com',
    defaultPassword: 'admin123',
    icon: 'fa-user-shield',
    roleName: 'Admin Manager',
    staffCode: 'Super Admin',
    dashboardUrl: '#/admin/dashboard'
  },
  'warehouse': {
    title: 'WAREHOUSE LOGIN',
    welcome: 'Welcome back, Warehouse Staff',
    subtitle: 'Sign in to access the Warehouse Panel.',
    defaultEmail: 'warehouse@rmktextiles.com',
    defaultPassword: 'warehouse123',
    icon: 'fa-warehouse',
    roleName: 'Warehouse Staff',
    staffCode: 'WS001',
    dashboardUrl: '#/warehouse/dashboard'
  },
  'dispatch': {
    title: 'DISPATCH LOGIN',
    welcome: 'Welcome back, Dispatch Staff',
    subtitle: 'Sign in to access the Dispatch Panel.',
    defaultEmail: 'dispatch@rmktextiles.com',
    defaultPassword: 'dispatch123',
    icon: 'fa-truck-fast',
    roleName: 'Dispatch Manager',
    staffCode: 'DP001',
    dashboardUrl: '#/dispatch/dashboard'
  },
  'delivery': {
    title: 'DELIVERY LOGIN',
    welcome: 'Welcome back, Delivery Partner',
    subtitle: 'Sign in to access the Delivery Panel.',
    defaultEmail: 'delivery@rmktextiles.com',
    defaultPassword: 'delivery123',
    icon: 'fa-truck-ramp-box',
    roleName: 'Delivery Partner',
    staffCode: 'DL001',
    dashboardUrl: '#/delivery/dashboard'
  },
  'support': {
    title: 'SUPPORT LOGIN',
    welcome: 'Welcome back, Support Agent',
    subtitle: 'Sign in to access the Support Panel.',
    defaultEmail: 'support@rmktextiles.com',
    defaultPassword: 'support123',
    icon: 'fa-headset',
    roleName: 'Support Agent',
    staffCode: 'SP001',
    dashboardUrl: '#/support/dashboard'
  },
  'finance': {
    title: 'FINANCE LOGIN',
    welcome: 'Welcome back, Finance Manager',
    subtitle: 'Sign in to access the Finance Panel.',
    defaultEmail: 'finance@rmktextiles.com',
    defaultPassword: 'finance123',
    icon: 'fa-chart-pie',
    roleName: 'Finance Manager',
    staffCode: 'FN001',
    dashboardUrl: '#/finance/dashboard'
  }
};

function renderRoleLoginView(roleKey) {
  const config = ROLE_CONFIGS[roleKey] || ROLE_CONFIGS['admin'];

  return `
    <div class="role-login-wrapper">
      <div class="role-login-card">
        <!-- Logo & Sector Badge -->
        <div class="text-center mb-4">
          <img src="image.png" alt="RMK Textiles Logo" class="login-logo-img mb-2">
          <div class="login-sector-badge">
            <i class="fa-solid ${config.icon}"></i> ${config.title}
          </div>
          <h2 class="login-welcome-text">${config.welcome}</h2>
          <p class="login-subtitle-text">${config.subtitle}</p>
        </div>

        <!-- Inline Error Alert Box (Hidden by default) -->
        <div id="loginAlertBox" class="alert alert-danger d-none py-2 px-3 mb-3 text-center fw-semibold" style="font-size: 13px; border-radius: var(--radius-sm);">
          <i class="fa-solid fa-triangle-exclamation me-1"></i> Invalid email or password.
        </div>

        <!-- Form -->
        <form onsubmit="handleSectorLoginSubmit(event, '${roleKey}')">
          <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size: 13px;">Email / Employee ID</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="sectorEmailInput" class="form-control" value="${config.defaultEmail}" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size: 13px;">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="fa-solid fa-lock"></i></span>
              <input type="password" id="sectorPasswordInput" class="form-control" value="${config.defaultPassword}" required>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4" style="font-size: 12.5px;">
            <div class="form-check mb-0">
              <input class="form-check-input" type="checkbox" id="rememberMeCheck" checked>
              <label class="form-check-label text-muted" for="rememberMeCheck">Remember session</label>
            </div>
            <a href="javascript:showToast('Password reset requested. Contact System Admin.', 'info')" class="text-primary text-decoration-none fw-semibold">Forgot Password?</a>
          </div>

          <button type="submit" class="btn-primary-custom w-100 justify-content-center py-2.5 fs-6 mb-3" style="border-radius: var(--radius-md);">
            <i class="fa-solid fa-right-to-bracket me-2"></i> LOGIN
          </button>
        </form>

        <!-- Navigation back to Role Selection -->
        <div class="text-center mt-3">
          <a href="#/" class="text-decoration-none fw-semibold text-muted" style="font-size: 13px;">
            <i class="fa-solid fa-arrow-left me-1"></i> Back to Role Selection
          </a>
        </div>
      </div>
    </div>
  `;
}

async function handleSectorLoginSubmit(event, roleKey) {
  event.preventDefault();
  const config = ROLE_CONFIGS[roleKey];
  const emailInput = document.getElementById('sectorEmailInput').value.trim();
  const passwordInput = document.getElementById('sectorPasswordInput').value.trim();
  const alertBox = document.getElementById('loginAlertBox');

  // Try backend authentication first
  try {
    const apiBase = window.BACKEND_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput })
    });

    const data = await response.json();

    if (data.success && data.token) {
      if (alertBox) alertBox.classList.add('d-none');

      // Store authenticated session with JWT token
      const authSession = {
        loggedIn: true,
        role: data.user.role,
        name: data.user.name,
        code: data.user.code,
        email: data.user.email,
        token: data.token
      };
      sessionStorage.setItem('rmk_auth', JSON.stringify(authSession));

      showToast(`Authenticated successfully as ${data.user.name}!`, 'success');
      window.location.hash = ROLE_CONFIGS[data.user.role]?.dashboardUrl || config.dashboardUrl;
      return;
    } else {
      if (alertBox) alertBox.classList.remove('d-none');
      showToast(data.message || 'Invalid email or password.', 'danger');
      return;
    }
  } catch (err) {
    // Backend unreachable — fall back to hardcoded credentials
    console.warn('Backend auth unavailable, using fallback:', err.message);
  }

  // Fallback: hardcoded credential check (when backend is offline)
  if (emailInput === config.defaultEmail && passwordInput === config.defaultPassword) {
    if (alertBox) alertBox.classList.add('d-none');
    
    const authSession = {
      loggedIn: true,
      role: roleKey,
      name: config.roleName,
      code: config.staffCode,
      email: config.defaultEmail
    };
    sessionStorage.setItem('rmk_auth', JSON.stringify(authSession));

    showToast(`Authenticated successfully as ${config.roleName}! (Offline mode)`, 'success');
    window.location.hash = config.dashboardUrl;
  } else {
    if (alertBox) alertBox.classList.remove('d-none');
    showToast('Invalid email or password.', 'danger');
  }
}

// --------------------------------------------------------------------------
// SECTOR ISOLATED NAVIGATION RENDERERS (REMOVES OTHER SECTOR ITEMS COMPLETELY)
// --------------------------------------------------------------------------

function renderSectorIsolatedNavbar(role) {
  const container = document.getElementById('nav-container-dynamic');
  if (!container) return;

  const currentHash = window.location.hash || '#/';
  const isActive = (path) => currentHash === path ? 'active' : '';

  let linksHtml = '';

  const procCount = RMK_STORE.orders.filter(o => o.status === 'Processing').length;
  const packedCount = RMK_STORE.orders.filter(o => o.status === 'Packed').length;
  const dispCount = RMK_STORE.orders.filter(o => o.status === 'Dispatched').length;
  const delivCount = RMK_STORE.orders.filter(o => o.status === 'Dispatched' || o.status === 'Processing').length;
  const tckCount = RMK_STORE.tickets.filter(t => t.status !== 'Resolved').length;
  const rfdCount = RMK_STORE.refunds.filter(r => r.status === 'Pending').length;

  switch (role) {
    case 'admin':
      linksHtml = `
        <div class="nav-links-wrapper">
          <a href="#/admin/dashboard" class="nav-link-top ${isActive('#/admin/dashboard')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
          <a href="#/admin/products" class="nav-link-top ${isActive('#/admin/products')}"><i class="fa-solid fa-tags"></i> Products</a>
          <a href="#/admin/categories" class="nav-link-top ${isActive('#/admin/categories')}"><i class="fa-solid fa-layer-group"></i> Categories</a>
          <a href="#/admin/orders" class="nav-link-top ${isActive('#/admin/orders')}"><i class="fa-solid fa-boxes-packing"></i> Orders <span class="nav-badge-pill warning">${RMK_STORE.orders.length}</span></a>
          <a href="#/admin/inventory" class="nav-link-top ${isActive('#/admin/inventory')}"><i class="fa-solid fa-warehouse"></i> Inventory</a>
          <a href="#/admin/customers" class="nav-link-top ${isActive('#/admin/customers')}"><i class="fa-solid fa-users"></i> Customers</a>
          <a href="#/admin/staff" class="nav-link-top ${isActive('#/admin/staff')}"><i class="fa-solid fa-user-gear"></i> Staff Management</a>
          <a href="#/admin/coupons" class="nav-link-top ${isActive('#/admin/coupons')}"><i class="fa-solid fa-ticket"></i> Coupons & Offers</a>
          <a href="#/admin/reports" class="nav-link-top ${isActive('#/admin/reports')}"><i class="fa-solid fa-file-invoice-dollar"></i> Reports</a>
          <a href="#/admin/settings" class="nav-link-top ${isActive('#/admin/settings')}"><i class="fa-solid fa-sliders"></i> Settings</a>
        </div>
      `;
      break;

    case 'warehouse':
      linksHtml = `
        <div class="nav-links-wrapper">
          <a href="#/warehouse/dashboard" class="nav-link-top ${isActive('#/warehouse/dashboard')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
          <a href="#/warehouse/new-orders" class="nav-link-top ${isActive('#/warehouse/new-orders')}"><i class="fa-solid fa-bell"></i> New Orders <span class="nav-badge-pill warning">${procCount}</span></a>
          <a href="#/warehouse/orders-to-pack" class="nav-link-top ${isActive('#/warehouse/orders-to-pack')}"><i class="fa-solid fa-boxes-packing"></i> Orders to Pack <span class="nav-badge-pill danger">${procCount}</span></a>
          <a href="#/warehouse/packing" class="nav-link-top ${isActive('#/warehouse/packing')}"><i class="fa-solid fa-box-open"></i> Packing Station</a>
          <a href="#/warehouse/inventory" class="nav-link-top ${isActive('#/warehouse/inventory')}"><i class="fa-solid fa-warehouse"></i> Inventory Stock</a>
          <a href="#/warehouse/packing-slips" class="nav-link-top ${isActive('#/warehouse/packing-slips')}"><i class="fa-solid fa-print"></i> Packing Slips</a>
          <a href="#/warehouse/reports" class="nav-link-top ${isActive('#/warehouse/reports')}"><i class="fa-solid fa-file-lines"></i> Reports</a>
        </div>
      `;
      break;

    case 'dispatch':
      linksHtml = `
        <div class="nav-links-wrapper">
          <a href="#/dispatch/dashboard" class="nav-link-top ${isActive('#/dispatch/dashboard')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
          <a href="#/dispatch/packed" class="nav-link-top ${isActive('#/dispatch/packed')}"><i class="fa-solid fa-boxes-packing"></i> Packed Orders <span class="nav-badge-pill warning">${packedCount}</span></a>
          <a href="#/dispatch/orders" class="nav-link-top ${isActive('#/dispatch/orders')}"><i class="fa-solid fa-truck-fast"></i> Active Shipments <span class="nav-badge-pill danger">${dispCount}</span></a>
          <a href="#/dispatch/assign" class="nav-link-top ${isActive('#/dispatch/assign')}"><i class="fa-solid fa-user-check"></i> Assign Delivery</a>
          <a href="#/dispatch/labels" class="nav-link-top ${isActive('#/dispatch/labels')}"><i class="fa-solid fa-barcode"></i> Shipping Labels</a>
          <a href="#/dispatch/reports" class="nav-link-top ${isActive('#/dispatch/reports')}"><i class="fa-solid fa-file-lines"></i> Reports</a>
        </div>
      `;
      break;

    case 'delivery':
      linksHtml = `
        <div class="nav-links-wrapper">
          <a href="#/delivery/dashboard" class="nav-link-top ${isActive('#/delivery/dashboard')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
          <a href="#/delivery/deliveries" class="nav-link-top ${isActive('#/delivery/deliveries')}"><i class="fa-solid fa-truck-ramp-box"></i> My Deliveries <span class="nav-badge-pill">${delivCount}</span></a>
          <a href="#/delivery/todays-orders" class="nav-link-top ${isActive('#/delivery/todays-orders')}"><i class="fa-solid fa-calendar-day"></i> Today's Orders</a>
          <a href="#/delivery/completed" class="nav-link-top ${isActive('#/delivery/completed')}"><i class="fa-solid fa-circle-check"></i> Completed</a>
          <a href="#/delivery/failed" class="nav-link-top ${isActive('#/delivery/failed')}"><i class="fa-solid fa-triangle-exclamation"></i> Failed / Return</a>
          <a href="#/delivery/profile" class="nav-link-top ${isActive('#/delivery/profile')}"><i class="fa-solid fa-user"></i> Rider Profile</a>
          <a href="#/delivery/support" class="nav-link-top ${isActive('#/delivery/support')}"><i class="fa-solid fa-headset"></i> Rider Support</a>
        </div>
      `;
      break;

    case 'support':
      linksHtml = `
        <div class="nav-links-wrapper">
          <a href="#/support/dashboard" class="nav-link-top ${isActive('#/support/dashboard')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
          <a href="#/support/tickets" class="nav-link-top ${isActive('#/support/tickets')}"><i class="fa-solid fa-headset"></i> Support Tickets <span class="nav-badge-pill danger">${tckCount}</span></a>
          <a href="#/support/lookup" class="nav-link-top ${isActive('#/support/lookup')}"><i class="fa-solid fa-magnifying-glass"></i> Order Lookup</a>
          <a href="#/support/returns" class="nav-link-top ${isActive('#/support/returns')}"><i class="fa-solid fa-rotate-left"></i> Returns & Refunds</a>
          <a href="#/support/queries" class="nav-link-top ${isActive('#/support/queries')}"><i class="fa-solid fa-comments"></i> Customer Queries</a>
          <a href="#/support/chat" class="nav-link-top ${isActive('#/support/chat')}"><i class="fa-solid fa-comment-dots"></i> Live Chat Simulator</a>
          <a href="#/support/kb" class="nav-link-top ${isActive('#/support/kb')}"><i class="fa-solid fa-book-open"></i> Knowledge Base</a>
        </div>
      `;
      break;

    case 'finance':
      linksHtml = `
        <div class="nav-links-wrapper">
          <a href="#/finance/dashboard" class="nav-link-top ${isActive('#/finance/dashboard')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
          <a href="#/finance/payments" class="nav-link-top ${isActive('#/finance/payments')}"><i class="fa-solid fa-credit-card"></i> Payments</a>
          <a href="#/finance/cod" class="nav-link-top ${isActive('#/finance/cod')}"><i class="fa-solid fa-money-bill-transfer"></i> COD Reconciliation</a>
          <a href="#/finance/refunds" class="nav-link-top ${isActive('#/finance/refunds')}"><i class="fa-solid fa-rotate-left"></i> Refunds <span class="nav-badge-pill warning">${rfdCount}</span></a>
          <a href="#/finance/invoices" class="nav-link-top ${isActive('#/finance/invoices')}"><i class="fa-solid fa-file-invoice-dollar"></i> Tax Invoices</a>
          <a href="#/finance/transactions" class="nav-link-top ${isActive('#/finance/transactions')}"><i class="fa-solid fa-list-check"></i> Transactions</a>
          <a href="#/finance/reports" class="nav-link-top ${isActive('#/finance/reports')}"><i class="fa-solid fa-chart-line"></i> Financial Reports</a>
        </div>
      `;
      break;

    default:
      linksHtml = '';
      break;
  }

  container.innerHTML = linksHtml;
}

// Dummy order metadata database for the Stepper Timeline Modal
const ORDER_DATA = {
  'ATD1001': {
    id: 'ATD1001',
    customer: 'Rahul S.',
    phone: '+91 98765 43210',
    address: '12, South Car Street, Salem, Tamil Nadu - 636001',
    items: [
      { name: 'Pure Silk Kanchipuram Saree (Blue)', qty: 2, price: '₹1,299' },
      { name: 'Cotton Dhoti & Shirt Set', qty: 1, price: '₹1,499' }
    ],
    total: '₹4,097',
    payment: 'Paid (Razorpay UPI)',
    estDelivery: '20 September 2026',
    step: 3
  },
  'ATD1002': {
    id: 'ATD1002',
    customer: 'Priya M.',
    phone: '+91 91234 56789',
    address: '45, Cross Cut Road, Gandhipuram, Coimbatore, TN - 641012',
    items: [
      { name: 'Designer Soft Silk Saree (Red)', qty: 1, price: '₹2,899' },
      { name: 'Embroidered Salwar Material', qty: 1, price: '₹899' }
    ],
    total: '₹3,798',
    payment: 'Cash on Delivery (COD)',
    estDelivery: '21 September 2026',
    step: 2
  },
  'ATD1003': {
    id: 'ATD1003',
    customer: 'Karthik V.',
    phone: '+91 99887 76655',
    address: '88, Anna Salai, T. Nagar, Chennai, TN - 600017',
    items: [
      { name: 'Linen Casual Shirt (White - L)', qty: 1, price: '₹2,499' }
    ],
    total: '₹2,499',
    payment: 'Paid (Card)',
    estDelivery: '19 September 2026',
    step: 4
  },
  'ATD1004': {
    id: 'ATD1004',
    customer: 'Sneha R.',
    phone: '+91 97766 55443',
    address: '104, KK Nagar 8th East Street, Madurai, TN - 625020',
    items: [
      { name: 'Handloom Cotton Bedspread', qty: 2, price: '₹799' },
      { name: 'Jacquard Curtains (Set of 2)', qty: 2, price: '₹1,199' }
    ],
    total: '₹3,996',
    payment: 'Paid (NetBanking)',
    estDelivery: '18 September 2026',
    step: 5
  },
  'ATD1005': {
    id: 'ATD1005',
    customer: 'Arun K.',
    phone: '+91 96543 21098',
    address: '22, Thillai Nagar 5th Cross, Trichy, TN - 620018',
    items: [
      { name: 'Men’s Traditional Silk Kurta', qty: 1, price: '₹1,999' },
      { name: 'Chanderi Dupatta', qty: 1, price: '₹1,599' }
    ],
    total: '₹3,598',
    payment: 'Cash on Delivery (COD)',
    estDelivery: '22 September 2026',
    step: 2
  }
};

// INITIALIZATION & ROUTER
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', handleRoute);

  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
  } else {
    handleRoute();
  }
});

function handleRoute() {
  const hash = window.location.hash || '#/';
  const appView = document.getElementById('app-view');
  const mainNavbar = document.getElementById('top-header-navbar');
  const auth = getAuthSession();

  // ROUTE 1: LANDING PAGE (#/)
  if (hash === '#/' || hash === '#') {
    if (mainNavbar) mainNavbar.style.setProperty('display', 'none', 'important');
    if (appView) {
      appView.className = 'content-body p-0';
      appView.innerHTML = renderRoleSelectionView();
    }
    return;
  }

  // ROUTE 2: ROLE SPECIFIC LOGINS (#/login/{role})
  if (hash.startsWith('#/login/')) {
    const roleKey = hash.replace('#/login/', '');
    if (mainNavbar) mainNavbar.style.setProperty('display', 'none', 'important');
    if (appView) {
      appView.className = 'content-body p-0';
      appView.innerHTML = renderRoleLoginView(roleKey);
    }
    return;
  }

  // ROUTE 2B: ROLE SPECIFIC REGISTER (#/register/{role})
  if (hash.startsWith('#/register/')) {
    const roleKey = hash.replace('#/register/', '');
    if (mainNavbar) mainNavbar.style.setProperty('display', 'none', 'important');
    if (appView) {
      appView.className = 'content-body p-0';
      appView.innerHTML = renderCreateAccountView ? renderCreateAccountView(roleKey) : renderRoleLoginView(roleKey);
    }
    return;
  }

  // Restore container padding for dashboards
  if (appView) appView.className = 'content-body';

  // AUTH GUARD
  if (!auth || !auth.loggedIn) {
    showToast('Please select your role and sign in to continue.', 'warning');
    if (mainNavbar) mainNavbar.style.setProperty('display', 'none', 'important');
    window.location.hash = '#/';
    return;
  }

  // Show top header navbar
  if (mainNavbar) mainNavbar.style.setProperty('display', 'block', 'important');

  // Render sector-isolated navigation bar
  renderSectorIsolatedNavbar(auth.role);

  // Update header profile display with active sector user info
  const userNameText = document.getElementById('header-user-name');
  const userRoleText = document.getElementById('header-user-role');
  const panelBadge = document.getElementById('sidebar-panel-badge');

  if (userNameText) userNameText.textContent = auth.name;
  if (userRoleText) userRoleText.textContent = `${auth.code} (${auth.role.toUpperCase()})`;

  // PERMISSION GUARD
  const targetSector = hash.split('/')[1];
  if (targetSector !== auth.role) {
    if (appView) {
      appView.innerHTML = renderAccessDeniedView(auth.role);
    }
    return;
  }

  // ROUTE SWITCH FOR ALL SECTORS & SUB-PAGES
  const subRoute = hash.split('/')[2] || 'dashboard';

  switch (targetSector) {
    case 'admin':
      if (panelBadge) panelBadge.textContent = 'Admin Control Panel';
      if (subRoute === 'dashboard') { appView.innerHTML = renderDashboardView(); setTimeout(initDashboardCharts, 50); }
      else if (subRoute === 'products' && window.renderAdminProductsView) appView.innerHTML = renderAdminProductsView();
      else if (subRoute === 'categories' && window.renderAdminCategoriesView) appView.innerHTML = renderAdminCategoriesView();
      else if (subRoute === 'orders' && window.renderAdminOrdersView) appView.innerHTML = renderAdminOrdersView();
      else if (subRoute === 'inventory' && window.renderAdminInventoryView) appView.innerHTML = renderAdminInventoryView();
      else if (subRoute === 'customers' && window.renderAdminCustomersView) appView.innerHTML = renderAdminCustomersView();
      else if (subRoute === 'staff' && window.renderAdminStaffView) appView.innerHTML = renderAdminStaffView();
      else if (subRoute === 'coupons' && window.renderAdminCouponsView) appView.innerHTML = renderAdminCouponsView();
      else if (subRoute === 'reports' && window.renderAdminReportsView) appView.innerHTML = renderAdminReportsView();
      else if (subRoute === 'settings' && window.renderAdminSettingsView) appView.innerHTML = renderAdminSettingsView();
      else appView.innerHTML = renderDashboardView();
      break;

    case 'warehouse':
      if (panelBadge) panelBadge.textContent = 'Warehouse Operations';
      if (subRoute === 'dashboard') appView.innerHTML = renderWarehouseDashboardView();
      else if (subRoute === 'new-orders' && window.renderWarehouseNewOrdersView) appView.innerHTML = renderWarehouseNewOrdersView();
      else if (subRoute === 'orders-to-pack' && window.renderWarehouseOrdersToPackView) appView.innerHTML = renderWarehouseOrdersToPackView();
      else if (subRoute === 'packing' && window.renderWarehousePackingAreaView) appView.innerHTML = renderWarehousePackingAreaView();
      else if (subRoute === 'inventory' && window.renderWarehouseInventoryView) appView.innerHTML = renderWarehouseInventoryView();
      else if (subRoute === 'packing-slips' && window.renderWarehousePackingSlipsView) appView.innerHTML = renderWarehousePackingSlipsView();
      else if (subRoute === 'reports' && window.renderWarehouseReportsView) appView.innerHTML = renderWarehouseReportsView();
      else appView.innerHTML = renderWarehouseDashboardView();
      break;

    case 'dispatch':
      if (panelBadge) panelBadge.textContent = 'Dispatch Logistics';
      if (subRoute === 'dashboard') appView.innerHTML = renderDispatchView();
      else if (subRoute === 'packed' && window.renderDispatchPackedView) appView.innerHTML = renderDispatchPackedView();
      else if (subRoute === 'orders' && window.renderDispatchOrdersView) appView.innerHTML = renderDispatchOrdersView();
      else if (subRoute === 'assign' && window.renderDispatchAssignView) appView.innerHTML = renderDispatchAssignView();
      else if (subRoute === 'labels' && window.renderDispatchLabelsView) appView.innerHTML = renderDispatchLabelsView();
      else if (subRoute === 'reports' && window.renderDispatchReportsView) appView.innerHTML = renderDispatchReportsView();
      else appView.innerHTML = renderDispatchView();
      break;

    case 'delivery':
      if (panelBadge) panelBadge.textContent = 'Delivery Partner App';
      if (subRoute === 'dashboard') appView.innerHTML = renderDeliveryView();
      else if (subRoute === 'deliveries' && window.renderDeliveryMyDeliveriesView) appView.innerHTML = renderDeliveryMyDeliveriesView();
      else if (subRoute === 'todays-orders' && window.renderDeliveryTodaysOrdersView) appView.innerHTML = renderDeliveryTodaysOrdersView();
      else if (subRoute === 'completed' && window.renderDeliveryCompletedView) appView.innerHTML = renderDeliveryCompletedView();
      else if (subRoute === 'failed' && window.renderDeliveryFailedView) appView.innerHTML = renderDeliveryFailedView();
      else if (subRoute === 'profile' && window.renderDeliveryProfileView) appView.innerHTML = renderDeliveryProfileView();
      else if (subRoute === 'support' && window.renderDeliverySupportView) appView.innerHTML = renderDeliverySupportView();
      else appView.innerHTML = renderDeliveryView();
      break;

    case 'support':
      if (panelBadge) panelBadge.textContent = 'Support Center';
      if (subRoute === 'dashboard') appView.innerHTML = renderSupportView();
      else if (subRoute === 'tickets' && window.renderSupportTicketsView) appView.innerHTML = renderSupportTicketsView();
      else if (subRoute === 'lookup' && window.renderSupportLookupView) appView.innerHTML = renderSupportLookupView();
      else if (subRoute === 'returns' && window.renderSupportReturnsView) appView.innerHTML = renderSupportReturnsView();
      else if (subRoute === 'queries' && window.renderSupportQueriesView) appView.innerHTML = renderSupportQueriesView();
      else if (subRoute === 'chat' && window.renderSupportChatView) appView.innerHTML = renderSupportChatView();
      else if (subRoute === 'kb' && window.renderSupportKBView) appView.innerHTML = renderSupportKBView();
      else appView.innerHTML = renderSupportView();
      break;

    case 'finance':
      if (panelBadge) panelBadge.textContent = 'Finance & Accounts';
      if (subRoute === 'dashboard') { appView.innerHTML = renderFinanceView(); setTimeout(initFinanceCharts, 50); }
      else if (subRoute === 'payments' && window.renderFinancePaymentsView) appView.innerHTML = renderFinancePaymentsView();
      else if (subRoute === 'cod' && window.renderFinanceCODView) appView.innerHTML = renderFinanceCODView();
      else if (subRoute === 'refunds' && window.renderFinanceRefundsView) appView.innerHTML = renderFinanceRefundsView();
      else if (subRoute === 'invoices' && window.renderFinanceInvoicesView) appView.innerHTML = renderFinanceInvoicesView();
      else if (subRoute === 'transactions' && window.renderFinanceTransactionsView) appView.innerHTML = renderFinanceTransactionsView();
      else if (subRoute === 'reports' && window.renderFinanceReportsView) appView.innerHTML = renderFinanceReportsView();
      else appView.innerHTML = renderFinanceView();
      break;

    default:
      redirectToUserDashboard(auth.role);
      break;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// OPEN STAFF PROFILE MODAL (STAFF RELATED INFO)
function openStaffProfileModal() {
  const auth = getAuthSession();
  if (!auth) return;

  const staff = RMK_STORE.staff.find(s => s.role === auth.role) || {
    name: auth.name,
    role: auth.role,
    code: auth.code,
    dept: 'Operations',
    email: auth.email || 'staff@rmktextiles.com',
    phone: '+91 98765 00000',
    hub: 'Salem Operational Facility',
    shift: 'General Shift',
    activeTasks: 12
  };

  const modalHtml = `
    <div class="modal-header border-0 pb-0">
      <h5 class="modal-title fw-bold text-dark"><i class="fa-solid fa-id-badge text-primary me-2"></i>Staff Sector Profile Details</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="text-center mb-4">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=140" alt="Staff Avatar" class="rounded-circle shadow-sm mb-2" style="width: 80px; height: 80px; object-fit: cover; border: 3px solid var(--primary-blue);">
        <h4 class="fw-bold text-dark mb-0">${staff.name}</h4>
        <div class="badge bg-primary-subtle text-primary fw-semibold px-3 py-1 rounded-pill mt-1" style="font-size: 12.5px;">${staff.code} — ${staff.role.toUpperCase()}</div>
      </div>

      <div class="row g-3">
        <div class="col-6">
          <div class="p-3 bg-light rounded-3 border">
            <div class="text-muted small fw-semibold">Department</div>
            <div class="fw-bold text-dark mt-1">${staff.dept}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="p-3 bg-light rounded-3 border">
            <div class="text-muted small fw-semibold">Assigned Hub / Zone</div>
            <div class="fw-bold text-dark mt-1">${staff.hub}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="p-3 bg-light rounded-3 border">
            <div class="text-muted small fw-semibold">Shift Schedule</div>
            <div class="fw-bold text-dark mt-1">${staff.shift}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="p-3 bg-light rounded-3 border">
            <div class="text-muted small fw-semibold">Shift Duty Status</div>
            <div class="fw-bold text-success mt-1"><i class="fa-solid fa-circle me-1" style="font-size: 10px;"></i>Active On Duty</div>
          </div>
        </div>
        <div class="col-12">
          <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small fw-semibold">Contact Email</div>
                <div class="fw-bold text-dark mt-1">${staff.email}</div>
              </div>
              <div>
                <div class="text-muted small fw-semibold">Phone Contact</div>
                <div class="fw-bold text-dark mt-1">${staff.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0 pt-0">
      <button type="button" class="btn-secondary-custom" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn-danger-custom" onclick="bootstrap.Modal.getInstance(document.getElementById('staffProfileModal')).hide(); logoutUser();">
        <i class="fa-solid fa-right-from-bracket me-1"></i> Logout Session
      </button>
    </div>
  `;

  document.getElementById('staffProfileModalContent').innerHTML = modalHtml;
  const modal = new bootstrap.Modal(document.getElementById('staffProfileModal'));
  modal.show();
}

// ACCESS DENIED VIEW COMPONENT
function renderAccessDeniedView(userRole) {
  return `
    <div class="d-flex flex-column align-items-center justify-content-center py-5 text-center" style="min-height: 70vh;">
      <div class="p-4 rounded-circle bg-danger-subtle text-danger mb-4" style="width: 84px; height: 84px; display: flex; align-items: center; justify-content: center; font-size: 38px;">
        <i class="fa-solid fa-user-lock"></i>
      </div>
      <h1 class="fw-extrabold text-dark mb-2" style="font-size: 28px;">ACCESS DENIED</h1>
      <p class="text-muted mb-4" style="font-size: 15px; max-width: 480px; line-height: 1.6;">
        You do not have permission to access this panel. Your authenticated sector account is <strong>${userRole.toUpperCase()} STAFF</strong>.
      </p>
      <button class="btn-primary-custom px-4 py-2.5 fs-6" onclick="redirectToUserDashboard('${userRole}')" style="border-radius: var(--radius-md);">
        <i class="fa-solid fa-arrow-left me-2"></i> Return to My Dashboard
      </button>
    </div>
  `;
}

// MOBILE MENU TOGGLE
function toggleMobileMenu() {
  const topMenu = document.getElementById('top-nav-menu');
  if (topMenu) {
    topMenu.classList.toggle('show');
  }
}

// TOAST NOTIFICATION SYSTEM
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-custom';
  
  let iconHtml = '<i class="fa-solid fa-circle-info text-primary"></i>';
  if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check text-success"></i>';
  if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation text-warning"></i>';
  if (type === 'danger') iconHtml = '<i class="fa-solid fa-circle-xmark text-danger"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// GLOBAL SEARCH HANDLER
function handleGlobalSearch(event) {
  const query = event.target.value;
  if (!query || !query.trim()) return;

  if (event.key === 'Enter') {
    const results = RMK_STORE.searchAll(query);
    if (results.length > 0) {
      const first = results[0];
      showToast(`Found ${results.length} matching result(s). Opening ${first.type}...`, 'success');
      window.location.hash = first.link;
    } else {
      showToast(`No store results found for "${query}"`, 'warning');
    }
  }
}

// ORDER DETAILS MODAL WITH STEPPER TIMELINE DERIVED FROM RMK_STORE
function openOrderModal(orderId) {
  const storeOrder = RMK_STORE.orders.find(o => o.id === orderId) || {
    id: orderId,
    customerName: 'Customer',
    phone: '+91 90000 00000',
    address: 'Salem, Tamil Nadu',
    items: [{ name: 'Kanchipuram Silk Saree', qty: 1, price: 6499 }],
    amount: 6499,
    paymentMethod: 'Paid',
    paymentStatus: 'Paid',
    status: 'CONFIRMED',
    estimatedDelivery: '20 Sep 2026',
    timeline: [{ status: 'CONFIRMED', updatedBy: 'Admin Staff', updatedAt: '17 Sep 2026' }]
  };

  const statusStepMap = {
    'ORDER_PLACED': 1,
    'CONFIRMED': 2,
    'Processing': 2,
    'PACKED': 3,
    'Packed': 3,
    'DISPATCHED': 4,
    'Dispatched': 4,
    'OUT_FOR_DELIVERY': 5,
    'DELIVERED': 6,
    'Delivered': 6
  };
  const activeStep = statusStepMap[storeOrder.status] || 2;

  const steps = [
    { title: 'Order Placed', statusKey: 'ORDER_PLACED' },
    { title: 'Confirmed', statusKey: 'CONFIRMED' },
    { title: 'Packed', statusKey: 'PACKED' },
    { title: 'Dispatched', statusKey: 'DISPATCHED' },
    { title: 'Out for Delivery', statusKey: 'OUT_FOR_DELIVERY' },
    { title: 'Delivered', statusKey: 'DELIVERED' }
  ];

  let timelineHtml = '';
  steps.forEach((s, idx) => {
    const stepNum = idx + 1;
    let stepClass = '';
    let icon = stepNum;

    const tEntry = (storeOrder.timeline || []).find(t => t.status === s.statusKey || t.status.toLowerCase() === s.title.toLowerCase());
    const dateText = tEntry ? tEntry.updatedAt : (stepNum <= activeStep ? 'Completed' : (stepNum === activeStep + 1 ? `Est: ${storeOrder.estimatedDelivery || '20 Sep'}` : 'Pending'));

    if (stepNum < activeStep) {
      stepClass = 'completed';
      icon = '<i class="fa-solid fa-check"></i>';
    } else if (stepNum === activeStep) {
      stepClass = 'active';
      icon = '<i class="fa-solid fa-spinner fa-spin"></i>';
    }

    timelineHtml += `
      <div class="stepper-item ${stepClass}">
        <div class="stepper-dot">${icon}</div>
        <div class="stepper-title">${s.title}</div>
        <div class="stepper-date">${dateText}</div>
      </div>
    `;
  });

  let itemsHtml = '';
  const items = Array.isArray(storeOrder.items) ? storeOrder.items : [{ name: storeOrder.items, qty: 1, price: storeOrder.amount }];
  items.forEach(item => {
    const priceText = typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price;
    itemsHtml += `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
        <div>
          <div class="fw-semibold" style="font-size: 13px;">${item.name}</div>
          <div class="text-muted" style="font-size: 12px;">Qty: ${item.qty}</div>
        </div>
        <div class="fw-bold" style="font-size: 13px;">${priceText}</div>
      </div>
    `;
  });

  const modalContent = `
    <div class="modal-header border-0 pb-0">
      <div>
        <h5 class="modal-title fw-bold text-dark mb-1">Order #${storeOrder.id}</h5>
        <span class="status-badge ${storeOrder.paymentMethod === 'COD' ? 'cod' : 'paid'}">${storeOrder.paymentMethod} (${storeOrder.paymentStatus || 'Paid'})</span>
        <span class="status-badge ${storeOrder.status.toLowerCase().replace('_', '-')} ms-1">${storeOrder.status}</span>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row g-4">
        <div class="col-md-7">
          <div class="p-3 rounded-3 bg-light mb-3" style="border: 1px solid var(--border-color);">
            <div class="fw-bold text-dark mb-2" style="font-size: 13px;"><i class="fa-solid fa-user me-2 text-primary"></i>Customer Information</div>
            <div class="fw-semibold text-dark">${storeOrder.customerName || storeOrder.customer}</div>
            <div class="text-muted" style="font-size: 12.5px;"><i class="fa-solid fa-phone me-1" style="font-size: 11px;"></i>${storeOrder.phone || '+91 98765 00000'}</div>
            <div class="text-muted mt-2" style="font-size: 12.5px;"><i class="fa-solid fa-location-dot me-1" style="font-size: 11px;"></i>${storeOrder.address || (storeOrder.city + ', Tamil Nadu')}</div>
          </div>

          <div class="fw-bold text-dark mb-2" style="font-size: 13px;"><i class="fa-solid fa-bag-shopping me-2 text-primary"></i>Textile Order Items</div>
          ${itemsHtml}
          <div class="d-flex justify-content-between align-items-center pt-3">
            <span class="fw-bold text-dark">Total Amount:</span>
            <span class="fw-bold text-primary fs-5">₹${(storeOrder.amount || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="col-md-5 border-start">
          <div class="fw-bold text-dark mb-3" style="font-size: 13px;"><i class="fa-solid fa-route me-2 text-primary"></i>Synchronized Timeline Stepper</div>
          <div class="stepper-timeline">
            ${timelineHtml}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0 pt-0">
      <button type="button" class="btn-secondary-custom" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn-primary-custom" onclick="showToast('Printing Order #${storeOrder.id} Invoice...', 'info')">
        <i class="fa-solid fa-print me-1"></i> Print Order Invoice
      </button>
    </div>
  `;

  document.getElementById('orderModalBodyContainer').innerHTML = modalContent;
  const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
  modal.show();
}
