import type { Song } from '../types';

const C = 'c-thienthan';

type S = Omit<Song, 'id'>;

const s = (title: string, composer: string, category: string, seasons: string[], familiar = true): S => ({
  choirId: C, title, composer, category, liturgicalSeasons: seasons, isFamiliar: familiar,
});

export function getDefaultSeedSongs(): Song[] {
  const all: S[] = [
    // ════════════════════════════════════════════
    //  MÙA VỌNG (ADVENT)
    // ════════════════════════════════════════════
    // -- Chúa Nhật I Mùa Vọng --
    s('Trời Cao Hãy Đổ Sương', 'Lm. Kim Long', 'Nhập lễ', ['ADVENT']),
    s('Chúa Đến Việt Nam', 'Lm. Kim Long', 'Nhập lễ', ['ADVENT']),
    s('Xin Hãy Sai Đấng Cứu Thế', 'Lm. Thành Tâm', 'Đáp ca', ['ADVENT']),
    s('Dâng Niềm Trông Đợi', 'Lm. Nguyễn Duy', 'Dâng lễ', ['ADVENT'], false),
    s('Hãy Tỉnh Thức', 'Lm. Mi Trầm', 'Hiệp lễ', ['ADVENT']),
    s('Vọng Chúa Đến', 'Lm. Hoàng Dũng', 'Kết lễ', ['ADVENT'], false),
    // -- Chúa Nhật II Mùa Vọng --
    s('Đây Ngày Đức Chúa Đến', 'Lm. Thành Tâm', 'Nhập lễ', ['ADVENT']),
    s('Hãy Dọn Đường Chúa', 'Lm. Kim Long', 'Đáp ca', ['ADVENT']),
    s('Con Đường Chúa Đã Đi Qua', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['ADVENT'], false),
    // -- Chúa Nhật III Mùa Vọng --
    s('Hãy Vui Lên', 'Lm. Thành Tâm', 'Nhập lễ', ['ADVENT']),
    s('Mừng Vui Lên', 'Lm. Mi Trầm', 'Đáp ca', ['ADVENT']),
    // -- Chúa Nhật IV Mùa Vọng --
    s('Nguyện Chúa Đến', 'Lm. Kim Long', 'Nhập lễ', ['ADVENT']),
    s('Này Trinh Nữ Sẽ Thụ Thai', 'Lm. Thành Tâm', 'Đáp ca', ['ADVENT'], false),

    // ════════════════════════════════════════════
    //  MÙA GIÁNG SINH (CHRISTMAS)
    // ════════════════════════════════════════════
    // -- Đêm Giáng Sinh --
    s('Hang Bêlem', 'Lm. Kim Long', 'Nhập lễ', ['CHRISTMAS']),
    s('Đêm Thánh Vô Cùng', 'Adolphe Adam', 'Nhập lễ', ['CHRISTMAS']),
    s('Silent Night (Đêm Thánh)', 'F. Gruber', 'Nhập lễ', ['CHRISTMAS']),
    s('Chúa Đã Sinh Ra', 'Lm. Thành Tâm', 'Đáp ca', ['CHRISTMAS']),
    s('Hát Khen Mừng Chúa Giáng Sinh', 'Lm. Kim Long', 'Dâng lễ', ['CHRISTMAS']),
    s('Bài Ca Giáng Sinh', 'Lm. Nguyễn Duy', 'Dâng lễ', ['CHRISTMAS']),
    s('Chúa Hài Đồng', 'Lm. Hoàng Dũng', 'Hiệp lễ', ['CHRISTMAS'], false),
    s('Mùa Đông Năm Ấy', 'Lm. Thành Tâm', 'Hiệp lễ', ['CHRISTMAS']),
    s('Vinh Danh Thiên Chúa', 'Lm. Kim Long', 'Kết lễ', ['CHRISTMAS']),
    // -- Lễ Thánh Gia Thất --
    s('Gia Đình Thánh', 'Lm. Kim Long', 'Nhập lễ', ['CHRISTMAS']),
    s('Tình Yêu Gia Đình', 'Lm. Mi Trầm', 'Hiệp lễ', ['CHRISTMAS'], false),
    // -- Lễ Hiển Linh --
    s('Ánh Sao Dẫn Đường', 'Lm. Thành Tâm', 'Nhập lễ', ['CHRISTMAS']),
    s('Ba Vua Hành Hương', 'Truyền thống', 'Dâng lễ', ['CHRISTMAS']),

    // ════════════════════════════════════════════
    //  MÙA CHAY (LENT)
    // ════════════════════════════════════════════
    // -- Thứ Tư Lễ Tro --
    s('Xin Chúa Thương Xót', 'Truyền thống', 'Nhập lễ', ['LENT']),
    s('Hãy Trở Về', 'Lm. Kim Long', 'Nhập lễ', ['LENT']),
    s('Xin Tha Thứ', 'Lm. Thành Tâm', 'Đáp ca', ['LENT']),
    // -- Chúa Nhật I Mùa Chay --
    s('Lạy Chúa Trong Mùa Chay Này', 'Lm. Kim Long', 'Nhập lễ', ['LENT']),
    s('Chúa Là Đấng Giải Thoát', 'Lm. Thành Tâm', 'Đáp ca', ['LENT'], false),
    s('Dâng Lễ Hy Sinh', 'Lm. Nguyễn Duy', 'Dâng lễ', ['LENT']),
    s('Xin Chúa Thương Con', 'Lm. Mi Trầm', 'Hiệp lễ', ['LENT']),
    s('Khúc Ca Dâng Chúa', 'Lm. Hoàng Dũng', 'Kết lễ', ['LENT'], false),
    // -- Chúa Nhật II Mùa Chay --
    s('Chúa Biến Hình', 'Lm. Kim Long', 'Nhập lễ', ['LENT'], false),
    s('Lạy Chúa Xin Dẫn Con Đi', 'Lm. Thành Tâm', 'Đáp ca', ['LENT']),
    // -- Chúa Nhật III Mùa Chay --
    s('Nước Hằng Sống', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['LENT']),
    // -- Chúa Nhật IV Mùa Chay --
    s('Ánh Sáng Đức Tin', 'Lm. Kim Long', 'Nhập lễ', ['LENT'], false),
    // -- Chúa Nhật V Mùa Chay --
    s('Sự Sống Lại', 'Lm. Thành Tâm', 'Hiệp lễ', ['LENT']),
    // -- Lễ Lá --
    s('Hoan Hô Con Vua Đavít', 'Lm. Kim Long', 'Nhập lễ', ['LENT']),
    s('Hosanna', 'Truyền thống', 'Nhập lễ', ['LENT']),
    // -- Tam Nhật Thánh --
    s('Đây Là Mình Ta', 'Lm. Thành Tâm', 'Hiệp lễ', ['LENT']),
    s('Thập Giá Ngất Cao', 'Lm. Kim Long', 'Dâng lễ', ['LENT']),

    // ════════════════════════════════════════════
    //  MÙA PHỤC SINH (EASTER)
    // ════════════════════════════════════════════
    // -- Chúa Nhật Phục Sinh --
    s('Chúa Đã Sống Lại', 'Lm. Kim Long', 'Nhập lễ', ['EASTER']),
    s('Alleluia Chúa Đã Sống Lại', 'Lm. Thành Tâm', 'Nhập lễ', ['EASTER']),
    s('Chúa Phục Sinh', 'Lm. Kim Long', 'Đáp ca', ['EASTER']),
    s('Ngày Chúa Sống Lại', 'Truyền thống', 'Hiệp lễ', ['EASTER']),
    s('Alleluia Muôn Đời', 'Lm. Thành Tâm', 'Kết lễ', ['EASTER']),
    // -- Chúa Nhật II Phục Sinh (Lòng Thương Xót) --
    s('Lòng Thương Xót Chúa', 'Lm. Mi Trầm', 'Nhập lễ', ['EASTER']),
    s('Con Tín Thác Nơi Chúa', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['EASTER']),
    // -- Chúa Nhật III Phục Sinh --
    s('Hãy Vui Mừng Lên', 'Lm. Hoàng Dũng', 'Dâng lễ', ['EASTER'], false),
    s('Chúa Đã Hiện Ra', 'Lm. Kim Long', 'Hiệp lễ', ['EASTER']),
    // -- Chúa Nhật IV Phục Sinh (Chúa Chiên Lành) --
    s('Chúa Là Mục Tử Nhân Lành', 'Lm. Thành Tâm', 'Nhập lễ', ['EASTER']),
    s('Mục Tử Tốt Lành', 'Lm. Kim Long', 'Đáp ca', ['EASTER']),
    // -- Chúa Nhật V Phục Sinh --
    s('Đường Sự Thật Sự Sống', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['EASTER'], false),
    // -- Chúa Nhật VI Phục Sinh --
    s('Thánh Thần Hãy Đến', 'Lm. Kim Long', 'Nhập lễ', ['EASTER']),
    // -- Lễ Chúa Thăng Thiên --
    s('Chúa Lên Trời', 'Lm. Thành Tâm', 'Nhập lễ', ['EASTER']),
    s('Hãy Đi Rao Giảng', 'Lm. Kim Long', 'Kết lễ', ['EASTER']),
    // -- Lễ Chúa Thánh Thần Hiện Xuống --
    s('Lạy Chúa Thánh Thần', 'Lm. Kim Long', 'Nhập lễ', ['EASTER']),
    s('Xin Ban Thánh Thần', 'Lm. Mi Trầm', 'Đáp ca', ['EASTER']),
    s('Ngọn Lửa Tình Yêu', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['EASTER']),

    // ════════════════════════════════════════════
    //  MÙA THƯỜNG NIÊN (ORDINARY)
    // ════════════════════════════════════════════
    // -- Chúa Nhật II Thường Niên --
    s('Lạy Chúa Xin Thương Xót', 'Lm. Kim Long', 'Nhập lễ', ['ORDINARY']),
    s('Này Con Đây', 'Lm. Thành Tâm', 'Đáp ca', ['ORDINARY']),
    // -- Chúa Nhật III Thường Niên --
    s('Hãy Theo Ta', 'Lm. Kim Long', 'Nhập lễ', ['ORDINARY']),
    s('Chúa Gọi Con', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['ORDINARY']),
    // -- Chúa Nhật IV Thường Niên --
    s('Phúc Cho Ai', 'Lm. Thành Tâm', 'Nhập lễ', ['ORDINARY'], false),
    // -- Chúa Nhật V Thường Niên --
    s('Muối Cho Đời', 'Lm. Kim Long', 'Hiệp lễ', ['ORDINARY']),
    // -- Chúa Nhật VI–X Thường Niên --
    s('Chúa Là Mục Tử', 'Lm. Thành Tâm', 'Đáp ca', ['ORDINARY']),
    s('Dâng Lên Chúa', 'Lm. Hoàng Dũng', 'Dâng lễ', ['ORDINARY'], false),
    s('Bánh Trường Sinh', 'Lm. Kim Long', 'Hiệp lễ', ['ORDINARY']),
    s('Chúc Tụng Chúa', 'Truyền thống', 'Kết lễ', ['ORDINARY']),
    // -- Chúa Nhật XI–XV Thường Niên --
    s('Xin Vâng Ý Cha', 'Lm. Nguyễn Duy', 'Nhập lễ', ['ORDINARY']),
    s('Hạt Giống Lời Chúa', 'Lm. Kim Long', 'Đáp ca', ['ORDINARY']),
    s('Lời Chúa Là Ánh Sáng', 'Lm. Thành Tâm', 'Hiệp lễ', ['ORDINARY']),
    // -- Chúa Nhật XVI–XX Thường Niên --
    s('Tình Chúa Yêu Thương', 'Lm. Mi Trầm', 'Dâng lễ', ['ORDINARY']),
    s('Thân Lúa Miến', 'Lm. Kim Long', 'Hiệp lễ', ['ORDINARY'], false),
    s('Chúa Nuôi Dân Ngài', 'Lm. Thành Tâm', 'Hiệp lễ', ['ORDINARY']),
    // -- Chúa Nhật XXI–XXV Thường Niên --
    s('Phêrô Tuyên Xưng Đức Tin', 'Lm. Kim Long', 'Nhập lễ', ['ORDINARY'], false),
    s('Ai Muốn Theo Ta', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['ORDINARY']),
    // -- Chúa Nhật XXVI–XXX Thường Niên --
    s('Giới Răn Yêu Thương', 'Lm. Thành Tâm', 'Nhập lễ', ['ORDINARY']),
    s('Yêu Thương Nhau', 'Lm. Kim Long', 'Hiệp lễ', ['ORDINARY']),
    // -- Chúa Nhật XXXI–XXXIII Thường Niên --
    s('Nén Bạc Chúa Trao', 'Lm. Mi Trầm', 'Dâng lễ', ['ORDINARY'], false),
    s('Hãy Tỉnh Thức Và Cầu Nguyện', 'Lm. Nguyễn Duy', 'Hiệp lễ', ['ORDINARY']),
    // -- Lễ Chúa Kitô Vua --
    s('Chúa Là Vua', 'Lm. Kim Long', 'Nhập lễ', ['ORDINARY']),
    s('Vua Tình Yêu', 'Lm. Thành Tâm', 'Hiệp lễ', ['ORDINARY']),

    // ════════════════════════════════════════════
    //  LỄ TRỌNG & LỄ KÍNH ĐẶC BIỆT
    // ════════════════════════════════════════════
    // -- Lễ Chúa Ba Ngôi --
    s('Vinh Danh Ba Ngôi', 'Lm. Kim Long', 'Nhập lễ', ['ORDINARY']),
    // -- Lễ Mình Máu Thánh Chúa --
    s('Này Là Mình Ta', 'Lm. Thành Tâm', 'Hiệp lễ', ['ORDINARY']),
    s('Bánh Hằng Sống', 'Lm. Kim Long', 'Hiệp lễ', ['ORDINARY']),
    // -- Lễ Thánh Tâm Chúa Giêsu --
    s('Thánh Tâm Chúa Giêsu', 'Lm. Mi Trầm', 'Nhập lễ', ['ORDINARY'], false),

    // ════════════════════════════════════════════
    //  KÍNH ĐỨC MẸ
    // ════════════════════════════════════════════
    s('Kính Mừng Maria', 'Lm. Kim Long', 'Kính Đức Mẹ', ['ORDINARY', 'CHRISTMAS']),
    s('Lạy Nữ Vương', 'Truyền thống', 'Kính Đức Mẹ', ['ORDINARY']),
    s('Xin Mẹ Gìn Giữ', 'Lm. Thành Tâm', 'Kính Đức Mẹ', ['ORDINARY'], false),
    s('Ave Maria', 'Lm. Kim Long', 'Kính Đức Mẹ', ['ORDINARY', 'ADVENT']),
    s('Mẹ Ơi Con Yêu Mẹ', 'Lm. Nguyễn Duy', 'Kính Đức Mẹ', ['ORDINARY']),
    s('Dâng Mẹ', 'Lm. Mi Trầm', 'Kính Đức Mẹ', ['ORDINARY']),
    s('Mẹ Từ Bi', 'Truyền thống', 'Kính Đức Mẹ', ['ORDINARY', 'LENT']),
    // -- Lễ Đức Mẹ Lên Trời (15/8) --
    s('Mẹ Lên Trời', 'Lm. Kim Long', 'Kính Đức Mẹ', ['ORDINARY']),
    // -- Lễ Đức Mẹ Mân Côi (7/10) --
    s('Mân Côi Mùa Hoa', 'Lm. Thành Tâm', 'Kính Đức Mẹ', ['ORDINARY']),

    // ════════════════════════════════════════════
    //  KÍNH CÁC THÁNH
    // ════════════════════════════════════════════
    s('Các Thánh Trên Trời', 'Lm. Kim Long', 'Kính Các Thánh', ['ORDINARY']),
    s('Xin Các Thánh Cầu Bầu', 'Truyền thống', 'Kính Các Thánh', ['ORDINARY']),
    s('Gương Các Thánh', 'Lm. Thành Tâm', 'Kính Các Thánh', ['ORDINARY'], false),

    // ════════════════════════════════════════════
    //  ĐA MÙA (dùng nhiều mùa)
    // ════════════════════════════════════════════
    s('Lạy Cha Chúng Con', 'Truyền thống', 'Nhập lễ', ['ORDINARY', 'ADVENT', 'LENT']),
    s('Con Thiên Chúa', 'Lm. Kim Long', 'Dâng lễ', ['ORDINARY', 'EASTER']),
    s('Xin Dâng Lên Cha', 'Lm. Nguyễn Duy', 'Dâng lễ', ['ORDINARY', 'ADVENT', 'LENT', 'EASTER']),
    s('Ca Nguyện Trầm Hương', 'Lm. Mi Trầm', 'Dâng lễ', ['ORDINARY', 'LENT']),
    s('Tạ Ơn Chúa', 'Lm. Kim Long', 'Kết lễ', ['ORDINARY', 'CHRISTMAS', 'EASTER']),
    s('Xin Chúa Chúc Lành', 'Lm. Thành Tâm', 'Kết lễ', ['ORDINARY', 'ADVENT', 'LENT', 'EASTER', 'CHRISTMAS']),
  ];

  return all.map((song, i) => ({ ...song, id: `seed-${i}` }));
}
