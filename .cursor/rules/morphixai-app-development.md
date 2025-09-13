---
description: MorphixAI 应用开发规范 - 基于官方文档
globs: ["src/app/**/*.jsx", "src/app/**/*.js", "src/app/**/*.ts", "src/app/**/*.tsx", "src/app/**/*.css"]
alwaysApply: true
---

# MorphixAI 应用开发规范

基于官方文档制定：
- [应用开发规范](https://app-shell.focusbe.com/docs/app-development-specification.md)
- [App SDK API 文档](https://app-shell.focusbe.com/docs/app-sdk-api.md)

## 📋 项目结构

### 应用入口
- 必须使用 `src/app/app.jsx` 作为应用入口文件
- 导出默认函数组件

### 标准结构
```
src/app/
├── app.jsx              # 应用入口文件（必需）
├── components/          # 组件目录
└── styles/             # CSS 模块样式
```

## 🛠 技术规范

### 核心依赖
```json
{
  "peerDependencies": {
    "react": "19.0.0",
    "@ionic/react": "8.6.2",
    "ionicons": "7.4.0"
  }
}
```

### 导入规范
```jsx
// React 核心导入
import React, { useState, useEffect } from 'react';

// Ionic React 组件导入
import { IonPage, IonContent, IonButton, IonCard, IonItem, IonInput } from '@ionic/react';

// MorphixAI 组件和库导入
import { PageHeader } from '@morphixai/components';
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';
import { fetch } from '@morphixai/fetch';

// 图标导入（根据状态选择合适样式）
import { home, homeOutline, camera, cameraOutline } from 'ionicons/icons';

// 样式导入
import styles from './styles/App.module.css';
```
你无需关心 @morphixai/ 系列库的安装，它会自动安装。
### 组件结构
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

## 📝 编码规范

### 命名约定
- 组件名：PascalCase（如 `UserCard`）
- 文件名：PascalCase.jsx（如 `UserCard.jsx`）
- 函数名：camelCase（如 `handleClick`）
- CSS 类名：camelCase（如 `buttonGroup`）
- 服务文件：camelCase.js（如 `todoService.js`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）

### 样式管理
- 使用 CSS Modules（`.module.css`）
- 文件命名：`ComponentName.module.css`
- 使用 Ionic CSS 变量
- 优先使用CSS Modules，避免全局样式冲突

### 错误处理规范
```jsx
// 必须使用 @morphixai/lib 的 reportError 进行错误上报
import { reportError } from '@morphixai/lib';

// 在所有异步操作中使用try-catch
const handleAsyncOperation = async () => {
  try {
    const result = await AppSdk.someModule.someMethod();
    return result;
  } catch (error) {
    // 上报错误，包含组件信息
    await reportError(error, 'JavaScriptError', {
      component: 'ComponentName',
      action: 'handleAsyncOperation'
    });
    // 返回合理的默认值或重新抛出
    return null;
  }
};
```

### 状态管理
```jsx
// 使用内置的Zustand进行全局状态管理
import { create } from 'zustand';

const useStore = create((set) => ({
  todos: [],
  loading: false,
  setTodos: (todos) => set({ todos }),
  setLoading: (loading) => set({ loading }),
}));
```

### 数据持久化
```jsx
// 使用AppSdk.appData进行数据持久化，而不是localStorage
const saveUserData = async (userData) => {
  try {
    const result = await AppSdk.appData.createData({
      collection: 'users',
      data: userData
    });
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'UserService'
    });
    // 降级到localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
  }
};
```

## 🚀 MorphixAI SDK 使用规范

### 正确的AppSdk导入和使用
```jsx
import AppSdk from '@morphixai/app-sdk';

// 相机功能
const takePhoto = async () => {
  try {
    const result = await AppSdk.camera.takePicture({
      quality: 0.8,
      aspect: [4, 3]
    });
    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      return image.base64; // 始终返回base64
    }
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'CameraService'
    });
  }
};

// 应用数据存储
const saveData = async (data) => {
  try {
    const result = await AppSdk.appData.createData({
      collection: 'user_data',
      data: data
    });
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'DataService'
    });
  }
};

// AI 聊天功能
const chatWithAI = async (message) => {
  try {
    const response = await AppSdk.AI.chat({
      messages: [
        { role: "user", content: message }
      ],
      options: { model: "openai/gpt-4o", temperature: 0.7 }
    });
    return response;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'AIService'
    });
  }
};

// 文件系统操作
const saveFileToAlbum = async (base64Data, filename) => {
  try {
    const result = await AppSdk.fileSystem.saveImageToAlbum({
      base64Data: base64Data,
      filename: filename
    });
    return result.success;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: 'FileService'
    });
  }
};
```

### 常用AppSdk模块一览
- **AppSdk.camera** - 相机和图库操作
- **AppSdk.location** - 地理位置服务
- **AppSdk.reminder** - 提醒和通知
- **AppSdk.AI** - AI聊天对话
- **AppSdk.appData** - 应用数据存储
- **AppSdk.calendar** - 日历事件管理
- **AppSdk.fileSystem** - 文件系统操作
- **AppSdk.fileUpload** - 云存储文件上传

## 📚 最佳实践示例

### 完整的组件示例
```jsx
// TodoApp.jsx - 展示完整的组件结构和最佳实践
import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonItem, IonInput } from '@ionic/react';
import { PageHeader } from '@morphixai/components';
import { reportError } from '@morphixai/lib';
import AppSdk from '@morphixai/app-sdk';
import { add, checkmark, trash } from 'ionicons/icons';
import styles from '../styles/TodoApp.module.css';

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(false);

    // 加载数据
    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        setLoading(true);
        try {
            const result = await AppSdk.appData.queryData({
                collection: 'todos',
                query: [] // 获取所有数据
            });
            setTodos(result);
        } catch (error) {
            await reportError(error, 'JavaScriptError', {
                component: 'TodoApp',
                action: 'loadTodos'
            });
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        
        try {
            const result = await AppSdk.appData.createData({
                collection: 'todos',
                data: {
                    text: newTodo,
                    completed: false,
                    createdAt: Date.now()
                }
            });
            setTodos([...todos, result]);
            setNewTodo('');
        } catch (error) {
            await reportError(error, 'JavaScriptError', {
                component: 'TodoApp',
                action: 'addTodo'
            });
        }
    };

    return (
        <IonPage>
            <PageHeader title="Todo 应用" />
            <IonContent className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.inputSection}>
                        <IonInput
                            value={newTodo}
                            placeholder="输入新的待办事项"
                            onIonInput={(e) => setNewTodo(e.detail.value)}
                            className={styles.input}
                        />
                        <IonButton 
                            onClick={addTodo}
                            className={styles.addButton}
                            disabled={loading}
                        >
                            添加
                        </IonButton>
                    </div>
                    
                    <div className={styles.todoList}>
                        {todos.map((todo) => (
                            <IonItem key={todo.id} className={styles.todoItem}>
                                <span className={todo.completed ? styles.completed : ''}>
                                    {todo.text}
                                </span>
                            </IonItem>
                        ))}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}
```

## 📚 参考文档

详细规范请参考：
- [应用开发规范](https://app-shell.focusbe.com/docs/app-development-specification.md)
- [App SDK API 文档](https://app-shell.focusbe.com/docs/app-sdk-api.md)
- 本地AppSdk API文档：`.cursor/rules/appsdk-api.md`
