import { validateToolName } from '../validator';

describe('Validator', () => {
    describe('validateToolName', () => {
        it('should accept valid tool names', () => {
            expect(validateToolName('abc').valid).toBe(true);
            expect(validateToolName('test123').valid).toBe(true);
            expect(validateToolName('myawtool').valid).toBe(true);
            expect(validateToolName('a'.repeat(100)).valid).toBe(true);
        });

        it('should reject names that are too short', () => {
            const result = validateToolName('ab');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('at least 3 characters');
        });

        it('should reject names that are too long', () => {
            const result = validateToolName('a'.repeat(101));
            expect(result.valid).toBe(false);
            expect(result.error).toContain('at most 100 characters');
        });

        it('should reject names with uppercase letters', () => {
            const result = validateToolName('MyTool');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('lowercase');
        });

        it('should reject names with special characters', () => {
            expect(validateToolName('my-tool').valid).toBe(false);
            expect(validateToolName('my_tool').valid).toBe(false);
            expect(validateToolName('my tool').valid).toBe(false);
            expect(validateToolName('my.tool').valid).toBe(false);
        });

        it('should reject empty names', () => {
            const result = validateToolName('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });
    });
});
