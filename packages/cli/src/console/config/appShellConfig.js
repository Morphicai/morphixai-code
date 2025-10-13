// App Shell 配置
export const APP_SHELL_CONFIG = {
    baseUrl: 'https://app-shell.focusbe.com',
    devBaseUrl: 'https://app-shell.dev.focusbe.com',
    defaultAppId: 'simple-template',
};

/**
 * 获取当前应该使用的 baseUrl
 * 根据 debug 模式决定使用 devBaseUrl 还是 baseUrl
 * @returns {string} 当前应该使用的 baseUrl
 */
export function getBaseUrl() {
    // 通过 Vite 的 define 注入的全局变量
    const isDebugMode = typeof __DEBUG_MODE__ !== 'undefined' ? __DEBUG_MODE__ : false;
    return isDebugMode ? APP_SHELL_CONFIG.devBaseUrl : APP_SHELL_CONFIG.baseUrl;
}
