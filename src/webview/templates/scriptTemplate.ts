import { tools } from '../data/tools';
import { models } from '../data/models';
import { departmentIcons } from '../data/departments';
import { agentDescriptions } from '../data/agentDescriptions';

export function getScriptContent(): string {
  return `
    <script type="module">
      // Import Simple Icons
      import * as simpleIcons from 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/+esm';

      const vscode = acquireVsCodeApi();

      const tools = ${JSON.stringify(tools, null, 2)};
      const models = ${JSON.stringify(models, null, 2)};
      const departmentIcons = ${JSON.stringify(departmentIcons, null, 2)};
      const agentDescriptions = ${JSON.stringify(agentDescriptions, null, 2)};

      let selectedTool = 'cursor';
      let selectedDepartments = new Set();
      let selectedModel = 'sonnet';
      let departments = {};

      // Helper to get Simple Icon SVG
      function getSimpleIconSvg(iconName) {
        try {
          const iconKey = 'si' + iconName.charAt(0).toUpperCase() + iconName.slice(1);
          const icon = simpleIcons[iconKey];
          if (icon) {
            return \`<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">\${icon.svg.replace('<svg', '').replace('</svg>', '').replace(/^[^>]*>/, '')}</svg>\`;
          }
        } catch (e) {
          console.warn('Icon not found:', iconName);
        }
        return '<div style="width: 20px; height: 20px;"></div>';
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

        // Show/hide model step based on tool selection
        const modelStep = document.getElementById('modelStep');
        if (toolId === 'claude-code') {
          modelStep.style.display = 'block';
          if (!document.getElementById('modelGrid').hasChildNodes()) {
            renderModels();
          }
        } else {
          modelStep.style.display = 'none';
        }

        updateSummary();
      }

      function renderModels() {
        const modelGrid = document.getElementById('modelGrid');
        modelGrid.innerHTML = '';

        models.forEach(model => {
          const card = document.createElement('div');
          card.className = 'model-card' + (model.id === selectedModel ? ' selected' : '');
          card.innerHTML = \`
            <div class="selected-badge">Selected</div>
            <div class="model-name">\${model.name}</div>
            <div class="model-desc">\${model.desc}</div>
          \`;
          card.onclick = () => selectModel(model.id);
          modelGrid.appendChild(card);
        });
      }

      function selectModel(modelId) {
        selectedModel = modelId;
        document.querySelectorAll('.model-card').forEach((card, i) => {
          card.classList.toggle('selected', models[i].id === modelId);
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

          const deptSection = document.createElement('div');
          deptSection.className = 'agents-list';

          const deptHeader = document.createElement('div');
          deptHeader.className = 'select-all-container';
          deptHeader.innerHTML = \`
            <div class="select-all-item">
              <input type="checkbox" class="select-all-checkbox" id="select-all-\${deptId}" data-dept="\${deptId}">
              <span>\${dept.name} (Select All)</span>
            </div>
          \`;
          deptSection.appendChild(deptHeader);

          dept.agents.forEach(agent => {
            const agentItem = document.createElement('div');
            agentItem.className = 'agent-item';
            agentItem.innerHTML = \`
              <input type="checkbox" class="agent-checkbox" data-dept="\${deptId}" data-agent="\${agent}">
              <div class="agent-details">
                <div class="agent-name">\${agent}</div>
                <div class="agent-description">\${agentDescriptions[agent] || ''}</div>
              </div>
            \`;
            deptSection.appendChild(agentItem);
          });

          agentsList.appendChild(deptSection);
        });

        // Add event listeners for checkboxes
        document.querySelectorAll('.agent-checkbox').forEach(checkbox => {
          checkbox.onchange = () => {
            updateSelectAllCheckbox(checkbox.dataset.dept);
            updateSummary();
          };
        });

        // Add click handlers for agent details to toggle checkbox
        document.querySelectorAll('.agent-details').forEach(details => {
          details.onclick = () => {
            const checkbox = details.parentElement.querySelector('.agent-checkbox');
            if (checkbox) {
              checkbox.checked = !checkbox.checked;
              checkbox.onchange();
            }
          };
        });

        document.querySelectorAll('.select-all-checkbox').forEach(checkbox => {
          checkbox.onchange = function() {
            const deptId = this.dataset.dept;
            const checked = this.checked;
            document.querySelectorAll(\`.agent-checkbox[data-dept="\${deptId}"]\`).forEach(cb => {
              cb.checked = checked;
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

        // Show model only for Claude Code
        const summaryModelItem = document.getElementById('summaryModelItem');
        if (selectedTool === 'claude-code') {
          summaryModelItem.style.display = 'flex';
          document.getElementById('summaryModel').textContent =
            models.find(m => m.id === selectedModel)?.name || 'Sonnet';
        } else {
          summaryModelItem.style.display = 'none';
        }

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
            agents: agentPaths,
            model: selectedTool === 'claude-code' ? selectedModel : undefined
          }
        });
      };

      document.getElementById('cancelBtn').onclick = () => {
        vscode.postMessage({ command: 'cancel' });
      };

      setTimeout(updateSummary, 100);
    </script>
  `;
}
