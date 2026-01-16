import Table from 'cli-table3';
import chalk from 'chalk';
import { Tool } from '../types';
import { formatTimestamp, formatTimeTaken } from './format';

/**
 * Create a table for displaying tools
 */
export function createToolTable(tools: Tool[], bestTool?: Tool): string {
    const table = new Table({
        head: [
            chalk.bold.cyan('Tool'),
            chalk.bold.cyan('Command'),
            chalk.bold.cyan('Description'),
            chalk.bold.cyan('Last Run'),
            chalk.bold.cyan('Time'),
            chalk.bold.cyan('Status')
        ],
        wordWrap: true
    });

    for (const tool of tools) {
        // Truncate long commands and descriptions
        const command = tool.command.length > 40
            ? tool.command.substring(0, 37) + '...'
            : tool.command;

        const description = tool.description.length > 40
            ? tool.description.substring(0, 37) + '...'
            : tool.description;

        // Status indicator
        let status: string;
        if (tool.disabled) {
            status = chalk.gray('Disabled');
        } else if (tool.okay === null) {
            status = '-';
        } else if (tool.okay) {
            status = chalk.green('✓');
        } else {
            status = chalk.red('✗');
        }

        const isBestTool = bestTool && tool.name === bestTool.name;
        const toolName = isBestTool ? chalk.bold.green(tool.name) : tool.name;

        table.push([
            toolName,
            command,
            description,
            formatTimestamp(tool.last_ran),
            formatTimeTaken(tool.time_taken),
            status
        ]);
    }

    return table.toString();
}

/**
 * Display tool details
 */
export function displayToolDetails(tool: Tool): string {
    const status = tool.okay === null
        ? 'Not run yet'
        : tool.okay
            ? chalk.green('✓ OK')
            : chalk.red('✗ Failed');

    let output = `
${chalk.bold('Name:')}        ${tool.name}
${chalk.bold('Command:')}     ${chalk.cyan(tool.command)}
${chalk.bold('Description:')} ${tool.description}
${chalk.bold('Last Run:')}    ${formatTimestamp(tool.last_ran)}
${chalk.bold('Time Taken:')}  ${formatTimeTaken(tool.time_taken)}
${chalk.bold('Status:')}      ${status}`;

    if (tool.last_error) {
        output += `\n${chalk.red('Last Error:')}   ${tool.last_error}`;
    }

    return output.trim();
}
