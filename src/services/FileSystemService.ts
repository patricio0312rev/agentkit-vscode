import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger';

export class FileSystemService {
  async getWorkspaceFolder(): Promise<vscode.Uri | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return undefined;
    }
    return workspaceFolders[0].uri;
  }

  async folderExists(folderPath: string): Promise<boolean> {
    try {
      const stat = await vscode.workspace.fs.stat(vscode.Uri.file(folderPath));
      return stat.type === vscode.FileType.Directory;
    } catch {
      return false;
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const stat = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
      return stat.type === vscode.FileType.File;
    } catch {
      return false;
    }
  }

  async readFile(filePath: string): Promise<string> {
    const uri = vscode.Uri.file(filePath);
    const content = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(content).toString('utf8');
  }

  async getInstalledAgents(workspaceRoot: string): Promise<string[]> {
    const agentFolders = ['.cursorrules', '.claude', '.aider', '.github', '.ai'];
    const installedAgents: string[] = [];

    for (const folder of agentFolders) {
      const folderPath = path.join(workspaceRoot, folder);
      if (await this.folderExists(folderPath)) {
        try {
          const files = await this.listMarkdownFiles(folderPath);
          installedAgents.push(...files.map(f => path.relative(workspaceRoot, f)));
        } catch (error) {
          logger.error(`Error reading folder ${folder}`, error as Error);
        }
      }
    }

    return installedAgents;
  }

  private async listMarkdownFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.listMarkdownFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      logger.error(`Error listing files in ${dirPath}`, error as Error);
    }

    return files;
  }

  async revealInExplorer(filePath: string): Promise<void> {
    const uri = vscode.Uri.file(filePath);
    await vscode.commands.executeCommand('revealInExplorer', uri);
  }

  async openFile(filePath: string): Promise<void> {
    const uri = vscode.Uri.file(filePath);
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
  }
}