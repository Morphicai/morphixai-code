import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { restoreAppFiles } from '../utils/app-files.js';

export async function restoreCommand(options) {
  try {
    const { source, yes } = options;
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
    
    console.log(chalk.blue('Restoring files from app-files...'));
    
    // 检查是否是远程 URL
    const sourceToUse = source || '_dev/app-files.json';
    const isRemoteURL = sourceToUse.startsWith('http://') || sourceToUse.startsWith('https://');
    
    if (isRemoteURL) {
      console.log(chalk.gray(`Downloading from: ${sourceToUse}`));
    }
    console.log();
    
    const spinner = ora(isRemoteURL ? 'Downloading and analyzing...' : 'Analyzing app-files...').start();
    
    // 首先获取统计信息，不执行还原
    let result;
    try {
      result = await restoreAppFiles(projectPath, { 
        source: source || '_dev/app-files.json',
        force: false 
      });
    } catch (error) {
      spinner.fail('Failed to analyze app-files');
      console.log();
      console.log(chalk.red(`Error: ${error.message}`));
      
      // 提供帮助信息
      if (error.message.includes('Source file not found')) {
        console.log();
        console.log(chalk.yellow('Tip: You can specify a custom source path or URL:'));
        console.log(chalk.cyan('  morphixai restore --source dist/app-files.json'));
        console.log(chalk.cyan('  morphixai restore --source path/to/app-files.json'));
        console.log(chalk.cyan('  morphixai restore --source https://example.com/app-files.json'));
      }
      return;
    }
    
    spinner.succeed('Analysis complete');
    
    const { stats, isRemote, tempFilePath } = result;
    
    // 显示统计信息
    console.log();
    console.log(chalk.bold('Restore Summary:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.cyan(`  Total files to restore: ${stats.totalFiles}`));
    console.log(chalk.yellow(`  Files to be overwritten: ${stats.existingFiles}`));
    console.log(chalk.green(`  New files to be created: ${stats.newFiles}`));
    console.log();
    
    // 显示将被覆盖的文件（如果有）
    if (stats.existingFiles > 0) {
      console.log(chalk.yellow('⚠️  Files that will be overwritten:'));
      const displayLimit = 10;
      stats.existingFilesList.slice(0, displayLimit).forEach(file => {
        console.log(chalk.yellow(`  - ${file}`));
      });
      if (stats.existingFiles > displayLimit) {
        console.log(chalk.gray(`  ... and ${stats.existingFiles - displayLimit} more files`));
      }
      console.log();
    }
    
    // 显示将创建的新文件（如果有）
    if (stats.newFiles > 0 && stats.newFiles <= 10) {
      console.log(chalk.green('✨ New files to be created:'));
      stats.newFilesList.forEach(file => {
        console.log(chalk.green(`  - ${file}`));
      });
      console.log();
    }
    
    // 如果使用了 -y 参数，跳过确认
    let confirmed = yes;
    
    // 否则询问用户确认
    if (!confirmed) {
      const answers = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: stats.existingFiles > 0 
          ? 'This will overwrite existing files. Continue?' 
          : 'Proceed with restore?',
        default: false
      }]);
      
      confirmed = answers.proceed;
    }
    
    if (!confirmed) {
      console.log();
      console.log(chalk.yellow('Restore cancelled'));
      
      // 清理临时文件
      if (tempFilePath) {
        const fs = await import('fs-extra');
        if (await fs.default.pathExists(tempFilePath)) {
          await fs.default.remove(tempFilePath);
        }
      }
      
      return;
    }
    
    // 执行还原
    console.log();
    spinner.start('Restoring files...');
    
    const restoreResult = await restoreAppFiles(projectPath, { 
      source: source || '_dev/app-files.json',
      force: true 
    });
    
    if (restoreResult.errors.length > 0) {
      spinner.warn('Restore completed with errors');
      console.log();
      console.log(chalk.yellow('Errors:'));
      restoreResult.errors.forEach(({ file, error }) => {
        console.log(chalk.red(`  ✗ ${file}: ${error}`));
      });
    } else {
      spinner.succeed('Files restored successfully');
    }
    
    console.log();
    console.log(chalk.green('✅ Restore completed!'));
    console.log();
    console.log(chalk.cyan(`  Restored: ${restoreResult.restoredCount}/${restoreResult.totalFiles} files`));
    
    if (restoreResult.isRemote) {
      console.log(chalk.gray(`  Source: Remote URL`));
    }
    
    if (restoreResult.skippedFiles && restoreResult.skippedFiles.length > 0) {
      console.log(chalk.gray(`  Skipped: ${restoreResult.skippedFiles.length} metadata files (app-files.js/json)`));
    }
    
    console.log(chalk.cyan(`  Location: ${path.join(projectPath, 'src/')}`));
    console.log();
    
  } catch (error) {
    console.error(chalk.red('Restore failed:'), error.message);
    if (options.debug) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
