/**
 * STEP 1 & 2 — ROLE SELECTION LANDING PAGE MODULE
 * RMK TEXTILES STAFF ROLE SELECTOR
 */

function renderRoleSelectionView() {
  return `
    <div class="role-selection-wrapper">
      <!-- Top Header -->
      <header class="role-landing-header">
        <div class="brand-logo-area">
          <img src="image.png" alt="RMK Textiles Logo" class="role-logo-img">
          <span class="role-brand-title">RMK TEXTILES</span>
        </div>
        <div class="role-tagline">
          <div class="tagline-top">SMART COMMERCE</div>
          <div class="tagline-bottom">BETTER TOMORROW</div>
        </div>
      </header>

      <!-- Center Hero Content -->
      <main class="role-landing-content">
        <div class="hero-blue-line"></div>
        <h1 class="landing-main-title">Welcome to RMK Textiles</h1>
        <h2 class="landing-subtitle">Choose your role to continue</h2>
        <p class="landing-supporting-text">One platform. Everyone connected.</p>

        <!-- 3 x 2 Grid of 6 Operational Sector Cards -->
        <div class="role-cards-grid">
          <!-- CARD 1: ADMIN -->
          <div class="role-card" onclick="navigateToRoleLogin('admin')">
            <div class="role-card-top">
              <div class="role-icon-box">
                <i class="fa-solid fa-user-shield"></i>
              </div>
              <div class="role-arrow-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <h3 class="role-card-title">ADMIN</h3>
            <p class="role-card-desc">Manage business, products, orders and more</p>
          </div>

          <!-- CARD 2: WAREHOUSE -->
          <div class="role-card" onclick="navigateToRoleLogin('warehouse')">
            <div class="role-card-top">
              <div class="role-icon-box">
                <i class="fa-solid fa-warehouse"></i>
              </div>
              <div class="role-arrow-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <h3 class="role-card-title">WAREHOUSE</h3>
            <p class="role-card-desc">Pick, pack and manage inventory</p>
          </div>

          <!-- CARD 3: DISPATCH -->
          <div class="role-card" onclick="navigateToRoleLogin('dispatch')">
            <div class="role-card-top">
              <div class="role-icon-box">
                <i class="fa-solid fa-truck-fast"></i>
              </div>
              <div class="role-arrow-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <h3 class="role-card-title">DISPATCH</h3>
            <p class="role-card-desc">Assign deliveries and manage shipments</p>
          </div>

          <!-- CARD 4: DELIVERY -->
          <div class="role-card" onclick="navigateToRoleLogin('delivery')">
            <div class="role-card-top">
              <div class="role-icon-box">
                <i class="fa-solid fa-truck-ramp-box"></i>
              </div>
              <div class="role-arrow-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <h3 class="role-card-title">DELIVERY</h3>
            <p class="role-card-desc">View assigned orders and update delivery status</p>
          </div>

          <!-- CARD 5: SUPPORT -->
          <div class="role-card" onclick="navigateToRoleLogin('support')">
            <div class="role-card-top">
              <div class="role-icon-box">
                <i class="fa-solid fa-headset"></i>
              </div>
              <div class="role-arrow-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <h3 class="role-card-title">SUPPORT</h3>
            <p class="role-card-desc">Handle customer queries and returns</p>
          </div>

          <!-- CARD 6: FINANCE -->
          <div class="role-card" onclick="navigateToRoleLogin('finance')">
            <div class="role-card-top">
              <div class="role-icon-box">
                <i class="fa-solid fa-chart-pie"></i>
              </div>
              <div class="role-arrow-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <h3 class="role-card-title">FINANCE</h3>
            <p class="role-card-desc">View payments, refunds and financial reports</p>
          </div>
        </div>
      </main>

      <!-- Curved Blue Footer -->
      <footer class="role-landing-footer">
        <div class="footer-curved-bg"></div>
        <div class="footer-content">
          <div class="footer-copyright">© 2026 RMK Textiles. All rights reserved.</div>
          <div class="footer-values">PEOPLE | PRODUCTS | PROGRESS</div>
        </div>
      </footer>
    </div>
  `;
}

function navigateToRoleLogin(role) {
  window.location.hash = `#/login/${role}`;
}
