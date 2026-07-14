import { TOAST_ICONS } from './constants.js';
import { $, esc } from './utils.js';

export function toast(type, msg) {
  return renderToast(type, msg);
}

export function renderToast(type, msg) {
  const d = document.createElement('div');
  d.className = `toast ${type}`;
  d.innerHTML = `<i class="fas ${TOAST_ICONS[type]}"></i> ${esc(msg)}`;
  $('toastStack').appendChild(d);
  setTimeout(() => d.remove(), 3600);
}
