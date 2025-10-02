---
description: 文件保护规则 - 严格限制开发范围到 src/app/ 目录
globs: ["**/*"]
alwaysApply: true
---

# 🔒 文件保护规则

## ⛔ 严格开发限制

### 🚨 重要警告
**在 MorphixAI 项目中，开发者只能在 `src/app/` 目录下进行开发工作！**

这不是建议，而是**严格的硬性约束**。违反此规则可能导致项目损坏或部署失败。

## 🛡️ 受保护的文件和目录

### ❌ 完全禁止修改的文件
```
根目录文件：
├── package.json              🔒 项目配置 - 禁止修改
├── package-lock.json         🔒 依赖锁定 - 禁止修改
├── vite.config.js           🔒 构建配置 - 禁止修改
├── index.html               🔒 HTML入口 - 禁止修改
├── README.md                🔒 项目文档 - 禁止修改
├── .gitignore               🔒 Git配置 - 禁止修改
└── 其他根目录配置文件         🔒 系统配置 - 禁止修改

系统目录：
├── public/                  🔒 静态资源 - 禁止修改
├── scripts/                 🔒 构建脚本 - 禁止修改
├── node_modules/            🔒 依赖包 - 禁止修改
├── .cursor/                 🔒 Cursor配置 - 禁止修改
└── src/_dev/                🔒 开发辅助 - 禁止修改
```

### ✅ 唯一允许的开发区域
```
src/app/                     🟢 开发沙盒 - 允许全部操作
├── app.jsx                  ✅ 应用入口 - 可以修改
├── components/              ✅ 组件目录 - 可以修改和扩展
│   ├── ComponentName.jsx    ✅ 现有组件 - 可以修改
│   └── NewComponent.jsx     ✅ 新组件 - 可以创建
├── styles/                  ✅ 样式目录 - 可以修改和扩展
│   ├── App.module.css       ✅ 现有样式 - 可以修改
│   └── NewStyle.module.css  ✅ 新样式 - 可以创建
├── utils/                   ✅ 工具目录 - 可以创建
├── hooks/                   ✅ Hooks目录 - 可以创建
├── constants/               ✅ 常量目录 - 可以创建
└── [任何新目录/文件]         ✅ 自定义内容 - 可以创建
```

## 🎯 开发指导原则

### 1. 文件操作权限
```jsx
// ✅ 允许的操作示例
// 在 src/app/components/ 下创建新组件
// 文件：src/app/components/NewFeature.jsx
import React from 'react';
import { IonCard } from '@ionic/react';
import styles from '../styles/NewFeature.module.css';

export default function NewFeature() {
    return (
        <IonCard className={styles.container}>
            {/* 组件内容 */}
        </IonCard>
    );
}

// ✅ 在 src/app/styles/ 下创建对应样式
// 文件：src/app/styles/NewFeature.module.css
.container {
    padding: 16px;
}
```

### 2. 禁止的操作
```jsx
// ❌ 绝对禁止：尝试修改项目配置
// 不要尝试修改 package.json
// 不要尝试修改 vite.config.js
// 不要尝试创建根目录文件

// ❌ 绝对禁止：在 src/app/ 外创建文件
// 不要在 src/ 根目录下创建文件
// 不要在 src/_dev/ 下创建或修改文件
// 不要在 public/ 下添加资源
```

### 3. 依赖管理限制
```javascript
// ❌ 禁止操作
// 不要尝试安装新的 npm 包
// 不要修改 package.json 中的依赖
// 不要修改 peerDependencies

// ✅ 正确做法
// 使用已有的依赖：React, @ionic/react, ionicons
// 在 src/app/ 下实现所有功能
// 如需新依赖，请联系项目管理员
```

## 🔧 开发工作流

### 标准开发流程
1. **进入开发目录**
   ```bash
   cd src/app/
   ```

2. **创建新功能**
   ```bash
   # 在 components/ 下创建组件
   touch components/FeatureName.jsx
   
   # 在 styles/ 下创建样式
   touch styles/FeatureName.module.css
   ```

3. **修改现有文件**
   ```bash
   # 只修改 src/app/ 下的文件
   # 如：app.jsx, components/*.jsx, styles/*.css
   ```

### 目录扩展规范
```
# 可以在 src/app/ 下创建的新目录结构
src/app/
├── components/           # 组件
│   ├── common/          # 通用组件
│   ├── forms/           # 表单组件
│   └── layout/          # 布局组件
├── styles/              # 样式
│   ├── common/          # 通用样式
│   └── components/      # 组件样式
├── utils/               # 工具函数 ✅ 可创建
├── hooks/               # 自定义Hooks ✅ 可创建
├── constants/           # 常量定义 ✅ 可创建
├── services/            # 服务层 ✅ 可创建
├── types/               # TypeScript类型 ✅ 可创建
└── assets/              # 应用资源 ✅ 可创建
```

## 🚨 违规后果

### 如果违反文件保护规则：
1. **项目可能无法正常构建**
2. **部署可能失败**
3. **可能破坏开发环境配置**
4. **可能导致版本控制冲突**

### 正确的心态：
- `src/app/` 是你的**完整开发沙盒**
- 在这个目录下，你拥有**完全的创作自由**
- 这个限制保护项目稳定性，不限制开发能力

## 💡 常见问题解答

**Q: 我需要修改 package.json 添加依赖怎么办？**
A: 联系项目管理员，不要自行修改配置文件。

**Q: 我需要添加静态资源怎么办？**
A: 在 `src/app/assets/` 目录下添加（如果不存在则创建）。

**Q: 我需要修改构建配置怎么办？**
A: 联系项目管理员，开发者不应修改构建配置。

**Q: 我想创建新的目录结构怎么办？**
A: 在 `src/app/` 下自由创建任何目录结构。

记住：`src/app/` 是你的王国，在这里你可以实现任何功能！🏰
