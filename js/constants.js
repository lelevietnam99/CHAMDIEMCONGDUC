export const SCORE_MAX = 10;

export const SCORE_FIELDS = [
  { key: 'chuyenCan',  label: 'C.Cần',  fullLabel: 'Chuyên Cần', desc: 'Điểm danh, tham gia tập luyện đều đặn' },
  { key: 'phuTa',      label: 'Phụ Tá', fullLabel: 'Phụ Tá',     desc: 'Hỗ trợ HLV, giúp đỡ võ sinh khác' },
  { key: 'congQua',    label: 'C.Quả',  fullLabel: 'Công Quả',   desc: 'Tham gia công quả, phật sự hỗ trợ giải đấu' },
  { key: 'tuTap',      label: 'Tu Tập', fullLabel: 'Tu Tập',     desc: 'Tu tập sinh hoạt giáo lý đều đặn, tích cực tham gia các buổi học lý thuyết võ đạo' },
  { key: 'giaiThiDau', label: 'G.Đấu',  fullLabel: 'Thi Đấu',    desc: 'Tham gia và thành tích thi đấu' }
];

export const ACTIONS = {
  GET_CHAM_CONG_DUC: 'getChamCongDuc',
  UPDATE_CHAM_CONG_DUC: 'updateChamCongDuc',
  NOTIFY_SLACK_CONG_DUC: 'notifySlackCongDuc'
};

export const TOAST_ICONS = {
  ok: 'fa-circle-check',
  err: 'fa-circle-exclamation',
  wrn: 'fa-triangle-exclamation'
};

export const MESSAGES = {
  PARSE_ERROR: 'Lỗi phân tích dữ liệu từ máy chủ.',
  API_ERROR: 'Lỗi API',
  NO_CHANGES: 'Chưa có thay đổi để gửi.',
  SUBMIT_OK: 'Đã cập nhật công đức thành công.',
  SUBMITTING: 'Đang gửi…',
  NO_STUDENTS: 'Không có dữ liệu võ sinh.',
  NO_STUDENTS_TABLE: 'Không có dữ liệu võ sinh',
  CLUB_UNKNOWN: 'Chưa rõ',
  CLUB_UNASSIGNED: 'Chưa phân bổ',
  NOT_UPDATED: 'Chưa cập nhật',
  LAST_UPDATED_NONE: 'Cập nhật gần nhất: Chưa cập nhật',
  LOADING: 'Đang tải…'
};

export const RUBRIC_SECTIONS = [
  {
    title: 'Chuyên cần',
    desc: 'Đánh giá mức độ tham gia tập luyện trong tháng.',
    rows: [
      ['10', 'Tham gia đầy đủ, đúng giờ, không nghỉ'],
      ['8–9', 'Nghỉ 1 buổi hoặc có 1–2 lần đi muộn'],
      ['6–7', 'Nghỉ 2–3 buổi hoặc đi muộn nhiều lần'],
      ['4–5', 'Nghỉ trên 3 buổi nhưng vẫn duy trì tập'],
      ['0–3', 'Tham gia rất ít hoặc không có lý do chính đáng']
    ]
  },
  {
    title: 'Phụ tá',
    desc: 'Đánh giá tinh thần hỗ trợ HLV và giúp đỡ võ sinh.',
    rows: [
      ['10', 'Chủ động phụ tá thường xuyên, hiệu quả'],
      ['8–9', 'Tham gia phụ tá đầy đủ khi được phân công'],
      ['6–7', 'Có tham gia nhưng chưa chủ động'],
      ['4–5', 'Tham gia rất ít'],
      ['0–3', 'Không tham gia hoặc thiếu tinh thần hỗ trợ']
    ]
  },
  {
    title: 'Công quả',
    desc: 'Đánh giá việc tham gia công quả, Phật sự và hỗ trợ các hoạt động của CLB/Môn phái.',
    rows: [
      ['10', 'Tham gia đầy đủ, tích cực, có trách nhiệm'],
      ['8–9', 'Tham gia hầu hết các hoạt động'],
      ['6–7', 'Tham gia một số hoạt động'],
      ['4–5', 'Ít tham gia'],
      ['0–3', 'Không tham gia']
    ]
  },
  {
    title: 'Tu tập',
    desc: 'Đánh giá việc tu học và rèn luyện đạo đức.',
    rows: [
      ['10', 'Sinh hoạt giáo lý đầy đủ, tích cực học Lý thuyết Võ đạo, thực hành tốt'],
      ['8–9', 'Tham gia đầy đủ nhưng mức độ chủ động chưa cao'],
      ['6–7', 'Tham gia không thường xuyên'],
      ['4–5', 'Tham gia rất ít'],
      ['0–3', 'Không tham gia hoặc thiếu ý thức tu học']
    ]
  },
  {
    title: 'Thi đấu',
    desc: 'Đánh giá tinh thần tham gia và kết quả thi đấu trong tháng.',
    rows: [
      ['10', 'Đạt thành tích cao hoặc có đóng góp nổi bật cho đội tuyển'],
      ['8–9', 'Tham gia thi đấu đầy đủ, hoàn thành tốt'],
      ['6–7', 'Có tham gia nhưng kết quả chưa tốt hoặc còn nhiều lỗi'],
      ['4–5', 'Chỉ tham gia tập luyện chuẩn bị hoặc chưa đạt yêu cầu'],
      ['0–3', 'Không tham gia (khi có phân công) hoặc thiếu tinh thần thi đấu']
    ]
  }
];

export const RUBRIC_NOTE =
  'Điểm cần phản ánh đúng quá trình rèn luyện trong tháng, đảm bảo công bằng, khách quan và nhất quán giữa các HLV. Các trường hợp đặc biệt (ốm đau, công tác, lý do chính đáng…) có thể được HLV xem xét linh hoạt khi chấm điểm.';

export const CHART_COLORS = {
  overview: ['#0d6efd', '#198754', '#e67e22', '#0d9488', '#c0392b'],
  topClubHot: 'rgba(192,57,43,.85)',
  topClubNormal: 'rgba(13,110,253,.75)',
  topStudentHot: 'rgba(25,135,84,.85)',
  topStudentNormal: 'rgba(13,148,136,.72)'
};

export const SCORE_BAR_THRESHOLDS = { high: 8, mid: 5 };
