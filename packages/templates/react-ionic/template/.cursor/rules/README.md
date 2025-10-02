# Cursor Rules for MorphixAI App Development

这个目录包含了 MorphixAI 应用开发的 Cursor 规则集，基于官方文档制定，提供智能化的开发体验。

## 🚨 重要：严格开发限制

### ⛔ 硬性约束
**所有开发活动必须严格限制在 `src/app/` 目录内！**

- ✅ **允许**：在 `src/app/` 及其子目录下创建、修改任何文件
- ❌ **严禁**：修改 `src/app/` 目录外的任何文件
- ❌ **严禁**：修改项目配置文件（package.json, vite.config.js 等）
- ❌ **严禁**：修改 `src/_dev/` 目录内容

## 📋 规则文件说明

### 🔒 文件保护（最高优先级）
- **[file-protection.md](./file-protection.md)** - 文件保护规则
  - 严格开发限制说明
  - 受保护文件列表
  - 开发沙盒定义
  - 违规后果警告

### 📋 开发规范
- **[morphixai-app-development.md](./morphixai-app-development.md)** - 核心开发规范
  - 项目结构要求
  - 技术栈规范
  - 编码规范
  - API 使用指南
  - 基于官方文档：[应用开发规范](https://app-shell.focusbe.com/docs/app-development-specification.md) 和 [App SDK API 文档](https://app-shell.focusbe.com/docs/app-sdk-api.md)

- **[code_standards.md](./code_standards.md)** - 详细技术标准
  - 完整的技术栈规范
  - AppSdk 使用示例
  - 路由和组件规范
  - 编码原则和最佳实践

- **[appsdk-best-practices.md](./appsdk-best-practices.md)** - AppSdk 最佳实践
  - 基于实际项目经验的使用模式
  - 错误处理和性能优化
  - 常用服务层实现
  - Hook 和状态管理模式

- **[appsdk-api.md](./appsdk-api.md)** - AppSdk API 参考文档
  - 完整的 API 接口文档
  - 详细的参数和返回值说明
  - 实际使用示例

- **[icons-usage.md](./icons-usage.md)** - Ionicons 图标使用规范
  - 三种图标样式（默认/轮廓/锐角）的使用场景
  - 常用图标分类和导入方式
  - Tab导航、按钮、列表等组件中的图标最佳实践
  - 图标状态切换和颜色使用规范

### 📚 文档上下文
- **[docs-context.md](./docs-context.md)** - 文档上下文规则
  - 利用 docs/ 目录中的文档作为 AI 开发上下文
  - 需求文档、设计文档、技术文档的使用规范
  - 为 AI 优化的文档编写指南
  - 文档结构和维护最佳实践

## 🎯 快速开始

### 1. 📍 确认开发区域
**只能在 `src/app/` 目录下开发！**
```
✅ 允许修改的区域：
src/app/
├── app.jsx              # 应用入口文件
├── components/          # 组件目录
│   └── *.jsx           # React 组件
└── styles/             # 样式目录
    └── *.module.css    # CSS 模块文件

❌ 禁止修改的区域：
├── package.json         # 🔒 项目配置
├── vite.config.js      # 🔒 构建配置
├── src/_dev/           # 🔒 开发辅助
└── 其他根目录文件       # 🔒 系统文件
```

### 2. ⚠️ 重要提醒
**不要尝试修改以下文件：**
- ❌ package.json
- ❌ vite.config.js  
- ❌ index.html
- ❌ src/_dev/ 目录下的任何文件
- ❌ 任何根目录配置文件

### 3. 标准应用入口模板
```jsx
// src/app/app.jsx
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { PageHeader } from '@morphixai/components';
import styles from './styles/App.module.css';

export default function App() {
    return (
        <IonPage>
            <PageHeader title="应用标题" />
            <IonContent className={styles.content}>
                {/* 应用内容 */}
            </IonContent>
        </IonPage>
    );
}
```

## 📚 参考文档

基于以下官方文档制定的规则：

- **基础文档**: [MorphixAI App Builder 开发文档](https://app-shell.dev.baibian.app/docs/index.md)
- **开发规范**: [应用开发规范](https://app-shell.focusbe.com/docs/app-development-specification.md)
- **API 文档**: [App SDK API 文档](https://app-shell.focusbe.com/docs/app-sdk-api.md)
- **图标规范**: [图标使用规范](https://app-shell.focusbe.com/docs/icon-specification.md)

## ⚠️ 重要提醒

1. **入口文件**: 必须使用 `app.jsx` 作为应用入口
2. **目录结构**: 应用代码必须放在 `src/app/` 目录下
3. **CSS 模块**: 必须使用 `.module.css` 后缀的样式文件
4. **依赖版本**: 确保 React 19.0.0 和 Ionic 8.6.2 的兼容性
5. **平台兼容**: 确保应用与 MorphixAI App Runner 兼容

## 🔧 使用说明

这些规则文件会自动被 Cursor 加载和应用。当你在开发 MorphixAI 应用时，Cursor 的 AI 助手将根据这些规则提供相应的代码建议和补全，确保生成的代码符合 MorphixAI 平台的规范要求。

遵循这些规则，你可以：
- ✅ 确保应用结构正确
- ✅ 使用正确的组件和 API
- ✅ 遵循最佳编码实践
- ✅ 保持代码风格一致
- ✅ 确保平台兼容性

Happy coding with MorphixAI! 🚀
