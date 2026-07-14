/* global PQQ */
(function (PQQ) {
  PQQ.route = function () {
    const params = new URLSearchParams(window.location.search);
    const clbParam = params.get('clb');
    if (clbParam) {
      PQQ.state.mode = 'scoring';
      PQQ.state.clbParam = clbParam.trim();
      PQQ.$('admin-dashboard').style.display = 'none';
      PQQ.$('chamdiem-section').style.display = 'block';
      PQQ.$('modeBadge').innerHTML = `<i class="fas fa-pen-to-square"></i> Chấm Điểm`;
      PQQ.initScoring();
    } else {
      PQQ.state.mode = 'dashboard';
      PQQ.$('chamdiem-section').style.display = 'none';
      PQQ.$('admin-dashboard').style.display = 'block';
      PQQ.$('modeBadge').innerHTML = `<i class="fas fa-chart-bar"></i> Admin Dashboard`;
      PQQ.initDashboard();
    }
  };

  PQQ.handleCloseModal = function () {
    PQQ.closeModal();
  };

  PQQ.init = function () {
    PQQ.injectClubModal();
    PQQ.injectDashboard();
    PQQ.injectScoring();
    PQQ.bindModalEvents(PQQ.handleCloseModal);
    PQQ.$('btnBatchSubmit').addEventListener('click', PQQ.handleBatchSubmit);
    PQQ.route();
  };

  document.addEventListener('DOMContentLoaded', PQQ.init);
})(window.PQQ || (window.PQQ = {}));
