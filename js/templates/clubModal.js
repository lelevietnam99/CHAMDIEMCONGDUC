/* global PQQ */
(function (PQQ) {
  PQQ.getClubModalHtml = function () {
    return `
<div class="modal-backdrop" id="modalBackdrop">
  <div class="modal-box modal-club">
    <div class="modal-hd">
      <h3 id="modalTitle">Chi tiết CLB</h3>
      <button class="modal-close" id="modalClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body" id="modalBody">
      <div class="loader-wrap"><div class="spinner"></div><p>Đang tải…</p></div>
    </div>
  </div>
</div>`;
  };

  PQQ.injectClubModal = function () {
    if (document.getElementById('modalBackdrop')) return;
    const root = document.getElementById('modalRoot') || document.body;
    root.insertAdjacentHTML('beforeend', PQQ.getClubModalHtml());
  };
})(window.PQQ || (window.PQQ = {}));
