import inquirer from 'inquirer';
import chalk from 'chalk';
import { configManager } from '../config';
import { DeleteOptions } from '../types';

/**
 * Delete command - removes tools from configuration
 */
export async function deleteCommand(
    toolName?: string,
    options?: DeleteOptions & { toolName?: string }
): Promise<void> {
    // Use --tool-name option if positional arg not provided
    const effectiveToolName = toolName || options?.toolName;

    let toolsToDelete: string[];

    if (effectiveToolName) {
        // Single tool mode
        const tool = configManager.getTool(effectiveToolName);
        if (!tool) {
            console.log(chalk.red(`Error: Tool "${effectiveToolName}" not found`));
            process.exit(1);
        }
        toolsToDelete = [effectiveToolName];
    } else {
        // Interactive mode: select tools
        const allTools = configManager.getTools();
        if (allTools.length === 0) {
            console.log(chalk.yellow('No tools configured.'));
            return;
        }

        try {
            const answer = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedTools',
                    message: 'Select tools to delete:',
                    choices: allTools.map(t => ({ name: `${t.name} - ${t.description}`, value: t.name })),
                    validate: (answer) => answer.length > 0 || 'Please select at least one tool'
                }
            ]);
            toolsToDelete = answer.selectedTools;
        } catch (error) {
            console.log(chalk.yellow('\nOperation cancelled'));
            return;
        }
    }

    let confirmed = options?.yes || false;

    // Ask for confirmation
    if (!confirmed) {
        const toolNames = toolsToDelete.map(name => `"${name}"`).join(', ');
        try {
            const answer = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `Are you sure you want to delete: ${toolNames}?`,
                    default: false
                }
            ]);

            confirmed = answer.confirm;
        } catch (error) {
            console.log(chalk.yellow('\nOperation cancelled'));
            return;
        }
    }

    if (!confirmed) {
        console.log(chalk.yellow('Operation cancelled'));
        return;
    }

    // Delete the tools
    for (const name of toolsToDelete) {
        configManager.deleteTool(name);
        console.log(chalk.green(`✓ Tool "${name}" deleted successfully`));
    }
}
