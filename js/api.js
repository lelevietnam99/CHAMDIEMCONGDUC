import { API_URL } from './config.js';
import { ACTIONS, MESSAGES } from './constants.js';

export async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { redirect: 'follow', ...opts });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(MESSAGES.PARSE_ERROR);
  }
  if (json.status === 'error') throw new Error(json.message || MESSAGES.API_ERROR);
  return json;
}

export function getChamCongDuc(clb) {
  let url = `${API_URL}?action=${ACTIONS.GET_CHAM_CONG_DUC}`;
  if (clb) url += `&clb=${encodeURIComponent(clb)}`;
  return apiFetch(url);
}

export function updateChamCongDuc(payload) {
  return apiFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: ACTIONS.UPDATE_CHAM_CONG_DUC,
      ...payload
    })
  });
}

/**
 * Gửi Slack qua request riêng — fire-and-forget (không chặn UI Submit).
 */
export function notifySlack(slackNotify) {
  if (!slackNotify || !slackNotify.type) return;
  fetch(API_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: ACTIONS.NOTIFY_SLACK_CONG_DUC,
      type: slackNotify.type,
      channelKey: slackNotify.channelKey || 'CONG_DUC',
      data: slackNotify.data || {}
    })
  })
    .then(res => res.text())
    .then(text => {
      try {
        const json = JSON.parse(text);
        if (json.status === 'success') {
          console.log('[Slack] Đã gửi thông báo thành công.');
        } else {
          console.warn('[Slack] Gửi thất bại:', json.message || json.slackError || 'không rõ');
        }
      } catch (_) {
        console.warn('[Slack] Response không phải JSON.');
      }
    })
    .catch(err => {
      console.warn('[Slack] Lỗi mạng khi gửi:', err && err.message ? err.message : err);
    });
}
