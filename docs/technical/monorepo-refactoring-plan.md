# MorphixAI Code Monorepo 重构技术方案

> 执行摘要（TL;DR）
>
> - 仅保留两个核心包：`@morphixai/cli`（内嵌开发控制台）与 `@morphixai/template-react-ionic`（内置提示词与文档）。
> - 提示词随模板内置，且支持 CLI 在线更新（`morphixai prompts update`）。
- `morphixai dev` 采用单服务器：同端口提供用户应用与内嵌控制台（默认路由 `/__console`）。
> - Monorepo 使用 PNPM；提供自动迁移与版本管理策略。
> - 实施周期约 6-8 周，阶段性里程碑与验收标准已定义。

## 📋 目录

- [1. 背景与目标](#1-背景与目标)
- [2. 当前架构分析](#2-当前架构分析)
- [3. 目标架构设计](#3-目标架构设计)
- [4. 包拆分方案](#4-包拆分方案)
- [5. CLI 功能设计](#5-cli-功能设计)
- [6. 实施步骤](#6-实施步骤)
- [7. 技术细节](#7-技术细节)
- [8. 迁移指南](#8-迁移指南)
- [9. 风险评估](#9-风险评估)

---

## 1. 背景与目标

### 1.1 背景

当前 MorphixAI Code 项目是一个单体仓库，包含了开发工具、模板、配置、文档等所有内容。随着项目的发展，需要将其拆分为更模块化的结构，以便：

- 提高代码复用性
- 简化用户使用流程
- 便于独立版本管理
- 支持多模板扩展

### 1.2 目标

将项目重构为 Monorepo 结构，拆分为：

1. **CLI 包** - 提供命令行工具
2. **模板包** - 提供项目模板
3. **提示词包** - 提供 AI 开发规范和文档

---

## 2. 当前架构分析

### 2.1 项目结构

```
morphixai-code/
├── src/
│   ├── app/                    # 用户开发区域
│   └── _dev/                   # 开发工具和调试控制台
│       ├── App.jsx             # 开发环境主应用
│       ├── components/         # DevControlPanel 等组件
│       ├── lib/                # HostClient SDK
│       ├── utils/              # 工具函数
│       ├── config/             # 配置
│       └── main.jsx            # 入口文件
├── scripts/                    # 构建和开发脚本
│   ├── dev-with-watch.js       # 开发服务器
│   ├── watch-apps.js           # 文件监控
│   ├── generate-project-id.js  # ID 生成
│   └── restore-apps.js         # 文件还原
├── .cursor/rules/              # AI 提示词规范
├── docs/                       # 文档
├── package.json                # 依赖配置
├── vite.config.js             # 构建配置
└── CLAUDE.md / DEVELOPER.md    # 开发规范
```

### 2.2 核心功能分析

#### 开发工具功能
- **项目初始化**：生成 project ID
- **开发服务器**：Vite + HMR + 文件监控
- **调试控制台**：DevControlPanel (登录、上传、分享、预览)
- **文件同步**：watch-apps.js 监控并生成 app-files.js
- **构建系统**：Vite 构建配置

#### 模板功能
- React + Ionic 项目模板
- 组件示例
- 样式模板
- 配置文件

#### 提示词功能
- Cursor AI 规范
- Claude Code 规范
- 开发文档
- API 文档

---

## 3. 目标架构设计

### 3.1 Monorepo 结构

```
morphixai/
├── packages/
│   ├── cli/                    # @morphixai/cli
│   │   ├── bin/
│   │   │   └── morphixai.js    # CLI 入口
│   │   ├── src/
│   │   │   ├── commands/       # CLI 命令
│   │   │   │   ├── create.js
│   │   │   │   ├── dev.js
│   │   │   │   ├── build.js
│   │   │   │   └── prompts.js  # 提示词管理命令
│   │   │   ├── dev-server/     # 开发服务器
│   │   │   │   ├── vite-server.js
│   │   │   │   ├── file-watcher.js
│   │   │   │   └── console-middleware.js
│   │   │   ├── console/        # 内嵌的开发控制台
│   │   │   │   ├── App.jsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── DevControlPanel.jsx
│   │   │   │   │   ├── AppShellIframe.jsx
│   │   │   │   │   └── AppIcon.jsx
│   │   │   │   ├── lib/
│   │   │   │   │   └── HostClient.ts
│   │   │   │   ├── utils/
│   │   │   │   ├── styles/
│   │   │   │   └── index.html
│   │   │   ├── prompts/        # 提示词管理
│   │   │   │   ├── registry.js # 线上提示词注册表
│   │   │   │   ├── fetcher.js  # 从线上拉取
│   │   │   │   └── installer.js # 安装到项目
│   │   │   └── utils/          # 工具函数
│   │   └── package.json
│   │
│   └── templates/              # 模板集合
│       ├── react-ionic/        # @morphixai/template-react-ionic
│       │   ├── template/
│       │   │   ├── src/
│       │   │   │   └── app/    # 应用模板
│       │   │   ├── public/
│       │   │   ├── .cursor/    # 内置 AI 提示词
│       │   │   │   └── rules/
│       │   │   │       ├── morphixai-app-development.md
│       │   │   │       ├── file-protection.md
│       │   │   │       ├── appsdk-api.md
│       │   │   │       └── ...
│       │   │   ├── docs/       # 内置开发文档
│       │   │   │   ├── DEVELOPER.md
│       │   │   │   └── CLAUDE.md
│       │   │   ├── package.json.template
│       │   │   └── vite.config.js.template
│       │   ├── meta.json
│       │   └── package.json
│       │
│       └── react-tailwind/     # @morphixai/template-react-tailwind (未来)
│
├── package.json                # 根 package.json (workspaces)
├── pnpm-workspace.yaml         # PNPM workspaces 配置
└── README.md
```

### 3.2 包依赖关系

```mermaid
graph TD
    A[用户项目] -->|使用| B[@morphixai/cli]
    B -->|引用| C[@morphixai/template-react-ionic]
    B -->|内嵌| D[dev-console]
    B -->|管理| E[提示词系统]
    C -->|包含| F[React + Ionic 模板]
    C -->|包含| G[内置 AI 提示词]
    E -->|拉取| H[线上提示词库]
    D -->|提供| I[调试控制台 UI]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#e8f5e9
```

---

## 4. 包拆分方案

### 4.1 @morphixai/cli

**职责**：提供命令行工具，管理项目生命周期，内嵌开发控制台

**功能**：
- `create` - 创建新项目（包含模板和提示词）
- `dev` - 启动开发服务器（自动启动内嵌控制台）
- `build` - 构建项目
- `prompts` - 管理 AI 提示词（更新、同步）

**目录结构**：
```
packages/cli/
├── bin/
│   └── morphixai.js            # CLI 入口
├── src/
│   ├── commands/
│   │   ├── create.js           # 创建项目命令
│   │   ├── dev.js              # 开发服务器命令
│   │   ├── build.js            # 构建命令
│   │   └── prompts.js          # 提示词管理命令
│   ├── dev-server/
│   │   ├── vite-server.js      # Vite 服务器
│   │   ├── file-watcher.js     # 文件监控
│   │   └── console-middleware.js   # 控制台中间件（同端口提供控制台）
│   ├── console/                # 内嵌的开发控制台（迁移自 src/_dev）
│   │   ├── App.jsx             # 控制台主应用
│   │   ├── components/
│   │   │   ├── DevControlPanel.jsx
│   │   │   ├── AppShellIframe.jsx
│   │   │   ├── AppIcon.jsx
│   │   │   └── SimpleCounter.jsx
│   │   ├── lib/
│   │   │   ├── HostClient.ts
│   │   │   └── README.md
│   │   ├── utils/
│   │   │   ├── preview.js
│   │   │   ├── ownership.js
│   │   │   └── projectId.js
│   │   ├── config/
│   │   │   └── appShellConfig.js
│   │   ├── styles/
│   │   │   ├── App.module.css
│   │   │   └── *.module.css
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── index.html
│   │   └── vite.config.js      # 控制台独立构建配置
│   ├── prompts/                # 提示词管理系统
│   │   ├── registry.js         # 线上提示词注册表
│   │   ├── fetcher.js          # 从线上拉取提示词
│   │   ├── installer.js        # 安装提示词到项目
│   │   └── updater.js          # 更新提示词
│   ├── utils/
│   │   ├── project-id.js       # Project ID 生成
│   │   ├── template.js         # 模板处理
│   │   ├── logger.js           # 日志工具
│   │   └── config.js           # 配置管理
│   └── index.js
├── templates-registry.json     # 模板注册表
├── prompts-registry.json       # 线上提示词注册表
├── package.json
└── README.md
```

**package.json**：
```json
{
  "name": "@morphixai/cli",
  "version": "1.0.0",
  "description": "MorphixAI Code CLI tool with embedded dev console",
  "bin": {
    "morphixai": "./bin/morphixai.js",
    "morphix": "./bin/morphixai.js"
  },
  "type": "module",
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0",
    "ora": "^7.0.0",
    "fs-extra": "^11.0.0",
    "chokidar": "^3.5.3",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@tailwindcss/vite": "^4.1.11",
    "tailwindcss": "^4.1.11",
    "execa": "^8.0.0",
    "node-fetch": "^3.0.0",
    "qrcode.react": "^4.2.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@ionic/react": "8.6.2"
  },
  "files": [
    "bin",
    "src",
    "templates-registry.json",
    "prompts-registry.json"
  ]
}
```

**关键特性**：
- ✅ 内嵌完整的开发控制台（src/console/）
- ✅ 提示词管理系统（src/prompts/）
- ✅ 支持从线上拉取最新提示词
- ✅ 自动构建并服务控制台

### 4.2 @morphixai/template-react-ionic

**职责**：提供 React + Ionic 项目模板，内置 AI 提示词和开发文档

**目录结构**：
```
packages/templates/react-ionic/
├── template/
│   ├── src/
│   │   └── app/                # 应用源码
│   │       ├── app.jsx
│   │       ├── components/
│   │       │   └── Welcome.jsx
│   │       └── styles/
│   │           ├── App.module.css
│   │           └── Welcome.module.css
│   ├── public/
│   │   └── .gitkeep
│   ├── .cursor/                # 内置 Cursor AI 提示词
│   │   └── rules/
│   │       ├── morphixai-app-development.md
│   │       ├── file-protection.md
│   │       ├── docs-context.md
│   │       ├── appsdk-api.md
│   │       ├── appsdk-best-practices.md
│   │       ├── code_standards.md
│   │       ├── icons-usage.md
│   │       └── README.md
│   ├── docs/                   # 内置开发文档
│   │   ├── DEVELOPER.md        # 开发者指南
│   │   ├── CLAUDE.md           # Claude Code 规范
│   │   ├── context/
│   │   │   └── project-background.md
│   │   ├── requirements/
│   │   │   └── development-guidelines.md
│   │   └── technical/
│   │       └── project-overview.md
│   ├── .gitignore
│   ├── .promptsrc               # 提示词配置文件（标记版本）
│   ├── package.json.template
│   ├── vite.config.js.template
│   ├── index.html
│   └── README.md
├── meta.json                   # 模板元数据
├── package.json
└── README.md
```

**meta.json**：
```json
{
  "name": "react-ionic",
  "displayName": "React + Ionic",
  "description": "MorphixAI mini-app template with React and Ionic",
  "version": "1.0.0",
  "framework": "react-ionic",
  "features": [
    "css-modules",
    "ionicons",
    "morphixai-components",
    "built-in-prompts"
  ],
  "promptsVersion": "1.0.0",
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@ionic/react": "8.6.2",
    "ionicons": "7.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

**.promptsrc** (提示词配置文件)：
```json
{
  "version": "1.0.0",
  "source": "https://app-shell.focusbe.com/api/prompts",
  "lastUpdated": "2025-01-01T00:00:00Z",
  "editors": {
    "cursor": {
      "enabled": true,
      "path": ".cursor/rules"
    },
    "claude": {
      "enabled": true,
      "path": "docs/CLAUDE.md"
    }
  }
}
```

**关键特性**：
- ✅ 模板内置完整的 AI 提示词
- ✅ 包含 Cursor 和 Claude 规范
- ✅ 内置开发文档和最佳实践
- ✅ 支持提示词版本管理
- ✅ 可通过 CLI 更新提示词

---

## 5. 提示词管理系统

### 5.1 提示词线上化方案（单版本，未来可扩展）

**架构设计**：

```
线上提示词库（GitHub/CDN）
         │
         │ HTTPS
         ▼
    CLI 提示词管理器
         │
         ├─► 拉取最新版本
         ├─► 比对本地版本
         └─► 更新到项目
```

### 5.2 线上提示词注册表（单版本）

**prompts-registry.json**（CLI 内置）：
```json
{
  "baseUrl": "https://app-shell.focusbe.com/api/prompts",
  "prompts": {
    "cursor": {
      "version": "1.0.0",
      "files": [
        "morphixai-app-development.md",
        "file-protection.md",
        "docs-context.md",
        "appsdk-api.md",
        "appsdk-best-practices.md",
        "code_standards.md",
        "icons-usage.md",
        "README.md"
      ],
      "path": ".cursor/rules",
      "url": "https://app-shell.focusbe.com/api/prompts/cursor"
    },
    "claude": {
      "version": "1.0.0",
      "files": ["CLAUDE.md"],
      "path": "docs",
      "url": "https://app-shell.focusbe.com/api/prompts/claude"
    }
  }
}
```

### 5.3 提示词管理命令

#### `morphixai prompts check`
检查提示词版本（单版本下用于校验完整性与来源）

```bash
$ morphixai prompts check

📋 Checking prompts version...
✅ cursor: v1.0.0 (latest)
⚠️  claude: v0.9.0 (v1.0.0 available)
✅ docs: v1.0.0 (latest)
```

#### `morphixai prompts update`
更新提示词到最新版本（当远端版本号提升时）

```bash
$ morphixai prompts update

🔄 Updating prompts...
✅ cursor: v1.0.0 (up to date)
⬆️  claude: v0.9.0 → v1.0.0
  - Downloading...
  - Installing...
✅ claude updated successfully
✅ All prompts are up to date
```

#### `morphixai prompts install [editor]`
安装特定编辑器的提示词（首次或修复缺失）

```bash
$ morphixai prompts install cursor

📥 Installing Cursor prompts...
✅ Installed 8 files to .cursor/rules
```

### 5.4 CLI 提示词管理实现

**src/prompts/fetcher.js**：
```javascript
import fetch from 'node-fetch';
import fs from 'fs-extra';

export async function fetchPromptsRegistry() {
  // 从线上拉取最新的提示词注册表
  const registryUrl = 'https://app-shell.focusbe.com/api/prompts/registry.json';
  const response = await fetch(registryUrl);
  return await response.json();
}

export async function fetchPromptFile(url) {
  const response = await fetch(url);
  return await response.text();
}

export async function checkPromptsVersion(projectPath) {
  const localConfig = await readLocalPromptsConfig(projectPath);
  const remoteRegistry = await fetchPromptsRegistry();
  
  const updates = {};
  for (const [editor, config] of Object.entries(remoteRegistry.prompts)) {
    const localVersion = localConfig?.[editor]?.version || '0.0.0';
    const remoteVersion = config.version;
    
    if (localVersion < remoteVersion) {
      updates[editor] = {
        from: localVersion,
        to: remoteVersion,
        needsUpdate: true
      };
    }
  }
  
  return updates;
}
```

**src/prompts/installer.js**：
```javascript
export async function installPrompts(projectPath, editor = 'all') {
  const registry = await fetchPromptsRegistry();
  const editors = editor === 'all' 
    ? Object.keys(registry.prompts) 
    : [editor];
  
  for (const editorName of editors) {
    const config = registry.prompts[editorName];
    const targetPath = path.join(projectPath, config.path);
    
    await fs.ensureDir(targetPath);
    
    for (const file of config.files) {
      const fileUrl = `${config.url}/${file}`;
      const content = await fetchPromptFile(fileUrl);
      const filePath = path.join(targetPath, file);
      
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content);
    }
    
    console.log(`✅ Installed ${editorName} prompts`);
  }
  
  // 更新 .promptsrc
  await updatePromptsConfig(projectPath, registry);
}
```

**src/prompts/updater.js**：
```javascript
export async function updatePrompts(projectPath, options = {}) {
  const { force = false } = options;
  const updates = await checkPromptsVersion(projectPath);
  
  if (Object.keys(updates).length === 0 && !force) {
    console.log('✅ All prompts are up to date');
    return;
  }
  
  for (const [editor, updateInfo] of Object.entries(updates)) {
    if (updateInfo.needsUpdate || force) {
      console.log(`⬆️  Updating ${editor}: v${updateInfo.from} → v${updateInfo.to}`);
      await installPrompts(projectPath, editor);
    }
  }
}
```

---

## 6. CLI 命令详细设计

### 6.1 命令行接口

#### `morphixai create <project-name>`

创建新项目，包含模板和内置提示词

```bash
# 交互式创建
morphixai create my-app

# 指定模板
morphixai create my-app --template react-ionic

# 使用默认配置（跳过提示）
morphixai create my-app --yes
```

**执行流程**：
1. 提示选择模板（默认：react-ionic）
2. 创建项目目录
3. 从模板包复制所有文件（包含内置的 .cursor/rules/ 和 docs/）
4. 生成 project ID
5. 创建 .promptsrc 配置文件
6. 安装依赖（可选）
7. 初始化 Git（可选）
8. 显示后续步骤

**特点**：
- ✅ 自动复制模板内置的 AI 提示词
- ✅ 自动设置提示词版本跟踪
- ✅ 无需手动安装提示词

#### `morphixai dev`

启动开发服务器，自动启动内嵌控制台

```bash
# 启动开发服务器（自动启动控制台）
morphixai dev

# 指定端口
morphixai dev --port 8812

# 控制台路径（单服务器模式下可配置）
morphixai dev --console-path /__console

# 调试模式
morphixai dev --debug
```

**执行流程**：
1. 检查项目配置（project-config.json）
2. 启动文件监控（watch src/app/ → 生成 app-files.js）
3. 构建内嵌控制台（首次或变更时）
4. 启动用户应用服务器（Vite，默认 8812）
5. 在同服务器注入控制台中间件（默认路由 /__console）
6. 打开浏览器（访问 /__console 控制台页面，iframe 内嵌当前应用）

**架构说明（单服务器）**：
```
┌─────────────────────────────────────────────┐
│          morphixai dev (单服务器)            │
└─────────────────────────────────────────────┘
  │  Vite Server :8812
  ├─ 用户应用：/ (HMR)
  └─ 控制台：/__console → 静态控制台页面（iframe 指向 /）
```

**控制台中间件实现**：
```javascript
// packages/cli/src/dev-server/console-middleware.js
export function createConsoleMiddleware({ consoleDistPath, consolePath = '/__console' }) {
  return (req, res, next) => {
    if (!req.url.startsWith(consolePath)) return next();

    const url = req.url.replace(consolePath, '') || '/index.html';
    const filePath = path.join(consoleDistPath, url === '/' ? '/index.html' : url);
    let html = fs.readFileSync(filePath, 'utf-8');
    // 注入用户应用 URL（同源、同端口，根路径）
    html = html.replace('<!-- USER_APP_URL -->', `<script>window.__USER_APP_URL__ = '/'</script>`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  };
}
```

#### `morphixai build`

构建项目

```bash
# 构建生产版本
morphixai build

# 输出目录
morphixai build --outDir dist

# 生成 source map
morphixai build --sourcemap
```

**执行流程**：
1. 读取 src/app/ 文件
2. 使用 Vite 构建
3. 生成 app-files.json（包含所有文件内容）
4. 输出到 dist/ 目录

#### `morphixai console`

单独启动调试控制台

```bash
# 启动控制台（连接到运行中的开发服务器）
morphixai console

# 指定端口
morphixai console --port 8813
```

### 5.2 配置文件

#### `morphixai.config.js`（用户项目根目录）

```javascript
export default {
  // 开发服务器配置
  server: {
    port: 8812,
    open: true,
    host: 'localhost'
  },
  
  // 控制台配置
  console: {
    port: 8813,
    enabled: true
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  
  // App Shell 配置
  appShell: {
    baseUrl: 'https://app-shell.focusbe.com',
    devBaseUrl: 'http://localhost:8812'
  },
  
  // 文件监控配置
  watch: {
    include: ['src/app/**/*'],
    ignore: ['**/node_modules/**', '**/.git/**']
  }
};
```

---

## 6. 实施步骤

### 阶段 1：准备工作（1-2 天）

**目标**：设置 Monorepo 基础架构

1. **创建 Monorepo 结构**
   ```bash
   mkdir morphixai-monorepo
   cd morphixai-monorepo
   git init
   ```

2. **配置包管理器（PNPM）**
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'packages/*'
     - 'packages/templates/*'
     - 'tools/*'
   ```

3. **根 package.json**
   ```json
   {
     "name": "morphixai-monorepo",
     "version": "1.0.0",
     "private": true,
     "workspaces": [
       "packages/*",
       "packages/templates/*",
       "tools/*"
     ],
     "scripts": {
       "dev": "pnpm --filter @morphixai/cli dev",
       "build": "pnpm --recursive run build",
       "test": "pnpm --recursive run test"
     },
     "devDependencies": {
       "@changesets/cli": "^2.27.0",
       "turbo": "^1.10.0"
     }
   }
   ```

### 阶段 2：拆分模板包（2-3 天）

**目标**：创建 @morphixai/template-react-ionic

1. 创建模板包结构
2. 迁移 `src/app/` 内容到 `template/src/app/`
3. 创建模板元数据 `meta.json`
4. 编写 README

### 阶段 3：拆分提示词包（1-2 天）

**目标**：创建 @morphixai/prompts

1. 创建提示词包结构
2. 迁移 `.cursor/rules/` 到 `cursor/`
3. 迁移 `CLAUDE.md` 到 `claude/`
4. 迁移 `DEVELOPER.md` 等文档到 `docs/`
5. 编写安装脚本 `install.js`

### 阶段 4：创建 dev-console（3-4 天）

**目标**：独立开发控制台应用

1. 创建独立的 Vite 应用
2. 迁移 `src/_dev/` 的所有内容
3. 配置独立的 vite.config.js
4. 实现 iframe 嵌入用户应用预览
5. 测试所有功能（登录、上传、分享等）

### 阶段 5：开发 CLI（5-7 天）

**目标**：实现完整的 CLI 工具

1. **create 命令**
   - 模板选择交互
   - 文件复制逻辑
   - project ID 生成
   - 依赖安装

2. **dev 命令**
   - 文件监控（watch-apps.js 逻辑）
   - 单服务器中间件注入（控制台 /__console）
   - 浏览器自动打开

3. **build 命令**
   - Vite 构建集成
   - app-files.json 生成
   - 输出优化

4. **console 命令**
   - 独立控制台启动
   - 端口管理

### 阶段 6：测试与优化（3-5 天）

1. **单元测试**
   - CLI 命令测试
   - 模板生成测试
   - 构建流程测试

2. **集成测试**
   - 完整项目创建到构建流程
   - 控制台功能测试
   - 多模板测试

3. **文档编写**
   - CLI 使用文档
   - 模板开发指南
   - 迁移指南

### 阶段 7：发布与迁移（2-3 天）

1. **NPM 发布**
   ```bash
   pnpm changeset
   pnpm changeset version
   pnpm publish -r
   ```

2. **提供迁移脚本**
   - 自动迁移现有项目

3. **更新主仓库 README**

---

## 7. 技术细节

### 7.1 模板系统设计

#### 模板注册表（templates-registry.json）

```json
{
  "templates": [
    {
      "name": "react-ionic",
      "package": "@morphixai/template-react-ionic",
      "version": "^1.0.0",
      "default": true
    },
    {
      "name": "react-tailwind",
      "package": "@morphixai/template-react-tailwind",
      "version": "^1.0.0"
    }
  ]
}
```

#### 模板应用流程

```javascript
// CLI create 命令中的模板应用逻辑
import { copyTemplate } from './utils/template.js';

async function createProject(projectName, template) {
  // 1. 创建项目目录
  const projectPath = path.join(process.cwd(), projectName);
  await fs.mkdir(projectPath, { recursive: true });
  
  // 2. 加载模板
  const templatePath = resolveTemplate(template); // 从 node_modules 解析
  
  // 3. 复制模板文件
  await copyTemplate(templatePath, projectPath);
  
  // 4. 处理模板变量
  await processTemplateVariables(projectPath, {
    projectName,
    projectId: generateProjectId()
  });
  
  // 5. 安装依赖
  await installDependencies(projectPath);
  
  // 6. 复制 AI 提示词
  await installPrompts(projectPath);
}
```

### 7.2 开发服务器架构

#### 单服务器模式（保持现有逻辑）

```
┌─────────────────────────────────────────┐
│         CLI Dev Command                  │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌───────────────────────────────────────────┐
│           Vite Dev Server :8812           │
├───────────────────────────────────────────┤
│  路由 /            → 用户应用（src/app/）  │
│  路由 /__console   → 控制台静态页面       │
│                      (DevControlPanel,     │
│                       AppShellIframe)      │
└───────────────────────────────────────────┘
```

#### 文件监控流程

```javascript
// CLI 中的文件监控实现
import chokidar from 'chokidar';

function startFileWatcher(projectPath) {
  const appDir = path.join(projectPath, 'src/app');
  const outputFile = path.join(projectPath, 'src/_dev/app-files.js');
  
  const watcher = chokidar.watch(appDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  
  const generateAppFiles = debounce(async () => {
    const files = await readDirectoryRecursive(appDir);
    const content = `export default ${JSON.stringify(files, null, 2)};`;
    await fs.writeFile(outputFile, content);
    console.log('✅ app-files.js updated');
  }, 500);
  
  watcher
    .on('add', generateAppFiles)
    .on('change', generateAppFiles)
    .on('unlink', generateAppFiles);
    
  return watcher;
}
```

### 7.3 控制台集成方案

#### 方案 A：Iframe 嵌入（推荐）

```javascript
// CLI dev 命令启动两个服务器
async function startDevServers(config) {
  // 1. 启动用户应用服务器
  const userAppServer = await startViteServer({
    root: process.cwd(),
    server: { port: config.server.port }
  });
  
  // 2. 启动控制台服务器（使用 dev-console 包）
  const consoleServer = await startViteServer({
    root: path.join(CLI_ROOT, 'dev-console'),
    server: { port: config.console.port }
  });
  
  // 3. 在控制台中通过 iframe 嵌入用户应用
  // dev-console/src/App.jsx 中配置 iframe src
  const iframeSrc = `http://localhost:${config.server.port}`;
  
  // 4. 打开浏览器到控制台页面
  open(`http://localhost:${config.console.port}`);
}
```

#### 方案 B：构建时内嵌（备选）

```javascript
// 将 dev-console 构建为静态资源，CLI 运行时启动单个服务器
async function startDevServerWithConsole(config) {
  const consoleAssets = path.join(CLI_ROOT, 'dist/console');
  
  const server = await startViteServer({
    root: process.cwd(),
    server: {
      port: config.server.port,
      // 自定义中间件，提供控制台路由
      middlewareMode: false,
      proxy: {
        '/__console': {
          target: `http://localhost:${config.server.port}`,
          rewrite: (path) => path.replace(/^\/__console/, ''),
          configure: (proxy, options) => {
            // 提供控制台静态文件
          }
        }
      }
    }
  });
}
```

**推荐方案 A**，因为：
- 控制台和用户应用完全隔离
- 端口独立，不会冲突
- 便于独立开发和调试控制台
- 支持控制台热更新

### 7.4 提示词安装机制

```javascript
// @morphixai/prompts/install.js
import fs from 'fs-extra';
import path from 'path';

export async function installPrompts(projectPath, options = {}) {
  const { editor = 'cursor' } = options;
  
  // 1. 确定目标目录
  const targetDir = editor === 'cursor'
    ? path.join(projectPath, '.cursor/rules')
    : path.join(projectPath, '.ai');
  
  // 2. 创建目录
  await fs.ensureDir(targetDir);
  
  // 3. 复制规则文件
  const sourceDir = path.join(__dirname, editor);
  await fs.copy(sourceDir, targetDir);
  
  // 4. 复制文档
  const docsTarget = path.join(projectPath, 'docs/ai');
  await fs.ensureDir(docsTarget);
  await fs.copy(path.join(__dirname, 'docs'), docsTarget);
  
  console.log('✅ AI prompts installed successfully');
}
```

---

## 8. 迁移指南

### 8.1 现有项目迁移

**自动迁移脚本**：

```javascript
// @morphixai/cli/src/commands/migrate.js
export async function migrateProject(projectPath) {
  console.log('🔄 Migrating project to new structure...');
  
  // 1. 检测旧项目
  const isOldProject = await fs.pathExists(
    path.join(projectPath, 'src/_dev')
  );
  
  if (!isOldProject) {
    console.log('✅ Project is already using new structure');
    return;
  }
  
  // 2. 备份
  const backupPath = path.join(projectPath, '.backup');
  await fs.copy(projectPath, backupPath);
  console.log('📦 Backup created at .backup/');
  
  // 3. 迁移 package.json
  const pkg = await fs.readJson(path.join(projectPath, 'package.json'));
  delete pkg.scripts.dev;
  delete pkg.scripts['dev:vite'];
  pkg.scripts = {
    ...pkg.scripts,
    dev: 'morphixai dev',
    build: 'morphixai build'
  };
  await fs.writeJson(path.join(projectPath, 'package.json'), pkg, { spaces: 2 });
  
  // 4. 删除旧的开发工具文件
  await fs.remove(path.join(projectPath, 'src/_dev'));
  await fs.remove(path.join(projectPath, 'scripts'));
  
  // 5. 安装新的 CLI
  console.log('📥 Installing @morphixai/cli...');
  await execa('npm', ['install', '--save-dev', '@morphixai/cli'], {
    cwd: projectPath
  });
  
  // 6. 安装提示词
  await installPrompts(projectPath);
  
  console.log('✅ Migration completed successfully');
  console.log('💡 Run `npm run dev` to start the new dev server');
}
```

**手动迁移步骤**：

1. 备份项目
2. 删除 `src/_dev/` 和 `scripts/` 目录
3. 更新 package.json：
   ```diff
   {
     "scripts": {
   -    "dev": "node scripts/dev-with-watch.js",
   +    "dev": "morphixai dev",
   -    "dev:vite": "vite",
   +    "build": "morphixai build"
     },
     "devDependencies": {
   +    "@morphixai/cli": "^1.0.0"
     }
   }
   ```
4. 运行 `npm install`
5. 运行 `npx morphixai-prompts` 安装 AI 提示词
6. 运行 `npm run dev` 测试

### 8.2 版本兼容性

- CLI v1.x 兼容所有旧项目（通过自动检测和迁移）
- 提供 `--legacy` 标志支持旧项目结构
- 提供迁移工具 `morphixai migrate`

---

## 9. 风险评估

### 9.1 技术风险

| 风险 | 影响 | 可能性 | 缓解措施 |
|-----|------|--------|---------|
| Monorepo 包依赖循环 | 高 | 低 | 仔细设计包边界，使用依赖图检查工具 |
| CLI 启动性能 | 中 | 中 | 优化 CLI 加载，延迟加载非必要模块 |
| 模板系统复杂度 | 中 | 中 | 从单一模板开始，渐进式支持多模板 |
| 控制台集成问题 | 高 | 中 | 充分测试双服务器模式，提供降级方案 |

### 9.2 用户影响

| 影响 | 程度 | 应对措施 |
|-----|------|---------|
| 学习新的 CLI 命令 | 低 | 提供详细文档和示例 |
| 现有项目迁移成本 | 中 | 提供自动迁移工具和详细指南 |
| 依赖包体积增加 | 低 | CLI 采用按需加载，仅安装必要依赖 |

### 9.3 开发风险

| 风险 | 应对措施 |
|-----|---------|
| Monorepo 管理复杂度 | 使用成熟工具（PNPM + Turborepo），提供自动化脚本 |
| 包版本管理 | 使用 Changesets 管理版本发布 |
| CI/CD 配置 | 提供完整的 GitHub Actions 配置 |

---

## 10. 附录

### 10.1 关键依赖

**CLI 包**：
- `commander` - CLI 框架
- `inquirer` - 交互式命令行
- `chalk` - 终端颜色
- `ora` - 加载动画
- `fs-extra` - 文件操作
- `execa` - 进程执行
- `vite` - 构建工具

**Monorepo 工具**：
- `pnpm` - 包管理器
- `turbo` - 构建系统
- `changesets` - 版本管理

### 10.2 参考项目

- **Vite** - 类似的 CLI + 模板系统
- **Create React App** - 项目脚手架设计
- **Nx** - Monorepo 管理
- **Vue CLI** - 插件和模板系统

### 10.3 时间估算总结

| 阶段 | 预计时间 |
|-----|---------|
| 准备工作 | 1-2 天 |
| 拆分模板包 | 2-3 天 |
| 拆分提示词包 | 1-2 天 |
| 创建 dev-console | 3-4 天 |
| 开发 CLI | 5-7 天 |
| 测试与优化 | 3-5 天 |
| 发布与迁移 | 2-3 天 |
| **总计** | **17-26 天** |

---

## 结论

本技术方案提供了一个清晰的路径，将 MorphixAI Code 从单体仓库重构为模块化的 Monorepo 结构。通过拆分为 CLI、模板和提示词三个独立的包，我们可以：

1. ✅ 提高代码复用性和可维护性
2. ✅ 简化用户使用流程（通过 CLI）
3. ✅ 支持多模板扩展
4. ✅ 独立管理各个包的版本
5. ✅ 保持向后兼容性（通过迁移工具）

建议按照实施步骤循序渐进，每个阶段完成后进行充分测试，确保功能完整性和用户体验。

