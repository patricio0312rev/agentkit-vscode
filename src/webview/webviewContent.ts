import * as fs from 'fs';
import * as path from 'path';
import { getScriptContent } from './templates/scriptTemplate';

/**
 * Generates the complete HTML content for the AgentKit webview.
 * This function assembles the webview from modular components:
 * - CSS styles from templates/styles.css
 * - HTML layout from templates/layout.html
 * - JavaScript logic from templates/scriptTemplate.ts
 */
export function getWebviewContent(): string {
  const templatesDir = path.join(__dirname, 'templates');
  const styles = fs.readFileSync(path.join(templatesDir, 'styles.css'), 'utf8');
  const layout = fs.readFileSync(path.join(templatesDir, 'layout.html'), 'utf8');
  const script = getScriptContent();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgentKit Manager</title>
  <style>
${styles}
  </style>
</head>
<body>
${layout}
${script}
</body>
</html>`;
}
