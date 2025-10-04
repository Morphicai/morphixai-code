import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import open from 'open';
import { startFileWatcher } from '../dev-server/file-watcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function devCommand(options) {
  try {
    const { port = 8812, consolePath = '/__console', debug = false, open: shouldOpen = true } = options;
    const projectPath = process.cwd();
    
    // 检查是否在 MorphixAI 项目中
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.red('Not in a MorphixAI project directory'));
      return;
    }
    
    const packageJson = await fs.readJson(packageJsonPath);
    if (!packageJson.morphixai) {
      console.log(chalk.red('Not a MorphixAI project'));
      return;
    }
    
    console.log(chalk.blue('Starting MorphixAI development server...'));
    
    // 生成初始 app-files.js
    console.log(chalk.gray('Generating app-files.js...'));
    const { generateAppFiles } = await import('../utils/app-files.js');
    await generateAppFiles(projectPath);
    
    // 启动文件监控
    console.log(chalk.gray('Starting file watcher...'));
    const watcher = await startFileWatcher(projectPath);
    
    // 创建 Vite 服务器配置（运行 console 项目）
    const consoleSrcPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../console');
    const userAppFilesPath = path.join(projectPath, '_dev/app-files.js');
    const userProjectConfigPath = path.join(projectPath, 'project-config.json');
    
    const viteConfig = {
      configFile: false, // 禁用自动加载 vite.config.js，避免 plugin 重复
      root: consoleSrcPath,
      define: {
        // 将 debug 模式传递给前端应用
        '__DEBUG_MODE__': debug,
      },
      server: {
        port: parseInt(port),
        open: false, // 不自动打开，稍后手动打开 console
        host: 'localhost',
        fs: {
          // 允许访问用户项目文件
          allow: [consoleSrcPath, projectPath]
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: true,
      },
      css: {
        modules: {
          localsConvention: 'camelCase',
        },
      },
      resolve: {
        // 强制去重这些包，确保只使用一个版本（从 @morphixai/code/node_modules）
        dedupe: [
          'react',
          'react-dom',
          '@ionic/react',
          '@ionic/react-router',
          'react-router-dom',
          'ionicons'
        ],
        alias: {
          // console 项目的别名
          '@console': consoleSrcPath,
          '@console-components': path.join(consoleSrcPath, 'components'),
          '@console-styles': path.join(consoleSrcPath, 'styles'),
          '@console-utils': path.join(consoleSrcPath, 'utils'),
          // 用户项目的 app-files.js 别名
          '~user/app-files.js': userAppFilesPath,
          '~user/project-config.json': userProjectConfigPath,
        },
      },
      // 预构建优化，确保这些包被正确处理
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-dom/client',
          '@ionic/react',
          '@ionic/react-router',
          'react-router-dom',
          'ionicons/icons'
        ],
      },
      plugins: [
        // React plugin
        (await import('@vitejs/plugin-react')).default(),
        // Tailwind plugin
        (await import('@tailwindcss/vite')).default()
      ]
    };
    
    // 创建并启动服务器
    const server = await createServer(viteConfig);
    await server.listen();
    
    const serverUrl = `http://localhost:${port}`;
    
    console.log();
    console.log(chalk.green('🚀 Development server started!'));
    console.log();
    console.log(chalk.cyan(`  Dev Console:   ${serverUrl}`));
    if (debug) {
      console.log(chalk.yellow(`  Debug Mode:    Enabled`));
    }
    console.log();
    console.log(chalk.gray('Press Ctrl+C to stop the server'));
    
    // 自动打开浏览器
    if (shouldOpen) {
      console.log();
      console.log(chalk.gray('Opening browser...'));
      try {
        await open(serverUrl);
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Could not open browser automatically: ${error.message}`));
      }
    }
    
    // 优雅关闭
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\\nShutting down...'));
      watcher.close();
      await server.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(chalk.red('Error starting development server:'), error.message);
    if (options.debug) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}