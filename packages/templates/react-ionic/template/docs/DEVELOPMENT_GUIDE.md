# MorphixAI 应用开发规范

> 本文档是 MorphixAI 应用开发的完整指南，适用于所有 AI 编辑器（Cursor、Claude Code 等）

## 🚨 核心开发约束

### ⛔ 硬性限制
**所有开发活动必须严格限制在应用根目录内！**

- ✅ **允许**：在应用根目录及其子目录下创建、修改任何文件（除 `_dev/` 外）
- ❌ **严禁**：修改应用目录外的任何文件
- ❌ **严禁**：修改项目配置文件（package.json, vite.config.js 等）
- ❌ **严禁**：修改 `_dev/` 目录内容（这是 CLI 的内部目录）

## 🎯 技术栈规范

### 核心框架版本
- **React**: 19.0.0
- **React DOM**: 19.0.0
- **Ionic React**: 8.6.2
- **Ionic React Router**: 8.6.2
- **Ionicons**: 7.4.0
- **React Router**: 5.3.4 (使用 Switch/useHistory，而非 v6 语法)
- **Zustand**: 5.0.5（已内置）
- **Day.js**: 已集成（日期处理）
- **Lodash-es**: 4.17.21（可通过 remoteImport 使用）

### 必需的导入结构
```jsx
// React 核心导入
import React, { useState, useEffect } from 'react';

// Ionic React 组件导入
import { IonPage, IonContent, IonButton, IonCard, IonItem, IonInput, IonTabs, IonTab, IonTabBar, IonTabButton, IonIcon } from '@ionic/react';

// React Router (v5.3.4) - Route 自带缓存功能
import { Switch, Route, useHistory, useParams, usePause, useResume } from 'react-router-dom';
import { IonReactHashRouter, IonRouterOutlet } from '@ionic/react-router';

// MorphixAI 组件和库导入
import { PageHeader } from '@morphixai/components';
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';
import { fetch } from '@morphixai/fetch';

// 图标导入（根据状态选择合适样式）
import { home, homeOutline, homeSharp, camera, cameraOutline } from 'ionicons/icons';

// 状态管理和工具
import dayjs from 'dayjs';
import { create } from 'zustand';

// 样式导入（必须使用 CSS Modules）
import styles from './styles/ComponentName.module.css';
```

### remoteImport 远程模块导入
```jsx
// 远程导入库 - 支持顶级 await
const _ = await remoteImport('lodash-es');
const { v4: uuidv4 } = await remoteImport('uuid');
const moment = await remoteImport('moment');

// remoteImport 应放在常规 import 语句之后
// 支持从 CDN 源动态加载：ESM: cdn.skypack.dev, esm.sh, cdn.jsdelivr.net
// UMD: cdn.jsdelivr.net, unpkg.com
```

### 标准组件结构
```jsx
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

## 🛠 开发规范

### 1. 入口文件要求
- 必须使用 `app.jsx` 作为应用入口文件
- 导出默认函数组件

### 2. 标准文件结构
```
项目根目录/
├── app.jsx              # 应用入口文件（必需）
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── forms/          # 表单组件
│   └── layout/         # 布局组件
├── styles/             # 样式目录
│   ├── global.css      # 全局样式
│   └── *.module.css    # CSS 模块文件
├── services/           # 服务层 ✅ 可创建
├── hooks/              # 自定义Hooks ✅ 可创建
├── utils/              # 工具函数 ✅ 可创建
├── constants/          # 常量定义 ✅ 可创建
├── types/              # TypeScript类型 ✅ 可创建
├── assets/             # 应用资源 ✅ 可创建
├── docs/               # 文档目录 ❌ 禁止修改
├── _dev/               # CLI 内部目录 ❌ 禁止修改
└── public/             # 静态资源 ❌ 禁止修改
```

### 3. 文件命名规范
- 组件名：PascalCase（如 `UserCard.jsx`）
- 服务文件：camelCase.js（如 `todoService.js`）
- 样式文件：`ComponentName.module.css`
- 常量：UPPER_SNAKE_CASE
- Hook文件：`useFeatureName.js`

### 4. 样式管理规范
- **必须使用** CSS Modules（`.module.css`）
- 优先级：CSS Modules > 全局样式
- 避免全局样式冲突

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

### 5. 错误处理规范（极重要）
```jsx
import { reportError } from '@morphixai/lib';

// 在所有异步操作中使用 try-catch
const handleAsyncOperation = async () => {
  try {
    const result = await AppSdk.someModule.someMethod();
    return result;
  } catch (error) {
    // 必须使用 reportError 上报错误
    await reportError(error, 'JavaScriptError', {
      component: 'ComponentName',
      action: 'handleAsyncOperation',
      timestamp: Date.now()
    });
    return null; // 返回合理的默认值
  }
};
```

## 🚀 MorphixAI SDK 完整使用指南

### AppSdk 核心模块
- **AppSdk.camera** - 相机和图库操作
- **AppSdk.location** - 地理位置服务
- **AppSdk.reminder** - 提醒和通知
- **AppSdk.AI** - AI聊天对话
- **AppSdk.appData** - 应用数据存储（优先使用，而非 localStorage）
- **AppSdk.calendar** - 日历事件管理
- **AppSdk.fileSystem** - 文件系统操作
- **AppSdk.fileUpload** - 云存储文件上传

### 1. 相机/图库模块（AppSdk.camera）

#### takePicture(options?) - 调用相机拍照
```jsx
const takePhoto = async () => {
  try {
    const result = await AppSdk.camera.takePicture({
      quality: 0.8,        // 图片质量 0~1，默认 0.8
      aspect: [4, 3],      // 裁剪比例，默认 [4,3]
      exif: false,         // 是否返回 exif，默认 false
      allowsMultipleSelection: false, // 是否允许多选，默认 false
      mediaTypes: ['images'] // 媒体类型，目前仅支持图片
    });
    
    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      return {
        uri: image.uri,           // 本地图片路径或base64数据URI
        base64: image.base64,     // base64编码（始终返回）
        width: image.width,       // 图片宽度
        height: image.height,     // 图片高度
        fileName: image.fileName, // 文件名
        fileSize: image.fileSize, // 文件大小
        type: image.type          // 文件类型
      };
    }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'CameraService'
    });
  }
};
```

#### pickImage(options?) - 从图库选择图片
```jsx
const pickFromGallery = async () => {
  try {
    const result = await AppSdk.camera.pickImage({
      quality: 0.8,
      allowsMultipleSelection: true // 允许多选
    });
    if (!result.canceled) {
      return result.assets;
    }
    return [];
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'ImageService'
    });
  }
};
```

### 2. 地理位置模块（AppSdk.location）

#### getCurrentPosition(options?) - 获取当前位置
```jsx
const getLocation = async () => {
  try {
    const position = await AppSdk.location.getCurrentPosition({
      accuracy: 6 // 定位精度级别，1-6的数字，1为最低精度，6为最高精度
    });
    return {
      latitude: position.coords.latitude,      // 纬度
      longitude: position.coords.longitude,    // 经度
      accuracy: position.coords.accuracy,      // 精度
      altitude: position.coords.altitude,      // 海拔
      heading: position.coords.heading,        // 方向
      speed: position.coords.speed,           // 速度
      timestamp: position.timestamp,          // 时间戳（毫秒）
      mocked: position.mocked                 // 是否模拟（Android）
    };
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'LocationService'
    });
  }
};
```

### 3. 提醒/通知模块（AppSdk.reminder）

#### createReminder(reminder) - 创建提醒
```jsx
const createReminder = async (message, startTime) => {
  try {
    const reminder = await AppSdk.reminder.createReminder({
      message: message,         // 提醒内容（必填）
      start_time: startTime,    // 开始时间时间戳（必填）
      end_time: null,          // 结束时间时间戳
      interval: 0,             // 重复间隔(毫秒)，0为不重复
      skip_dates: [],          // 跳过日期时间戳数组，最多100个
      title: '应用提醒',        // 标题
      sub_title: '',           // 副标题
      page: '',               // 跳转页面
      appid: ''               // 应用ID
    });
    return reminder;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'ReminderService'
    });
  }
};

// 其他提醒相关方法
const getUserReminders = () => AppSdk.reminder.getUserReminders();
const getReminder = (id) => AppSdk.reminder.getReminder({id});
const updateReminder = (id, reminder) => AppSdk.reminder.updateReminder({id, reminder});
const deleteReminder = (id) => AppSdk.reminder.deleteReminder({id});
```

### 4. AI聊天模块（AppSdk.AI）

#### chat({messages, options}) - 与AI进行对话
```jsx
// 基础文字对话
const chatWithAI = async (message) => {
  try {
    const response = await AppSdk.AI.chat({
      messages: [
        { role: "system", content: "你是一个友善的助手" },
        { role: "user", content: message }
      ],
      options: { 
        model: "openai/gpt-4o",      // 或 "anthropic/claude-3.7-sonnet"
        temperature: 0.7             // 采样温度，0-1之间
      }
    });
    return response;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'AIService'
    });
  }
};

// 包含图片的对话
const chatWithImage = async (text, base64Image) => {
  try {
    const response = await AppSdk.AI.chat({
      messages: [{
        role: "user",
        content: [
          {type: "text", text: text},
          {
            type: "image_url",
            image_url: {url: `data:image/jpeg;base64,${base64Image}`}
          }
        ]
      }]
    });
    return response;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'AIService'
    });
  }
};

// 获取可用模型
const getAvailableModels = () => AppSdk.AI.getAvailableModels();
```

### 5. 应用数据模块（AppSdk.appData）

#### 数据持久化最佳实践
```jsx
// 创建数据
const saveUserData = async (userData) => {
  try {
    // 主要方案：使用 AppSdk
    const result = await AppSdk.appData.createData({
      collection: 'users',
      data: {
        ...userData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    });
    return result; // 返回 { id: string, ...data }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'UserService'
    });
    // 降级到 localStorage
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      return { id: Date.now(), ...userData };
    } catch (localError) {
      console.error('本地存储也失败:', localError);
      return null;
    }
  }
};

// 查询数据
const queryUsers = async (filters = []) => {
  try {
    const result = await AppSdk.appData.queryData({
      collection: 'users',
      query: filters // 如: [{ key: 'age', value: '25', operator: 'gt' }]
    });
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'UserService'
    });
    return [];
  }
};

// 更新数据
const updateUser = async (id, updates) => {
  try {
    const result = await AppSdk.appData.updateData({
      collection: 'users',
      id: id,
      data: {
        ...updates,
        updatedAt: Date.now()
      }
    });
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'UserService'
    });
    return null;
  }
};

// 删除数据
const deleteUser = async (id) => {
  try {
    const result = await AppSdk.appData.deleteData({
      collection: 'users',
      id: id
    });
    return result.success;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'UserService'
    });
    return false;
  }
};
```

### 6. 日历模块（AppSdk.calendar）

```jsx
// 请求权限
const requestCalendarPermissions = () => AppSdk.calendar.requestCalendarPermissions();

// 创建日历
const createCalendar = async (title, color = '#2196F3') => {
  try {
    const result = await AppSdk.calendar.createCalendar({
      title: title,
      color: color,
      name: title,
      ownerAccount: ''
    });
    return result; // { success: boolean, id: string }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'CalendarService'
    });
  }
};

// 创建事件
const createEvent = async (calendarId, eventData) => {
  try {
    const result = await AppSdk.calendar.createEvent({
      calendarId: calendarId,
      eventData: {
        title: eventData.title,         // 必填
        startDate: eventData.startDate, // 必填
        endDate: eventData.endDate,
        allDay: eventData.allDay || false,
        location: eventData.location || '',
        notes: eventData.notes || '',
        timeZone: eventData.timeZone || ''
      }
    });
    return result; // { success: boolean, id: string }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'CalendarService'
    });
  }
};
```

### 7. 文件系统模块（AppSdk.fileSystem）

```jsx
// 保存图片到相册
const saveImageToAlbum = async (base64Data, filename) => {
  try {
    const result = await AppSdk.fileSystem.saveImageToAlbum({
      base64Data: base64Data,
      filename: filename || `image_${Date.now()}.jpg`
    });
    return result.success;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileService'
    });
  }
};

// 下载文件
const downloadFile = async (url, filename) => {
  try {
    const result = await AppSdk.fileSystem.downloadFile({
      url: url,          // 支持 HTTP(S) URL 或 Base64数据URI
      filename: filename
    });
    return result; // { success: boolean, filePath?: string, error?: string }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileService'
    });
  }
};

// 分享文件
const shareFile = async (fileUri, options = {}) => {
  try {
    const result = await AppSdk.fileSystem.shareFile({
      fileUri: fileUri,
      dialogTitle: options.title || '分享文件',
      mimeType: options.mimeType
    });
    return result.success;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileService'
    });
  }
};

// 选择文档
const pickDocument = async (options = {}) => {
  try {
    const result = await AppSdk.fileSystem.pickDocument({
      type: options.type || '*/*',
      copyToCacheDirectory: options.copyToCacheDirectory || true,
      multiple: options.multiple || false
    });
    return result; // { assets: [], canceled: boolean, output?: FileList }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileService'
    });
  }
};

// 文件操作
const readFile = (fileUri) => AppSdk.fileSystem.readFileBase64({fileUri});
const writeFile = (fileUri, base64Content) => AppSdk.fileSystem.writeFileBase64({fileUri, base64Content});
const fileExists = (fileUri) => AppSdk.fileSystem.fileExists({fileUri});
const deleteFile = (fileUri) => AppSdk.fileSystem.deleteFile({fileUri});
```

### 8. 文件上传模块（AppSdk.fileUpload）

```jsx
// 上传文件到云存储
const uploadFile = async (fileInfo, compressionPreset) => {
  try {
    const result = await AppSdk.fileUpload.uploadFile({
      fileInfo: {
        uri: fileInfo.uri,     // 文件URI
        type: fileInfo.type,   // 文件MIME类型
        name: fileInfo.name    // 文件名称
      },
      compressionPreset: compressionPreset // 'small' | 'medium' | 'large' | 'avatar' | 'thumbnail'
    });
    return result; // { success: boolean, publicUrl?: string, path?: string, size?: number, width?: number, height?: number, error?: string }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileUploadService'
    });
  }
};

// 删除云存储文件
const deleteUploadedFile = async (path) => {
  try {
    const result = await AppSdk.fileUpload.deleteFile({path});
    return result.success;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileUploadService'
    });
  }
};
```

## 🎨 UI/UX 完整规范

### 1. PageHeader 组件使用
```jsx
// PageHeader 组件特性：
// - 左侧：返回按钮（始终显示，自动处理返回逻辑）
// - 中间：页面标题
// - 右侧：更多按钮 + 关闭按钮
// - 主题自动根据系统设置调整

<PageHeader title="应用标题" />
// 推荐使用，而不是 IonHeader + IonToolbar + IonTitle
```

### 2. 完整图标使用规范

#### 图标导入和分类
```jsx
// 导航类图标
import { 
  home, homeOutline, homeSharp,           // 首页
  search, searchOutline, searchSharp,     // 搜索
  menu, menuOutline, menuSharp,           // 菜单
  apps, appsOutline, appsSharp,           // 应用
  grid, gridOutline, gridSharp,           // 网格
  list, listOutline, listSharp,           // 列表
  library, libraryOutline, librarySharp,  // 图书馆/收藏
  bookmark, bookmarkOutline, bookmarkSharp, // 书签
  archive, archiveOutline, archiveSharp   // 归档
} from 'ionicons/icons';

// 用户与社交图标
import {
  person, personOutline, personSharp,             // 用户
  people, peopleOutline, peopleSharp,             // 多用户
  personCircle, personCircleOutline, personCircleSharp, // 用户头像
  heart, heartOutline, heartSharp,                // 喜欢/收藏
  thumbsUp, thumbsUpOutline, thumbsUpSharp,       // 点赞
  share, shareOutline, shareSharp,                // 分享
  chatbubble, chatbubbleOutline, chatbubbleSharp, // 聊天
  mail, mailOutline, mailSharp                    // 邮件
} from 'ionicons/icons';

// 媒体与文件图标
import {
  camera, cameraOutline, cameraSharp,             // 相机
  image, imageOutline, imageSharp,                // 图片
  images, imagesOutline, imagesSharp,             // 多图片
  videocam, videocamOutline, videocamSharp,       // 视频录制
  play, playOutline, playSharp,                   // 播放
  pause, pauseOutline, pauseSharp,                // 暂停
  document, documentOutline, documentSharp,       // 文档
  folder, folderOutline, folderSharp              // 文件夹
} from 'ionicons/icons';

// 操作类图标
import {
  add, addOutline, addSharp,                   // 添加
  remove, removeOutline, removeSharp,          // 移除
  close, closeOutline, closeSharp,             // 关闭
  checkmark, checkmarkOutline, checkmarkSharp, // 确认/完成
  create, createOutline, createSharp,          // 编辑/创建
  copy, copyOutline, copySharp,                // 复制
  trash, trashOutline, trashSharp,             // 删除
  save, saveOutline, saveSharp,                // 保存
  download, downloadOutline, downloadSharp,    // 下载
  refresh, refreshOutline, refreshSharp        // 刷新
} from 'ionicons/icons';

// 状态与通知图标
import {
  notifications, notificationsOutline, notificationsSharp, // 通知
  alert, alertOutline, alertSharp,             // 警告
  star, starOutline, starSharp,                // 星星/评分
  checkmarkCircle, checkmarkCircleOutline, checkmarkCircleSharp, // 成功
  helpCircle, helpCircleOutline, helpCircleSharp // 帮助
} from 'ionicons/icons';

// 设置与工具图标
import {
  settings, settingsOutline, settingsSharp,     // 设置
  cog, cogOutline, cogSharp,                    // 齿轮设置
  options, optionsOutline, optionsSharp,        // 选项
  filter, filterOutline, filterSharp,           // 筛选
  build, buildOutline, buildSharp               // 构建/工具
} from 'ionicons/icons';

// 时间与日期图标
import {
  time, timeOutline, timeSharp,               // 时间
  alarm, alarmOutline, alarmSharp,           // 闹钟
  calendar, calendarOutline, calendarSharp,   // 日历
  today, todayOutline, todaySharp             // 今天
} from 'ionicons/icons';

// 位置与地图图标
import {
  location, locationOutline, locationSharp,     // 位置
  pin, pinOutline, pinSharp,                   // 标记点
  map, mapOutline, mapSharp,                   // 地图
  navigate, navigateOutline, navigateSharp,    // 导航
  compass, compassOutline, compassSharp        // 指南针
} from 'ionicons/icons';

// 购物与商业图标
import {
  cart, cartOutline, cartSharp,               // 购物车
  bag, bagOutline, bagSharp,                  // 购物袋
  card, cardOutline, cardSharp,               // 卡片/支付
  cash, cashOutline, cashSharp,               // 现金
  gift, giftOutline, giftSharp                // 礼物
} from 'ionicons/icons';
```

#### 图标状态切换规范
```jsx
// Tab 状态切换
function TabButton({ isActive, icon, label }) {
  return (
    <IonTabButton>
      <IonIcon icon={isActive ? icon : `${icon}Outline`} />
      <span>{label}</span>
    </IonTabButton>
  );
}

// 收藏状态切换
function FavoriteButton({ isFavorited, onToggle }) {
  return (
    <IonButton fill="clear" onClick={onToggle}>
      <IonIcon icon={isFavorited ? heart : heartOutline} />
    </IonButton>
  );
}

// 通知状态
function NotificationBell({ hasNotifications }) {
  return (
    <IonIcon icon={hasNotifications ? notifications : notificationsOutline} />
  );
}
```

### 3. Tab 导航完整实现
**多功能模块应用强烈推荐使用 Tab 布局**：

```jsx
import { IonTabs, IonTab, IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { playCircle, library, home, homeOutline } from 'ionicons/icons';

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
```

**Tab 布局设计要求**：
- 安全区域适配：确保 Tab 在所有设备上正确适配
- 选中状态高亮：当前激活的 Tab 必须有明显的视觉反馈
- 移动端优化：确保点击区域足够大
- Tab 数量建议控制在 2-5 个之间

### 4. 日期选择规范
**优先使用原生 HTML 日期选择器**：
```jsx
// 推荐使用原生日期选择器
<input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
<input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

// 避免使用
// <IonDatetime />
```

## 🔧 路由使用规范

**基于 React Router v5.3.4**：
```jsx
import React from 'react';
import { Route, Switch, useHistory, useParams, usePause, useResume } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import HomeTabPage from './components/HomeTabPage';

function App() {
    const history = useHistory(); // v5 语法，不是 useNavigate
    
    return (
        <IonApp>
            <IonReactHashRouter>
                <IonRouterOutlet>
                    <Switch> {/* 使用 Switch 而不是 Routes（v6 语法） */}
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

// 生命周期 Hooks
// usePause() 页面进入后台时执行
// useResume() 页面回到前台时执行
// Route 自带智能缓存：前进时缓存到前进队列，后退时移动到后退队列
```

## 📚 完整最佳实践模式

### 1. 服务层模式
```jsx
// services/DataService.js - 通用数据访问层
export class DataService {
  static async create(collection, data) {
    try {
      const result = await AppSdk.appData.createData({
        collection,
        data: {
          ...data,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      });
      return result;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'DataService',
        action: 'create',
        collection 
      });
      return null;
    }
  }

  static async query(collection, filters = []) {
    try {
      const result = await AppSdk.appData.queryData({
        collection,
        query: filters
      });
      return result;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'DataService',
        action: 'query',
        collection 
      });
      return [];
    }
  }

  static async update(collection, id, updates) {
    try {
      const result = await AppSdk.appData.updateData({
        collection,
        id,
        data: {
          ...updates,
          updatedAt: Date.now()
        }
      });
      return result;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'DataService',
        action: 'update',
        collection,
        id 
      });
      return null;
    }
  }

  static async delete(collection, id) {
    try {
      const result = await AppSdk.appData.deleteData({
        collection,
        id
      });
      return result.success;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'DataService',
        action: 'delete',
        collection,
        id 
      });
      return false;
    }
  }
}

// services/TodoService.js - 具体业务服务
import { DataService } from './DataService';

export class TodoService extends DataService {
  static COLLECTION = 'todos';

  static async getAllTodos() {
    return await this.query(this.COLLECTION);
  }

  static async createTodo(text) {
    return await this.create(this.COLLECTION, {
      text,
      completed: false,
      priority: 'normal'
    });
  }

  static async toggleTodo(id, completed) {
    return await this.update(this.COLLECTION, id, { completed });
  }

  static async deleteTodo(id) {
    return await this.delete(this.COLLECTION, id);
  }
}
```

### 2. 自定义 Hook 模式
```jsx
// hooks/useTodos.js
import { useState, useEffect } from 'react';
import { TodoService } from '../services/TodoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await TodoService.getAllTodos();
      setTodos(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    const newTodo = await TodoService.createTodo(text);
    if (newTodo) {
      setTodos(prev => [...prev, newTodo]);
      return true;
    }
    return false;
  };

  const toggleTodo = async (id, completed) => {
    const updated = await TodoService.toggleTodo(id, completed);
    if (updated) {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    }
  };

  const deleteTodo = async (id) => {
    const success = await TodoService.deleteTodo(id);
    if (success) {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh: loadTodos
  };
};

// hooks/useCamera.js
import { useState } from 'react';
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';

export const useCamera = () => {
  const [loading, setLoading] = useState(false);

  const takePicture = async (options = {}) => {
    setLoading(true);
    try {
      const result = await AppSdk.camera.takePicture({
        quality: 0.8,
        aspect: [4, 3],
        ...options
      });
      
      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      await reportError(error, 'JavaScriptError', {
        component: 'useCamera'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (options = {}) => {
    setLoading(true);
    try {
      const result = await AppSdk.camera.pickImage(options);
      if (!result.canceled) {
        return result.assets;
      }
      return [];
    } catch (error) {
      await reportError(error, 'JavaScriptError', {
        component: 'useCamera'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    takePicture,
    pickImage
  };
};
```

### 3. Zustand 状态管理
```jsx
// stores/appStore.js
import { create } from 'zustand';
import { TodoService } from '../services/TodoService';

export const useAppStore = create((set, get) => ({
  // 状态
  todos: [],
  user: null,
  loading: false,
  theme: 'auto',

  // Actions
  loadTodos: async () => {
    set({ loading: true });
    const todos = await TodoService.getAllTodos();
    set({ todos, loading: false });
  },

  addTodo: async (text) => {
    const newTodo = await TodoService.createTodo(text);
    if (newTodo) {
      set(state => ({ todos: [...state.todos, newTodo] }));
    }
  },

  updateTodo: async (id, updates) => {
    const updated = await TodoService.update('todos', id, updates);
    if (updated) {
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id ? updated : todo
        )
      }));
    }
  },

  deleteTodo: async (id) => {
    const success = await TodoService.deleteTodo(id);
    if (success) {
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id)
      }));
    }
  },

  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  
  // 计算属性
  get completedTodos() {
    return get().todos.filter(todo => todo.completed);
  },
  
  get pendingTodos() {
    return get().todos.filter(todo => !todo.completed);
  }
}));
```

### 4. 统一的图片服务
```jsx
// services/ImageService.js
export class ImageService {
  static async takePicture(options = {}) {
    const defaultOptions = {
      quality: 0.8,
      aspect: [4, 3],
      allowsMultipleSelection: false
    };
    
    try {
      const result = await AppSdk.camera.takePicture({
        ...defaultOptions,
        ...options
      });
      
      if (!result.canceled && result.assets.length > 0) {
        return result.assets.map(asset => ({
          uri: asset.uri,
          base64: asset.base64, // 始终可用
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName
        }));
      }
      return [];
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'ImageService',
        action: 'takePicture' 
      });
      return [];
    }
  }

  static async pickFromGallery(options = {}) {
    try {
      const result = await AppSdk.camera.pickImage(options);
      if (!result.canceled) {
        return result.assets;
      }
      return [];
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'ImageService',
        action: 'pickFromGallery' 
      });
      return [];
    }
  }

  static async saveToAlbum(base64Data, filename) {
    try {
      const result = await AppSdk.fileSystem.saveImageToAlbum({
        base64Data,
        filename: filename || `image_${Date.now()}.jpg`
      });
      return result.success;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'ImageService',
        action: 'saveToAlbum' 
      });
      return false;
    }
  }
}
```

### 5. AI 聊天服务
```jsx
// services/AIService.js
export class AIService {
  static async chat(messages, options = {}) {
    const defaultOptions = {
      model: 'openai/gpt-4o',
      temperature: 0.7
    };

    try {
      const response = await AppSdk.AI.chat({
        messages: messages,
        options: { ...defaultOptions, ...options }
      });
      return response;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'AIService',
        action: 'chat',
        messageCount: messages.length 
      });
      return null;
    }
  }

  static async getAvailableModels() {
    try {
      const models = await AppSdk.AI.getAvailableModels();
      return models;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'AIService',
        action: 'getAvailableModels' 
      });
      return [];
    }
  }

  // 处理多轮对话
  static buildConversation(history, newMessage) {
    return [
      ...history,
      { role: 'user', content: newMessage, timestamp: Date.now() }
    ];
  }

  // 格式化AI响应
  static formatResponse(response) {
    if (typeof response === 'string') {
      return response;
    }
    return response?.content || '抱歉，我无法理解您的问题。';
  }
}
```

### 6. 性能优化模式

#### 缓存策略
```jsx
// utils/CacheService.js
class CacheService {
  static cache = new Map();
  static TTL = 5 * 60 * 1000; // 5分钟

  static async get(key, fetcher) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  }

  static clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  static has(key) {
    const cached = this.cache.get(key);
    return cached && Date.now() - cached.timestamp < this.TTL;
  }
}

export default CacheService;
```

#### 重试机制
```jsx
// utils/retryHelper.js
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// 使用示例
const result = await withRetry(
  () => AppSdk.appData.queryData({ collection: 'todos', query: [] }),
  3,
  1000
);
```

## ⚠️ 重要禁止事项

1. **禁止全局错误边界** - 请不要添加全局的错误边界
2. **禁止演示代码** - 生成生产可用的代码，不要添加开发或演示代码
3. **禁止修改配置** - 不要修改 package.json, vite.config.js 等配置文件
4. **禁止在应用目录外操作** - 严格限制在允许的开发区域内（_dev/, docs/, public/ 除外）
5. **禁止使用过时的路由语法** - 必须使用 React Router v5.3.4 语法
6. **禁止跳过错误处理** - 所有 AppSdk 调用必须使用 try-catch 和 reportError

## 🎯 编码原则总结

1. **入口文件**：使用 `app.jsx` 作为应用入口
2. **依赖管理**：优先使用内置库，必要时使用 remoteImport
3. **样式优先级**：CSS Modules > 全局样式
4. **AppSdk 优先**：优先使用 AppSdk 进行数据存储和原生能力调用
5. **错误上报**：在所有 try-catch 中使用 `reportError`
6. **图标使用**：根据状态选择合适样式（默认/轮廓/锐角）
7. **移动端优先**：应用必须完美适配移动端，提供原生 APP 体验
8. **性能优化**：考虑性能和用户体验，避免不必要的重渲染
9. **服务层架构**：使用服务层模式封装业务逻辑
10. **Hook 模式**：使用自定义 Hook 管理复杂状态
11. **统一状态管理**：使用 Zustand 管理全局状态

---

遵循这些完整的规范可确保代码符合 MorphixAI 平台要求，提供卓越的移动端用户体验。

