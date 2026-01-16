# HeyAI

A CLI-based app for non-interactive (direct) inference from popular AI CLI tools such as Claude Code, Gemini CLI, Codex, OpenCode, etc.

## Features

- **Tool Management**: Add, edit, delete, view, list, and search tools
- **Benchmarking**: Test all tools to find the fastest one
- **Unified Interface**: Run any tool with a simple command
- **Smart Selection**: Automatically use the best-performing tool with fallback to alternatives
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Interactive & Non-Interactive**: Supports both modes for automation
- **Performance Tracking**: Tracks response times and success rates
- **Error Handling**: Graceful fallback and error storage for debugging

## Installation

### Global Installation
```bash
npm install -g heyai
```

### Local Development
```bash
git clone <repo-url>
cd heyai
npm install
npm link
```

## Usage

### Basic Usage
Run AI queries with automatic tool selection:
```bash
ai "explain this code snippet"
ai "write a function to sort an array"
```

### Tool Management

#### Add a Tool
Interactive mode:
```bash
ai add
```

Non-interactive mode:
```bash
ai add --name mytool --command "mytool run" --description "My AI tool"
```

#### List All Tools
```bash
ai list
```

#### View Tool Details
```bash
ai view <tool-name>
```

#### Edit a Tool
```bash
ai edit [tool-name]
```

If tool name is not provided, interactive mode allows selecting a tool and choosing which properties to edit.
```bash
ai edit                           # Interactive mode
ai edit mytool --name "newname"   # Direct edit
ai edit --tool-name mytool --name "newname"  # Alternative syntax
```

If tool name is not provided, interactive mode allows selecting a tool and choosing which properties to edit.
```bash
ai edit  # Interactive mode
ai edit mytool --name "newname"  # Direct edit
```

#### Delete Tools
```bash
ai delete [tool-name]
```

If no tool name is provided, interactive mode allows selecting multiple tools to delete.
```bash
ai delete                   # Interactive mode
ai delete mytool            # Delete specific tool
ai delete --tool-name mytool --yes  # Alternative syntax with confirmation skip
```

#### Search Tools
Fuzzy search across tool names and descriptions:
```bash
ai find openai
```

### Benchmarking

#### Check All Tools
Benchmark all tools and determine the best one:
```bash
ai check
```

With debug output:
```bash
ai check --debug
```

### Advanced Usage

#### Run a Specific Tool
```bash
ai run <tool-name> "your prompt here"
```

With debug output:
```bash
ai run <tool-name> "your prompt here" --debug
```

#### Export Configuration
Export current configuration to a file:
```bash
ai export
ai export /path/to/config.json
```

If no path is provided, exports to `config-exported.json` in the config directory.

#### Import Configuration
Import configuration from a file (overwrites existing config):
```bash
ai import /path/to/config.json
```

#### Enable/Disable Tools
Enable or disable tools to control which ones are used:
```bash
ai enable <tool-name>
ai disable <tool-name>
```

Disabled tools are skipped during automatic fallback and benchmarking (unless `--include-disabled` is used with `check`).

#### Check Command Options
```bash
ai check --include-disabled  # Include disabled tools in benchmark
```

#### Onboard Command
Display comprehensive guide for AI agents learning to use HeyAI:
```bash
ai onboard
```

#### Disable Automatic Fallback
By default, if the best tool fails, HeyAI tries other working tools. Disable this:
```bash
ai "prompt" --no-autocheck
```

## Configuration

Configuration is stored automatically in:
- **Windows**: `%APPDATA%\heyai-nodejs\Config\config.json`
- **macOS/Linux**: `~/.config/heyai-nodejs/config.json`

### Config Structure
```json
{
  "tools": [
    {
      "name": "opencode",
      "command": "opencode --model \"opencode/grok-code\" --format default run",
      "description": "OpenCode Grok Code AI assistant",
      "time_taken": 2.34,
      "last_ran": "2026-01-16T08:00:00.000Z",
      "okay": true,
      "last_error": null
    }
  ],
  "best": "opencode"
}
```

## How It Works

### Automatic Tool Selection
1. **Primary**: Uses the configured "best" tool (fastest successful tool from benchmarks)
2. **Fallback**: If primary fails, tries other working tools in order of speed
3. **Success**: Updates "best" tool when a faster alternative succeeds
4. **Failure**: Stores errors in config for debugging

### Performance Tracking
- Response times are measured for each tool execution
- Success/failure rates are tracked
- Benchmarking (`ai check`) establishes baseline performance

### Error Handling
- Silent failure handling during automatic mode
- Errors stored in `last_error` field for `ai view` inspection
- Graceful degradation to alternative tools

## Development

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Type Check
```bash
npm run type-check
```

### Development Mode
```bash
npm run dev
```

### Project Structure
```
src/
├── commands/          # CLI command implementations
│   ├── add.ts        # Add tool command
│   ├── check.ts      # Benchmark command
│   ├── default.ts    # Main AI query handler
│   ├── delete.ts     # Delete tool command
│   ├── edit.ts       # Edit tool command
│   ├── find.ts       # Search command
│   ├── list.ts       # List tools command
│   ├── run.ts        # Run specific tool command
│   └── view.ts       # View tool details command
├── config.ts         # Configuration management
├── executor.ts       # Tool execution logic
├── types.ts          # TypeScript interfaces
├── utils/            # Utility functions
│   ├── format.ts     # Time/date formatting
│   └── table.ts      # Table display utilities
├── validator.ts      # Input validation
└── index.ts          # CLI entry point
```

<!-- GENERAL-RULES-RULES-START -->

## You must always follow these rules:

- If you are unsure about any requirement, behavior, or implementation detail, ask clarifying questions **before** writing code.
- At every step, provide a **high-level explanation** of what changes were made and why.
- After implementing changes or new features, always provide a list of **suggestions or improvements**, even if they differ from the user's original request.
- If the user requests a change or feature that is an **anti-pattern** or violates well-established best practices, clearly explain the issue and ask for confirmation before proceeding.
- Use `backlog` for all task and issue management.

<!-- GENERAL-RULES-RULES-END -->