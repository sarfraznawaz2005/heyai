import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { configManager } from '../config';

/**
 * Export command - exports configuration to a file
 */
export function exportCommand(path?: string): void {
    try {
        const configPath = path || join(dirname(configManager.getConfigPath()), 'config-exported.json');

        const config = {
            tools: configManager.getTools(),
            best: configManager.getBest()
        };

        writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.green(`Configuration exported to: ${configPath}`));
    } catch (error: any) {
        console.log(chalk.red(`Export failed: ${error.message}`));
        process.exit(1);
    }
}