export const EXTENSION_ID = 'agentkit-vscode';
export const EXTENSION_NAME = 'AgentKit';

export const COMMANDS = {
  OPEN_PANEL: 'agentkit.openPanel',
  QUICK_INIT: 'agentkit.quickInit',
  INIT_AGENTS: 'agentkit.initAgents',
  REFRESH_AGENTS: 'agentkit.refreshAgents',
  UPDATE_AGENTS: 'agentkit.updateAgents',
  REMOVE_AGENTS: 'agentkit.removeAgents',
  VIEW_AGENT: 'agentkit.viewAgent',
  OPEN_SETTINGS: 'agentkit.openSettings'
} as const;

export const CONFIG_KEYS = {
  DEFAULT_TOOL: 'agentkit.defaultTool',
  DEFAULT_FOLDER: 'agentkit.defaultFolder',
  AUTO_REFRESH: 'agentkit.autoRefresh',
  SHOW_WELCOME: 'agentkit.showWelcome',
  DEFAULT_DEPARTMENTS: 'agentkit.defaultDepartments'
} as const;

export const TREE_VIEW_IDS = {
  INSTALLED: 'agentkit-installed',
  AVAILABLE: 'agentkit-available'
} as const;

export const GLOBAL_STATE_KEYS = {
  HAS_SHOWN_WELCOME: 'agentkit.hasShownWelcome'
} as const;