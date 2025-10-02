import { build } from 'vite';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildConsole() {
  const consoleSrcPath = __dirname;
  const consoleDistPath = path.join(__dirname, 'dist');
  
  // 检查是否已经构建过（开发时避免重复构建）
  if (await fs.pathExists(consoleDistPath)) {
    const stats = await fs.stat(consoleDistPath);
    const age = Date.now() - stats.mtime.getTime();
    
    // 如果构建文件不到 10 分钟，跳过重新构建
    if (age < 10 * 60 * 1000) {
      return consoleDistPath;
    }
  }
  
  try {
    // 构建控制台
    await build({
      root: consoleSrcPath,
      configFile: path.join(consoleSrcPath, 'vite.config.js'),
      build: {
        outDir: 'dist',
        emptyOutDir: true
      }
    });
    
    return consoleDistPath;
  } catch (error) {
    throw new Error(`Failed to build console: ${error.message}`);
  }
}