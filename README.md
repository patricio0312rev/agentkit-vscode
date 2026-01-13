# 🤖 AgentKit for VSCode

> **Visual interface to generate and manage AI agents for Visual Studio Code, Claude Code, Cursor, GitHub Copilot, and more.**

<img width="300" height="300" alt="icon" src="https://github.com/user-attachments/assets/22efd0ec-cdb9-4775-8158-a6655436b4bc" />

AgentKit for VSCode is a powerful extension that provides a beautiful GUI to install and manage 42+ pre-built AI agents across 7 specialized departments. Stop copying prompts manually—let AgentKit set up your entire AI development workflow in minutes.

---

## ✨ Features

- 🎨 **Beautiful GUI** - Visual interface for easy agent selection
- 🚀 **42 Pre-built Agents** - Engineering, Design, Marketing, Testing, and more
- ⚡ **Quick Setup Presets** - Full Stack, Rapid Prototyper, Design-First, and more
- 🌲 **Sidebar Integration** - View installed and available agents
- 🔄 **Auto-Refresh** - Automatically detect new agents
- ⚙️ **Fully Customizable** - Pick exactly which agents you need
- 🛠️ **Multi-Tool Support** - Works with Cursor, Claude Code, GitHub Copilot, Aider
- 👁️ **Agent Preview** - Preview agent content before installing
- ⭐ **Favorites** - Star your most-used agents for quick access
- 🔍 **Search** - Filter agents by name or description

---

## 📦 Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "AgentKit"
4. Click **Install**

### From VSIX (Development)

```bash
code --install-extension agentkit-vscode-0.1.0.vsix
```

---

## 🚀 Quick Start

### Method 1: Visual Manager (Recommended)

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type **"AgentKit: Open Agent Manager"**
3. Select your AI tool
4. Choose departments and agents
5. Click **Install Agents**

### Method 2: Quick Setup

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type **"AgentKit: Quick Setup"**
3. Choose a preset:
   - 🚀 **Full Stack Developer**
   - ⚡ **Rapid Prototyper**
   - 🎨 **Design-First**
   - 📈 **Growth-Focused**
   - 🏢 **Enterprise Team**

### Method 3: Sidebar

1. Click the **AgentKit** icon in the Activity Bar
2. Browse available agents
3. Click **"Open Agent Manager"** to install

![Demo](https://github.com/user-attachments/assets/899a0241-9728-4157-8f47-f398a3ec747d)



---

## 🏢 Available Agents

### **Design** (5 agents)

- `brand-guardian` - Brand consistency
- `ui-designer` - Interface design
- `ux-researcher` - User research
- `visual-storyteller` - Marketing visuals
- `whimsy-injector` - Delightful interactions

### **Engineering** (7 agents)

- `ai-engineer` - AI/ML integration
- `backend-architect` - API design
- `devops-automator` - CI/CD
- `frontend-developer` - UI implementation
- `mobile-app-builder` - iOS/Android
- `rapid-prototyper` - Fast MVPs
- `test-writer-fixer` - Testing

### **Marketing** (7 agents)

- `app-store-optimizer` - ASO
- `content-creator` - Blog/video content
- `growth-hacker` - Viral loops
- `instagram-curator` - Instagram strategy
- `reddit-community-builder` - Reddit engagement
- `tiktok-strategist` - TikTok marketing
- `twitter-engager` - Twitter/X

### **Product** (3 agents)

- `feedback-synthesizer` - User feedback
- `sprint-prioritizer` - Feature prioritization
- `trend-researcher` - Market trends

### **Project Management** (3 agents)

- `experiment-tracker` - A/B testing
- `project-shipper` - Launch coordination
- `studio-producer` - Cross-team coordination

### **Studio Operations** (5 agents)

- `analytics-reporter` - Metrics
- `finance-tracker` - Budget management
- `infrastructure-maintainer` - System reliability
- `legal-compliance-checker` - Privacy/compliance
- `support-responder` - Customer support

### **Testing** (5 agents)

- `api-tester` - API testing
- `performance-benchmarker` - Speed optimization
- `test-results-analyzer` - Test analysis
- `tool-evaluator` - Tool assessment
- `workflow-optimizer` - Process optimization

---

## 🛠️ Supported AI Tools

| Tool               | Folder         | How It Works                                    |
| ------------------ | -------------- | ----------------------------------------------- |
| **Cursor**         | `.cursorrules` | Use `@engineering/backend-architect.md` in chat |
| **Claude Code**    | `.claude`      | Native sub-agent support                        |
| **GitHub Copilot** | `.github`      | Auto-loaded from `copilot-instructions.md`      |
| **Aider**          | `.aider`       | Conventions in `conventions.md`                 |
| **Universal**      | `.ai`          | Works with any AI tool                          |

---

## ⚙️ Configuration

### Settings

Open VSCode Settings (`Ctrl+,` or `Cmd+,`) and search for **"AgentKit"**:

- **Default Tool** - Which AI tool to use by default
- **Default Folder** - Custom folder name for agents
- **Auto Refresh** - Automatically refresh when files change
- **Show Welcome** - Show welcome message on first use
- **Default Departments** - Pre-selected departments
- **Favorite Agents** - Your starred agents (managed via UI)

### Commands

All commands are available via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `AgentKit: Open Agent Manager` - Visual interface
- `AgentKit: Quick Setup` - Quick presets
- `AgentKit: Initialize Agents` - Guided setup
- `AgentKit: Refresh Installed Agents` - Refresh views
- `AgentKit: Update Agents` - Update to latest
- `AgentKit: Remove Agents` - Remove all agents
- `AgentKit: Open Settings` - Open settings

---

## 📚 Usage Examples

### With Cursor

After installation, use agents in Cursor:

```
@engineering/backend-architect.md Design a REST API for user authentication
```

### With Claude Code

```bash
claude-code "Build a login page using the frontend-developer agent"
```

### With GitHub Copilot

Copilot automatically uses the instructions from `.github/copilot-instructions.md`

---

## 🔍 New in v0.3.0

### Agent Preview

Click on any agent in the **Available Agents** sidebar to preview its full content before installing. The preview opens in a side panel where you can review the agent's capabilities and decide if it fits your needs.

### Favorites

Star your most-used agents for quick access:

1. **From Sidebar**: Click the star icon next to any available agent
2. **From Agent Manager**: Click the star next to any agent in the selection list
3. **Quick Select**: Use the Favorites section in the Agent Manager to quickly toggle your starred agents

Favorites sync between the sidebar and the Agent Manager webview.

### Search

Use the search bar at the top of the Agent Manager to filter agents by name or description. This makes it easy to find specific agents when you need them.

---

## 🎯 Use Cases

**For Solo Developers:**

- Set up complete development workflow
- Get expert guidance across all areas
- Ship faster with AI assistance

**For Startups:**

- Rapid prototyping with specialized agents
- Marketing and growth strategies
- Launch coordination

**For Teams:**

- Consistent AI workflows across team
- Specialized expertise on demand
- Faster onboarding for new members

---

## 🐛 Troubleshooting

### Agents not showing in sidebar

1. Click the refresh icon in the sidebar
2. Or run `AgentKit: Refresh Installed Agents`

### Agents not working with Cursor

1. Restart Cursor after installing agents
2. Make sure files exist in `.cursorrules/`
3. Use `@` to mention agent files

### Extension not activating

1. Check VSCode version (requires 1.85.0+)
2. Reload window (`Ctrl+R` / `Cmd+R`)
3. Check Output panel for errors

---

## 🤝 Contributing

Found a bug or have a feature request?

- 🐛 **Report bugs**: [GitHub Issues](https://github.com/patricio0312rev/agentkit-vscode/issues)
- 💡 **Suggest features**: [GitHub Discussions](https://github.com/patricio0312rev/agentkit-vscode/discussions)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/patricio0312rev/agentkit-vscode)

---

## 🙏 Credits

AgentKit for VSCode is powered by:

- [@patricio0312rev/agentkit](https://www.npmjs.com/package/@patricio0312rev/agentkit) - Core package

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

**Stay safe when working with AI! 🛡️**

Enjoy! 💜

Made with love by [Patricio Marroquin](https://www.patriciomarroquin.dev/)
