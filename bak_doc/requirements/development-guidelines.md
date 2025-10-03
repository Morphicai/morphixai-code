# AI 开发指导原则

## 代码生成规范

### 组件创建要求
当用户要求创建组件时，AI 应该：

1. **自动创建文件结构**
   ```
   src/app/components/ComponentName.jsx
   src/app/styles/ComponentName.module.css
   ```

2. **使用标准模板**
   ```jsx
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

3. **自动生成样式**
   ```css
   .container {
       margin: 16px 0;
       border-radius: 12px;
       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
   }
   ```

### 功能实现要求

#### 状态管理
- 优先使用 `useState` 进行本地状态管理
- 复杂状态使用 `useReducer`
- 副作用使用 `useEffect`

#### 错误处理
- 所有异步操作必须包含 try-catch
- 提供用户友好的错误提示
- 记录错误到控制台

#### 性能优化
- 合理使用 `useMemo` 和 `useCallback`
- 避免不必要的重渲染
- 按需导入组件和工具

### UI/UX 规范

#### 移动端优先
- 所有组件必须适配移动端
- 使用响应式设计
- 考虑触摸交互

#### Ionic 组件使用
- 优先使用 Ionic 组件
- 保持设计一致性
- 遵循 Material Design 原则

#### 样式规范
- 使用 CSS Modules
- 遵循 BEM 命名规范
- 使用 Ionic CSS 变量

## AI 响应模式

### 代码生成流程
1. **理解需求** - 分析用户的功能需求
2. **设计方案** - 确定技术实现方案
3. **生成代码** - 创建符合规范的代码
4. **提供说明** - 解释实现思路和使用方法

### 交互方式
- 使用友好的中文回复
- 提供清晰的代码结构说明
- 给出使用示例和注意事项
- 主动提出优化建议

### 质量保证
- 确保代码语法正确
- 验证导入路径正确
- 检查样式类名匹配
- 确保响应式设计

## 常见场景处理

### 用户说："创建一个登录表单"
AI 应该：
1. 创建 `LoginForm.jsx` 组件
2. 包含用户名、密码输入框
3. 添加登录按钮和表单验证
4. 创建对应的样式文件
5. 提供表单提交处理逻辑

### 用户说："添加用户列表功能"
AI 应该：
1. 创建 `UserList.jsx` 组件
2. 使用 `IonList` 和 `IonItem` 组件
3. 添加加载状态和错误处理
4. 实现搜索和分页功能
5. 优化性能和用户体验

### 用户说："集成相机功能"
AI 应该：
1. 导入 MorphixAI Camera API
2. 添加权限检查逻辑
3. 实现拍照和相册选择
4. 添加图片预览功能
5. 处理各种错误情况

## 禁止行为

### 绝对不允许
- ❌ 修改 `package.json`
- ❌ 修改 `vite.config.js`
- ❌ 在 `src/app/` 外创建文件
- ❌ 修改 `src/_dev/` 目录
- ❌ 使用非 MorphixAI 兼容的依赖

### 代码质量要求
- ❌ 生成有语法错误的代码
- ❌ 使用已废弃的 API
- ❌ 忽略错误处理
- ❌ 生成不安全的代码

这些指导原则确保 AI 生成的代码始终符合项目要求和最佳实践。
