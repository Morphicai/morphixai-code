import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

export async function generateAppFiles(projectPath) {
  const srcDir = path.join(projectPath, 'src');
  const outputJsFile = path.join(projectPath, '_dev/app-files.js');
  const outputJsonFile = path.join(projectPath, '_dev/app-files.json');
  
  // 检查 src 目录是否存在，不存在则使用根目录（向后兼容）
  const appDir = await fs.pathExists(srcDir) ? srcDir : projectPath;
  
  if (!await fs.pathExists(appDir)) {
    throw new Error('project directory not found');
  }
  
  // 确保输出目录存在
  await fs.ensureDir(path.dirname(outputJsFile));
  
  // 读取所有应用文件
  const files = await readDirectoryRecursive(appDir, appDir);
  
  // 生成 app-files.js 内容
  const jsContent = `export default ${JSON.stringify(files, null, 2)};`;
  
  // 生成 app-files.json 内容
  const jsonContent = JSON.stringify(files, null, 2);
  
  // 写入 .js 和 .json 文件
  await Promise.all([
    fs.writeFile(outputJsFile, jsContent),
    fs.writeFile(outputJsonFile, jsonContent)
  ]);
  
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

/**
 * 检查字符串是否是 URL
 */
function isURL(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 从 URL 下载文件
 */
async function downloadFile(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }
  
  // 检查内容类型
  const contentType = response.headers.get('content-type');
  if (contentType && !contentType.includes('application/json') && !contentType.includes('text/')) {
    console.warn(`Warning: Unexpected content type: ${contentType}`);
  }
  
  const content = await response.text();
  
  // 验证是否是有效的 JSON
  try {
    JSON.parse(content);
  } catch (error) {
    throw new Error(`Downloaded file is not valid JSON: ${error.message}`);
  }
  
  return content;
}

export async function restoreAppFiles(projectPath, options = {}) {
  const { source = '_dev/app-files.json', force = false } = options;
  const srcDir = path.join(projectPath, 'src');
  
  let appFilesPath;
  let isRemote = false;
  let tempFilePath = null;
  
  // 检查是否是远程 URL
  if (isURL(source)) {
    isRemote = true;
    
    // 验证 URL 结尾是 .json
    if (!source.endsWith('.json')) {
      throw new Error('Only .json files are supported. Remote URL must end with .json');
    }
    
    // 下载到临时文件
    try {
      const fileContent = await downloadFile(source);
      
      // 创建临时文件
      const tempDir = path.join(os.tmpdir(), 'morphixai-restore');
      await fs.ensureDir(tempDir);
      tempFilePath = path.join(tempDir, `app-files-${Date.now()}.json`);
      await fs.writeFile(tempFilePath, fileContent, 'utf-8');
      
      appFilesPath = tempFilePath;
    } catch (error) {
      throw new Error(`Failed to download from URL: ${error.message}`);
    }
  } else {
    // 本地文件路径
    if (path.isAbsolute(source)) {
      appFilesPath = source;
    } else {
      appFilesPath = path.join(projectPath, source);
    }
    
    // 只接受 .json 文件
    if (!appFilesPath.endsWith('.json')) {
      throw new Error('Only .json files are supported. Please provide an app-files.json file.');
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(appFilesPath)) {
      throw new Error(`Source file not found: ${appFilesPath}`);
    }
  }
  
  // 读取并解析 JSON 文件
  let appFilesData;
  const fileContent = await fs.readFile(appFilesPath, 'utf-8');
  
  try {
    appFilesData = JSON.parse(fileContent);
  } catch (error) {
    // 清理临时文件
    if (tempFilePath && await fs.pathExists(tempFilePath)) {
      await fs.remove(tempFilePath);
    }
    throw new Error(`Failed to parse app-files.json: ${error.message}`);
  }
  
  // 验证数据格式
  if (typeof appFilesData !== 'object' || appFilesData === null) {
    throw new Error('Invalid app-files data format');
  }
  
  // 确保 src 目录存在
  await fs.ensureDir(srcDir);
  
  // 需要排除的文件（生成的元数据文件）
  const excludeFiles = ['_dev/app-files.js', '_dev/app-files.json', 'app-files.js', 'app-files.json'];
  
  // 收集将要创建/覆盖的文件（排除元数据文件）
  const filesToRestore = Object.keys(appFilesData).filter(file => {
    return !excludeFiles.includes(file) && !file.endsWith('/app-files.js') && !file.endsWith('/app-files.json');
  });
  const existingFiles = [];
  const newFiles = [];
  
  for (const relativePath of filesToRestore) {
    const fullPath = path.join(srcDir, relativePath);
    if (await fs.pathExists(fullPath)) {
      existingFiles.push(relativePath);
    } else {
      newFiles.push(relativePath);
    }
  }
  
  // 返回统计信息，用于确认
  const stats = {
    totalFiles: filesToRestore.length,
    existingFiles: existingFiles.length,
    newFiles: newFiles.length,
    existingFilesList: existingFiles,
    newFilesList: newFiles
  };
  
  // 如果不强制执行，返回统计信息用于确认
  if (!force) {
    return { stats, appFilesData, isRemote, tempFilePath };
  }
  
  // 执行还原操作
  let restoredCount = 0;
  const errors = [];
  const skippedFiles = [];
  
  for (const [relativePath, content] of Object.entries(appFilesData)) {
    // 跳过元数据文件
    if (!filesToRestore.includes(relativePath)) {
      skippedFiles.push(relativePath);
      continue;
    }
    
    try {
      const fullPath = path.join(srcDir, relativePath);
      
      // 确保目录存在
      await fs.ensureDir(path.dirname(fullPath));
      
      // 写入文件
      await fs.writeFile(fullPath, content, 'utf-8');
      restoredCount++;
    } catch (error) {
      errors.push({ file: relativePath, error: error.message });
    }
  }
  
  // 清理临时文件
  if (tempFilePath && await fs.pathExists(tempFilePath)) {
    await fs.remove(tempFilePath);
  }
  
  return {
    success: true,
    restoredCount,
    totalFiles: filesToRestore.length,
    skippedFiles,
    errors,
    isRemote
  };
}