import chalk from 'chalk';
import { configManager } from '../config';

/**
 * Disable command - disables a tool
 */
export function disableCommand(toolName: string): void {
    const tool = configManager.getTool(toolName);
    if (!tool) {
        console.log(chalk.red(`Error: Tool "${toolName}" not found`));
        process.exit(1);
    }

    if (tool.disabled) {
        console.log(chalk.yellow(`Tool "${toolName}" is already disabled`));
        return;
    }

    configManager.updateTool(toolName, { disabled: true });
    console.log(chalk.green(`✓ Tool "${toolName}" disabled`));
}