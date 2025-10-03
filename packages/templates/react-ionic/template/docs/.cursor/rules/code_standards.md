我们的应用构建系统支持：
- **React 19.0.0 + Ionic React 8.6.2**
- **ES6+ 语法和 JSX**
- **CSS Modules 样式隔离**
- **MorphixAI AppSdk 原生能力**
- **内置库集成（Zustand, Day.js, Lodash-es）**
- **远程模块导入（remoteImport）**
- **顶级 await 支持**

## 文件结构规范

### 1. 应用入口文件
应用**必须**包含一个名为 `app.jsx` 的入口文件：

```jsx
// app.jsx - 应用入口
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { PageHeader } from '@morphixai/components';

export default function App() {
    return (
        <IonPage>
            <PageHeader title="应用标题" />
            <IonContent>
                {/* 应用内容 */}
            </IonContent>
        </IonPage>
    );
}
```

### 2. 组件文件结构
推荐的文件组织方式：

```
app.jsx                    # 主入口文件（必需）
components/
  ├── ComponentName.jsx
styles/
  ├── global.css          # 全局样式
  ├── ComponentName.module.css   # CSS Modules
utils/
  ├── utilA.js
  ├── utilB.js
```

## 内置库支持

### 版本信息
构建系统基于以下版本的依赖：

**核心框架:**
- **React**: 19.0.0
- **React DOM**: 19.0.0

**Ionic 生态:**
- **Ionic React**: 8.6.2
- **Ionic React Router**: 8.6.2
- **Ionicons**: 7.4.0

**路由:**
- **React Router**: 5.3.4
- **React Router DOM**: 5.3.4

**内置工具库:**
- **Day.js**: 已集成（日期处理）

**状态管理:**
- **Zustand**: 5.0.5（已内置）

**其他重要依赖:**
- **Lodash-es**: 4.17.21（可通过 remoteImport 使用）

### 核心库（支持import 后使用）
以下库已内置到构建系统中，可直接使用：

```jsx
// React 生态
import React, { useState, useEffect } from 'react';

// Ionic React 组件
import { IonPage, IonContent, IonButton, IonCard, IonTabs, IonTab } from '@ionic/react';

// React Router (v5.3.4) - Route 自带缓存功能
import { Switch, Route, useHistory, useParams, usePause, useResume } from 'react-router-dom';
import { IonReactHashRouter, IonRouterOutlet } from '@ionic/react-router';

// 图标、日期处理、状态管理
import { home, person, settings } from 'ionicons/icons';
import dayjs from 'dayjs';
import { create } from 'zustand';

// MorphixAI 库
import AppSdk from '@morphixai/app-sdk';
import { PageHeader } from '@morphixai/components';
import { fetch } from '@morphixai/fetch';
import { reportError } from '@morphixai/lib';
```

## 图标使用规范

### 常用图标

推荐使用以下 Ionicons 图标：

```jsx
// 常用图标列表
import { 
  home, search, settings, person, notifications, mail, heart, star, add, close,
  menu, checkmark, camera, image, calendar, time, location, phone, call, videocam,
  share, download, upload, copy, trash, edit, save, folder, document, lockClosed,
  eye, thumbsUp, thumbsDown, refresh, sync, cloud, wifi, bluetooth, battery,
  volume, play, pause, stop, cart, bag, card, cash, gift, rocket, globe
} from 'ionicons/icons';
```

### 图标样式

每个图标有 3 种样式，根据需要选择：

```jsx
// 默认样式（实心）- 用于激活/选中状态
import { home, heart } from 'ionicons/icons';

// 轮廓样式 - 用于未激活/默认状态  
import { homeOutline, heartOutline } from 'ionicons/icons';

// 锐角样式 - 用于现代/简洁风格
import { homeSharp, heartSharp } from 'ionicons/icons';
```

### 使用示例

```jsx
// Tab 状态切换
<IonTabButton tab="home">
  <IonIcon icon={isActive ? home : homeOutline} />
  首页
</IonTabButton>

// 收藏状态
<IonIcon icon={isFavorited ? heart : heartOutline} />
```

## Tab 导航组件

### 多功能模块应用推荐使用 Tab 布局

**重要建议**：当应用包含多个功能模块时，强烈推荐使用 Tab 布局来组织和拆分应用功能，这样可以：
- 提供更清晰的功能导航
- 降低页面跳转复杂度  
- 提升用户体验和操作效率

### Tab 布局设计要求

使用 Tab 布局时必须遵循以下要求：

1. **安全区域适配**：确保 Tab 在所有设备上正确适配安全区域，避免被系统UI遮挡
2. **选中状态高亮**：当前激活的 Tab 必须有明显的视觉反馈，包括颜色、图标变化等
3. **移动端优化**：Tab 布局必须针对触屏操作优化，确保点击区域足够大

### HomeTabPage 组件示例
```jsx
// HomeTabPage 组件 - Tab 导航示例（包含安全区域和选中高亮）
import React from 'react';
import {
  IonTabs,
  IonTab,
  IonToolbar,
  IonTabBar,
  IonTabButton,
  IonContent,
  IonIcon,
} from '@ionic/react';
import { playCircle, library } from 'ionicons/icons';
import { PageHeader } from '@morphixai/components';

function HomeTabPage() {
  return (
    <IonTabs>
      <IonTab tab="home">
        <div id="home-page">
          <PageHeader title="Listen now" />
          <IonContent>
            <div className="example-content">Listen now content</div>
          </IonContent>
        </div>
      </IonTab>
      <IonTab tab="library">
        <div id="library-page">
          <PageHeader title="Library" />
          <IonContent>
            <div className="example-content">Library content</div>
          </IonContent>
        </div>
      </IonTab>

      {/* Tab Bar 自动处理安全区域和选中高亮 */}
      <IonTabBar slot="bottom">
        <IonTabButton tab="home">
          <IonIcon icon={playCircle} />
          Listen Now
        </IonTabButton>
        <IonTabButton tab="library">
          <IonIcon icon={library} />
          Library
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default HomeTabPage;
```

**Tab 布局最佳实践**：
- 每个 Tab 内容区域使用独立的 `PageHeader` 设置不同标题
- `IonTabBar` 自动处理安全区域适配和选中状态高亮
- Tab 数量建议控制在 2-5 个之间，确保良好的用户体验

## 路由使用规范

**重要**：基于当前使用的 React Router v5.3.4 版本，推荐使用以下最简单的路由方式：

### 基本使用案例
```jsx
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import HomeTabPage from './components/HomeTabPage';

function App() {
    return (
        <IonApp>
            <IonReactHashRouter>
                <IonRouterOutlet>
                    <Switch>
                        <Route exact path="/">
                            <HomeTabPage />
                        </Route>
                        <Route path="/about">
                            <AboutPage />
                        </Route>
                    </Switch>
                </IonRouterOutlet>
            </IonReactHashRouter>
        </IonApp>
    );
}
```



**注意事项**：
- 使用 `Switch` 而不是 `Routes`（v6 语法）
- 使用 `useHistory` 而不是 `useNavigate`（v6 语法）
- 必须使用 `IonReactHashRouter` 作为路由器
- **Route 自带智能缓存**：前进时缓存到前进队列，后退时移动到后退队列
- **生命周期 Hooks**：`usePause()` 页面进入后台时执行，`useResume()` 页面回到前台时执行

## 远程模块导入（remoteImport）

### 实现原理
`remoteImport` 支持从多个 CDN 源动态加载 JavaScript 库，优先使用 ESM 模式，必要时降级到 UMD 模式。

**CDN 源**:
- ESM: `cdn.skypack.dev`, `esm.sh`, `cdn.jsdelivr.net`
- UMD: `cdn.jsdelivr.net`, `unpkg.com`



### 使用示例

使用 `remoteImport` 函数导入外部库，支持**顶级 await**。

**重要**: remoteImport 应放在常规 import 语句之后：

```jsx
import React, { useState, useEffect } from 'react';

// 远程导入库
const _ = await remoteImport('lodash-es');
const { v4: uuidv4 } = await remoteImport('uuid');
const moment = await remoteImport('moment');

export default function ComponentName() {
   // 组件内容
}
```

> **注意**: 优先使用内置库以获得更好性能。远程导入适合按需加载大型库或特殊功能库。

## 样式规范

### 1. CSS Modules
使用 `.module.css` 后缀创建模块化样式：

```css
/* Component.module.css */
.container {
    padding: 16px;
    background: #f0f0f0;
}
```

```jsx
import styles from './Component.module.css';
<div className={styles.container}>内容</div>
```

### 2. 全局样式（谨慎使用）
普通 CSS 文件作为全局样式：

```css
/* global.css */
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
}
```

**推荐的样式优先级**：
1. **CSS Modules** 
2. **全局样式**


## MorphixAI 组件库和SDK

### MorphixAI AppSdk 使用指南
`@morphixai/app-sdk` 提供了完整的原生能力调用接口：

```jsx
import AppSdk from '@morphixai/app-sdk';

// 相机拍照
const photo = await AppSdk.camera.takePicture({ quality: 0.8 });

// 数据存储
const data = await AppSdk.appData.createData({
  collection: 'users',
  data: { name: 'John', age: 30 }
});

// AI对话
const response = await AppSdk.AI.chat({
  messages: [{ role: 'user', content: 'Hello!' }]
});

// 文件操作
const saved = await AppSdk.fileSystem.saveImageToAlbum({
  base64Data: photoData,
  filename: 'photo.jpg'
});
```

### 内置组件
`@morphixai/components` 提供了一套预制的通用组件：

```jsx
import { PageHeader } from '@morphixai/components';

// PageHeader 组件 - 统一的页面级头部（推荐使用，替代 IonHeader）
<PageHeader title="应用标题" />
```

### 错误处理库
`@morphixai/lib` 提供统一的错误处理：

```jsx
import { reportError } from '@morphixai/lib';

// 在try-catch中使用
try {
  await someAsyncOperation();
} catch (error) {
  await reportError(error, 'JavaScriptError', {
    component: 'ComponentName'
  });
}
```

### PageHeader 组件详细说明

PageHeader 组件是应用的标准页面级顶部导航栏，包含以下特性：

**固定布局**：
- **左侧**：返回按钮（始终显示，自动处理返回逻辑）
- **中间**：页面标题
- **右侧**：更多按钮 + 关闭按钮

**属性说明**：
- `title`（必需）：页面标题，支持字符串或 React 节点

**重要注意事项**：
- 返回按钮自动处理返回逻辑
- 主题自动根据系统设置调整
- 作为页面级组件，适用于单页面应用的顶部导航

> **推荐**: 优先使用 `PageHeader` 组件而不是 `IonHeader + IonToolbar + IonTitle` 组合，保持界面一致性。

## 日期选择组件使用规范

### 优先使用原生日期选择器

建议使用原生 HTML 日期选择器，而不是 `IonDatetime` 组件。

**主要优势**：
- **原生体验**：使用系统原生的日期选择界面
- **更好兼容性**：自动适配不同设备和操作系统

### 推荐使用方式

```jsx
// 推荐使用原生日期选择器
<input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
<input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

// 避免使用 IonDatetime
// <IonDatetime />
```

### 样式一致性要求

**重要**：使用原生时间选择器时，需要通过 CSS 样式保持与其他输入框外观一致。

## MorphixAI Fetch 库

`@morphixai/fetch` 完全等同于原生 `fetch`，不做任何增强或改动。

## MorphixAI 错误处理库

### 错误上报
`@morphixai/lib` 提供了统一的错误处理和上报功能：

```jsx
import { reportError } from '@morphixai/lib';

try {
    const data = await fetch('/api/data');
} catch (error) {
    await reportError(error, 'JavaScriptError', {
        component: 'MyComponent'
    });
}
```

> **重要**: 在容易出错的地方添加 try-catch 语句，使用 `reportError` 上报错误信息。

## AppSdk 常用模块使用示例

```jsx
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';

// 相机/图库模块
const takePicture = async () => {
  try {
    const result = await AppSdk.camera.takePicture({
      quality: 0.8,
      aspect: [4, 3],
      allowsMultipleSelection: false
    });
    if (!result.canceled) {
      return result.assets[0].base64; // 始终返回base64
    }
  } catch (error) {
    await reportError(error, 'JavaScriptError', { component: 'CameraService' });
  }
};

// 地理位置模块
const getLocation = async () => {
  try {
    const position = await AppSdk.location.getCurrentPosition({ accuracy: 6 });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (error) {
    await reportError(error, 'JavaScriptError', { component: 'LocationService' });
  }
};

// 应用数据模块
const saveUserData = async (userData) => {
  try {
    const result = await AppSdk.appData.createData({
      collection: 'users',
      data: {
        ...userData,
        createdAt: Date.now()
      }
    });
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', { component: 'UserService' });
  }
};

// 提醒模块
const createReminder = async (message, startTime) => {
  try {
    const reminder = await AppSdk.reminder.createReminder({
      message: message,
      start_time: startTime,
      title: '应用提醒'
    });
    return reminder;
  } catch (error) {
    await reportError(error, 'JavaScriptError', { component: 'ReminderService' });
  }
};

// AI对话模块
const chatWithAI = async (messages) => {
  try {
    const response = await AppSdk.AI.chat({
      messages: messages,
      options: {
        model: 'openai/gpt-4o',
        temperature: 0.7
      }
    });
    return response;
  } catch (error) {
    await reportError(error, 'JavaScriptError', { component: 'AIService' });
  }
};
```



# 编码原则（非常重要）

在生成应用时，请确保：

## 🎯 核心原则
1. **入口文件**：使用 `app.jsx` 作为应用入口
2. **依赖管理**：优先使用内置库，必要时使用 remoteImport
3. **样式优先级**：CSS Modules > 全局样式
4. **架构遵循**：遵循 React 19.0.0 和 Ionic React 8.6.2 的最佳实践

## 🚀 MorphixAI SDK 使用规范
5. **AppSdk 优先**：优先使用 AppSdk 进行数据存储和原生能力调用
6. **组件库**：利用 MorphixAI 组件库提供的通用组件（如 PageHeader）
7. **错误上报**：在所有 try-catch 中使用 `@morphixai/lib` 的 `reportError`

## 🎨 UI/UX 规范
8. **图标使用**：使用 ionicons，根据状态选择合适样式（默认/轮廓/锐角）
9. **日期选择**：优先使用原生 `<input type="date" />` 而不是 `<IonDatetime />`
10. **Tab 布局**：多功能模块应用建议使用 Tab 布局，注意安全区域适配
11. **移动端优先**：应用必须完美适配移动端，提供原生 APP 体验

## 🔧 技术实现
12. **错误处理**：添加适当的错误处理和加载状态
13. **路由使用**：基于 React Router v5.3.4，使用 `Switch`/`useHistory`
14. **性能优化**：考虑性能和用户体验，避免不必要的重渲染

## ⚠️ 禁止事项
15. **禁止全局错误边界**：请不要添加全局的错误边界
16. **禁止演示代码**：生成的代码是生产可用的，不要添加开发或演示代码
17. **禁止修改配置**：不要修改 package.json, vite.config.js 等配置文件

## 📚 实际应用示例
参考项目中的实际实现：
- `src/app/services/todoService.js` - 云存储服务示例
- `src/app/components/TodoApp.jsx` - 完整组件示例
- `src/app/styles/*.module.css` - CSS Modules 样式示例

遵循这些原则可确保应用正确构建和运行，提供卓越的移动端体验。
