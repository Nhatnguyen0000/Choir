export const suggestCategory = (description: string): string => {
  const d = (description || '').toLowerCase();
  if (d.includes('lễ') || d.includes('bổng lễ')) return 'Thu lễ';
  if (d.includes('hoa') || d.includes('phụng vụ')) return 'Hoa lễ';
  if (d.includes('ăn') || d.includes('tiệc') || d.includes('liên hoan')) return 'Sinh hoạt';
  return 'Khác';
};

