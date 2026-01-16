import Fuse from 'fuse.js';
import chalk from 'chalk';
import { configManager } from '../config';
import { createToolTable } from '../utils/table';

/**
 * Find command - fuzzy search for tools
 */
export function findCommand(query: string): void {
    const tools = configManager.getTools();

    if (tools.length === 0) {
        console.log(chalk.yellow('No tools configured. Use "ai add" to add a tool.'));
        return;
    }

    // Configure Fuse.js for fuzzy searching
    const fuse = new Fuse(tools, {
        keys: ['name', 'description'],
        threshold: 0.4, // Adjust fuzzy matching sensitivity
        includeScore: true
    });

    const results = fuse.search(query);

    if (results.length === 0) {
        console.log(chalk.yellow(`No tools found matching "${query}"`));
        return;
    }

    const matchedTools = results.map(result => result.item);
    console.log(chalk.bold(`Found ${results.length} tool(s) matching "${query}":\n`));
    console.log(createToolTable(matchedTools));
}
