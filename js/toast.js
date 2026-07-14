/* global PQQ */
(function (PQQ) {
  PQQ.renderToast = function (type, msg) {
    const d = document.createElement('div');
    d.className = `toast ${type}`;
    d.innerHTML = `<i class="fas ${PQQ.TOAST_ICONS[type]}"></i> ${PQQ.esc(msg)}`;
    PQQ.$('toastStack').appendChild(d);
    setTimeout(() => d.remove(), 3600);
  };

  PQQ.toast = function (type, msg) {
    return PQQ.renderToast(type, msg);
  };
})(window.PQQ || (window.PQQ = {}));
