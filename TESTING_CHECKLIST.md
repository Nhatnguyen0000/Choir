# Checklist kiểm thử chức năng – Ca Đoàn Thiên Thần

## Đã sửa lỗi
- **Thêm ca viên gấp đôi:** Đã xử lý do Realtime Supabase gửi INSERT trùng với bản ghi vừa thêm (optimistic update). Khi nhận INSERT từ Realtime, nếu đã có bản ghi cùng `id` thì chỉ cập nhật, không thêm mới. Áp dụng tương tự cho Lịch lễ, Bài hát, Giao dịch.
- **Double submit form:** Form thêm/sửa ca viên có trạng thái `isSubmitting`, nút "LƯU CA VIÊN" bị vô hiệu hóa khi đang gửi, tránh bấm hai lần.

---

## 1. Ca viên (Sổ Bộ)
- [ ] Mở **Ca Viên** → **Ghi Danh Mới** → điền form → **LƯU CA VIÊN**: chỉ xuất hiện **một** ca viên mới trong danh sách.
- [ ] Bấm **Sửa** một ca viên → sửa tên/vai trò → Lưu: dữ liệu cập nhật đúng, không tạo bản ghi trùng.
- [ ] Bấm **Xóa** → hộp thoại xác nhận hiện → chọn **Xóa**: ca viên biến mất khỏi danh sách.
- [ ] Chọn **Hủy** trong hộp xác nhận: không xóa, danh sách không đổi.
- [ ] Tìm kiếm theo tên / tên thánh: kết quả lọc đúng.
- [ ] Tab **Điểm danh**: chọn ngày, đổi trạng thái (Có mặt / Đi trễ / Vắng): lưu đúng, F5 vẫn giữ.
- [ ] **Xuất Dữ Liệu**: file Excel tải về, mở ra đúng cột và dữ liệu.

---

## 2. Lịch lễ
- [ ] **Lập Lịch Đoàn** → thêm lịch mới: chỉ có **một** dòng mới, không trùng.
- [ ] Sửa lịch (tên lễ, giờ, địa điểm): lưu đúng.
- [ ] Xóa lịch: có xác nhận, sau khi xóa mục biến mất.
- [ ] Xem lịch theo tháng, chọn ngày: chi tiết ngày hiển thị đúng (công tác ca đoàn, Ordo nếu có).

---

## 3. Thư viện Thánh Ca
- [ ] **Ghi bài mới** → thêm bài hát: chỉ **một** card mới, không trùng.
- [ ] Sửa bài (tên, tác giả, phần phụng vụ): lưu đúng.
- [ ] Xóa bài: có xác nhận, sau khi xóa bài biến mất.
- [ ] Tìm bài theo tên / nhạc sĩ: kết quả lọc đúng.

---

## 4. Ngân quỹ
- [ ] **Lập Phiếu Mới** → thêm phiếu thu/chi: chỉ **một** dòng mới trong bảng.
- [ ] Xóa phiếu: có xác nhận, số dư / tổng thu / tổng chi cập nhật đúng sau khi xóa.

---

## 5. Đồng bộ & trạng thái
- [ ] Khi đã cấu hình Supabase: header hiển thị **Cloud Trực Tuyến** (hoặc tương đương).
- [ ] Thêm/sửa/xóa bất kỳ (ca viên, lịch, bài hát, phiếu) → **F5**: dữ liệu vẫn đúng, không mất, không nhân đôi.

---

## 6. Giao diện & UX
- [ ] Toast: sau khi thêm/sửa/xóa có thông báo thành công (xanh), tự ẩn hoặc đóng được.
- [ ] Cỡ chữ và card: dễ đọc, không bị cắt chữ.
- [ ] Trên mobile: bottom nav hiển thị, chuyển tab mượt.

Chạy `npm run dev`, làm lần lượt từng mục và đánh dấu vào checklist trên.
