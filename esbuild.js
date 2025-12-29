const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

// Plugin to copy agentkit templates and fix bundled paths
const copyTemplatesPlugin = {
  name: 'copy-templates',
  setup(build) {
    build.onEnd(() => {
      const agentKitPath = path.join(__dirname, 'node_modules/@patricio0312rev/agentkit');
      const distDir = path.join(__dirname, 'dist');

      // Ensure dist directory exists
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      // Copy templates directory
      const srcTemplates = path.join(agentKitPath, 'templates');
      const destTemplates = path.join(distDir, 'templates');

      if (fs.existsSync(srcTemplates)) {
        if (fs.existsSync(destTemplates)) {
          fs.rmSync(destTemplates, { recursive: true });
        }
        fs.cpSync(srcTemplates, destTemplates, { recursive: true });
        console.log('✓ Copied agentkit templates');
      } else {
        console.warn('⚠ Templates directory not found:', srcTemplates);
      }

      // Copy src/lib directory (config files)
      const srcLib = path.join(agentKitPath, 'src/lib');
      const destLib = path.join(distDir, 'lib');

      if (fs.existsSync(srcLib)) {
        if (fs.existsSync(destLib)) {
          fs.rmSync(destLib, { recursive: true });
        }
        fs.cpSync(srcLib, destLib, { recursive: true });
        console.log('✓ Copied agentkit config files');
      } else {
        console.warn('⚠ Lib directory not found:', srcLib);
      }

      const extensionPath = path.join(distDir, 'extension.js');
      if (fs.existsSync(extensionPath)) {
        let content = fs.readFileSync(extensionPath, 'utf8');

        content = content.replace(
          /__dirname,\s*"\.\.\/\.\.\/templates\/departments"/g,
          '__dirname,"./templates/departments"'
        );

        // Remove the HTML comment from fallback template
        content = content.replace(
          /`<!--[^`]+?\.md -->\n/g,
          '`'
        ).replace(
          /`<!--[^`]+?\.md -->\\n/g,
          '`'
        );

        // Improve the fallback template content
        content = content.replace(
          /This is a placeholder agent file\. Please add specific instructions and responsibilities\./g,
          'Define the specific role and capabilities of this agent.'
        );

        fs.writeFileSync(extensionPath, content);
        console.log('✓ Fixed template paths in bundled code');
      }
    });
  }
};

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'dist/extension.js',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    sourcemap: !production,
    minify: production,
    logLevel: 'info',
    plugins: [copyTemplatesPlugin],
  });

  if (watch) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log('Build complete!');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
