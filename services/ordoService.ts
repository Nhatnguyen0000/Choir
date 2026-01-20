
import { LiturgicalColor, OrdoEvent, LiturgicalRank } from '../types';

const ORDO_DATA_2026: OrdoEvent[] = [
  // THÁNG 1
  { date: '2026-01-01', massName: 'Lễ Đức Maria, Mẹ Thiên Chúa', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: 'Ngày thế giới cầu bình an' },
  { date: '2026-01-04', massName: 'Chúa Nhật Lễ Hiển Linh', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },
  { date: '2026-01-11', massName: 'Lễ Chúa Giêsu Chịu Phép Rửa', liturgicalColor: 'WHITE', rank: 'FEAST', isObligatory: false, note: 'Kết thúc mùa Giáng Sinh' },
  { date: '2026-01-25', massName: 'Chúa Nhật 3 Thường Niên', liturgicalColor: 'GREEN', rank: 'SUNDAY', isObligatory: true, note: 'Chúa Nhật Lời Chúa' },

  // THÁNG 2 - TẾT & MÙA CHAY
  { date: '2026-02-02', massName: 'Lễ Đức Mẹ Dâng Chúa Trong Đền Thờ', liturgicalColor: 'WHITE', rank: 'FEAST', isObligatory: false, note: 'Lễ Nến' },
  { date: '2026-02-11', massName: 'Lễ Đức Mẹ Lộ Đức', liturgicalColor: 'WHITE', rank: 'MEMORIAL', isObligatory: false, note: 'Ngày thế giới cầu cho bệnh nhân' },
  { date: '2026-02-17', massName: 'Mùng 1 Tết Bính Ngọ - Cầu Bình An', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: 'Tết Nguyên Đán' },
  { date: '2026-02-18', massName: 'Thứ Tư Lễ Tro (Mùng 2 Tết)', liturgicalColor: 'VIOLET', rank: 'SOLEMNITY', isObligatory: false, note: 'Ăn chay kiêng thịt - Kính nhớ Tổ Tiên' },
  { date: '2026-02-19', massName: 'Mùng 3 Tết - Thánh Hóa Công Việc', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: '' },
  { date: '2026-02-22', massName: 'Chúa Nhật 1 Mùa Chay', liturgicalColor: 'VIOLET', rank: 'SUNDAY', isObligatory: true, note: '' },

  // THÁNG 3
  { date: '2026-03-01', massName: 'Chúa Nhật 2 Mùa Chay', liturgicalColor: 'VIOLET', rank: 'SUNDAY', isObligatory: true, note: '' },
  { date: '2026-03-08', massName: 'Chúa Nhật 3 Mùa Chay', liturgicalColor: 'VIOLET', rank: 'SUNDAY', isObligatory: true, note: '' },
  { date: '2026-03-15', massName: 'Chúa Nhật 4 Mùa Chay', liturgicalColor: 'ROSE', rank: 'SUNDAY', isObligatory: true, note: 'Chúa Nhật Laetare' },
  { date: '2026-03-19', massName: 'Lễ Thánh Giuse', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: 'Bạn trăm năm Đức Maria' },
  { date: '2026-03-22', massName: 'Chúa Nhật 5 Mùa Chay', liturgicalColor: 'VIOLET', rank: 'SUNDAY', isObligatory: true, note: '' },
  { date: '2026-03-25', massName: 'Lễ Truyền Tin', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: '' },
  { date: '2026-03-29', massName: 'Chúa Nhật Lễ Lá', liturgicalColor: 'RED', rank: 'SUNDAY', isObligatory: true, note: 'Bắt đầu Tuần Thánh' },

  // THÁNG 4 - PHỤC SINH
  { date: '2026-04-02', massName: 'Thứ Năm Tuần Thánh', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: 'Lễ Tiệc Ly' },
  { date: '2026-04-03', massName: 'Thứ Sáu Tuần Thánh', liturgicalColor: 'RED', rank: 'SOLEMNITY', isObligatory: false, note: 'Tưởng niệm Chúa chịu chết' },
  { date: '2026-04-04', massName: 'Thứ Bảy Tuần Thánh', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: 'Đêm Cực Thánh' },
  { date: '2026-04-05', massName: 'ĐẠI LỄ PHỤC SINH', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: 'Alleluia!' },
  { date: '2026-04-12', massName: 'Chúa Nhật 2 Phục Sinh', liturgicalColor: 'WHITE', rank: 'SUNDAY', isObligatory: true, note: 'Lễ Lòng Chúa Thương Xót' },

  // THÁNG 5
  { date: '2026-05-01', massName: 'Lễ Thánh Giuse Thợ', liturgicalColor: 'WHITE', rank: 'MEMORIAL', isObligatory: false, note: 'Bổn mạng đoàn Bắc Hòa' },
  { date: '2026-05-17', massName: 'Lễ Chúa Thăng Thiên', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },
  { date: '2026-05-24', massName: 'Lễ Chúa Thánh Thần Hiện Xuống', liturgicalColor: 'RED', rank: 'SOLEMNITY', isObligatory: true, note: 'Kết thúc mùa Phục Sinh' },
  { date: '2026-05-31', massName: 'Lễ Chúa Ba Ngôi', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },

  // THÁNG 6
  { date: '2026-06-07', massName: 'Lễ Mình Máu Thánh Chúa', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },
  { date: '2026-06-12', massName: 'Lễ Thánh Tâm Chúa Giêsu', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: 'Ngày xin ơn thánh hóa linh mục' },
  { date: '2026-06-13', massName: 'Lễ Trái Tim Vẹn Sạch Đức Mẹ', liturgicalColor: 'WHITE', rank: 'MEMORIAL', isObligatory: false, note: '' },
  { date: '2026-06-24', massName: 'Lễ Sinh Nhật Thánh Gioan Tẩy Giả', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: '' },
  { date: '2026-06-29', massName: 'Lễ Thánh Phêrô và Thánh Phaolô', liturgicalColor: 'RED', rank: 'SOLEMNITY', isObligatory: false, note: '' },

  // THÁNG 8
  { date: '2026-08-06', massName: 'Lễ Chúa Hiển Dung', liturgicalColor: 'WHITE', rank: 'FEAST', isObligatory: false, note: '' },
  { date: '2026-08-15', massName: 'Lễ Đức Mẹ Hồn Xác Lên Trời', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },

  // THÁNG 9
  { date: '2026-09-14', massName: 'Lễ Suy Tôn Thánh Giá', liturgicalColor: 'RED', rank: 'FEAST', isObligatory: false, note: '' },

  // THÁNG 11
  { date: '2026-11-01', massName: 'Lễ Các Thánh Nam Nữ', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },
  { date: '2026-11-02', massName: 'Lễ Các Tín Hữu Đã Qua Đời', liturgicalColor: 'VIOLET', rank: 'FEAST', isObligatory: false, note: 'Cầu cho các linh hồn' },
  { date: '2026-11-22', massName: 'Lễ Chúa Kitô Vua Vũ Trụ', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: 'Kết thúc năm phụng vụ' },
  { date: '2026-11-24', massName: 'Lễ Các Thánh Tử Đạo Việt Nam', liturgicalColor: 'RED', rank: 'SOLEMNITY', isObligatory: false, note: 'Lễ kính trọng thể tại VN' },
  { date: '2026-11-29', massName: 'Chúa Nhật 1 Mùa Vọng', liturgicalColor: 'VIOLET', rank: 'SUNDAY', isObligatory: true, note: 'Bắt đầu Năm Phụng Vụ mới' },

  // THÁNG 12
  { date: '2026-12-08', massName: 'Lễ Đức Mẹ Vô Nhiễm Nguyên Tội', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: false, note: '' },
  { date: '2026-12-25', massName: 'LỄ CHÚA GIÁNG SINH', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true, note: '' },
  { date: '2026-12-27', massName: 'Lễ Thánh Gia Thất', liturgicalColor: 'WHITE', rank: 'FEAST', isObligatory: false, note: '' },
];

export const getOrdoForMonth = (month: number, year: number): OrdoEvent[] => {
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString();
  const monthData = ORDO_DATA_2026.filter(e => e.date.startsWith(`${yearStr}-${monthStr}`));
  
  const dates: OrdoEvent[] = [...monthData];
  const d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) {
    const dateStr = d.toISOString().split('T')[0];
    const exists = monthData.find(e => e.date === dateStr);
    
    // Nếu là Chúa Nhật mà chưa có lễ đặc biệt nào
    if (!exists && d.getDay() === 0) {
      dates.push({
        date: dateStr,
        massName: `Chúa Nhật Thường Niên`,
        liturgicalColor: 'GREEN',
        rank: 'SUNDAY',
        isObligatory: true,
        note: ''
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return dates.sort((a, b) => a.date.localeCompare(b.date));
};

export const getCurrentLiturgicalColor = (): LiturgicalColor => {
  const today = new Date().toISOString().split('T')[0];
  const event = ORDO_DATA_2026.find(e => e.date === today);
  if (event) return event.liturgicalColor;
  
  // Kiểm tra mùa (Ví dụ đơn giản: Giả định đa số là mùa thường niên)
  return 'GREEN';
};

export const getOrdoEventForDate = (date: string): OrdoEvent | undefined => {
  const event = ORDO_DATA_2026.find(e => e.date === date);
  if (event) return event;
  
  const d = new Date(date);
  if (d.getDay() === 0) {
    return {
      date,
      massName: 'Chúa Nhật Thường Niên',
      liturgicalColor: 'GREEN',
      rank: 'SUNDAY',
      isObligatory: true,
      note: ''
    };
  }
  return undefined;
};
