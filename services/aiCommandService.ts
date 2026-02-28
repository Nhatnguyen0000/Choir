import { AppView } from '../types';

export type CommandType =
  | { type: 'NAVIGATE'; view: AppView }
  | { type: 'ADD_FINANCE'; amount: number; direction: 'IN' | 'OUT'; description?: string }
  | { type: 'OPEN_MEMBERS' }
  | { type: 'OPEN_LITURGY' }
  | { type: 'OPEN_FINANCE' }
  | { type: 'OPEN_LIBRARY' }
  | { type: 'OPEN_DASHBOARD' };

/**
 * Phân tích câu người dùng thành lệnh thực thi (điều hướng, thêm thu/chi).
 * Trả về null nếu không nhận diện được lệnh → gửi sang AI trả lời.
 */
export function parseAICommand(text: string): CommandType | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;

  // Điều hướng: "mở trang X", "chuyển sang X", "vào X", "xem X"
  const navPhrases: [RegExp, AppView][] = [
    [/mở\s*(trang\s*)?(tổng\s*quan|dashboard)/, AppView.DASHBOARD],
    [/chuyển\s*sang\s*(tổng\s*quan|dashboard)/, AppView.DASHBOARD],
    [/vào\s*(tổng\s*quan|dashboard)/, AppView.DASHBOARD],
    [/mở\s*(trang\s*)?(phụng\s*vụ|lich|lịch)/, AppView.LITURGY],
    [/chuyển\s*sang\s*(phụng\s*vụ|lich|lịch)/, AppView.LITURGY],
    [/mở\s*(trang\s*)?(ca\s*viên|sổ\s*bộ|members)/, AppView.MEMBERS],
    [/chuyển\s*sang\s*(ca\s*viên|sổ\s*bộ)/, AppView.MEMBERS],
    [/mở\s*(trang\s*)?(ngân\s*quỹ|tài\s*chính|finance)/, AppView.FINANCE],
    [/chuyển\s*sang\s*(ngân\s*quỹ|tài\s*chính)/, AppView.FINANCE],
    [/mở\s*(trang\s*)?(thánh\s*ca|thư\s*viện|library)/, AppView.LIBRARY],
    [/chuyển\s*sang\s*(thánh\s*ca|thư\s*viện)/, AppView.LIBRARY],
  ];
  for (const [re, view] of navPhrases) {
    if (re.test(t)) return { type: 'NAVIGATE', view };
  }

  // Thêm thu: "thu 500", "thu vào 500k", "ghi thu 200000"
  const thuMatch = t.match(/(?:thu\s*(?:vào)?|ghi\s*thu)\s*(\d+(?:\.\d+)?)\s*(k|nghìn|tr(iệu)?|triệu)?/);
  if (thuMatch) {
    let amount = parseFloat(thuMatch[1]);
    const unit = thuMatch[2] || '';
    if (unit === 'k' || unit === 'nghìn') amount *= 1000;
    else if (unit.startsWith('tr') || unit === 'triệu') amount *= 1_000_000;
    if (amount > 0) return { type: 'ADD_FINANCE', amount: Math.round(amount), direction: 'IN', description: 'Thu (theo lệnh AI)' };
  }

  // Thêm chi: "chi 300", "ghi chi 100k"
  const chiMatch = t.match(/(?:chi\s*(?:ra)?|ghi\s*chi)\s*(\d+(?:\.\d+)?)\s*(k|nghìn|tr(iệu)?|triệu)?/);
  if (chiMatch) {
    let amount = parseFloat(chiMatch[1]);
    const unit = chiMatch[2] || '';
    if (unit === 'k' || unit === 'nghìn') amount *= 1000;
    else if (unit.startsWith('tr') || unit === 'triệu') amount *= 1_000_000;
    if (amount > 0) return { type: 'ADD_FINANCE', amount: Math.round(amount), direction: 'OUT', description: 'Chi (theo lệnh AI)' };
  }

  return null;
}

/** Mô tả lệnh để hiển thị cho người dùng sau khi thực thi */
export function describeCommand(cmd: CommandType): string {
  switch (cmd.type) {
    case 'NAVIGATE':
      return `Đã chuyển sang trang: ${cmd.view === AppView.DASHBOARD ? 'Tổng quan' : cmd.view === AppView.MEMBERS ? 'Ca Viên' : cmd.view === AppView.FINANCE ? 'Ngân quỹ' : cmd.view === AppView.LIBRARY ? 'Thánh Ca' : 'Phụng vụ'}.`;
    case 'ADD_FINANCE':
      const amountStr = cmd.amount >= 1000 ? `${(cmd.amount / 1000).toFixed(0)}k` : String(cmd.amount);
      return cmd.direction === 'IN'
        ? `Đã ghi thu ${amountStr} vào ngân quỹ.`
        : `Đã ghi chi ${amountStr} từ ngân quỹ.`;
    default:
      return 'Đã thực hiện lệnh.';
  }
}
