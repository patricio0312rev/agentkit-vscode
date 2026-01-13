# AgentKit VSCode Extension - Development Guide

This guide is for AI coding agents working in the AgentKit VSCode extension codebase.

## Project Overview

AgentKit is a Visual Studio Code extension that provides a GUI for generating and managing AI agents for various tools (Cursor, Claude Code, GitHub Copilot, Aider, etc.). It uses TypeScript, the VSCode Extension API, and the `@patricio0312rev/agentkit` package.

## Build & Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Build for production (runs esbuild with --production)
npm run build

# Compile TypeScript (outputs to ./out directory)
npm run compile

# Watch mode (rebuilds on file changes)
npm run watch

# Clean build artifacts
npm run clean

# Lint TypeScript files
npm run lint

# Package extension (creates .vsix file)
npm run package

# Publish to VS Code Marketplace
npm run publish

# Publish to Open VSX Registry
npm run publish:ovsx
```

### Running & Testing
- **Run extension**: Press `F5` in VS Code to launch Extension Development Host
- **Reload extension**: Press `Ctrl+R` / `Cmd+R` in Extension Development Host
- **View logs**: Open "AgentKit" output channel in VS Code
- **No formal test suite**: Manual testing is currently used

## Code Style Guidelines

### TypeScript Configuration
- **Target**: ES2020, CommonJS modules
- **Strict mode**: Enabled (except `noImplicitAny: false`)
- **Source maps**: Always generate for debugging
- **Module resolution**: Node.js style

### Import Conventions
```typescript
// 1. External dependencies first (vscode, node modules)
import * as vscode from 'vscode';
import path from 'path';

// 2. Then internal modules (grouped by category)
import { AgentKitPanel } from './webview/AgentKitPanel';
import { initAgentsCommand } from './commands/initAgents';
import { InstalledAgentsProvider } from './providers/InstalledAgentsProvider';
import { ConfigService } from './services/ConfigService';
import { logger } from './utils/logger';
import { COMMANDS, TREE_VIEW_IDS } from './utils/constants';

// 3. Types and interfaces
import { AgentConfig } from './models/AgentConfig';
```

### Naming Conventions
- **Files**: PascalCase for classes (`AgentKitService.ts`), camelCase for utilities (`logger.ts`, `constants.ts`)
- **Classes**: PascalCase (`AgentKitService`, `InstalledAgentsProvider`)
- **Interfaces**: PascalCase, descriptive names (`AgentConfig`, `ToolType`)
- **Functions**: camelCase (`generateAgents`, `getDepartments`)
- **Constants**: UPPER_SNAKE_CASE for exported constants (`COMMANDS`, `CONFIG_KEYS`)
- **Constants objects**: Use `as const` for readonly type inference

### Code Formatting
- **Semicolons**: Required (ESLint rule enforced)
- **Quotes**: Single quotes preferred for strings
- **Indentation**: 2 spaces (no tabs)
- **Line length**: No strict limit, but keep reasonable (~100-120 chars)
- **Curly braces**: Always use for control structures (ESLint `curly` rule)
- **Equality**: Use `===` and `!==` (ESLint `eqeqeq` rule)

### Type Definitions
```typescript
// Prefer explicit types for parameters and return values
async generateAgents(config: AgentConfig, workspaceRoot: string): Promise<void> {
  // implementation
}

// Use type aliases for union types
export type ToolType = 'cursor' | 'claude-code' | 'copilot' | 'aider' | 'universal';

// Use interfaces for object shapes
export interface AgentConfig {
  tool: ToolType;
  folder: string;
  departments: string[];
  agents: string[];
  stack?: string[];
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}

// Use 'any' sparingly (currently allowed due to noImplicitAny: false)
// But always type external API responses when possible
```

### Error Handling
```typescript
// Always wrap risky operations in try-catch
try {
  await fileSystemService.openFile(agentPath);
} catch (error) {
  // Log errors using the logger utility
  logger.error('Error opening agent file', error as Error);
  
  // Show user-friendly messages
  vscode.window.showErrorMessage(`Failed to open agent: ${path.basename(agentPath)}`);
}

// Use finally blocks for cleanup
try {
  process.chdir(workspaceRoot);
  await agentkit.generate(config);
} finally {
  process.chdir(originalCwd);
}
```

### Logging Best Practices
```typescript
// Use the logger utility (src/utils/logger.ts)
import { logger } from './utils/logger';

// Log important operations
logger.info('Opening AgentKit panel');
logger.info('Generating agents with config:', config);

// Log errors with stack traces
logger.error('Error generating agents', error as Error);

// Use debug for verbose information
logger.debug('File changed, refreshing');

// Use warn for non-critical issues
logger.warn('No workspace folder found');
```

## Architecture

### Directory Structure
```
src/
├── commands/          # VSCode command implementations
├── models/            # TypeScript interfaces and types
├── providers/         # Tree view data providers
├── services/          # Business logic (AgentKit, FileSystem, Config)
├── utils/             # Utilities (logger, constants)
├── webview/           # WebView UI (HTML templates, scripts, styles)
│   ├── data/          # Static data for UI (departments, models, tools)
│   └── templates/     # HTML/CSS/JS template generators
└── extension.ts       # Extension entry point (activate/deactivate)
```

### Key Design Patterns
- **Services**: Encapsulate business logic (`AgentKitService`, `ConfigService`, `FileSystemService`)
- **Providers**: Implement `vscode.TreeDataProvider` for sidebar views
- **Commands**: Register in `extension.ts`, implement in `commands/` folder
- **Singleton logger**: Shared logger instance for consistent logging
- **Constants file**: Centralize magic strings and configuration keys

## VSCode Extension Specifics

### Registering Commands
```typescript
context.subscriptions.push(
  vscode.commands.registerCommand(COMMANDS.OPEN_PANEL, () => {
    logger.info('Opening AgentKit panel');
    AgentKitPanel.createOrShow(context.extensionUri);
  })
);
```

### Tree View Providers
- Implement `vscode.TreeDataProvider<T>`
- Call `refresh()` to update the view
- Use `onDidChangeTreeData` event emitter

### File System Watchers
- Watch patterns: `.cursorrules/**/*.md`, `.claude/**/*.md`, `.aider/**/*.md`, etc.
- Automatically refresh providers on file changes (if `autoRefresh` enabled)

### WebViews
- Use `vscode.Uri.joinPath()` for resource URIs
- Sanitize HTML and use CSP (Content Security Policy)
- Communicate via message passing (`webview.postMessage`)

## Common Tasks

### Adding a New Command
1. Define command ID in `src/utils/constants.ts`
2. Implement command logic in `src/commands/[commandName].ts`
3. Register in `src/extension.ts` `registerCommands()`
4. Add to `package.json` `contributes.commands`

### Adding a New Configuration
1. Add to `package.json` `contributes.configuration.properties`
2. Add key to `CONFIG_KEYS` in `src/utils/constants.ts`
3. Add getter/setter in `src/services/ConfigService.ts`

### Modifying Agent Generation
- Core logic is in `@patricio0312rev/agentkit` package (external dependency)
- Wrapper is `src/services/AgentKitService.ts`
- Agent metadata (departments, descriptions) is in `src/webview/data/`

## Testing Checklist
- [ ] Extension activates without errors
- [ ] Commands execute successfully from command palette
- [ ] Tree views display installed and available agents
- [ ] Agent generation creates files in correct locations
- [ ] File watchers refresh views on file changes
- [ ] WebView UI renders correctly
- [ ] Error messages are user-friendly
- [ ] Logger output is clean and informative

## Important Notes
- This is a **VS Code extension**, not a standalone app
- All file operations use `vscode.workspace.fs` or Node.js `fs` module
- UI uses native VS Code components + custom WebView
- The extension activates `onStartupFinished` (lazy activation)
- No test framework is currently configured
- Build uses esbuild (not webpack) for fast bundling
