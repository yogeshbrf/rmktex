/**
 * RMK TEXTILES — CENTRALIZED REAL-TIME STORE ENGINE
 * Single source of truth synchronized live with Central Express Backend (http://localhost:5000).
 * All sectors (Admin, Warehouse, Dispatch, Delivery, Support, Finance) read/write here.
 */

const BACKEND_BASE = (window.RMK_CONFIG && window.RMK_CONFIG.BACKEND_URL)
  ? window.RMK_CONFIG.BACKEND_URL.replace(/\/+$/, '') + '/api'
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : window.location.origin + '/api');

window.BACKEND_BASE = BACKEND_BASE;

const INITIAL_APP_DATA = {
  products: [],
  categories: [
    { id: 'CAT-1', name: 'Pure Silk Sarees', icon: 'fa-shirt', desc: 'Handcrafted Kanchipuram, Banarasi & Mysore Silks', createdDate: '2026-08-01', status: 'Active' },
    { id: 'CAT-2', name: 'Mens Traditional Apparel', icon: 'fa-user-tie', desc: 'Dhotis, Kurta Sets & Silk Shirts', createdDate: '2026-08-01', status: 'Active' },
    { id: 'CAT-3', name: 'Womens Ethnic Wear', icon: 'fa-child-dress', desc: 'Kurtis, Anarkalis & Dupattas', createdDate: '2026-08-01', status: 'Active' },
    { id: 'CAT-4', name: 'Home & Bedding Textiles', icon: 'fa-bed', desc: 'Bedlinen, Towels & Cushion Covers', createdDate: '2026-08-01', status: 'Active' }
  ],
  customers: [
    { id: 'CUS001', name: 'Rahul S.', email: 'rahul.s@example.com', phone: '+91 98765 43210', city: 'Salem', state: 'Tamil Nadu', address: '12, South Car Street, Salem - 636001', ordersCount: 4, totalSpent: 14500, status: 'VIP Member' },
    { id: 'CUS002', name: 'Anitha M.', email: 'anitha.m@example.com', phone: '+91 98765 11223', city: 'Chennai', state: 'Tamil Nadu', address: '45, Anna Salai, T. Nagar, Chennai - 600017', ordersCount: 2, totalSpent: 6800, status: 'Active' },
    { id: 'CUS003', name: 'Suresh Kumar', email: 'suresh.k@example.com', phone: '+91 98123 45678', city: 'Coimbatore', state: 'Tamil Nadu', address: '88, Cross Cut Road, Gandhipuram, Coimbatore - 641012', ordersCount: 5, totalSpent: 28400, status: 'VIP Member' },
    { id: 'CUS004', name: 'Priya R.', email: 'priya.r@example.com', phone: '+91 99887 76655', city: 'Madurai', state: 'Tamil Nadu', address: '19, KK Nagar, Madurai - 625020', ordersCount: 3, totalSpent: 9999, status: 'Active' },
    { id: 'CUS005', name: 'Kavitha P.', email: 'kavitha.p@example.com', phone: '+91 97766 55443', city: 'Trichy', state: 'Tamil Nadu', address: '22, Thillai Nagar, Trichy - 620018', ordersCount: 1, totalSpent: 2598, status: 'Active' }
  ],
  orders: [
    {
      id: 'ATD1001',
      customerId: 'CUS001',
      customerName: 'Rahul S.',
      phone: '+91 98765 43210',
      city: 'Salem',
      address: '12, South Car Street, Salem - 636001',
      items: [],
      amount: 14497,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'CONFIRMED',
      orderDate: '17 Sep 2026 10:00 AM',
      estimatedDelivery: '20 Sep 2026',
      courier: 'BlueDart',
      deliveryPersonId: 'STF-04',
      timeline: [
        { status: 'ORDER_PLACED', updatedBy: 'System', updatedAt: '17 Sep 2026 10:00 AM' },
        { status: 'CONFIRMED', updatedBy: 'Admin Staff', updatedAt: '17 Sep 2026 10:15 AM' }
      ]
    }
  ],
  staff: [
    { id: 'STF-01', code: 'Super Admin', name: 'Admin Manager', role: 'admin', dept: 'System Admin', email: 'admin@rmktextiles.com', phone: '+91 98765 00001', hub: 'Central HQ Salem', shift: 'General (9 AM - 6 PM)', status: 'Active Duty' },
    { id: 'STF-02', code: 'WS001', name: 'Warehouse Supervisor', role: 'warehouse', dept: 'Fulfillment & Packing', email: 'warehouse@rmktextiles.com', phone: '+91 98765 00002', hub: 'Salem Logistics Hub', shift: 'Morning (6 AM - 2 PM)', status: 'Active Duty' },
    { id: 'STF-03', code: 'DP001', name: 'Dispatch Controller', role: 'dispatch', dept: 'Logistics & Shipping', email: 'dispatch@rmktextiles.com', phone: '+91 98765 00003', hub: 'Salem Logistics Hub', shift: 'Day (10 AM - 7 PM)', status: 'Active Duty' },
    { id: 'STF-04', code: 'DL001', name: 'Vikram R.', role: 'delivery', dept: 'Last-Mile Delivery', email: 'delivery@rmktextiles.com', phone: '+91 98765 00004', hub: 'Salem City Zone 1', shift: 'Field Shift', status: 'Active Duty' },
    { id: 'STF-05', code: 'SP001', name: 'Support Lead', role: 'support', dept: 'Customer Experience', email: 'support@rmktextiles.com', phone: '+91 98765 00005', hub: 'Central HQ Salem', shift: 'Rotational', status: 'Active Duty' },
    { id: 'STF-06', code: 'FN001', name: 'Finance Controller', role: 'finance', dept: 'Accounts & Audit', email: 'finance@rmktextiles.com', phone: '+91 98765 00006', hub: 'Central HQ Salem', shift: 'General (9 AM - 6 PM)', status: 'Active Duty' }
  ],
  coupons: [
    { id: 'CPN-101', code: 'FESTIVE20', discount: '20% OFF', type: 'Percentage', minOrder: 2000, expiryDate: '31 Oct 2026', active: true, usages: 420 },
    { id: 'CPN-102', code: 'SILK500', discount: '₹500 Flat', type: 'Fixed Amount', minOrder: 5000, expiryDate: '15 Nov 2026', active: true, usages: 185 }
  ],
  supportTickets: [
    { id: 'TK1001', customerId: 'CUS004', customerName: 'Priya R.', orderId: 'ATD1004', subject: 'Size exchange request for saree blouse piece', category: 'Return', priority: 'High', status: 'Open', date: '17 Sep 2026' }
  ],
  refunds: [
    { id: 'RFD-501', orderId: 'ATD1008', customerName: 'Ganesh V.', amount: 11499, payMethod: 'COD', reason: 'Failed Delivery / RTO', status: 'Pending', date: '16 Sep 2026' }
  ],
  settings: {
    brandName: 'RMK Textiles Operations System',
    primaryHub: 'Salem Central Warehouse, Tamil Nadu',
    notificationsEnabled: true,
    currency: 'INR',
    taxGstin: '33AAAAA0000A1Z5'
  }
};

const RMK_STORE = {
  appData: null,
  socket: null,

  async init() {
    this.appData = JSON.parse(JSON.stringify(INITIAL_APP_DATA));
    await this.fetchCentralData();
    this.initSocketConnection();
  },

  async fetchCentralData() {
    try {
      const [pRes, oRes, cRes, custRes, sRes, tRes, rRes, cpnRes] = await Promise.all([
        fetch(`${BACKEND_BASE}/products`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/orders`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/categories`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/customers`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/staff`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/support/tickets`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/refunds`).then(r => r.json()).catch(() => null),
        fetch(`${BACKEND_BASE}/coupons`).then(r => r.json()).catch(() => null)
      ]);

      if (pRes && Array.isArray(pRes.products)) this.appData.products = pRes.products;
      if (oRes && oRes.orders && oRes.orders.length > 0) this.appData.orders = oRes.orders;
      if (cRes && cRes.categories && cRes.categories.length > 0) this.appData.categories = cRes.categories;
      if (custRes && custRes.customers && custRes.customers.length > 0) this.appData.customers = custRes.customers;
      if (sRes && sRes.staff && sRes.staff.length > 0) this.appData.staff = sRes.staff;
      if (tRes && (tRes.tickets || tRes.supportTickets)) this.appData.supportTickets = tRes.tickets || tRes.supportTickets;
      if (rRes && rRes.refunds) this.appData.refunds = rRes.refunds;
      if (cpnRes && cpnRes.coupons) this.appData.coupons = cpnRes.coupons;

      if (window.handleRoute) window.handleRoute();
    } catch (e) {
      console.warn('Central API fetch warning:', e);
    }
  },

  initSocketConnection() {
    if (typeof io !== 'undefined') {
        const socketUrl = (window.RMK_CONFIG && window.RMK_CONFIG.SOCKET_URL)
          ? window.RMK_CONFIG.SOCKET_URL
          : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : null);
        
        if (socketUrl) {
          this.socket = io(socketUrl);
        } else {
          return;
        }
        
        this.socket.on('orderCreated', (data) => {
          if (data && data.order) {
            const existingIdx = this.appData.orders.findIndex(o => o.id === data.order.id);
            if (existingIdx >= 0) {
              this.appData.orders[existingIdx] = data.order;
            } else {
              this.appData.orders.unshift(data.order);
            }
            if (window.showToast) window.showToast(`New Order ${data.order.id} received from customer!`, 'success');
            if (window.handleRoute) window.handleRoute();
          }
        });

        this.socket.on('orderStatusUpdated', (data) => {
          if (data && data.order) {
            const order = this.orders.find(o => o.id === data.order.id);
            if (order) {
              Object.assign(order, data.order);
              if (window.showToast) window.showToast(`Order ${order.id} updated to ${data.status}`, 'info');
              if (window.handleRoute) window.handleRoute();
            }
          }
        });

        this.socket.on('productStockUpdated', (data) => {
          if (data && data.productId) {
            const prod = this.products.find(p => p.id === data.productId || p._id === data.productId);
            if (prod) {
              prod.stock = data.stock;
              prod.status = data.status;
              if (window.showToast) window.showToast(`Stock updated for ${prod.name}: ${data.stock} units`, 'info');
              if (window.handleRoute) window.handleRoute();
            }
          }
        });

        this.socket.on('productCreated', (data) => {
          if (data && data.product) {
            const existingIdx = this.appData.products.findIndex(p => p.id === data.product.id);
            if (existingIdx >= 0) {
              this.appData.products[existingIdx] = data.product;
            } else {
              this.appData.products.unshift(data.product);
            }
            if (window.showToast) window.showToast(`New product '${data.product.name}' added!`, 'success');
            if (window.handleRoute) window.handleRoute();
          }
        });

        this.socket.on('productUpdated', (data) => {
          if (data && data.product) {
            const idx = this.appData.products.findIndex(p => p.id === data.product.id);
            if (idx >= 0) {
              this.appData.products[idx] = data.product;
            }
            if (window.showToast) window.showToast(`Product '${data.product.name}' updated.`, 'info');
            if (window.handleRoute) window.handleRoute();
          }
        });

        this.socket.on('productDeleted', (data) => {
          if (data && data.productId) {
            this.appData.products = this.appData.products.filter(p => p.id !== data.productId);
            if (window.showToast) window.showToast(`Product removed.`, 'info');
            if (window.handleRoute) window.handleRoute();
          }
        });

        this.socket.on('categoryCreated', (data) => {
          if (data && data.category) {
            this.appData.categories.push(data.category);
            if (window.handleRoute) window.handleRoute();
          }
        });

        this.socket.on('categoryUpdated', (data) => {
          if (data && data.category) {
            const idx = this.appData.categories.findIndex(c => c.id === data.category.id);
            if (idx >= 0) this.appData.categories[idx] = data.category;
            if (window.handleRoute) window.handleRoute();
          }
        });

        this.socket.on('categoryDeleted', (data) => {
          if (data && data.categoryId) {
            this.appData.categories = this.appData.categories.filter(c => c.id !== data.categoryId);
            if (window.handleRoute) window.handleRoute();
          }
        });
      } catch (e) {
        console.warn('Socket.IO connection warning:', e);
      }
    }
  },

  // Getters
  get orders() { return this.appData.orders || []; },
  get products() { return this.appData.products || []; },
  get categories() { return this.appData.categories || []; },
  get customers() { return this.appData.customers || []; },
  get staff() { return this.appData.staff || []; },
  get coupons() { return this.appData.coupons || []; },
  get tickets() { return this.appData.supportTickets || []; },
  get refunds() { return this.appData.refunds || []; },
  get settings() { return this.appData.settings || {}; },

  // ORDER LIFECYCLE MUTATORS
  async updateOrderStatus(orderId, newStatus, updatedByRole = 'Staff Member') {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      const nowFormatted = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      if (!order.timeline) order.timeline = [];
      order.timeline.push({ status: newStatus, updatedBy: updatedByRole, updatedAt: nowFormatted });

      try {
        await fetch(`${BACKEND_BASE}/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, updatedByRole })
        });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Order ${orderId} marked as ${newStatus}.`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  async assignDispatch(orderId, deliveryPersonId, courierName = 'BlueDart') {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.deliveryPersonId = deliveryPersonId;
      order.courier = courierName;
      order.status = 'DISPATCHED';

      try {
        await fetch(`${BACKEND_BASE}/orders/${orderId}/dispatch`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryPersonId, courier: courierName })
        });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Order ${orderId} assigned to ${courierName} & DISPATCHED!`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  // PRODUCT MUTATORS
  async addProduct(newProd) {
    this.appData.products.unshift(newProd);
    try {
      await fetch(`${BACKEND_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
    } catch (e) { console.warn('API Error:', e); }

    if (window.showToast) window.showToast(`Product '${newProd.name}' added successfully.`, 'success');
    if (window.handleRoute) window.handleRoute();
  },

  async updateProduct(prodId, updatedFields) {
    const prod = this.appData.products.find(p => p.id === prodId);
    if (prod) {
      Object.assign(prod, updatedFields);
      try {
        await fetch(`${BACKEND_BASE}/products/${prodId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
        });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Product '${prod.name}' updated successfully.`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  async updateProductStock(prodId, newStock) {
    const stockVal = Number(newStock);
    const prod = this.appData.products.find(p => p.id === prodId);
    if (prod) {
      prod.stock = stockVal;
      prod.status = stockVal === 0 ? 'Out of Stock' : (stockVal < 10 ? 'Low Stock' : 'In Stock');

      try {
        await fetch(`${BACKEND_BASE}/products/${prodId}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: stockVal })
        });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Stock updated for ${prod.name} to ${stockVal}.`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  async deleteProduct(prodId) {
    this.appData.products = this.appData.products.filter(p => p.id !== prodId);
    try {
      await fetch(`${BACKEND_BASE}/products/${prodId}`, { method: 'DELETE' });
    } catch (e) { console.warn('API Error:', e); }

    if (window.showToast) window.showToast(`Product ${prodId} deleted.`, 'danger');
    if (window.handleRoute) window.handleRoute();
  },

  // CATEGORY MUTATORS
  async addCategory(newCat) {
    this.appData.categories.push(newCat);
    try {
      await fetch(`${BACKEND_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
    } catch (e) { console.warn('API Error:', e); }

    if (window.showToast) window.showToast(`Category '${newCat.name}' added.`, 'success');
    if (window.handleRoute) window.handleRoute();
  },

  // CATEGORY MUTATORS
  async updateCategory(catId, updatedFields) {
    const cat = this.appData.categories.find(c => c.id === catId);
    if (cat) {
      Object.assign(cat, updatedFields);
      try {
        await fetch(`${BACKEND_BASE}/categories/${catId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
        });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Category '${cat.name}' updated.`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  async deleteCategory(catId) {
    this.appData.categories = this.appData.categories.filter(c => c.id !== catId);
    try {
      await fetch(`${BACKEND_BASE}/categories/${catId}`, { method: 'DELETE' });
    } catch (e) { console.warn('API Error:', e); }

    if (window.showToast) window.showToast(`Category deleted.`, 'danger');
    if (window.handleRoute) window.handleRoute();
  },

  // STAFF MUTATORS
  async addStaff(newStaff) {
    this.appData.staff.push(newStaff);
    try {
      await fetch(`${BACKEND_BASE}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
    } catch (e) { console.warn('API Error:', e); }

    if (window.showToast) window.showToast(`Staff member '${newStaff.name}' added.`, 'success');
    if (window.handleRoute) window.handleRoute();
  },

  // SUPPORT MUTATORS
  async resolveTicket(ticketId) {
    const tck = this.appData.supportTickets.find(t => t.id === ticketId);
    if (tck) {
      tck.status = 'Resolved';
      try {
        await fetch(`${BACKEND_BASE}/support/tickets/${ticketId}/resolve`, { method: 'PATCH' });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Ticket ${ticketId} resolved.`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  // FINANCE MUTATORS
  async processRefund(refundId) {
    const rfd = this.appData.refunds.find(r => r.id === refundId);
    if (rfd) {
      rfd.status = 'Completed';
      try {
        await fetch(`${BACKEND_BASE}/refunds/${refundId}/process`, { method: 'PATCH' });
      } catch (e) { console.warn('API Error:', e); }

      if (window.showToast) window.showToast(`Refund ${refundId} processed.`, 'success');
      if (window.handleRoute) window.handleRoute();
    }
  },

  searchAll(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    this.products.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        results.push({ type: 'Product', label: `${p.name} (${p.sku})`, link: '#/admin/products', item: p });
      }
    });
    this.orders.forEach(o => {
      if (o.id.toLowerCase().includes(q) || (o.customerName && o.customerName.toLowerCase().includes(q)) || (o.phone && o.phone.includes(q))) {
        results.push({ type: 'Order', label: `Order ${o.id} - ${o.customerName}`, link: '#/admin/orders', item: o });
      }
    });
    return results;
  }
};

// Initialize Store Engine
RMK_STORE.init();
