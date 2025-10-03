# 📝 提示词管理说明

## 🎯 设计理念

MorphixAI CLI 的提示词管理系统采用**完全本地化**的设计：
- ✅ 所有提示词存储在本地模板中
- ✅ 不依赖远程服务器
- ✅ 更快、更稳定、更可靠

## 📦 提示词来源

提示词文件存储在 CLI 包的模板中：

```
packages/
└── templates/
    └── react-ionic/
        └── template/
            ├── .cursor/rules/       # Cursor AI 提示词
            │   ├── README.md
            │   ├── morphixai-app-development.md
            │   ├── file-protection.md
            │   ├── docs-context.md
            │   ├── appsdk-api.md
            │   ├── appsdk-best-practices.md
            │   ├── code_standards.md
            │   └── icons-usage.md
            └── CLAUDE.md            # Claude Code 提示词（根目录）
```

## 🔧 可用命令

### 1. 检查提示词版本

```bash
morphixai prompts check
```

**功能**：
- 检查项目中已安装的提示词版本
- 与注册表中的版本进行对比
- 显示可用更新

**输出示例**：
```
✔ Prompts version check completed

📋 Prompts Status (Local):

✅ cursor     v1.0.0 (latest)
✅ claude     v1.0.0 (latest)
```

### 2. 更新提示词

```bash
morphixai prompts update
```

**功能**：
- 从本地模板复制最新版本的提示词
- 覆盖项目中的旧版本
- 更新 `.promptsrc` 配置文件

**输出示例**：
```
✔ Prompts updated successfully

🔄 Updated prompts:

   ✅ cursor
   ✅ claude
```

### 3. 安装提示词

```bash
# 安装所有编辑器的提示词
morphixai prompts install

# 只安装 Cursor 提示词
morphixai prompts install --editor cursor

# 只安装 Claude 提示词
morphixai prompts install --editor claude
```

**功能**：
- 从本地模板复制提示词到项目
- 创建 `.promptsrc` 配置文件
- 支持选择性安装

## 📋 提示词注册表

注册表文件：`packages/cli/prompts-registry.json`

```json
{
  "version": "1.0.0",
  "description": "MorphixAI AI Prompts Registry - All prompts are stored locally in templates",
  "prompts": {
    "cursor": {
      "version": "1.0.0",
      "description": "Cursor AI prompts for MorphixAI development",
      "files": [...],
      "path": ".cursor/rules"
    },
    "claude": {
      "version": "1.0.0",
      "description": "Claude Code prompts for MorphixAI development",
      "files": ["CLAUDE.md"],
      "path": ""
    }
  }
}
```

## 🔄 工作流程

### 用户项目的提示词管理

1. **创建项目时自动安装**：
   ```bash
   morphixai create my-app
   # 提示词文件自动从模板复制到新项目
   ```

2. **手动更新提示词**：
   ```bash
   cd my-app
   morphixai prompts check   # 检查更新
   morphixai prompts update  # 应用更新
   ```

3. **重新安装提示词**：
   ```bash
   morphixai prompts install  # 强制重新安装
   ```

### 维护者更新提示词

1. **更新模板中的提示词文件**：
   ```bash
   # 编辑文件
   vim packages/templates/react-ionic/template/.cursor/rules/xxx.md
   ```

2. **更新版本号**：
   ```bash
   # 编辑注册表
   vim packages/cli/prompts-registry.json
   # 将版本号从 1.0.0 改为 1.1.0
   ```

3. **发布新版本 CLI**：
   ```bash
   pnpm changeset
   # 选择 minor 版本更新
   # 描述：Updated AI prompts to v1.1.0
   ```

## 📁 项目配置文件

每个使用提示词的项目都会有一个 `.promptsrc` 文件：

```json
{
  "version": "1.0.0",
  "source": "local",
  "lastUpdated": "2025-10-03T12:00:00.000Z",
  "editors": {
    "cursor": {
      "enabled": true,
      "version": "1.0.0",
      "path": ".cursor/rules"
    },
    "claude": {
      "enabled": true,
      "version": "1.0.0",
      "path": ""
    }
  }
}
```

## 🎨 优势

### 与远程获取相比

| 特性 | 本地提示词 | 远程提示词 |
|------|----------|----------|
| **速度** | ⚡ 即时复制 | 🐌 需要网络请求 |
| **稳定性** | ✅ 100% 可靠 | ⚠️ 依赖网络 |
| **离线使用** | ✅ 完全支持 | ❌ 需要联网 |
| **版本一致** | ✅ CLI 版本绑定 | ⚠️ 可能不同步 |
| **调试** | ✅ 易于本地调试 | ⚠️ 难以调试 |

## 🔍 实现细节

### 文件结构

```
packages/cli/
├── src/
│   ├── commands/
│   │   └── prompts.js           # 命令入口
│   └── prompts/
│       ├── fetcher.js            # 读取注册表和配置
│       └── installer.js          # 安装和更新逻辑
├── prompts-registry.json         # 提示词注册表
└── templates-registry.json       # 模板注册表
```

### 关键函数

**fetcher.js**:
- `fetchPromptsRegistry()` - 读取本地注册表
- `checkPromptsVersion()` - 检查版本更新
- `readLocalPromptsConfig()` - 读取项目配置
- `writeLocalPromptsConfig()` - 写入项目配置

**installer.js**:
- `installPrompts()` - 安装提示词
- `updatePrompts()` - 更新提示词
- `installEditorPromptsFromLocal()` - 从模板复制文件

## 🚀 使用示例

### 场景 1: 新项目自动安装

```bash
$ morphixai create my-app
✔ Project created successfully
✔ Installing prompts...
   ✅ cursor
   ✅ claude
```

### 场景 2: 检查更新

```bash
$ cd my-app
$ morphixai prompts check
✔ Prompts version check completed

📋 Prompts Status (Local):

⚠️  cursor     v1.0.0 → v1.1.0 available
✅ claude     v1.0.0 (latest)

💡 Run morphixai prompts update to update
```

### 场景 3: 应用更新

```bash
$ morphixai prompts update
✔ Prompts updated successfully

🔄 Updated prompts:

   ✅ cursor
```

### 场景 4: 选择性安装

```bash
# 只安装 Cursor 提示词
$ morphixai prompts install --editor cursor
✔ cursor prompts installed successfully

📦 Installed prompts:

   ✅ cursor
```

## 📝 开发注意事项

1. **更新提示词内容**：
   - 直接编辑 `packages/templates/react-ionic/template/` 下的文件
   - 不需要修改安装逻辑

2. **更新版本号**：
   - 修改 `prompts-registry.json` 中的版本号
   - 遵循语义化版本规范

3. **测试**：
   ```bash
   # 创建测试项目
   morphixai create test-prompts
   cd test-prompts
   
   # 测试检查
   morphixai prompts check
   
   # 测试更新
   morphixai prompts update
   ```

## 🔧 故障排查

### Q: 提示词安装失败

**错误**：`Template prompts not found`

**解决**：
- 确保模板文件存在
- 检查 `packages/templates/react-ionic/template/` 目录

### Q: 版本检查显示错误

**解决**：
- 检查 `.promptsrc` 文件格式
- 删除 `.promptsrc` 后重新安装

### Q: 更新后文件未变化

**解决**：
- 使用 `--force` 标志强制更新
- 手动删除旧文件后重新安装

---

**总结**：本地化提示词管理确保了更快、更稳定、更可靠的用户体验！

