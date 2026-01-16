import inquirer from 'inquirer';
import chalk from 'chalk';
import { configManager } from '../config';
import { validateToolName } from '../validator';
import { EditOptions } from '../types';

/**
 * Edit command - edits an existing tool
 */
export async function editCommand(
    toolName?: string,
    options?: EditOptions & { toolName?: string }
): Promise<void> {
    // Use --tool-name option if positional arg not provided
    const effectiveToolName = toolName || options?.toolName;

    let tool;

    if (effectiveToolName) {
        tool = configManager.getTool(effectiveToolName);
        if (!tool) {
            console.log(chalk.red(`Error: Tool "${effectiveToolName}" not found`));
            process.exit(1);
        }
    } else {
        // Interactive mode: select tool
        const tools = configManager.getTools();
        if (tools.length === 0) {
            console.log(chalk.yellow('No tools configured. Use "agent add" to add a tool.'));
            return;
        }

        try {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedTool',
                    message: 'Select a tool to edit:',
                    choices: tools.map(t => ({ name: `${t.name} - ${t.description}`, value: t.name }))
                }
            ]);
            tool = configManager.getTool(answer.selectedTool);
        } catch (error) {
            console.log(chalk.yellow('\nOperation cancelled'));
            return;
        }
    }

    if (!tool) return;

    let newName = options?.name;
    let newCommand = options?.command;
    let newDescription = options?.description;

    // Interactive mode if no tool specified or no properties to update
    const isInteractive = !effectiveToolName || (!newName && !newCommand && !newDescription);

    if (isInteractive) {
        // Select which properties to edit
        try {
            const propertyAnswer = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'properties',
                    message: 'Select properties to edit:',
                    choices: [
                        { name: 'Name', value: 'name' },
                        { name: 'Command', value: 'command' },
                        { name: 'Description', value: 'description' }
                    ],
                    validate: (answer) => answer.length > 0 || 'Please select at least one property'
                }
            ]);

            const selectedProperties = propertyAnswer.properties;

            // Prompt for each selected property
            const answers = await inquirer.prompt(
                selectedProperties.map((prop: string) => ({
                    type: 'input',
                    name: prop,
                    message: `${prop.charAt(0).toUpperCase() + prop.slice(1)}:`,
                    default: tool[prop as keyof typeof tool],
                    validate: (input: string) => {
                        if (prop === 'name') {
                            const result = validateToolName(input);
                            return result.valid || result.error!;
                        }
                        return input.length > 0 || `${prop} is required`;
                    }
                }))
            );

            newName = answers.name;
            newCommand = answers.command;
            newDescription = answers.description;
        } catch (error) {
            console.log(chalk.yellow('\nOperation cancelled'));
            return;
        }
    }

    // Validate new name if provided
    if (newName && newName !== tool.name) {
        const validation = validateToolName(newName);
        if (!validation.valid) {
            console.log(chalk.red(`Error: ${validation.error}`));
            process.exit(1);
        }

        // Check if new name already exists
        if (configManager.toolExists(newName)) {
            console.log(chalk.red(`Error: Tool "${newName}" already exists`));
            process.exit(1);
        }
    }

    // Prepare updates
    const updates: any = {};
    if (newName) updates.name = newName;
    if (newCommand) updates.command = newCommand;
    if (newDescription) updates.description = newDescription;

    // If name changed, delete old and add new
    if (newName && newName !== tool.name) {
        const updatedTool = { ...tool, ...updates };
        configManager.deleteTool(tool.name);
        configManager.addTool(updatedTool);
        console.log(chalk.green(`✓ Tool "${tool.name}" updated to "${newName}"`));
    } else {
        configManager.updateTool(tool.name, updates);
        console.log(chalk.green(`✓ Tool "${tool.name}" updated successfully`));
    }
}
