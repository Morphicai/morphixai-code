import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(os.homedir(), '.morphixai', 'templates');

export async function templateCommand(action, options) {
  try {
    switch (action) {
      case 'list':
        await listTemplates();
        break;
      case 'clear-cache':
        await clearCache();
        break;
      case 'update':
        await updateCache();
        break;
      default:
        console.log(chalk.yellow('Unknown action. Available actions: list, clear-cache, update'));
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

async function listTemplates() {
  const registryPath = path.join(__dirname, '../..', 'templates-registry.json');
  const registry = await fs.readJson(registryPath);
  
  console.log(chalk.blue('\n📦 Available Templates:\n'));
  console.log(chalk.gray(`Repository: ${registry.repository}`));
  console.log(chalk.gray(`Branch: ${registry.branch}\n`));
  
  registry.templates.forEach(template => {
    const defaultLabel = template.default ? chalk.green(' (default)') : '';
    console.log(`${chalk.cyan('●')} ${chalk.bold(template.name)}${defaultLabel}`);
    console.log(`  ${chalk.gray(template.description)}`);
    console.log(`  ${chalk.gray('Path:')} ${template.path}\n`);
  });
}

async function clearCache() {
  const spinner = ora('Clearing template cache...').start();
  
  if (await fs.pathExists(CACHE_DIR)) {
    await fs.remove(CACHE_DIR);
    spinner.succeed('Template cache cleared successfully!');
  } else {
    spinner.info('No cache to clear');
  }
}

async function updateCache() {
  const spinner = ora('Updating template cache...').start();
  
  try {
    // 清除现有缓存
    if (await fs.pathExists(CACHE_DIR)) {
      await fs.remove(CACHE_DIR);
    }
    
    spinner.succeed('Cache cleared. Templates will be downloaded on next use.');
  } catch (error) {
    spinner.fail('Failed to update cache');
    throw error;
  }
}

