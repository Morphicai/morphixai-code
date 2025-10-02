import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { startFileWatcher } from '../dev-server/file-watcher.js';
import { createConsoleMiddleware } from '../dev-server/console-middleware.js';
import { buildConsole } from '../console/build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function devCommand(options) {
  try {
    const { port = 8812, consolePath = '/__console', debug = false } = options;
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
    
    // 构建控制台（如果需要）
    console.log(chalk.gray('Building embedded console...'));
    const consoleDist = await buildConsole();
    
    // 启动文件监控
    console.log(chalk.gray('Starting file watcher...'));
    const watcher = startFileWatcher(projectPath);
    
    // 创建 Vite 服务器配置
    const viteConfig = {
      root: projectPath,
      server: {
        port: parseInt(port),
        open: `http://localhost:${port}${consolePath}`,
        host: 'localhost'
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
        alias: {
          '@': path.join(projectPath, 'src/app'),
          '@components': path.join(projectPath, 'src/app/components'),
          '@styles': path.join(projectPath, 'src/app/styles'),
          '@utils': path.join(projectPath, 'src/app/utils'),
        },
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
    
    // 添加控制台中间件
    server.middlewares.use(
      createConsoleMiddleware({
        consoleDistPath: consoleDist,
        consolePath,
        userAppUrl: `http://localhost:${port}`
      })
    );
    
    await server.listen();
    
    console.log();
    console.log(chalk.green('🚀 Development server started!'));
    console.log();
    console.log(chalk.cyan(`  User App:      http://localhost:${port}`));
    console.log(chalk.cyan(`  Dev Console:   http://localhost:${port}${consolePath}`));
    console.log();
    console.log(chalk.gray('Press Ctrl+C to stop the server'));
    
    // 优雅关闭
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\\nShutting down...'));
      watcher.close();
      await server.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(chalk.red('Error starting development server:'), error.message);
    if (debug) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}