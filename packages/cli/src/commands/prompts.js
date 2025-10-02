import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { checkPromptsVersion, fetchPromptsRegistry } from '../prompts/fetcher.js';
import { installPrompts, updatePrompts } from '../prompts/installer.js';

export async function promptsCommand(action, options = {}) {
  try {
    const projectPath = process.cwd();
    
    // 检查是否在 MorphixAI 项目中
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.red('Not in a MorphixAI project directory'));
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
        console.log(chalk.red(`Unknown action: ${action}`));
    }
    
  } catch (error) {
    console.error(chalk.red('Error managing prompts:'), error.message);
    process.exit(1);
  }
}

async function checkPrompts(projectPath) {
  const spinner = ora('Checking prompts version...').start();
  
  try {
    const updates = await checkPromptsVersion(projectPath);
    spinner.succeed('Prompts version check completed');
    
    console.log();
    console.log(chalk.blue('📋 Prompts Status:'));
    
    if (Object.keys(updates).length === 0) {
      console.log(chalk.green('✅ All prompts are up to date'));
    } else {
      for (const [editor, updateInfo] of Object.entries(updates)) {
        if (updateInfo.needsUpdate) {
          console.log(chalk.yellow(`⚠️  ${editor}: v${updateInfo.from} (v${updateInfo.to} available)`));
        } else {
          console.log(chalk.green(`✅ ${editor}: v${updateInfo.to} (latest)`));
        }
      }
    }
    console.log();
    
  } catch (error) {
    spinner.fail('Failed to check prompts version');
    throw error;
  }
}

async function updatePromptsCommand(projectPath) {
  const spinner = ora('Updating prompts...').start();
  
  try {
    const result = await updatePrompts(projectPath);
    
    if (result.updated.length === 0) {
      spinner.succeed('All prompts are already up to date');
    } else {
      spinner.succeed('Prompts updated successfully');
      
      console.log();
      console.log(chalk.blue('🔄 Updated prompts:'));
      for (const editor of result.updated) {
        console.log(chalk.green(`✅ ${editor}`));
      }
      console.log();
    }
    
  } catch (error) {
    spinner.fail('Failed to update prompts');
    throw error;
  }
}

async function installPromptsCommand(projectPath, editor = 'all') {
  const spinner = ora(`Installing ${editor} prompts...`).start();
  
  try {
    await installPrompts(projectPath, { editor });
    spinner.succeed(`${editor} prompts installed successfully`);
    
  } catch (error) {
    spinner.fail(`Failed to install ${editor} prompts`);
    throw error;
  }
}