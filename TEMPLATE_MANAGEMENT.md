# 模板管理指南

## 📦 概述

MorphixAI Code 现在使用独立的 GitHub 仓库管理模板，实现了模板的集中管理和版本控制。

## 🏗️ 架构

### 模板仓库
- **仓库**: https://github.com/Morphicai/morphixai-code-templates
- **分支**: `main`
- **结构**:
  ```
  morphixai-code-templates/
  └── react-ionic/
      ├── meta.json          # 模板元数据
      ├── package.json       # 模板包配置
      └── template/          # 模板内容
          ├── src/           # 源代码
          │   ├── app.jsx
          │   ├── components/
          │   └── styles/
          ├── docs/          # 文档
          ├── package.json.template
          ├── README.md
          └── ...
  ```

### 本地缓存
- **缓存位置**: `~/.morphixai/templates/`
- **更新策略**: 24 小时自动更新
- **工作原理**:
  1. 首次使用时从远程下载
  2. 后续使用缓存版本
  3. 缓存超过 24 小时自动更新

## 🚀 使用方法

### 创建项目
```bash
# 使用默认模板（react-ionic）
morphixai create my-app

# 指定模板
morphixai create my-app --template react-ionic
```

### 模板管理命令

#### 列出可用模板
```bash
morphixai template list
```

输出示例：
```
📦 Available Templates:

Repository: https://github.com/Morphicai/morphixai-code-templates
Branch: main

● react-ionic (default)
  MorphixAI mini-app template with React and Ionic
  Path: react-ionic
```

#### 清除缓存
```bash
morphixai template clear-cache
```

#### 更新缓存
```bash
morphixai template update
```

## 🔧 工作流程

### 用户视角

1. **首次使用**:
   ```bash
   morphixai create my-app
   # → 下载模板到本地缓存
   # → 从缓存复制到项目目录
   ```

2. **后续使用**:
   ```bash
   morphixai create another-app
   # → 使用缓存（如果未过期）
   # → 快速创建项目
   ```

3. **手动更新**:
   ```bash
   morphixai template update
   # → 清除缓存
   # → 下次使用时自动下载最新版本
   ```

### 开发者视角

CLI 始终从远程 GitHub 仓库获取模板（使用本地缓存优化性能）：

```bash
# 开发模式或全局安装模式都使用相同逻辑
morphixai create my-app
# → 检查本地缓存 ~/.morphixai/templates/
# → 如果缓存不存在或超过 24 小时，从 GitHub 下载
# → 保存到缓存目录
# → 复制到项目目录
```

**优点**：
- ✅ 开发和生产环境行为一致
- ✅ 模板更新立即生效（清除缓存后）
- ✅ 本地缓存提供良好性能
- ✅ 无需 npm 发布模板包

## 📝 配置文件

### templates-registry.json

```json
{
  "repository": "https://github.com/Morphicai/morphixai-code-templates",
  "branch": "main",
  "templates": [
    {
      "name": "react-ionic",
      "path": "react-ionic",
      "default": true,
      "displayName": "React + Ionic",
      "description": "MorphixAI mini-app template with React and Ionic"
    }
  ]
}
```

**字段说明**:
- `repository`: 模板仓库 URL
- `branch`: 使用的分支
- `templates`: 可用模板列表
  - `name`: 模板唯一标识符
  - `path`: 模板在仓库中的路径
  - `default`: 是否为默认模板
  - `displayName`: 显示名称
  - `description`: 模板描述

## 🎯 添加新模板

### 1. 在模板仓库中添加
```bash
cd morphixai-code-templates/
mkdir my-new-template
cd my-new-template/

# 创建模板结构
mkdir -p template/src/{components,styles}
# ... 添加模板文件
```

### 2. 更新注册表
编辑 `packages/cli/templates-registry.json`:

```json
{
  "templates": [
    {
      "name": "react-ionic",
      "path": "react-ionic",
      "default": true,
      "displayName": "React + Ionic",
      "description": "MorphixAI mini-app template with React and Ionic"
    },
    {
      "name": "my-new-template",
      "path": "my-new-template",
      "default": false,
      "displayName": "My New Template",
      "description": "Description of my new template"
    }
  ]
}
```

### 3. 提交到模板仓库
```bash
cd morphixai-code-templates/
git add my-new-template/
git commit -m "feat: add my-new-template"
git push origin main
```

### 4. 使用新模板
```bash
morphixai create my-app --template my-new-template
```

## 🔍 故障排查

### 问题：找不到模板
```
Error: Template "react-ionic" not found
```

**解决方案**:
1. 清除缓存: `morphixai template clear-cache`
2. 检查网络连接
3. 确认模板在注册表中配置正确

### 问题：下载失败
```
Error: Failed to download template
```

**解决方案**:
1. 检查 Git 是否已安装: `git --version`
2. 检查网络连接
3. 尝试手动克隆: `git clone https://github.com/Morphicai/morphixai-code-templates`

### 问题：缓存问题
**解决方案**:
```bash
# 清除所有缓存
morphixai template clear-cache

# 或手动删除
rm -rf ~/.morphixai/templates/
```

## 📊 优势

### ✅ 集中管理
- 所有模板在一个仓库中
- 统一版本控制
- 易于维护和更新

### ✅ 灵活部署
- 不依赖 npm 包
- 即时更新，无需重新发布 CLI
- 支持多个版本/分支

### ✅ 高效使用
- 本地缓存加速
- 自动更新机制
- 开发模式无需网络

### ✅ 易于扩展
- 添加新模板无需修改 CLI
- 支持社区贡献
- 清晰的目录结构

## 🔗 相关链接

- [模板仓库](https://github.com/Morphicai/morphixai-code-templates)
- [CLI 仓库](https://github.com/Morphicai/morphixai-code)
- [文档](https://github.com/Morphicai/morphixai-code#readme)

