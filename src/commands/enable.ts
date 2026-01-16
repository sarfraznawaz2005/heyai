import chalk from 'chalk';
import { configManager } from '../config';

/**
 * Enable command - enables a tool
 */
export function enableCommand(toolName: string): void {
    const tool = configManager.getTool(toolName);
    if (!tool) {
        console.log(chalk.red(`Error: Tool "${toolName}" not found`));
        process.exit(1);
    }

    if (!tool.disabled) {
        console.log(chalk.yellow(`Tool "${toolName}" is already enabled`));
        return;
    }

    configManager.updateTool(toolName, { disabled: false });
    console.log(chalk.green(`✓ Tool "${toolName}" enabled`));
}