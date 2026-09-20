/**
 * DISPATCH MODULE (#/dispatch/*)
 * Context-specific sub-views: each page shows ONLY data relevant to that page.
 * All data sourced from shared RMK_STORE (single source of truth).
 */

// =========================================================================
// 1. DISPATCH DASHBOARD — Aggregated overview of ALL dispatch operations
// =========================================================================
function renderDispatchView() {
  const orders = RMK_STORE.orders;
  const packedOrders = orders.filter(o => o.status === 'PACKED' || o.status === 'Packed');
  const activeShipments = orders.filter(o => o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY');
  const outForDelivery = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const failedOrders = orders.filter(o => o.status === 'FAILED' || o.status === 'Cancelled');
  const pendingAssign = packedOrders.filter(o => !o.courier || o.courier === 'Pending');
  const completionRate = orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : 0;

  const recentActivity = orders
    .filter(o => ['PACKED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status))
    .slice(0, 5);

  const activityRows = recentActivity.map(o => {
    const lastEvent = o.timeline && o.timeline.length > 0 ? o.timeline[o.timeline.length - 1] : {};
    return `
      <tr>
        <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
        <td class="fw-semibold text-dark">${o.customerName}</td>
        <td><span class="badge bg-primary-subtle text-primary">${o.courier || 'Pending'}</span></td>
        <td><span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span></td>
        <td class="text-muted">${lastEvent.updatedAt || o.orderDate || '-'}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-truck-fast me-2 text-primary"></i>Dispatch Control Center</h1>
        <p class="page-subtitle">Aggregated overview of logistics handover, active carrier shipments, and SLA compliance</p>
      </div>
    </div>

    <!-- 6 Dispatch Overview KPI Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-2 col-6">
        <div class="kpi-card text-center py-3">
          <div class="kpi-icon-box orange mx-auto mb-2"><i class="fa-solid fa-boxes-packing"></i></div>
          <div class="kpi-value">${packedOrders.length}</div>
          <div class="kpi-label">Packed Orders</div>
        </div>
      </div>
      <div class="col-md-2 col-6">
        <div class="kpi-card text-center py-3">
          <div class="kpi-icon-box blue mx-auto mb-2"><i class="fa-solid fa-truck-moving"></i></div>
          <div class="kpi-value">${activeShipments.length}</div>
          <div class="kpi-label">Active Shipments</div>
        </div>
      </div>
      <div class="col-md-2 col-6">
        <div class="kpi-card text-center py-3">
          <div class="kpi-icon-box green mx-auto mb-2"><i class="fa-solid fa-motorcycle"></i></div>
          <div class="kpi-value">${outForDelivery.length}</div>
          <div class="kpi-label">Out for Delivery</div>
        </div>
      </div>
      <div class="col-md-2 col-6">
        <div class="kpi-card text-center py-3">
          <div class="kpi-icon-box green mx-auto mb-2"><i class="fa-solid fa-circle-check"></i></div>
          <div class="kpi-value">${deliveredOrders.length}</div>
          <div class="kpi-label">Delivered</div>
        </div>
      </div>
      <div class="col-md-2 col-6">
        <div class="kpi-card text-center py-3">
          <div class="kpi-icon-box red mx-auto mb-2"><i class="fa-solid fa-circle-xmark"></i></div>
          <div class="kpi-value">${failedOrders.length}</div>
          <div class="kpi-label">Failed</div>
        </div>
      </div>
      <div class="col-md-2 col-6">
        <div class="kpi-card text-center py-3">
          <div class="kpi-icon-box blue mx-auto mb-2"><i class="fa-solid fa-chart-line"></i></div>
          <div class="kpi-value">${completionRate}%</div>
          <div class="kpi-label">Completion Rate</div>
        </div>
      </div>
    </div>

    <!-- Overview Content Cards -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-arrow-right-to-city me-2 text-primary"></i>Dispatch Queue Summary</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <div class="fw-bold text-dark">Packed Boxes Awaiting Carrier</div>
                <div class="text-muted small">Verified boxes in warehouse dispatch bay</div>
              </div>
              <a href="#/dispatch/packed" class="btn btn-sm btn-outline-warning">${packedOrders.length} Orders</a>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <div class="fw-bold text-dark">Active Carrier In-Transit</div>
                <div class="text-muted small">On-road parcels with tracking numbers</div>
              </div>
              <a href="#/dispatch/orders" class="btn btn-sm btn-outline-primary">${activeShipments.length} Active</a>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <div class="fw-bold text-dark">Pending Delivery Assignment</div>
                <div class="text-muted small">Packed orders needing carrier allocation</div>
              </div>
              <a href="#/dispatch/assign" class="btn btn-sm btn-outline-danger">${pendingAssign.length} Unassigned</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-truck-field me-2 text-primary"></i>Carrier Volume Breakdown</h5>
          <div class="p-3 bg-light rounded-3 mb-2 border d-flex justify-content-between align-items-center">
            <span class="fw-bold"><i class="fa-solid fa-plane-departure text-primary me-2"></i>BlueDart Air Express</span>
            <span class="badge bg-primary fs-6">${orders.filter(o => o.courier === 'BlueDart').length} Orders</span>
          </div>
          <div class="p-3 bg-light rounded-3 mb-2 border d-flex justify-content-between align-items-center">
            <span class="fw-bold"><i class="fa-solid fa-truck text-warning me-2"></i>Delhivery Surface</span>
            <span class="badge bg-warning text-dark fs-6">${orders.filter(o => o.courier === 'Delhivery').length} Orders</span>
          </div>
          <div class="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
            <span class="fw-bold"><i class="fa-solid fa-motorcycle text-info me-2"></i>Shadowfax Hyperlocal</span>
            <span class="badge bg-info text-white fs-6">${orders.filter(o => o.courier === 'Shadowfax').length} Orders</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Dispatch Activity -->
    <div class="table-card p-4 mt-4">
      <div class="card-header-flex mb-3">
        <h5 class="fw-bold text-dark mb-0"><i class="fa-solid fa-clock-rotate-left me-2 text-primary"></i>Recent Dispatch Activity</h5>
        <a href="#/dispatch/history" class="text-decoration-none fw-semibold text-primary" style="font-size: 13px;">View Full History</a>
      </div>
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Carrier</th><th>Status</th><th>Last Updated</th></tr>
          </thead>
          <tbody>${activityRows || '<tr><td colspan="5" class="text-center py-4 text-muted">No recent dispatch activity.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 2. PACKED ORDERS — ONLY packed orders awaiting dispatch handover
// =========================================================================
function renderDispatchPackedView() {
  const packedOrders = RMK_STORE.orders.filter(o => o.status === 'PACKED' || o.status === 'Packed');
  const awaitingAssign = packedOrders.filter(o => !o.courier || o.courier === 'Pending');
  const assigned = packedOrders.filter(o => o.courier && o.courier !== 'Pending');

  const rowsHtml = packedOrders.map((o, idx) => {
    const packEvent = o.timeline ? o.timeline.find(t => t.status === 'PACKED') : null;
    return `
      <tr>
        <td>${idx + 1}</td>
        <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
        <td class="fw-semibold text-dark">${o.customerName}</td>
        <td>${Array.isArray(o.items) ? o.items.length + ' items' : '1 item'}</td>
        <td class="text-muted">${packEvent ? packEvent.updatedAt : '-'}</td>
        <td>Salem Hub</td>
        <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
        <td><span class="badge ${o.courier && o.courier !== 'Pending' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}">${o.courier && o.courier !== 'Pending' ? 'Assigned' : 'Awaiting'}</span></td>
        <td>
          <div class="d-flex gap-2">
            <select id="courierSel_${o.id}" class="form-select form-select-sm" style="width: 130px;">
              <option value="BlueDart">BlueDart</option>
              <option value="Delhivery">Delhivery</option>
              <option value="Shadowfax">Shadowfax</option>
            </select>
            <button class="btn-primary-custom py-1 px-3" onclick="handleDispatchAction('${o.id}')">
              <i class="fa-solid fa-truck-fast me-1"></i> Dispatch
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-boxes-packing me-2 text-primary"></i>Packed Orders</h1>
        <p class="page-subtitle">Orders ready for dispatch — awaiting carrier assignment and handover</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-boxes-packing"></i></div>
          <span class="kpi-trend warning">${packedOrders.length} Queued</span>
        </div>
        <div>
          <div class="kpi-value">${packedOrders.length}</div>
          <div class="kpi-label">Total Packed</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${awaitingAssign.length}</div>
          <div class="kpi-label">Awaiting Assignment</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${assigned.length}</div>
          <div class="kpi-label">Carrier Assigned</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-calendar-day"></i></div>
        </div>
        <div>
          <div class="kpi-value">${packedOrders.length}</div>
          <div class="kpi-label">Packed Today</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Order ID</th><th>Customer</th><th>Items</th>
              <th>Packing Date</th><th>Warehouse</th><th>Payment</th>
              <th>Dispatch Readiness</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" class="text-center py-4 text-muted">No packed orders pending carrier dispatch.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleDispatchAction(orderId) {
  const sel = document.getElementById(`courierSel_${orderId}`);
  const courier = sel ? sel.value : 'BlueDart';
  RMK_STORE.assignDispatch(orderId, 'STF-04', courier);
}

// =========================================================================
// 3. ACTIVE SHIPMENTS — ONLY in-transit dispatched shipments
// =========================================================================
function renderDispatchOrdersView() {
  const dispatched = RMK_STORE.orders.filter(o => o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY');
  const inTransit = dispatched.filter(o => o.status === 'DISPATCHED');
  const outForDel = dispatched.filter(o => o.status === 'OUT_FOR_DELIVERY');

  const rows = dispatched.map((o, idx) => {
    const dispEvent = o.timeline ? o.timeline.find(t => t.status === 'DISPATCHED') : null;
    const rider = RMK_STORE.staff.find(s => s.id === o.deliveryPersonId);
    return `
      <tr>
        <td>${idx + 1}</td>
        <td><span class="badge bg-light text-dark border fw-semibold">SHP-${o.id.replace('ATD', '')}</span></td>
        <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
        <td class="fw-semibold text-dark">${o.customerName}</td>
        <td>${o.city}, TN</td>
        <td>
          <div class="fw-semibold">${rider ? rider.name : 'Vikram R.'}</div>
          <div class="text-muted small">${o.deliveryPersonId || 'STF-04'}</div>
        </td>
        <td class="text-muted">${dispEvent ? dispEvent.updatedAt : '-'}</td>
        <td><span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span></td>
        <td>${o.estimatedDelivery || '20 Sep 2026'}</td>
        <td>
          ${o.status === 'DISPATCHED' ? `
            <button class="btn btn-sm btn-warning text-dark fw-semibold py-1 px-2" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'OUT_FOR_DELIVERY', 'Dispatch Controller')">
              Out for Delivery
            </button>
          ` : `
            <button class="btn-success-custom py-1 px-2" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'DELIVERED', 'Dispatch Controller')">
              <i class="fa-solid fa-check me-1"></i> Mark Delivered
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-truck-moving me-2 text-primary"></i>Active Shipments</h1>
        <p class="page-subtitle">Currently active shipments on-road with carrier tracking</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-truck-moving"></i></div>
          <span class="kpi-trend positive">${dispatched.length} Active</span>
        </div>
        <div>
          <div class="kpi-value">${dispatched.length}</div>
          <div class="kpi-label">Active Shipments</div>
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
          <div class="kpi-icon-box red"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
        <div>
          <div class="kpi-value">0</div>
          <div class="kpi-label">Delayed Shipments</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Shipment ID</th><th>Order ID</th><th>Customer</th>
              <th>Destination</th><th>Delivery Partner</th><th>Dispatch Date</th>
              <th>Current Status</th><th>Expected Delivery</th><th>Action</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="10" class="text-center py-4 text-muted">No active shipments in transit.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. ASSIGN DELIVERY — ONLY unassigned orders needing carrier/route
// =========================================================================
function renderDispatchAssignView() {
  const packedOrders = RMK_STORE.orders.filter(o => o.status === 'PACKED' || o.status === 'Packed');
  const unassigned = packedOrders.filter(o => !o.courier || o.courier === 'Pending');
  const assignedOrders = packedOrders.filter(o => o.courier && o.courier !== 'Pending');
  const deliveryStaff = RMK_STORE.staff.filter(s => s.role === 'delivery');

  const rowsHtml = packedOrders.map((o, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td class="fw-semibold text-dark">${o.customerName}</td>
      <td>${o.city}, TN</td>
      <td>${Array.isArray(o.items) ? o.items.length : 1} pkg</td>
      <td><span class="badge ${o.paymentMethod === 'COD' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}">${o.paymentMethod === 'COD' ? 'High (COD)' : 'Normal'}</span></td>
      <td>
        <select id="staffSel_${o.id}" class="form-select form-select-sm" style="width: 180px;">
          ${deliveryStaff.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
          ${deliveryStaff.length === 0 ? '<option value="STF-04">Vikram R. (DL001)</option>' : ''}
        </select>
      </td>
      <td>
        <select id="carrierSel_${o.id}" class="form-select form-select-sm" style="width: 130px;">
          <option value="BlueDart">BlueDart</option>
          <option value="Delhivery">Delhivery</option>
          <option value="Shadowfax">Shadowfax</option>
        </select>
      </td>
      <td>
        <button class="btn-primary-custom py-1 px-3" onclick="handleAssignDelivery('${o.id}')">
          <i class="fa-solid fa-user-check me-1"></i> Assign
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-user-check me-2 text-primary"></i>Assign Delivery</h1>
        <p class="page-subtitle">Assign carrier partners and delivery staff to packed orders</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-boxes-packing"></i></div>
        </div>
        <div>
          <div class="kpi-value">${packedOrders.length}</div>
          <div class="kpi-label">Orders to Assign</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-user-xmark"></i></div>
        </div>
        <div>
          <div class="kpi-value">${unassigned.length}</div>
          <div class="kpi-label">Unassigned</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-user-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${assignedOrders.length}</div>
          <div class="kpi-label">Already Assigned</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-users"></i></div>
        </div>
        <div>
          <div class="kpi-value">${Math.max(deliveryStaff.length, 1)}</div>
          <div class="kpi-label">Available Riders</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Order ID</th><th>Customer</th><th>Destination</th>
              <th>Packages</th><th>Priority</th><th>Delivery Staff</th>
              <th>Carrier</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" class="text-center py-4 text-muted">No packed orders awaiting delivery assignment.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bulk Assignment -->
    <div class="card p-4 border-0 shadow-sm rounded-4 mt-4">
      <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-check-double me-2 text-primary"></i>Bulk Route Assignment</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label fw-semibold">Delivery Zone</label>
          <select class="form-select"><option>Salem City Zone 1</option><option>Chennai Hub Express</option><option>Coimbatore Central</option></select>
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold">Courier Partner</label>
          <select id="bulkCourierSel" class="form-select"><option value="BlueDart">BlueDart Express</option><option value="Delhivery">Delhivery Surface</option><option value="Shadowfax">Shadowfax Rider</option></select>
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn-primary-custom w-100 justify-content-center py-2" onclick="handleBulkDispatch()">
            <i class="fa-solid fa-check-double me-2"></i> Dispatch All ${packedOrders.length} Orders
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleAssignDelivery(orderId) {
  const staffSel = document.getElementById(`staffSel_${orderId}`);
  const carrierSel = document.getElementById(`carrierSel_${orderId}`);
  const staffId = staffSel ? staffSel.value : 'STF-04';
  const courier = carrierSel ? carrierSel.value : 'BlueDart';
  RMK_STORE.assignDispatch(orderId, staffId, courier);
}

function handleBulkDispatch() {
  const packedOrders = RMK_STORE.orders.filter(o => o.status === 'PACKED' || o.status === 'Packed');
  const courier = document.getElementById('bulkCourierSel')?.value || 'BlueDart';
  if (!packedOrders.length) { showToast('No packed orders available to dispatch.', 'warning'); return; }
  packedOrders.forEach(o => { RMK_STORE.assignDispatch(o.id, 'STF-04', courier); });
}

// =========================================================================
// 5. SHIPPING LABELS — ONLY label-specific data for packed/dispatched orders
// =========================================================================
function renderDispatchLabelsView() {
  const labelOrders = RMK_STORE.orders.filter(o =>
    o.status === 'PACKED' || o.status === 'Packed' ||
    o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY'
  );
  const generated = labelOrders.filter(o => o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY');
  const pending = labelOrders.filter(o => o.status === 'PACKED' || o.status === 'Packed');

  const rows = labelOrders.map((o, idx) => {
    const hasLabel = o.status === 'DISPATCHED' || o.status === 'OUT_FOR_DELIVERY';
    return `
      <tr>
        <td>${idx + 1}</td>
        <td class="fw-bold text-primary">${o.id}</td>
        <td class="fw-semibold text-dark">${o.customerName}</td>
        <td><span class="badge bg-light text-dark border fw-semibold">SHP-${o.id.replace('ATD', '')}</span></td>
        <td><span class="status-badge ${hasLabel ? 'resolved' : 'open'}">${hasLabel ? 'Generated' : 'Pending'}</span></td>
        <td><span class="badge bg-primary-subtle text-primary">${o.courier || 'Pending'}</span></td>
        <td class="text-muted">${o.orderDate || '-'}</td>
        <td>
          <div class="d-flex gap-1">
            ${!hasLabel ? `
              <button class="btn btn-sm btn-outline-primary" onclick="showToast('Generating shipping label for #${o.id}...', 'info')">
                <i class="fa-solid fa-barcode me-1"></i> Generate
              </button>
            ` : `
              <button class="btn btn-sm btn-outline-primary" onclick="showToast('Printing label for #${o.id}...', 'info')">
                <i class="fa-solid fa-print me-1"></i> Print
              </button>
              <button class="btn btn-sm btn-outline-secondary" onclick="showToast('Downloading label PDF for #${o.id}...', 'success')">
                <i class="fa-solid fa-download"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-barcode me-2 text-primary"></i>Shipping Labels</h1>
        <p class="page-subtitle">Generate, print and manage airway bill labels for packed and dispatched orders</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-barcode"></i></div>
        </div>
        <div>
          <div class="kpi-value">${generated.length}</div>
          <div class="kpi-label">Labels Generated</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${pending.length}</div>
          <div class="kpi-label">Pending Labels</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-print"></i></div>
        </div>
        <div>
          <div class="kpi-value">${generated.length}</div>
          <div class="kpi-label">Printed Labels</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>
        <div>
          <div class="kpi-value">0</div>
          <div class="kpi-label">Failed Labels</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>#</th><th>Order ID</th><th>Customer</th><th>Shipment ID</th><th>Label Status</th><th>Carrier</th><th>Generated Date</th><th>Action</th></tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="8" class="text-center py-4 text-muted">No orders require shipping labels.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 6. DISPATCH HISTORY — ONLY completed/historical dispatch records
// =========================================================================
function renderDispatchHistoryView() {
  const completedOrders = RMK_STORE.orders.filter(o => o.status === 'DELIVERED' || o.status === 'FAILED' || o.status === 'Cancelled');
  const deliveredCount = completedOrders.filter(o => o.status === 'DELIVERED').length;
  const failedCount = completedOrders.filter(o => o.status === 'FAILED' || o.status === 'Cancelled').length;

  const rows = completedOrders.map((o, idx) => {
    const dispEvent = o.timeline ? o.timeline.find(t => t.status === 'DISPATCHED') : null;
    const delivEvent = o.timeline ? o.timeline.find(t => t.status === 'DELIVERED') : null;
    const rider = RMK_STORE.staff.find(s => s.id === o.deliveryPersonId);

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
        <td><span class="badge bg-light text-dark border">SHP-${o.id.replace('ATD', '')}</span></td>
        <td class="text-muted">${dispEvent ? dispEvent.updatedBy : 'Dispatch Staff'}</td>
        <td class="fw-semibold">${rider ? rider.name : 'Vikram R.'}</td>
        <td><span class="badge bg-primary-subtle text-primary">${o.courier || 'BlueDart'}</span></td>
        <td class="text-muted">${dispEvent ? dispEvent.updatedAt : '-'}</td>
        <td class="text-muted">${delivEvent ? delivEvent.updatedAt : '-'}</td>
        <td><span class="status-badge ${o.status === 'DELIVERED' ? 'delivered' : 'cancelled'}">${o.status}</span></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-clock-rotate-left me-2 text-primary"></i>Dispatch History</h1>
        <p class="page-subtitle">Historical record of all completed and closed dispatch events</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-box-archive"></i></div>
        </div>
        <div>
          <div class="kpi-value">${completedOrders.length}</div>
          <div class="kpi-label">Total Dispatches</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${deliveredCount}</div>
          <div class="kpi-label">Successfully Delivered</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-rotate-left"></i></div>
        </div>
        <div>
          <div class="kpi-value">${failedCount}</div>
          <div class="kpi-label">Failed / RTO</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div>
          <div class="kpi-value">${completedOrders.length > 0 ? Math.round((deliveredCount / completedOrders.length) * 100) : 0}%</div>
          <div class="kpi-label">Success Rate</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="table-card p-3 mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <select class="form-select" onchange="showToast('Filter applied', 'info')">
            <option value="">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed / RTO</option>
          </select>
        </div>
        <div class="col-md-4">
          <select class="form-select" onchange="showToast('Filter applied', 'info')">
            <option value="">All Carriers</option>
            <option value="BlueDart">BlueDart</option>
            <option value="Delhivery">Delhivery</option>
            <option value="Shadowfax">Shadowfax</option>
          </select>
        </div>
        <div class="col-md-4">
          <input type="date" class="form-control" value="2026-09-17">
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Order ID</th><th>Shipment ID</th><th>Dispatched By</th>
              <th>Delivery Partner</th><th>Carrier</th><th>Dispatch Date</th>
              <th>Delivered Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="9" class="text-center py-4 text-muted">No dispatch history records found.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 7. DISPATCH REPORTS — ONLY carrier SLA analytics and performance metrics
// =========================================================================
function renderDispatchReportsView() {
  const orders = RMK_STORE.orders;
  const totalDispatched = orders.filter(o => ['DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)).length;
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;
  const bluedartOrders = orders.filter(o => o.courier === 'BlueDart').length;
  const delhiveryOrders = orders.filter(o => o.courier === 'Delhivery').length;
  const shadowfaxOrders = orders.filter(o => o.courier === 'Shadowfax').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-chart-line me-2 text-primary"></i>Dispatch Reports</h1>
        <p class="page-subtitle">Carrier SLA performance, dispatch volume analytics, and delivery partner efficiency</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-truck-fast"></i></div>
        </div>
        <div>
          <div class="kpi-value">${totalDispatched}</div>
          <div class="kpi-label">Total Dispatched</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">4.2 hrs</div>
          <div class="kpi-label">Avg Dispatch Time</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div>
          <div class="kpi-value">${orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0}%</div>
          <div class="kpi-label">Dispatch Completion</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
        <div>
          <div class="kpi-value">0</div>
          <div class="kpi-label">Delayed Shipments</div>
        </div>
      </div>
    </div>

    <!-- Carrier Performance Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="table-card p-4 text-center border-start border-4 border-primary">
          <div class="text-muted small mb-1">BlueDart Performance</div>
          <div class="fs-2 fw-bold text-primary">99.2%</div>
          <div class="text-muted small">${bluedartOrders} Orders | On-Time SLA</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="table-card p-4 text-center border-start border-4 border-warning">
          <div class="text-muted small mb-1">Delhivery Performance</div>
          <div class="fs-2 fw-bold text-warning">98.1%</div>
          <div class="text-muted small">${delhiveryOrders} Orders | On-Time SLA</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="table-card p-4 text-center border-start border-4 border-info">
          <div class="text-muted small mb-1">Shadowfax Performance</div>
          <div class="fs-2 fw-bold text-dark">97.9%</div>
          <div class="text-muted small">${shadowfaxOrders} Orders | On-Time SLA</div>
        </div>
      </div>
    </div>

    <!-- Delivery Partner Performance -->
    <div class="table-card p-4 mb-4">
      <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-users me-2 text-primary"></i>Delivery Partner Performance</h5>
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>Partner</th><th>Zone</th><th>Deliveries</th><th>Success Rate</th><th>Avg Time</th><th>Rating</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="fw-bold text-dark">Vikram R. (DL001)</td>
              <td>Salem Zone 1</td>
              <td>${delivered} deliveries</td>
              <td><span class="badge bg-success-subtle text-success">98.5%</span></td>
              <td>3.8 hrs</td>
              <td><span class="text-warning">★★★★★</span> 4.9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card p-4 border-0 shadow-sm rounded-4 text-center py-5">
      <h4 class="fw-bold text-dark mb-2">Export Dispatch Analytics Report</h4>
      <p class="text-muted">Monthly carrier SLA, handover speeds, route efficiency, and RTO breach rates</p>
      <button class="btn-secondary-custom mx-auto mt-2" onclick="showToast('Exporting Dispatch Analytics Report...', 'info')">
        <i class="fa-solid fa-file-pdf me-2"></i> Download Dispatch Report (PDF)
      </button>
    </div>
  `;
}
