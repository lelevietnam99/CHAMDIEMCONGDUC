import { MESSAGES } from './constants.js';
import { state } from './state.js';
import { $, esc, fmtScore, getScoringMonthLabel, getScoringYear } from './utils.js';
import { openModalShell } from './modal.js';

export function scoreCell(value, extraClass) {
  const cls = extraClass ? ` col-score ${extraClass}` : ' col-score';
  return `<td class="${cls.trim()}">${fmtScore(value)}</td>`;
}

export function renderStudentTableRow(s) {
  const name = esc(s.fullName || '—');
  const phap = s.phapDanh ? `<div class="stu-phap">${esc(s.phapDanh)}</div>` : '';
  return `<tr>
      <td class="col-name">
        <div class="stu-name">${name}</div>
        ${phap}
      </td>
      ${scoreCell(s.chuyenCan)}
      ${scoreCell(s.phuTa)}
      ${scoreCell(s.congQua)}
      ${scoreCell(s.tuTap)}
      ${scoreCell(s.giaiThiDau, 'month-sep')}
      ${scoreCell(s.tongChuyenCanNam)}
      ${scoreCell(s.tongPhuTaNam)}
      ${scoreCell(s.tongCongQuaNam)}
      ${scoreCell(s.tongTuTapNam)}
      ${scoreCell(s.tongGiaiThiDauNam)}
      <td class="col-total"><span class="badge-tong">${fmtScore(s.tongDiem)}</span></td>
    </tr>`;
}

export function openClubModal(clubId) {
  const cid = String(clubId || '').trim();
  const st = state.clubStats[cid] || { name: MESSAGES.CLUB_UNKNOWN, total: 0, scored: 0, points: 0 };
  $('modalTitle').textContent = st.name;
  openModalShell();
  const students = state.allStudents
    .filter(s => (s.clubId || 'UNKNOWN').trim() === cid)
    .sort((a, b) => (Number(b.tongDiem) || 0) - (Number(a.tongDiem) || 0));
  const monthLabel = getScoringMonthLabel(state.scoringPeriod);
  const year = getScoringYear(state.scoringPeriod);
  const rows = students.map(renderStudentTableRow).join('');
  $('modalBody').innerHTML = `
      <div class="modal-stats">
        <div class="m-stat"><div class="v">${st.total}</div><div class="l">Sĩ số</div></div>
        <div class="m-stat"><div class="v" style="color:var(--success);">${st.scored}</div><div class="l">Đã chấm</div></div>
        <div class="m-stat"><div class="v" style="color:var(--primary);">${fmtScore(st.points)}</div><div class="l">Tổng điểm năm</div></div>
      </div>
      <div class="club-table-wrap">
        ${students.length ? `
        <table class="club-detail-table">
          <thead>
            <tr class="group-row">
              <th class="col-name" rowspan="2">Họ tên võ sinh</th>
              <th class="group-month" colspan="5">Công đức tháng ${esc(monthLabel)}</th>
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
        </table>` : `<div class="club-table-empty">${MESSAGES.NO_STUDENTS_TABLE}</div>`}
      </div>`;
}
