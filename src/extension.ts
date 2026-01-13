import * as vscode from 'vscode';
import { AgentKitPanel } from './webview/AgentKitPanel';
import { initAgentsCommand } from './commands/initAgents';
import { quickInitCommand } from './commands/quickPick';
import { refreshAgentsCommand } from './commands/refreshAgents';
import { updateAgentsCommand } from './commands/updateAgents';
import { removeAgentsCommand } from './commands/removeAgents';
import { InstalledAgentsProvider } from './providers/InstalledAgentsProvider';
import { AvailableAgentsProvider } from './providers/AvailableAgentsProvider';
import { ConfigService } from './services/ConfigService';
import { FileSystemService } from './services/FileSystemService';
import { logger } from './utils/logger';
import { COMMANDS, TREE_VIEW_IDS, GLOBAL_STATE_KEYS } from './utils/constants';
import { AgentKitService } from './services/AgentKitService';
import path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const configService = new ConfigService();
  const fileSystemService = new FileSystemService();

  // Show welcome message on first activation
  showWelcomeMessageIfNeeded(context, configService);

  // Register tree data providers
  const installedAgentsProvider = new InstalledAgentsProvider();
  const availableAgentsProvider = new AvailableAgentsProvider();

  const installedTreeView = vscode.window.createTreeView(TREE_VIEW_IDS.INSTALLED, {
    treeDataProvider: installedAgentsProvider,
    showCollapseAll: true,
  });

  const availableTreeView = vscode.window.createTreeView(TREE_VIEW_IDS.AVAILABLE, {
    treeDataProvider: availableAgentsProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(installedTreeView, availableTreeView);

  // Register commands
  registerCommands(context, installedAgentsProvider, availableAgentsProvider, fileSystemService);

  // Setup file watchers
  setupFileWatchers(context, installedAgentsProvider);

  // Create status bar item
  createStatusBarItem(context);

  logger.info('AgentKit extension activated successfully');
}

function registerCommands(
  context: vscode.ExtensionContext,
  installedProvider: InstalledAgentsProvider,
  availableProvider: AvailableAgentsProvider,
  fileSystemService: FileSystemService
) {
  context.subscriptions.push(
    // Open Panel
    vscode.commands.registerCommand(COMMANDS.OPEN_PANEL, () => {
      logger.info('Opening AgentKit panel');
      AgentKitPanel.createOrShow(context.extensionUri);
    }),

    // Quick Init
    vscode.commands.registerCommand(COMMANDS.QUICK_INIT, () => {
      logger.info('Starting quick init');
      quickInitCommand(context);
    }),

    // Init Agents
    vscode.commands.registerCommand(COMMANDS.INIT_AGENTS, () => {
      logger.info('Starting init agents');
      initAgentsCommand(context);
    }),

    // Refresh Agents
    vscode.commands.registerCommand(COMMANDS.REFRESH_AGENTS, () => {
      logger.info('Refreshing agents');
      installedProvider.refresh();
      availableProvider.refresh();
      refreshAgentsCommand();
    }),

    // Update Agents
    vscode.commands.registerCommand(COMMANDS.UPDATE_AGENTS, async () => {
      logger.info('Updating agents');
      await updateAgentsCommand();
    }),

    // Remove Agents
    vscode.commands.registerCommand(COMMANDS.REMOVE_AGENTS, async () => {
      logger.info('Removing agents');
      await removeAgentsCommand();
    }),

    // View Agent
    vscode.commands.registerCommand(COMMANDS.VIEW_AGENT, async (agentPath: string) => {
      logger.info('Viewing agent', agentPath);
      
      if (agentPath && typeof agentPath === 'string') {
        try {
          await fileSystemService.openFile(agentPath);
        } catch (error) {
          logger.error('Error opening agent file', error as Error);
          vscode.window.showErrorMessage(`Failed to open agent: ${path.basename(agentPath)}`);
        }
      } else {
        vscode.window.showWarningMessage('No agent file selected');
      }
    }),

    // Open Settings
    vscode.commands.registerCommand(COMMANDS.OPEN_SETTINGS, () => {
      logger.info('Opening settings');
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        '@ext:patricio0312rev.agentkit-vscode'
      );
    }),

    // Preview Agent (for available agents)
    vscode.commands.registerCommand('agentkit.previewAgent', async (departmentId: string, agentName: string) => {
      logger.info('Previewing agent', departmentId, agentName);
      
      const agentKitService = new AgentKitService();
      const departments = await agentKitService.getDepartments();
      const dept = departments[departmentId];
      
      if (!dept) {
        vscode.window.showErrorMessage('Department not found');
        return;
      }

      const agentDescriptions: Record<string, string> = {
        // Design
        'brand-guardian': 'Ensure brand consistency and visual identity across all touchpoints',
        'ui-designer': 'Design beautiful, accessible interfaces and component systems',
        'ux-researcher': 'Conduct user research, usability testing, and journey mapping',
        'visual-storyteller': 'Create compelling marketing visuals and graphics',
        'whimsy-injector': 'Add delightful micro-interactions and personality',
        
        // Engineering
        'ai-engineer': 'AI/ML model integration, prompt engineering, and optimization',
        'backend-architect': 'API design, database architecture, and server infrastructure',
        'devops-automator': 'CI/CD pipelines, infrastructure as code, and deployments',
        'frontend-developer': 'React, Vue, Angular UI implementation and optimization',
        'mobile-app-builder': 'iOS and Android native and cross-platform development',
        'rapid-prototyper': 'Fast MVP development and proof-of-concept building',
        'test-writer-fixer': 'Unit tests, integration tests, and quality assurance',
        
        // Marketing
        'app-store-optimizer': 'ASO for App Store and Google Play listings',
        'content-creator': 'Blog posts, videos, social media, and marketing copy',
        'growth-hacker': 'Viral loops, growth experiments, and user acquisition',
        'instagram-curator': 'Instagram content strategy and visual curation',
        'reddit-community-builder': 'Authentic Reddit engagement and community building',
        'tiktok-strategist': 'TikTok trends, viral content, and influencer partnerships',
        'twitter-engager': 'Twitter/X engagement, threads, and real-time marketing',
        
        // Product
        'feedback-synthesizer': 'Analyze user feedback and identify patterns',
        'sprint-prioritizer': 'Feature prioritization and roadmap planning',
        'trend-researcher': 'Market trends, competitor analysis, and opportunities',
        
        // Project Management
        'experiment-tracker': 'A/B testing, feature flags, and experimentation',
        'project-shipper': 'Launch coordination and go-to-market execution',
        'studio-producer': 'Cross-team coordination and project management',
        
        // Studio Operations
        'analytics-reporter': 'Metrics dashboards, KPIs, and business intelligence',
        'finance-tracker': 'Budget management, cost tracking, and financial planning',
        'infrastructure-maintainer': 'System reliability, monitoring, and incident response',
        'legal-compliance-checker': 'Privacy compliance, terms of service, and legal review',
        'support-responder': 'Customer support, help documentation, and ticket management',
        
        // Testing
        'api-tester': 'API testing, load testing, and performance benchmarking',
        'performance-benchmarker': 'Speed optimization and performance profiling',
        'test-results-analyzer': 'Test data analysis, quality metrics, and reporting',
        'tool-evaluator': 'Rapid tool assessment and comparative analysis',
        'workflow-optimizer': 'Process optimization and human-agent collaboration'
      };

      const description = agentDescriptions[agentName] || 'Agent description not available';
      
      const action = await vscode.window.showInformationMessage(
        `${agentName}\n\n${description}\n\nDepartment: ${dept.name}`,
        { modal: false },
        'Install Agent',
        'Later'
      );

      if (action === 'Install Agent') {
        // Open Agent Manager
        vscode.commands.executeCommand(COMMANDS.OPEN_PANEL);
      }
    })
  );
}

function setupFileWatchers(
  context: vscode.ExtensionContext,
  installedProvider: InstalledAgentsProvider
) {
  const configService = new ConfigService();

  if (!configService.getAutoRefresh()) {
    logger.info('Auto-refresh is disabled');
    return;
  }

  // Watch for changes in agent folders
  const patterns = [
    '**/.cursorrules/**/*.md',
    '**/.claude/**/*.md',
    '**/.aider/**/*.md',
    '**/.github/copilot-instructions.md',
    '**/.ai/**/*.md'
  ];

  patterns.forEach(pattern => {
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    watcher.onDidChange(() => {
      logger.debug('File changed, refreshing');
      installedProvider.refresh();
    });

    watcher.onDidCreate(() => {
      logger.debug('File created, refreshing');
      installedProvider.refresh();
    });

    watcher.onDidDelete(() => {
      logger.debug('File deleted, refreshing');
      installedProvider.refresh();
    });

    context.subscriptions.push(watcher);
  });

  logger.info('File watchers set up');
}

function createStatusBarItem(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  statusBarItem.command = COMMANDS.OPEN_PANEL;
  statusBarItem.text = '$(robot) AgentKit';
  statusBarItem.tooltip = 'Open AgentKit Manager';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
  logger.info('Status bar item created');
}

async function showWelcomeMessageIfNeeded(
  context: vscode.ExtensionContext,
  configService: ConfigService
) {
  const hasShownWelcome = context.globalState.get(GLOBAL_STATE_KEYS.HAS_SHOWN_WELCOME);
  const showWelcome = configService.getShowWelcome();

  if (!hasShownWelcome && showWelcome) {
    logger.info('Showing welcome message');

    const answer = await vscode.window.showInformationMessage(
      '👋 Welcome to AgentKit!\n\nSet up AI agents for your development workflow now?',
      { modal: false },
      'Quick Setup',
      'Custom Setup'
    );

    if (answer === 'Quick Setup') {
      vscode.commands.executeCommand(COMMANDS.QUICK_INIT);
    } else if (answer === 'Custom Setup') {
      vscode.commands.executeCommand(COMMANDS.OPEN_PANEL);
    }

    // Mark as shown regardless of choice
    context.globalState.update(GLOBAL_STATE_KEYS.HAS_SHOWN_WELCOME, true);
  }
}

export function deactivate() {
  logger.info('AgentKit extension deactivated');
  logger.dispose();
}
