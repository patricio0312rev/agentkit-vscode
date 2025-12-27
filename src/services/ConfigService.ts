import * as vscode from 'vscode';
import { CONFIG_KEYS } from '../utils/constants';
import { ToolType } from '../models/AgentConfig';

export class ConfigService {
  private config: vscode.WorkspaceConfiguration;

  constructor() {
    this.config = vscode.workspace.getConfiguration();
  }

  refresh(): void {
    this.config = vscode.workspace.getConfiguration();
  }

  getDefaultTool(): ToolType {
    return this.config.get<ToolType>(CONFIG_KEYS.DEFAULT_TOOL, 'cursor');
  }

  getDefaultFolder(): string {
    return this.config.get<string>(CONFIG_KEYS.DEFAULT_FOLDER, '');
  }

  getAutoRefresh(): boolean {
    return this.config.get<boolean>(CONFIG_KEYS.AUTO_REFRESH, true);
  }

  getShowWelcome(): boolean {
    return this.config.get<boolean>(CONFIG_KEYS.SHOW_WELCOME, true);
  }

  getDefaultDepartments(): string[] {
    return this.config.get<string[]>(CONFIG_KEYS.DEFAULT_DEPARTMENTS, ['engineering', 'design']);
  }

  async setDefaultTool(tool: ToolType): Promise<void> {
    await this.config.update(
      CONFIG_KEYS.DEFAULT_TOOL,
      tool,
      vscode.ConfigurationTarget.Global
    );
    this.refresh();
  }

  async setShowWelcome(show: boolean): Promise<void> {
    await this.config.update(
      CONFIG_KEYS.SHOW_WELCOME,
      show,
      vscode.ConfigurationTarget.Global
    );
    this.refresh();
  }
}