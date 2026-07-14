import { RUBRIC_SECTIONS, RUBRIC_NOTE } from './constants.js';
import { $, esc } from './utils.js';

export function renderRubricCard() {
  const sections = RUBRIC_SECTIONS;

  const inputsHtml = sections.map((sec, i) =>
    `<input type="radio" class="rubric-tab-input" name="rubricTab" id="rubricTab${i}"${i === 0 ? ' checked' : ''}>`
  ).join('');

  const navHtml = `<div class="rubric-tab-nav">${sections.map((sec, i) =>
    `<label for="rubricTab${i}">${esc(sec.title)}</label>`
  ).join('')}</div>`;

  const panelsHtml = `<div class="rubric-panels">${sections.map((sec, i) => {
    const rowsHtml = sec.rows.map(([score, criteria]) => `
        <tr>
          <td class="rubric-score">${esc(score)}</td>
          <td class="rubric-criteria">${esc(criteria)}</td>
        </tr>
      `).join('');
    return `
        <div class="rubric-panel" data-panel="${i}">
          <h3 class="rubric-section-title">${esc(sec.title)} <span class="rubric-range">(0–10 điểm)</span></h3>
          <p class="rubric-section-desc">${esc(sec.desc)}</p>
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

  $('rubricBody').innerHTML = `
      <div class="rubric-guide">
        <div class="rubric-tabs">
          ${inputsHtml}
          ${navHtml}
          ${panelsHtml}
        </div>
        <div class="rubric-note-box">
          <strong>Lưu ý.</strong>
          ${RUBRIC_NOTE}
        </div>
      </div>`;
}

export function initRubricToggle() {
  const card = $('rubricCard');
  const btn = $('rubricToggle');
  const label = $('rubricToggleText');
  if (!card || !btn || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', handleRubricToggle);
}

export function handleRubricToggle() {
  const card = $('rubricCard');
  const btn = $('rubricToggle');
  const label = $('rubricToggleText');
  const open = card.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (label) label.textContent = open ? 'Thu gọn' : 'Xem thêm';
}
