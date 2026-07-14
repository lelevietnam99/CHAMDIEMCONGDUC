import { state } from './state.js';
import { $, toSearchStr } from './utils.js';

export function initDashSearch() {
  if (state.dashSearchBound) return;
  state.dashSearchBound = true;
  $('dashSearch').addEventListener('input', handleDashSearchInput);
}

export function handleDashSearchInput() {
  const q = toSearchStr(this.value);
  const rows = $('dashTableBody').querySelectorAll('tr[data-club-name]');
  let visIdx = 1;
  rows.forEach(tr => {
    const show = !q || tr.dataset.clubName.includes(q);
    tr.classList.toggle('hidden', !show);
    if (show) tr.cells[0].textContent = visIdx++;
  });
}

export function initScoringSearch() {
  if (state.scoringSearchBound) return;
  state.scoringSearchBound = true;
  $('cdSearch').addEventListener('input', handleScoringSearchInput);
}

export function handleScoringSearchInput() {
  const q = toSearchStr(this.value);
  const rows = $('cdTableBody').querySelectorAll('tr[data-student-id]');
  rows.forEach(tr => {
    const show = !q || tr.dataset.searchName.includes(q);
    tr.classList.toggle('hidden', !show);
  });
}
