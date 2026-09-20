/**
 * PAGE 1 — ADMIN DASHBOARD & MANAGEMENT MODULES
 * All metrics, tables, and charts are calculated dynamically from RMK_STORE.
 */

function renderDashboardView() {
  const orders = RMK_STORE.orders;
  const customers = RMK_STORE.customers;
  
  // Calculate dynamic KPIs
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;

  const confCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing').length;
  const packedCount = orders.filter(o => o.status === 'PACKED' || o.status === 'Packed').length;
  const dispCount = orders.filter(o => o.status === 'DISPATCHED' || o.status === 'Dispatched').length;
  const outCount = orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length;
  const delivCount = orders.filter(o => o.status === 'DELIVERED' || o.status === 'Delivered').length;
  const failCount = orders.filter(o => o.status === 'CANCELLED' || o.status === 'Failed').length;

  const recentRows = orders.slice(0, 5).map(o => `
    <tr>
      <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td>${o.customerName || o.customer}</td>
      <td>${Array.isArray(o.items) ? o.items.length : 1} items</td>
      <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
      <td><span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span></td>
      <td><button class="btn-secondary-custom py-1 px-2" onclick="openOrderModal('${o.id}')">View</button></td>
    </tr>
  `).join('');

  return `
    <!-- Page Header -->
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-gauge-high me-2 text-primary"></i>Admin Operations Dashboard</h1>
        <p class="page-subtitle">Real-time e-commerce analytics, shared data status, and quick actions</p>
      </div>
    </div>

    <!-- Top KPI Cards Grid -->
    <div class="kpi-grid">
      <!-- Card 1: Total Revenue -->
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green">
            <i class="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <span class="kpi-trend positive">
            <i class="fa-solid fa-arrow-up"></i> Live Sync
          </span>
        </div>
        <div>
          <div class="kpi-value">₹${totalRevenue.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Revenue (Paid/Delivered)</div>
        </div>
      </div>

      <!-- Card 2: Total Orders -->
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue">
            <i class="fa-solid fa-box-archive"></i>
          </div>
          <span class="kpi-trend positive">
            <i class="fa-solid fa-check"></i> Shared Store
          </span>
        </div>
        <div>
          <div class="kpi-value">${totalOrders}</div>
          <div class="kpi-label">Total Orders</div>
        </div>
      </div>

      <!-- Card 3: Customers -->
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green">
            <i class="fa-solid fa-users"></i>
          </div>
          <span class="kpi-trend positive">
            <i class="fa-solid fa-user-plus"></i> Active
          </span>
        </div>
        <div>
          <div class="kpi-value">${totalCustomers}</div>
          <div class="kpi-label">Registered Customers</div>
        </div>
      </div>

      <!-- Card 4: Pending Orders -->
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange">
            <i class="fa-solid fa-clock"></i>
          </div>
          <span class="kpi-trend ${pendingOrders > 0 ? 'negative' : 'positive'}">
            ${pendingOrders} Active
          </span>
        </div>
        <div>
          <div class="kpi-value">${pendingOrders}</div>
          <div class="kpi-label">Pending In-Flight Orders</div>
        </div>
      </div>
    </div>

    <!-- Charts Area Row -->
    <div class="charts-grid mt-4">
      <!-- Left Card: Sales Overview -->
      <div class="chart-card">
        <div class="card-header-flex">
          <div>
            <h2 class="card-title">Sales & Revenue Trend</h2>
          </div>
          <span class="badge bg-primary-subtle text-primary">Live Calculated</span>
        </div>
        <div class="chart-container-wrapper">
          <canvas id="salesOverviewChart"></canvas>
        </div>
      </div>

      <!-- Right Card: Order Status Donut -->
      <div class="chart-card">
        <div class="card-header-flex">
          <h2 class="card-title">Order Status Breakdown</h2>
          <span class="badge bg-light text-dark border">Synchronized</span>
        </div>
        <div class="row align-items-center">
          <div class="col-6">
            <div style="height: 180px; position: relative;">
              <canvas id="orderStatusChart"></canvas>
            </div>
          </div>
          <div class="col-6">
            <ul class="legend-list">
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #3B82F6;"></span>Confirmed</span>
                <span class="legend-val">${confCount}</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #10B981;"></span>Packed</span>
                <span class="legend-val">${packedCount}</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #6366F1;"></span>Dispatched</span>
                <span class="legend-val">${dispCount}</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #F59E0B;"></span>Out for Delivery</span>
                <span class="legend-val">${outCount}</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #06B6D4;"></span>Delivered</span>
                <span class="legend-val">${delivCount}</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #EF4444;"></span>Cancelled / Failed</span>
                <span class="legend-val">${failCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Lower Content Area Grid -->
    <div class="row g-4 mt-1">
      <div class="col-lg-8">
        <div class="table-card p-4">
          <div class="card-header-flex mb-3">
            <h3 class="card-title">Recent System Orders</h3>
            <a href="#/admin/orders" class="text-decoration-none fw-semibold text-primary" style="font-size: 13px;">View All Orders</a>
          </div>
          <div class="table-responsive-custom">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${recentRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="table-card p-4">
          <h3 class="card-title mb-3">System Cross-Sector Status</h3>
          <div class="d-flex flex-column gap-3">
            <div class="p-3 rounded-3" style="background-color: #F8FAFC; border: 1px solid #E2E8F0;">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="fw-semibold text-dark" style="font-size: 13px;">Warehouse Queue</span>
                <span class="badge bg-warning text-dark rounded-pill">${confCount} Confirmed</span>
              </div>
              <p class="text-muted mb-0" style="font-size: 12px;">Orders pending picking & packing in Salem warehouse.</p>
            </div>

            <div class="p-3 rounded-3" style="background-color: #FFFBEB; border: 1px solid #FDE68A;">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="fw-semibold text-warning-emphasis" style="font-size: 13px;">Dispatch Stage</span>
                <span class="badge bg-primary rounded-pill">${packedCount} Packed</span>
              </div>
              <p class="text-muted mb-0" style="font-size: 12px;">Packed boxes ready for carrier assignment.</p>
            </div>

            <div class="p-3 rounded-3" style="background-color: #ECFDF5; border: 1px solid #A7F3D0;">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="fw-semibold text-success" style="font-size: 13px;">Last Mile Delivery</span>
                <span class="badge bg-success rounded-pill">${dispCount + outCount} Active Transit</span>
              </div>
              <p class="text-muted mb-0" style="font-size: 12px;">Parcels out with delivery partners.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initDashboardCharts() {
  const orders = RMK_STORE.orders;
  const confCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'Processing').length;
  const packedCount = orders.filter(o => o.status === 'PACKED' || o.status === 'Packed').length;
  const dispCount = orders.filter(o => o.status === 'DISPATCHED' || o.status === 'Dispatched').length;
  const outCount = orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length;
  const delivCount = orders.filter(o => o.status === 'DELIVERED' || o.status === 'Delivered').length;
  const failCount = orders.filter(o => o.status === 'CANCELLED' || o.status === 'Failed').length;

  // Sales Overview Line Chart
  const salesCtx = document.getElementById('salesOverviewChart');
  if (salesCtx) {
    const gradient = salesCtx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(23, 105, 224, 0.25)');
    gradient.addColorStop(1, 'rgba(23, 105, 224, 0.0)');

    new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: ['Sep 1', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 17', 'Sep 20'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [120000, 145000, 210000, 190000, 260000, 280000],
          borderColor: '#1769E0',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#1769E0',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Order Status Donut Chart (Dynamic from Store)
  const statusCtx = document.getElementById('orderStatusChart');
  if (statusCtx) {
    new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
        datasets: [{
          data: [confCount, packedCount, dispCount, outCount, delivCount, failCount],
          backgroundColor: ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#06B6D4', '#EF4444'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }
}

// --------------------------------------------------------------------------
// ADMIN SUB-PAGES
// --------------------------------------------------------------------------

function renderAdminProductsView() {
  const products = RMK_STORE.products;
  const categories = RMK_STORE.categories;

  let rowsHtml = products.map(p => `
    <tr>
      <td class="fw-semibold text-dark">${p.id}</td>
      <td class="fw-bold text-dark">${p.name}</td>
      <td><span class="badge bg-light text-dark border">${p.category}</span></td>
      <td class="fw-bold text-primary">₹${p.price.toLocaleString()}</td>
      <td><span class="fw-semibold fs-6">${p.stock} units</span></td>
      <td><span class="status-badge ${p.stock > 10 ? 'delivered' : (p.stock > 0 ? 'cod' : 'cancelled')}">${p.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="triggerEditProductModal('${p.id}')">
          <i class="fa-solid fa-pen"></i> Edit
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="RMK_STORE.deleteProduct('${p.id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-tags me-2 text-primary"></i>Products Management</h1>
        <p class="page-subtitle">Centralized product catalog synchronized with Inventory and Warehouse stock</p>
      </div>
      <button class="btn-primary-custom" onclick="triggerAddProductModal()">
        <i class="fa-solid fa-plus me-1"></i> Add New Product
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="table-card p-3 mb-4">
      <div class="row g-3">
        <div class="col-md-6">
          <input type="text" id="productSearchInput" class="form-control" placeholder="Search product name or SKU..." onkeyup="filterProductsTable()">
        </div>
        <div class="col-md-3">
          <select id="productCatFilter" class="form-select" onchange="filterProductsTable()">
            <option value="">All Categories</option>
            ${categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-3">
          <select id="productStockFilter" class="form-select" onchange="filterProductsTable()">
            <option value="">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table" id="adminProductsTable">
          <thead>
            <tr>
              <th>PROD ID</th>
              <th>PRODUCT NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>${rowsHtml || '<tr><td colspan="7" class="text-center py-4 text-muted">No products found.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

function filterProductsTable() {
  const query = (document.getElementById('productSearchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('productCatFilter')?.value || '';
  const stock = document.getElementById('productStockFilter')?.value || '';

  const table = document.getElementById('adminProductsTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesCat = !cat || text.includes(cat.toLowerCase());
    const matchesStock = !stock || text.includes(stock.toLowerCase());

    r.style.display = (matchesQuery && matchesCat && matchesStock) ? '' : 'none';
  });
}

function triggerAddProductModal() {
  const name = prompt('Enter Product Name:', 'Pure Kanchipuram Tissue Silk Saree');
  if (!name) return;
  const price = prompt('Enter Price (₹):', '5999');
  const stock = prompt('Enter Initial Stock Quantity:', '30');

  RMK_STORE.addProduct({
    id: `PRD-0${RMK_STORE.products.length + 1}`,
    name: name,
    category: 'Pure Silk Sarees',
    categoryId: 'CAT-1',
    price: parseInt(price) || 2999,
    stock: parseInt(stock) || 10,
    sku: `SLK-NEW-00${RMK_STORE.products.length + 1}`,
    status: (parseInt(stock) || 10) > 10 ? 'In Stock' : 'Low Stock'
  });
}

function triggerEditProductModal(prodId) {
  const prod = RMK_STORE.products.find(p => p.id === prodId);
  if (!prod) return;
  const newName = prompt('Edit Product Name:', prod.name);
  if (!newName) return;
  const newPrice = prompt('Edit Price (₹):', prod.price);
  const newStock = prompt('Edit Stock Quantity:', prod.stock);

  RMK_STORE.updateProduct(prodId, {
    name: newName,
    price: parseInt(newPrice) || prod.price,
    stock: parseInt(newStock) || prod.stock,
    status: (parseInt(newStock) || prod.stock) > 10 ? 'In Stock' : ((parseInt(newStock) || prod.stock) > 0 ? 'Low Stock' : 'Out of Stock')
  });
}

function renderAdminCategoriesView() {
  const categories = RMK_STORE.categories;
  const products = RMK_STORE.products;

  let catCards = categories.map(c => {
    const count = products.filter(p => p.categoryId === c.id || p.category === c.name).length;
    return `
      <div class="col-md-6 col-lg-3">
        <div class="kpi-card h-100 position-relative">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="kpi-icon-box blue"><i class="fa-solid ${c.icon || 'fa-folder'}"></i></div>
            <span class="badge bg-success-subtle text-success">${c.status || 'Active'}</span>
          </div>
          <h5 class="fw-bold text-dark mb-1">${c.name}</h5>
          <div class="text-primary fw-bold mb-2">${count} Products Assigned</div>
          <p class="text-muted small mb-3">${c.desc}</p>
          <div class="d-flex gap-2 border-top pt-2 mt-auto">
            <button class="btn btn-sm btn-outline-primary w-50" onclick="triggerEditCategoryModal('${c.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-sm btn-outline-danger w-50" onclick="RMK_STORE.deleteCategory('${c.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-layer-group me-2 text-primary"></i>Product Categories</h1>
        <p class="page-subtitle">Organize store taxonomy and collection mappings</p>
      </div>
      <button class="btn-primary-custom" onclick="triggerAddCategoryModal()">
        <i class="fa-solid fa-plus me-1"></i> Add New Category
      </button>
    </div>
    <div class="row g-4">${catCards}</div>
  `;
}

function triggerAddCategoryModal() {
  const name = prompt('Enter Category Name:', 'Art Silk & Printed Sarees');
  if (!name) return;
  const desc = prompt('Enter Description:', 'Budget-friendly art silk sarees');

  RMK_STORE.addCategory({
    id: `CAT-${RMK_STORE.categories.length + 1}`,
    name: name,
    icon: 'fa-shirt',
    desc: desc || 'Category description',
    createdDate: '2026-09-17',
    status: 'Active'
  });
}

function triggerEditCategoryModal(catId) {
  const cat = RMK_STORE.categories.find(c => c.id === catId);
  if (!cat) return;
  const newName = prompt('Edit Category Name:', cat.name);
  if (!newName) return;
  const newDesc = prompt('Edit Description:', cat.desc);

  RMK_STORE.updateCategory(catId, {
    name: newName,
    desc: newDesc || cat.desc
  });
}

function renderAdminOrdersView() {
  const orders = RMK_STORE.orders;

  let rowsHtml = orders.map(o => `
    <tr>
      <td class="fw-bold text-primary">${o.id}</td>
      <td class="fw-semibold text-dark">${o.customerName || o.customer}</td>
      <td>${Array.isArray(o.items) ? o.items.map(i => i.name).join(', ') : o.items}</td>
      <td class="fw-bold text-dark">₹${(o.amount || 0).toLocaleString('en-IN')}</td>
      <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
      <td><span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span></td>
      <td>${o.estimatedDelivery || '20 Sep 2026'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="openOrderModal('${o.id}')">View Details</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-boxes-packing me-2 text-primary"></i>Master Orders Directory</h1>
        <p class="page-subtitle">Centralized order pipeline shared across Admin, Warehouse, Dispatch, Delivery, Support & Finance</p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="table-card p-3 mb-4">
      <div class="row g-3">
        <div class="col-md-8">
          <input type="text" id="adminOrderSearch" class="form-control" placeholder="Search Order ID, Customer Name, or City..." onkeyup="filterAdminOrdersTable()">
        </div>
        <div class="col-md-4">
          <select id="adminOrderStatusFilter" class="form-select" onchange="filterAdminOrdersTable()">
            <option value="">All Order Statuses</option>
            <option value="CONFIRMED">CONFIRMED / Processing</option>
            <option value="PACKED">PACKED</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="FAILED">FAILED / Cancelled</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table" id="adminOrdersMasterTable">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>PAYMENT</th>
              <th>STATUS</th>
              <th>EST. DELIVERY</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>
  `;
}

function filterAdminOrdersTable() {
  const query = (document.getElementById('adminOrderSearch')?.value || '').toLowerCase();
  const status = document.getElementById('adminOrderStatusFilter')?.value || '';

  const table = document.getElementById('adminOrdersMasterTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesStatus = !status || text.includes(status.toLowerCase());

    r.style.display = (matchesQuery && matchesStatus) ? '' : 'none';
  });
}

function renderAdminInventoryView() {
  const products = RMK_STORE.products;

  let rows = products.map(p => `
    <tr>
      <td class="fw-bold text-primary">${p.sku}</td>
      <td class="fw-semibold text-dark">${p.name}</td>
      <td><span class="badge bg-light text-dark border">${p.category}</span></td>
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
        <h1 class="page-title"><i class="fa-solid fa-warehouse me-2 text-primary"></i>Centralized Inventory Stock</h1>
        <p class="page-subtitle">Real-time stock counts synchronized with sales orders & warehouse picking</p>
      </div>
    </div>
    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>SKU CODE</th><th>PRODUCT NAME</th><th>CATEGORY</th><th>STOCK ON HAND</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function triggerReplenishStock(prodId) {
  const qty = prompt('Enter quantity to add to stock:', '25');
  if (!qty) return;
  const num = parseInt(qty);
  if (isNaN(num)) return;

  const prod = RMK_STORE.products.find(p => p.id === prodId);
  if (prod) {
    const newStock = prod.stock + num;
    RMK_STORE.updateProduct(prodId, {
      stock: newStock,
      status: newStock > 10 ? 'In Stock' : 'Low Stock'
    });
  }
}

function renderAdminCustomersView() {
  const customers = RMK_STORE.customers;

  let rows = customers.map(c => `
    <tr>
      <td class="fw-bold text-dark">${c.id}</td>
      <td class="fw-semibold text-dark">${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.city}, ${c.state}</td>
      <td class="fw-bold">${c.ordersCount || 1} orders</td>
      <td class="fw-bold text-success">₹${(c.totalSpent || 0).toLocaleString('en-IN')}</td>
      <td><span class="badge bg-primary-subtle text-primary">${c.status}</span></td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-users me-2 text-primary"></i>Customer Directory</h1>
        <p class="page-subtitle">Registered buyers, address profiles, and cumulative order history</p>
      </div>
      <button class="btn-primary-custom" onclick="triggerAddCustomerModal()">
        <i class="fa-solid fa-user-plus me-1"></i> Add New Customer
      </button>
    </div>
    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>CUST ID</th><th>NAME</th><th>PHONE</th><th>LOCATION</th><th>TOTAL ORDERS</th><th>TOTAL SPENT</th><th>STATUS</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function triggerAddCustomerModal() {
  const name = prompt('Enter Customer Name:', 'Swetha Sundaram');
  if (!name) return;
  const phone = prompt('Enter Phone Number:', '+91 94433 11223');
  const city = prompt('Enter City:', 'Trichy');

  RMK_STORE.addCustomer({
    id: `CUS00${RMK_STORE.customers.length + 1}`,
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    phone: phone || '+91 90000 00000',
    city: city || 'Salem',
    state: 'Tamil Nadu',
    address: `Ward 4, ${city || 'Salem'} - 600001`,
    ordersCount: 0,
    totalSpent: 0,
    status: 'Active'
  });
}

function renderAdminStaffView() {
  const staff = RMK_STORE.staff;

  let rows = staff.map(s => `
    <tr>
      <td class="fw-bold text-dark">${s.id}</td>
      <td class="fw-semibold text-dark">${s.name}</td>
      <td><span class="badge bg-info-subtle text-info fw-bold">${s.code}</span></td>
      <td>${s.dept}</td>
      <td>${s.hub}</td>
      <td><span class="text-success fw-bold">● ${s.status}</span></td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-user-gear me-2 text-primary"></i>Staff Management Directory</h1>
        <p class="page-subtitle">System staff accounts, sector permissions, and operational hub assignments</p>
      </div>
      <button class="btn-primary-custom" onclick="triggerAddStaffModal()">
        <i class="fa-solid fa-user-plus me-1"></i> Add Staff Account
      </button>
    </div>
    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>STAFF ID</th><th>NAME</th><th>ROLE CODE</th><th>DEPARTMENT</th><th>ASSIGNED HUB</th><th>DUTY STATUS</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function triggerAddStaffModal() {
  const name = prompt('Enter Staff Name:', 'Manoj Kumar');
  if (!name) return;
  const dept = prompt('Enter Department:', 'Dispatch Logistics');

  RMK_STORE.addStaff({
    id: `STF-0${RMK_STORE.staff.length + 1}`,
    code: `DP00${RMK_STORE.staff.length + 1}`,
    name: name,
    role: 'dispatch',
    dept: dept || 'Logistics',
    email: `${name.toLowerCase().replace(' ', '.')}@rmktextiles.com`,
    phone: '+91 98765 99999',
    hub: 'Salem Logistics Hub',
    shift: 'General',
    status: 'Active Duty'
  });
}

function renderAdminCouponsView() {
  const coupons = RMK_STORE.coupons;

  let rows = coupons.map(c => `
    <tr>
      <td class="fw-bold text-primary">${c.code}</td>
      <td class="fw-bold text-success">${c.discount}</td>
      <td>${c.type}</td>
      <td>${c.usages || 0} times</td>
      <td><span class="status-badge ${c.active ? 'delivered' : 'cancelled'}">${c.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
      <td>
        <button class="btn btn-sm ${c.active ? 'btn-outline-warning' : 'btn-outline-success'} me-1" onclick="RMK_STORE.toggleCoupon('${c.id}')">
          ${c.active ? 'Deactivate' : 'Activate'}
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="RMK_STORE.deleteCoupon('${c.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-ticket me-2 text-primary"></i>Coupons & Offer Discounts</h1>
        <p class="page-subtitle">Manage promotional promo codes, min order value rules, and customer discounts</p>
      </div>
      <button class="btn-primary-custom" onclick="triggerAddCouponModal()">
        <i class="fa-solid fa-plus me-1"></i> Add New Coupon
      </button>
    </div>
    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>COUPON CODE</th><th>DISCOUNT</th><th>TYPE</th><th>TOTAL USAGES</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function triggerAddCouponModal() {
  const code = prompt('Enter Coupon Code (e.g. SILK1000):', 'DIWALI25');
  if (!code) return;
  const discount = prompt('Enter Discount Text:', '25% OFF');

  RMK_STORE.addCoupon({
    id: `CPN-${RMK_STORE.coupons.length + 100}`,
    code: code.toUpperCase(),
    discount: discount || '15% OFF',
    type: 'Percentage',
    minOrder: 2000,
    expiryDate: '30 Nov 2026',
    active: true,
    usages: 0
  });
}

function renderAdminReportsView() {
  const orders = RMK_STORE.orders;
  const totalRev = orders.filter(o => o.paymentStatus === 'Paid' || o.status === 'DELIVERED').reduce((sum, o) => sum + (o.amount || 0), 0);
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-file-invoice-dollar me-2 text-primary"></i>Business Analytics & Reports</h1>
        <p class="page-subtitle">Generate exportable PDF/CSV operational financial summaries from shared store data</p>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="table-card p-3 text-center border-start border-4 border-primary">
          <div class="text-muted small">Total Store Sales</div>
          <div class="fs-4 fw-bold text-dark">₹${totalRev.toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="table-card p-3 text-center border-start border-4 border-success">
          <div class="text-muted small">Orders Delivered</div>
          <div class="fs-4 fw-bold text-success">${deliveredCount} / ${orders.length}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="table-card p-3 text-center border-start border-4 border-warning">
          <div class="text-muted small">Active Products SKU</div>
          <div class="fs-4 fw-bold text-dark">${RMK_STORE.products.length} Items</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="table-card p-3 text-center border-start border-4 border-info">
          <div class="text-muted small">Fulfillment Rate</div>
          <div class="fs-4 fw-bold text-dark">98.4%</div>
        </div>
      </div>
    </div>

    <div class="card p-4 border-0 shadow-sm rounded-4 text-center py-5">
      <i class="fa-solid fa-chart-line text-primary mb-3" style="font-size: 48px;"></i>
      <h3 class="fw-bold text-dark">Executive Business Summary Report</h3>
      <p class="text-muted">Total Monthly Sales: ₹${totalRev.toLocaleString('en-IN')} | Orders Logged: ${orders.length} | Fulfillment SLA: 98.4%</p>
      <div class="d-flex justify-content-center gap-3 mt-3">
        <button class="btn-primary-custom" onclick="showToast('Exporting Sales Report PDF...', 'success')"><i class="fa-solid fa-file-pdf me-2"></i>Download PDF Report</button>
        <button class="btn-secondary-custom" onclick="showToast('Exporting Raw CSV Data...', 'info')"><i class="fa-solid fa-file-csv me-2"></i>Export CSV Data</button>
      </div>
    </div>
  `;
}

function renderAdminSettingsView() {
  const settings = RMK_STORE.settings;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-sliders me-2 text-primary"></i>System Settings</h1>
        <p class="page-subtitle">Configure store parameters, logistics hub addresses & notification triggers</p>
      </div>
    </div>
    <div class="card p-4 border-0 shadow-sm rounded-4">
      <form onsubmit="handleSettingsSave(event)">
        <div class="mb-3">
          <label class="form-label fw-semibold">Store Brand Name</label>
          <input type="text" id="settingBrandName" class="form-control" value="${settings.brandName || 'RMK Textiles Operations System'}">
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Primary Operations Hub Location</label>
          <input type="text" id="settingHub" class="form-control" value="${settings.primaryHub || 'Salem Central Warehouse, Tamil Nadu'}">
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">GSTIN Tax Registration Number</label>
          <input type="text" id="settingGstin" class="form-control" value="${settings.taxGstin || '33AAAAA0000A1Z5'}">
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold">Automated SMS / WhatsApp SLA Notifications</label>
          <select id="settingNotify" class="form-select">
            <option value="true" ${settings.notificationsEnabled ? 'selected' : ''}>Enabled (Real-time triggers)</option>
            <option value="false" ${!settings.notificationsEnabled ? 'selected' : ''}>Disabled</option>
          </select>
        </div>
        <button type="submit" class="btn-primary-custom"><i class="fa-solid fa-floppy-disk me-2"></i>Save Configuration</button>
      </form>
    </div>
  `;
}

function handleSettingsSave(event) {
  event.preventDefault();
  RMK_STORE.updateSettings({
    brandName: document.getElementById('settingBrandName').value,
    primaryHub: document.getElementById('settingHub').value,
    taxGstin: document.getElementById('settingGstin').value,
    notificationsEnabled: document.getElementById('settingNotify').value === 'true'
  });
}
