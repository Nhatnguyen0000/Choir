import { LiturgicalColor, OrdoEvent, LiturgicalRank } from '../types';

/**
 * Niên lịch Phụng vụ 2026 (Năm B - Chu kỳ II)
 * Bao gồm các ngày Lễ Trọng, Lễ Kính, Lễ Nhớ, Lễ Chúa Nhật và các biến cố Phụng vụ chính.
 * 
 * LỊCH CÔNG GIÁO 2026 - VIỆT NAM
 * Năm B - Chu kỳ II cho các bài đọc ngày thường
 * 
 * LƯU Ý: Chỉ liệt kê các lễ đặc biệt. Các Chúa Nhật sẽ được tự động tính toán.
 */

const SPECIAL_FEASTS_2026: Record<string, Partial<OrdoEvent>> = {
  // ========== THÁNG 1 ==========
  '2026-01-01': { 
    massName: 'Đức Maria, Mẹ Thiên Chúa (Lễ Trọng - Lễ Buộc)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY', 
    isObligatory: true 
  },
  '2026-01-06': { 
    massName: 'Lễ Chúa Hiển Linh (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-01-11': { 
    massName: 'Lễ Chúa Giêsu Chịu Phép Rửa (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-01-25': { 
    massName: 'Thánh Phaolô Tông Đồ Trở Lại (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 2 ==========
  '2026-02-02': { 
    massName: 'Dâng Chúa Giêsu Trong Đền Thánh (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-02-11': { 
    massName: 'Đức Mẹ Lộ Đức (Lễ Nhớ)', 
    liturgicalColor: 'WHITE', 
    rank: 'OPTIONAL' 
  },
  '2026-02-18': { 
    massName: 'THỨ TƯ LỄ TRO (Ăn Chay Kiêng Thịt - Bắt đầu Mùa Chay)', 
    liturgicalColor: 'VIOLET', 
    rank: 'SOLEMNITY' 
  },
  '2026-02-22': { 
    massName: 'Lập Quyền Thánh Phêrô (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 3 ==========
  '2026-03-19': { 
    massName: 'Thánh Giuse, Bạn Trăm Năm Đức Maria (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-03-25': { 
    massName: 'Lễ Truyền Tin (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-03-29': { 
    massName: 'CHÚA NHẬT LỄ LÁ (Tưởng niệm Chúa vào thành Giêrusalem)', 
    liturgicalColor: 'RED', 
    rank: 'SUNDAY', 
    isObligatory: true 
  },

  // ========== THÁNG 4 - TUẦN THÁNH & PHỤC SINH ==========
  '2026-04-02': { 
    massName: 'Thứ Năm Tuần Thánh (Thánh Lễ Tiệc Ly)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-04-03': { 
    massName: 'Thứ Sáu Tuần Thánh (Tưởng niệm Cuộc Thương Khó Chúa Kitô)', 
    liturgicalColor: 'RED', 
    rank: 'SOLEMNITY' 
  },
  '2026-04-04': { 
    massName: 'Thứ Bảy Tuần Thánh (Đêm Vọng Phục Sinh)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-04-05': { 
    massName: 'ĐẠI LỄ CHÚA PHỤC SINH (Lễ Trọng - Lễ Buộc)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY', 
    isObligatory: true 
  },
  '2026-04-12': { 
    massName: 'Chúa Nhật II Phục Sinh (Lễ Chúa Lòng Thương Xót)', 
    liturgicalColor: 'WHITE', 
    rank: 'SUNDAY', 
    isObligatory: true 
  },
  '2026-04-25': { 
    massName: 'Thánh Marcô, Tác giả Tin Mừng (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 5 ==========
  '2026-05-01': { 
    massName: 'Thánh Giuse Thợ (Lễ Nhớ)', 
    liturgicalColor: 'WHITE', 
    rank: 'OPTIONAL' 
  },
  '2026-05-03': { 
    massName: 'Thánh Philipphê và Giacôbê, Tông đồ (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
  '2026-05-13': { 
    massName: 'Đức Mẹ Fatima (Lễ Nhớ)', 
    liturgicalColor: 'WHITE', 
    rank: 'OPTIONAL' 
  },
  '2026-05-14': { 
    massName: 'CHÚA NHẬT CHÚA THĂNG THIÊN (Lễ Trọng - Lễ Buộc)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY', 
    isObligatory: true 
  },
  '2026-05-24': { 
    massName: 'CHÚA NHẬT CHÚA THÁNH THẦN HIỆN XUỐNG (Lễ Trọng)', 
    liturgicalColor: 'RED', 
    rank: 'SOLEMNITY',
    isObligatory: true
  },
  '2026-05-31': { 
    massName: 'CHÚA NHẬT ĐỨC CHÚA BA NGÔI (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY',
    isObligatory: true
  },

  // ========== THÁNG 6 ==========
  '2026-06-07': { 
    massName: 'CHÚA NHẬT MÌNH MÁU THÁNH CHÚA KITÔ (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY',
    isObligatory: true
  },
  '2026-06-12': { 
    massName: 'Thánh Tâm Chúa Giêsu (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-06-13': { 
    massName: 'Trái Tim Vô Nhiễm Đức Maria (Lễ Nhớ)', 
    liturgicalColor: 'WHITE', 
    rank: 'OPTIONAL' 
  },
  '2026-06-24': { 
    massName: 'Sinh Nhật Thánh Gioan Tẩy Giả (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-06-29': { 
    massName: 'Thánh Phêrô và Thánh Phaolô, Tông đồ (Lễ Trọng)', 
    liturgicalColor: 'RED', 
    rank: 'SOLEMNITY' 
  },

  // ========== THÁNG 7 ==========
  '2026-07-22': { 
    massName: 'Thánh Maria Mađalêna (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-07-25': { 
    massName: 'Thánh Giacôbê, Tông đồ (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 8 ==========
  '2026-08-06': { 
    massName: 'Chúa Hiển Dung (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-08-10': { 
    massName: 'Thánh Lôrenxô, Phó tế và Tử đạo (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
  '2026-08-15': { 
    massName: 'ĐỨC MẸ HỒN XÁC LÊN TRỜI (Lễ Trọng - Lễ Buộc)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY', 
    isObligatory: true 
  },
  '2026-08-24': { 
    massName: 'Thánh Batôlômêô, Tông đồ (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 9 ==========
  '2026-09-08': { 
    massName: 'Sinh Nhật Đức Trinh Nữ Maria (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-09-14': { 
    massName: 'Suy Tôn Thánh Giá (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
  '2026-09-21': { 
    massName: 'Thánh Mátthêu, Tông đồ và Tác giả Tin Mừng (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
  '2026-09-29': { 
    massName: 'Các Tổng Lãnh Thiên Thần (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 10 ==========
  '2026-10-01': { 
    massName: 'Thánh Têrêsa Hài Đồng Giêsu (Lễ Kính tại VN)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-10-02': { 
    massName: 'Các Thiên Thần Hộ Thủ (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-10-18': { 
    massName: 'Thánh Luca, Tác giả Tin Mừng (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
  '2026-10-28': { 
    massName: 'Thánh Simon và Thánh Giuđa, Tông đồ (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 11 ==========
  '2026-11-01': { 
    massName: 'LỄ CÁC THÁNH NAM NỮ (Lễ Trọng - Lễ Buộc)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY', 
    isObligatory: true 
  },
  '2026-11-02': { 
    massName: 'CẦU CHO CÁC TÍN HỮU ĐÃ QUA ĐỜI (Lễ Cầu Hồn)', 
    liturgicalColor: 'VIOLET', 
    rank: 'SOLEMNITY' 
  },
  '2026-11-09': { 
    massName: 'Cung hiến Đền thờ Thánh Gioan Latêranô (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-11-22': { 
    massName: 'CHÚA KITÔ VUA VŨ TRỤ (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY',
    isObligatory: true
  },
  '2026-11-24': { 
    massName: 'CÁC THÁNH TỬ ĐẠO VIỆT NAM (Lễ Trọng)', 
    liturgicalColor: 'RED', 
    rank: 'SOLEMNITY' 
  },
  '2026-11-30': { 
    massName: 'Thánh Anrê, Tông đồ (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },

  // ========== THÁNG 12 ==========
  '2026-12-08': { 
    massName: 'Đức Mẹ Vô Nhiễm Nguyên Tội (Lễ Trọng)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY' 
  },
  '2026-12-25': { 
    massName: 'ĐẠI LỄ CHÚA GIÁNG SINH (Lễ Trọng - Lễ Buộc)', 
    liturgicalColor: 'WHITE', 
    rank: 'SOLEMNITY', 
    isObligatory: true 
  },
  '2026-12-26': { 
    massName: 'Thánh Stêphanô, Tử Đạo Tiên Khởi (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
  '2026-12-27': { 
    massName: 'Thánh Gioan, Tông đồ và Tác giả Tin Mừng (Lễ Kính)', 
    liturgicalColor: 'WHITE', 
    rank: 'FEAST' 
  },
  '2026-12-28': { 
    massName: 'Các Thánh Anh Hài (Lễ Kính)', 
    liturgicalColor: 'RED', 
    rank: 'FEAST' 
  },
};

/**
 * Tính toán ngày Chúa Nhật trong năm
 */
const getSundaysInYear = (year: number): string[] => {
  const sundays: string[] = [];
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  
  // Tìm Chúa Nhật đầu tiên
  let currentDate = new Date(firstDay);
  const dayOfWeek = currentDate.getDay();
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  currentDate.setDate(currentDate.getDate() + daysToAdd);
  
  while (currentDate <= lastDay) {
    sundays.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return sundays;
};

/**
 * Xác định tên Chúa Nhật theo mùa phụng vụ
 */
const getSundayName = (date: Date, season: { color: LiturgicalColor; name: string }): string => {
  const seasonName = season.name;
  const year = date.getFullYear();
  
  if (seasonName === 'Mùa Chay') {
    const ashWed = new Date(year, 1, 18);
    const daysSinceAshWed = Math.floor((date.getTime() - ashWed.getTime()) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceAshWed / 7) + 1;
    return `Chúa Nhật ${weekNumber} Mùa Chay`;
  } else if (seasonName === 'Mùa Phục Sinh') {
    const easter = new Date(year, 3, 5);
    const daysSinceEaster = Math.floor((date.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceEaster / 7) + 1;
    if (weekNumber === 1) return 'Chúa Nhật II Phục Sinh (Lễ Chúa Lòng Thương Xót)';
    return `Chúa Nhật ${weekNumber + 1} Phục Sinh`;
  } else if (seasonName === 'Mùa Vọng') {
    const advent1 = new Date(year, 10, 29);
    const daysSinceAdvent = Math.floor((date.getTime() - advent1.getTime()) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceAdvent / 7) + 1;
    return `Chúa Nhật ${weekNumber} Mùa Vọng`;
  } else if (seasonName === 'Mùa Giáng Sinh') {
    const christmas = new Date(year, 11, 25);
    const daysSinceChristmas = Math.floor((date.getTime() - christmas.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceChristmas >= 0 && daysSinceChristmas < 7) {
      return 'Chúa Nhật trong Tuần Bát Nhật Giáng Sinh';
    }
    return 'Chúa Nhật Mùa Giáng Sinh';
  }
  
  // Mùa Thường Niên - tính từ Chúa Nhật sau Lễ Chúa Thánh Thần Hiện Xuống
  return `Chúa Nhật ${seasonName}`;
};

export const getOrdoForMonth = (month: number, year: number): OrdoEvent[] => {
  const dates: OrdoEvent[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  // Lấy tất cả Chúa Nhật trong năm
  const allSundays = getSundaysInYear(year);
  
  // Đếm số Chúa Nhật trong Mùa Thường Niên (sau Lễ Chúa Thánh Thần Hiện Xuống)
  let ordinaryTimeSundayCount = 0;
  const pentecost = new Date(year, 4, 24);

  const getSeasonInfo = (date: Date): { color: LiturgicalColor; name: string } => {
    const time = date.getTime();
    
    // Mùa Giáng Sinh (25/12 đến 11/01/2026)
    const christmasStart = new Date(year, 11, 25).getTime();
    const christmasEnd = new Date(year, 0, 11).getTime();
    if ((time >= christmasStart && year === year) || (time <= christmasEnd && year === year)) {
      return { color: 'WHITE', name: 'Mùa Giáng Sinh' };
    }
    
    // Mùa Chay (18/02 đến 04/04)
    const ashWed = new Date(year, 1, 18).getTime();
    const easterEve = new Date(year, 3, 4).getTime();
    if (time >= ashWed && time <= easterEve) {
      return { color: 'VIOLET', name: 'Mùa Chay' };
    }
    
    // Mùa Phục Sinh (05/04 đến 24/05)
    const easter = new Date(year, 3, 5).getTime();
    const pentecostTime = new Date(year, 4, 24).getTime();
    if (time >= easter && time <= pentecostTime) {
      return { color: 'WHITE', name: 'Mùa Phục Sinh' };
    }
    
    // Mùa Vọng (29/11 đến 24/12)
    const advent1 = new Date(year, 10, 29).getTime();
    const xmasEve = new Date(year, 11, 24).getTime();
    if (time >= advent1 && time <= xmasEve) {
      return { color: 'VIOLET', name: 'Mùa Vọng' };
    }
    
    // Mùa Giáng Sinh cuối năm (từ 25/12)
    if (time >= new Date(year, 11, 25).getTime()) {
      return { color: 'WHITE', name: 'Mùa Giáng Sinh' };
    }

    return { color: 'GREEN', name: 'Mùa Thường Niên' };
  };

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const special = SPECIAL_FEASTS_2026[dateStr];
    const season = getSeasonInfo(d);
    const isSunday = allSundays.includes(dateStr);

    if (special) {
      // Nếu có lễ đặc biệt, ưu tiên lễ đặc biệt
      dates.push({
        date: dateStr,
        massName: special.massName!,
        liturgicalColor: special.liturgicalColor as LiturgicalColor,
        rank: (special.rank as LiturgicalRank) || 'SOLEMNITY',
        isObligatory: !!special.isObligatory,
        note: special.note || season.name
      });
    } else if (isSunday) {
      // Chúa Nhật không có lễ đặc biệt
      if (season.name === 'Mùa Thường Niên' && d > pentecost) {
        // Tính số Chúa Nhật trong Mùa Thường Niên (sau Lễ Chúa Thánh Thần Hiện Xuống)
        const daysSincePentecost = Math.floor((d.getTime() - pentecost.getTime()) / (1000 * 60 * 60 * 24));
        const weekNumber = Math.floor(daysSincePentecost / 7);
        dates.push({
          date: dateStr,
          massName: `Chúa Nhật ${weekNumber} Thường Niên`,
          liturgicalColor: season.color,
          rank: 'SUNDAY',
          isObligatory: true,
          note: season.name
        });
      } else {
        dates.push({
          date: dateStr,
          massName: getSundayName(d, season),
          liturgicalColor: season.color,
          rank: 'SUNDAY',
          isObligatory: true,
          note: season.name
        });
      }
    } else {
      // Ngày thường
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
