export function getWebviewContent(): string {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgentKit Manager</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
  
      body {
        font-family: var(--vscode-font-family);
        color: var(--vscode-foreground);
        background-color: var(--vscode-editor-background);
        padding: 20px;
      }
  
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
  
      h1 {
        font-size: 28px;
        margin-bottom: 10px;
        color: var(--vscode-editor-foreground);
      }
  
      .subtitle {
        color: var(--vscode-descriptionForeground);
        margin-bottom: 30px;
      }
  
      .step {
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-panel-border);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 20px;
      }
  
      .step-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
  
      .step-number {
        width: 32px;
        height: 32px;
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
  
      .step-title {
        font-size: 18px;
        font-weight: 600;
      }
  
      .tool-grid, .department-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }
  
      /* Tool Card Styles */
      .tool-card {
        background: var(--vscode-input-background);
        border: 2px solid var(--vscode-input-border);
        border-radius: 6px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }
  
      .tool-card:hover {
        border-color: var(--vscode-focusBorder);
        transform: translateY(-2px);
      }
  
      .tool-card.selected {
        background: var(--vscode-button-secondaryBackground);
        border-color: var(--vscode-focusBorder);
      }
  
      .tool-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }
  
      .tool-icon {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
  
      .tool-name {
        font-weight: 600;
      }
  
      .tool-desc {
        font-size: 12px;
        color: var(--vscode-descriptionForeground);
      }
  
      /* Department Card Styles */
      .department-card {
        background: var(--vscode-input-background);
        border: 2px solid var(--vscode-input-border);
        border-radius: 6px;
        transition: all 0.2s;
        overflow: hidden;
        cursor: pointer;
        position: relative;
      }
  
      .department-card:hover {
        border-color: var(--vscode-focusBorder);
        transform: translateY(-2px);
      }
  
      .department-card.selected {
        background: var(--vscode-button-secondaryBackground);
        border-color: var(--vscode-focusBorder);
      }
  
      .department-header {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
      }
  
      .department-info {
        flex: 1;
      }
  
      .department-name-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }
  
      .department-icon {
        font-size: 20px;
      }
  
      .department-name {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
  
      .department-desc {
        font-size: 12px;
        color: var(--vscode-descriptionForeground);
        margin-left: 30px;
      }
  
      .agent-count {
        display: inline-block;
        background: var(--vscode-badge-background);
        color: var(--vscode-badge-foreground);
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
      }
  
      .selected-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--vscode-inputValidation-infoBackground);
        color: var(--vscode-inputValidation-infoForeground);
        border: 1px solid var(--vscode-inputValidation-infoBorder);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0;
        transform: scale(0.8) translateY(-4px);
        transition: all 0.2s;
        pointer-events: none;
        }

        .department-card.selected .selected-badge,
        .tool-card.selected .selected-badge {
        opacity: 1;
        transform: scale(1) translateY(0);
        }
  
      .agents-list {
        padding: 12px 16px;
      }
  
      .select-all-container {
        padding: 8px 0;
        border-bottom: 1px solid var(--vscode-panel-border);
        margin-bottom: 8px;
      }
  
      .select-all-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--vscode-descriptionForeground);
      }
  
      .agent-item {
        padding: 10px 0;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
  
      .agent-item:hover {
        background: var(--vscode-list-hoverBackground);
        margin: 0 -8px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 4px;
      }
  
      .agent-checkbox, .select-all-checkbox {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin-top: 2px;
        flex-shrink: 0;
      }
  
      .agent-details {
        flex: 1;
        cursor: pointer;
      }
  
      .agent-name {
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 2px;
      }
  
      .agent-description {
        font-size: 11px;
        color: var(--vscode-descriptionForeground);
        line-height: 1.4;
      }
  
      input[type="text"] {
        width: 100%;
        padding: 10px;
        background: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border);
        border-radius: 4px;
        font-family: inherit;
        margin-top: 12px;
      }
  
      .button-group {
        display: flex;
        gap: 12px;
        margin-top: 30px;
      }
  
      button {
        padding: 12px 24px;
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
      }
  
      button:hover:not(:disabled) {
        background: var(--vscode-button-hoverBackground);
      }
  
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
  
      button.secondary {
        background: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
      }
  
      button.secondary:hover:not(:disabled) {
        background: var(--vscode-button-secondaryHoverBackground);
      }
  
      .summary {
        background: var(--vscode-textBlockQuote-background);
        border-left: 4px solid var(--vscode-focusBorder);
        padding: 16px;
        margin-top: 20px;
        border-radius: 4px;
      }
  
      .summary-item {
        margin: 8px 0;
        display: flex;
        justify-content: space-between;
      }
  
      .summary-label {
        font-weight: 600;
      }
  
      .summary-value {
        color: var(--vscode-descriptionForeground);
      }
  
      .info-box {
        background: var(--vscode-textBlockQuote-background);
        padding: 12px;
        border-radius: 4px;
        margin-top: 12px;
        font-size: 13px;
        color: var(--vscode-descriptionForeground);
      }
  
      .department-section-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }
  
      .dept-section-icon {
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🤖 AgentKit Manager</h1>
      <p class="subtitle">Install and manage AI agents for your development workflow</p>
  
      <!-- Step 1: Select Tool -->
      <div class="step">
        <div class="step-header">
          <div class="step-number">1</div>
          <div class="step-title">Select AI Tool</div>
        </div>
        <div class="tool-grid" id="toolGrid"></div>
      </div>
  
      <!-- Step 2: Select Departments -->
      <div class="step">
        <div class="step-header">
          <div class="step-number">2</div>
          <div class="step-title">Select Departments</div>
        </div>
        <div class="department-grid" id="departmentGrid"></div>
      </div>
  
      <!-- Step 3: Select Agents -->
      <div class="step" id="agentsStep" style="display: none;">
        <div class="step-header">
          <div class="step-number">3</div>
          <div class="step-title">Select Agents</div>
        </div>
        <div id="agentsList"></div>
      </div>
  
      <!-- Step 4: Custom Folder (Optional) -->
      <div class="step">
        <div class="step-header">
          <div class="step-number">4</div>
          <div class="step-title">Folder Name (Optional)</div>
        </div>
        <input type="text" id="folderInput" placeholder="Leave empty for default">
        <div class="info-box">
          Default folders: <strong>.cursorrules</strong> (Cursor), <strong>.claude</strong> (Claude Code), 
          <strong>.github</strong> (Copilot), <strong>.aider</strong> (Aider), <strong>.ai</strong> (Universal)
        </div>
      </div>
  
      <!-- Summary -->
      <div class="summary" id="summary" style="display: none;">
        <div class="summary-item">
          <span class="summary-label">Tool:</span>
          <span class="summary-value" id="summaryTool">-</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Folder:</span>
          <span class="summary-value" id="summaryFolder">-</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Departments:</span>
          <span class="summary-value" id="summaryDepts">-</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Agents:</span>
          <span class="summary-value" id="summaryAgents">-</span>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="button-group">
        <button id="installBtn" disabled>Install Agents</button>
        <button class="secondary" id="cancelBtn">Cancel</button>
      </div>
    </div>
  
    <script type="module">
      // Import Simple Icons
      import * as simpleIcons from 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/+esm';
  
      const vscode = acquireVsCodeApi();
  
      const tools = [
        { id: 'cursor', name: 'Cursor', icon: 'cursor', desc: '@-mentions and multi-file', folder: '.cursorrules' },
        { id: 'claude-code', name: 'Claude Code', icon: 'anthropic', desc: 'Native sub-agent support', folder: '.claude' },
        { id: 'copilot', name: 'GitHub Copilot', icon: 'github', desc: 'copilot-instructions.md', folder: '.github' },
        { id: 'aider', name: 'Aider', icon: 'git', desc: 'conventions.md', folder: '.aider' },
        { id: 'universal', name: 'Universal', icon: 'openai', desc: 'Works with any tool', folder: '.ai' }
      ];
  
      const departmentIcons = {
        'design': '🎨',
        'engineering': '⚙️',
        'marketing': '📢',
        'product': '📊',
        'project-management': '📋',
        'studio-operations': '🏢',
        'testing': '✅'
      };
  
      const agentDescriptions = {
        // Design
        'brand-guardian': 'Ensure brand consistency and visual identity across all touchpoints',
        'ui-designer': 'Design beautiful, accessible interfaces and component systems',
        'ux-researcher': 'Conduct user research, usability testing, and journey mapping',
        'visual-storyteller': 'Create compelling marketing visuals and graphics',
        'whimsy-injector': 'Add delightful micro-interactions and personality',
        
        // Engineering
        'ai-engineer': 'AI/ML model integration, prompt engineering, and optimization',
        'backend-architect': 'API design, database architecture, and server infrastructure',
        'devops-automator': 'CI/CD pipelines, infrastructure as code, and deployments',
        'frontend-developer': 'React, Vue, Angular UI implementation and optimization',
        'mobile-app-builder': 'iOS and Android native and cross-platform development',
        'rapid-prototyper': 'Fast MVP development and proof-of-concept building',
        'test-writer-fixer': 'Unit tests, integration tests, and quality assurance',
        
        // Marketing
        'app-store-optimizer': 'ASO for App Store and Google Play listings',
        'content-creator': 'Blog posts, videos, social media, and marketing copy',
        'growth-hacker': 'Viral loops, growth experiments, and user acquisition',
        'instagram-curator': 'Instagram content strategy and visual curation',
        'reddit-community-builder': 'Authentic Reddit engagement and community building',
        'tiktok-strategist': 'TikTok trends, viral content, and influencer partnerships',
        'twitter-engager': 'Twitter/X engagement, threads, and real-time marketing',
        
        // Product
        'feedback-synthesizer': 'Analyze user feedback and identify patterns',
        'sprint-prioritizer': 'Feature prioritization and roadmap planning',
        'trend-researcher': 'Market trends, competitor analysis, and opportunities',
        
        // Project Management
        'experiment-tracker': 'A/B testing, feature flags, and experimentation',
        'project-shipper': 'Launch coordination and go-to-market execution',
        'studio-producer': 'Cross-team coordination and project management',
        
        // Studio Operations
        'analytics-reporter': 'Metrics dashboards, KPIs, and business intelligence',
        'finance-tracker': 'Budget management, cost tracking, and financial planning',
        'infrastructure-maintainer': 'System reliability, monitoring, and incident response',
        'legal-compliance-checker': 'Privacy compliance, terms of service, and legal review',
        'support-responder': 'Customer support, help documentation, and ticket management',
        
        // Testing
        'api-tester': 'API testing, load testing, and performance benchmarking',
        'performance-benchmarker': 'Speed optimization and performance profiling',
        'test-results-analyzer': 'Test data analysis, quality metrics, and reporting',
        'tool-evaluator': 'Rapid tool assessment and comparative analysis',
        'workflow-optimizer': 'Process optimization and human-agent collaboration'
      };
  
      let selectedTool = 'cursor';
      let selectedDepartments = new Set();
      let departments = {};
  
      // Helper to get Simple Icon SVG
      function getSimpleIconSvg(iconName) {
        try {
          const iconKey = 'si' + iconName.charAt(0).toUpperCase() + iconName.slice(1);
          const icon = simpleIcons[iconKey];
          if (icon) {
            return \`<svg class="tool-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>\${icon.title}</title>
              <path d="\${icon.path}" fill="currentColor"/>
            </svg>\`;
          }
        } catch (e) {
          console.error('Icon not found:', iconName);
        }
        return '<span class="tool-icon">🔧</span>';
      }
  
      // Request departments data
      vscode.postMessage({ command: 'getDepartments' });
  
      // Render tools
      const toolGrid = document.getElementById('toolGrid');
      tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card' + (tool.id === selectedTool ? ' selected' : '');
        card.innerHTML = \`
          <div class="selected-badge">Selected</div>
          <div class="tool-header">
            \${getSimpleIconSvg(tool.icon)}
            <span class="tool-name">\${tool.name}</span>
          </div>
          <div class="tool-desc">\${tool.desc}</div>
        \`;
        card.onclick = () => selectTool(tool.id);
        toolGrid.appendChild(card);
      });
  
      function selectTool(toolId) {
        selectedTool = toolId;
        document.querySelectorAll('.tool-card').forEach((card, i) => {
          card.classList.toggle('selected', tools[i].id === toolId);
        });
        updateSummary();
      }
  
      // Listen for departments data
      window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'departmentsData') {
          departments = message.data;
          renderDepartments();
        } else if (message.command === 'installComplete') {
          // Handle install complete
        }
      });
  
      function renderDepartments() {
        const deptGrid = document.getElementById('departmentGrid');
        deptGrid.innerHTML = '';
  
        Object.entries(departments).forEach(([deptId, dept]) => {
          const card = document.createElement('div');
          card.className = 'department-card';
          const icon = departmentIcons[deptId] || '📁';
          
          card.innerHTML = \`
            <div class="selected-badge">Selected</div>
            <div class="department-header" data-dept-id="\${deptId}">
              <div class="department-info">
                <div class="department-name-row">
                  <span class="department-icon">\${icon}</span>
                  <div class="department-name">
                    \${dept.name}
                    <span class="agent-count">\${dept.agents.length}</span>
                  </div>
                </div>
                <div class="department-desc">\${dept.description}</div>
              </div>
            </div>
          \`;
  
          card.onclick = () => toggleDepartment(deptId, card);
  
          deptGrid.appendChild(card);
        });
      }
  
      function toggleDepartment(deptId, card) {
        // Toggle selection
        if (selectedDepartments.has(deptId)) {
          selectedDepartments.delete(deptId);
          card.classList.remove('selected');
        } else {
          selectedDepartments.add(deptId);
          card.classList.add('selected');
        }
  
        renderAgentsList();
        updateSummary();
      }
  
      function renderAgentsList() {
        const agentsStep = document.getElementById('agentsStep');
        const agentsList = document.getElementById('agentsList');
  
        if (selectedDepartments.size === 0) {
          agentsStep.style.display = 'none';
          return;
        }
  
        agentsStep.style.display = 'block';
        agentsList.innerHTML = '';
  
        selectedDepartments.forEach(deptId => {
          const dept = departments[deptId];
          if (!dept) return;
  
          const icon = departmentIcons[deptId] || '📁';
          const deptSection = document.createElement('div');
          deptSection.className = 'department-agents-section';
          deptSection.style.marginBottom = '24px';
  
          const agentItems = dept.agents.map(agent => {
            const description = agentDescriptions[agent] || 'No description available';
            return \`
              <div class="agent-item">
                <input type="checkbox" class="agent-checkbox" 
                  id="agent-\${deptId}-\${agent}" 
                  data-dept="\${deptId}" 
                  data-agent="\${agent}"
                  checked>
                <label class="agent-details" for="agent-\${deptId}-\${agent}">
                  <div class="agent-name">\${agent}</div>
                  <div class="agent-description">\${description}</div>
                </label>
              </div>
            \`;
          }).join('');
  
          deptSection.innerHTML = \`
            <div class="department-section-header">
              <span class="dept-section-icon">\${icon}</span>
              <strong style="font-size: 15px;">\${dept.name}</strong>
            </div>
            <div class="select-all-container">
              <div class="select-all-item">
                <input type="checkbox" class="select-all-checkbox" id="select-all-\${deptId}" data-dept="\${deptId}" checked>
                <label for="select-all-\${deptId}" style="cursor: pointer;">Select All (\${dept.agents.length})</label>
              </div>
            </div>
            <div class="agents-list" id="agents-list-\${deptId}">
              \${agentItems}
            </div>
          \`;
  
          agentsList.appendChild(deptSection);
        });
  
        // Add event listeners for checkboxes
        document.querySelectorAll('.agent-checkbox').forEach(checkbox => {
          checkbox.onchange = () => {
            updateSelectAllCheckbox(checkbox.dataset.dept);
            updateSummary();
          };
        });
  
        document.querySelectorAll('.select-all-checkbox').forEach(checkbox => {
          checkbox.onchange = (e) => {
            const deptId = checkbox.dataset.dept;
            const isChecked = checkbox.checked;
            
            document.querySelectorAll(\`.agent-checkbox[data-dept="\${deptId}"]\`).forEach(cb => {
              cb.checked = isChecked;
            });
            
            updateSummary();
          };
        });
  
        updateSummary();
      }
  
      function updateSelectAllCheckbox(deptId) {
        const allCheckboxes = document.querySelectorAll(\`.agent-checkbox[data-dept="\${deptId}"]\`);
        const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
        const selectAllCheckbox = document.getElementById(\`select-all-\${deptId}\`);
        
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = checkedCount === allCheckboxes.length;
          selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
        }
      }
  
      function updateSummary() {
        const folder = document.getElementById('folderInput').value || 
                      tools.find(t => t.id === selectedTool).folder;
        
        const checkedAgents = Array.from(document.querySelectorAll('.agent-checkbox:checked'));
        const totalAgents = checkedAgents.length;
  
        const deptNames = Array.from(selectedDepartments)
          .map(id => departments[id]?.name)
          .filter(Boolean);
  
        document.getElementById('summaryTool').textContent = 
          tools.find(t => t.id === selectedTool).name;
        document.getElementById('summaryFolder').textContent = folder;
        document.getElementById('summaryDepts').textContent = 
          deptNames.join(', ') || 'None';
        document.getElementById('summaryAgents').textContent = 
          \`\${totalAgents} selected\`;
  
        document.getElementById('summary').style.display = 
          totalAgents > 0 ? 'block' : 'none';
  
        // Enable/disable install button
        const installBtn = document.getElementById('installBtn');
        installBtn.disabled = totalAgents === 0;
      }
  
      document.getElementById('folderInput').oninput = updateSummary;
  
      document.getElementById('installBtn').onclick = () => {
        const folder = document.getElementById('folderInput').value || 
                      tools.find(t => t.id === selectedTool).folder;
        
        const checkedAgents = Array.from(document.querySelectorAll('.agent-checkbox:checked'));
        const agentPaths = checkedAgents.map(cb => 
          \`\${cb.dataset.dept}/\${cb.dataset.agent}\`
        );
        
        const selectedDepts = [...new Set(checkedAgents.map(cb => cb.dataset.dept))];
  
        if (agentPaths.length === 0) {
          return;
        }
  
        vscode.postMessage({
          command: 'install',
          data: {
            tool: selectedTool,
            folder: folder,
            departments: selectedDepts,
            agents: agentPaths
          }
        });
      };
  
      document.getElementById('cancelBtn').onclick = () => {
        vscode.postMessage({ command: 'cancel' });
      };
  
      setTimeout(updateSummary, 100);
    </script>
  </body>
  </html>`;
}