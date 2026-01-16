import chalk from 'chalk';
import { configManager } from '../config';
import { createToolTable } from '../utils/table';

/**
 * List command - displays all tools in a table
 */
export function listCommand(): void {
    const tools = configManager.getTools();

    if (tools.length === 0) {
        console.log(chalk.yellow('No tools configured. Use "ai add" to add a tool.'));
        return;
    }

    // Sort by last run descending (latest first)
    tools.sort((a, b) => {
        if (!a.last_ran && !b.last_ran) return 0;
        if (!a.last_ran) return 1;
        if (!b.last_ran) return -1;
        return new Date(b.last_ran).getTime() - new Date(a.last_ran).getTime();
    });

    // Get the configured best tool
    const bestToolName = configManager.getBest();
    const bestTool = bestToolName ? configManager.getTool(bestToolName) : undefined;

    console.log(createToolTable(tools, bestTool));
}
