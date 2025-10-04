# Debug Mode 使用说明

## 概述

CLI 工具现在支持 debug 模式，可以通过 `--debug` 参数启用。在 debug 模式下，应用将使用 `devBaseUrl` 而不是 `baseUrl`。

## 使用方法

### 启动开发服务器（带 debug 模式）

```bash
morphixai dev --debug
```

或者指定端口：

```bash
morphixai dev --port 8888 --debug
```

### 配置说明

debug 模式的配置位于 `packages/cli/src/console/config/appShellConfig.js`：

```javascript
export const APP_SHELL_CONFIG = {
    baseUrl: 'https://app-shell.focusbe.com',
    devBaseUrl: 'https://app-shell.focusbe.com',  // 调试模式使用的 URL
    defaultAppId: 'simple-template',
};
```

### 工作原理

1. **CLI 层**：`--debug` 参数通过 Vite 的 `define` 选项注入到前端应用
   - 文件：`packages/cli/src/commands/dev.js`
   - 通过 `define: { '__DEBUG_MODE__': debug }` 传递

2. **前端层**：使用 `getBaseUrl()` 函数自动选择正确的 URL
   - 文件：`packages/cli/src/console/config/appShellConfig.js`
   - `getBaseUrl()` 根据 `__DEBUG_MODE__` 返回 `devBaseUrl` 或 `baseUrl`

3. **应用场景**：
   - `AppShellIframe`：iframe 的 src URL
   - `App.jsx`：预览 URL 生成
   - `preview.js`：预览链接工具

### 示例

```bash
# 普通模式 - 使用 baseUrl
morphixai dev

# 调试模式 - 使用 devBaseUrl
morphixai dev --debug
```

启动后，控制台会显示：

```
🚀 Development server started!

  Dev Console:   http://localhost:8812
  Debug Mode:    Enabled    # 仅在 debug 模式下显示

Press Ctrl+C to stop the server
```

## 相关文件

- `packages/cli/bin/morphixai.js` - CLI 入口，定义 --debug 选项
- `packages/cli/src/commands/dev.js` - 开发服务器命令，处理 debug 参数
- `packages/cli/src/console/config/appShellConfig.js` - App Shell 配置和 getBaseUrl() 函数
- `packages/cli/src/console/App.jsx` - 主应用组件
- `packages/cli/src/console/components/AppShellIframe.jsx` - iframe 组件
- `packages/cli/src/console/utils/preview.js` - 预览链接工具
- `packages/cli/src/console/env.d.ts` - TypeScript 类型声明

