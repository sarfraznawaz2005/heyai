import chalk from 'chalk';

/**
 * Onboard command - provides comprehensive guide for AI agents
 */
export function onboardCommand(): void {
    console.log(chalk.bold.cyan('🚀 HeyAI - AI Tool Manager Onboarding Guide\n'));

    console.log(chalk.bold('📋 Overview:'));
    console.log('HeyAI is a CLI tool manager for AI coding assistants. It provides a unified interface to manage, benchmark, and run multiple AI tools with intelligent fallback.\n');

    console.log(chalk.bold('🎯 Key Features:'));
    console.log('• Tool Management: Add, edit, delete, and configure AI tools');
    console.log('• Smart Selection: Automatically chooses the best performing tool');
    console.log('• Benchmarking: Tests all tools to establish performance baselines');
    console.log('• Fallback System: Tries alternative tools if primary fails');
    console.log('• Markdown Rendering: Formats AI responses with proper terminal display');
    console.log('• Performance Tracking: Monitors response times and success rates\n');

    console.log(chalk.bold('📚 Available Commands:\n'));

    console.log(chalk.bold('🔧 Tool Management:'));
    console.log('  add     - Add a new AI tool (interactive/non-interactive)');
    console.log('  edit    - Edit existing tool configuration');
    console.log('  delete  - Remove tools with confirmation');
    console.log('  list    - Display all configured tools with status');
    console.log('  view    - Show detailed information about a specific tool');
    console.log('  find    - Search for tools by name or description\n');

    console.log(chalk.bold('⚡ AI Operations:'));
    console.log('  [query] - Run AI query using best tool with automatic fallback');
    console.log('  run     - Execute specific tool with optional prompt');
    console.log('  check   - Benchmark all tools and update performance data\n');

    console.log(chalk.bold('🔄 Configuration & Control:'));
    console.log('  export  - Export tool configuration to JSON file');
    console.log('  import  - Import tool configuration from JSON file');
    console.log('  enable  - Enable a disabled tool');
    console.log('  disable - Disable a tool (excluded from operations)');
    console.log('  onboard - Display this comprehensive guide\n');

    console.log(chalk.bold('📖 Usage Examples:\n'));

    console.log(chalk.bold('Adding a Tool:'));
    console.log('  ai add');
    console.log('  ai add --name mytool --command "mytool run" --description "My tool"\n');

    console.log(chalk.bold('Editing Tools:'));
    console.log('  ai edit mytool --description "Updated description"');
    console.log('  ai edit --tool-name mytool --command "new command"\n');

    console.log(chalk.bold('Running Queries:'));
    console.log('  ai "explain this JavaScript function"');
    console.log('  ai run gpt4 "write a React component" --debug');
    console.log('  ai "debug this error" --no-autocheck  # Skip fallback\n');

    console.log(chalk.bold('Benchmarking:'));
    console.log('  ai check              # Benchmark all enabled tools');
    console.log('  ai check --debug      # Show executed commands');
    console.log('  ai check --include-disabled  # Include disabled tools\n');

    console.log(chalk.bold('Managing Tools:'));
    console.log('  ai list               # View all tools with status');
    console.log('  ai find openai        # Search for tools');
    console.log('  ai disable slowtool   # Temporarily disable tool');
    console.log('  ai delete mytool --yes  # Remove tool non-interactively\n');

    console.log(chalk.bold('Configuration:'));
    console.log('  ai export config.json # Export configuration');
    console.log('  ai import config.json # Import configuration\n');

    console.log(chalk.bold('🎨 Response Formatting:'));
    console.log('• Automatic markdown rendering for all AI responses');
    console.log('• Clean terminal display with syntax highlighting');
    console.log('• Performance attribution with timing\n');

    console.log(chalk.bold('⚙️ Configuration Structure:'));
    console.log('Tools are stored in JSON format with:');
    console.log('• name: Tool identifier');
    console.log('• command: Executable command with placeholders');
    console.log('• description: Human-readable description');
    console.log('• systemPrompt: Optional AI personality/role');
    console.log('• disabled: Optional exclusion flag');
    console.log('• Performance metrics: time_taken, last_ran, okay status\n');

    console.log(chalk.bold('🔍 Smart Features:'));
    console.log('• Automatic tool selection based on historical performance');
    console.log('• Graceful fallback when tools fail');
    console.log('• Error tracking and last_error storage');
    console.log('• Tool enable/disable for maintenance');
    console.log('• Cross-platform configuration management\n');

    console.log(chalk.bold('📋 Best Practices:'));
    console.log('1. Run "ai check" after adding new tools to establish performance baselines');
    console.log('2. Use descriptive tool names with lowercase letters and numbers only');
    console.log('3. Test tools individually with "ai run <tool> <query>" before benchmarking');
    console.log('4. Use --debug flag during testing to see actual commands executed');
    console.log('5. Regularly benchmark tools to maintain optimal selection');
    console.log('6. Use enable/disable for temporary tool management during maintenance');
    console.log('7. Export configuration before major changes for backup\n');

    console.log(chalk.bold('🚨 Important Notes:'));
    console.log('• Tools must be executable from command line with proper permissions');
    console.log('• Commands should accept prompts as final arguments or via stdin');
    console.log('• Use quotes for multi-word queries: ai "explain this code"');
    console.log('• Configuration stored in: Windows %APPDATA%/heyai, macOS/Linux ~/.config/heyai');
    console.log('• Markdown rendering works for all successful AI responses');
    console.log('• Fallback only tries tools with passing benchmark status');
    console.log('• --no-autocheck skips fallback and fails immediately if best tool fails\n');

    console.log(chalk.bold.green('✨ Ready to get started? Run "ai add" to configure your first AI tool!'));
}