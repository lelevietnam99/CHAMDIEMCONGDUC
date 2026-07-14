import { MESSAGES } from './constants.js';
import { state } from './state.js';
import { getChamCongDuc } from './api.js';
import { toast } from './toast.js';
import { renderCharts } from './chart.js';
import { openClubModal } from './club.js';
import { initDashSearch } from './search.js';
import {
  $,
  esc,
  toSearchStr,
  filterValidStudents,
  getScoringYear
} from './utils.js';

export function buildClubStats(students) {
  const stats = {};
  students.forEach(s => {
    const cid = (s.clubId || 'UNKNOWN').trim();
    const cname = (s.clubName || MESSAGES.CLUB_UNASSIGNED).trim();
    if (!stats[cid]) stats[cid] = { id: cid, name: cname, total: 0, scored: 0, points: 0 };
    stats[cid].total++;
    if (Number(s.tongDiem) > 0) stats[cid].scored++;
    stats[cid].points += Number(s.tongDiem) || 0;
  });
  state.clubStats = stats;
}

export function renderDashTable() {
  const tbody = $('dashTableBody');
  tbody.innerHTML = '';
  const clubs = Object.values(state.clubStats).sort((a, b) => a.name.localeCompare(b.name));
  clubs.forEach((st, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.clubName = toSearchStr(st.name);
    tr.innerHTML = `
        <td class="left text-muted" style="font-size:.78rem;font-weight:600;">${idx + 1}</td>
        <td class="left" style="font-weight:600;font-size:.88rem;">${esc(st.name)}</td>
        <td class="font-mono">${st.total}</td>
        <td class="font-mono" style="color:var(--success);font-weight:600;">${st.scored}</td>
        <td class="font-mono" style="color:var(--primary);font-weight:800;">${st.points.toLocaleString('vi-VN')}</td>
        <td>
          <button class="btn-detail" data-cid="${esc(st.id)}"><i class="fas fa-eye"></i> Xem</button>
        </td>`;
    tbody.appendChild(tr);
  });
  if (!tbody.dataset.boundClick) {
    tbody.dataset.boundClick = '1';
    tbody.addEventListener('click', handleDashTableClick);
  }
}

export function handleDashTableClick(e) {
  const btn = e.target.closest('button.btn-detail');
  if (!btn) return;
  openClubModal(btn.dataset.cid);
}

export async function initDashboard() {
  try {
    const json = await getChamCongDuc();
    state.allStudents = filterValidStudents(json.data);
    state.scoringPeriod = state.allStudents[0]?.scoringPeriod || null;
    $('headerSub').textContent = `Thống kê Công Đức — Năm ${getScoringYear(state.scoringPeriod)}`;
    buildClubStats(state.allStudents);
    renderDashTable();
    renderCharts();
    initDashSearch();
  } catch (err) {
    $('dashTableBody').innerHTML = `<tr><td colspan="6" style="padding:30px;text-align:center;color:var(--danger);"><i class="fas fa-circle-exclamation"></i> ${esc(err.message)}</td></tr>`;
    toast('err', err.message);
  }
}
