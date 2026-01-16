import inquirer from 'inquirer';
import chalk from 'chalk';
import { configManager } from '../config';
import { validateToolName } from '../validator';
import { AddOptions, Tool } from '../types';

/**
 * Add command - adds a new tool to the configuration
 */
export async function addCommand(options: AddOptions): Promise<void> {
    let name = options.name;
    let command = options.command;
    let description = options.description;

    // Interactive mode if options are not provided
    if (!name || !command || !description) {
        try {
            const questions = [];

            if (!name) {
                questions.push({
                    type: 'input',
                    name: 'name',
                    message: 'Tool name:',
                    validate: (input: string) => {
                        const result = validateToolName(input);
                        return result.valid || result.error!;
                    }
                });
            }

            if (!command) {
                questions.push({
                    type: 'input',
                    name: 'command',
                    message: 'Command:',
                    validate: (input: string) => {
                        return input.length > 0 || 'Command is required';
                    }
                });
            }

            if (!description) {
                questions.push({
                    type: 'input',
                    name: 'description',
                    message: 'Description:',
                    validate: (input: string) => {
                        return input.length > 0 || 'Description is required';
                    }
                });
            }

            const answers = await inquirer.prompt(questions);

            name = name || answers.name;
            command = command || answers.command;
            description = description || answers.description;
        } catch (error) {
            // User cancelled with Escape
            console.log(chalk.yellow('\nOperation cancelled'));
            return;
        }
    } else {
        // Validate name in non-interactive mode
        const validation = validateToolName(name);
        if (!validation.valid) {
            console.log(chalk.red(`Error: ${validation.error}`));
            process.exit(1);
        }
    }

    // Check for duplicate
    if (configManager.toolExists(name!)) {
        console.log(chalk.red(`Error: Tool "${name}" already exists`));
        process.exit(1);
    }

    // Create and add the tool
    const tool: Tool = {
        name: name!,
        command: command!,
        description: description!,
        time_taken: null,
        last_ran: null,
        okay: null
    };

    configManager.addTool(tool);
    console.log(chalk.green(`✓ Tool "${name}" added successfully`));
}
