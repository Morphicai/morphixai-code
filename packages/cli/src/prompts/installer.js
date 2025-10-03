import fs from 'fs-extra';
import path from 'path';
import { fetchPromptsRegistry, fetchRemotePrompt, readLocalPromptsConfig, writeLocalPromptsConfig, checkPromptsVersion } from './fetcher.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 获取模板提示词文件的源路径
 */
function getTemplatePromptsPath() {
  // CLI 包的根目录
  const cliRoot = path.resolve(__dirname, '../..');
  // 模板目录
  const templatePath = path.join(cliRoot, '../templates/react-ionic/template');
  return templatePath;
}

/**
 * 安装提示词（支持远程和本地）
 */
export async function installPrompts(projectPath, options = {}) {
  const { editor = 'all' } = options;
  
  const registry = await fetchPromptsRegistry();
  
  // 始终安装的核心文件
  const alwaysInstall = ['docs', 'readme'];
  const installedEditors = [];
  
  for (const key of alwaysInstall) {
    const config = registry.prompts[key];
    if (config) {
      // 如果有远程 URL，尝试从远程安装，失败则回退到本地
      if (config.remoteUrl) {
        try {
          await installEditorPromptsFromRemote(projectPath, key, config);
          installedEditors.push(key);
        } catch (error) {
          console.warn(`⚠️  Remote fetch failed for ${key}, falling back to local: ${error.message}`);
          await installEditorPromptsFromLocal(projectPath, key, config);
          installedEditors.push(key);
        }
      } else {
        await installEditorPromptsFromLocal(projectPath, key, config);
        installedEditors.push(key);
      }
    }
  }
  
  // 安装指定编辑器的提示词
  const editors = editor === 'all' ? ['cursor', 'claude'] : [editor];
  
  for (const editorName of editors) {
    if (alwaysInstall.includes(editorName)) continue; // 已安装
    
    const config = registry.prompts[editorName];
    if (!config) {
      console.warn(`Unknown editor: ${editorName}`);
      continue;
    }
    
    await installEditorPromptsFromLocal(projectPath, editorName, config);
    installedEditors.push(editorName);
  }
  
  // 更新本地配置
  await updateLocalPromptsConfig(projectPath, registry, installedEditors);
  
  return { installed: installedEditors };
}

/**
 * 从远程 API 安装提示词
 */
async function installEditorPromptsFromRemote(projectPath, editorName, config) {
  const targetPath = path.join(projectPath, config.path);
  
  // 确保目标目录存在
  if (config.path) {
    await fs.ensureDir(targetPath);
  }
  
  // 从远程获取内容
  const content = await fetchRemotePrompt(config.remoteUrl);
  
  // 保存每个文件
  for (const file of config.files) {
    const targetFile = path.join(targetPath, file);
    
    // 确保目标文件的目录存在
    await fs.ensureDir(path.dirname(targetFile));
    await fs.writeFile(targetFile, content, 'utf-8');
  }
}

/**
 * 从本地模板安装编辑器提示词
 */
async function installEditorPromptsFromLocal(projectPath, editorName, config) {
  const templatePath = getTemplatePromptsPath();
  const sourcePath = path.join(templatePath, config.path);
  const targetPath = path.join(projectPath, config.path);
  
  // 检查模板源路径是否存在
  if (!await fs.pathExists(sourcePath)) {
    throw new Error(`Template prompts not found at: ${sourcePath}`);
  }
  
  // 确保目标目录存在（如果 path 为空字符串，targetPath 就是项目根目录）
  if (config.path) {
    await fs.ensureDir(targetPath);
  }
  
  // 复制每个文件
  for (const file of config.files) {
    const sourceFile = path.join(sourcePath, file);
    const targetFile = path.join(targetPath, file);
    
    if (await fs.pathExists(sourceFile)) {
      // 确保目标文件的目录存在
      await fs.ensureDir(path.dirname(targetFile));
      await fs.copy(sourceFile, targetFile, { overwrite: true });
    } else {
      console.warn(`⚠️  Warning: Prompt file not found in template: ${file}`);
    }
  }
}

/**
 * 更新本地提示词配置
 */
async function updateLocalPromptsConfig(projectPath, registry, installedEditors) {
  const config = {
    version: '1.0.0',
    source: 'local',
    lastUpdated: new Date().toISOString(),
    editors: {}
  };
  
  for (const editor of installedEditors) {
    const editorConfig = registry.prompts[editor];
    config.editors[editor] = {
      enabled: true,
      version: editorConfig.version,
      path: editorConfig.path
    };
  }
  
  await writeLocalPromptsConfig(projectPath, config);
}

export async function updatePrompts(projectPath, options = {}) {
  const { force = false } = options;
  
  try {
    const updates = await checkPromptsVersion(projectPath);
    const needsUpdate = Object.entries(updates).filter(([_, info]) => info.needsUpdate || force);
    
    if (needsUpdate.length === 0 && !force) {
      return { updated: [] };
    }
    
    const updated = [];
    
    for (const [editor, updateInfo] of needsUpdate) {
      if (updateInfo.needsUpdate || force) {
        await installPrompts(projectPath, { editor });
        updated.push(editor);
      }
    }
    
    return { updated };
  } catch (error) {
    throw new Error(`Failed to update prompts: ${error.message}`);
  }
}