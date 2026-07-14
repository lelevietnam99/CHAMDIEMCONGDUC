import { CHART_COLORS } from './constants.js';
import { state } from './state.js';
import { $, fmtScore, truncateLabel, getScoringYear } from './utils.js';

/** Tổng hợp năm toàn hệ thống từ field năm của API. */
export function buildYearStats(students) {
  const stats = {
    tongChuyenCan: 0, tongPhuTa: 0, tongCongQua: 0,
    tongTuTap: 0, tongGiaiThiDau: 0, tongCongDuc: 0
  };
  students.forEach(s => {
    stats.tongChuyenCan += Number(s.tongChuyenCanNam) || 0;
    stats.tongPhuTa += Number(s.tongPhuTaNam) || 0;
    stats.tongCongQua += Number(s.tongCongQuaNam) || 0;
    stats.tongTuTap += Number(s.tongTuTapNam) || 0;
    stats.tongGiaiThiDau += Number(s.tongGiaiThiDauNam) || 0;
    stats.tongCongDuc += Number(s.tongDiem) || 0;
  });
  return stats;
}

export function destroyDashCharts() {
  (state.dashCharts || []).forEach(ch => {
    try { ch.destroy(); } catch (_) {}
  });
  state.dashCharts = [];
}

export function chartTooltipDefaults() {
  return {
    backgroundColor: 'rgba(30,42,58,.92)',
    titleFont: { weight: '700', size: 13 },
    bodyFont: { size: 12 },
    padding: 10,
    cornerRadius: 8
  };
}

export function renderCharts() {
  destroyDashCharts();
  const year = getScoringYear(state.scoringPeriod);
  const yearStats = buildYearStats(state.allStudents);
  const clubCount = Object.keys(state.clubStats).length;
  const studentCount = state.allStudents.length;

  $('dashYearLabel').textContent = `Tổng Công Đức năm ${year}`;
  $('dashTotalMerit').textContent = fmtScore(yearStats.tongCongDuc);
  $('dashMetaClubs').textContent = `${fmtScore(clubCount)} câu lạc bộ`;
  $('dashMetaStudents').textContent = `${fmtScore(studentCount)} võ sinh`;

  const overviewChart = new Chart($('overviewChart'), {
    type: 'doughnut',
    data: {
      labels: ['Chuyên cần', 'Phụ tá', 'Công quả', 'Tu tập', 'Thi đấu'],
      datasets: [{
        data: [
          yearStats.tongChuyenCan,
          yearStats.tongPhuTa,
          yearStats.tongCongQua,
          yearStats.tongTuTap,
          yearStats.tongGiaiThiDau
        ],
        backgroundColor: CHART_COLORS.overview,
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, padding: 10, font: { size: 11, weight: '600' } }
        },
        tooltip: {
          ...chartTooltipDefaults(),
          callbacks: {
            label: ctx => {
              const v = Number(ctx.raw) || 0;
              const sum = (ctx.dataset.data || []).reduce((a, b) => a + (Number(b) || 0), 0) || 1;
              const pct = ((v / sum) * 100).toFixed(1);
              return ` ${ctx.label}: ${v.toLocaleString('vi-VN')} (${pct}%)`;
            }
          }
        },
        title: {
          display: true,
          text: 'Cơ cấu điểm theo tiêu chí năm',
          align: 'start',
          color: '#6c757d',
          font: { size: 12, weight: '700' },
          padding: { bottom: 8 }
        }
      }
    }
  });

  const clubsArr = Object.values(state.clubStats);
  const top10Clubs = [...clubsArr].sort((a, b) => b.points - a.points).slice(0, 10);
  const clubChart = new Chart($('topChart'), {
    type: 'bar',
    data: {
      labels: top10Clubs.map(x => truncateLabel(x.name, 22)),
      datasets: [{
        label: 'Tổng Công Đức năm',
        data: top10Clubs.map(x => x.points),
        backgroundColor: top10Clubs.map((_, i) => i < 3 ? CHART_COLORS.topClubHot : CHART_COLORS.topClubNormal),
        borderRadius: 5,
        barThickness: 18
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...chartTooltipDefaults(),
          callbacks: {
            title: ctx => top10Clubs[ctx[0].dataIndex]?.name || '',
            label: ctx => ` Tổng Công Đức: ${(Number(ctx.raw) || 0).toLocaleString('vi-VN')}`,
            afterLabel: ctx => {
              const c = top10Clubs[ctx[0].dataIndex];
              return c ? ` Sĩ số: ${c.total} · Đã chấm: ${c.scored}` : '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: { callback: v => Number(v).toLocaleString('vi-VN') }
        },
        y: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' } } }
      }
    }
  });

  const top10Students = [...state.allStudents]
    .sort((a, b) => (Number(b.tongDiem) || 0) - (Number(a.tongDiem) || 0))
    .slice(0, 10);

  const studentChart = new Chart($('topStudentsChart'), {
    type: 'bar',
    data: {
      labels: top10Students.map(x => truncateLabel(x.fullName, 18)),
      datasets: [{
        label: 'Tổng Công Đức năm',
        data: top10Students.map(x => Number(x.tongDiem) || 0),
        backgroundColor: top10Students.map((_, i) => i < 3 ? CHART_COLORS.topStudentHot : CHART_COLORS.topStudentNormal),
        borderRadius: 5,
        barThickness: 18
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...chartTooltipDefaults(),
          callbacks: {
            title: ctx => top10Students[ctx[0].dataIndex]?.fullName || '',
            label: ctx => ` Tổng Công Đức: ${(Number(ctx.raw) || 0).toLocaleString('vi-VN')}`,
            afterLabel: ctx => {
              const s = top10Students[ctx[0].dataIndex];
              return s ? ` CLB: ${s.clubName || '—'}` : '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: { callback: v => Number(v).toLocaleString('vi-VN') }
        },
        y: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' } } }
      }
    }
  });

  state.dashCharts = [overviewChart, clubChart, studentChart];
}
