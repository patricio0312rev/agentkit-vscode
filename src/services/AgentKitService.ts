import * as path from 'path';
import { AgentConfig } from '../models/AgentConfig';
import { logger } from '../utils/logger';

export class AgentKitService {
  async generateAgents(config: AgentConfig, workspaceRoot: string): Promise<void> {
    logger.info('Generating agents with config:', config);

    try {
      // Dynamically import with type assertion
      const generatorModule = await import('@patricio0312rev/agentkit/src/lib/generator');
      const generateAgents = generatorModule.generateAgents as (config: any) => Promise<void>;
      
      // Change to workspace directory before generating
      const originalCwd = process.cwd();
      process.chdir(workspaceRoot);

      try {
        await generateAgents(config);
        logger.info('Agents generated successfully');
      } finally {
        // Restore original working directory
        process.chdir(originalCwd);
      }
    } catch (error) {
      logger.error('Error generating agents', error as Error);
      throw error;
    }
  }

  async getDepartments(): Promise<Record<string, any>> {
    try {
      const configModule = await import('@patricio0312rev/agentkit/src/lib/config');
      return configModule.DEPARTMENTS as Record<string, any>;
    } catch (error) {
      logger.error('Error loading departments', error as Error);
      throw error;
    }
  }

  async getAvailableAgents(): Promise<any[]> {
    try {
      const configModule = await import('@patricio0312rev/agentkit/src/lib/config');
      const DEPARTMENTS = configModule.DEPARTMENTS as Record<string, any>;
      const agents: any[] = [];

      Object.entries(DEPARTMENTS).forEach(([deptId, dept]: [string, any]) => {
        dept.agents.forEach((agentName: string) => {
          agents.push({
            id: `${deptId}/${agentName}`,
            name: agentName,
            department: deptId,
            departmentName: dept.name
          });
        });
      });

      return agents;
    } catch (error) {
      logger.error('Error loading available agents', error as Error);
      return [];
    }
  }
}