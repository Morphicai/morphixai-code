import fs from 'fs-extra';
import path from 'path';

export async function generateAppFiles(projectPath) {
  const srcDir = path.join(projectPath, 'src');
  const outputFile = path.join(projectPath, '_dev/app-files.js');
  
  // 检查 src 目录是否存在，不存在则使用根目录（向后兼容）
  const appDir = await fs.pathExists(srcDir) ? srcDir : projectPath;
  
  if (!await fs.pathExists(appDir)) {
    throw new Error('project directory not found');
  }
  
  // 确保输出目录存在
  await fs.ensureDir(path.dirname(outputFile));
  
  // 读取所有应用文件
  const files = await readDirectoryRecursive(appDir, appDir);
  
  // 生成 app-files.js 内容
  const content = `export default ${JSON.stringify(files, null, 2)};`;
  
  // 写入文件
  await fs.writeFile(outputFile, content);
  
  return files;
}

async function readDirectoryRecursive(dir, baseDir) {
  const files = {};
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  // 需要排除的目录和文件
  const excludeDirs = ['_dev', 'node_modules', 'dist', 'build', '.git', 'docs'];
  const excludeFiles = ['package.json', 'package-lock.json', 'project-config.json', '.gitignore', '.npmignore', '.promptsrc', 'CLAUDE.md', '.cursorrules'];
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    // 跳过隐藏文件/目录和排除的目录/文件
    if (item.name.startsWith('.')) {
      continue;
    }
    
    if (item.isDirectory()) {
      // 跳过排除的目录
      if (excludeDirs.includes(item.name)) {
        continue;
      }
      // 递归读取子目录
      const subFiles = await readDirectoryRecursive(fullPath, baseDir);
      Object.assign(files, subFiles);
    } else {
      // 跳过排除的文件
      if (excludeFiles.includes(item.name)) {
        continue;
      }
      // 读取文件内容
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        files[relativePath] = content;
      } catch (error) {
        console.warn(`Warning: Could not read file ${relativePath}:`, error.message);
      }
    }
  }
  
  return files;
}

export async function watchAppFiles(projectPath, callback) {
  const chokidar = await import('chokidar');
  const srcDir = path.join(projectPath, 'src');
  
  // 检查 src 目录是否存在，不存在则使用根目录（向后兼容）
  const appDir = await fs.pathExists(srcDir) ? srcDir : projectPath;
  
  if (!await fs.pathExists(appDir)) {
    throw new Error('project directory not found');
  }
  
  const watcher = chokidar.default.watch(appDir, {
    ignored: [
      /(^|[\\/\\\\])\\./, // 忽略隐藏文件
      '**/node_modules/**',
      '**/_dev/**', // 忽略 _dev 目录
      '**/dist/**',
      '**/build/**',
      '**/docs/**',
      'package.json',
      'package-lock.json',
      'project-config.json'
    ],
    persistent: true
  });
  
  let debounceTimer;
  
  const handleChange = async () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        await generateAppFiles(projectPath);
        if (callback) callback();
      } catch (error) {
        console.error('Error generating app-files.js:', error.message);
      }
    }, 500); // 500ms 防抖
  };
  
  watcher
    .on('add', handleChange)
    .on('change', handleChange)
    .on('unlink', handleChange);
  
  return watcher;
}