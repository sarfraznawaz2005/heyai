 import chalk from 'chalk';
 import { spawn } from 'child_process';
 import { configManager } from '../config';
 import { runTool } from './run';
 import { checkCommand } from './check';

/**
 * Shows a balloon notification on Windows
 */
function showNotification() {
    if (process.platform !== 'win32') return;
    spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-Command', "& {Add-Type -AssemblyName System.Windows.Forms; $notify = New-Object System.Windows.Forms.NotifyIcon; $notify.Icon = [System.Drawing.SystemIcons]::Information; $notify.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info; $notify.BalloonTipTitle = 'My AI Agent'; $notify.BalloonTipText = 'Agent is done!'; $notify.Visible = $true; $notify.ShowBalloonTip(5000); $notify.Dispose()}"], { stdio: 'ignore' });
}

/**
 * Default command - runs the best tool with a prompt
 */
export async function defaultCommand(prompt: string, options?: { autocheck?: boolean }): Promise<void> {
    const autocheck = options?.autocheck ?? true;
    let bestToolName = configManager.getBest();
    const startTime = performance.now();

    if (!bestToolName) {
        // Check if we have recent successful tool data
        const allTools = configManager.getTools();
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const recentTools = allTools.filter(t =>
            t.okay &&
            t.last_ran &&
            new Date(t.last_ran) > oneHourAgo &&
            t.time_taken !== undefined
        );

        if (recentTools.length > 0) {
            // Use cached data to select best
            recentTools.sort((a, b) => a.time_taken! - b.time_taken!);
            bestToolName = recentTools[0].name;
            configManager.setBest(bestToolName);
            console.log(chalk.green(`Using cached best tool: ${bestToolName}`));
        } else {
            console.log(chalk.yellow('No best tool configured. Running benchmark...'));
            await checkCommand();
            // After check, get the new best
            bestToolName = configManager.getBest();
            if (!bestToolName) {
                console.log(chalk.red('No tools passed the benchmark.'));
                process.exit(1);
            }
        }
    }

    // Try best tool
    const result = await runTool(bestToolName, prompt, false, true); // silent check

    if (result.success) {
        // Render the captured output
        if (result.output) {
            console.log(result.output);
        }
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000;
        console.log(`\n${chalk.dim.italic(`Answered via ${chalk.bold.cyan(bestToolName.toUpperCase())} (BEST) in ${timeTaken.toFixed(1)}s`)}`);
        showNotification();
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
    const successfulTools = allTools.filter(t => t.okay !== null && !t.disabled && t.name !== bestToolName);
    successfulTools.sort((a, b) => (a.time_taken ?? Infinity) - (b.time_taken ?? Infinity));

    for (const tool of successfulTools) {
        const res = await runTool(tool.name, prompt, false, true);
        if (res.success) {
            // Render the captured output
            if (res.output) {
                console.log(res.output);
            }
            configManager.setBest(tool.name);
            const endTime = performance.now();
            const timeTaken = (endTime - startTime) / 1000;
            console.log(`\n${chalk.dim.italic(`Answered via ${chalk.bold.cyan(tool.name.toUpperCase())} in ${timeTaken.toFixed(1)}s`)}`);
            showNotification();
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
