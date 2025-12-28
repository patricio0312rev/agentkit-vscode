import * as fs from 'fs-extra';
import * as path from 'path';
import { logger } from './logger';

interface AgentConfig {
  folder: string;
  departments: string[];
  agents?: string[];
  tool: string;
  skipExamples?: boolean;
  stack?: string[];
}

interface Department {
  name: string;
  description: string;
  agents: string[];
}

const DEPARTMENTS: Record<string, Department> = {
  engineering: {
    name: 'Engineering',
    description: 'Software development and infrastructure',
    agents: ['ai-engineer', 'backend-architect', 'devops-automator', 'frontend-developer', 'mobile-app-builder', 'rapid-prototyper', 'test-writer-fixer']
  },
  design: {
    name: 'Design',
    description: 'Visual design and user experience',
    agents: ['brand-guardian', 'ui-designer', 'ux-researcher', 'visual-storyteller', 'whimsy-injector']
  },
  marketing: {
    name: 'Marketing',
    description: 'Growth and user acquisition',
    agents: ['app-store-optimizer', 'content-creator', 'growth-hacker', 'instagram-curator', 'reddit-community-builder', 'tiktok-strategist', 'twitter-engager']
  },
  product: {
    name: 'Product',
    description: 'Product strategy and research',
    agents: ['feedback-synthesizer', 'sprint-prioritizer', 'trend-researcher']
  },
  'project-management': {
    name: 'Project Management',
    description: 'Project coordination and delivery',
    agents: ['experiment-tracker', 'project-shipper', 'studio-producer']
  },
  'studio-operations': {
    name: 'Studio Operations',
    description: 'Business operations and support',
    agents: ['analytics-reporter', 'finance-tracker', 'infrastructure-maintainer', 'legal-compliance-checker', 'support-responder']
  },
  testing: {
    name: 'Testing',
    description: 'Quality assurance and optimization',
    agents: ['api-tester', 'performance-benchmarker', 'test-results-analyzer', 'tool-evaluator', 'workflow-optimizer']
  }
};

export async function generateAgentsFlat(config: AgentConfig, templatesPath: string): Promise<void> {
    const targetDir = path.join(process.cwd(), config.folder);
    
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
  
    let count = 0;
  
    for (const dept of config.departments) {
      const deptInfo = DEPARTMENTS[dept];
      if (!deptInfo) continue;
  
      // Determine which agents to generate
      let agentsToGenerate = deptInfo.agents;
      
      if (config.agents && config.agents.length > 0) {
        agentsToGenerate = agentsToGenerate.filter(agent => {
          return config.agents!.includes(agent) || 
                 config.agents!.includes(`${dept}/${agent}`);
        });
      }
  
      // Copy each agent file DIRECTLY to target folder (no subdirectories)
      for (const agent of agentsToGenerate) {
        const sourceFile = path.join(templatesPath, 'departments', dept, `${agent}.md`);
        const targetFile = path.join(targetDir, `${agent}.md`); // FLAT structure
  
        try {
          if (await fs.pathExists(sourceFile)) {
            let content = await fs.readFile(sourceFile, 'utf8');
            content = processAgentContent(content, config);
            await fs.writeFile(targetFile, content);
            count++;
            logger.info(`Generated agent: ${agent}`);
          } else {
            const basicTemplate = generateBasicAgentTemplate(dept, agent, deptInfo);
            await fs.writeFile(targetFile, basicTemplate);
            count++;
            logger.info(`Generated placeholder agent: ${agent}`);
          }
        } catch (error) {
          logger.error(`Error generating agent ${agent}:`, error as Error);
        }
      }
    }
  
    logger.info(`Generated ${count} agents`);
  }

function processAgentContent(content: string, config: AgentConfig): string {
  let processed = content;

  // Remove examples if requested
  if (config.skipExamples) {
    processed = processed.replace(/<example>[\s\S]*?<\/example>/g, '');
    processed = processed.replace(/\n{3,}/g, '\n\n');
  }

  // Ensure model field is present in frontmatter
  if (!processed.includes('model:')) {
    // Insert model: sonnet in frontmatter
    processed = processed.replace(
      /---\n([\s\S]*?)\n---/,
      (match, frontmatter) => `---\n${frontmatter}\nmodel: sonnet\n---`
    );
  }

  // Add tech stack if provided
  if (config.stack && config.stack.length > 0) {
    const stackSection = `\n\n## Tech Stack Context\n\nThis project uses: ${config.stack.join(', ')}\n`;
    processed += stackSection;
  }

  return processed;
}

function generateBasicAgentTemplate(dept: string, agent: string, deptInfo: Department): string {
  const agentName = agent.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return `---
name: ${agent}
description: AI agent for ${deptInfo.name}. Use this agent when working on ${dept}-related tasks.
model: sonnet
---

# ${agentName}

You are a ${agentName} specialized in ${deptInfo.description}.

## Responsibilities

- [Add specific responsibilities]

## Best Practices

- [Add best practices]

## Examples

- [Add usage examples]
`;
}

export function getDepartments(): Record<string, Department> {
  return DEPARTMENTS;
}

export function getAvailableAgents(): Array<{ id: string; name: string; department: string; departmentName: string }> {
  const agents: Array<{ id: string; name: string; department: string; departmentName: string }> = [];

  Object.entries(DEPARTMENTS).forEach(([deptId, dept]) => {
    dept.agents.forEach(agentName => {
      agents.push({
        id: `${deptId}/${agentName}`,
        name: agentName,
        department: deptId,
        departmentName: dept.name
      });
    });
  });

  return agents;
}
