/**
 * 从 project-config.json 文件中提取项目 ID
 * @returns {Promise<string|null>} 项目 ID 或 null（如果未找到）
 */
export async function extractProjectId() {
  try {
    // Dynamically import JSON file
    const configModule = await import('../project-config.json');
    const config = configModule.default;
    
    if (config && config.projectId) {
      return config.projectId;
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to read project config, file may not exist:', error.message);
    return null;
  }
}

/**
 * 获取项目 ID，如果不存在则返回默认值和警告信息
 * @returns {Promise<{id: string, hasWarning: boolean, warningMessage?: string}>}
 */
export async function getProjectIdWithWarning() {
  const projectId = await extractProjectId();
  
  if (!projectId) {
    return {
      id: 'no-project-id',
      hasWarning: true,
      warningMessage: 'Project ID not found. Run "npm run generate-id" to generate a unique project ID.'
    };
  }
  
  return {
    id: projectId,
    hasWarning: false
  };
}
