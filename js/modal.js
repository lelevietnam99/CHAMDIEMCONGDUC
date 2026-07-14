import { $ } from './utils.js';

export function closeModal() {
  $('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

export function openModalShell() {
  $('modalBackdrop').querySelector('.modal-box')?.classList.add('modal-club');
  $('modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function bindModalEvents(onClose) {
  const close = onClose || closeModal;
  $('modalClose').onclick = close;
  $('modalBackdrop').addEventListener('click', e => {
    if (e.target === $('modalBackdrop')) close();
  });
}
