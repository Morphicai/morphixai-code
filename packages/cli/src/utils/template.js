import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyTemplate(templateName, targetPath, variables = {}) {
  try {
    let templatePath;
    
    // 首先尝试从 monorepo 本地路径（开发时使用）
    const localTemplatePath = path.resolve(__dirname, '../../../templates', templateName, 'template');
    if (await fs.pathExists(localTemplatePath)) {
      templatePath = localTemplatePath;
    } else {
      // 尝试从 node_modules 解析模板包（发布后使用）
      try {
        const templatePackageName = `@morphixai/template-${templateName}`;
        // 在 ES 模块中使用 import.meta.resolve（Node.js 18.19.0+）
        const packageUrl = await import.meta.resolve(`${templatePackageName}/package.json`);
        const packagePath = fileURLToPath(packageUrl);
        templatePath = path.join(path.dirname(packagePath), 'template');
      } catch (error) {
        throw new Error(`Template "${templateName}" not found`);
      }
    }
    
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
    
  } catch (error) {
    throw new Error(`Failed to copy template: ${error.message}`);
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