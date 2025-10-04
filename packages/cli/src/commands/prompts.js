import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { checkPromptsVersion } from '../prompts/fetcher.js';
import { installPrompts, updatePrompts } from '../prompts/installer.js';

/**
 * 提示词管理命令
 * 所有提示词均从本地模板复制，确保稳定可靠
 */
export async function promptsCommand(action, options = {}) {
  try {
    const projectPath = process.cwd();
    
    // 检查是否在 MorphixAI 项目中
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.red('❌ Not in a MorphixAI project directory'));
      console.log(chalk.gray('   Run this command inside a project created with: morphixai create'));
      return;
    }
    
    switch (action) {
      case 'check':
        await checkPrompts(projectPath);
        break;
      case 'update':
        await updatePromptsCommand(projectPath);
        break;
      case 'install':
        await installPromptsCommand(projectPath, options.editor);
        break;
      default:
        console.log(chalk.red(`❌ Unknown action: ${action}`));
        console.log(chalk.gray('   Available actions: check, update, install'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error managing prompts:'), error.message);
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * 检查提示词版本
 */
async function checkPrompts(projectPath) {
  const spinner = ora('Checking prompts version...').start();
  
  try {
    const updates = await checkPromptsVersion(projectPath);
    spinner.succeed('Prompts version check completed');
    
    console.log();
    console.log(chalk.blue('📋 Prompts Status (Local):\n'));
    
    let hasUpdates = false;
    for (const [editor, updateInfo] of Object.entries(updates)) {
      if (updateInfo.needsUpdate) {
        hasUpdates = true;
        console.log(chalk.yellow(`⚠️  ${editor.padEnd(10)} v${updateInfo.from} → v${updateInfo.to} available`));
      } else {
        console.log(chalk.green(`✅ ${editor.padEnd(10)} v${updateInfo.to} (latest)`));
      }
    }
    
    console.log();
    
    if (hasUpdates) {
      console.log(chalk.gray('💡 Run ' + chalk.cyan('morphixai prompts update') + ' to update'));
    }
    
  } catch (error) {
    spinner.fail('Failed to check prompts version');
    throw error;
  }
}

/**
 * 更新提示词
 */
async function updatePromptsCommand(projectPath) {
  const spinner = ora('Updating prompts from local templates...').start();
  
  try {
    const result = await updatePrompts(projectPath);
    
    if (result.updated.length === 0) {
      spinner.succeed('All prompts are already up to date');
      console.log(chalk.gray('\n💡 No updates needed\n'));
    } else {
      spinner.succeed('Prompts updated successfully');
      
      console.log();
      console.log(chalk.blue('🔄 Updated prompts:\n'));
      for (const editor of result.updated) {
        console.log(chalk.green(`   ✅ ${editor}`));
      }
      console.log();
    }
    
  } catch (error) {
    spinner.fail('Failed to update prompts');
    console.log(chalk.red('\n❌ ' + error.message + '\n'));
    throw error;
  }
}

/**
 * 安装提示词
 */
async function installPromptsCommand(projectPath, editor = 'all') {
  const editorName = editor === 'all' ? 'all' : editor;
  const spinner = ora(`Installing ${editorName} prompts from local templates...`).start();
  
  try {
    const result = await installPrompts(projectPath, { editor });
    spinner.succeed(`${editorName} prompts installed successfully`);
    
    console.log();
    console.log(chalk.blue('📦 Installed prompts:\n'));
    for (const installedEditor of result.installed) {
      console.log(chalk.green(`   ✅ ${installedEditor}`));
    }
    console.log();
    
  } catch (error) {
    spinner.fail(`Failed to install ${editorName} prompts`);
    console.log(chalk.red('\n❌ ' + error.message + '\n'));
    throw error;
  }
}