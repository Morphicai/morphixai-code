# MorphixAI 应用开发规范 - Claude Code

## 📖 重要提示

**在开始开发前，请务必完整阅读完整开发指南：**

👉 **[docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)**

该文档包含：
- 🎯 完整技术栈说明（React 19、Ionic React 8.6、React Router 5.3.4 等）
- 🚀 MorphixAI SDK 完整使用指南（相机、位置、AI、数据存储等）
- 🎨 UI/UX 规范（图标、Tab 导航、PageHeader 等）
- 📚 最佳实践模式（服务层、Hook 模式、状态管理等）
- ⚠️ 错误处理规范

## 核心约束

**所有开发活动必须严格限制在应用根目录内！**

- ✅ **允许**：在应用根目录及其子目录下创建、修改任何文件
- ❌ **严禁**：修改项目配置文件（package.json, vite.config.js 等）
- ❌ **严禁**：修改 `docs/` 和 `public/` 目录

## 快速要点

### 入口文件
- 使用 `app.jsx` 作为应用入口

### 样式管理
- 必须使用 CSS Modules（`.module.css`）

### 错误处理
```jsx
import { reportError } from '@morphixai/lib';

  try {
    const result = await AppSdk.someModule.someMethod();
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'ComponentName',
    action: 'handleAsyncOperation'
    });
    return null;
  }
```

---

**再次提醒：完整开发规范请阅读 [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)**
