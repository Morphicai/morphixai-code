import { useMemo } from 'react';
import { APP_SHELL_CONFIG } from '../config/appShellConfig.js';

/**
 * usePreview - 构建预览链接
 * @param {string} remoteAppId 远端应用ID
 * @param {boolean} isDev 是否开发环境
 * @returns {string} 预览链接
 */
export function usePreview(remoteAppId, isDev) {
  return useMemo(() => {
    if (!remoteAppId) return '';
    const baseUrl = isDev ? APP_SHELL_CONFIG.devBaseUrl : APP_SHELL_CONFIG.baseUrl;
    // 使用时间戳避免缓存
    return `${baseUrl}/app/${remoteAppId}?t=${Date.now()}`;
  }, [remoteAppId, isDev]);
}


