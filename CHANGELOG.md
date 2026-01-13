# Changelog

All notable changes to the AgentKit VSCode extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-01-12

### Added

- **Agent Preview Panel**: Click on any available agent in the tree view to preview its full content in a side panel before installing
- **Favorites System**: Star your most-used agents for quick access
  - Toggle favorites from the tree view with the star icon
  - Favorites section in the Agent Manager webview
  - Favorites sync between tree view and webview
  - Quick select favorites from chips in the webview
- **Search Bar**: Filter agents in the Agent Manager webview by name or description
- **Tree View Actions**: Added toolbar buttons to the Installed Agents section
  - Open Agent Manager button
  - Refresh button
  - Collapse All button
- **Select All Label Click**: Clicking the "Select All" text now toggles the checkbox (not just the checkbox itself)

### Changed

- **Improved Agent Detection**: Installed agents view now uses a whitelist approach to detect actual agents
  - Only shows agents from recognized directories (`.claude/agents`, `.cursorrules`, `.aider`, `.github/copilot-instructions`, `.ai`)
  - Excludes metadata files (README.md, INDEX.md, SKILL.md)
  - Better support for both flat structure (Claude) and department-based structure (Cursor)

### Fixed

- Fixed star button not updating in agents list when toggling favorites
- Fixed select all not properly updating favorite chips when agents are selected
- Fixed agent preview showing empty content due to incorrect template path resolution

## [0.2.1] - 2025-12-29

### Fixed

- Fixed fallback templates and usage of package files
- Updated package version handling

## [0.2.0] - 2025-12-28

### Changed

- Removed flat agent wrapper generator
- Improved webview documentation

## [0.1.0] - 2025-12-27

### Added

- Initial release
- Visual Agent Manager with beautiful GUI
- Support for 42+ pre-built AI agents across 7 departments
- Quick Setup presets (Full Stack, Rapid Prototyper, Design-First, Growth-Focused, Enterprise Team)
- Multi-tool support (Cursor, Claude Code, GitHub Copilot, Aider, Universal)
- Sidebar integration with Installed and Available agents views
- Auto-refresh on file changes
- Welcome message on first use
- Configurable default tool, folder, and departments
