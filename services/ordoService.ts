import { LiturgicalColor, OrdoEvent, LiturgicalRank } from '../types';

// Niên lịch Phụng vụ 2026 (Năm B - Chu kỳ II)
const SPECIAL_FEASTS_2026: Record<string, Partial<OrdoEvent>> = {
  // THÁNG 1
  '2026-01-01': { massName: 'Đức Maria, Mẹ Thiên Chúa (Lễ Trọng - Lễ Buộc)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-01-04': { massName: 'Lễ Chúa Hiển Linh (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-01-11': { massName: 'Lễ Chúa Giêsu Chịu Phép Rửa (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-01-25': { massName: 'Thánh Phaolô Tông Đồ Trở Lại (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  
  // THÁNG 2
  '2026-02-02': { massName: 'Dâng Chúa Giêsu Trong Đền Thánh (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-02-11': { massName: 'Đức Mẹ Lộ Đức (Lễ Nhớ)', liturgicalColor: 'WHITE', rank: 'OPTIONAL' },
  '2026-02-18': { massName: 'THỨ TƯ LỄ TRO (Ăn Chay Kiêng Thịt)', liturgicalColor: 'VIOLET', rank: 'SOLEMNITY' },
  '2026-02-22': { massName: 'Lập Quyền Thánh Phêrô (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },

  // THÁNG 3
  '2026-03-19': { massName: 'Thánh Giuse, Bạn Trăm Năm Đức Maria (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-03-25': { massName: 'Lễ Truyền Tin (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-03-29': { massName: 'CHÚA NHẬT LỄ LÁ (Tưởng niệm Chúa vào thành Gierusalem)', liturgicalColor: 'RED', rank: 'SUNDAY' },

  // THÁNG 4 - TUẦN THÁNH & PHỤC SINH
  '2026-04-02': { massName: 'Thứ Năm Tuần Thánh (Thánh Lễ Tiệc Ly)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-04-03': { massName: 'Thứ Sáu Tuần Thánh (Tưởng niệm Cuộc Thương Khó)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },
  '2026-04-04': { massName: 'Thứ Bảy Tuần Thánh (Đêm Vọng Phục Sinh)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-04-05': { massName: 'ĐẠI LỄ CHÚA PHỤC SINH (Lễ Trọng - Lễ Buộc)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-04-12': { massName: 'Chúa Nhật II Phục Sinh (Lễ Chúa Lòng Thương Xót)', liturgicalColor: 'WHITE', rank: 'SUNDAY' },
  '2026-04-25': { massName: 'Thánh Marcô, Tác giả Tin Mừng (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },

  // THÁNG 5
  '2026-05-01': { massName: 'Thánh Giuse Thợ (Lễ Nhớ)', liturgicalColor: 'WHITE', rank: 'OPTIONAL' },
  '2026-05-03': { massName: 'Thánh Philipphê và Giacôbê, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-05-13': { massName: 'Đức Mẹ Fatima (Lễ Nhớ)', liturgicalColor: 'WHITE', rank: 'OPTIONAL' },
  '2026-05-14': { massName: 'CHÚA NHẬT CHÚA THĂNG THIÊN (Lễ Trọng - Lễ Buộc)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-05-24': { massName: 'CHÚA NHẬT CHÚA THÁNH THẦN HIỆN XUỐNG (Lễ Trọng)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },
  '2026-05-31': { massName: 'CHÚA NHẬT ĐỨC CHÚA BA NGÔI (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },

  // THÁNG 6
  '2026-06-07': { massName: 'CHÚA NHẬT MÌNH MÁU THÁNH CHÚA KITÔ (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-06-12': { massName: 'Thánh Tâm Chúa Giêsu (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-06-13': { massName: 'Trái Tim Vô Nhiễm Đức Maria (Lễ Nhớ)', liturgicalColor: 'WHITE', rank: 'OPTIONAL' },
  '2026-06-24': { massName: 'Sinh Nhật Thánh Gioan Tẩy Giả (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-06-29': { massName: 'Thánh Phêrô và Thánh Phaolô, Tông đồ (Lễ Trọng)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },

  // THÁNG 7
  '2026-07-03': { massName: 'Thánh Tôma, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-07-25': { massName: 'Thánh Giacôbê, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },

  // THÁNG 8
  '2026-08-06': { massName: 'Chúa Hiển Dung (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-08-10': { massName: 'Thánh Laurensô, Phó tế Tử đạo (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-08-15': { massName: 'ĐỨC MẸ HỒN XÁC LÊN TRỜI (Lễ Trọng - Lễ Buộc)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-08-24': { massName: 'Thánh Batôlômêô, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },

  // THÁNG 9
  '2026-09-08': { massName: 'Sinh Nhật Đức Trinh Nữ Maria (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-09-14': { massName: 'Suy Tôn Thánh Giá (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-09-21': { massName: 'Thánh Matthêu, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-09-29': { massName: 'Các Tổng Lãnh Thiên Thần (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },

  // THÁNG 10
  '2026-10-01': { massName: 'Thánh Têrêsa Hài Đồng Giêsu (Lễ Kính tại VN)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-10-02': { massName: 'Các Thiên Thần Hộ Thủ (Lễ Nhớ)', liturgicalColor: 'WHITE', rank: 'OPTIONAL' },
  '2026-10-18': { massName: 'Thánh Luca, Tác giả Tin Mừng (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-10-28': { massName: 'Thánh Simôn và Thánh Giuđa, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },

  // THÁNG 11
  '2026-11-01': { massName: 'LỄ CÁC THÁNH NAM NỮ (Lễ Trọng - Lễ Buộc)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-11-02': { massName: 'CẦU CHO CÁC TÍN HỮU ĐÃ QUA ĐỜI (Lễ Cầu Hồn)', liturgicalColor: 'VIOLET', rank: 'SOLEMNITY' },
  '2026-11-09': { massName: 'Cung Hiến Thánh Đường Latêranô (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-11-22': { massName: 'CHÚA KITÔ VUA VŨ TRỤ (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-11-24': { massName: 'CÁC THÁNH TỬ ĐẠO VIỆT NAM (Lễ Trọng)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },
  '2026-11-30': { massName: 'Thánh Anrê, Tông đồ (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },

  // THÁNG 12
  '2026-12-08': { massName: 'Đức Mẹ Vô Nhiễm Nguyên Tội (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-12-25': { massName: 'ĐẠI LỄ CHÚA GIÁNG SINH (Lễ Trọng - Lễ Buộc)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-12-26': { massName: 'Thánh Stêphanô, Tử đạo đầu tiên (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
  '2026-12-27': { massName: 'Thánh Gioan, Tông đồ (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-12-28': { massName: 'Các Thánh Anh Hài (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },
};

export const getOrdoForMonth = (month: number, year: number): OrdoEvent[] => {
  const dates: OrdoEvent[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const getSeasonInfo = (date: Date): { color: LiturgicalColor; name: string } => {
    const time = date.getTime();
    const y = date.getFullYear();
    
    if (y === 2026) {
      // Mùa Giáng Sinh 2025/2026 (đến 11/01/2026)
      if (time <= new Date(2026, 0, 11).getTime()) return { color: 'WHITE', name: 'Mùa Giáng Sinh' };
      
      // Mùa Chay (18/02 đến 04/04)
      const ashWed = new Date(2026, 1, 18).getTime();
      const easterEve = new Date(2026, 3, 4).getTime();
      if (time >= ashWed && time <= easterEve) return { color: 'VIOLET', name: 'Mùa Chay' };
      
      // Mùa Phục Sinh (05/04 đến 24/05)
      const easter = new Date(2026, 3, 5).getTime();
      const pentecost = new Date(2026, 4, 24).getTime();
      if (time >= easter && time <= pentecost) return { color: 'WHITE', name: 'Mùa Phục Sinh' };
      
      // Mùa Vọng (29/11 đến 24/12)
      const advent1 = new Date(2026, 10, 29).getTime();
      const xmasEve = new Date(2026, 11, 24).getTime();
      if (time >= advent1 && time <= xmasEve) return { color: 'VIOLET', name: 'Mùa Vọng' };
      
      // Mùa Giáng Sinh 2026 (từ 25/12)
      if (time >= new Date(2026, 11, 25).getTime()) return { color: 'WHITE', name: 'Mùa Giáng Sinh' };
    }
    return { color: 'GREEN', name: 'Mùa Thường Niên' };
  };

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const special = SPECIAL_FEASTS_2026[dateStr];
    const season = getSeasonInfo(d);

    if (special) {
      dates.push({
        date: dateStr,
        massName: special.massName!,
        liturgicalColor: special.liturgicalColor as LiturgicalColor,
        rank: (special.rank as LiturgicalRank) || 'SOLEMNITY',
        isObligatory: !!special.isObligatory,
        note: special.note || season.name
      });
    } else if (d.getDay() === 0) {
      // Xác định tuần Chúa Nhật dựa trên thời điểm
      dates.push({
        date: dateStr,
        massName: `Chúa Nhật ${season.name}`,
        liturgicalColor: season.color,
        rank: 'SUNDAY',
        isObligatory: true,
        note: season.name
      });
    } else {
      dates.push({
        date: dateStr,
        massName: 'Ngày thường',
        liturgicalColor: season.color,
        rank: 'OPTIONAL',
        isObligatory: false,
        note: season.name
      });
    }
  }
  return dates;
};