/**
 * DELIVERY MODULE (#/delivery/*)
 * Context-specific sub-views: each page shows ONLY data relevant to that page.
 * All data sourced from shared RMK_STORE (single source of truth).
 */

// =========================================================================
// 1. DELIVERY DASHBOARD — Aggregated overview of delivery operations
// =========================================================================
function renderDeliveryView() {
  const orders = RMK_STORE.orders;
  const myDeliveries = orders.filter(o => o.deliveryPersonId === 'STF-04' || o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'DELIVERED');
  const activeCount = myDeliveries.filter(o => o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = myDeliveries.filter(o => o.status === 'DELIVERED').length;
  const failedCount = myDeliveries.filter(o => o.status === 'FAILED' || o.status === 'Cancelled').length;
  const codToCollect = myDeliveries.filter(o => o.paymentMethod === 'COD' && o.status !== 'DELIVERED').reduce((sum, o) => sum + (o.amount || 0), 0);

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-truck-ramp-box me-2 text-primary"></i>Delivery Operations Dashboard</h1>
        <p class="page-subtitle">Overview of assigned delivery route, completed drop-offs, and field SLA</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-truck-ramp-box"></i></div>
          <span class="kpi-trend positive">${myDeliveries.length} Total</span>
        </div>
        <div>
          <div class="kpi-value">${myDeliveries.length}</div>
          <div class="kpi-label">Total Assigned</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-hourglass-half"></i></div>
        </div>
        <div>
          <div class="kpi-value">${activeCount}</div>
          <div class="kpi-label">Active In Transit</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${deliveredCount}</div>
          <div class="kpi-label">Delivered Today</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>
        <div>
          <div class="kpi-value">${failedCount}</div>
          <div class="kpi-label">Failed / Exceptions</div>
        </div>
      </div>
    </div>

    <!-- Dashboard Quick Links -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-route me-2 text-primary"></i>Delivery Route Shortcuts</h5>
          <div class="d-grid gap-2">
            <a href="#/delivery/deliveries" class="btn btn-outline-primary text-start p-3">
              <div class="fw-bold"><i class="fa-solid fa-box me-2"></i>Active Route (${activeCount} Pending)</div>
              <div class="small opacity-75">GPS navigation and customer call buttons</div>
            </a>
            <a href="#/delivery/todays-orders" class="btn btn-outline-warning text-start p-3">
              <div class="fw-bold"><i class="fa-solid fa-calendar-day me-2"></i>Today's Schedule</div>
              <div class="small opacity-75">Morning & afternoon time-slot breakdown</div>
            </a>
            <a href="#/delivery/completed" class="btn btn-outline-success text-start p-3">
              <div class="fw-bold"><i class="fa-solid fa-check-double me-2"></i>Completed (${deliveredCount})</div>
              <div class="small opacity-75">Proof of delivery & COD receipts</div>
            </a>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-id-badge me-2 text-primary"></i>Rider & Shift Status</h5>
          <div class="p-3 bg-light rounded-3 border mb-3">
            <div><strong>Rider:</strong> Vikram R. (DL001)</div>
            <div><strong>Vehicle:</strong> TVS Jupiter (TN 37 CB 4092)</div>
            <div><strong>Zone:</strong> Salem City Zone 1 Hub</div>
            <div><strong>Shift:</strong> <span class="badge bg-success-subtle text-success">● Active Field Shift</span></div>
          </div>
          <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between">
              <span class="fw-semibold">COD Cash to Collect</span>
              <span class="fw-bold text-warning">₹${codToCollect.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 2. MY DELIVERIES — ONLY active in-transit orders assigned to this rider
// =========================================================================
function renderDeliveryMyDeliveriesView() {
  const activeDeliveries = RMK_STORE.orders.filter(o =>
    o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY'
  );
  const inTransit = activeDeliveries.filter(o => o.status === 'DISPATCHED');
  const outForDel = activeDeliveries.filter(o => o.status === 'OUT_FOR_DELIVERY');
  const codPending = activeDeliveries.filter(o => o.paymentMethod === 'COD');

  const rowsHtml = activeDeliveries.map((o, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td class="fw-semibold text-dark">${o.customerName}</td>
      <td>${o.city}, TN</td>
      <td>${Array.isArray(o.items) ? o.items.length : 1} pkg</td>
      <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
      <td><span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span></td>
      <td>
        <div class="d-flex align-items-center gap-1">
          <button class="btn-secondary-custom py-1 px-2" onclick="triggerCallCustomer('${o.customerName}')">
            <i class="fa-solid fa-phone"></i>
          </button>
          <button class="btn-secondary-custom py-1 px-2" onclick="triggerOpenMap('${o.city}, TN')">
            <i class="fa-solid fa-map-location-dot"></i>
          </button>
          ${o.status === 'DISPATCHED' ? `
            <button class="btn btn-sm btn-warning text-dark fw-semibold py-1 px-2" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'OUT_FOR_DELIVERY', 'Delivery Partner (DL001)')">
              OFD
            </button>
          ` : ''}
          <button class="btn-success-custom py-1 px-2" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'DELIVERED', 'Delivery Partner (DL001)')">
            <i class="fa-solid fa-check me-1"></i> Deliver
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-truck-ramp-box me-2 text-primary"></i>My Deliveries</h1>
        <p class="page-subtitle">Active route parcels assigned to your current shift</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-box"></i></div>
          <span class="kpi-trend warning">${activeDeliveries.length} Active</span>
        </div>
        <div>
          <div class="kpi-value">${activeDeliveries.length}</div>
          <div class="kpi-label">Total Assigned</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-road"></i></div>
        </div>
        <div>
          <div class="kpi-value">${inTransit.length}</div>
          <div class="kpi-label">In Transit</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-motorcycle"></i></div>
        </div>
        <div>
          <div class="kpi-value">${outForDel.length}</div>
          <div class="kpi-label">Out for Delivery</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-money-bill"></i></div>
        </div>
        <div>
          <div class="kpi-value">${codPending.length}</div>
          <div class="kpi-label">COD to Collect</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>#</th><th>Order ID</th><th>Customer</th><th>Address</th><th>Packages</th><th>Payment</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>${rowsHtml || '<tr><td colspan="8" class="text-center py-4 text-muted">No active route deliveries assigned.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

function triggerCallCustomer(customerName) {
  showToast(`Calling customer ${customerName}...`, 'info');
}

function triggerOpenMap(address) {
  showToast(`Opening GPS navigation for ${address}`, 'info');
}

// =========================================================================
// 3. TODAY'S ORDERS — ONLY today's delivery schedule by time slot
// =========================================================================
function renderDeliveryTodaysOrdersView() {
  const allDeliveries = RMK_STORE.orders.filter(o =>
    o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'DELIVERED'
  );
  const morningOrders = allDeliveries.slice(0, Math.ceil(allDeliveries.length / 2));
  const afternoonOrders = allDeliveries.slice(Math.ceil(allDeliveries.length / 2));
  const completedToday = allDeliveries.filter(o => o.status === 'DELIVERED').length;
  const remainingToday = allDeliveries.filter(o => o.status !== 'DELIVERED').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-calendar-day me-2 text-primary"></i>Today's Schedule</h1>
        <p class="page-subtitle">Delivery schedule organized by time window for today</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-calendar-day"></i></div>
        </div>
        <div>
          <div class="kpi-value">${allDeliveries.length}</div>
          <div class="kpi-label">Scheduled Today</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${completedToday}</div>
          <div class="kpi-label">Completed</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${remainingToday}</div>
          <div class="kpi-label">Remaining</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div>
          <div class="kpi-value">${allDeliveries.length > 0 ? Math.round((completedToday / allDeliveries.length) * 100) : 0}%</div>
          <div class="kpi-label">Progress</div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark border-bottom pb-2 mb-3"><i class="fa-solid fa-sun text-warning me-2"></i>Morning Slot (9:00 AM - 1:00 PM)</h5>
          <ul class="list-group list-group-flush">
            ${morningOrders.length > 0 ? morningOrders.map(o => `
              <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                <div>
                  <strong class="text-primary">${o.id}</strong> — ${o.customerName}
                  <div class="text-muted small">${o.city}, TN | ${o.paymentMethod}</div>
                </div>
                <span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span>
              </li>
            `).join('') : '<li class="list-group-item text-muted text-center py-3">No morning deliveries</li>'}
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark border-bottom pb-2 mb-3"><i class="fa-solid fa-cloud-sun text-primary me-2"></i>Afternoon Slot (2:00 PM - 6:00 PM)</h5>
          <ul class="list-group list-group-flush">
            ${afternoonOrders.length > 0 ? afternoonOrders.map(o => `
              <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                <div>
                  <strong class="text-primary">${o.id}</strong> — ${o.customerName}
                  <div class="text-muted small">${o.city}, TN | ${o.paymentMethod}</div>
                </div>
                <span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span>
              </li>
            `).join('') : '<li class="list-group-item text-muted text-center py-3">No afternoon deliveries</li>'}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. COMPLETED — ONLY successfully delivered parcels
// =========================================================================
function renderDeliveryCompletedView() {
  const completed = RMK_STORE.orders.filter(o => o.status === 'DELIVERED');
  const codCollected = completed.filter(o => o.paymentMethod === 'COD').reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalValue = completed.reduce((sum, o) => sum + (o.amount || 0), 0);

  const rows = completed.map((o, idx) => {
    const delivEvent = o.timeline ? o.timeline.find(t => t.status === 'DELIVERED') : null;
    return `
      <tr>
        <td>${idx + 1}</td>
        <td class="fw-bold text-primary">${o.id}</td>
        <td class="fw-semibold text-dark">${o.customerName}</td>
        <td>${o.city}, TN</td>
        <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
        <td class="fw-bold text-success">₹${(o.amount || 0).toLocaleString('en-IN')}</td>
        <td class="text-muted">${delivEvent ? delivEvent.updatedAt : '-'}</td>
        <td><span class="status-badge delivered">Delivered</span></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-circle-check me-2 text-primary"></i>Completed Deliveries</h1>
        <p class="page-subtitle">Successfully delivered parcels with proof of delivery</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
          <span class="kpi-trend positive">${completed.length} Done</span>
        </div>
        <div>
          <div class="kpi-value">${completed.length}</div>
          <div class="kpi-label">Total Delivered</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalValue.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Value Delivered</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-money-bill"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${codCollected.toLocaleString('en-IN')}</div>
          <div class="kpi-label">COD Cash Collected</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">98.5%</div>
          <div class="kpi-label">On-Time Rate</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>#</th><th>Order ID</th><th>Customer</th><th>Location</th><th>Payment</th><th>Amount</th><th>Delivered At</th><th>Status</th></tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="8" class="text-center py-4 text-muted">No completed deliveries yet.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 5. FAILED / RETURN — ONLY failed delivery attempts and RTO cases
// =========================================================================
function renderDeliveryFailedView() {
  const failed = RMK_STORE.orders.filter(o => o.status === 'FAILED' || o.status === 'Cancelled');
  const retryPending = failed.length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-triangle-exclamation me-2 text-primary"></i>Failed / Return</h1>
        <p class="page-subtitle">Failed delivery attempts and parcels requiring second attempt or RTO return</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>
        <div>
          <div class="kpi-value">${failed.length}</div>
          <div class="kpi-label">Failed Deliveries</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-rotate-right"></i></div>
        </div>
        <div>
          <div class="kpi-value">${retryPending}</div>
          <div class="kpi-label">Retry Pending</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-rotate-left"></i></div>
        </div>
        <div>
          <div class="kpi-value">0</div>
          <div class="kpi-label">RTO Initiated</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div>
          <div class="kpi-value">${RMK_STORE.orders.length > 0 ? (100 - Math.round((failed.length / RMK_STORE.orders.length) * 100)) : 100}%</div>
          <div class="kpi-label">Success Rate</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>#</th><th>Order ID</th><th>Customer</th><th>Phone</th><th>Failure Reason</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${failed.length > 0 ? failed.map((o, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td class="fw-bold text-primary">${o.id}</td>
                <td class="fw-semibold text-dark">${o.customerName}</td>
                <td>${o.phone}</td>
                <td>Customer Door Locked / Unreachable</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'OUT_FOR_DELIVERY', 'Delivery Partner (DL001)')">
                    <i class="fa-solid fa-rotate-right me-1"></i> Retry Delivery
                  </button>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="6" class="text-center py-4 text-muted">No failed deliveries — great work!</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 6. RIDER PROFILE — ONLY rider-specific profile and performance data
// =========================================================================
function renderDeliveryProfileView() {
  const rider = RMK_STORE.staff.find(s => s.role === 'delivery') || { name: 'Vikram R.', code: 'DL001' };
  const deliveredCount = RMK_STORE.orders.filter(o => o.status === 'DELIVERED').length;
  const totalAssigned = RMK_STORE.orders.filter(o => o.deliveryPersonId === 'STF-04').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-id-badge me-2 text-primary"></i>Rider Profile</h1>
        <p class="page-subtitle">Rider account, vehicle details, and shift performance statistics</p>
      </div>
    </div>

    <div class="card p-4 border-0 shadow-sm rounded-4 mb-4">
      <div class="d-flex align-items-center gap-4 mb-4">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=140" class="rounded-circle" style="width: 80px; height: 80px; object-fit: cover; border: 3px solid var(--primary-blue);">
        <div>
          <h3 class="fw-bold text-dark mb-1">${rider.name} (${rider.code})</h3>
          <span class="badge bg-success-subtle text-success fw-bold px-3 py-1">● Active Rider On Duty</span>
          <div class="text-muted small mt-1">Vehicle: TVS Jupiter (TN 37 CB 4092) | Hub: Salem Zone 1</div>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-md-3"><div class="p-3 bg-light rounded-3 text-center"><div class="text-muted small">Deliveries Completed</div><div class="fs-4 fw-bold text-primary">${deliveredCount}</div></div></div>
        <div class="col-md-3"><div class="p-3 bg-light rounded-3 text-center"><div class="text-muted small">Total Assigned</div><div class="fs-4 fw-bold text-dark">${totalAssigned}</div></div></div>
        <div class="col-md-3"><div class="p-3 bg-light rounded-3 text-center"><div class="text-muted small">Customer Rating</div><div class="fs-4 fw-bold text-warning">4.9 ★</div></div></div>
        <div class="col-md-3"><div class="p-3 bg-light rounded-3 text-center"><div class="text-muted small">On-Time Rate</div><div class="fs-4 fw-bold text-success">98.5%</div></div></div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3">Contact Details</h5>
          <div class="mb-2"><strong>Email:</strong> ${rider.email || 'delivery@rmktextiles.com'}</div>
          <div class="mb-2"><strong>Phone:</strong> ${rider.phone || '+91 98765 00004'}</div>
          <div><strong>Emergency:</strong> 1800-420-9000</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3">Vehicle & Shift Info</h5>
          <div class="mb-2"><strong>Vehicle:</strong> TVS Jupiter ZX</div>
          <div class="mb-2"><strong>Registration:</strong> TN 37 CB 4092</div>
          <div><strong>Shift:</strong> Field Shift (8 AM - 8 PM)</div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 7. RIDER SUPPORT — ONLY delivery-specific support and emergency contacts
// =========================================================================
function renderDeliverySupportView() {
  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-headset me-2 text-primary"></i>Rider Support</h1>
        <p class="page-subtitle">Emergency assistance for address issues, COD discrepancies, or field incidents</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-headset"></i></div>
        </div>
        <div>
          <div class="kpi-value">24/7</div>
          <div class="kpi-label">Helpline Available</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">< 2 min</div>
          <div class="kpi-label">Avg Response Time</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-ticket"></i></div>
        </div>
        <div>
          <div class="kpi-value">0</div>
          <div class="kpi-label">Open Issues</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-star"></i></div>
        </div>
        <div>
          <div class="kpi-value">4.8/5</div>
          <div class="kpi-label">Support Rating</div>
        </div>
      </div>
    </div>

    <div class="card p-4 border-0 shadow-sm rounded-4 text-center py-5">
      <i class="fa-solid fa-headset text-primary mb-3" style="font-size: 48px;"></i>
      <h3 class="fw-bold text-dark">Rider Emergency Hotline: 1800-420-9000</h3>
      <p class="text-muted">Direct line to Salem Dispatch Control Room</p>
      <div class="d-flex justify-content-center gap-3 mt-3">
        <button class="btn-primary-custom" onclick="showToast('Connecting to Salem Dispatch Control Room...', 'success')"><i class="fa-solid fa-phone me-2"></i>Call Dispatch</button>
        <button class="btn-secondary-custom" onclick="showToast('Opening WhatsApp support chat...', 'info')"><i class="fa-solid fa-comment me-2"></i>WhatsApp Support</button>
      </div>
    </div>
  `;
}
