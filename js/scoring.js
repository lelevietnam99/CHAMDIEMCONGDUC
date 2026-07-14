import { SCORE_MAX, SCORE_FIELDS, MESSAGES } from './constants.js';
import { state } from './state.js';
import { getChamCongDuc, updateChamCongDuc, notifySlack } from './api.js';
import { toast } from './toast.js';
import { renderRubricCard, initRubricToggle } from './rubric.js';
import { initScoringSearch } from './search.js';
import {
  $,
  esc,
  toSearchStr,
  clampScore,
  scoreBarLevel,
  formatTotal,
  formatUpdatedDisplay,
  formatNowDisplayDate_,
  filterValidStudents,
  getScoringMonthLabel
} from './utils.js';

export function updateScoreCell(inp) {
  const v = clampScore(inp.value);
  if (String(v) !== inp.value) inp.value = v;
  const fill = inp.closest('.score-cell')?.querySelector('.score-bar-fill');
  if (fill) {
    fill.style.width = `${(v / SCORE_MAX) * 100}%`;
    fill.className = `score-bar-fill ${scoreBarLevel(v)}`;
  }
  return v;
}

export function updateRowScores(tr) {
  let sum = 0;
  tr.querySelectorAll('input.score-input').forEach(inp => {
    sum += updateScoreCell(inp);
  });
  const totalEl = tr.querySelector('[data-total]');
  if (totalEl) totalEl.innerHTML = formatTotal(sum);
  return sum;
}

export function renderScoreInput(f, value) {
  const v = clampScore(value);
  const level = scoreBarLevel(v);
  const pct = (v / SCORE_MAX) * 100;
  return `
      <td class="col-score">
        <div class="score-cell">
          <input type="number" class="score-input" min="0" max="${SCORE_MAX}" value="${v}" data-field="${f.key}">
          <div class="score-bar"><div class="score-bar-fill ${level}" style="width:${pct}%"></div></div>
        </div>
      </td>`;
}

export function updateScoringLastUpdated(students) {
  const el = $('scoringLastUpdated');
  if (!el) return;
  const dates = (students || []).map(s => String(s.lastUpdated || '').trim()).filter(Boolean);
  el.textContent = dates.length
    ? `Cập nhật gần nhất: ${dates.sort().slice(-1)[0]}`
    : MESSAGES.LAST_UPDATED_NONE;
}

export function snapshotStudentRow(st) {
  const scores = {};
  SCORE_FIELDS.forEach(f => { scores[f.key] = clampScore(st[f.key] || 0); });
  return { scores, note: String(st.note || '').trim() };
}

export function readStudentFromRow(tr) {
  const scores = {};
  tr.querySelectorAll('input.score-input').forEach(i => {
    scores[i.dataset.field] = clampScore(i.value);
  });
  const noteEl = tr.querySelector('textarea.note-input');
  return {
    scores,
    note: noteEl ? String(noteEl.value || '').trim() : ''
  };
}

export function isStudentDirty(studentId, current) {
  const base = state.cdBaseline[studentId];
  if (!base) return true;
  if (String(base.note || '') !== String(current.note || '')) return true;
  return SCORE_FIELDS.some(f => clampScore(base.scores[f.key]) !== clampScore(current.scores[f.key]));
}

export function refreshRowDirtyState(tr) {
  const studentId = tr.dataset.studentId;
  if (!studentId) return;
  const current = readStudentFromRow(tr);
  const dirty = isStudentDirty(studentId, current);
  tr.querySelectorAll('input.score-input').forEach(inp => {
    const base = state.cdBaseline[studentId];
    const changed = !base || clampScore(base.scores[inp.dataset.field]) !== clampScore(inp.value);
    inp.classList.toggle('dirty', changed);
  });
  const noteEl = tr.querySelector('textarea.note-input');
  if (noteEl) {
    const base = state.cdBaseline[studentId];
    noteEl.classList.toggle('dirty', !base || String(base.note || '') !== String(noteEl.value || '').trim());
  }
  if (dirty) state.cdDirty.add(studentId);
  else state.cdDirty.delete(studentId);
  tr.classList.toggle('is-dirty', dirty);
  updateScoringStats();
}

export function renderScoringTable(students) {
  const tbody = $('cdTableBody');
  tbody.innerHTML = '';
  state.cdBaseline = {};
  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding:36px;text-align:center;color:var(--muted);">${MESSAGES.NO_STUDENTS}</td></tr>`;
    updateSubmitButton();
    return;
  }
  students.forEach(st => {
    state.cdBaseline[st.studentId] = snapshotStudentRow(st);
    const inputs = SCORE_FIELDS.map(f => renderScoreInput(f, st[f.key] || 0)).join('');
    const total = SCORE_FIELDS.reduce((s, f) => s + clampScore(st[f.key] || 0), 0);
    const noteVal = esc(st.note || '');
    const updatedInfo = formatUpdatedDisplay(st.lastUpdated);
    const tr = document.createElement('tr');
    tr.dataset.studentId = st.studentId;
    tr.dataset.searchName = toSearchStr(st.fullName);
    tr.innerHTML = `
        <td class="left col-name">
          <div class="name-cell">
            <div class="name">${esc(st.fullName)}</div>
            ${st.phapDanh ? `<div class="belt"><i class="fas fa-leaf"></i> ${esc(st.phapDanh)}</div>` : ''}
          </div>
        </td>
        ${inputs}
        <td class="col-total"><span class="total-val" data-total>${formatTotal(total)}</span></td>
        <td class="left col-note">
          <textarea class="note-input" rows="1" placeholder="Ghi chú ngắn…" data-note>${noteVal}</textarea>
        </td>
        <td class="col-updated">
          <span class="cd-updated${updatedInfo.empty ? ' is-empty' : ''}" data-updated title="${esc(updatedInfo.title)}">
            ${updatedInfo.html}
          </span>
        </td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('input.score-input').forEach(inp => {
    inp.addEventListener('input', handleScoreInput);
  });
  tbody.querySelectorAll('textarea.note-input').forEach(ta => {
    ta.addEventListener('input', handleNoteInput);
  });
  updateSubmitButton();
}

export function handleScoreInput(e) {
  const inp = e.currentTarget;
  updateRowScores(inp.closest('tr'));
  refreshRowDirtyState(inp.closest('tr'));
}

export function handleNoteInput(e) {
  refreshRowDirtyState(e.currentTarget.closest('tr'));
}

export function collectDirtyPayload() {
  const students = [];
  $('cdTableBody').querySelectorAll('tr[data-student-id]').forEach(tr => {
    const studentId = tr.dataset.studentId;
    if (!studentId || !state.cdDirty.has(studentId)) return;
    const current = readStudentFromRow(tr);
    students.push({
      studentId,
      scores: current.scores,
      note: current.note
    });
  });
  return students;
}

export function validateBatchSubmit(students) {
  if (!students.length) {
    toast('wrn', MESSAGES.NO_CHANGES);
    return false;
  }
  return true;
}

export function buildSubmitPayload(students) {
  const clubName = state.clubStudents[0]?.clubName || state.clbParam || '';
  const clubId = state.clubStudents[0]?.clubId || '';
  const clubMemberIds = state.clubStudents.map(s => s.studentId).filter(Boolean);
  const clubAlreadyScoredIds = state.clubStudents
    .filter(s => String(s.lastUpdated || '').trim())
    .map(s => s.studentId)
    .filter(Boolean);

  return {
    students,
    clubName,
    clubId,
    clb: state.clbParam || '',
    clubMemberIds,
    clubAlreadyScoredIds
  };
}

export async function handleBatchSubmit() {
  if (state.isSubmitting) return;
  const students = collectDirtyPayload();
  if (!validateBatchSubmit(students)) return;

  const btn = $('btnBatchSubmit');
  state.isSubmitting = true;
  btn.disabled = true;
  btn.className = 'btn btn-muted';
  btn.innerHTML = `<i class="fas fa-circle-notch spin"></i> ${MESSAGES.SUBMITTING}`;
  try {
    const payload = buildSubmitPayload(students);
    const json = await updateChamCongDuc(payload);

    applySubmitSuccessToUi_(students, json);
    toast('ok', MESSAGES.SUBMIT_OK);

    if (json.errors) {
      console.warn('[Submit] Một số ID lỗi:', json.errors);
    }
    if (json.clubProgress) {
      console.log('[Slack] Tiến độ CLB:', json.clubProgress);
    }

    notifySlack(json.slackNotify);

    setTimeout(() => softRefreshScoringInBackground_(), 2500);
  } catch (err) {
    toast('err', 'Gửi thất bại: ' + err.message);
  } finally {
    state.isSubmitting = false;
    updateSubmitButton();
  }
}

/**
 * Sau POST thành công: merge điểm vào state + DOM, clear dirty, reset nút.
 * Ưu tiên updatedStudents từ API; fallback payload đã gửi.
 */
export function applySubmitSuccessToUi_(submittedStudents, json) {
  const updatedAt = json.updatedAt
    || (Array.isArray(json.updatedStudents) && json.updatedStudents[0]?.lastUpdated)
    || formatNowDisplayDate_();

  if (json.scoringPeriod) state.scoringPeriod = json.scoringPeriod;

  const byId = {};
  if (Array.isArray(json.updatedStudents) && json.updatedStudents.length) {
    json.updatedStudents.forEach(u => {
      const id = String(u.studentId || '').trim();
      if (!id) return;
      byId[id] = {
        chuyenCan: clampScore(u.chuyenCan),
        phuTa: clampScore(u.phuTa),
        congQua: clampScore(u.congQua),
        tuTap: clampScore(u.tuTap),
        giaiThiDau: clampScore(u.giaiThiDau),
        note: u.note != null ? String(u.note).trim() : '',
        lastUpdated: u.lastUpdated || updatedAt
      };
    });
  } else {
    (submittedStudents || []).forEach(s => {
      const id = String(s.studentId || '').trim();
      if (!id) return;
      const scores = s.scores || {};
      byId[id] = {
        chuyenCan: clampScore(scores.chuyenCan),
        phuTa: clampScore(scores.phuTa),
        congQua: clampScore(scores.congQua),
        tuTap: clampScore(scores.tuTap),
        giaiThiDau: clampScore(scores.giaiThiDau),
        note: s.note != null ? String(s.note).trim() : '',
        lastUpdated: updatedAt
      };
    });
  }

  state.clubStudents = state.clubStudents.map(st => {
    const patch = byId[st.studentId];
    if (!patch) return st;
    return Object.assign({}, st, patch);
  });

  state.cdDirty = new Set();
  renderScoringTable(state.clubStudents);
  updateScoringLastUpdated(state.clubStudents);
  updateScoringStats();
}

/**
 * GET lại dữ liệu CLB ở nền sau Submit.
 * Bỏ qua nếu user đã sửa tiếp hoặc đang submit tiếp.
 * Giữ điểm tháng local nếu formula HeThong chưa kịp recalculate.
 */
export async function softRefreshScoringInBackground_() {
  if (!state.clbParam || state.isRefreshing) return;
  state.isRefreshing = true;
  try {
    const json = await getChamCongDuc(state.clbParam);
    if (state.isSubmitting || state.cdDirty.size > 0) return;
    const clubStudents = filterValidStudents(json.data);
    const prevById = {};
    state.clubStudents.forEach(s => { prevById[s.studentId] = s; });
    const scoreSum = st => SCORE_FIELDS.reduce((a, f) => a + (Number(st[f.key]) || 0), 0);

    state.clubStudents = clubStudents.map(s => {
      const prev = prevById[s.studentId];
      if (!prev) return s;
      if (scoreSum(s) === 0 && scoreSum(prev) > 0 && String(prev.lastUpdated || '').trim()) {
        return Object.assign({}, s, {
          chuyenCan: prev.chuyenCan,
          phuTa: prev.phuTa,
          congQua: prev.congQua,
          tuTap: prev.tuTap,
          giaiThiDau: prev.giaiThiDau,
          note: prev.note || s.note,
          lastUpdated: prev.lastUpdated || s.lastUpdated
        });
      }
      return s;
    });
    state.scoringPeriod = clubStudents[0]?.scoringPeriod || state.scoringPeriod;
    updateScoringLastUpdated(state.clubStudents);
    renderScoringTable(state.clubStudents);
    updateScoringStats();
  } catch (err) {
    console.warn('[softRefresh] Bỏ qua:', err.message);
  } finally {
    state.isRefreshing = false;
  }
}

export function updateSubmitButton() {
  const btn = $('btnBatchSubmit');
  if (!btn) return;
  const monthLabel = getScoringMonthLabel(state.scoringPeriod);
  const dirtyCount = state.cdDirty.size;
  if (state.isSubmitting) {
    btn.disabled = true;
    btn.className = 'btn btn-muted';
    btn.innerHTML = `<i class="fas fa-circle-notch spin"></i> ${MESSAGES.SUBMITTING}`;
    return;
  }
  btn.disabled = dirtyCount === 0;
  btn.className = 'btn btn-primary';
  btn.innerHTML = `<i class="fas fa-paper-plane"></i> <span id="btnBatchSubmitText">Gửi điểm tháng ${monthLabel}</span>`;
  const hint = $('submitHint');
  if (hint) {
    hint.textContent = dirtyCount
      ? `${dirtyCount} võ sinh sẽ được cập nhật.`
      : MESSAGES.NO_CHANGES;
  }
}

export function countScoredStudents(students) {
  return (students || []).filter(s => String(s.lastUpdated || '').trim()).length;
}

export function updateScoringStats() {
  const total = (state.clubStudents || []).length;
  const scored = countScoredStudents(state.clubStudents);
  if ($('cd-scored')) $('cd-scored').textContent = scored;
  if ($('cd-pending')) $('cd-pending').textContent = Math.max(0, total - scored);
  updateSubmitButton();
}

export async function initScoring() {
  try {
    const json = await getChamCongDuc(state.clbParam);
    const clubStudents = filterValidStudents(json.data);
    state.clubStudents = clubStudents;
    state.cdDirty = new Set();
    state.cdBaseline = {};
    state.scoringPeriod = clubStudents[0]?.scoringPeriod || null;
    const monthLabel = getScoringMonthLabel(state.scoringPeriod);
    $('scoringMonthLabel').textContent = `Đang chấm công đức Tháng ${monthLabel}`;
    updateScoringLastUpdated(clubStudents);

    if (clubStudents.length > 0) {
      $('headerSub').textContent = `CLB: ${clubStudents[0].clubName}`;
    } else {
      $('headerSub').textContent = `Không tìm thấy CLB khớp với từ khóa: "${state.clbParam}"`;
    }

    $('cd-total').textContent = clubStudents.length;
    renderRubricCard();
    initRubricToggle();
    renderScoringTable(clubStudents);
    initScoringSearch();
    updateScoringStats();
  } catch (err) {
    $('cdTableBody').innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--danger);">${esc(err.message)}</td></tr>`;
    toast('err', err.message);
  }
}
