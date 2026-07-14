import { TZ } from './config.js';
import { SCORE_MAX, SCORE_BAR_THRESHOLDS, MESSAGES } from './constants.js';

export const $ = id => document.getElementById(id);

export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function toSearchStr(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

export function clampScore(v) {
  const n = parseInt(v, 10);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(SCORE_MAX, n);
}

export function scoreBarLevel(v) {
  if (v >= SCORE_BAR_THRESHOLDS.high) return 'high';
  if (v >= SCORE_BAR_THRESHOLDS.mid) return 'mid';
  return 'low';
}

export function formatTotal(sum) {
  return `<span class="total-num">${sum}</span>`;
}

export function fmtScore(n) {
  return (Number(n) || 0).toLocaleString('vi-VN');
}

export function padDatePart(n) {
  return String(n).padStart(2, '0');
}

export function normalizeDisplayDate(dateStr) {
  const m = String(dateStr || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return String(dateStr || '').trim();
  return `${padDatePart(m[1])}/${padDatePart(m[2])}/${m[3]}`;
}

/** Chuẩn hóa ngày cập nhật từ API (HH:mm - dd/MM/yyyy) sang hiển thị gọn. */
export function formatUpdatedDisplay(raw) {
  const s = String(raw || '').trim();
  if (!s) {
    return { html: '—', title: MESSAGES.NOT_UPDATED, empty: true };
  }
  let date = '';
  let time = '';
  let m = s.match(/^(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{4})$/);
  if (m) {
    time = m[1];
    date = normalizeDisplayDate(m[2]);
  } else {
    m = s.match(/^(\d{1,2}\/\d{1,2}\/\d{4})(?:[ T]+(\d{1,2}:\d{2}))?/);
    if (m) {
      date = normalizeDisplayDate(m[1]);
      time = m[2] || '';
    }
  }
  if (!date) {
    return { html: esc(s), title: s, empty: false };
  }
  const title = time ? `${date} ${time}` : date;
  const html = time
    ? `<span class="cd-upd-date">${esc(date)}</span><span class="cd-upd-time">${esc(time)}</span>`
    : `<span class="cd-upd-date">${esc(date)}</span>`;
  return { html, title, empty: false };
}

export function formatNowDisplayDate_() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value || '';
  return `${get('hour')}:${get('minute')} - ${get('day')}/${get('month')}/${get('year')}`;
}

export function truncateLabel(str, max) {
  const s = String(str || '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export function filterValidStudents(list) {
  return (list || []).filter(s => {
    const id = String(s?.studentId || '').trim();
    return id && id.toLowerCase() !== 'id võ sinh';
  });
}

export function getScoringMonthLabel(period) {
  if (period?.label) return period.label;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    month: '2-digit',
    year: 'numeric'
  }).formatToParts(new Date());
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const year = parts.find(p => p.type === 'year')?.value || String(new Date().getFullYear());
  return `${month}/${year}`;
}

export function getScoringYear(period) {
  if (period?.year) return Number(period.year);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric'
  }).formatToParts(new Date());
  return Number(parts.find(p => p.type === 'year')?.value) || new Date().getFullYear();
}
