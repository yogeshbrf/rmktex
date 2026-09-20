/**
 * CUSTOMER PORTAL MODULE — RMK TEXTILES
 */

function renderCustomerPortalView() {
  return `
    <div class="container py-4">
      <!-- Welcome Banner -->
      <div class="card border-0 text-white mb-4" style="background: linear-gradient(135deg, #063B73 0%, #1769E0 100%); border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
        <div class="card-body p-4 p-md-5 d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <span class="badge bg-white text-primary fw-bold mb-2 px-3 py-2 rounded-pill" style="font-size: 11.5px;">CUSTOMER PORTAL</span>
            <h1 class="display-6 fw-bold mb-1">Welcome back, Rahul! 👋</h1>
            <p class="mb-0 text-white-50" style="font-size: 14px;">Track your textile orders, view purchases, and raise support queries.</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-light fw-bold text-primary px-4 py-2" onclick="openOrderModal('ATD1001')" style="border-radius: var(--radius-md);">
              <i class="fa-solid fa-location-dot me-2"></i> Track Recent Order
            </button>
          </div>
        </div>
      </div>

      <!-- Customer Summary Row -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="kpi-card p-4">
            <div class="kpi-top">
              <div class="kpi-icon-box blue"><i class="fa-solid fa-bag-shopping"></i></div>
              <span class="kpi-trend positive">Active</span>
            </div>
            <div>
              <div class="kpi-value">3</div>
              <div class="kpi-label">Total Orders Placed</div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="kpi-card p-4">
            <div class="kpi-top">
              <div class="kpi-icon-box green"><i class="fa-solid fa-truck-fast"></i></div>
              <span class="kpi-trend positive">In Transit</span>
            </div>
            <div>
              <div class="kpi-value">ATD1001</div>
              <div class="kpi-label">Latest Shipment Status</div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="kpi-card p-4">
            <div class="kpi-top">
              <div class="kpi-icon-box orange"><i class="fa-solid fa-ticket"></i></div>
              <span class="kpi-trend positive">Resolved</span>
            </div>
            <div>
              <div class="kpi-value">0</div>
              <div class="kpi-label">Open Support Tickets</div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Orders List Card -->
      <div class="table-card p-4 mb-4">
        <div class="card-header-flex mb-3">
          <h2 class="card-title"><i class="fa-solid fa-clock-rotate-left text-primary me-2"></i>My Textile Orders</h2>
        </div>
        <div class="table-responsive-custom">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Textile Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="order-id-link" onclick="openOrderModal('ATD1001')">ATD1001</span></td>
                <td>17 Sep 2026</td>
                <td>
                  <div class="fw-semibold">Pure Silk Kanchipuram Saree (Blue) + 1 item</div>
                  <div class="text-muted" style="font-size: 12px;">Qty: 3</div>
                </td>
                <td class="fw-bold">₹4,097</td>
                <td><span class="status-badge packed">Packed & Ready</span></td>
                <td>
                  <button class="btn-primary-custom" onclick="openOrderModal('ATD1001')">
                    <i class="fa-solid fa-route"></i> Track Order
                  </button>
                </td>
              </tr>

              <tr>
                <td><span class="order-id-link" onclick="openOrderModal('ATD1003')">ATD1003</span></td>
                <td>10 Aug 2026</td>
                <td>
                  <div class="fw-semibold">Linen Casual Shirt (White - L)</div>
                  <div class="text-muted" style="font-size: 12px;">Qty: 1</div>
                </td>
                <td class="fw-bold">₹2,499</td>
                <td><span class="status-badge delivered">Delivered</span></td>
                <td>
                  <button class="btn-secondary-custom" onclick="openOrderModal('ATD1003')">
                    <i class="fa-solid fa-receipt"></i> Invoice
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Featured Collections Banner -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="p-4 rounded-3 text-white" style="background: linear-gradient(135deg, #0F2342 0%, #063B73 100%);">
            <h4 class="fw-bold mb-2"><i class="fa-solid fa-gem text-warning me-2"></i>Festive Silk Collection 2026</h4>
            <p class="text-white-50" style="font-size: 13px;">Explore traditional Kanchipuram and Banarasi handspun silk sarees.</p>
            <button class="btn btn-sm btn-outline-light rounded-pill px-3" onclick="showToast('Browsing Silk Collection...', 'info')">Explore Catalog</button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="p-4 rounded-3 text-dark bg-white border" style="border-radius: var(--radius-lg);">
            <h4 class="fw-bold mb-2"><i class="fa-solid fa-headset text-primary me-2"></i>Need Help with your Order?</h4>
            <p class="text-muted" style="font-size: 13px;">Our textile customer support team is active 24/7 to assist with returns and size guides.</p>
            <button class="btn-primary-custom" data-bs-toggle="modal" data-bs-target="#newTicketModal">
              <i class="fa-solid fa-plus me-1"></i> Raise Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
