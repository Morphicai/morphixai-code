import chalk from 'chalk';
import { watchAppFiles } from '../utils/app-files.js';

export async function startFileWatcher(projectPath) {
  console.log(chalk.gray('👀 Watching src/ for changes...'));
  
  const watcher = await watchAppFiles(projectPath, () => {
    console.log(chalk.green('📝 app-files.js updated'));
  });
  
  watcher.on('error', error => {
    console.error(chalk.red('File watcher error:'), error.message);
  });
  
  return watcher;
}