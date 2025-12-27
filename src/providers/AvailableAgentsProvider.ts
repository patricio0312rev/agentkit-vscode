import * as vscode from 'vscode';
import { AgentTreeItem } from './AgentTreeItem';
import { AgentKitService } from '../services/AgentKitService';
import { logger } from '../utils/logger';

export class AvailableAgentsProvider implements vscode.TreeDataProvider<AgentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<AgentTreeItem | undefined | null | void> = 
    new vscode.EventEmitter<AgentTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<AgentTreeItem | undefined | null | void> = 
    this._onDidChangeTreeData.event;

  private agentKitService: AgentKitService;
  private departments: any = {};

  constructor() {
    this.agentKitService = new AgentKitService();
    this.loadDepartments();
  }

  refresh(): void {
    this.loadDepartments();
    this._onDidChangeTreeData.fire();
  }

  private async loadDepartments(): Promise<void> {
    try {
      this.departments = await this.agentKitService.getDepartments();
    } catch (error) {
      logger.error('Error loading departments', error as Error);
    }
  }

  getTreeItem(element: AgentTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: AgentTreeItem): Promise<AgentTreeItem[]> {
    if (!element) {
      // Root level - show departments
      return this.getDepartmentItems();
    } else if (element.type === 'department' && element.departmentId) {
      // Department level - show agents
      return this.getAgentItems(element.departmentId);
    }

    return [];
  }

  private getDepartmentItems(): AgentTreeItem[] {
    const items: AgentTreeItem[] = [];

    for (const [deptId, dept] of Object.entries(this.departments)) {
      const deptData = dept as any;
      const item = new AgentTreeItem(
        `${deptData.name} (${deptData.agents.length})`,
        vscode.TreeItemCollapsibleState.Collapsed,
        'department',
        deptId
      );
      items.push(item);
    }

    return items;
  }

  private getAgentItems(departmentId: string): AgentTreeItem[] {
    const dept = this.departments[departmentId];
    if (!dept) {
      return [];
    }
  
    return dept.agents.map((agentName: string) => {
      const item = new AgentTreeItem(
        agentName,
        vscode.TreeItemCollapsibleState.None,
        'agent',
        departmentId,
        `${departmentId}/${agentName}`
      );
      
      item.command = {
        command: 'agentkit.previewAgent',
        title: 'Preview Agent',
        arguments: [departmentId, agentName]
      };
      
      item.tooltip = new vscode.MarkdownString(
        `**${agentName}**\n\nDepartment: ${dept.name}\n\n*Click to preview or install this agent*`
      );
      
      return item;
    });
  }
}