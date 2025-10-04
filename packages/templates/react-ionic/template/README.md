# MorphixAI 应用开发指南

## 📖 开始之前

**在开始开发前，请务必完整阅读开发指南：**

👉 **[docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)**

该文档是完整的开发规范，包含：
- 🎯 完整技术栈说明（React 19、Ionic React 8.6、React Router 5.3.4 等）
- 🚀 MorphixAI SDK 完整使用指南（相机、位置、AI、数据存储等）
- 🎨 UI/UX 规范（图标、Tab 导航、PageHeader 等）
- 📚 最佳实践模式（服务层、Hook 模式、状态管理等）
- ⚠️ 错误处理规范

## 🎯 项目结构

```
项目根目录/
├── src/                # 源代码目录
│   ├── app.jsx        # 应用入口文件
│   ├── components/    # 组件目录
│   ├── styles/        # 样式目录（CSS Modules）
│   ├── services/      # 服务层（可创建）
│   ├── hooks/         # 自定义 Hooks（可创建）
│   ├── utils/         # 工具函数（可创建）
│   ├── constants/     # 常量定义（可创建）
│   └── assets/        # 应用资源（可创建）
├── _dev/              # 开发工具目录（自动生成）
└── docs/              # 文档目录（请勿修改）
```

## 🚀 快速开始

### 开发约束

- ✅ **允许**：在 `src/` 目录下创建、修改任何文件
- ❌ **严禁**：修改项目配置文件（package.json, vite.config.js 等）
- ❌ **严禁**：修改 `_dev/` 和 `docs/` 目录

### 核心技术

- **React**: 19.0.0
- **Ionic React**: 8.6.2
- **React Router**: 5.3.4 (使用 Switch/useHistory，不是 v6 语法)
- **Zustand**: 5.0.5（状态管理）
- **Day.js**（日期处理）

### 入口文件

应用必须使用 `src/app.jsx` 作为入口文件：

```jsx
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { PageHeader } from '@morphixai/components';
import styles from './styles/App.module.css';

export default function App() {
    return (
        <IonPage>
            <PageHeader title="我的应用" />
            <IonContent className={styles.content}>
                {/* 应用内容 */}
            </IonContent>
        </IonPage>
    );
}
```

### 样式管理

必须使用 CSS Modules（`.module.css`）：

```jsx
import styles from './styles/Component.module.css';

<div className={styles.container}>内容</div>
```

### 错误处理

所有异步操作必须使用 try-catch 和 reportError：

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

## 📚 MorphixAI SDK

MorphixAI 提供了丰富的原生能力：

- **AppSdk.camera** - 相机和图库操作
- **AppSdk.location** - 地理位置服务
- **AppSdk.reminder** - 提醒和通知
- **AppSdk.AI** - AI 聊天对话
- **AppSdk.appData** - 应用数据存储
- **AppSdk.calendar** - 日历事件管理
- **AppSdk.fileSystem** - 文件系统操作
- **AppSdk.fileUpload** - 云存储文件上传

详细使用方法请查看 [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)

## 🎨 UI 组件

### PageHeader

推荐使用 MorphixAI 提供的 PageHeader 组件：

```jsx
import { PageHeader } from '@morphixai/components';

<PageHeader title="页面标题" />
```

### Ionic 组件

完整的 Ionic React 组件库可用：

```jsx
import { 
  IonButton, IonCard, IonItem, IonInput,
  IonList, IonIcon, IonTabs, IonTabBar
} from '@ionic/react';
```

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📖 更多信息

**完整的开发规范、最佳实践和详细示例，请阅读：**

👉 **[docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)**

---

Happy Coding! 🚀

