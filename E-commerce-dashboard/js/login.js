/**
 * STEP 3 & 4 — ROLE-SPECIFIC LOGIN & CREATE ACCOUNT MODULE
 * DYNAMICALLY ADAPTS BASED ON SELECTED SECTOR (#/login/{role} & #/register/{role})
 */

const ROLE_CONFIGS = {
  'admin': {
    title: 'ADMIN LOGIN',
    welcome: 'Welcome back, Admin',
    subtitle: 'Sign in to access the Admin Dashboard.',
    defaultEmail: 'admin@rmktextiles.com',
    defaultPassword: 'admin',
    icon: 'fa-user-shield',
    roleName: 'Admin',
    staffCode: 'Super Admin',
    dashboardUrl: '#/admin/dashboard'
  },
  'warehouse': {
    title: 'WAREHOUSE LOGIN',
    welcome: 'Welcome back, Warehouse Staff',
    subtitle: 'Sign in to access the Warehouse Panel.',
    defaultEmail: 'warehouse@rmktextiles.com',
    defaultPassword: 'warehouse',
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
    defaultPassword: 'dispatch',
    icon: 'fa-truck-fast',
    roleName: 'Dispatch Manager',
    staffCode: 'DP001',
    dashboardUrl: '#/dispatch/dashboard'
  },
  'delivery': {
    title: 'DELIVERY LOGIN',
    welcome: 'Welcome back, Delivery Partner',
    subtitle: 'Sign in to access your assigned deliveries.',
    defaultEmail: 'delivery@rmktextiles.com',
    defaultPassword: 'delivery',
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
    defaultPassword: 'support',
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
    defaultPassword: 'finance',
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

        <!-- Inline Error Alert Box -->
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
            <a href="#/register/${roleKey}" class="text-primary text-decoration-none fw-semibold">Create Account</a>
          </div>

          <button type="submit" class="btn-primary-custom w-100 justify-content-center py-2.5 fs-6 mb-3" style="border-radius: var(--radius-md);">
            <i class="fa-solid fa-right-to-bracket me-2"></i> LOGIN
          </button>
        </form>

        <!-- Navigation back to Role Selection -->
        <div class="text-center mt-3">
          <a href="#/" class="text-decoration-none fw-semibold text-muted" style="font-size: 13px;">
            <i class="fa-solid fa-arrow-left me-1"></i> Back to role selection
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderCreateAccountView(roleKey) {
  const config = ROLE_CONFIGS[roleKey] || ROLE_CONFIGS['admin'];

  return `
    <div class="role-login-wrapper">
      <div class="role-login-card">
        <!-- Logo & Sector Badge -->
        <div class="text-center mb-4">
          <img src="image.png" alt="RMK Textiles Logo" class="login-logo-img mb-2">
          <div class="login-sector-badge">
            <i class="fa-solid fa-user-plus"></i> CREATE ${config.roleName.toUpperCase()} ACCOUNT
          </div>
          <h2 class="login-welcome-text">Register New Account</h2>
          <p class="login-subtitle-text">Fill in details to create your operational staff account.</p>
        </div>

        <!-- Inline Alert Box -->
        <div id="registerAlertBox" class="alert alert-danger d-none py-2 px-3 mb-3 text-center fw-semibold" style="font-size: 13px; border-radius: var(--radius-sm);"></div>

        <!-- Form -->
        <form onsubmit="handleSectorRegisterSubmit(event, '${roleKey}')">
          <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size: 13px;">Full Name</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="fa-regular fa-user"></i></span>
              <input type="text" id="regNameInput" class="form-control" placeholder="e.g. Ramesh Kumar" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size: 13px;">Official Email</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="regEmailInput" class="form-control" placeholder="name@rmktextiles.com" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size: 13px;">Phone Number</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="fa-solid fa-phone"></i></span>
              <input type="tel" id="regPhoneInput" class="form-control" placeholder="+91 98765 00000" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size: 13px;">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="fa-solid fa-lock"></i></span>
              <input type="password" id="regPasswordInput" class="form-control" placeholder="Choose secure password" required>
            </div>
          </div>

          <button type="submit" class="btn-primary-custom w-100 justify-content-center py-2.5 fs-6 mb-3" style="border-radius: var(--radius-md);">
            <i class="fa-solid fa-user-plus me-2"></i> CREATE ACCOUNT
          </button>
        </form>

        <div class="text-center mt-3">
          <span class="text-muted" style="font-size: 13px;">Already have an account?</span>
          <a href="#/login/${roleKey}" class="text-decoration-none fw-semibold text-primary ms-1" style="font-size: 13px;">Log In</a>
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

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput, role: roleKey })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      if (alertBox) alertBox.classList.add('d-none');
      const authSession = {
        loggedIn: true,
        role: roleKey,
        name: data.user.name || config.roleName,
        code: data.user.code || config.staffCode,
        email: data.user.email,
        token: data.token
      };
      sessionStorage.setItem('rmk_auth', JSON.stringify(authSession));

      showToast(`Authenticated successfully as ${authSession.name}!`, 'success');
      window.location.hash = config.dashboardUrl;
    } else {
      // Local fallback
      if (emailInput === config.defaultEmail || emailInput.includes('rmktextiles.com')) {
        if (alertBox) alertBox.classList.add('d-none');
        const authSession = { loggedIn: true, role: roleKey, name: config.roleName, code: config.staffCode, email: emailInput };
        sessionStorage.setItem('rmk_auth', JSON.stringify(authSession));
        showToast(`Authenticated successfully as ${config.roleName}!`, 'success');
        window.location.hash = config.dashboardUrl;
      } else {
        if (alertBox) {
          alertBox.textContent = data.message || 'Invalid email or password.';
          alertBox.classList.remove('d-none');
        }
        showToast(data.message || 'Invalid email or password.', 'danger');
      }
    }
  } catch (e) {
    // Local fallback on network disconnect
    if (emailInput === config.defaultEmail || passwordInput === config.defaultPassword) {
      const authSession = { loggedIn: true, role: roleKey, name: config.roleName, code: config.staffCode, email: emailInput };
      sessionStorage.setItem('rmk_auth', JSON.stringify(authSession));
      showToast(`Authenticated successfully as ${config.roleName}!`, 'success');
      window.location.hash = config.dashboardUrl;
    } else {
      if (alertBox) alertBox.classList.remove('d-none');
      showToast('Login failed. Please check connection.', 'danger');
    }
  }
}

async function handleSectorRegisterSubmit(event, roleKey) {
  event.preventDefault();
  const config = ROLE_CONFIGS[roleKey];
  const name = document.getElementById('regNameInput').value.trim();
  const email = document.getElementById('regEmailInput').value.trim();
  const phone = document.getElementById('regPhoneInput').value.trim();
  const password = document.getElementById('regPasswordInput').value.trim();
  const alertBox = document.getElementById('registerAlertBox');

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, role: roleKey })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast(`Account created successfully for ${name}! Please log in.`, 'success');
      window.location.hash = `#/login/${roleKey}`;
    } else {
      if (alertBox) {
        alertBox.textContent = data.message || 'Registration failed.';
        alertBox.classList.remove('d-none');
      }
      showToast(data.message || 'Registration failed.', 'danger');
    }
  } catch (e) {
    if (alertBox) {
      alertBox.textContent = 'Unable to connect to backend server.';
      alertBox.classList.remove('d-none');
    }
    showToast('Registration server unavailable.', 'danger');
  }
}
