/* global PQQ */
(function (PQQ) {
  PQQ.handleDashSearchInput = function () {
    const q = PQQ.toSearchStr(this.value);
    const rows = PQQ.$('dashTableBody').querySelectorAll('tr[data-club-name]');
    let visIdx = 1;
    rows.forEach(tr => {
      const show = !q || tr.dataset.clubName.includes(q);
      tr.classList.toggle('hidden', !show);
      if (show) tr.cells[0].textContent = visIdx++;
    });
  };

  PQQ.initDashSearch = function () {
    if (PQQ.state.dashSearchBound) return;
    PQQ.state.dashSearchBound = true;
    PQQ.$('dashSearch').addEventListener('input', PQQ.handleDashSearchInput);
  };

  PQQ.handleScoringSearchInput = function () {
    const q = PQQ.toSearchStr(this.value);
    const rows = PQQ.$('cdTableBody').querySelectorAll('tr[data-student-id]');
    rows.forEach(tr => {
      const show = !q || tr.dataset.searchName.includes(q);
      tr.classList.toggle('hidden', !show);
    });
  };

  PQQ.initScoringSearch = function () {
    if (PQQ.state.scoringSearchBound) return;
    PQQ.state.scoringSearchBound = true;
    PQQ.$('cdSearch').addEventListener('input', PQQ.handleScoringSearchInput);
  };
})(window.PQQ || (window.PQQ = {}));
