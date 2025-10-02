import fs from 'fs-extra';
import path from 'path';
import { fetchPromptsRegistry, fetchPromptFile, readLocalPromptsConfig, writeLocalPromptsConfig, checkPromptsVersion } from './fetcher.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function installPrompts(projectPath, options = {}) {
  const { editor = 'all' } = options;
  
  try {
    const registry = await fetchPromptsRegistry();
    const editors = editor === 'all' ? Object.keys(registry.prompts) : [editor];
    
    const installedEditors = [];
    
    for (const editorName of editors) {
      const config = registry.prompts[editorName];
      if (!config) {
        console.warn(`Unknown editor: ${editorName}`);
        continue;
      }
      
      await installEditorPrompts(projectPath, editorName, config, registry.baseUrl);
      installedEditors.push(editorName);
    }
    
    // 更新本地配置
    await updateLocalPromptsConfig(projectPath, registry, installedEditors);
    
    return { installed: installedEditors };
  } catch (error) {
    // 如果线上安装失败，尝试从本地模板包复制
    return await installPromptsFromTemplate(projectPath, editor);
  }
}

async function installEditorPrompts(projectPath, editorName, config, baseUrl) {
  const targetPath = path.join(projectPath, config.path);
  
  // 确保目标目录存在
  await fs.ensureDir(targetPath);
  
  // 安装每个文件
  for (const file of config.files) {
    const fileUrl = `${config.url}/${file}`;
    
    try {
      const content = await fetchPromptFile(fileUrl);
      const filePath = path.join(targetPath, file);
      
      // 确保文件目录存在
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content);
    } catch (error) {
      console.warn(`Failed to fetch ${file}, trying local fallback`);
      await installFileFromLocal(editorName, file, targetPath);
    }
  }
}

async function installFileFromLocal(editorName, fileName, targetPath) {
  // 从当前项目的文件复制（如果存在）
  const localSourcePaths = [
    path.resolve(process.cwd(), '.cursor/rules', fileName),
    path.resolve(process.cwd(), 'docs', fileName),
    path.resolve(process.cwd(), '.ai', fileName)
  ];
  
  for (const sourcePath of localSourcePaths) {
    if (await fs.pathExists(sourcePath)) {
      const content = await fs.readFile(sourcePath, 'utf-8');
      const targetFile = path.join(targetPath, fileName);
      await fs.ensureDir(path.dirname(targetFile));
      await fs.writeFile(targetFile, content);
      return;
    }
  }
  
  // 如果本地也没有，创建一个基本的提示词文件
  await createFallbackPrompt(editorName, fileName, targetPath);
}

async function createFallbackPrompt(editorName, fileName, targetPath) {
  const fallbackContent = {
    'README.md': '# MorphixAI AI Prompts\\n\\nThis directory contains AI development prompts for MorphixAI applications.\\n',
    'morphixai-app-development.md': '# MorphixAI App Development\\n\\nGeneral development guidelines for MorphixAI applications.\\n',
    'CLAUDE.md': '# MorphixAI Development Guide\\n\\nDevelopment guidelines for Claude Code.\\n'
  };
  
  const content = fallbackContent[fileName] || `# ${fileName}\\n\\nPrompt file for ${editorName}.\\n`;
  const targetFile = path.join(targetPath, fileName);
  
  await fs.ensureDir(path.dirname(targetFile));
  await fs.writeFile(targetFile, content);
}

async function installPromptsFromTemplate(projectPath, editor) {
  try {
    // 从模板包复制提示词
    const templatePath = path.resolve(__dirname, '../../../templates/react-ionic/template');
    
    if (await fs.pathExists(templatePath)) {
      const cursorsPath = path.join(templatePath, '.cursor');
      const docsPath = path.join(templatePath, 'docs');
      
      if (editor === 'all' || editor === 'cursor') {
        if (await fs.pathExists(cursorsPath)) {
          await fs.copy(cursorsPath, path.join(projectPath, '.cursor'));
        }
      }
      
      if (editor === 'all' || editor === 'claude') {
        if (await fs.pathExists(docsPath)) {
          await fs.copy(docsPath, path.join(projectPath, 'docs'));
        }
      }
      
      return { installed: [editor], source: 'template' };
    }
  } catch (error) {
    console.warn('Failed to install from template:', error.message);
  }
  
  throw new Error('Failed to install prompts from both online and template sources');
}

async function updateLocalPromptsConfig(projectPath, registry, installedEditors) {
  const config = {
    version: '1.0.0',
    source: registry.baseUrl,
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