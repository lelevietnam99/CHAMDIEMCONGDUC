/* global PQQ */
(function (PQQ) {
  PQQ.scoreCell = function (value, extraClass) {
    const cls = extraClass ? ` col-score ${extraClass}` : ' col-score';
    return `<td class="${cls.trim()}">${PQQ.fmtScore(value)}</td>`;
  };

  PQQ.renderStudentTableRow = function (s) {
    const name = PQQ.esc(s.fullName || '—');
    const phap = s.phapDanh ? `<div class="stu-phap">${PQQ.esc(s.phapDanh)}</div>` : '';
    return `<tr>
      <td class="col-name">
        <div class="stu-name">${name}</div>
        ${phap}
      </td>
      ${PQQ.scoreCell(s.chuyenCan)}
      ${PQQ.scoreCell(s.phuTa)}
      ${PQQ.scoreCell(s.congQua)}
      ${PQQ.scoreCell(s.tuTap)}
      ${PQQ.scoreCell(s.giaiThiDau, 'month-sep')}
      ${PQQ.scoreCell(s.tongChuyenCanNam)}
      ${PQQ.scoreCell(s.tongPhuTaNam)}
      ${PQQ.scoreCell(s.tongCongQuaNam)}
      ${PQQ.scoreCell(s.tongTuTapNam)}
      ${PQQ.scoreCell(s.tongGiaiThiDauNam)}
      <td class="col-total"><span class="badge-tong">${PQQ.fmtScore(s.tongDiem)}</span></td>
    </tr>`;
  };

  PQQ.openClubModal = function (clubId) {
    const cid = String(clubId || '').trim();
    const st = PQQ.state.clubStats[cid] || { name: PQQ.MESSAGES.CLUB_UNKNOWN, total: 0, scored: 0, points: 0 };
    PQQ.$('modalTitle').textContent = st.name;
    PQQ.openModalShell();
    const students = PQQ.state.allStudents
      .filter(s => (s.clubId || 'UNKNOWN').trim() === cid)
      .sort((a, b) => (Number(b.tongDiem) || 0) - (Number(a.tongDiem) || 0));
    const monthLabel = PQQ.getScoringMonthLabel(PQQ.state.scoringPeriod);
    const year = PQQ.getScoringYear(PQQ.state.scoringPeriod);
    const rows = students.map(PQQ.renderStudentTableRow).join('');
    PQQ.$('modalBody').innerHTML = `
      <div class="modal-stats">
        <div class="m-stat"><div class="v">${st.total}</div><div class="l">Sĩ số</div></div>
        <div class="m-stat"><div class="v" style="color:var(--success);">${st.scored}</div><div class="l">Đã chấm</div></div>
        <div class="m-stat"><div class="v" style="color:var(--primary);">${PQQ.fmtScore(st.points)}</div><div class="l">Tổng điểm năm</div></div>
      </div>
      <div class="club-table-wrap">
        ${students.length ? `
        <table class="club-detail-table">
          <thead>
            <tr class="group-row">
              <th class="col-name" rowspan="2">Họ tên võ sinh</th>
              <th class="group-month" colspan="5">Công đức tháng ${PQQ.esc(monthLabel)}</th>
              <th class="group-year" colspan="6">Thống kê năm ${year}</th>
            </tr>
            <tr class="subhead-row">
              <th class="th-month">Chuyên cần</th>
              <th class="th-month">Phụ tá</th>
              <th class="th-month">Công quả</th>
              <th class="th-month">Tu tập</th>
              <th class="th-month month-sep">Thi đấu</th>
              <th class="th-year">Tổng C.Cần</th>
              <th class="th-year">Tổng Phụ tá</th>
              <th class="th-year">Tổng C.Quả</th>
              <th class="th-year">Tổng Tu tập</th>
              <th class="th-year">Tổng Thi đấu</th>
              <th class="col-total">Tổng Công đức</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>` : `<div class="club-table-empty">${PQQ.MESSAGES.NO_STUDENTS_TABLE}</div>`}
      </div>`;
  };
})(window.PQQ || (window.PQQ = {}));
