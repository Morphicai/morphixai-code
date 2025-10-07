# @morphixai/code

## 1.1.10

### Patch Changes

- 02ba360: support resotre command

## 1.1.9

### Patch Changes

- 6695362: add npm doc

## 1.1.8

### Patch Changes

- 98e5626: kill port before start

## 1.1.7

### Patch Changes

- 040a025: fix dev error

## 1.1.6

### Patch Changes

- f5408c6: fix react-dom import error

## 1.1.5

### Patch Changes

- 909a027: fix error

## 1.2.0

### Minor Changes

- e1f65b4: 自动打开浏览器功能

  **新功能**：

  - 🚀 运行 `morphixai dev` 后自动打开浏览器
  - ⚙️ 添加 `--no-open` 选项禁用自动打开
  - 📦 添加 `open` 包依赖

  **使用方式**：

  ```bash
  # 启动开发服务器并自动打开浏览器（默认）
  morphixai dev

  # 启动开发服务器但不打开浏览器
  morphixai dev --no-open
  ```

  **用户体验**：

  - ✅ 启动更流畅，无需手动复制粘贴 URL
  - ✅ 支持所有主流操作系统
  - ✅ 打开失败时显示友好提示

- e1f65b4: 完全转向远程模板管理，移除本地模板依赖

  **重大改进**：

  - 🔄 完全使用远程 GitHub 仓库管理模板
  - 🗑️ 移除本地 monorepo 模板路径依赖
  - 💾 保留智能缓存机制（24 小时更新策略）
  - 🛡️ 增强提示词安装容错性，失败不会阻止项目创建
  - ✨ 开发和生产环境行为完全一致

  **架构优化**：

  - 简化 `copyTemplate` 逻辑，移除本地路径检查
  - 优化 `getTemplatePromptsPath`，要求必须提供模板路径
  - 提示词安装失败时优雅降级，使用模板内置文件

  **用户体验**：

  - ✅ 始终使用最新的官方模板
  - ✅ 本地缓存保证快速创建
  - ✅ 模板更新立即生效（清除缓存后）
  - ✅ 项目创建更加稳定可靠

## 1.1.3

### Patch Changes

- 05ce1fc: fix install prompt faild

## 1.1.2

### Patch Changes

- 5eb13fe: fix app create

## 1.1.1

### Patch Changes

- c980302: use remote template

## 1.1.0

### Minor Changes

- 709f5d9: publish @morphixai/code
