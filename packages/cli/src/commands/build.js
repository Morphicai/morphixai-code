import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { build } from 'vite';
import { generateAppFiles } from '../utils/app-files.js';

export async function buildCommand(options) {
  try {
    const { outDir = 'dist', sourcemap = false } = options;
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
    
    console.log(chalk.blue('Building MorphixAI application...'));
    
    const spinner = ora('Generating app-files.json...').start();
    
    // 生成 app-files.json
    await generateAppFiles(projectPath);
    spinner.succeed('app-files.json generated');
    
    // 构建配置
    const buildConfig = {
      root: projectPath,
      build: {
        outDir,
        sourcemap,
        emptyOutDir: true,
        rollupOptions: {
          input: path.join(projectPath, 'index.html')
        }
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
    
    spinner.start('Building application...');
    
    // 执行构建
    await build(buildConfig);
    
    spinner.succeed('Application built successfully');
    
    // 复制 app-files.json 到输出目录
    const appFilesSource = path.join(projectPath, 'src/_dev/app-files.js');
    const appFilesTarget = path.join(projectPath, outDir, 'app-files.json');
    
    if (await fs.pathExists(appFilesSource)) {
      const appFilesContent = await fs.readFile(appFilesSource, 'utf-8');
      // 提取 JSON 内容（去掉 export default）
      const jsonMatch = appFilesContent.match(/export default (\\{[\\s\\S]*\\});?$/);
      if (jsonMatch) {
        await fs.writeFile(appFilesTarget, jsonMatch[1]);
        spinner.succeed('app-files.json copied to build directory');
      }
    }
    
    console.log();
    console.log(chalk.green('✅ Build completed successfully!'));
    console.log();
    console.log(chalk.cyan(`Output directory: ${outDir}`));
    console.log();
    
  } catch (error) {
    console.error(chalk.red('Build failed:'), error.message);
    process.exit(1);
  }
}