import * as vscode from 'vscode';
import { AgentKitService } from '../services/AgentKitService';
import { FileSystemService } from '../services/FileSystemService';
import { logger } from '../utils/logger';
import { getWebviewContent } from './webviewContent';

export class AgentKitPanel {
  public static currentPanel: AgentKitPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private agentKitService: AgentKitService;
  private fileSystemService: FileSystemService;

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (AgentKitPanel.currentPanel) {
      AgentKitPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'agentkitPanel',
      'AgentKit Manager',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    AgentKitPanel.currentPanel = new AgentKitPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this.agentKitService = new AgentKitService();
    this.fileSystemService = new FileSystemService();

    this._panel.webview.html = getWebviewContent();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'install':
            await this.handleInstall(message.data);
            break;
          case 'getDepartments':
            await this.handleGetDepartments();
            break;
          case 'cancel':
            this._panel.dispose();
            break;
        }
      },
      null,
      this._disposables
    );
  }

  private async handleGetDepartments() {
    try {
      const departments = await this.agentKitService.getDepartments();
      this._panel.webview.postMessage({
        command: 'departmentsData',
        data: departments
      });
    } catch (error: any) {
      logger.error('Error getting departments', error);
    }
  }

  private async handleInstall(data: any) {
    const { tool, folder, departments, agents } = data;

    try {
      const workspaceFolder = await this.fileSystemService.getWorkspaceFolder();
      if (!workspaceFolder) {
        throw new Error('No workspace folder open');
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Installing AgentKit agents...',
          cancellable: false
        },
        async (progress) => {
          progress.report({ increment: 0, message: 'Preparing...' });

          const config = {
            tool,
            folder,
            departments,
            agents,
            stack: []
          };

          progress.report({ increment: 30, message: 'Generating agents...' });

          await this.agentKitService.generateAgents(config, workspaceFolder.fsPath);

          progress.report({ increment: 100, message: 'Complete!' });

          const action = await vscode.window.showInformationMessage(
            `✅ AgentKit: Installed ${agents.length} agents successfully!`,
            'Open Folder',
            'Done'
          );

          if (action === 'Open Folder') {
            await this.fileSystemService.revealInExplorer(
              vscode.Uri.joinPath(workspaceFolder, folder).fsPath
            );
          }

          this._panel.webview.postMessage({ command: 'installComplete' });
          vscode.commands.executeCommand('agentkit.refreshAgents');
        }
      );
    } catch (error: any) {
      logger.error('Error installing agents', error);
      vscode.window.showErrorMessage(`AgentKit Error: ${error.message}`);
    }
  }

  public dispose() {
    AgentKitPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}