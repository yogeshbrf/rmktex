/**
 * PAGE 2 — ORDERS TO PACK MODULE
 */

function renderPackingView() {
  return `
    <!-- Page Header -->
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Orders to Pack</h1>
        <p class="page-subtitle">Pick items, pack and update status</p>
      </div>
      <div>
        <button class="btn-primary-custom" onclick="triggerPrintPackingSlip()">
          <i class="fa-solid fa-print"></i> Print Packing Slip
        </button>
      </div>
    </div>

    <!-- Tabs Header -->
    <div class="custom-tabs">
      <button class="tab-btn active" onclick="switchPackingTab(this, 'pending')">
        Pending Packing <span class="tab-count-badge danger">18</span>
      </button>
      <button class="tab-btn" onclick="switchPackingTab(this, 'packed')">
        Packed <span class="tab-count-badge">24</span>
      </button>
      <button class="tab-btn" onclick="switchPackingTab(this, 'all')">
        All Orders
      </button>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-responsive-custom">
        <table class="custom-table" id="packingTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr id="pack-row-1">
              <td>1</td>
              <td><span class="order-id-link" onclick="openOrderModal('ATD1001')">ATD1001</span></td>
              <td>Rahul S.</td>
              <td>3 items</td>
              <td><span class="status-badge paid">Paid</span></td>
              <td>17 Sep 2026</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn-primary-custom" onclick="packOrderAction('ATD1001', 'pack-row-1')">
                    <i class="fa-solid fa-box-open"></i> Pack Order
                  </button>
                  <button class="btn-action-icon" title="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
              </td>
            </tr>

            <tr id="pack-row-2">
              <td>2</td>
              <td><span class="order-id-link" onclick="openOrderModal('ATD1002')">ATD1002</span></td>
              <td>Priya M.</td>
              <td>2 items</td>
              <td><span class="status-badge cod">COD</span></td>
              <td>17 Sep 2026</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn-primary-custom" onclick="packOrderAction('ATD1002', 'pack-row-2')">
                    <i class="fa-solid fa-box-open"></i> Pack Order
                  </button>
                  <button class="btn-action-icon" title="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
              </td>
            </tr>

            <tr id="pack-row-3">
              <td>3</td>
              <td><span class="order-id-link" onclick="openOrderModal('ATD1003')">ATD1003</span></td>
              <td>Karthik V.</td>
              <td>1 item</td>
              <td><span class="status-badge paid">Paid</span></td>
              <td>17 Sep 2026</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn-primary-custom" onclick="packOrderAction('ATD1003', 'pack-row-3')">
                    <i class="fa-solid fa-box-open"></i> Pack Order
                  </button>
                  <button class="btn-action-icon" title="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
              </td>
            </tr>

            <tr id="pack-row-4">
              <td>4</td>
              <td><span class="order-id-link" onclick="openOrderModal('ATD1004')">ATD1004</span></td>
              <td>Sneha R.</td>
              <td>4 items</td>
              <td><span class="status-badge paid">Paid</span></td>
              <td>16 Sep 2026</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn-primary-custom" onclick="packOrderAction('ATD1004', 'pack-row-4')">
                    <i class="fa-solid fa-box-open"></i> Pack Order
                  </button>
                  <button class="btn-action-icon" title="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
              </td>
            </tr>

            <tr id="pack-row-5">
              <td>5</td>
              <td><span class="order-id-link" onclick="openOrderModal('ATD1005')">ATD1005</span></td>
              <td>Arun K.</td>
              <td>2 items</td>
              <td><span class="status-badge cod">COD</span></td>
              <td>16 Sep 2026</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn-primary-custom" onclick="packOrderAction('ATD1005', 'pack-row-5')">
                    <i class="fa-solid fa-box-open"></i> Pack Order
                  </button>
                  <button class="btn-action-icon" title="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function packOrderAction(orderId, rowId) {
  showToast(`Order ${orderId} marked as packed successfully!`, 'success');
  const row = document.getElementById(rowId);
  if (row) {
    const actionCell = row.cells[6];
    actionCell.innerHTML = `<span class="status-badge packed"><i class="fa-solid fa-circle-check"></i> Packed</span>`;
  }
}

function triggerPrintPackingSlip() {
  showToast('Generating packing slip PDF for selected orders...', 'info');
}

function switchPackingTab(btn, tabType) {
  document.querySelectorAll('.custom-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Filtered packing list by: ${tabType.toUpperCase()}`, 'info');
}
