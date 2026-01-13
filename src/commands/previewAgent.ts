import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';
import { agentDescriptions } from '../webview/data/agentDescriptions';

export async function previewAgentCommand(departmentId: string, agentName: string): Promise<void> {
  logger.info('Previewing agent', { departmentId, agentName });

  try {
    const extensionPath = vscode.extensions.getExtension('patricio0312rev.agentkit-vscode')?.extensionPath;
    if (!extensionPath) {
      throw new Error('Extension path not found');
    }

    // Construct path to agent template
    const templatePath = path.join(extensionPath, 'dist', 'templates', departmentId, `${agentName}.md`);

    let templateContent: string;
    try {
      templateContent = fs.readFileSync(templatePath, 'utf-8');
    } catch {
      // If template not found, create a preview with description
      const description = agentDescriptions[agentName] || 'Agent description not available';
      templateContent = `# ${formatAgentName(agentName)}\n\n**Department:** ${formatDepartmentName(departmentId)}\n\n## Description\n\n${description}\n\n---\n\n*Click "Install Agent" to add this agent to your project.*`;
    }

    // Open in read-only preview mode
    const doc = await vscode.workspace.openTextDocument({
      content: templateContent,
      language: 'markdown',
    });

    await vscode.window.showTextDocument(doc, {
      preview: true,
      viewColumn: vscode.ViewColumn.Beside,
    });

    // Show install action
    const action = await vscode.window.showInformationMessage(
      `Preview: ${formatAgentName(agentName)}`,
      'Install Agent',
      'Close'
    );

    if (action === 'Install Agent') {
      vscode.commands.executeCommand('agentkit.openPanel');
    }
  } catch (error) {
    logger.error('Failed to preview agent', error as Error);
    vscode.window.showErrorMessage(`Failed to preview agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function formatAgentName(agentName: string): string {
  return agentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDepartmentName(deptId: string): string {
  return deptId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
