/**
 * Tool name validation utilities
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates tool name according to requirements:
 * - Lowercase alphanumeric only (a-z, 0-9)
 * - Minimum 3 characters
 * - Maximum 100 characters
 */
export function validateToolName(name: string): ValidationResult {
    if (!name || name.length === 0) {
        return {
            valid: false,
            error: 'Tool name is required'
        };
    }

    if (name.length < 3) {
        return {
            valid: false,
            error: 'Tool name must be at least 3 characters long'
        };
    }

    if (name.length > 100) {
        return {
            valid: false,
            error: 'Tool name must be at most 100 characters long'
        };
    }

    const namePattern = /^[a-z0-9]+$/;
    if (!namePattern.test(name)) {
        return {
            valid: false,
            error: 'Tool name must contain only lowercase letters and numbers'
        };
    }

    return { valid: true };
}
