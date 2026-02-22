import { describe, it, expect } from 'vitest';
import { getOrdoForMonth } from './ordoService';

describe('ordoService', () => {
  describe('getOrdoForMonth', () => {
    it('returns an array of OrdoEvent for the given month', () => {
      const result = getOrdoForMonth(1, 2026);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns correct number of days for January 2026', () => {
      const result = getOrdoForMonth(1, 2026);
      expect(result).toHaveLength(31);
    });

    it('each event has date, massName, liturgicalColor, rank', () => {
      const result = getOrdoForMonth(2, 2026);
      expect(result.length).toBeGreaterThan(0);
      for (const event of result) {
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('massName');
        expect(event).toHaveProperty('liturgicalColor');
        expect(event).toHaveProperty('rank');
        expect(typeof event.date).toBe('string');
        expect(/^\d{4}-\d{2}-\d{2}$/.test(event.date)).toBe(true);
      }
    });

    it('includes special feast on 2026-01-01', () => {
      const result = getOrdoForMonth(1, 2026);
      const jan1 = result.find((e) => e.date === '2026-01-01');
      expect(jan1).toBeDefined();
      expect(jan1?.massName).toContain('Maria');
      expect(jan1?.liturgicalColor).toBe('WHITE');
    });

    it('February 2026 has 28 days', () => {
      const result = getOrdoForMonth(2, 2026);
      expect(result).toHaveLength(28);
    });
  });
});
