import { useMemo } from 'react';
import { getBaseUrl } from '../config/appShellConfig.js';

/**
 * usePreview - 构建预览链接
 * @param {string} remoteAppId 远端应用ID
 * @returns {string} 预览链接
 */
export function usePreview(remoteAppId) {
  return useMemo(() => {
    if (!remoteAppId) return '';
    const baseUrl = getBaseUrl();
    // 使用时间戳避免缓存
    return `${baseUrl}/app/${remoteAppId}?t=${Date.now()}`;
  }, [remoteAppId]);
}


