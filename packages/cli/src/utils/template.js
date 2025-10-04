import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模板缓存目录
const CACHE_DIR = path.join(os.homedir(), '.morphixai', 'templates');

export async function copyTemplate(templateName, targetPath, variables = {}) {
  try {
    // 从远程仓库下载模板（使用缓存）
    const templatePath = await downloadTemplate(templateName);
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template path not found: ${templatePath}`);
    }
    
    // 复制模板文件（包括 .template 文件）
    await fs.copy(templatePath, targetPath, {
      overwrite: true,
      preserveTimestamps: true
    });
    
    // 处理模板变量
    await processTemplateFiles(targetPath, variables);
    
    // 返回模板信息
    return {
      templatePath,
      templateName
    };
    
  } catch (error) {
    throw new Error(`Failed to copy template: ${error.message}`);
  }
}

async function downloadTemplate(templateName) {
  try {
    // 读取模板注册表
    const registryPath = path.join(__dirname, '../..', 'templates-registry.json');
    const registry = await fs.readJson(registryPath);
    
    // 查找模板配置
    const templateConfig = registry.templates.find(t => t.name === templateName);
    if (!templateConfig) {
      throw new Error(`Template "${templateName}" not found in registry`);
    }
    
    // 确保缓存目录存在
    await fs.ensureDir(CACHE_DIR);
    
    const repoUrl = registry.repository;
    const branch = registry.branch || 'main';
    const templatePath = templateConfig.path;
    
    // 缓存目录路径
    const cacheRepoDir = path.join(CACHE_DIR, 'morphixai-code-templates');
    const cachedTemplatePath = path.join(cacheRepoDir, templatePath);
    
    // 检查缓存是否存在且是否需要更新
    const shouldUpdate = !(await fs.pathExists(cacheRepoDir)) || await shouldUpdateCache(cacheRepoDir);
    
    if (shouldUpdate) {
      console.log('Downloading template from remote repository...');
      
      // 删除旧缓存
      if (await fs.pathExists(cacheRepoDir)) {
        await fs.remove(cacheRepoDir);
      }
      
      // 克隆仓库（浅克隆，只克隆最新提交）
      await execa('git', [
        'clone',
        '--depth=1',
        '--branch', branch,
        repoUrl,
        cacheRepoDir
      ]);
      
      console.log('Template downloaded successfully!');
    } else {
      console.log('Using cached template...');
    }
    
    // 检查模板路径是否存在
    if (!await fs.pathExists(cachedTemplatePath)) {
      throw new Error(`Template path "${templatePath}" not found in repository`);
    }
    
    return cachedTemplatePath;
    
  } catch (error) {
    throw new Error(`Failed to download template: ${error.message}`);
  }
}

async function shouldUpdateCache(cacheRepoDir) {
  try {
    // 检查缓存是否超过24小时
    const gitDir = path.join(cacheRepoDir, '.git');
    if (!await fs.pathExists(gitDir)) {
      return true;
    }
    
    const stats = await fs.stat(gitDir);
    const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
    
    // 如果缓存超过24小时，需要更新
    return ageInHours > 24;
  } catch (error) {
    return true;
  }
}

async function processTemplateFiles(projectPath, variables = {}) {
  // 处理 .template 后缀的文件
  const templateFiles = await findTemplateFiles(projectPath);
  
  for (const templateFile of templateFiles) {
    const targetFile = templateFile.replace(/\.template$/, '');
    
    // 读取模板文件内容
    let content = await fs.readFile(templateFile, 'utf-8');
    
    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    }
    
    // 写入目标文件
    await fs.writeFile(targetFile, content);
    
    // 删除模板文件
    await fs.remove(templateFile);
  }
}

async function findTemplateFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...await findTemplateFiles(fullPath));
    } else if (item.name.endsWith('.template')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

export async function getTemplateList() {
  // 读取模板注册表
  const registryPath = path.join(__dirname, '../..', 'templates-registry.json');
  const registry = await fs.readJson(registryPath);
  return registry.templates;
}