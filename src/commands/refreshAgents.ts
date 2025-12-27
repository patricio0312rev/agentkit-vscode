import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export function refreshAgentsCommand(): void {
  try {
    // Fire refresh events for both tree views
    vscode.commands.executeCommand('workbench.view.extension.agentkit-sidebar');
    
    logger.info('Agents refreshed');
    vscode.window.showInformationMessage('AgentKit: Agents refreshed');
  } catch (error: any) {
    logger.error('Error refreshing agents', error);
    vscode.window.showErrorMessage(`AgentKit Error: ${error.message}`);
  }
}
