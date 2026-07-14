/* global PQQ */
(function (PQQ) {
  PQQ.renderRubricCard = function () {
    const sections = PQQ.RUBRIC_SECTIONS;

    const inputsHtml = sections.map((sec, i) =>
      `<input type="radio" class="rubric-tab-input" name="rubricTab" id="rubricTab${i}"${i === 0 ? ' checked' : ''}>`
    ).join('');

    const navHtml = `<div class="rubric-tab-nav">${sections.map((sec, i) =>
      `<label for="rubricTab${i}">${PQQ.esc(sec.title)}</label>`
    ).join('')}</div>`;

    const panelsHtml = `<div class="rubric-panels">${sections.map((sec, i) => {
      const rowsHtml = sec.rows.map(([score, criteria]) => `
        <tr>
          <td class="rubric-score">${PQQ.esc(score)}</td>
          <td class="rubric-criteria">${PQQ.esc(criteria)}</td>
        </tr>
      `).join('');
      return `
        <div class="rubric-panel" data-panel="${i}">
          <h3 class="rubric-section-title">${PQQ.esc(sec.title)} <span class="rubric-range">(0–10 điểm)</span></h3>
          <p class="rubric-section-desc">${PQQ.esc(sec.desc)}</p>
          <div class="rubric-table-wrap">
            <table class="rubric-table">
              <thead>
                <tr>
                  <th class="rubric-score">Điểm</th>
                  <th class="rubric-criteria">Tiêu chí</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </div>
      `;
    }).join('')}</div>`;

    PQQ.$('rubricBody').innerHTML = `
      <div class="rubric-guide">
        <div class="rubric-tabs">
          ${inputsHtml}
          ${navHtml}
          ${panelsHtml}
        </div>
        <div class="rubric-note-box">
          <strong>Lưu ý.</strong>
          ${PQQ.RUBRIC_NOTE}
        </div>
      </div>`;
  };

  PQQ.handleRubricToggle = function () {
    const card = PQQ.$('rubricCard');
    const btn = PQQ.$('rubricToggle');
    const label = PQQ.$('rubricToggleText');
    const open = card.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) label.textContent = open ? 'Thu gọn' : 'Xem thêm';
  };

  PQQ.initRubricToggle = function () {
    const card = PQQ.$('rubricCard');
    const btn = PQQ.$('rubricToggle');
    if (!card || !btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', PQQ.handleRubricToggle);
  };
})(window.PQQ || (window.PQQ = {}));
