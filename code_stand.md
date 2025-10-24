我们的应用构建系统支持：
- **React + Ionic 组件**
- **ES6+ 语法和 JSX**
- **CSS Modules 样式隔离**
- **内置库集成**
- **第三方库导入**

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
- **Lodash-es**: 4.17.21（支持直接导入）

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

## 参考文档

- Ionic 组件（v8）：[Ionic Components v8](https://ionicframework.com/docs/v8/components)

## 图标使用规范

### 常用图标

推荐使用以下 Ionicons 图标：

```jsx
// 常用图标列表
import { 
  home, search, settings, person, notifications, mail, heart, star, add, close,
  menu, checkmark, camera, image, calendar, time, location, call, videocam,
  share, download, cloudUpload, copy, trash, create, save, folder, document, lockClosed,
  eye, thumbsUp, thumbsDown, refresh, sync, cloud, wifi, bluetooth, batteryFull,
  volumeHigh, play, pause, stop, cart, bag, card, cash, gift, rocket, globe
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

### Tab 导航开发规范（重要）

**核心原则**：使用 `IonTab` 组件实现 Tab 导航，禁止使用路由模式，确保无刷新切换和状态保持。

**标准实现**
```javascript
// ✅ 正确导入
import { IonTabs, IonTab, IonTabBar, IonTabButton } from '@ionic/react';

// ✅ 标准结构
<IonTabs>
  <IonTab tab="timer"><TimerTab /></IonTab>
  <IonTab tab="tasks"><TasksTab /></IonTab>
  
  <IonTabBar slot="bottom">
    <IonTabButton tab="timer">Timer</IonTabButton>
    <IonTabButton tab="tasks">Tasks</IonTabButton>
  </IonTabBar>
</IonTabs>
```

**关键要求**
- `IonTab` 和 `IonTabButton` 必须有相同的 `tab` 属性值
- `IonTabButton` 禁止使用 `href` 属性
- 不使用 `IonReactHashRouter`、`Route`、`Switch` 等路由组件来切换 Tab
- Tab 切换不改变 URL，保持组件状态

> 注：该规范仅适用于 Tab 内部导航；应用级页面切换仍按下文“路由使用规范”执行。

**效果**
✅ 无路由切换、无刷新感、状态保持、无浏览器历史记录问题

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

## 第三方库导入

### 导入方式

所有库（包括内置库和第三方库）都使用标准的 ES6 `import` 语句导入，无需使用异步导入方式。

### 使用示例

**内置库导入**：
```jsx
import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import dayjs from 'dayjs';
import { create } from 'zustand';
```

**第三方库导入**：
```jsx
import React from 'react';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default function ComponentName() {
   // 使用导入的库
   const uniqueId = uuidv4();
   const data = _.uniq([1, 2, 2, 3]);
   
   return (
     <div>
       {/* 组件内容 */}
     </div>
   );
}
```

**重要说明**：
- 所有 `import` 语句必须放在文件顶部
- 使用标准的 ES6 模块语法
- 无需使用 `await` 或异步导入
- 优先使用内置库以获得更好的性能和稳定性

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


## MorphixAI 组件库

### 内置组件
`@morphixai/components` 提供了一套预制的通用组件：

```jsx
import { PageHeader } from '@morphixai/components';

// PageHeader 组件 - 统一的页面级头部（推荐使用，替代 IonHeader）
<PageHeader title="应用标题" />
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

## 应用 SDK 使用

```jsx
import AppSdk from '@morphixai/app-sdk';
// 使用方法
AppSdk.[[moduleName]].[[functionName]]([arguments])

// 示例
AppSdk.camera.takePicture()
```



# 编码原则（非常重要）
## IonLoading 使用注意事项

- 必须使用 isOpen 控制是否显示
- 必须有对应的 key

示例：

```jsx
<IonLoading
  key={'loading'}
  isOpen={showLoading}
  message="loading..."
  spinner="crescent"
/>
```



## 编码规范
在生成应用时，请确保：

1. 使用 `app.jsx` 作为入口文件
2. 使用标准 ES6 `import` 语句导入所有库，优先使用内置库
3. **样式优先级**：CSS Modules > 全局样式
4. 遵循 React 和 Ionic 的最佳实践
6. 利用 MorphixAI 组件库提供的通用组件
7. **图标使用**：使用常用图标列表中的 ionicons，根据状态选择合适的样式（默认/轮廓/锐角）
8. **优先使用原生日期选择器**：使用 `<input type="date" />` 而不是 `<IonDatetime />`
9. 添加适当的错误处理和加载状态
10. 考虑性能和用户体验
11. 生成的代码是正式环境可用的代码，请不要添加任何的开发环境代码和演示代码
12. 请不要添加全局的错误边界
13. 在容易出错的地方添加 try-catch 语句，使用 `@morphixai/lib` 的 `reportError` 上报错误
14. 使用 PageHeader 组件时，直接使用 `<PageHeader title="标题" />`，返回按钮和右侧功能按钮自动处理
15. **路由使用**：基于 React Router v5.3.4，使用 `Switch` 而不是 `Routes`，使用 `useHistory` 而不是 `useNavigate`，使用 `component` 属性而不是 `element` 属性
16. **Tab 布局规范**：多功能模块应用建议使用 Tab 布局，必须考虑安全区域适配和选中状态高亮
17. **移动端优先设计**：应用必须完美适配移动端，提供接近原生 APP 的用户体验

遵循这些规范可确保应用正确构建和运行，提供卓越的移动端体验。