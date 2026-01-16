import ora from 'ora';
import chalk from 'chalk';
import { configManager } from '../config';
import { executeCommandSilent } from '../executor';
import { getCurrentTimestamp } from '../utils/format';
import { listCommand } from './list';

/**
 * Check command - runs all tools to benchmark and verify functionality
 */
export async function checkCommand(options?: { debug?: boolean; includeDisabled?: boolean }): Promise<void> {
    const tools = configManager.getTools();

    if (tools.length === 0) {
        console.log(chalk.yellow('No tools configured. Use "ai add" to add a tool.'));
        return;
    }

    console.log(chalk.bold('Checking tools... This may take a while.\n'));

    let bestTool: string | null = null;
    let bestTime = Infinity;

    // Run each tool
    for (const tool of tools) {
        if (tool.disabled && !(options?.includeDisabled)) {
            continue; // Skip disabled tools unless explicitly included
        }
        const spinner = ora(`Testing ${tool.name}...`).start();

        const result = await executeCommandSilent(tool.command, 'hello', options?.debug || false);

        // Update tool metrics
        configManager.updateTool(tool.name, {
            time_taken: result.timeTaken,
            last_ran: getCurrentTimestamp(),
            okay: result.success,
            last_error: result.success ? undefined : (result.stderr || result.error)
        });

        if (result.success) {
            spinner.succeed(chalk.green(`${tool.name} - ${result.timeTaken}s`));

            // Track best tool
            if (result.timeTaken < bestTime) {
                bestTime = result.timeTaken;
                bestTool = tool.name;
            }
        } else {
            spinner.fail(chalk.red(`${tool.name} - failed`));
        }
    }

    // Update best tool
    if (bestTool) {
        configManager.setBest(bestTool);
        console.log(chalk.bold.green(`\nBest Tool: ${bestTool} (${bestTime.toFixed(2)}s)\n`));
    } else {
        console.log(chalk.yellow('\nNo tools succeeded\n'));
    }

    // Display results using list command
    listCommand();
}
