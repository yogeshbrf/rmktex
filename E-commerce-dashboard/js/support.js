/**
 * SUPPORT MODULE (#/support/*)
 * Context-specific sub-views: each page shows ONLY data relevant to that page.
 * All data sourced from shared RMK_STORE (single source of truth).
 */

// =========================================================================
// 1. SUPPORT DASHBOARD — Aggregated overview of ALL support operations
// =========================================================================
function renderSupportView() {
  const tickets = RMK_STORE.tickets;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const refunds = RMK_STORE.refunds;
  const pendingRefunds = refunds.filter(r => r.status === 'Pending').length;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-headset me-2 text-primary"></i>Support Operations Dashboard</h1>
        <p class="page-subtitle">Overview of customer grievance tickets, response SLA, and return requests</p>
      </div>
      <div>
        <button class="btn-primary-custom" data-bs-toggle="modal" data-bs-target="#newTicketModal">
          <i class="fa-solid fa-plus me-1"></i> Create Ticket
        </button>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-ticket"></i></div>
          <span class="kpi-trend positive">${tickets.length} Total</span>
        </div>
        <div>
          <div class="kpi-value">${tickets.length}</div>
          <div class="kpi-label">Total Tickets</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${openCount}</div>
          <div class="kpi-label">Open Grievances</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${resolvedCount}</div>
          <div class="kpi-label">Resolved Tickets</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-stopwatch"></i></div>
        </div>
        <div>
          <div class="kpi-value">12.4 min</div>
          <div class="kpi-label">Avg Response Time</div>
        </div>
      </div>
    </div>

    <!-- Overview Quick Cards -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-list-check me-2 text-primary"></i>Support Workstations</h5>
          <div class="d-grid gap-2">
            <a href="#/support/tickets" class="btn btn-outline-primary text-start p-3">
              <div class="fw-bold"><i class="fa-solid fa-headset me-2"></i>Tickets Desk (${openCount} Open, ${inProgressCount} In Progress)</div>
              <div class="small opacity-75">Resolve open customer issues</div>
            </a>
            <a href="#/support/lookup" class="btn btn-outline-secondary text-start p-3">
              <div class="fw-bold"><i class="fa-solid fa-magnifying-glass me-2"></i>Order Lookup</div>
              <div class="small opacity-75">Search order timeline and customer history</div>
            </a>
            <a href="#/support/returns" class="btn btn-outline-warning text-start p-3">
              <div class="fw-bold"><i class="fa-solid fa-rotate-left me-2"></i>Returns & Refunds (${pendingRefunds} Pending)</div>
              <div class="small opacity-75">Process return requests and refund approvals</div>
            </a>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="fa-solid fa-shield-halved me-2 text-primary"></i>Support Performance SLA</h5>
          <div class="p-3 bg-light rounded-3 mb-2 border">
            <div class="d-flex justify-content-between">
              <span class="fw-semibold">First Contact Resolution</span>
              <span class="fw-bold text-success">94.2%</span>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 mb-2 border">
            <div class="d-flex justify-content-between">
              <span class="fw-semibold">Customer Satisfaction</span>
              <span class="fw-bold text-primary">4.8 / 5.0 ★</span>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between">
              <span class="fw-semibold">Ticket Resolution Rate</span>
              <span class="fw-bold text-success">${tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 2. SUPPORT TICKETS — ONLY ticket management desk with filters
// =========================================================================
function renderSupportTicketsView() {
  const tickets = RMK_STORE.tickets;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  const rows = tickets.map((t, idx) => {
    const linkedOrder = t.orderId ? RMK_STORE.orders.find(o => o.id === t.orderId) : null;
    const orderStatusBadge = linkedOrder ? `<span class="badge bg-light text-dark border ms-1">${linkedOrder.status}</span>` : '';

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><span class="fw-bold text-dark">#${t.id}</span></td>
        <td>
          <div class="fw-semibold text-dark">${t.customerName || t.customer}</div>
          <div class="text-muted" style="font-size: 11px;">Category: ${t.category || 'General'}</div>
        </td>
        <td>
          ${t.orderId ? `<span class="order-id-link" onclick="openOrderModal('${t.orderId}')">${t.orderId}</span>${orderStatusBadge}` : '<span class="text-muted">-</span>'}
        </td>
        <td style="max-width: 250px;">${t.subject || t.issue}</td>
        <td><span class="status-badge ${t.priority.toLowerCase()}">${t.priority}</span></td>
        <td><span class="status-badge ${t.status.toLowerCase().replace(' ', '-')}">${t.status}</span></td>
        <td class="text-muted">${t.date || '17 Sep'}</td>
        <td class="text-end">
          ${t.status !== 'Resolved' ? `
            <button class="btn btn-sm btn-outline-success py-1 px-2" onclick="RMK_STORE.resolveTicket('${t.id}')">
              <i class="fa-solid fa-check me-1"></i> Resolve
            </button>
          ` : `
            <span class="badge bg-light text-success border border-success-subtle"><i class="fa-solid fa-circle-check"></i> Closed</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-headset me-2 text-primary"></i>Support Tickets</h1>
        <p class="page-subtitle">Manage and resolve customer support tickets</p>
      </div>
      <div>
        <button class="btn-primary-custom" data-bs-toggle="modal" data-bs-target="#newTicketModal">
          <i class="fa-solid fa-plus me-1"></i> New Ticket
        </button>
      </div>
    </div>

    <!-- Ticket-Specific KPIs -->
    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-ticket"></i></div>
        </div>
        <div>
          <div class="kpi-value">${tickets.length}</div>
          <div class="kpi-label">All Tickets</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-circle-exclamation"></i></div>
        </div>
        <div>
          <div class="kpi-value">${openCount}</div>
          <div class="kpi-label">Open</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-spinner"></i></div>
        </div>
        <div>
          <div class="kpi-value">${inProgressCount}</div>
          <div class="kpi-label">In Progress</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${resolvedCount}</div>
          <div class="kpi-label">Resolved</div>
        </div>
      </div>
    </div>

    <!-- Tabs Header -->
    <div class="custom-tabs mb-3">
      <button class="tab-btn active" onclick="switchSupportTab(this, 'all')">
        All Tickets <span class="tab-count-badge">${tickets.length}</span>
      </button>
      <button class="tab-btn" onclick="switchSupportTab(this, 'open')">
        Open <span class="tab-count-badge warning">${openCount}</span>
      </button>
      <button class="tab-btn" onclick="switchSupportTab(this, 'in_progress')">
        In Progress <span class="tab-count-badge">${inProgressCount}</span>
      </button>
      <button class="tab-btn" onclick="switchSupportTab(this, 'resolved')">
        Resolved <span class="tab-count-badge success">${resolvedCount}</span>
      </button>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table" id="supportTable">
          <thead>
            <tr>
              <th>#</th><th>Ticket ID</th><th>Customer</th><th>Linked Order</th>
              <th>Subject</th><th>Priority</th><th>Status</th><th>Created</th><th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="9" class="text-center py-4 text-muted">No support tickets found.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 3. ORDER LOOKUP — ONLY search and inspect order/customer information
// =========================================================================
function renderSupportLookupView() {
  const firstOrder = RMK_STORE.orders[0];

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-magnifying-glass me-2 text-primary"></i>Order Lookup</h1>
        <p class="page-subtitle">Search customer history, live order tracking, and timeline details</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-database"></i></div>
        </div>
        <div>
          <div class="kpi-value">${RMK_STORE.orders.length}</div>
          <div class="kpi-label">Orders in System</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-users"></i></div>
        </div>
        <div>
          <div class="kpi-value">${RMK_STORE.customers.length}</div>
          <div class="kpi-label">Registered Customers</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-search"></i></div>
        </div>
        <div>
          <div class="kpi-value">Instant</div>
          <div class="kpi-label">Search Speed</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-timeline"></i></div>
        </div>
        <div>
          <div class="kpi-value">Full</div>
          <div class="kpi-label">Timeline Access</div>
        </div>
      </div>
    </div>

    <div class="table-card p-4 mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-8">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-search text-muted"></i></span>
            <input type="text" id="lookupQuery" class="form-control border-start-0 ps-0" placeholder="Enter Order ID, Customer Name, or Phone..." value="ATD1001">
            <button class="btn btn-primary px-4" onclick="performCustomerLookup()">Search</button>
          </div>
        </div>
        <div class="col-md-4 text-md-end text-muted" style="font-size: 13px;">
          Quick: 
          ${RMK_STORE.orders.slice(0, 3).map(o =>
            `<a href="javascript:void(0)" onclick="setLookupQuery('${o.id}')" class="text-primary text-decoration-none me-2">${o.id}</a>`
          ).join('')}
        </div>
      </div>
    </div>

    <div id="lookupResultContainer">
      <div class="row g-4">
        <div class="col-md-6">
          <div class="table-card p-4">
            <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 class="fw-bold m-0"><i class="fa-solid fa-user me-2 text-primary"></i>Customer Profile</h5>
              <span class="badge bg-success-subtle text-success border border-success-subtle">${firstOrder ? (RMK_STORE.customers.find(c => c.id === firstOrder.customerId)?.status || 'Active') : 'Active'}</span>
            </div>
            <table class="table table-borderless align-middle mb-0">
              <tr><td class="text-muted" style="width: 130px;">Name:</td><td class="fw-semibold text-dark">${firstOrder ? firstOrder.customerName : '-'}</td></tr>
              <tr><td class="text-muted">Phone:</td><td class="fw-semibold text-dark">${firstOrder ? firstOrder.phone : '-'}</td></tr>
              <tr><td class="text-muted">City:</td><td class="fw-semibold text-dark">${firstOrder ? firstOrder.city + ', Tamil Nadu' : '-'}</td></tr>
              <tr><td class="text-muted">Address:</td><td>${firstOrder ? firstOrder.address : '-'}</td></tr>
            </table>
          </div>
        </div>
        <div class="col-md-6">
          <div class="table-card p-4">
            <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 class="fw-bold m-0"><i class="fa-solid fa-box-open me-2 text-primary"></i>Order #${firstOrder ? firstOrder.id : '-'} Status</h5>
              <span class="status-badge ${firstOrder ? firstOrder.status.toLowerCase().replace('_', '-') : 'confirmed'}">${firstOrder ? firstOrder.status : '-'}</span>
            </div>
            <div class="p-3 bg-light rounded-3 mb-3">
              <div class="fw-bold text-dark mb-1">${firstOrder && Array.isArray(firstOrder.items) ? firstOrder.items[0].name : '-'}</div>
              <div class="text-muted" style="font-size: 12px;">Payment: ${firstOrder ? firstOrder.paymentMethod : '-'} (${firstOrder ? firstOrder.paymentStatus : '-'}) | Courier: ${firstOrder ? firstOrder.courier : '-'}</div>
            </div>
            <button class="btn btn-outline-primary btn-sm w-100" onclick="openOrderModal('${firstOrder ? firstOrder.id : 'ATD1001'}')">
              <i class="fa-solid fa-timeline me-1"></i> View Full Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setLookupQuery(val) {
  document.getElementById('lookupQuery').value = val;
  performCustomerLookup();
}

function performCustomerLookup() {
  const query = document.getElementById('lookupQuery').value.trim();
  showToast(`Found records matching "${query || 'ATD1001'}" in central database`, 'success');
}

// =========================================================================
// 4. RETURNS & REFUNDS — ONLY return/refund cases from shared data
// =========================================================================
function renderSupportReturnsView() {
  const refunds = RMK_STORE.refunds;
  const pendingRefunds = refunds.filter(r => r.status === 'Pending');
  const completedRefunds = refunds.filter(r => r.status === 'Completed' || r.status === 'Processed');
  const totalRefundAmount = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  const rows = refunds.map((r, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><span class="fw-bold text-dark">#RET-${800 + idx + 1}</span></td>
      <td><span class="order-id-link" onclick="openOrderModal('${r.orderId}')">${r.orderId}</span></td>
      <td class="fw-semibold text-dark">${r.customerName}</td>
      <td>${r.reason || 'Defective / Not as described'}</td>
      <td><span class="badge bg-danger-subtle text-danger border">Refund</span></td>
      <td><span class="status-badge ${r.status === 'Completed' || r.status === 'Processed' ? 'resolved' : 'open'}">${r.status}</span></td>
      <td class="fw-bold text-dark">₹${(r.amount || 0).toLocaleString('en-IN')}</td>
      <td class="text-end">
        ${r.status === 'Pending' ? `
          <button class="btn btn-sm btn-success py-1 px-2" onclick="showToast('Return approved! Pickup initiated.', 'success')">
            <i class="fa-solid fa-check me-1"></i> Approve
          </button>
        ` : `
          <span class="badge bg-success-subtle text-success">Processed</span>
        `}
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-rotate-left me-2 text-primary"></i>Returns & Refunds</h1>
        <p class="page-subtitle">Return approvals, reverse pickup requests, and refund case management</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-rotate-left"></i></div>
        </div>
        <div>
          <div class="kpi-value">${refunds.length}</div>
          <div class="kpi-label">Return Requests</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${pendingRefunds.length}</div>
          <div class="kpi-label">Pending Approval</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${completedRefunds.length}</div>
          <div class="kpi-label">Processed</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalRefundAmount.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Refund Value</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th><th>Return ID</th><th>Order ID</th><th>Customer</th>
              <th>Reason</th><th>Type</th><th>Status</th><th>Amount</th><th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="9" class="text-center py-4 text-muted">No return requests found.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 5. CUSTOMER QUERIES — ONLY pre-sales inquiries and feedback
// =========================================================================
function renderSupportQueriesView() {
  const customers = RMK_STORE.customers;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-comments me-2 text-primary"></i>Customer Queries</h1>
        <p class="page-subtitle">Pre-sales inquiries, wholesale quotes, and customer feedback</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-comments"></i></div>
        </div>
        <div>
          <div class="kpi-value">3</div>
          <div class="kpi-label">Active Queries</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-reply"></i></div>
        </div>
        <div>
          <div class="kpi-value">2</div>
          <div class="kpi-label">Replied Today</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">1</div>
          <div class="kpi-label">Awaiting Response</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-store"></i></div>
        </div>
        <div>
          <div class="kpi-value">1</div>
          <div class="kpi-label">Wholesale Inquiries</div>
        </div>
      </div>
    </div>

    <div class="table-card p-4 mb-4">
      <h5 class="fw-bold text-dark border-bottom pb-2 mb-3">Customer Inquiries Log</h5>
      <div class="p-3 bg-light rounded-3 mb-3 border">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="fw-bold text-dark">Ramesh Boutique — Bulk Order Inquiry</div>
          <span class="badge bg-warning-subtle text-warning">Wholesale</span>
        </div>
        <div class="text-muted small mb-2">"Looking for 50 units of Banarasi Silk Sarees for Trichy wedding season."</div>
        <button class="btn btn-sm btn-primary" onclick="showToast('Wholesale catalog quote emailed!', 'success')">Send Quote</button>
      </div>
      <div class="p-3 bg-light rounded-3 mb-3 border">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="fw-bold text-dark">${customers[0]?.name || 'Customer'} — Product Availability</div>
          <span class="badge bg-primary-subtle text-primary">Pre-Sales</span>
        </div>
        <div class="text-muted small mb-2">"Is the Kanchipuram Royal Blue available in size M? Need for a wedding."</div>
        <button class="btn btn-sm btn-outline-primary" onclick="showToast('Reply sent to customer!', 'success')">Reply</button>
      </div>
      <div class="p-3 bg-light rounded-3 border">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="fw-bold text-dark">${customers[1]?.name || 'Customer'} — Feedback</div>
          <span class="badge bg-success-subtle text-success">Positive</span>
        </div>
        <div class="text-muted small mb-2">"Excellent quality saree! The silk texture is amazing. Will order more."</div>
        <span class="badge bg-light text-success border">★★★★★ 5/5</span>
      </div>
    </div>
  `;
}

// =========================================================================
// 6. LIVE CHAT — ONLY active chat sessions (NOT dashboard data)
// =========================================================================
function renderSupportChatView() {
  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-comment-dots me-2 text-primary"></i>Live Chat</h1>
        <p class="page-subtitle">Real-time chat sessions with active website shoppers</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle"></i></div>
        </div>
        <div>
          <div class="kpi-value">2</div>
          <div class="kpi-label">Active Sessions</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-hourglass-half"></i></div>
        </div>
        <div>
          <div class="kpi-value">1</div>
          <div class="kpi-label">Waiting in Queue</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-message"></i></div>
        </div>
        <div>
          <div class="kpi-value">14</div>
          <div class="kpi-label">Messages Today</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">< 30s</div>
          <div class="kpi-label">Avg First Reply</div>
        </div>
      </div>
    </div>

    <div class="card p-4 border-0 shadow-sm rounded-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="p-3 bg-light rounded-3 border mb-2">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="badge bg-success rounded-circle p-1">&nbsp;</span>
              <span class="fw-bold text-dark">Visitor #1 — Priya</span>
            </div>
            <div class="text-muted small">"Hi, I need help choosing a saree for my sister's wedding..."</div>
          </div>
          <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="badge bg-success rounded-circle p-1">&nbsp;</span>
              <span class="fw-bold text-dark">Visitor #2 — Kumar</span>
            </div>
            <div class="text-muted small">"What's the delivery timeline for Coimbatore?"</div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="border rounded-3 p-3" style="min-height: 200px; background: #f8f9fa;">
            <div class="text-center py-5">
              <i class="fa-solid fa-comments text-primary mb-3" style="font-size: 40px;"></i>
              <h5 class="fw-bold text-dark">Select a conversation</h5>
              <p class="text-muted small">Click on a visitor to start chatting</p>
              <button class="btn-primary-custom" onclick="showToast('Chat session connected with Visitor #1!', 'success')">Connect to Visitor #1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 7. KNOWLEDGE BASE — ONLY help articles and SOPs
// =========================================================================
function renderSupportKBView() {
  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-book-open me-2 text-primary"></i>Knowledge Base</h1>
        <p class="page-subtitle">Standard operating procedures, silk care guides, and support articles</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-book"></i></div>
        </div>
        <div>
          <div class="kpi-value">12</div>
          <div class="kpi-label">Total Articles</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-eye"></i></div>
        </div>
        <div>
          <div class="kpi-value">248</div>
          <div class="kpi-label">Views This Month</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-star"></i></div>
        </div>
        <div>
          <div class="kpi-value">4.7</div>
          <div class="kpi-label">Avg Helpfulness</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-folder"></i></div>
        </div>
        <div>
          <div class="kpi-value">4</div>
          <div class="kpi-label">Categories</div>
        </div>
      </div>
    </div>

    <div class="table-card p-4">
      <h5 class="fw-bold text-dark mb-3">Help Articles</h5>
      <div class="accordion" id="kbAccordion">
        <div class="accordion-item border-0 border-bottom">
          <h2 class="accordion-header">
            <button class="accordion-button fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#kb1">
              <span class="badge bg-primary-subtle text-primary me-2">Returns</span> What is the return window for pure silk sarees?
            </button>
          </h2>
          <div id="kb1" class="accordion-collapse collapse show">
            <div class="accordion-body text-muted small">
              Returns are accepted within 7 days of delivery with original Silk Mark tag intact. The saree must be unworn and in original packaging. COD refunds are processed within 5-7 business days.
            </div>
          </div>
        </div>
        <div class="accordion-item border-0 border-bottom">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#kb2">
              <span class="badge bg-success-subtle text-success me-2">Care</span> How to maintain pure silk sarees?
            </button>
          </h2>
          <div id="kb2" class="accordion-collapse collapse">
            <div class="accordion-body text-muted small">
              Dry clean only for the first wash. Store in cotton cloth away from direct sunlight. Use neem leaves to prevent moth damage. Air the saree every 2-3 months.
            </div>
          </div>
        </div>
        <div class="accordion-item border-0 border-bottom">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#kb3">
              <span class="badge bg-warning-subtle text-warning me-2">Shipping</span> Delivery timelines for different zones?
            </button>
          </h2>
          <div id="kb3" class="accordion-collapse collapse">
            <div class="accordion-body text-muted small">
              Tamil Nadu cities: 2-3 business days. Other South Indian states: 3-5 days. North India & metro cities: 5-7 days. Remote/rural areas: 7-10 days. Express shipping available for select pin codes.
            </div>
          </div>
        </div>
        <div class="accordion-item border-0">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#kb4">
              <span class="badge bg-info-subtle text-info me-2">Payments</span> Accepted payment methods?
            </button>
          </h2>
          <div id="kb4" class="accordion-collapse collapse">
            <div class="accordion-body text-muted small">
              UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, Wallets, and Cash on Delivery (COD) for orders up to ₹25,000.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function switchSupportTab(btn, tabType) {
  document.querySelectorAll('.custom-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Filtered tickets by status: ${tabType.toUpperCase()}`, 'info');
}

function createNewSupportTicket(event) {
  event.preventDefault();
  const customer = document.getElementById('ticketCustomerName')?.value || 'New Customer';
  const subject = document.getElementById('ticketSubject')?.value || 'General Query';
  const orderId = document.getElementById('ticketOrderId')?.value || '';

  RMK_STORE.createTicket({
    id: `TCK-${RMK_STORE.tickets.length + 201}`,
    customerId: 'CUS001',
    customerName: customer,
    orderId: orderId,
    subject: subject,
    category: 'General',
    priority: 'Medium',
    status: 'Open',
    date: '17 Sep 2026'
  });

  const modalEl = document.getElementById('newTicketModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}
