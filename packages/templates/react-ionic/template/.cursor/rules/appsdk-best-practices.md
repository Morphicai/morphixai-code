---
description: MorphixAI AppSdk 最佳实践和常见模式
globs: ["src/app/**/*.jsx", "src/app/**/*.js", "src/app/**/*.ts", "src/app/**/*.tsx"]
alwaysApply: true
---

# MorphixAI AppSdk 最佳实践

基于实际项目经验总结的 AppSdk 使用最佳实践和常见开发模式。

## 🎯 核心原则

### 1. 错误处理优先
所有 AppSdk 调用必须包装在 try-catch 中，并使用 `@morphixai/lib` 的 `reportError` 上报：

```jsx
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';

const safeApiCall = async (operation, component) => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', {
      component: component,
      timestamp: Date.now()
    });
    return null; // 返回合理的默认值
  }
};
```

### 2. 数据持久化策略
优先使用 AppSdk.appData，本地存储作为降级方案：

```jsx
const saveData = async (collection, data) => {
  try {
    // 主要方案：使用 AppSdk
    const result = await AppSdk.appData.createData({
      collection: collection,
      data: data
    });
    return result;
  } catch (error) {
    await reportError(error, 'JavaScriptError', { component: 'DataService' });
    
    // 降级方案：本地存储
    try {
      localStorage.setItem(`${collection}_backup`, JSON.stringify(data));
      return { id: Date.now(), ...data };
    } catch (localError) {
      console.error('本地存储也失败:', localError);
      return null;
    }
  }
};
```

## 📚 常用模块实践

### 相机和图库模块

```jsx
// 统一的图片选择服务
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
}
```

### 应用数据模块

```jsx
// 通用数据访问层
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
```

### AI 对话模块

```jsx
// AI 聊天服务
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
}
```

### 文件系统模块

```jsx
// 文件操作服务
export class FileService {
  static async saveImageToAlbum(base64Data, filename) {
    try {
      const result = await AppSdk.fileSystem.saveImageToAlbum({
        base64Data,
        filename: filename || `image_${Date.now()}.jpg`
      });
      return result.success;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'FileService',
        action: 'saveImageToAlbum' 
      });
      return false;
    }
  }

  static async downloadFile(url, filename) {
    try {
      const result = await AppSdk.fileSystem.downloadFile({
        url,
        filename
      });
      return result;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'FileService',
        action: 'downloadFile',
        url 
      });
      return { success: false, error: error.message };
    }
  }

  static async shareFile(fileUri, options = {}) {
    try {
      const result = await AppSdk.fileSystem.shareFile({
        fileUri,
        dialogTitle: options.title || '分享文件',
        mimeType: options.mimeType
      });
      return result.success;
    } catch (error) {
      await reportError(error, 'JavaScriptError', { 
        component: 'FileService',
        action: 'shareFile' 
      });
      return false;
    }
  }
}
```

## 🔧 实际应用模式

### 1. 服务层模式
创建专门的服务类来封装 AppSdk 调用：

```jsx
// services/TodoService.js
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

### 2. Hook 模式
使用自定义 Hook 管理 AppSdk 状态：

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

  useEffect(() => {
    loadTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    refresh: loadTodos
  };
};
```

### 3. 状态管理模式
使用 Zustand 管理全局状态：

```jsx
// stores/appStore.js
import { create } from 'zustand';
import { TodoService } from '../services/TodoService';

export const useAppStore = create((set, get) => ({
  todos: [],
  user: null,
  loading: false,

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
    const updated = await TodoService.updateTodo(id, updates);
    if (updated) {
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id ? updated : todo
        )
      }));
    }
  }
}));
```

## ⚡ 性能优化

### 1. 批量操作
```jsx
// 批量创建数据
const batchCreate = async (collection, items) => {
  const results = [];
  for (const item of items) {
    const result = await DataService.create(collection, item);
    if (result) results.push(result);
  }
  return results;
};
```

### 2. 缓存策略
```jsx
// 简单缓存实现
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
}
```

## 🚨 错误处理模式

### 1. 统一错误边界
在组件级别处理错误，不使用全局错误边界：

```jsx
const SafeComponent = ({ children, fallback }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setError(error);
      reportError(error, 'JavaScriptError', {
        component: 'SafeComponent'
      });
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);

  if (error) {
    return fallback || <div>出现错误，请刷新重试</div>;
  }

  return children;
};
```

### 2. 重试机制
```jsx
const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
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
```

遵循这些最佳实践可以确保 AppSdk 的正确使用，提高应用的稳定性和用户体验。