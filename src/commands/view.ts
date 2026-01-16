import chalk from 'chalk';
import { configManager } from '../config';
import { displayToolDetails } from '../utils/table';

/**
 * View command - displays detailed information about a tool
 */
export function viewCommand(toolName: string): void {
    const tool = configManager.getTool(toolName);

    if (!tool) {
        console.log(chalk.red(`Error: Tool "${toolName}" not found`));
        process.exit(1);
    }

    console.log(displayToolDetails(tool));
}
