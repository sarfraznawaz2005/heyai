/**
 * Type definitions for HeyAI CLI application
 */

export interface Tool {
    name: string;
    command: string;
    description: string;
    time_taken: number | null;
    last_ran: string | null;
    okay: boolean | null;
    last_error?: string;
    disabled?: boolean;
}

export interface Config {
    tools: Tool[];
    best: string | null;
}

export interface AddOptions {
    name?: string;
    command?: string;
    description?: string;
}

export interface EditOptions {
    name?: string;
    command?: string;
    description?: string;
}

export interface DeleteOptions {
    yes?: boolean;
}

export interface RunResult {
    success: boolean;
    timeTaken: number;
    error?: string;
    stderr?: string;
    stdout?: string;
}
