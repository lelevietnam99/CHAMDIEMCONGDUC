/* global PQQ */
(function (PQQ) {
  PQQ.closeModal = function () {
    PQQ.$('modalBackdrop').classList.remove('open');
    document.body.style.overflow = '';
  };

  PQQ.openModalShell = function () {
    PQQ.$('modalBackdrop').querySelector('.modal-box')?.classList.add('modal-club');
    PQQ.$('modalBackdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  PQQ.bindModalEvents = function (onClose) {
    const close = onClose || PQQ.closeModal;
    PQQ.$('modalClose').onclick = close;
    PQQ.$('modalBackdrop').addEventListener('click', e => {
      if (e.target === PQQ.$('modalBackdrop')) close();
    });
  };
})(window.PQQ || (window.PQQ = {}));
