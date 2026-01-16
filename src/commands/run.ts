import chalk from 'chalk';
import { marked } from 'marked';
// @ts-ignore
import TerminalRenderer from 'marked-terminal';
import { configManager } from '../config';
import { executeCommand } from '../executor';
import { getCurrentTimestamp } from '../utils/format';

// Setup marked with custom terminal renderer
marked.setOptions({
    renderer: new TerminalRenderer()
});
import { Tool } from '../types';

/**
 * Run a tool and return the result without updating config or exiting
 */
export async function runTool(
    toolName: string,
    prompt?: string,
    debug = false,
    silent = false
): Promise<{ success: boolean; error?: string; timeTaken: number }> {
    const tool = configManager.getTool(toolName);

    if (!tool) {
        throw new Error(`Tool "${toolName}" not found`);
    }

    const captureOutput = !silent;
    const result = await executeCommand(tool.command, prompt, debug, silent, captureOutput);

    // Always render output with markdown
    if (captureOutput && result.success && result.stdout) {
        console.log(marked(result.stdout));
    }

    return {
        success: result.success,
        error: result.stderr || result.error,
        timeTaken: result.timeTaken
    };
}

/**
 * Run command - executes a specific tool
 */
export async function runCommand(
    toolName: string,
    prompt?: string,
    options?: { debug?: boolean }
): Promise<void> {
    const tool = configManager.getTool(toolName);

    if (!tool) {
        console.log(chalk.red(`Error: Tool "${toolName}" not found`));
        process.exit(1);
    }

    console.log(chalk.bold(`Running ${toolName}...\n`));

    const result = await runTool(toolName, prompt, options?.debug || false);

    // Update tool metrics
    configManager.updateTool(toolName, {
        time_taken: result.timeTaken,
        last_ran: getCurrentTimestamp(),
        okay: result.success,
        last_error: result.success ? undefined : result.error
    });

    if (!result.success) {
        console.log(chalk.red(`\n✗ Command failed`));
        if (result.error) {
            console.log(chalk.red(`Error: ${result.error}`));
        }
        process.exit(1);
    }
}
