export function getScoringHtml() {
  return `
<div id="chamdiem-section" style="display:none;">
  <div class="scoring-month-banner" id="scoringMonthBanner">
    <div class="banner-inner">
      <i class="fas fa-calendar-days"></i>
      <span id="scoringMonthLabel">Đang chấm công đức…</span>
      <span class="banner-meta" id="scoringLastUpdated">Cập nhật gần nhất: —</span>
    </div>
  </div>

  <div class="stat-row stat-row-3">
    <div class="stat-chip blue">
      <div class="icon" style="color:var(--primary)"><i class="fas fa-users"></i></div>
      <div><div class="val" id="cd-total">—</div><div class="lbl">Sĩ số CLB</div></div>
    </div>
    <div class="stat-chip green">
      <div class="icon" style="color:var(--success)"><i class="fas fa-check-circle"></i></div>
      <div><div class="val" id="cd-scored">0</div><div class="lbl">Đã chấm điểm</div></div>
    </div>
    <div class="stat-chip orange">
      <div class="icon" style="color:var(--warning)"><i class="fas fa-paper-plane"></i></div>
      <div><div class="val" id="cd-pending">0</div><div class="lbl">Chưa gửi điểm</div></div>
    </div>
  </div>

  <div class="page">
    <div class="score-section-hd">
      <div class="search-wrap search-wrap-lg">
        <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
        <input type="text" id="cdSearch" placeholder="Tìm kiếm võ sinh theo họ tên…" aria-label="Tìm kiếm võ sinh">
      </div>
    </div>

    <div class="card rubric-card" id="rubricCard">
      <button type="button" class="rubric-toggle" id="rubricToggle" aria-expanded="false" aria-controls="rubricBody">
        <span class="rubric-toggle-title">
          <i class="fas fa-info-circle" aria-hidden="true"></i>
          Hướng dẫn chấm điểm
        </span>
        <span class="rubric-toggle-action">
          <span id="rubricToggleText">Xem thêm</span>
          <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </span>
      </button>
      <div class="rubric-body" id="rubricBody"></div>
    </div>

    <div class="card">
      <div class="tbl-scroll">
        <table id="cdTable">
          <thead>
            <tr>
              <th class="left col-name">Họ &amp; Tên</th>
              <th class="col-score" title="Chuyên cần — thang 10">Chuyên Cần</th>
              <th class="col-score" title="Phụ tá — thang 10">Phụ Tá</th>
              <th class="col-score" title="Công quả — thang 10">Công Quả</th>
              <th class="col-score" title="Tu tập — thang 10">Tu Tập</th>
              <th class="col-score" title="Thi đấu — thang 10">Thi Đấu</th>
              <th class="col-total">Tổng</th>
              <th class="left col-note">Ghi chú</th>
              <th class="col-updated">Cập nhật</th>
            </tr>
          </thead>
          <tbody id="cdTableBody">
            <tr><td colspan="9"><div class="loader-wrap"><div class="spinner"></div><p>Đang tải danh sách…</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="submit-bar" id="submitBar">
    <div class="submit-inner">
      <div class="submit-hint" id="submitHint">Chưa có thay đổi để gửi.</div>
      <button type="button" class="btn btn-primary" id="btnBatchSubmit" disabled>
        <i class="fas fa-paper-plane"></i> <span id="btnBatchSubmitText">Gửi điểm tháng</span>
      </button>
    </div>
  </div>
</div>`;
}

export function injectScoring() {
  if (document.getElementById('chamdiem-section')) return;
  const root = document.getElementById('mainContainer') || document.body;
  root.insertAdjacentHTML('beforeend', getScoringHtml());
}
