/**
 * FINANCE MODULE (#/finance/*)
 * Context-specific sub-views: each page shows ONLY data relevant to that page.
 * All data sourced from shared RMK_STORE (single source of truth).
 */

// =========================================================================
// 1. FINANCE DASHBOARD — Aggregated overview of ALL financial metrics
// =========================================================================
function renderFinanceView() {
  const orders = RMK_STORE.orders;
  const refunds = RMK_STORE.refunds;

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const onlinePayments = orders
    .filter(o => o.paymentMethod !== 'COD' && (o.paymentStatus === 'Paid' || o.status === 'DELIVERED'))
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const codCollected = orders
    .filter(o => o.paymentMethod === 'COD' && o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const refundTotal = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  const txnRows = orders.slice(0, 4).map((o, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${o.orderDate || '17 Sep 2026'}</td>
      <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td class="fw-bold">₹${(o.amount || 0).toLocaleString('en-IN')}</td>
      <td><span class="status-badge ${o.paymentMethod === 'COD' ? 'cod' : 'paid'}">${o.paymentMethod}</span></td>
      <td><span class="status-badge ${o.status.toLowerCase().replace('_', '-')}">${o.status}</span></td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-chart-pie me-2 text-primary"></i>Finance Dashboard</h1>
        <p class="page-subtitle">Revenue overview, payment gateway settlements, COD remittance, and refund payouts</p>
      </div>
      <div>
        <button class="btn-primary-custom" onclick="exportFinancialReport()">
          <i class="fa-solid fa-file-export me-1"></i> Export Report
        </button>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-indian-rupee-sign"></i></div>
          <span class="kpi-trend positive"><i class="fa-solid fa-arrow-up"></i> Live</span>
        </div>
        <div>
          <div class="kpi-value">₹${totalRevenue.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Revenue</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-credit-card"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${onlinePayments.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Online Payments</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-money-bill-wave"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${codCollected.toLocaleString('en-IN')}</div>
          <div class="kpi-label">COD Collected</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-rotate-left"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${refundTotal.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Refund Payouts</div>
        </div>
      </div>
    </div>

    <!-- Charts and Overview -->
    <div class="charts-grid mt-4">
      <div class="chart-card">
        <div class="card-header-flex mb-3">
          <h2 class="card-title">Payment Gateway Distribution</h2>
        </div>
        <div class="row align-items-center">
          <div class="col-6">
            <div style="height: 200px; position: relative;">
              <canvas id="paymentMethodsChart"></canvas>
            </div>
          </div>
          <div class="col-6">
            <ul class="legend-list">
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #1769E0;"></span>Razorpay UPI / Cards</span>
                <span class="legend-val">62%</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #F59E0B;"></span>COD Cash</span>
                <span class="legend-val">28%</span>
              </li>
              <li class="legend-item">
                <span class="legend-left"><span class="legend-color" style="background-color: #10B981;"></span>Net Banking</span>
                <span class="legend-val">10%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="table-card p-4">
        <div class="card-header-flex mb-3">
          <h2 class="card-title">Recent Transactions</h2>
          <a href="#/finance/transactions" class="text-decoration-none fw-semibold text-primary" style="font-size: 13px;">View Ledger</a>
        </div>
        <div class="table-responsive-custom">
          <table class="custom-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th></tr>
            </thead>
            <tbody>${txnRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 2. PAYMENTS — ONLY online gateway settlement batches
// =========================================================================
function renderFinancePaymentsView() {
  const onlineOrders = RMK_STORE.orders.filter(o => o.paymentMethod !== 'COD');
  const totalOnline = onlineOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const settledOrders = onlineOrders.filter(o => o.status === 'DELIVERED');
  const settledAmount = settledOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingAmount = totalOnline - settledAmount;
  const mdrFee = Math.round(totalOnline * 0.018);

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-credit-card me-2 text-primary"></i>Gateway Settlements</h1>
        <p class="page-subtitle">Razorpay & Cashfree daily batch settlements credited to HDFC Bank A/c</p>
      </div>
      <button class="btn btn-outline-primary" onclick="showToast('Syncing Razorpay Gateway Batches...', 'info')">
        <i class="fa-solid fa-rotate me-1"></i> Sync Batches
      </button>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-credit-card"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalOnline.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Online Collections</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${settledAmount.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Settled to Bank</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${pendingAmount.toLocaleString('en-IN')}</div>
          <div class="kpi-label">In Settlement Pipeline</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-percent"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${mdrFee.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Gateway MDR Fee (1.8%)</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>Settlement ID</th><th>Gateway</th><th>Transactions</th><th>Gross</th><th>Fees</th><th>Net Credited</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="fw-bold text-dark">#SETTL-9021</span></td>
              <td><span class="badge bg-primary">Razorpay UPI</span></td>
              <td>42 Orders</td>
              <td>₹98,400</td>
              <td>₹1,771</td>
              <td class="fw-bold text-success">₹96,629</td>
              <td><span class="status-badge resolved">Settled</span></td>
            </tr>
            <tr>
              <td><span class="fw-bold text-dark">#SETTL-9022</span></td>
              <td><span class="badge bg-dark text-white">Razorpay Cards</span></td>
              <td>18 Orders</td>
              <td>₹44,400</td>
              <td>₹799</td>
              <td class="fw-bold text-warning">₹43,601</td>
              <td><span class="status-badge open">Processing</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 3. COD RECONCILIATION — ONLY courier cash remittance
// =========================================================================
function renderFinanceCODView() {
  const codOrders = RMK_STORE.orders.filter(o => o.paymentMethod === 'COD');
  const codDelivered = codOrders.filter(o => o.status === 'DELIVERED');
  const codCollected = codDelivered.reduce((sum, o) => sum + (o.amount || 0), 0);
  const codPending = codOrders.filter(o => o.status !== 'DELIVERED').reduce((sum, o) => sum + (o.amount || 0), 0);

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-money-bill-wave me-2 text-primary"></i>COD Reconciliation</h1>
        <p class="page-subtitle">Courier partner cash collection and bank remittance tracking</p>
      </div>
      <button class="btn-primary-custom" onclick="showToast('COD reconciliation complete!', 'success')">
        <i class="fa-solid fa-check-double me-1"></i> Reconcile
      </button>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-money-bill"></i></div>
        </div>
        <div>
          <div class="kpi-value">${codOrders.length}</div>
          <div class="kpi-label">Total COD Orders</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${codCollected.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Cash Collected</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${codPending.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Pending Collection</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-handshake"></i></div>
        </div>
        <div>
          <div class="kpi-value">${codOrders.length > 0 ? Math.round((codDelivered.length / codOrders.length) * 100) : 0}%</div>
          <div class="kpi-label">Collection Rate</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>Courier</th><th>Deliveries</th><th>Cash Collected</th><th>Remitted</th><th>Pending</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><div class="fw-bold text-dark"><i class="fa-solid fa-truck text-primary me-2"></i>BlueDart Express</div></td>
              <td>${RMK_STORE.orders.filter(o => o.courier === 'BlueDart' && o.paymentMethod === 'COD').length} Orders</td>
              <td class="fw-semibold">₹1,12,000</td>
              <td class="fw-semibold text-success">₹1,12,000</td>
              <td>₹0</td>
              <td><span class="status-badge resolved">100% Matched</span></td>
            </tr>
            <tr>
              <td><div class="fw-bold text-dark"><i class="fa-solid fa-truck text-warning me-2"></i>Delhivery</div></td>
              <td>${RMK_STORE.orders.filter(o => o.courier === 'Delhivery' && o.paymentMethod === 'COD').length} Orders</td>
              <td class="fw-semibold">₹73,200</td>
              <td class="fw-semibold text-warning">₹50,000</td>
              <td class="fw-semibold text-danger">₹23,200</td>
              <td><span class="status-badge open">Partial</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. REFUNDS — ONLY customer refund payouts from shared refunds data
// =========================================================================
function renderFinanceRefundsView() {
  const refunds = RMK_STORE.refunds;
  const pendingRefunds = refunds.filter(r => r.status === 'Pending');
  const completedRefunds = refunds.filter(r => r.status === 'Completed' || r.status === 'Processed');
  const totalAmount = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const pendingAmount = pendingRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  const rows = refunds.map((r, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><span class="fw-bold text-dark">#${r.id}</span></td>
      <td><span class="order-id-link" onclick="openOrderModal('${r.orderId}')">${r.orderId}</span></td>
      <td>${r.customerName || r.customer}</td>
      <td class="fw-bold text-dark">₹${(r.amount || 0).toLocaleString('en-IN')}</td>
      <td><span class="badge bg-light text-dark border">${r.payMethod || 'UPI'}</span></td>
      <td><span class="status-badge ${r.status === 'Completed' || r.status === 'Processed' ? 'resolved' : 'open'}">${r.status}</span></td>
      <td class="text-muted">${r.date || '16 Sep'}</td>
      <td class="text-end">
        ${r.status !== 'Completed' && r.status !== 'Processed' ? `
          <button class="btn btn-sm btn-success py-1 px-3" onclick="RMK_STORE.processRefund('${r.id}')">
            <i class="fa-solid fa-paper-plane me-1"></i> Process
          </button>
        ` : `
          <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-solid fa-check"></i> Paid</span>
        `}
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-rotate-left me-2 text-primary"></i>Refund Payouts</h1>
        <p class="page-subtitle">Customer refund requests and payout processing queue</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-rotate-left"></i></div>
        </div>
        <div>
          <div class="kpi-value">${refunds.length}</div>
          <div class="kpi-label">Total Refunds</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-clock"></i></div>
        </div>
        <div>
          <div class="kpi-value">${pendingRefunds.length}</div>
          <div class="kpi-label">Pending Payout</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div>
          <div class="kpi-value">${completedRefunds.length}</div>
          <div class="kpi-label">Completed</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${pendingAmount.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Pending Amount</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>#</th><th>Refund ID</th><th>Order</th><th>Customer</th><th>Amount</th><th>Mode</th><th>Status</th><th>Date</th><th class="text-end">Action</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 5. TAX INVOICES — ONLY invoice generation and GST breakdown
// =========================================================================
function renderFinanceInvoicesView() {
  const orders = RMK_STORE.orders;
  const totalTaxable = orders.reduce((sum, o) => sum + Math.round((o.amount || 0) * 0.95), 0);
  const totalGST = orders.reduce((sum, o) => sum + Math.round((o.amount || 0) * 0.05), 0);
  const totalInvoiceValue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  let rows = orders.map((o, idx) => `
    <tr>
      <td><span class="fw-bold text-dark">INV/2026/90${idx+1}</span></td>
      <td>${o.orderDate || '17 Sep 2026'}</td>
      <td><span class="order-id-link" onclick="openOrderModal('${o.id}')">${o.id}</span></td>
      <td>${o.customerName || o.customer}</td>
      <td>₹${Math.round((o.amount || 0) * 0.95).toLocaleString('en-IN')}</td>
      <td>₹${Math.round((o.amount || 0) * 0.05).toLocaleString('en-IN')} (5%)</td>
      <td class="fw-bold">₹${(o.amount || 0).toLocaleString('en-IN')}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick="showToast('Downloading Tax Invoice PDF...', 'success')">
          <i class="fa-solid fa-file-pdf me-1"></i> PDF
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-file-invoice-dollar me-2 text-primary"></i>Tax Invoices</h1>
        <p class="page-subtitle">B2C and B2B tax invoices with 5% GST breakdown</p>
      </div>
      <button class="btn-primary-custom" onclick="showToast('Exporting GSTR-1 Filing File...', 'info')">
        <i class="fa-solid fa-download me-1"></i> Export GSTR-1
      </button>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-file-invoice"></i></div>
        </div>
        <div>
          <div class="kpi-value">${orders.length}</div>
          <div class="kpi-label">Total Invoices</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalTaxable.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Taxable Value</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-percent"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalGST.toLocaleString('en-IN')}</div>
          <div class="kpi-label">GST Collected (5%)</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-calculator"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalInvoiceValue.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Invoice Value</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>Invoice No</th><th>Date</th><th>Order</th><th>Customer</th><th>Taxable</th><th>GST</th><th>Total</th><th class="text-end">Download</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 6. TRANSACTIONS LEDGER — ONLY accounting entries and audit trail
// =========================================================================
function renderFinanceTransactionsView() {
  const orders = RMK_STORE.orders;
  const totalCredits = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const refundDebits = RMK_STORE.refunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  let rows = orders.map((o, idx) => `
    <tr>
      <td>#TXN-880${idx+1}</td>
      <td>${o.orderDate || '17 Sep 16:30'}</td>
      <td><span class="badge bg-light text-dark">4001 - Sales Income</span></td>
      <td>Order #${o.id} via ${o.paymentMethod}</td>
      <td>-</td>
      <td class="text-primary fw-bold">₹${(o.amount || 0).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  // Add refund debit entries
  const refundRows = RMK_STORE.refunds.map((r, idx) => `
    <tr>
      <td>#TXN-890${idx+1}</td>
      <td>${r.date || '16 Sep'}</td>
      <td><span class="badge bg-danger-subtle text-danger">5001 - Refund Expense</span></td>
      <td>Refund #${r.id} for ${r.orderId}</td>
      <td class="text-danger fw-bold">₹${(r.amount || 0).toLocaleString('en-IN')}</td>
      <td>-</td>
    </tr>
  `).join('');

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-list-check me-2 text-primary"></i>Financial Ledger</h1>
        <p class="page-subtitle">Double-entry accounting transaction records and audit trail</p>
      </div>
      <button class="btn btn-outline-primary" onclick="showToast('Exported Ledger CSV', 'info')">
        <i class="fa-solid fa-file-csv me-1"></i> Export CSV
      </button>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-list"></i></div>
        </div>
        <div>
          <div class="kpi-value">${orders.length + RMK_STORE.refunds.length}</div>
          <div class="kpi-label">Total Entries</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-arrow-down"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalCredits.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Credits</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-arrow-up"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${refundDebits.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Total Debits</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-scale-balanced"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${(totalCredits - refundDebits).toLocaleString('en-IN')}</div>
          <div class="kpi-label">Net Balance</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table">
          <thead>
            <tr><th>Txn ID</th><th>Timestamp</th><th>Account</th><th>Description</th><th>Debit (Dr)</th><th>Credit (Cr)</th></tr>
          </thead>
          <tbody>${rows}${refundRows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// =========================================================================
// 7. FINANCIAL REPORTS — ONLY P&L statement and GST tax liability
// =========================================================================
function renderFinanceReportsView() {
  const orders = RMK_STORE.orders;
  const totalRev = orders.filter(o => o.paymentStatus === 'Paid' || o.status === 'DELIVERED').reduce((sum, o) => sum + (o.amount || 0), 0);
  const refundTotal = RMK_STORE.refunds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const netIncome = totalRev - refundTotal;

  return `
    <div class="page-header-row mb-4">
      <div>
        <h1 class="page-title"><i class="fa-solid fa-chart-column me-2 text-primary"></i>Financial Reports</h1>
        <p class="page-subtitle">Profit & Loss statement and GST tax liability calculation</p>
      </div>
    </div>

    <div class="kpi-grid mb-4">
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box green"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${totalRev.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Gross Revenue</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box red"><i class="fa-solid fa-rotate-left"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${refundTotal.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Returns & Refunds</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box blue"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${netIncome.toLocaleString('en-IN')}</div>
          <div class="kpi-label">Net Income</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box orange"><i class="fa-solid fa-percent"></i></div>
        </div>
        <div>
          <div class="kpi-value">₹${Math.round(totalRev * 0.05).toLocaleString('en-IN')}</div>
          <div class="kpi-label">GST Liability (5%)</div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">P&L Summary (September 2026)</h5>
          <table class="table table-borderless align-middle">
            <tr>
              <td class="fw-bold">Gross Sales Revenue:</td>
              <td class="text-end fw-bold text-success fs-5">₹${totalRev.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td class="ps-3 text-muted">Less: Returns & Refunds</td>
              <td class="text-end text-danger">- ₹${refundTotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="border-top">
              <td class="fw-bold text-primary fs-5">Net Operating Income:</td>
              <td class="text-end fw-bold text-primary fs-5">₹${netIncome.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="col-md-6">
        <div class="table-card p-4">
          <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">GST Tax Liability</h5>
          <div class="p-3 bg-light rounded-3 mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold text-dark">Output GST Collected (5%)</div>
                <div class="text-muted small">Apparel GST Rate</div>
              </div>
              <div class="fs-4 fw-bold text-dark">₹${Math.round(totalRev * 0.05).toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold text-dark">GSTIN</div>
                <div class="text-muted small">Registration Number</div>
              </div>
              <div class="fw-bold text-dark">${RMK_STORE.settings.taxGstin || '33AAAAA0000A1Z5'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function exportFinancialReport() {
  showToast('Generating RMK Textiles Monthly Financial Report...', 'success');
}

function initFinanceCharts() {
  const ctx = document.getElementById('paymentMethodsChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Razorpay (UPI/Card)', 'COD Cash', 'Net Banking'],
        datasets: [{
          data: [62, 28, 10],
          backgroundColor: ['#1769E0', '#F59E0B', '#10B981'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: { legend: { display: false } }
      }
    });
  }
}
