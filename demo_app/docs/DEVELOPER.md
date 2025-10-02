# 开发者文档

## 🛠 技术架构

### 核心技术栈
- **React 19.0.0** - 现代化的 React 版本
- **Ionic React 8.6.2** - 移动端 UI 组件库
- **Ionicons 7.4.0** - 图标库
- **Vite 5.0+** - 快速的构建工具

### MorphixAI 生态
- **@morphixai/components** - MorphixAI 官方组件库
- **@morphixai/app-sdk** - 原生能力 SDK
- **PageHeader** - 统一的页面头部组件

## 📁 详细项目结构

```
morphixai-code/
├── .cursor/rules/              # Cursor AI 开发规范
│   ├── morphixai-app-development.md  # 核心开发规范
│   ├── file-protection.md     # 文件保护规则
│   ├── docs-context.md        # 文档上下文规则
│   └── README.md              # 规则说明
├── CLAUDE.md                   # Claude Code 开发规范
├── CLAUDE-CODE-SETUP.md        # Claude Code 使用指南
├── docs/                      # 项目文档（AI 上下文）
│   ├── requirements/          # 需求文档
│   ├── design/               # 设计文档
│   ├── technical/            # 技术文档
│   ├── context/              # 上下文文档
│   └── notes/                # 开发笔记
├── src/app/                    # 开发区域（唯一允许修改的目录）
│   ├── app.jsx                # 应用入口文件
│   ├── components/            # React 组件
│   └── styles/               # CSS 模块样式
├── src/_dev/                  # 开发辅助文件（受保护）
│   ├── App.jsx               # 开发环境应用
│   ├── components/           # 开发环境组件
│   ├── main.jsx              # 开发环境入口
│   └── utils/                # 开发工具
├── scripts/                   # 构建脚本（受保护）
│   ├── dev-with-watch.js     # 开发服务器脚本
│   ├── watch-apps.js         # 文件监控脚本
│   └── restore-apps.js       # 文件还原脚本
├── package.json              # 项目配置（受保护）
├── vite.config.js            # 构建配置（受保护）
└── index.html                # HTML 入口（受保护）
```

## 🎯 开发约束详解

### 严格的文件保护机制
项目采用严格的文件保护机制，确保开发者只能在安全区域内开发：

#### ✅ 允许修改的区域
```
src/app/                      # 开发沙盒
├── app.jsx                   # 应用入口文件
├── components/               # React 组件目录
│   └── *.jsx                # 组件文件
├── styles/                  # 样式文件目录
│   └── *.module.css         # CSS 模块文件
├── utils/                   # 工具函数目录（可创建）
├── hooks/                   # 自定义 Hooks（可创建）
├── constants/               # 常量定义（可创建）
└── assets/                  # 静态资源（可创建）
```

#### ❌ 受保护的文件和目录
```
根目录文件：
├── package.json             # 项目配置
├── package-lock.json        # 依赖锁定
├── vite.config.js          # 构建配置
├── index.html              # HTML 入口
└── .gitignore              # Git 配置

系统目录：
├── public/                 # 静态资源
├── scripts/                # 构建脚本
├── node_modules/           # 依赖包
├── .cursor/                # Cursor 配置
└── src/_dev/               # 开发辅助
```

## 🔧 AI 编辑器配置详解

### 支持的 AI 编辑器

#### 1. Cursor AI 配置
项目内置了完整的 Cursor AI 配置：

**AI 规则文件说明：**
- `file-protection.md` - 文件保护规则，确保开发活动仅限于 `src/app/` 目录
- `morphixai-app-development.md` - 核心开发规范，基于官方文档制定
- `docs-context.md` - 文档上下文规则，提供项目背景信息

#### 2. Claude Code 支持 🆕
项目现已完美支持 Claude Code：

**特色功能：**
- **智能规范遵循**：自动遵循 MorphixAI 开发规范
- **自然语言编程**：用中文描述需求，自动生成代码
- **完整错误处理**：自动添加 try-catch 和 reportError
- **移动端优化**：自动生成移动端优化的代码
- **最佳实践应用**：自动应用行业最佳实践

**使用方式：**
1. 打开 Claude Code 编辑器
2. 加载项目文件夹
3. 直接与 Claude 对话描述需求
4. Claude 自动生成符合规范的代码

**配置文件：**
- `CLAUDE.md` - 完整的 Claude Code 开发规范
- `CLAUDE-CODE-SETUP.md` - Claude Code 使用指南

#### 3. docs-context.md
文档上下文规则，利用 `docs/` 目录为 AI 提供上下文：
- 需求文档参考
- 设计规范遵循
- 技术约束说明

### Cursor 开发工作流

#### 1. 智能代码生成
```jsx
// AI 会自动生成符合规范的组件结构
import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';
import styles from '../styles/ComponentName.module.css';

export default function ComponentName({ props }) {
    return (
        <IonCard className={styles.container}>
            <IonCardContent>
                {/* 组件内容 */}
            </IonCardContent>
        </IonCard>
    );
}
```

#### 2. 自动样式生成
```css
/* AI 会自动生成对应的 CSS 模块 */
.container {
    margin: 16px 0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 使用 Ionic CSS 变量 */
.primaryText {
    color: var(--ion-color-primary);
}

/* 响应式设计 */
@media (max-width: 576px) {
    .container {
        margin: 8px 0;
    }
}
```

## 📦 依赖管理

### 核心依赖
```json
{
  "peerDependencies": {
    "react": "19.0.0",
    "@ionic/react": "8.6.2",
    "ionicons": "7.4.0"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "chokidar": "^3.5.3"
  }
}
```

### MorphixAI 配置
```json
{
  "morphixai": {
    "version": "1.0.0",
    "entry": "app.jsx",
    "framework": "react-ionic",
    "features": [
      "css-modules",
      "ionicons",
      "morphixai-components"
    ],
    "minAppRunnerVersion": "1.0.0"
  }
}
```

## 🔧 开发工具

### 文件监控与同步

#### 监控文件变化
```bash
npm run watch-apps
```
功能：
- 监控 `src/app/` 目录下的所有文件
- 自动生成 `public/app-files.js`
- 支持热重载和实时更新

#### 还原文件
```bash
npm run restore-apps        # 从 app-files.js 还原文件
npm run restore-apps help   # 显示帮助信息
```
功能：
- 从 `app-files.js` 还原文件到 `src/app/` 目录
- 自动创建目录结构
- 保持文件内容同步

### 开发服务器
```bash
npm run dev      # 启动 Vite 开发服务器
npm run dev:vite # 直接使用 Vite
```

## 🚀 MorphixAI API 使用

### 组件导入
```jsx
import { PageHeader } from '@morphixai/components';
import { CameraAPI, StorageAPI, GeolocationAPI } from '@morphixai/sdk';
```

### 原生能力调用
```jsx
// 相机功能
const takePhoto = async () => {
    try {
        const result = await CameraAPI.takePhoto({
            quality: 90,
            allowEditing: true,
            resultType: 'base64'
        });
        setPhoto(`data:image/jpeg;base64,${result.base64String}`);
    } catch (error) {
        console.error('拍照失败:', error);
    }
};

// 地理位置
const getCurrentLocation = async () => {
    try {
        const position = await GeolocationAPI.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
        });
        setLocation(position.coords);
    } catch (error) {
        console.error('获取位置失败:', error);
    }
};

// 本地存储
const saveData = async (key, value) => {
    try {
        await StorageAPI.set(key, value);
        console.log('数据保存成功');
    } catch (error) {
        console.error('保存失败:', error);
    }
};
```

## 🎨 样式开发规范

### CSS Modules 使用
```jsx
// 组件中导入样式
import styles from '../styles/ComponentName.module.css';

// 使用样式类
<div className={styles.container}>
    <button className={styles.primaryButton}>
        按钮
    </button>
</div>

// 条件样式
<div className={`${styles.card} ${isActive ? styles.active : ''}`}>
    内容
</div>
```

### Ionic CSS 变量
```css
/* 使用 Ionic 预定义变量 */
.content {
    --padding: 16px;
    --background: var(--ion-color-light);
}

/* 自定义组件变量 */
.customButton {
    --border-radius: 12px;
    --padding-start: 16px;
    --padding-end: 16px;
    --transition: all 0.2s ease;
}

/* 颜色主题 */
.primaryCard {
    --background: var(--ion-color-primary);
    --color: var(--ion-color-primary-contrast);
}
```

## ⚠️ 常见问题

### Q: 为什么不能修改 package.json？
A: 为了确保项目的稳定性和与 MorphixAI 平台的兼容性，所有配置文件都受到保护。

### Q: 如何添加新的依赖？
A: 联系项目管理员，不要自行修改依赖配置。

### Q: 如何调试应用？
A: 使用浏览器开发者工具，所有 React 开发工具都可以正常使用。

### Q: 如何部署应用？
A: 应用将在 MorphixAI App Runner 中运行，无需手动部署。

## 📚 参考文档

- [MorphixAI 应用开发规范](https://app-shell.focusbe.com/docs/app-development-specification.md)
- [MorphixAI App SDK API 文档](https://app-shell.focusbe.com/docs/app-sdk-api.md)
- [Ionic React 组件文档](https://ionicframework.com/docs/react)
- [React 官方文档](https://react.dev/)

---

**这个文档为开发者提供了完整的技术细节和最佳实践指南。**
