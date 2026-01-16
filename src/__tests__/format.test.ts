import { formatTimestamp, formatTimeTaken, getCurrentTimestamp } from '../utils/format';

describe('Format Utilities', () => {
    describe('formatTimestamp', () => {
        it('should return "-" for null timestamps', () => {
            expect(formatTimestamp(null)).toBe('-');
        });

        it('should format recent timestamps as relative time', () => {
            const now = new Date().toISOString();
            const result = formatTimestamp(now);
            expect(result).toContain('ago');
        });
    });

    describe('formatTimeTaken', () => {
        it('should return "-" for null values', () => {
            expect(formatTimeTaken(null)).toBe('-');
        });

        it('should format time with 2 decimal places', () => {
            expect(formatTimeTaken(1.234)).toBe('1.23s');
            expect(formatTimeTaken(5.5)).toBe('5.50s');
            expect(formatTimeTaken(10)).toBe('10.00s');
        });
    });

    describe('getCurrentTimestamp', () => {
        it('should return a valid ISO timestamp', () => {
            const timestamp = getCurrentTimestamp();
            expect(new Date(timestamp).toISOString()).toBe(timestamp);
        });
    });
});
