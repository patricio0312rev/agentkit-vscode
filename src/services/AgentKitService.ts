import * as path from 'path';
import * as vscode from 'vscode';
import { AgentConfig } from '../models/AgentConfig';
import { logger } from '../utils/logger';
import { generateAgentsFlat, getDepartments, getAvailableAgents } from '../utils/agentGenerator';

export class AgentKitService {
  async generateAgents(config: AgentConfig, workspaceRoot: string): Promise<void> {
    logger.info('Generating agents with config:', config);

    try {
      // Get bundled templates path
      const extensionPath = vscode.extensions.getExtension('patricio0312rev.agentkit-vscode')?.extensionPath;
      const templatesPath = path.join(extensionPath!, 'dist', 'templates'); // Changed to dist
      
      // Change to workspace directory
      const originalCwd = process.cwd();
      process.chdir(workspaceRoot);

      try {
        await generateAgentsFlat(config, templatesPath);
        logger.info('Agents generated successfully');
      } finally {
        process.chdir(originalCwd);
      }
    } catch (error) {
      logger.error('Error generating agents', error as Error);
      throw error;
    }
  }

  async getDepartments(): Promise<Record<string, any>> {
    return getDepartments();
  }

  async getAvailableAgents(): Promise<any[]> {
    return getAvailableAgents();
  }
}
