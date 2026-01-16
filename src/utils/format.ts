import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format a timestamp to human-readable relative time
 */
export function formatTimestamp(timestamp: string | null): string {
    if (!timestamp) {
        return '-';
    }

    return dayjs(timestamp).fromNow();
}

/**
 * Format time taken with max 2 decimal places
 */
export function formatTimeTaken(seconds: number | null): string {
    if (seconds === null || seconds === undefined) {
        return '-';
    }

    return `${seconds.toFixed(2)}s`;
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}
