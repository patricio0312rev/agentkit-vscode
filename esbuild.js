const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

// Plugin to copy agentkit templates
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
