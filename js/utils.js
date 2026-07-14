/* global PQQ */
(function (PQQ) {
  PQQ.$ = function (id) {
    return document.getElementById(id);
  };

  PQQ.esc = function (s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  PQQ.toSearchStr = function (str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase();
  };

  PQQ.clampScore = function (v) {
    const n = parseInt(v, 10);
    if (isNaN(n) || n < 0) return 0;
    return Math.min(PQQ.SCORE_MAX, n);
  };

  PQQ.scoreBarLevel = function (v) {
    if (v >= PQQ.SCORE_BAR_THRESHOLDS.high) return 'high';
    if (v >= PQQ.SCORE_BAR_THRESHOLDS.mid) return 'mid';
    return 'low';
  };

  PQQ.formatTotal = function (sum) {
    return `<span class="total-num">${sum}</span>`;
  };

  PQQ.fmtScore = function (n) {
    return (Number(n) || 0).toLocaleString('vi-VN');
  };

  PQQ.padDatePart = function (n) {
    return String(n).padStart(2, '0');
  };

  PQQ.normalizeDisplayDate = function (dateStr) {
    const m = String(dateStr || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return String(dateStr || '').trim();
    return `${PQQ.padDatePart(m[1])}/${PQQ.padDatePart(m[2])}/${m[3]}`;
  };

  /** Chuẩn hóa ngày cập nhật từ API (HH:mm - dd/MM/yyyy) sang hiển thị gọn. */
  PQQ.formatUpdatedDisplay = function (raw) {
    const s = String(raw || '').trim();
    if (!s) {
      return { html: '—', title: PQQ.MESSAGES.NOT_UPDATED, empty: true };
    }
    let date = '';
    let time = '';
    let m = s.match(/^(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{4})$/);
    if (m) {
      time = m[1];
      date = PQQ.normalizeDisplayDate(m[2]);
    } else {
      m = s.match(/^(\d{1,2}\/\d{1,2}\/\d{4})(?:[ T]+(\d{1,2}:\d{2}))?/);
      if (m) {
        date = PQQ.normalizeDisplayDate(m[1]);
        time = m[2] || '';
      }
    }
    if (!date) {
      return { html: PQQ.esc(s), title: s, empty: false };
    }
    const title = time ? `${date} ${time}` : date;
    const html = time
      ? `<span class="cd-upd-date">${PQQ.esc(date)}</span><span class="cd-upd-time">${PQQ.esc(time)}</span>`
      : `<span class="cd-upd-date">${PQQ.esc(date)}</span>`;
    return { html, title, empty: false };
  };

  PQQ.formatNowDisplayDate_ = function () {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: PQQ.TZ,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false
    }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t)?.value || '';
    return `${get('hour')}:${get('minute')} - ${get('day')}/${get('month')}/${get('year')}`;
  };

  PQQ.truncateLabel = function (str, max) {
    const s = String(str || '');
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
  };

  PQQ.filterValidStudents = function (list) {
    return (list || []).filter(s => {
      const id = String(s?.studentId || '').trim();
      return id && id.toLowerCase() !== 'id võ sinh';
    });
  };

  PQQ.getScoringMonthLabel = function (period) {
    if (period?.label) return period.label;
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: PQQ.TZ,
      month: '2-digit',
      year: 'numeric'
    }).formatToParts(new Date());
    const month = parts.find(p => p.type === 'month')?.value || '01';
    const year = parts.find(p => p.type === 'year')?.value || String(new Date().getFullYear());
    return `${month}/${year}`;
  };

  PQQ.getScoringYear = function (period) {
    if (period?.year) return Number(period.year);
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: PQQ.TZ,
      year: 'numeric'
    }).formatToParts(new Date());
    return Number(parts.find(p => p.type === 'year')?.value) || new Date().getFullYear();
  };
})(window.PQQ || (window.PQQ = {}));
