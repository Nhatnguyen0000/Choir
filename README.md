## Ca Đoàn Thiên Thần v2026

Hệ thống **hiệp thông Thánh Nhạc Phụng Vụ** dành riêng cho **Ca Đoàn Thiên Thần – Giáo xứ Bắc Hòa**.  
Ứng dụng hỗ trợ điều hành ca đoàn trên **máy tính** và **điện thoại** với giao diện hiện đại, nhẹ và mượt.

---

## Tính năng chính

- **Lịch Phụng vụ 2026 (Năm A)**
  - Lịch Công giáo năm 2026, cố định **Năm A (Chu kỳ I)**.
  - Lưới tháng 7×6 với:
    - **Màu áo lễ** (trắng, xanh, đỏ, tím, hồng, vàng) hiển thị bằng chấm màu.
    - **Phân bậc phụng vụ** (Lễ Trọng, Lễ Kính, Chúa Nhật, Ngày thường).
  - Khung **“Chi tiết ngày”** hiển thị:
    - Tên lễ, bậc lễ, màu áo lễ, ghi chú mùa phụng vụ, trạng thái *Lễ buộc*.
  - Thiết kế card, bo tròn, shadow nhẹ, hiển thị tốt cả trên mobile và desktop.

- **Sổ Bộ Ca Viên**
  - Quản lý hồ sơ ca viên: **Tên thánh, Họ tên, Năm sinh, Giọng/Lớp, Bổn phận, Trạng thái**.
  - **Chống trùng thông minh**:
    - Chỉ chặn khi **“Tên thánh + Họ và tên”** giống **100%** (sau khi chuẩn hóa khoảng trắng và hoa/thường).
    - Nếu khác kể cả 1 chữ/từ → **vẫn cho thêm**.
  - **Xuất Excel** sổ bộ ca viên với cột STT, Tên thánh, Họ tên, Điện thoại, Năm sinh, Lớp, Bổn phận, Trạng thái, Ngày gia nhập.
  - **Thẻ thống kê kiểu HR-dashboard**:
    - Tổng ca viên, đang hoạt động, tạm nghỉ, nghỉ hẳn.
  - **Điểm danh**:
    - Chọn ngày, bấm **Hiện diện / Đến trễ / Báo vắng** cho từng ca viên.
    - Thống kê Hiện diện / Vắng mặt theo ngày.
  - Giao diện tối ưu cho:
    - **Desktop**: bảng rộng, header cố định, thống kê dạng thẻ.
    - **Mobile**: font vừa, nút to, dễ chạm, không bị cắt ngang, danh sách full màn hình và cuộn theo trang.

- **Ngân quỹ đoàn (FinanceManagement)**
  - Theo dõi **thu – chi – số dư hiện tại**.
  - Bảng giao dịch với mô tả, số tiền, loại (IN/OUT), ngày, hạng mục.
  - Thống kê riêng:
    - **Số dư**, **Tổng thu**, **Tổng chi** với thẻ màu rõ ràng.
  - Hỗ trợ tìm kiếm nhanh theo mô tả/hạng mục.

- **Thư viện thánh ca (LibraryManagement)**
  - Lưu bài hát với: **tên, tác giả, loại, mùa phụng vụ, ghi chú kinh nghiệm**.
  - Bộ lọc nhanh theo mùa (Mùa Vọng, Giáng Sinh, Mùa Chay, Phục Sinh, Thường Niên, Kính Đức Mẹ, Lễ Các Thánh).
  - Tìm kiếm theo **tên bài** hoặc **tác giả**.
  - Thao tác **thêm / sửa / xóa bài** với dialog và xác nhận rõ ràng.

- **Dashboard**
  - Tổng quan nhanh:
    - Số ca viên, điểm danh trung bình (%), số dư quỹ, số bài thánh ca.
  - Danh sách **công tác sắp tới** (lịch lễ) rút gọn, bấm để nhảy sang trang Phụng vụ.
  - Thẻ giới thiệu **Ca Đoàn Thiên Thần — Bắc Hòa Community**, khẩu hiệu AMDG 2026 (không chèn lời Kinh Thánh không gắn với ca đoàn).

- **Trạng thái Cloud / Offline**
  - Kết nối **Supabase** khi đã cấu hình `.env` → chế độ Cloud (Realtime).
  - Nếu **chưa cấu hình**, hệ thống tự động chạy ở **Offline mode** (LocalStorage), không làm app crash.
  - Dashboard có thẻ trạng thái: *Trực tuyến / Nội bộ / Lỗi kỹ thuật*.

- **Thông báo & xác nhận**
  - **Toast** góc dưới phải để báo thành công/lỗi (thêm, sửa, xóa, xuất Excel, v.v.).
  - **ConfirmDialog** dùng chung cho các thao tác nguy hiểm (xóa ca viên, xóa giao dịch, xóa bài hát).

---

## Nâng cấp đáng giá đã thực hiện

- **Hiệu năng & cấu trúc**
  - **Loại bỏ dependency và code không dùng**:
    - Gỡ `romcal` và `@romcal/calendar.general-roman` (lịch phụng vụ dùng `services/ordoService.ts` tự xây).
    - Xóa các component không còn dùng: `AttendanceManagement`, `MemberPortal`, `ScheduleManagement`.
  - **Lazy-load từng trang (code splitting)**:
    - `Dashboard`, `MemberManagement`, `FinanceManagement`, `LibraryManagement`, `LiturgyPage` được load bằng `React.lazy` + `Suspense`.
    - Giảm kích thước bundle ban đầu, giúp trang mở **nhanh và mượt hơn**.
  - **Tối ưu Vite build**:
    - Thiết lập `manualChunks` để tách vendor thành các gói riêng: `react`, `zustand`, `lucide-react`, `xlsx`, `@google/genai`, `@supabase`.
    - Dễ cache, tải song song, tránh một file JS quá lớn.
  - **Dọn `index.html`**:
    - Gỡ `importmap` ESM cũ (Vite đã tự xử lý module).
    - Giữ cấu hình Tailwind CDN + `styles.css` cho theme nhất quán.
  - **Script build chuẩn**:
    - `npm run build` chạy `tsc --noEmit` (type check) rồi `vite build`.

- **Thiết kế & trải nghiệm người dùng**
  - **Cập nhật mạnh trang Phụng vụ & Ca Viên**:
    - Giao diện card hiện đại, bo góc lớn, glassmorphism nhẹ, màu sắc phụng vụ rõ nhưng không chói.
    - Font size tăng vừa phải, dễ đọc hơn trên màn nhỏ.
  - **Responsive thật sự cho cả desktop và mobile**:
    - Layout chính (`Layout.tsx`) có:
      - **Top bar** gọn, truncate tên trên mobile, giữ đầy đủ trên desktop.
      - **Bottom nav** riêng cho mobile (ẩn trên desktop), nút lớn, dễ chạm.
    - Các trang con (Dashboard, Ca Viên, Phụng vụ, Ngân quỹ, Thư viện) đều:
      - Dùng grid 2 cột trên mobile, 3–4 cột trên desktop.
      - Padding + font theo breakpoint (`text-sm`/`text-base`, `p-4`/`p-6`).
  - **Hỗ trợ safe-area trên điện thoại có tai thỏ/home indicator**:
    - Thêm các class `.safe-area-pt`, `.safe-area-pb` dùng `env(safe-area-inset-*)`.
    - Cập nhật `meta viewport` với `viewport-fit=cover`.

- **Quy tắc dữ liệu rõ ràng hơn**
  - **Chống trùng Ca Viên**:
    - Trước đây so theo **Tên thánh + Họ + Tên** (tách họ/tên).
    - Nay đơn giản, dễ hiểu hơn: **Tên thánh + Họ và tên** sau chuẩn hóa phải trùng toàn bộ mới bị chặn.
  - **Thông báo & bản ghi Supabase**:
    - Log Supabase “offline” chỉ hiển thị trong môi trường **DEV** (tránh noise trên production).

- **Dọn tính năng không chạy ổn trên web**
  - **Gỡ Trợ lý AI khỏi giao diện**:
    - Bỏ mục *“Trợ lý AI”* khỏi menu.
    - Bỏ route `AppView.ASSISTANT` trong `App.tsx`.
    - Lý do: Gemini qua API key AI Studio chưa hoạt động ổn định trong môi trường web hiện tại → tránh gây hiểu lầm cho người dùng.

- **Kiểm tra & ổn định dự án**
  - Thêm dependency `recharts`, `qrcode.react` cho AnalyticsDashboard và AttendanceQR; cập nhật AttendanceQR dùng `QRCodeSVG` (qrcode.react v4).
  - Store đăng nhập: typing rõ, Gemini đổi model sang `gemini-2.0-flash`; voice commands try/catch và onerror.
  - Finance/Library: gán `choirId: 'c-thienthan'` khi thêm giao dịch và bài hát; Vite optimizeDeps + manualChunks recharts.

---

## Cách chạy dự án

### Cài đặt

- **Yêu cầu**:
  - Node.js LTS (khuyến nghị 18+)
  - npm hoặc pnpm/yarn (ví dụ dưới dùng npm)

- **Cài dependencies**:

```bash
cd d:\ca-đoàn-thiên-thần-v2026
npm install
```

### Chạy dev

```bash
npm run dev
```

Mặc định Vite sẽ chạy tại `http://localhost:5173` (hoặc port khác, tùy log).

### Build & preview

```bash
npm run build
npm run preview
```

---

## Cấu hình Supabase (Cloud mode)

- Tạo file `.env` (cùng thư mục với `package.json`), thêm:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- Sau khi cấu hình:
  - App tự chuyển sang **Cloud mode**, dữ liệu đọc/ghi qua Supabase.
  - Realtime Sync đã được cấu hình sẵn trong `store.ts` (channel `global-sync`).
- Nếu **không cấu hình**:
  - App **tự động chạy Offline**, lưu dữ liệu vào LocalStorage (không crash).

---

## Cấu trúc chính của dự án

- **`App.tsx`**: Điều hướng view chính (Dashboard, Ca Viên, Phụng vụ, Ngân quỹ, Thư viện), lazy-load từng trang.
- **`components/Layout.tsx`**: Khung chung (header, bottom nav cho mobile, vùng nội dung).
- **`components/Dashboard.tsx`**: Trang tổng quan, thống kê nhanh, công tác sắp tới, giới thiệu cộng đoàn.
- **`components/MemberManagement.tsx`**: Sổ bộ + điểm danh ca viên, export Excel, thống kê HR-style.
- **`components/LiturgyPage.tsx`**: Lịch phụng vụ 2026, chi tiết ngày, màu áo lễ, bậc lễ.
- **`components/FinanceManagement.tsx`**: Thu/chi đoàn quỹ, thống kê số dư, nhật ký giao dịch.
- **`components/LibraryManagement.tsx`**: Thư viện thánh ca, lọc theo mùa, CRUD bài hát.
- **`store.ts`**: Tất cả state chính (members, events, songs, transactions, attendance), Supabase/LocalStorage logic, Toast/Notification.
- **`services/ordoService.ts`**: Dữ liệu và logic lịch phụng vụ năm 2026 (Năm A).
- **`services/supabase.ts`**: Khởi tạo client Supabase với auto-fallback Offline.
- **`index.html` + `styles.css`**: Template HTML & style nền (Inter, Lora, glass-card, animation, safe-area).

---

## Gợi ý hướng nâng cấp tiếp theo

- Đồng bộ **đa ca đoàn** (multi-choir) trong cùng giáo xứ hoặc giáo phận.
- Thêm **phân quyền người dùng** (ca trưởng, ca viên, thủ quỹ…).
- Gợi ý **setlist bài hát theo mùa phụng vụ** (kết hợp thư viện thánh ca + lịch phụng vụ).
- Bật lại Trợ lý AI khi môi trường chạy Gemini trên web ổn định (kèm guard rõ ràng).

### Roadmap tính năng nâng cấp 2026 (ưu tiên từ dễ → cực mạnh)

#### 1. AI Setlist Generator Pro (dễ, rất hữu ích)

- **Mô tả / Lợi ích**
  - Từ một ngày lễ cụ thể (ví dụ: *“Chúa Nhật XX Thường Niên – Năm A”*), hệ thống tự đề xuất **5–7 bài hát** phù hợp:
    - Đúng **mùa** và **bậc lễ**.
    - Ưu tiên bài **chưa hát gần đây**.
    - Gợi ý **giọng/ký âm** phù hợp.
  - Ca trưởng chỉ cần kéo-thả chỉnh lại thứ tự, rồi **lưu thành Setlist** → tiết kiệm **30–60 phút/tuần**.
- **Yêu cầu kỹ thuật**
  - Thư viện: `@google/genai` (đã có trong `package.json`).
  - Tạo hook: `hooks/useAISetlist.ts`.
  - Tạo trang mới: `components/SetlistAI.tsx` (lazy-load từ `App.tsx` nếu muốn).
  - Input chính: `LiturgyDay` + danh sách `songs` + lịch sử bài đã hát.
- **Snippet gợi ý (hook cơ bản)**

```ts
// hooks/useAISetlist.ts
import { GoogleGenerativeAI } from '@google/genai';
import { Song } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY || '');

export interface LiturgyDayInfo {
  name: string;
  season: string;
  rank: string;
  date: string;
}

export const useAISetlist = () => {
  const generateSetlist = async (
    liturgyDay: LiturgyDayInfo,
    songs: Song[],
    recentSongIds: string[]
  ) => {
    const recentTitles = songs
      .filter(s => recentSongIds.includes(s.id))
      .map(s => s.title)
      .join(', ');

    const prompt = `
Tạo setlist 5-7 bài cho ${liturgyDay.name} (${liturgyDay.season}, ${liturgyDay.rank}, Năm A).
Các bài hát có trong thư viện: ${songs.map(s => s.title).join(', ')}.
Các bài đã dùng gần đây: ${recentTitles || 'không có'}.
Giọng ca đoàn: SATB.
Trả về JSON dạng: [{ "title": string, "composer": string, "reason": string }].
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as Array<{ title: string; composer?: string; reason: string }>;
  };

  return { generateSetlist };
};
```

- **Ước tính thời gian Cursor**: ~1.5–2 giờ (hook + UI Setlist đơn giản + nút “Tạo setlist AI” trong Liturgy/Schedule).

---

#### 2. Voice Command Assistant toàn app (trung bình)

- **Mô tả / Lợi ích**
  - Nhận lệnh giọng nói dạng tự nhiên:
    - “Mở lịch Chúa Nhật này”
    - “Điểm danh Anre vắng hôm nay”
    - “Thêm giao dịch thu 500k cho quỹ đoàn”
  - Giúp ca trưởng thao tác **tay bận – mắt nhìn** (trên điện thoại) mà vẫn điều khiển được app.
- **Yêu cầu kỹ thuật**
  - Trình duyệt: dùng **Web Speech API** (`window.SpeechRecognition`) với fallback an toàn.
  - Parse câu lệnh bằng regex + `zod` để validate intent.
  - Thêm nút micro:
    - Ở `Layout` bottom nav, ví dụ giữa “Phụng vụ” và “Ca Viên”.
- **Snippet gợi ý (hook nhận lệnh)**

```ts
// hooks/useVoiceCommands.ts
import { useState } from 'react';

export type VoiceIntent =
  | { type: 'OPEN_LITURGY_TODAY' }
  | { type: 'OPEN_MEMBERS' }
  | { type: 'ADD_FINANCE'; amount: number; direction: 'IN' | 'OUT' }
  | { type: 'UNKNOWN' };

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);

  const parseTextToIntent = (text: string): VoiceIntent => {
    const lower = text.toLowerCase();
    if (lower.includes('mở lịch') || lower.includes('lịch chúa nhật')) {
      return { type: 'OPEN_LITURGY_TODAY' };
    }
    if (lower.includes('ca viên') || lower.includes('sổ bộ')) {
      return { type: 'OPEN_MEMBERS' };
    }
    const matchThu = lower.match(/(thu|thu vào)\s*(\d+)[k]?/);
    if (matchThu) {
      return { type: 'ADD_FINANCE', amount: Number(matchThu[2]) * 1000, direction: 'IN' };
    }
    return { type: 'UNKNOWN' };
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'vi-VN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      const intent = parseTextToIntent(text);
      window.dispatchEvent(new CustomEvent('voice-intent', { detail: intent }));
    };
    rec.start();
  };

  return { isListening, startListening };
};
```

- **Ước tính thời gian Cursor**: ~2–3 giờ (hook + nút mic + bắt sự kiện ở `Layout/App` để đổi view / mở modal).

---

#### 3. Smart Song Recommendation Engine (trung bình)

- **Mô tả / Lợi ích**
  - Gợi ý bài hát “hợp giọng đoàn” dựa trên:
    - Giọng / lớp của ca viên (Soprano/Alto/Tenor/Bass, thiếu/nhi, v.v.).
    - Lịch sử bài đã hát, điểm danh (bài nào đoàn quen, bài nào nên tập thêm).
  - Khi ca trưởng mở **Library** hoặc **SetlistAI**, có box **“Gợi ý thêm”**.
- **Yêu cầu kỹ thuật**
  - Dùng **embeddings đơn giản**:
    - Vector thuộc tính mỗi bài: `[season, difficulty, familiar, ...]`.
    - Tính similarity bằng cosine hoặc điểm số thủ công.
  - File: `services/songRecommender.ts`.
- **Snippet gợi ý**

```ts
// services/songRecommender.ts
import { Song, Member } from '../types';

export const scoreSongForChoir = (song: Song, members: Member[]) => {
  let score = 0;
  if (song.isFamiliar) score += 2;
  if ((song.category || '').toLowerCase().includes('nhập lễ')) score += 1;
  const manySoprano = members.filter(m => m.grade?.toLowerCase().includes('soprano')).length;
  if (manySoprano > members.length / 3) score += 1;
  return score;
};

export const recommendSongs = (songs: Song[], members: Member[], limit = 5) =>
  [...songs]
    .map(s => ({ song: s, score: scoreSongForChoir(s, members) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.song);
```

- **Ước tính thời gian Cursor**: ~1.5 giờ (service + tích hợp box “Gợi ý” vào Library/Setlist).

---

#### 4. Real-time Multi-Ca-Trưởng (khó vừa)

- **Mô tả / Lợi ích**
  - Nhiều ca trưởng mở cùng một lúc:
    - Cùng chỉnh **Setlist**, **Lịch lễ**, **Ngân quỹ**.
    - Thấy avatar/initial của người khác đang online, hiển thị “đang sửa”.
  - Tránh ghi đè dữ liệu, tăng tính **hiệp thông điều hành**.
- **Yêu cầu kỹ thuật**
  - Supabase Realtime:
    - Kênh `presence` (channel riêng) để broadcast ai đang online + view hiện tại.
  - File mới: `store/realtimeStore.ts` dùng `zustand`.
- **Snippet gợi ý**

```ts
// store/realtimeStore.ts
import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface PresenceState {
  peers: { id: string; name: string; view: string }[];
}

export const usePresenceStore = create<PresenceState>(() => ({
  peers: [],
}));

export const initPresenceChannel = (userId: string, name: string, view: string) => {
  const channel = supabase.channel('presence-global', {
    config: { presence: { key: userId } },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const peers = Object.entries(state).map(([id, metas]: any) => ({
        id,
        name: metas[0].name,
        view: metas[0].view,
      }));
      usePresenceStore.setState({ peers });
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ name, view });
      }
    });

  return channel;
};
```

- **Ước tính thời gian Cursor**: ~3–4 giờ (store + hiển thị avatar/indicator trên Dashboard/Liturgy/Finance).

---

#### 5. Role-Based Access Control (RBAC) đầy đủ (khó vừa)

- **Mô tả / Lợi ích**
  - Phân quyền:
    - **Admin**: full quyền.
    - **CaTruong**: Setlist, Member, Liturgy, Library.
    - **ThuQuy**: Finance.
    - **CaVien**: xem lịch, xem setlist, báo vắng.
    - **Guest**: xem lịch, xem một số thống kê.
  - Giao diện và nút hành động **ẩn/hiện theo role**, tránh thao tác nhầm.
- **Yêu cầu kỹ thuật**
  - Supabase:
    - Bảng `profiles` lưu `role`.
    - RLS cho `members`, `transactions`, `songs` theo role (tùy mức độ chặt).
  - Frontend:
    - Mở rộng `useAuthStore` để có `role`.
    - Tạo `withRoleGuard` HOC hoặc hook `useRequireRole`.
- **Snippet gợi ý**

```ts
// hooks/useRole.ts
import { useAuthStore } from '../store';

export const useRole = () => {
  const user = useAuthStore(s => s.user);
  const role = user?.role || 'CaTruong';
  const canEditFinance = role === 'Admin' || role === 'ThuQuy';
  return { role, canEditFinance };
};
```

- **Ước tính thời gian Cursor**: ~3–4 giờ (sửa auth store + ẩn/hiện nút + chuẩn bị RLS).

---

#### 6. Ca Viên Self-Service Portal (khó vừa)

- **Mô tả / Lợi ích**
  - Ca viên đăng nhập riêng để:
    - Xem lịch hát cá nhân, setlist sắp tới.
    - Báo vắng / xin nghỉ.
    - Nghe lại rehearsal (nếu có).
  - Giảm tải cho ca trưởng trong việc cập nhật thông tin lặt vặt.
- **Yêu cầu kỹ thuật**
  - Tạo trang riêng: `components/MemberSelfPortal.tsx` (lazy-load).
  - Route điều kiện dựa trên role = `CaVien`.
  - API: đọc `attendance`, `schedule_events`, `songs`.
- **Snippet gợi ý**

```tsx
// components/MemberSelfPortal.tsx
import React from 'react';
import { useMemberStore } from '../store';

const MemberSelfPortal: React.FC = () => {
  const { members, attendanceData } = useMemberStore();
  const currentMember = members[0]; // TODO: map theo user đăng nhập

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h1 className="sacred-title text-2xl font-bold text-slate-900">Xin chào {currentMember?.name}</h1>
      <p className="text-xs text-slate-500 uppercase tracking-widest">Lịch hát cá nhân & điểm danh</p>
      {/* TODO: render lịch + nút báo vắng */}
    </div>
  );
};

export default MemberSelfPortal;
```

- **Ước tính thời gian Cursor**: ~3 giờ (UI + hook lọc dữ liệu ca viên hiện tại).

---

#### 7. Liturgical Analytics Dashboard 2.0 (khó)

- **Mô tả / Lợi ích**
  - Biểu đồ trực quan:
    - Điểm danh theo **mùa phụng vụ**.
    - Top 10 bài hát theo mùa.
    - Dòng tiền quỹ theo quý + dự báo đơn giản.
    - Tỷ lệ ca viên hoạt động theo tháng.
  - Giúp ca trưởng/ban điều hành **báo cáo cuối năm** và điều chỉnh mục vụ.
- **Yêu cầu kỹ thuật**
  - Thư viện: `recharts` (hoặc tương đương) + (tuỳ chọn) `@tanstack/react-query`.
  - Tạo trang: `components/AnalyticsDashboard.tsx`.
- **Snippet gợi ý**

```tsx
// components/AnalyticsDashboard.tsx (mẫu nhỏ)
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemberStore } from '../store';

const AnalyticsDashboard: React.FC = () => {
  const { attendanceData } = useMemberStore();
  const chartData = attendanceData.map(d => ({
    date: d.date,
    present: d.records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length,
  }));

  return (
    <div className="w-full h-80 card p-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
        Điểm danh theo ngày
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsDashboard;
```

- **Ước tính thời gian Cursor**: ~3–4 giờ (nhiều biểu đồ + chuẩn hóa dữ liệu).

---

#### 8. Annual Report Generator (PDF) (khó)

- **Mô tả / Lợi ích**
  - Nút “**Tạo báo cáo năm 2026 gửi Cha xứ**”:
    - Xuất PDF 5–10 trang:
      - Tổng quan hoạt động, thống kê điểm danh, quỹ, setlist theo mùa.
      - Logo Ca đoàn, AMDG, chỗ ký tên.
  - Giúp **rút gọn việc làm báo cáo cuối năm**.
- **Yêu cầu kỹ thuật**
  - Thư viện: `jspdf` + `html2canvas`.
  - Section ẩn trên UI (hoặc popup) để render nội dung rồi chuyển thành canvas.
- **Snippet gợi ý**

```ts
// services/reportService.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportAnnualReport = async (elementId: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save('BaoCao_CaDoan_2026.pdf');
};
```

- **Ước tính thời gian Cursor**: ~3–4 giờ (section báo cáo + export PDF).

---

#### 9. Live Liturgy Mode (Chế độ hát lễ) (khó)

- **Mô tả / Lợi ích**
  - Trang full màn hình chỉ hiển thị:
    - Tên bài hát hiện tại.
    - Thứ tự (1/5, 2/5, …) và nút **Tiếp theo / Trước**.
  - Ca viên có thể quét QR để xem trang này trên điện thoại cá nhân, **đồng bộ slide** với ca trưởng.
- **Yêu cầu kỹ thuật**
  - Tạo `components/LiveLiturgy.tsx`.
  - Đồng bộ trạng thái bài hát hiện tại qua Supabase Realtime hoặc WebSocket đơn giản.
- **Snippet gợi ý**

```tsx
// components/LiveLiturgy.tsx
import React from 'react';
import { Song } from '../types';

interface LiveLiturgyProps {
  setlist: Song[];
  currentIndex: number;
  onChangeIndex: (idx: number) => void;
}

const LiveLiturgy: React.FC<LiveLiturgyProps> = ({ setlist, currentIndex, onChangeIndex }) => {
  const current = setlist[currentIndex];
  if (!current) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4">
      <p className="text-xs uppercase tracking-[0.3em] text-amberGold mb-4">Ca Đoàn Thiên Thần</p>
      <h1 className="sacred-title text-3xl md:text-5xl font-bold text-center mb-4">
        {current.title}
      </h1>
      <p className="text-sm md:text-base text-slate-300 mb-8">
        {current.composer || 'Thánh ca'} • Bài {currentIndex + 1}/{setlist.length}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => onChangeIndex(Math.max(0, currentIndex - 1))}
          className="px-6 py-3 rounded-xl bg-slate-800 text-xs font-bold uppercase tracking-widest"
        >
          Trước
        </button>
        <button
          onClick={() => onChangeIndex(Math.min(setlist.length - 1, currentIndex + 1))}
          className="px-6 py-3 rounded-xl bg-amberGold text-slate-900 text-xs font-bold uppercase tracking-widest"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default LiveLiturgy;
```

- **Ước tính thời gian Cursor**: ~3 giờ (UI + kết nối với setlist + sync Realtime cơ bản).

---

#### 10. QR Batch Attendance + NFC (khó)

- **Mô tả / Lợi ích**
  - Ca trưởng in **1 QR** cho ca đoàn:
    - Scan 1 lần điểm danh cả nhóm (ví dụ: “All PRESENT for rehearsal”).
  - Tùy chọn **NFC**: chạm thẻ/điện thoại vào để điểm danh từng người.
- **Yêu cầu kỹ thuật**
  - Thư viện QR: `qrcode.react` hoặc `qrcode`.
  - Endpoint/handler trên frontend: nhận `token` từ QR, map sang hành động `updateAttendance` theo ngày/giờ.
- **Snippet gợi ý**

```tsx
// components/AttendanceQR.tsx
import QRCode from 'qrcode.react';

const AttendanceQR: React.FC<{ date: string }> = ({ date }) => {
  const payload = JSON.stringify({ type: 'BATCH_PRESENT', date });
  return (
    <div className="flex flex-col items-center gap-2">
      <QRCode value={payload} size={160} />
      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
        Quét để điểm danh cả ca đoàn
      </p>
    </div>
  );
};
```

- **Ước tính thời gian Cursor**: ~3–4 giờ (QR + handler + UI tích hợp vào Điểm danh).

---

#### 11. Offline-First với Sync Conflict Resolver (khó cao)

- **Mô tả / Lợi ích**
  - Khi dùng trên nhiều thiết bị, có thể:
    - Mỗi thiết bị offline rồi sửa → sau đó online lại.
  - Hệ thống tự:
    - Merge thay đổi hợp lý.
    - Nếu xung đột, hiển thị “bảng so sánh 2 phiên bản” để ca trưởng chọn.
- **Yêu cầu kỹ thuật**
  - Giữ local changes queue (Array các patch chưa sync).
  - Khi online: gửi patch lên Supabase, nếu thất bại do conflict thì merge thủ công.
- **Snippet gợi ý (khung queue)**

```ts
// store/offlineQueue.ts
import { create } from 'zustand';

interface PendingChange {
  id: string;
  type: 'ADD_MEMBER' | 'UPDATE_MEMBER' | 'DELETE_MEMBER';
  payload: any;
}

export const useOfflineQueue = create<{
  changes: PendingChange[];
  addChange: (c: PendingChange) => void;
  clear: () => void;
}>((set) => ({
  changes: [],
  addChange: (c) => set((s) => ({ changes: [...s.changes, c] })),
  clear: () => set({ changes: [] }),
}));
```

- **Ước tính thời gian Cursor**: ~5–6 giờ (thiết kế merge chiến lược + UI conflict).

---

#### 12. Rehearsal Studio (khó)

- **Mô tả / Lợi ích**
  - Ghi âm / quay video buổi tập:
    - Lưu file lên Supabase Storage.
    - Gắn link vào bài hát trong Library.
  - Ca viên sau đó có thể nghe lại tại nhà.
- **Yêu cầu kỹ thuật**
  - Dùng `MediaRecorder` (browser) để thu âm.
  - Supabase Storage bucket `rehearsals`.
  - Thêm field `rehearsalUrl` vào `songs`.
- **Snippet gợi ý**

```ts
// hooks/useRecorder.ts
import { useState, useRef } from 'react';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.start();
    setIsRecording(true);
  };

  const stop = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mr = mediaRecorderRef.current;
      if (!mr) return resolve(null);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsRecording(false);
        resolve(blob);
      };
      mr.stop();
    });
  };

  return { isRecording, start, stop };
};
```

- **Ước tính thời gian Cursor**: ~4–5 giờ (thu âm + upload + UI trên Library).

---

#### 13. Finance Auto-Categorization + Budget Planning (khó)

- **Mô tả / Lợi ích**
  - Khi nhập mô tả giao dịch:
    - “Thu tiền lễ”, “Mua hoa phụng vụ”, “Họp mặt cuối năm”… → AI tự gợi ý hạng mục: Thu lễ, Hoa lễ, Sinh hoạt, v.v.
  - Đặt **ngân sách** theo mùa (ví dụ: Mùa Chay chi ≤ 5 triệu).
- **Yêu cầu kỹ thuật**
  - Dùng rule-based đơn giản + (tuỳ chọn) Gemini cho các mô tả khó.
  - Thêm cấu hình ngân sách trong `store` hoặc file `config/budget.ts`.
- **Snippet gợi ý**

```ts
// services/financeCategorizer.ts
export const suggestCategory = (description: string): string => {
  const d = description.toLowerCase();
  if (d.includes('lễ') || d.includes('bổng lễ')) return 'Thu lễ';
  if (d.includes('hoa') || d.includes('phụng vụ')) return 'Hoa lễ';
  if (d.includes('ăn') || d.includes('tiệc')) return 'Sinh hoạt';
  return 'Khác';
};
```

- **Ước tính thời gian Cursor**: ~2–3 giờ (rule set + UI gợi ý trong Finance).

---

#### 14. Notification Center + Push (khó cao)

- **Mô tả / Lợi ích**
  - Gửi thông báo:
    - “Lễ mai 17h30 – hát 6 bài”.
    - “Ca viên Anre vắng 3 tuần liên tiếp”.
  - Tuỳ chọn **push notification** trên mobile (PWA).
- **Yêu cầu kỹ thuật**
  - Bảng `notifications` (Supabase).
  - Máy chủ/Edge Function hoặc cron job để tạo thông báo định kỳ.
  - Frontend: Notification Center UI + badge số lượng chưa đọc.
- **Snippet gợi ý (tạo noti đơn giản từ frontend)**

```ts
// services/notificationService.ts
import { supabase } from '../services/supabase';

export const sendNotification = async (title: string, content: string) => {
  await supabase.from('notifications').insert({
    title,
    content,
    is_read: false,
    created_at: new Date().toISOString(),
  });
};
```

- **Ước tính thời gian Cursor**: ~4–5 giờ (UI + trigger gửi noti theo sự kiện).

---

#### 15. Multi-Choir Support (cực mạnh)

- **Mô tả / Lợi ích**
  - Một app có thể phục vụ **nhiều ca đoàn**:
    - Bắc Hòa, Đông Hòa, Tân Hòa, …
  - Mỗi ca đoàn có:
    - Sổ bộ ca viên, lịch lễ, thư viện thánh ca, quỹ riêng.
  - Admin cấp giáo xứ/giáo phận có thể xem **tổng hợp**.
- **Yêu cầu kỹ thuật**
  - Bảng `choirs` (Supabase).
  - Tất cả bảng chính (`members`, `songs`, `transactions`, `schedule_events`, `attendance`) dùng `choir_id`.
  - RLS theo `choir_id`.
  - Frontend:
    - `useAuthStore` lưu `currentChoir`.
    - Dropdown chọn ca đoàn ở header.
- **Snippet gợi ý**

```ts
// types.ts (bổ sung cho multi-choir)
export interface Choir {
  id: string;
  name: string;
  parish: string;
}
```

- **Ước tính thời gian Cursor**: ~1–2 ngày làm việc (refactor toàn bộ store + query + UI chọn ca đoàn).

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RlqxtBBSrCFHQE3hwnjliQSaZxiKvpf2

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Cấu hình biến môi trường trong [.env](.env) hoặc [.env.local](.env.local):
   - `API_KEY` hoặc `GEMINI_API_KEY`: API key Gemini (lấy tại [Google AI Studio](https://aistudio.google.com/app/apikey))
   - `SUPABASE_URL`: URL dự án Supabase (Project Settings → API)
   - `SUPABASE_ANON_KEY`: Anon key của Supabase (Project Settings → API)
3. Run the app: `npm run dev`

## Kết nối Supabase

Ứng dụng đã tích hợp Supabase để lưu và đồng bộ dữ liệu (thành viên, lịch, bài hát, tài chính, điểm danh). Khi có `SUPABASE_URL` và `SUPABASE_ANON_KEY`, app chạy ở chế độ cloud; nếu không có, dữ liệu lưu trên LocalStorage.

### Các bước kết nối

1. **Tạo dự án Supabase**  
   Đăng ký tại [supabase.com](https://supabase.com) → New project → chọn Organization và Database password.

2. **Lấy URL và Anon key**  
   Vào **Project Settings** → **API**: copy **Project URL** và **anon public** key vào `.env`:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Tạo bảng trong Supabase**  
   Vào **SQL Editor** → New query → dán toàn bộ nội dung file [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) → Run.  
   Script tạo các bảng: `members`, `schedule_events`, `songs`, `transactions`, `attendance`, bật Realtime và RLS cơ bản.

4. **Bật Realtime (nếu cần)**  
   Vào **Database** → **Replication** → bật replication cho các bảng trên (để đồng bộ theo thời gian thực giữa nhiều tab/thiết bị).

Sau khi chạy migration và cấu hình env, khởi động lại `npm run dev`; app sẽ dùng Supabase và hiển thị trạng thái đồng bộ (ví dụ "Đang kết nối" / "Đã kết nối") trên giao diện.
