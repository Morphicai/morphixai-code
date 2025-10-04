import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 读取本地提示词注册表
 */
export async function fetchPromptsRegistry() {
  const localRegistryPath = path.join(__dirname, '../..', 'prompts-registry.json');
  return await fs.readJson(localRegistryPath);
}

/**
 * 从远程 API 获取提示词内容
 * @param {string} url - 远程 API URL
 * @returns {Promise<string>} 提示词内容
 */
export async function fetchRemotePrompt(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch remote prompt: ${error.message}`);
  }
}

export async function readLocalPromptsConfig(projectPath) {
  const configPath = path.join(projectPath, '.promptsrc');
  
  if (await fs.pathExists(configPath)) {
    return await fs.readJson(configPath);
  }
  
  return null;
}

export async function writeLocalPromptsConfig(projectPath, config) {
  const configPath = path.join(projectPath, '.promptsrc');
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export async function checkPromptsVersion(projectPath) {
  try {
    const localConfig = await readLocalPromptsConfig(projectPath);
    const registry = await fetchPromptsRegistry();
    
    const updates = {};
    
    for (const [editor, config] of Object.entries(registry.prompts)) {
      const localVersion = localConfig?.editors?.[editor]?.version || '0.0.0';
      const registryVersion = config.version;
      
      updates[editor] = {
        from: localVersion,
        to: registryVersion,
        needsUpdate: compareVersions(localVersion, registryVersion) < 0
      };
    }
    
    return updates;
  } catch (error) {
    throw new Error(`Failed to check prompts version: ${error.message}`);
  }
}

function compareVersions(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }
  
  return 0;
}