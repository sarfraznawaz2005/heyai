import chalk from 'chalk';
import { readFileSync } from 'fs';
import { configManager } from '../config';

/**
 * Import command - imports configuration from a file
 */
export function importCommand(path: string): void {
    try {
        const data = JSON.parse(readFileSync(path, 'utf-8'));

        // Validate structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid configuration file format');
        }

        if (!Array.isArray(data.tools)) {
            throw new Error('Configuration must contain a "tools" array');
        }

        // Import configuration
        configManager.setTools(data.tools);
        configManager.setBest(data.best || null);

        console.log(chalk.green(`Configuration imported from: ${path}`));
        console.log(chalk.yellow('Note: Existing configuration has been overwritten'));
    } catch (error: any) {
        console.log(chalk.red(`Import failed: ${error.message}`));
        process.exit(1);
    }
}