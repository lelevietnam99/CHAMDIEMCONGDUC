import { state } from './state.js';
import { $ } from './utils.js';
import { injectClubModal } from './templates/clubModal.js';
import { injectDashboard } from './templates/dashboard.js';
import { injectScoring } from './templates/scoring.js';
import { bindModalEvents, closeModal } from './modal.js';
import { initDashboard } from './dashboard.js';
import { initScoring, handleBatchSubmit } from './scoring.js';

export function route() {
  const params = new URLSearchParams(window.location.search);
  const clbParam = params.get('clb');
  if (clbParam) {
    state.mode = 'scoring';
    state.clbParam = clbParam.trim();
    $('admin-dashboard').style.display = 'none';
    $('chamdiem-section').style.display = 'block';
    $('modeBadge').innerHTML = `<i class="fas fa-pen-to-square"></i> Chấm Điểm`;
    initScoring();
  } else {
    state.mode = 'dashboard';
    $('chamdiem-section').style.display = 'none';
    $('admin-dashboard').style.display = 'block';
    $('modeBadge').innerHTML = `<i class="fas fa-chart-bar"></i> Admin Dashboard`;
    initDashboard();
  }
}

export function handleCloseModal() {
  closeModal();
}

export function init() {
  injectClubModal();
  injectDashboard();
  injectScoring();
  bindModalEvents(handleCloseModal);
  $('btnBatchSubmit').addEventListener('click', handleBatchSubmit);
  route();
}

document.addEventListener('DOMContentLoaded', init);
