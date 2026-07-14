export function getDashboardHtml() {
  return `
<div id="admin-dashboard" style="display:none;">
  <div class="page" style="margin-top:20px;">
    <div class="card dash-overview">
      <div class="dash-overview-kpi">
        <div class="kpi-label" id="dashYearLabel">Tổng Công Đức năm</div>
        <div class="kpi-value" id="dashTotalMerit">—</div>
        <div class="kpi-meta">
          <span id="dashMetaClubs">— CLB</span>
          <span id="dashMetaStudents">— võ sinh</span>
        </div>
      </div>
      <div class="dash-overview-chart">
        <canvas id="overviewChart"></canvas>
      </div>
    </div>

    <div class="dash-grid">
      <div class="card">
        <div class="card-header">
          <span>Top 10 CLB — Tổng Công Đức năm</span>
        </div>
        <div class="chart-wrap"><canvas id="topChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <span>Top 10 Võ sinh — Tổng Công Đức năm</span>
        </div>
        <div class="chart-wrap"><canvas id="topStudentsChart"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span>Danh sách Câu lạc bộ</span>
        <div class="search-wrap">
          <i class="fas fa-magnifying-glass"></i>
          <input type="text" id="dashSearch" placeholder="Tìm tên CLB…">
        </div>
      </div>
      <div class="tbl-scroll">
        <table id="dashTable">
          <thead>
            <tr>
              <th class="left" style="width:32px;">#</th>
              <th class="left">Tên Câu lạc bộ</th>
              <th style="width:90px;">Sĩ số</th>
              <th style="width:120px;">Đã chấm điểm</th>
              <th style="width:100px;">Tổng điểm</th>
              <th style="width:100px;">Thao tác</th>
            </tr>
          </thead>
          <tbody id="dashTableBody">
            <tr><td colspan="6"><div class="loader-wrap"><div class="spinner"></div><p>Đang tải dữ liệu…</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>`;
}

export function injectDashboard() {
  if (document.getElementById('admin-dashboard')) return;
  const root = document.getElementById('mainContainer') || document.body;
  root.insertAdjacentHTML('beforeend', getDashboardHtml());
}
