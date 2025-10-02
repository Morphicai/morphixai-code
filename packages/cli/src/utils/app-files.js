import fs from 'fs-extra';
import path from 'path';

export async function generateAppFiles(projectPath) {
  const appDir = path.join(projectPath, 'src/app');
  const outputFile = path.join(projectPath, 'src/_dev/app-files.js');
  
  if (!await fs.pathExists(appDir)) {
    throw new Error('src/app directory not found');
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
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (item.isDirectory()) {
      // 递归读取子目录
      const subFiles = await readDirectoryRecursive(fullPath, baseDir);
      Object.assign(files, subFiles);
    } else {
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
  const appDir = path.join(projectPath, 'src/app');
  
  if (!await fs.pathExists(appDir)) {
    throw new Error('src/app directory not found');
  }
  
  const watcher = chokidar.default.watch(appDir, {
    ignored: /(^|[\\/\\\\])\\../, // 忽略隐藏文件
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