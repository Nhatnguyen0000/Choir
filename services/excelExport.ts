import ExcelJS from 'exceljs';

export interface MemberRow {
  stt: number;
  saintName: string;
  name: string;
  phone: string;
  birthYear: string;
  grade: string;
  role: string;
  status: string;
  joinDate: string;
}

const BRAND_DARK = '1B1F3B';
const BRAND_ACCENT = '4F46E5';
const BRAND_GOLD = 'D4A843';
const WHITE = 'FFFFFF';
const LIGHT_BG = 'F1F5F9';
const BORDER_COLOR = 'CBD5E1';
const TEXT_DARK = '1E293B';
const TEXT_MUTED = '64748B';
const GREEN = '16A34A';
const AMBER = 'D97706';
const RED = 'DC2626';

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: BORDER_COLOR } },
  bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
  left: { style: 'thin', color: { argb: BORDER_COLOR } },
  right: { style: 'thin', color: { argb: BORDER_COLOR } },
};

function statusColor(status: string): string {
  if (status === 'Hoạt động') return GREEN;
  if (status === 'Tạm nghỉ') return AMBER;
  return RED;
}

export async function exportMembersToExcel(
  rows: MemberRow[],
  filename: string
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Ban Điều Hành Ca Đoàn Thiên Thần';
  wb.created = new Date();

  const ws = wb.addWorksheet('Sổ Bộ Ca Viên', {
    properties: { defaultColWidth: 14 },
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    headerFooter: {
      oddFooter: '&L&8Ban Điều Hành Ca Đoàn Thiên Thần&C&8Trang &P / &N&R&8&D',
    },
  });

  const COL_COUNT = 10;
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const totalActive = rows.filter(r => r.status === 'Hoạt động').length;
  const totalOnLeave = rows.filter(r => r.status === 'Tạm nghỉ').length;
  const totalRetired = rows.filter(r => r.status === 'Nghỉ hẳn').length;

  // ── Cột widths ──
  ws.columns = [
    { width: 5.5 },   // A: STT
    { width: 17 },    // B: Tên Thánh
    { width: 28 },    // C: Họ và Tên
    { width: 11 },    // D: Năm sinh
    { width: 15 },    // E: SĐT
    { width: 14 },    // F: Giọng/Lớp
    { width: 14 },    // G: Bổn phận
    { width: 13 },    // H: Trạng thái
    { width: 15 },    // I: Ngày gia nhập
    { width: 4 },     // J: spacer
  ];

  // ══════════════════════════════════════════════
  // ROW 1: Brand bar (dark background)
  // ══════════════════════════════════════════════
  const r1 = ws.addRow(['']);
  r1.height = 8;
  for (let c = 1; c <= COL_COUNT; c++) {
    r1.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_DARK } };
  }

  // ROW 2: Title
  const r2 = ws.addRow(['✦  BAN ĐIỀU HÀNH CA ĐOÀN THIÊN THẦN  ✦']);
  ws.mergeCells(2, 1, 2, COL_COUNT);
  r2.height = 36;
  r2.getCell(1).font = { name: 'Arial', size: 16, bold: true, color: { argb: BRAND_DARK } };
  r2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  // ROW 3: Subtitle
  const r3 = ws.addRow(['SỔ BỘ CA VIÊN — GIÁO XỨ BẮC HÒA']);
  ws.mergeCells(3, 1, 3, COL_COUNT);
  r3.height = 22;
  r3.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: BRAND_ACCENT } };
  r3.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  // ROW 4: Gold accent line
  const r4 = ws.addRow(['']);
  r4.height = 4;
  for (let c = 1; c <= COL_COUNT; c++) {
    r4.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_GOLD } };
  }

  // ROW 5: Info row
  const r5 = ws.addRow([`Ngày xuất: ${dateStr}     ·     Tổng: ${rows.length} ca viên     ·     Hoạt động: ${totalActive}     ·     Tạm nghỉ: ${totalOnLeave}     ·     Nghỉ hẳn: ${totalRetired}`]);
  ws.mergeCells(5, 1, 5, COL_COUNT);
  r5.height = 22;
  r5.getCell(1).font = { name: 'Arial', size: 9, italic: true, color: { argb: TEXT_MUTED } };
  r5.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  r5.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };

  // ROW 6: Spacer
  ws.addRow(['']).height = 6;

  // ══════════════════════════════════════════════
  // ROW 7: Table headers
  // ══════════════════════════════════════════════
  const headers = ['STT', 'Tên Thánh', 'Họ và Tên', 'Năm sinh', 'SĐT', 'Giọng/Lớp', 'Bổn phận', 'Trạng thái', 'Ngày gia nhập', ''];
  const hRow = ws.addRow(headers);
  hRow.height = 28;
  for (let c = 1; c <= COL_COUNT; c++) {
    const cell = hRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_DARK } };
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: BRAND_DARK } },
      bottom: { style: 'medium', color: { argb: BRAND_GOLD } },
      left: { style: 'thin', color: { argb: '334155' } },
      right: { style: 'thin', color: { argb: '334155' } },
    };
  }

  // ══════════════════════════════════════════════
  // Data rows
  // ══════════════════════════════════════════════
  rows.forEach((r, idx) => {
    const dataRow = ws.addRow([
      r.stt,
      r.saintName,
      r.name,
      r.birthYear,
      r.phone,
      r.grade,
      r.role,
      r.status,
      r.joinDate,
      '',
    ]);
    dataRow.height = 22;
    const isEven = idx % 2 === 0;

    for (let c = 1; c <= COL_COUNT; c++) {
      const cell = dataRow.getCell(c);
      cell.font = { name: 'Arial', size: 9.5, color: { argb: TEXT_DARK } };
      cell.alignment = { vertical: 'middle' };
      cell.border = thinBorder;

      if (isEven) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
      }
    }

    // STT centered
    dataRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    dataRow.getCell(1).font = { name: 'Arial', size: 9, color: { argb: TEXT_MUTED } };

    // Tên Thánh bold + accent
    dataRow.getCell(2).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: BRAND_ACCENT } };

    // Họ và Tên bold
    dataRow.getCell(3).font = { name: 'Arial', size: 10, bold: true, color: { argb: TEXT_DARK } };

    // Năm sinh centered
    dataRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

    // SĐT centered
    dataRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };

    // Trạng thái colored + centered
    const stCell = dataRow.getCell(8);
    stCell.alignment = { horizontal: 'center', vertical: 'middle' };
    stCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: statusColor(r.status) } };

    // Ngày gia nhập centered
    dataRow.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };
    dataRow.getCell(9).font = { name: 'Arial', size: 9, color: { argb: TEXT_MUTED } };
  });

  // ══════════════════════════════════════════════
  // Bottom gold line
  // ══════════════════════════════════════════════
  const bottomLine = ws.addRow(['']);
  bottomLine.height = 4;
  for (let c = 1; c <= COL_COUNT; c++) {
    bottomLine.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_GOLD } };
  }

  // Spacer
  ws.addRow(['']).height = 10;

  // ══════════════════════════════════════════════
  // Summary block (right-aligned)
  // ══════════════════════════════════════════════
  const summaryData = [
    ['Tổng ca viên', rows.length, TEXT_DARK],
    ['Hoạt động', totalActive, GREEN],
    ['Tạm nghỉ', totalOnLeave, AMBER],
    ['Nghỉ hẳn', totalRetired, RED],
  ] as const;

  for (const [label, value, color] of summaryData) {
    const sRow = ws.addRow(['', '', '', '', '', '', label, value, '', '']);
    sRow.height = 20;
    const labelCell = sRow.getCell(7);
    labelCell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: TEXT_DARK } };
    labelCell.alignment = { horizontal: 'right', vertical: 'middle' };
    labelCell.border = { bottom: { style: 'dotted', color: { argb: BORDER_COLOR } } };

    const valCell = sRow.getCell(8);
    valCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: color as string } };
    valCell.alignment = { horizontal: 'center', vertical: 'middle' };
    valCell.border = {
      bottom: { style: 'dotted', color: { argb: BORDER_COLOR } },
      left: { style: 'thin', color: { argb: BORDER_COLOR } },
      right: { style: 'thin', color: { argb: BORDER_COLOR } },
    };
  }

  // Spacer
  ws.addRow(['']).height = 24;

  // ══════════════════════════════════════════════
  // Signature block
  // ══════════════════════════════════════════════
  const sigDateRow = ws.addRow(['', '', '', '', '', '', '', `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`, '', '']);
  ws.mergeCells(sigDateRow.number, 7, sigDateRow.number, 9);
  sigDateRow.getCell(7).font = { name: 'Arial', size: 9, italic: true, color: { argb: TEXT_MUTED } };
  sigDateRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };

  const sigTitleRow = ws.addRow(['', '', '', '', '', '', '', 'BAN ĐIỀU HÀNH', '', '']);
  ws.mergeCells(sigTitleRow.number, 7, sigTitleRow.number, 9);
  sigTitleRow.height = 24;
  sigTitleRow.getCell(7).font = { name: 'Arial', size: 11, bold: true, color: { argb: BRAND_DARK } };
  sigTitleRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };

  const sigSubRow = ws.addRow(['', '', '', '', '', '', '', 'Ca Đoàn Thiên Thần — Giáo xứ Bắc Hòa', '', '']);
  ws.mergeCells(sigSubRow.number, 7, sigSubRow.number, 9);
  sigSubRow.getCell(7).font = { name: 'Arial', size: 8.5, italic: true, color: { argb: TEXT_MUTED } };
  sigSubRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };

  // Spacer + bottom brand bar
  ws.addRow(['']).height = 8;
  const bottomBar = ws.addRow(['']);
  bottomBar.height = 6;
  for (let c = 1; c <= COL_COUNT; c++) {
    bottomBar.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_DARK } };
  }

  // ══════════════════════════════════════════════
  // Print area
  // ══════════════════════════════════════════════
  ws.pageSetup.printArea = `A1:I${bottomBar.number}`;

  // ── Download ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
