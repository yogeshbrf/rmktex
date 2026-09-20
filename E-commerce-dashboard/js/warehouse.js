/**
 * WAREHOUSE MODULE (#/warehouse/*)
 * Context-specific sub-views: each page shows ONLY data relevant to that page.
 * All data sourced from shared RMK_STORE (single source of truth).
 */

// =========================================================================
// 1. WAREHOUSE DASHBOARD — Aggregated overview of ALL warehouse operations
// =========================================================================
function renderWarehouseDashboardView() {
  const orders = RMK_STORE.orders;
  const products = RMK_STORE.products;

  const pendingOrders = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing');
  const packedOrders = orders.filter(o => o.status === 'PACKED' || o.status === 'Packed');
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-boxes-packing me-2 text-primary"></i>Warehouse Operations Dashboard</h1>
        <p class="page-subtitle">Overall summary of warehouse fulfillment queues, packing SLA, and stock alerts</p>
      </div>
    </div>

    <!-- 4 Warehouse KPI Summary Cards -->
    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-boxes-packing"></i></div>
          <span class="kpi-trend negative">${pendingOrders.length} Pending</span>
        </div>
        <div>
          <div class="kpi-value">${pendingOrders.length}</div>
          <div class="kpi-label">Pending Packing Queue</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
          <span class="kpi-trend positive">Ready for Dispatch</span>
        </div>
        <div>
          <div class="kpi-value">${packedOrders.length}</div>
          <div class="kpi-label">Packed Orders Ready</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-warehouse"></i></div>
        </div>
        <div>
          <div class="kpi-value">${products.length}</div>
          <div class="kpi-label">Active Inventory SKUs</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
        <div>
          <div class="kpi-value">${lowStockCount}</div>
          <div class="kpi-label">Low Stock Reorders</div>
        </div>
      </div>
    </div>

    <!-- Overview Quick Cards -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-list-check me-2 text-primary"></i>Fulfillment Queue Snapshot</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <div class="fw-bold text-dark">Incoming New Orders</div>
                <div class="text-muted small">Orders recently confirmed by sales</div>
              </div>
              <a href="#/warehouse/new-orders" class="btn btn-sm btn-outline-primary">${pendingOrders.length} Orders</a>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <div class="fw-bold text-dark">Orders Ready for Packing</div>
                <div class="text-muted small">Assigned to packing stations</div>
              </div>
              <a href="#/warehouse/orders-to-pack" class="btn btn-sm btn-outline-primary">${pendingOrders.length} Orders</a>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <div class="fw-bold text-dark">Packed & Sealed Boxes</div>
                <div class="text-muted small">Awaiting courier dispatch handover</div>
              </div>
              <a href="#/warehouse/packing" class="btn btn-sm btn-outline-success">${packedOrders.length} Boxes</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-shield-halved me-2 text-primary"></i>Warehouse Operational SLA</h5>
          <div class="p-3 bg-light rounded-3 mb-3 border">
            <div class="d-flex justify-content-between mb-1">
              <span class="fw-bold text-dark">Pick & Pack SLA Compliance</span>
              <span class="fw-bold text-success">99.1%</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar bg-success" style="width: 99.1%;"></div>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 mb-3 border">
            <div class="d-flex justify-content-between mb-1">
              <span class="fw-bold text-dark">Average Pick Time Per Order</span>
              <span class="fw-bold text-primary">4.2 Mins</span>
            </div>
            <div class="text-muted small">Target SLA: Under 10 minutes</div>
          </div>
          <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between mb-1">
              <span class="fw-bold text-dark">Total Stock Units</span>
              <span class="fw-bold text-dark">${totalStock.toLocaleString()} units</span>
            </div>
            <div class="text-muted small">${lowStockCount} items need reorder</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 2. NEW ORDERS — ONLY newly confirmed orders awaiting warehouse processing
// =========================================================================
function renderWarehouseNewOrdersView() {
  const pendingOrders = RMK_STORE.orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing');
  const codOrders = pendingOrders.filter(o => o.paymentMethod === 'COD');
  const totalItems = pendingOrders.reduce((sum, o) => sum + (Array.isArray(o.items) ? o.items.length : 1), 0);

  const rows = pendingOrders.map((o, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td class="fw-bold text-primary"><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td class="fw-semibold text-dark">${o.customerName}</td>
      <td>${Array.isArray(o.items) ? o.items.map(i => i.name).join(', ') : o.items}</td>
      <td>${o.city}, TN</td>
      <td class="text-muted">${o.orderDate || '17 Sep 2026'}</td>
      <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
      <td><span class="status-badge warning">CONFIRMED</span></td>
      <td>
        <button class="btn-primary-custom py-1 px-3" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'PACKED', 'Warehouse Staff')">
          <i class="fa-solid fa-box-open me-1"></i> Pick & Pack
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-bell me-2 text-primary"></i>New Orders</h1>
        <p class="page-subtitle">Newly confirmed orders awaiting warehouse pick-list allocation</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-bell"></i></div>
          <span class="kpi-trend warning">${pendingOrders.length} New</span>
        </div>
        <div>
          <div class="kpi-value">${pendingOrders.length}</div>
          <div class="kpi-label">New Orders</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-cubes"></i></div>
        </div>
        <div>
          <div class="kpi-value">${totalItems}</div>
          <div class="kpi-label">Total Items to Pick</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-money-bill"></i></div>
        </div>
        <div>
          <div class="kpi-value">${codOrders.length}</div>
          <div class="kpi-label">COD Orders</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-credit-card"></i></div>
        </div>
        <div>
          <div class="kpi-value">${pendingOrders.length - codOrders.length}</div>
          <div class="kpi-label">Prepaid Orders</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Order ID</th><th>Customer</th><th>Items</th>
              <th>City</th><th>Order Date</th><th>Payment</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="9" class="text-center py-4 text-muted">No new incoming orders awaiting pick allocation.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 3. ORDERS TO PACK — ONLY orders on packing tables waiting to be boxed
// =========================================================================
function renderWarehouseOrdersToPackView() {
  const pendingOrders = RMK_STORE.orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing');
  const highPriority = pendingOrders.filter(o => o.paymentMethod === 'COD');
  const totalValue = pendingOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  const rows = pendingOrders.map((o, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td class="fw-semibold text-dark">${o.customerName}</td>
      <td>
        <div class="fw-semibold">${Array.isArray(o.items) ? o.items.map(i => i.name).join(', ') : o.items}</div>
        <div class="text-muted" style="font-size: 11.5px;">City: ${o.city} | Est: ${o.estimatedDelivery || '20 Sep'}</div>
      </td>
      <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
      <td><span class="status-badge warning">Pending Pack</span></td>
      <td>
        <button class="btn-primary-custom py-1 px-3" onclick="RMK_STORE.updateOrderStatus('${o.id}', 'PACKED', 'Warehouse Staff (WS001)')">
          <i class="fa-solid fa-box-open me-1"></i> Mark as Packed
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-boxes-packing me-2 text-primary"></i>Orders to Pack</h1>
        <p class="page-subtitle">Orders currently on packing tables waiting to be boxed and sealed</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-boxes-packing"></i></div>
          <span class="kpi-trend negative">${pendingOrders.length} Pending</span>
        </div>
        <div>
          <div class="kpi-value">${pendingOrders.length}</div>
          <div class="kpi-label">Pending Packing</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-fire"></i></div>
        </div>
        <div>
          <div class="kpi-value">${highPriority.length}</div>
          <div class="kpi-label">High Priority (COD)</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalValue.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Queue Value</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">4.2 min</div>
          <div class="kpi-label">Avg Pack Time</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Order ID</th><th>Customer</th><th>Items & Destination</th>
              <th>Payment</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="7" class="text-center py-4 text-muted">All orders have been packed! No pending items.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. PACKING STATION — Dedicated barcode scanner & workbench (NOT dashboard)
// =========================================================================
function renderWarehousePackingAreaView() {
  const pending = RMK_STORE.orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing');
  const activeOrder = pending[0] || RMK_STORE.orders[0];
  const packedToday = RMK_STORE.orders.filter(o => o.status === 'PACKED' || o.status === 'Packed').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-barcode me-2 text-primary"></i>Packing Station</h1>
        <p class="page-subtitle">Dedicated station for SKU barcode verification, safety sealing & slip printing</p>
      </div>
    </div>

    <!-- Packing Station KPIs -->
    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-box-open"></i></div>
        </div>
        <div>
          <div class="kpi-value">${pending.length}</div>
          <div class="kpi-label">In Packing Queue</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${packedToday}</div>
          <div class="kpi-label">Packed Today</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-qrcode"></i></div>
        </div>
        <div>
          <div class="kpi-value">${packedToday + pending.length}</div>
          <div class="kpi-label">Barcodes Scanned</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-shield-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">99.8%</div>
          <div class="kpi-label">Scan Accuracy</div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-7">
        <div class="card p-4 border-0 shadow-sm rounded-4 mb-4">
          <h5 class="fw-bold text-dark mb-3">Active Order Station: #${activeOrder.id} (${activeOrder.customerName})</h5>
          <div class="input-group mb-3">
            <span class="input-group-text bg-light"><i class="fa-solid fa-qrcode text-muted"></i></span>
            <input type="text" class="form-control" id="scanInput" placeholder="Scan SKU / Order Barcode..." value="${activeOrder.id}-SLK-001">
            <button class="btn btn-primary px-4" onclick="showToast('Barcode Verified! Item matched SKU SLK-KNC-001', 'success')">Verify Barcode</button>
          </div>

          <div class="p-3 bg-light rounded-3 border">
            <div class="fw-bold text-dark mb-2">Item Checklist</div>
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" id="chk1" checked>
              <label class="form-check-label fw-semibold" for="chk1">${Array.isArray(activeOrder.items) ? activeOrder.items[0].name : activeOrder.items} [Verified]</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="chk2" checked>
              <label class="form-check-label fw-semibold" for="chk2">Tamper-Evident Safety Seal & Invoice Slip Included</label>
            </div>
          </div>
        </div>

        <button class="btn-success-custom w-100 py-3 fs-6 justify-content-center" onclick="RMK_STORE.updateOrderStatus('${activeOrder.id}', 'PACKED', 'Packing Station Workstation')">
          <i class="fa-solid fa-box-archive me-2"></i> COMPLETE PACKING FOR #${activeOrder.id}
        </button>
      </div>

      <div class="col-md-5">
        <div class="card p-4 border-0 shadow-sm rounded-4">
          <h5 class="fw-bold text-dark mb-3">Packaging Specifications</h5>
          <div class="mb-2"><strong>Recommended Box:</strong> Box B2 (Medium Poly Wrap)</div>
          <div class="mb-2"><strong>Gross Weight:</strong> 1.45 kg</div>
          <div class="mb-3"><strong>Destination:</strong> ${activeOrder.city} Distribution Hub</div>
          <div class="alert alert-info py-2 small mb-0"><i class="fa-solid fa-circle-info me-1"></i>Pure silk sarees require protective moisture poly-barrier.</div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 5. INVENTORY — ONLY stock counts, bin locations, and replenishment
// =========================================================================
function renderWarehouseInventoryView() {
  const products = RMK_STORE.products;
  const inStock = products.filter(p => p.stock > 10);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter(p => p.stock === 0);
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const rows = products.map(p => `
    <tr>
      <td class="fw-bold text-primary">${p.sku}</td>
      <td class="fw-semibold text-dark">${p.name}</td>
      <td>Rack B-${Math.floor(Math.random()*5)+1}, Shelf 2</td>
      <td class="fw-bold fs-6">${p.stock} units</td>
      <td><span class="status-badge ${p.stock > 10 ? 'delivered' : (p.stock > 0 ? 'cod' : 'cancelled')}">${p.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="triggerReplenishStock('${p.id}')">
          <i class="fa-solid fa-plus me-1"></i> Add Stock
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-warehouse me-2 text-primary"></i>Inventory Stock</h1>
        <p class="page-subtitle">Physical bin locations, stock counts, and replenishment actions</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-cubes"></i></div>
        </div>
        <div>
          <div class="kpi-value">${totalUnits}</div>
          <div class="kpi-label">Total Stock Units</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${inStock.length}</div>
          <div class="kpi-label">In Stock SKUs</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
        <div>
          <div class="kpi-value">${lowStock.length}</div>
          <div class="kpi-label">Low Stock Alerts</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-ban"></i></div>
        </div>
        <div>
          <div class="kpi-value">${outOfStock.length}</div>
          <div class="kpi-label">Out of Stock</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>SKU CODE</th><th>ITEM NAME</th><th>BIN LOCATION</th><th>STOCK ON HAND</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 6. PACKING SLIPS — ONLY packing slip documents for confirmed/packed orders
// =========================================================================
function renderWarehousePackingSlipsView() {
  const relevantOrders = RMK_STORE.orders.filter(o =>
    o.status === 'CONFIRMED' || o.status === 'Processing' ||
    o.status === 'PACKED' || o.status === 'Packed'
  );
  const generated = relevantOrders.filter(o => o.status === 'PACKED' || o.status === 'Packed');
  const pending = relevantOrders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing');

  const rows = relevantOrders.map((o, idx) => {
    const isPacked = o.status === 'PACKED' || o.status === 'Packed';
    return `
      <tr>
        <td>${idx + 1}</td>
        <td class="fw-bold text-primary">${o.id}</td>
        <td class="fw-semibold text-dark">${o.customerName}</td>
        <td>${Array.isArray(o.items) ? o.items.length : 1} items</td>
        <td>${o.city} Hub</td>
        <td><span class="status-badge ${isPacked ? 'resolved' : 'open'}">${isPacked ? 'Slip Generated' : 'Pending Pack'}</span></td>
        <td>
          ${isPacked ? `
            <button class="btn btn-sm btn-outline-primary" onclick="showToast('Printing Packing Slip for #${o.id}...', 'info')">
              <i class="fa-solid fa-print me-1"></i> Print Slip
            </button>
          ` : `
            <span class="text-muted small">Pack order first</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-print me-2 text-primary"></i>Packing Slips</h1>
        <p class="page-subtitle">Packing slip documents for warehouse fulfillment orders</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-file-lines"></i></div>
        </div>
        <div>
          <div class="kpi-value">${relevantOrders.length}</div>
          <div class="kpi-label">Total Slips</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${generated.length}</div>
          <div class="kpi-label">Generated</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${pending.length}</div>
          <div class="kpi-label">Pending Generation</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-print"></i></div>
        </div>
        <div>
          <div class="kpi-value">${generated.length}</div>
          <div class="kpi-label">Printed Today</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>#</th><th>Order ID</th><th>Customer</th><th>Items</th><th>Destination</th><th>Slip Status</th><th>Action</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 7. REPORTS — ONLY warehouse performance metrics and analytics
// =========================================================================
function renderWarehouseReportsView() {
  const orders = RMK_STORE.orders;
  const packed = orders.filter(o => o.status === 'PACKED' || o.status === 'Packed').length;
  const pending = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing').length;
  const totalProcessed = orders.filter(o => o.status !== 'CONFIRMED' && o.status !== 'Processing').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-chart-bar me-2 text-primary"></i>Warehouse Reports</h1>
        <p class="page-subtitle">Packing SLA throughput, order pick time analytics, and error audit</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div>
          <div class="kpi-value">99.1%</div>
          <div class="kpi-label">Fulfillment Efficiency</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">4.2 min</div>
          <div class="kpi-label">Avg Pick Time</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-shield-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">99.8%</div>
          <div class="kpi-label">Packing Accuracy</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-boxes-packing"></i></div>
        </div>
        <div>
          <div class="kpi-value">${totalProcessed}</div>
          <div class="kpi-label">Orders Processed</div>
        </div>
      </div>
    </div>

    <!-- Warehouse Throughput Breakdown -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-chart-pie me-2 text-primary"></i>Order Processing Breakdown</h5>
          <div class="p-3 bg-light rounded-3 mb-2 border d-flex justify-content-between">
            <span class="fw-semibold">Packed & Sealed</span>
            <span class="badge bg-success">${packed}</span>
          </div>
          <div class="p-3 bg-light rounded-3 mb-2 border d-flex justify-content-between">
            <span class="fw-semibold">Pending in Queue</span>
            <span class="badge bg-warning text-dark">${pending}</span>
          </div>
          <div class="p-3 bg-light rounded-3 border d-flex justify-content-between">
            <span class="fw-semibold">Total Processed</span>
            <span class="badge bg-primary">${totalProcessed}</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-user-clock me-2 text-primary"></i>Shift Performance</h5>
          <div class="p-3 bg-light rounded-3 mb-2 border d-flex justify-content-between">
            <span class="fw-semibold">Morning Shift (6AM-2PM)</span>
            <span class="badge bg-success">98.4% SLA</span>
          </div>
          <div class="p-3 bg-light rounded-3 border d-flex justify-content-between">
            <span class="fw-semibold">Day Shift (10AM-7PM)</span>
            <span class="badge bg-primary">99.1% SLA</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-4 border-0 shadow-sm rounded-4 text-center py-5">
      <h4 class="fw-bold text-dark mb-2">Export Warehouse Analytics Report</h4>
      <p class="text-muted">Monthly throughput, station speeds, shift productivity, and reorder alerts</p>
      <button class="btn-primary-custom mx-auto mt-2" onclick="showToast('Exporting Warehouse Throughput Report...', 'info')">
        <i class="fa-solid fa-file-pdf me-2"></i> Download Warehouse Report (PDF)
      </button>
    </div>
  `;
}
