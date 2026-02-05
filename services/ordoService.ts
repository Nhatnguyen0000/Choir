
import { LiturgicalColor, OrdoEvent, LiturgicalRank } from '../types';

/**
 * Niên lịch Phụng vụ 2026 (Năm B - Chu kỳ II)
 * Tích hợp đầy đủ Lễ Trọng, Lễ Kính, Lễ Buộc và các Mùa Phụng vụ.
 */
const SPECIAL_FEASTS_2026: Record<string, Partial<OrdoEvent>> = {
  // THÁNG 1
  '2026-01-01': { massName: 'Đức Maria, Mẹ Thiên Chúa (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-01-04': { massName: 'Lễ Chúa Hiển Linh (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-01-11': { massName: 'Chúa Giêsu Chịu Phép Rửa (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-01-25': { massName: 'Thánh Phaolô Tông Đồ Trở Lại (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  
  // THÁNG 2
  '2026-02-02': { massName: 'Dâng Chúa Trong Đền Thánh (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-02-18': { massName: 'THỨ TƯ LỄ TRO (Ăn chay kiêng thịt)', liturgicalColor: 'VIOLET', rank: 'SOLEMNITY' },
  
  // THÁNG 3
  '2026-03-15': { massName: 'Chúa Nhật IV Mùa Chay (Chúa Nhật Hồng)', liturgicalColor: 'ROSE', rank: 'SUNDAY' },
  '2026-03-19': { massName: 'Thánh Giuse, Bạn Trăm Năm Đức Maria (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-03-25': { massName: 'Lễ Truyền Tin (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-03-29': { massName: 'CHÚA NHẬT LỄ LÁ (Tuần Thánh)', liturgicalColor: 'RED', rank: 'SUNDAY' },

  // THÁNG 4
  '2026-04-02': { massName: 'Thứ Năm Tuần Thánh (Tiệc Ly)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-04-03': { massName: 'Thứ Sáu Tuần Thánh (Thương Khó)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },
  '2026-04-04': { massName: 'Thứ Bảy Tuần Thánh (Vọng Phục Sinh)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-04-05': { massName: 'ĐẠI LỄ CHÚA PHỤC SINH (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-04-12': { massName: 'Chúa Nhật II Phục Sinh (Lòng Thương Xót)', liturgicalColor: 'WHITE', rank: 'SUNDAY' },
  '2026-04-25': { massName: 'Thánh Marcô, Thánh Sử (Lễ Kính)', liturgicalColor: 'RED', rank: 'FEAST' },

  // THÁNG 5
  '2026-05-14': { massName: 'Lễ Chúa Thăng Thiên (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-05-24': { massName: 'CHÚA NHẬT HIỆN XUỐNG (Lễ Trọng)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },
  '2026-05-31': { massName: 'Lễ Chúa Ba Ngôi (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },

  // THÁNG 6
  '2026-06-07': { massName: 'Lễ Mình Máu Thánh Chúa (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-06-12': { massName: 'Thánh Tâm Chúa Giêsu (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-06-24': { massName: 'Sinh Nhật Thánh Gioan Tẩy Giả (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-06-29': { massName: 'Thánh Phêrô và Phaolô Tông Đồ (Lễ Trọng)', liturgicalColor: 'RED', rank: 'SOLEMNITY', isObligatory: true },

  // THÁNG 8
  '2026-08-06': { massName: 'Chúa Hiển Dung (Lễ Kính)', liturgicalColor: 'WHITE', rank: 'FEAST' },
  '2026-08-15': { massName: 'Đức Mẹ Hồn Xác Lên Trời (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },

  // THÁNG 11
  '2026-11-01': { massName: 'Lễ Các Thánh Nam Nữ (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
  '2026-11-02': { massName: 'Cầu Cho Tín Hữu Đã Qua Đời', liturgicalColor: 'VIOLET', rank: 'SOLEMNITY' },
  '2026-11-22': { massName: 'Lễ Chúa Kitô Vua Vũ Trụ (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-11-24': { massName: 'Các Thánh Tử Đạo Việt Nam (Lễ Trọng)', liturgicalColor: 'RED', rank: 'SOLEMNITY' },
  '2026-11-29': { massName: 'Chúa Nhật I Mùa Vọng', liturgicalColor: 'VIOLET', rank: 'SUNDAY' },

  // THÁNG 12
  '2026-12-08': { massName: 'Đức Maria Vô Nhiễm (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY' },
  '2026-12-13': { massName: 'Chúa Nhật III Mùa Vọng (Chúa Nhật Hồng)', liturgicalColor: 'ROSE', rank: 'SUNDAY' },
  '2026-12-25': { massName: 'ĐẠI LỄ CHÚA GIÁNG SINH (Lễ Trọng)', liturgicalColor: 'WHITE', rank: 'SOLEMNITY', isObligatory: true },
};

export const getOrdoForMonth = (month: number, year: number): OrdoEvent[] => {
  const dates: OrdoEvent[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const getSeasonInfo = (date: Date): { color: LiturgicalColor; name: string } => {
    const time = date.getTime();
    
    // Mùa Giáng Sinh 2025/2026
    if (time <= new Date(year, 0, 11).getTime()) return { color: 'WHITE', name: 'Mùa Giáng Sinh' };
    
    // Mùa Chay (18/02/2026 - 04/04/2026)
    const ashWed = new Date(year, 1, 18).getTime();
    const easterEve = new Date(year, 3, 4).getTime();
    if (time >= ashWed && time <= easterEve) return { color: 'VIOLET', name: 'Mùa Chay' };
    
    // Mùa Phục Sinh (05/04/2026 - 24/05/2026)
    const easter = new Date(year, 3, 5).getTime();
    const pentecost = new Date(year, 4, 24).getTime();
    if (time >= easter && time <= pentecost) return { color: 'WHITE', name: 'Mùa Phục Sinh' };
    
    // Mùa Vọng (29/11/2026 - 24/12/2026)
    const advent1 = new Date(year, 10, 29).getTime();
    const xmasEve = new Date(year, 11, 24).getTime();
    if (time >= advent1 && time <= xmasEve) return { color: 'VIOLET', name: 'Mùa Vọng' };
    
    // Giáng Sinh 2026
    if (time >= new Date(year, 11, 25).getTime()) return { color: 'WHITE', name: 'Mùa Giáng Sinh' };

    return { color: 'GREEN', name: 'Mùa Thường Niên' };
  };

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const special = SPECIAL_FEASTS_2026[dateStr];
    const season = getSeasonInfo(d);
    
    let color: LiturgicalColor = special?.liturgicalColor || (d.getDay() === 0 ? season.color : (season.color === 'WHITE' || season.color === 'VIOLET' ? season.color : 'GREEN'));
    if (special) {
      dates.push({
        date: dateStr,
        massName: special.massName!,
        liturgicalColor: color,
        rank: (special.rank as LiturgicalRank) || 'SOLEMNITY',
        isObligatory: !!special.isObligatory,
        note: season.name
      });
    } else if (d.getDay() === 0) {
      dates.push({
        date: dateStr,
        massName: `Chúa Nhật ${season.name}`,
        liturgicalColor: color,
        rank: 'SUNDAY',
        isObligatory: true,
        note: season.name
      });
    } else {
      dates.push({
        date: dateStr,
        massName: 'Ngày thường',
        liturgicalColor: color === 'ROSE' ? season.color : color,
        rank: 'OPTIONAL',
        isObligatory: false,
        note: season.name
      });
    }
  }
  return dates;
};
