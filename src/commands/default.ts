import chalk from 'chalk';
import { configManager } from '../config';
import { runTool } from './run';
import { checkCommand } from './check';

/**
 * Default command - runs the best tool with a prompt
 */
export async function defaultCommand(prompt: string, options?: { autocheck?: boolean }): Promise<void> {
    const autocheck = options?.autocheck ?? true;
    let bestToolName = configManager.getBest();
    const startTime = performance.now();

    if (!bestToolName) {
        console.log(chalk.yellow('No best tool configured. Running benchmark...'));
        await checkCommand();
        // After check, get the new best
        bestToolName = configManager.getBest();
        if (!bestToolName) {
            console.log(chalk.red('No tools passed the benchmark.'));
            process.exit(1);
        }
    }

    // Try best tool
    const result = await runTool(bestToolName, prompt, false, true); // silent check

    if (result.success) {
        await runTool(bestToolName, prompt, false, false); // with output
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000;
        console.log(`\n${chalk.dim.italic(`Answered via ${chalk.bold.cyan(bestToolName.toUpperCase())} (BEST) in ${timeTaken.toFixed(1)}s`)}`);
        return;
    }

    // Update failed tool
    configManager.updateTool(bestToolName, {
        last_error: result.error,
        okay: false,
        last_ran: new Date().toISOString()
    });

    if (!autocheck) {
        process.exit(1);
    }

    // Try other tools
    const allTools = configManager.getTools();
    const successfulTools = allTools.filter(t => t.okay === true && !t.disabled && t.name !== bestToolName);
    successfulTools.sort((a, b) => (a.time_taken ?? Infinity) - (b.time_taken ?? Infinity));

    for (const tool of successfulTools) {
        const res = await runTool(tool.name, prompt, false, true);
        if (res.success) {
            await runTool(tool.name, prompt, false, false);
            configManager.setBest(tool.name);
            const endTime = performance.now();
            const timeTaken = (endTime - startTime) / 1000;
            console.log(`\n${chalk.dim.italic(`Answered via ${chalk.bold.cyan(tool.name.toUpperCase())} in ${timeTaken.toFixed(1)}s`)}`);
            return;
        } else {
            configManager.updateTool(tool.name, {
                last_error: res.error,
                okay: false,
                last_ran: new Date().toISOString()
            });
        }
    }

    // All failed
    console.log(chalk.red('All tools failed to provide a response.'));
    process.exit(1);
}
