/* global PQQ */
(function (PQQ) {
  PQQ.buildClubStats = function (students) {
    const stats = {};
    students.forEach(s => {
      const cid = (s.clubId || 'UNKNOWN').trim();
      const cname = (s.clubName || PQQ.MESSAGES.CLUB_UNASSIGNED).trim();
      if (!stats[cid]) stats[cid] = { id: cid, name: cname, total: 0, scored: 0, points: 0 };
      stats[cid].total++;
      if (Number(s.tongDiem) > 0) stats[cid].scored++;
      stats[cid].points += Number(s.tongDiem) || 0;
    });
    PQQ.state.clubStats = stats;
  };

  PQQ.handleDashTableClick = function (e) {
    const btn = e.target.closest('button.btn-detail');
    if (!btn) return;
    PQQ.openClubModal(btn.dataset.cid);
  };

  PQQ.renderDashTable = function () {
    const tbody = PQQ.$('dashTableBody');
    tbody.innerHTML = '';
    const clubs = Object.values(PQQ.state.clubStats).sort((a, b) => a.name.localeCompare(b.name));
    clubs.forEach((st, idx) => {
      const tr = document.createElement('tr');
      tr.dataset.clubName = PQQ.toSearchStr(st.name);
      tr.innerHTML = `
        <td class="left text-muted" style="font-size:.78rem;font-weight:600;">${idx + 1}</td>
        <td class="left" style="font-weight:600;font-size:.88rem;">${PQQ.esc(st.name)}</td>
        <td class="font-mono">${st.total}</td>
        <td class="font-mono" style="color:var(--success);font-weight:600;">${st.scored}</td>
        <td class="font-mono" style="color:var(--primary);font-weight:800;">${st.points.toLocaleString('vi-VN')}</td>
        <td>
          <button class="btn-detail" data-cid="${PQQ.esc(st.id)}"><i class="fas fa-eye"></i> Xem</button>
        </td>`;
      tbody.appendChild(tr);
    });
    if (!tbody.dataset.boundClick) {
      tbody.dataset.boundClick = '1';
      tbody.addEventListener('click', PQQ.handleDashTableClick);
    }
  };

  PQQ.initDashboard = async function () {
    try {
      const json = await PQQ.getChamCongDuc();
      PQQ.state.allStudents = PQQ.filterValidStudents(json.data);
      PQQ.state.scoringPeriod = PQQ.state.allStudents[0]?.scoringPeriod || null;
      PQQ.$('headerSub').textContent = `Thống kê Công Đức — Năm ${PQQ.getScoringYear(PQQ.state.scoringPeriod)}`;
      PQQ.buildClubStats(PQQ.state.allStudents);
      PQQ.renderDashTable();
      PQQ.renderCharts();
      PQQ.initDashSearch();
    } catch (err) {
      PQQ.$('dashTableBody').innerHTML = `<tr><td colspan="6" style="padding:30px;text-align:center;color:var(--danger);"><i class="fas fa-circle-exclamation"></i> ${PQQ.esc(err.message)}</td></tr>`;
      PQQ.toast('err', err.message);
    }
  };
})(window.PQQ || (window.PQQ = {}));
