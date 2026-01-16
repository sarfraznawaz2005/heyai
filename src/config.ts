import Conf from 'conf';
import { Config, Tool } from './types';

/**
 * Configuration manager for HeyAI
 * Uses conf library for cross-platform config storage
 */
class ConfigManager {
    private conf: Conf<Config>;

    constructor() {
        this.conf = new Conf<Config>({
            projectName: 'heyai',
            defaults: {
                tools: [],
                best: null
            }
        });
    }

    /**
     * Get all tools
     */
    getTools(): Tool[] {
        return this.conf.get('tools') || [];
    }

    /**
     * Get a specific tool by name
     */
    getTool(name: string): Tool | undefined {
        const tools = this.getTools();
        return tools.find(tool => tool.name === name);
    }

    /**
     * Add a new tool
     */
    addTool(tool: Tool): void {
        const tools = this.getTools();
        tools.push(tool);
        this.conf.set('tools', tools);
    }

    /**
     * Update an existing tool
     */
    updateTool(name: string, updates: Partial<Tool>): boolean {
        const tools = this.getTools();
        const index = tools.findIndex(tool => tool.name === name);

        if (index === -1) {
            return false;
        }

        tools[index] = { ...tools[index], ...updates };
        this.conf.set('tools', tools);
        return true;
    }

    /**
     * Delete a tool
     */
    deleteTool(name: string): boolean {
        const tools = this.getTools();
        const filteredTools = tools.filter(tool => tool.name !== name);

        if (filteredTools.length === tools.length) {
            return false;
        }

        this.conf.set('tools', filteredTools);

        // If deleted tool was the best, clear best
        if (this.getBest() === name) {
            this.setBest(null);
        }

        return true;
    }

    /**
     * Check if a tool exists
     */
    toolExists(name: string): boolean {
        return this.getTool(name) !== undefined;
    }

    /**
     * Get the best tool name
     */
    getBest(): string | null {
        return this.conf.get('best');
    }

    /**
     * Set the best tool
     */
    setBest(name: string | null): void {
        this.conf.set('best', name);
    }

    /**
     * Set all tools (for import)
     */
    setTools(tools: Tool[]): void {
        this.conf.set('tools', tools);
    }

    /**
     * Get config file path
     */
    getConfigPath(): string {
        return this.conf.path;
    }
}

// Export singleton instance
export const configManager = new ConfigManager();
