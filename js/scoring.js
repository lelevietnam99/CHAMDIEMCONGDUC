/* global PQQ */
(function (PQQ) {
  PQQ.updateScoreCell = function (inp) {
    const v = PQQ.clampScore(inp.value);
    if (String(v) !== inp.value) inp.value = v;
    const fill = inp.closest('.score-cell')?.querySelector('.score-bar-fill');
    if (fill) {
      fill.style.width = `${(v / PQQ.SCORE_MAX) * 100}%`;
      fill.className = `score-bar-fill ${PQQ.scoreBarLevel(v)}`;
    }
    return v;
  };

  PQQ.updateRowScores = function (tr) {
    let sum = 0;
    tr.querySelectorAll('input.score-input').forEach(inp => {
      sum += PQQ.updateScoreCell(inp);
    });
    const totalEl = tr.querySelector('[data-total]');
    if (totalEl) totalEl.innerHTML = PQQ.formatTotal(sum);
    return sum;
  };

  PQQ.renderScoreInput = function (f, value) {
    const v = PQQ.clampScore(value);
    const level = PQQ.scoreBarLevel(v);
    const pct = (v / PQQ.SCORE_MAX) * 100;
    return `
      <td class="col-score">
        <div class="score-cell">
          <input type="number" class="score-input" min="0" max="${PQQ.SCORE_MAX}" value="${v}" data-field="${f.key}">
          <div class="score-bar"><div class="score-bar-fill ${level}" style="width:${pct}%"></div></div>
        </div>
      </td>`;
  };

  PQQ.updateScoringLastUpdated = function (students) {
    const el = PQQ.$('scoringLastUpdated');
    if (!el) return;
    const latest = PQQ.getLatestLastUpdated(students);
    el.textContent = latest
      ? `Cập nhật gần nhất: ${latest}`
      : PQQ.MESSAGES.LAST_UPDATED_NONE;
  };

  PQQ.snapshotStudentRow = function (st) {
    const scores = {};
    PQQ.SCORE_FIELDS.forEach(f => { scores[f.key] = PQQ.clampScore(st[f.key] || 0); });
    return { scores, note: String(st.note || '').trim() };
  };

  PQQ.readStudentFromRow = function (tr) {
    const scores = {};
    tr.querySelectorAll('input.score-input').forEach(i => {
      scores[i.dataset.field] = PQQ.clampScore(i.value);
    });
    const noteEl = tr.querySelector('textarea.note-input');
    return {
      scores,
      note: noteEl ? String(noteEl.value || '').trim() : ''
    };
  };

  PQQ.isStudentDirty = function (studentId, current) {
    const base = PQQ.state.cdBaseline[studentId];
    if (!base) return true;
    if (String(base.note || '') !== String(current.note || '')) return true;
    return PQQ.SCORE_FIELDS.some(f => PQQ.clampScore(base.scores[f.key]) !== PQQ.clampScore(current.scores[f.key]));
  };

  PQQ.refreshRowDirtyState = function (tr) {
    const studentId = tr.dataset.studentId;
    if (!studentId) return;
    const current = PQQ.readStudentFromRow(tr);
    const dirty = PQQ.isStudentDirty(studentId, current);
    tr.querySelectorAll('input.score-input').forEach(inp => {
      const base = PQQ.state.cdBaseline[studentId];
      const changed = !base || PQQ.clampScore(base.scores[inp.dataset.field]) !== PQQ.clampScore(inp.value);
      inp.classList.toggle('dirty', changed);
    });
    const noteEl = tr.querySelector('textarea.note-input');
    if (noteEl) {
      const base = PQQ.state.cdBaseline[studentId];
      noteEl.classList.toggle('dirty', !base || String(base.note || '') !== String(noteEl.value || '').trim());
    }
    if (dirty) PQQ.state.cdDirty.add(studentId);
    else PQQ.state.cdDirty.delete(studentId);
    tr.classList.toggle('is-dirty', dirty);
    PQQ.updateScoringStats();
  };

  PQQ.handleScoreInput = function (e) {
    const inp = e.currentTarget;
    PQQ.updateRowScores(inp.closest('tr'));
    PQQ.refreshRowDirtyState(inp.closest('tr'));
  };

  PQQ.handleNoteInput = function (e) {
    PQQ.refreshRowDirtyState(e.currentTarget.closest('tr'));
  };

  PQQ.renderScoringTable = function (students) {
    const tbody = PQQ.$('cdTableBody');
    tbody.innerHTML = '';
    PQQ.state.cdBaseline = {};
    if (!students.length) {
      tbody.innerHTML = `<tr><td colspan="9" style="padding:36px;text-align:center;color:var(--muted);">${PQQ.MESSAGES.NO_STUDENTS}</td></tr>`;
      PQQ.updateSubmitButton();
      return;
    }
    students.forEach(st => {
      PQQ.state.cdBaseline[st.studentId] = PQQ.snapshotStudentRow(st);
      const inputs = PQQ.SCORE_FIELDS.map(f => PQQ.renderScoreInput(f, st[f.key] || 0)).join('');
      const total = PQQ.SCORE_FIELDS.reduce((s, f) => s + PQQ.clampScore(st[f.key] || 0), 0);
      const noteVal = PQQ.esc(st.note || '');
      const updatedInfo = PQQ.formatUpdatedDisplay(st.lastUpdated);
      const tr = document.createElement('tr');
      tr.dataset.studentId = st.studentId;
      tr.dataset.searchName = PQQ.toSearchStr(st.fullName);
      tr.innerHTML = `
        <td class="left col-name">
          <div class="name-cell">
            <div class="name">${PQQ.esc(st.fullName)}</div>
            ${st.phapDanh ? `<div class="belt"><i class="fas fa-leaf"></i> ${PQQ.esc(st.phapDanh)}</div>` : ''}
          </div>
        </td>
        ${inputs}
        <td class="col-total"><span class="total-val" data-total>${PQQ.formatTotal(total)}</span></td>
        <td class="left col-note">
          <textarea class="note-input" rows="1" placeholder="Ghi chú ngắn…" data-note>${noteVal}</textarea>
        </td>
        <td class="col-updated">
          <span class="cd-updated${updatedInfo.empty ? ' is-empty' : ''}" data-updated title="${PQQ.esc(updatedInfo.title)}">
            ${updatedInfo.html}
          </span>
        </td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('input.score-input').forEach(inp => {
      inp.addEventListener('input', PQQ.handleScoreInput);
    });
    tbody.querySelectorAll('textarea.note-input').forEach(ta => {
      ta.addEventListener('input', PQQ.handleNoteInput);
    });
    PQQ.updateSubmitButton();
  };

  PQQ.collectDirtyPayload = function () {
    const students = [];
    PQQ.$('cdTableBody').querySelectorAll('tr[data-student-id]').forEach(tr => {
      const studentId = tr.dataset.studentId;
      if (!studentId || !PQQ.state.cdDirty.has(studentId)) return;
      const current = PQQ.readStudentFromRow(tr);
      students.push({
        studentId,
        scores: current.scores,
        note: current.note
      });
    });
    return students;
  };

  PQQ.validateBatchSubmit = function (students) {
    if (!students.length) {
      PQQ.toast('wrn', PQQ.MESSAGES.NO_CHANGES);
      return false;
    }
    return true;
  };

  PQQ.buildSubmitPayload = function (students) {
    const clubName = PQQ.state.clubStudents[0]?.clubName || PQQ.state.clbParam || '';
    const clubId = PQQ.state.clubStudents[0]?.clubId || '';
    const clubMemberIds = PQQ.state.clubStudents.map(s => s.studentId).filter(Boolean);
    const clubAlreadyScoredIds = PQQ.state.clubStudents
      .filter(s => String(s.lastUpdated || '').trim())
      .map(s => s.studentId)
      .filter(Boolean);

    return {
      students,
      clubName,
      clubId,
      clb: PQQ.state.clbParam || '',
      clubMemberIds,
      clubAlreadyScoredIds
    };
  };

  PQQ.handleBatchSubmit = async function () {
    if (PQQ.state.isSubmitting) return;
    const students = PQQ.collectDirtyPayload();
    if (!PQQ.validateBatchSubmit(students)) return;

    const btn = PQQ.$('btnBatchSubmit');
    PQQ.state.isSubmitting = true;
    btn.disabled = true;
    btn.className = 'btn btn-muted';
    btn.innerHTML = `<i class="fas fa-circle-notch spin"></i> ${PQQ.MESSAGES.SUBMITTING}`;
    try {
      const payload = PQQ.buildSubmitPayload(students);
      const json = await PQQ.updateChamCongDuc(payload);

      PQQ.applySubmitSuccessToUi_(students, json);
      PQQ.toast('ok', PQQ.MESSAGES.SUBMIT_OK);

      if (json.errors) {
        console.warn('[Submit] Một số ID lỗi:', json.errors);
      }
      if (json.clubProgress) {
        console.log('[Slack] Tiến độ CLB:', json.clubProgress);
      }

      PQQ.notifySlack(json.slackNotify);

      setTimeout(() => PQQ.softRefreshScoringInBackground_(), 2500);
    } catch (err) {
      PQQ.toast('err', 'Gửi thất bại: ' + err.message);
    } finally {
      PQQ.state.isSubmitting = false;
      PQQ.updateSubmitButton();
    }
  };

  /**
   * Sau POST thành công: merge điểm vào state + DOM, clear dirty, reset nút.
   */
  PQQ.applySubmitSuccessToUi_ = function (submittedStudents, json) {
    const updatedAt = json.updatedAt
      || (Array.isArray(json.updatedStudents) && json.updatedStudents[0]?.lastUpdated)
      || PQQ.formatNowDisplayDate_();

    if (json.scoringPeriod) PQQ.state.scoringPeriod = json.scoringPeriod;

    const byId = {};
    if (Array.isArray(json.updatedStudents) && json.updatedStudents.length) {
      json.updatedStudents.forEach(u => {
        const id = String(u.studentId || '').trim();
        if (!id) return;
        byId[id] = {
          chuyenCan: PQQ.clampScore(u.chuyenCan),
          phuTa: PQQ.clampScore(u.phuTa),
          congQua: PQQ.clampScore(u.congQua),
          tuTap: PQQ.clampScore(u.tuTap),
          giaiThiDau: PQQ.clampScore(u.giaiThiDau),
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
          chuyenCan: PQQ.clampScore(scores.chuyenCan),
          phuTa: PQQ.clampScore(scores.phuTa),
          congQua: PQQ.clampScore(scores.congQua),
          tuTap: PQQ.clampScore(scores.tuTap),
          giaiThiDau: PQQ.clampScore(scores.giaiThiDau),
          note: s.note != null ? String(s.note).trim() : '',
          lastUpdated: updatedAt
        };
      });
    }

    PQQ.state.clubStudents = PQQ.state.clubStudents.map(st => {
      const patch = byId[st.studentId];
      if (!patch) return st;
      return Object.assign({}, st, patch);
    });

    PQQ.state.cdDirty = new Set();
    PQQ.renderScoringTable(PQQ.state.clubStudents);
    PQQ.updateScoringLastUpdated(PQQ.state.clubStudents);
    PQQ.updateScoringStats();
  };

  PQQ.softRefreshScoringInBackground_ = async function () {
    if (!PQQ.state.clbParam || PQQ.state.isRefreshing) return;
    PQQ.state.isRefreshing = true;
    try {
      const json = await PQQ.getChamCongDuc(PQQ.state.clbParam);
      if (PQQ.state.isSubmitting || PQQ.state.cdDirty.size > 0) return;
      const clubStudents = PQQ.filterValidStudents(json.data);
      const prevById = {};
      PQQ.state.clubStudents.forEach(s => { prevById[s.studentId] = s; });
      const scoreSum = st => PQQ.SCORE_FIELDS.reduce((a, f) => a + (Number(st[f.key]) || 0), 0);

      PQQ.state.clubStudents = clubStudents.map(s => {
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
      PQQ.state.scoringPeriod = clubStudents[0]?.scoringPeriod || PQQ.state.scoringPeriod;
      PQQ.updateScoringLastUpdated(PQQ.state.clubStudents);
      PQQ.renderScoringTable(PQQ.state.clubStudents);
      PQQ.updateScoringStats();
    } catch (err) {
      console.warn('[softRefresh] Bỏ qua:', err.message);
    } finally {
      PQQ.state.isRefreshing = false;
    }
  };

  PQQ.updateSubmitButton = function () {
    const btn = PQQ.$('btnBatchSubmit');
    if (!btn) return;
    const monthLabel = PQQ.getScoringMonthLabel(PQQ.state.scoringPeriod);
    const dirtyCount = PQQ.state.cdDirty.size;
    if (PQQ.state.isSubmitting) {
      btn.disabled = true;
      btn.className = 'btn btn-muted';
      btn.innerHTML = `<i class="fas fa-circle-notch spin"></i> ${PQQ.MESSAGES.SUBMITTING}`;
      return;
    }
    btn.disabled = dirtyCount === 0;
    btn.className = 'btn btn-primary';
    btn.innerHTML = `<i class="fas fa-paper-plane"></i> <span id="btnBatchSubmitText">Gửi điểm tháng ${monthLabel}</span>`;
    const hint = PQQ.$('submitHint');
    if (hint) {
      hint.textContent = dirtyCount
        ? `${dirtyCount} võ sinh sẽ được cập nhật.`
        : PQQ.MESSAGES.NO_CHANGES;
    }
  };

  PQQ.countScoredStudents = function (students) {
    return (students || []).filter(s => String(s.lastUpdated || '').trim()).length;
  };

  PQQ.updateScoringStats = function () {
    const total = (PQQ.state.clubStudents || []).length;
    const scored = PQQ.countScoredStudents(PQQ.state.clubStudents);
    if (PQQ.$('cd-scored')) PQQ.$('cd-scored').textContent = scored;
    if (PQQ.$('cd-pending')) PQQ.$('cd-pending').textContent = Math.max(0, total - scored);
    PQQ.updateSubmitButton();
  };

  PQQ.initScoring = async function () {
    try {
      const json = await PQQ.getChamCongDuc(PQQ.state.clbParam);
      const clubStudents = PQQ.filterValidStudents(json.data);
      PQQ.state.clubStudents = clubStudents;
      PQQ.state.cdDirty = new Set();
      PQQ.state.cdBaseline = {};
      PQQ.state.scoringPeriod = clubStudents[0]?.scoringPeriod || null;
      const monthLabel = PQQ.getScoringMonthLabel(PQQ.state.scoringPeriod);
      PQQ.$('scoringMonthLabel').textContent = `Đang chấm công đức Tháng ${monthLabel}`;
      PQQ.updateScoringLastUpdated(clubStudents);

      if (clubStudents.length > 0) {
        PQQ.$('headerSub').textContent = `CLB: ${clubStudents[0].clubName}`;
      } else {
        PQQ.$('headerSub').textContent = `Không tìm thấy CLB khớp với từ khóa: "${PQQ.state.clbParam}"`;
      }

      PQQ.$('cd-total').textContent = clubStudents.length;
      PQQ.renderRubricCard();
      PQQ.initRubricToggle();
      PQQ.renderScoringTable(clubStudents);
      PQQ.initScoringSearch();
      PQQ.updateScoringStats();
    } catch (err) {
      PQQ.$('cdTableBody').innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--danger);">${PQQ.esc(err.message)}</td></tr>`;
      PQQ.toast('err', err.message);
    }
  };
})(window.PQQ || (window.PQQ = {}));
