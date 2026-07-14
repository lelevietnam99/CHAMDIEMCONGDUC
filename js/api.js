/* global PQQ */
(function (PQQ) {
  PQQ.apiFetch = async function (url, opts) {
    opts = opts || {};
    const res = await fetch(url, Object.assign({ redirect: 'follow' }, opts));
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error(PQQ.MESSAGES.PARSE_ERROR);
    }
    if (json.status === 'error') throw new Error(json.message || PQQ.MESSAGES.API_ERROR);
    return json;
  };

  PQQ.getChamCongDuc = function (clb) {
    let url = `${PQQ.API_URL}?action=${PQQ.ACTIONS.GET_CHAM_CONG_DUC}`;
    if (clb) url += `&clb=${encodeURIComponent(clb)}`;
    return PQQ.apiFetch(url);
  };

  PQQ.updateChamCongDuc = function (payload) {
    return PQQ.apiFetch(PQQ.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({
        action: PQQ.ACTIONS.UPDATE_CHAM_CONG_DUC
      }, payload))
    });
  };

  /**
   * Gửi Slack qua request riêng — fire-and-forget (không chặn UI Submit).
   */
  PQQ.notifySlack = function (slackNotify) {
    if (!slackNotify || !slackNotify.type) return;
    fetch(PQQ.API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: PQQ.ACTIONS.NOTIFY_SLACK_CONG_DUC,
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
  };
})(window.PQQ || (window.PQQ = {}));
