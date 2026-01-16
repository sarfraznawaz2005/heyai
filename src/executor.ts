import execa from 'execa';
import chalk from 'chalk';
import { RunResult } from './types';

/**
 * Execute a tool command and measure performance
 */
export async function executeCommand(
    command: string,
    prompt?: string,
    debug: boolean = false,
    silent: boolean = false,
    captureOutput: boolean = false
): Promise<RunResult> {
    const startTime = performance.now();

    try {
        // Append prompt if provided
        const fullCommand = prompt ? `${command} "${prompt}"` : command;

        // Show command in debug mode
        if (debug) {
            console.log(chalk.dim('\nDebug: Executing command: ') + chalk.cyan(fullCommand) + '\n');
        }

        // Execute command using execa
        let stdio: any;
        if (captureOutput) {
            stdio = ['ignore', 'pipe', 'pipe']; // Capture stdout and stderr
        } else if (silent) {
            stdio = ['ignore', 'ignore', 'pipe']; // Capture stderr only
        } else {
            stdio = 'inherit'; // Stream output to terminal
        }
        const result = await execa(fullCommand, {
            shell: true,
            stdio: stdio,
            timeout: 60000, // 60 second timeout
            reject: false // Don't throw on non-zero exit codes
        });

        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

        return {
            success: result.exitCode === 0,
            timeTaken: parseFloat(timeTaken.toFixed(2)),
            stderr: (silent || captureOutput) && result.stderr ? result.stderr.trim() : undefined,
            stdout: captureOutput && result.stdout ? result.stdout.trim() : undefined
        };
    } catch (error: any) {
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000;

        return {
            success: false,
            timeTaken: parseFloat(timeTaken.toFixed(2)),
            error: error.message || 'Command execution failed',
            stderr: undefined,
            stdout: undefined
        };
    }
}

/**
 * Execute a tool command silently (for check command)
 */
export async function executeCommandSilent(
    command: string,
    prompt: string = 'hello',
    debug: boolean = false
): Promise<RunResult> {
    const startTime = performance.now();

    try {
        const fullCommand = `${command} "${prompt}"`;

        // Show command in debug mode
        if (debug) {
            console.log(chalk.dim('\nDebug: Executing command: ') + chalk.cyan(fullCommand) + '\n');
        }

        const result = await execa(fullCommand, {
            shell: true,
            stdio: ['ignore', 'ignore', 'pipe'], // Capture stderr
            timeout: 60000,
            reject: false // Don't throw on non-zero exit codes
        });

        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000;

        return {
            success: result.exitCode === 0,
            timeTaken: parseFloat(timeTaken.toFixed(2)),
            stderr: result.stderr ? result.stderr.trim() : undefined
        };
    } catch (error: any) {
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000;

        return {
            success: false,
            timeTaken: parseFloat(timeTaken.toFixed(2)),
            error: error.message || 'Command execution failed',
            stderr: undefined,
            stdout: undefined
        };
    }
}
