# 提示词管理快速参考

## 📋 命令速查表

| 命令 | 功能 | 使用场景 |
|-----|------|---------|
| `morphixai prompts check` | 检查版本 | 查看是否有更新 |
| `morphixai prompts update` | 更新提示词 | CLI 更新后同步 |
| `morphixai prompts install` | 安装所有 | 重新安装所有提示词 |
| `morphixai prompts install --editor=cursor` | 安装 Cursor | 只安装特定编辑器 |

## 📦 提示词文件列表

| 文件 | 行数 | 位置 | 作用 |
|-----|------|------|------|
| `.cursorrules` | 27 | 根目录 | Cursor 编辑器规范 |
| `CLAUDE.md` | 50 | 根目录 | Claude Code 规范 |
| `README.md` | 159 | 根目录 | 项目说明文档 |
| `DEVELOPMENT_GUIDE.md` | 1330 | `docs/` | 完整开发指南 |
| `.promptsrc` | - | 根目录 | 配置文件（自动生成） |

## 🔄 典型工作流

### 创建新项目
```bash
morphixai create my-app
# ✅ 自动安装所有提示词
```

### 检查更新
```bash
cd my-app
morphixai prompts check
```

### 应用更新
```bash
morphixai prompts update
```

## ⚙️ 配置文件结构

### `.promptsrc`
```json
{
  "version": "1.0.0",
  "source": "mixed",
  "lastUpdated": "2025-01-01T00:00:00Z",
  "editors": {
    "cursor": {
      "enabled": true,
      "version": "1.0.0",
      "path": ""
    },
    "claude": {
      "enabled": true,
      "version": "1.0.0",
      "path": ""
    },
    "readme": {
      "enabled": true,
      "version": "1.0.0",
      "path": ""
    },
    "docs": {
      "enabled": true,
      "version": "1.0.0",
      "path": "docs",
      "source": "remote"
    }
  }
}
```

## 🎯 核心特点

### 远程支持
- ✅ 完整文档从远程 API 获取
- ✅ 自动回退到本地模板
- ✅ 其他文件直接本地复制

### 自动化
- ✅ 创建项目时自动安装
- ✅ 自动检测版本更新
- ✅ 增量更新（只更新变化的文件）

### 始终安装的核心文件
- `docs/DEVELOPMENT_GUIDE.md` - 完整开发指南
- `README.md` - 项目说明

无论选择哪个编辑器，这两个核心文件都会被安装。

## 📊 版本管理

### 版本号规范
```
1.0.0
│ │ │
│ │ └─ 修订号（bug 修复）
│ └─── 次版本号（新功能）
└───── 主版本号（不兼容变更）
```

### 版本检查输出

**全部最新：**
```
✅ cursor     v1.0.0 (latest)
✅ claude     v1.0.0 (latest)
✅ readme     v1.0.0 (latest)
✅ docs       v1.0.0 (latest, remote)
```

**有更新：**
```
⚠️  cursor     v0.9.0 → v1.0.0 available
💡 Run morphixai prompts update to update
```

## 🛠️ 常用操作

### 重新安装所有提示词
```bash
morphixai prompts install
```

### 只使用 Cursor
```bash
morphixai prompts install --editor=cursor
```

### 只使用 Claude
```bash
morphixai prompts install --editor=claude
```

## 📁 文件位置

### 模板源文件
```
packages/templates/react-ionic/template/
├── .cursorrules
├── CLAUDE.md
├── README.md
└── docs/DEVELOPMENT_GUIDE.md
```

### 项目中的文件
```
my-app/
├── .cursorrules        ← 从模板复制
├── CLAUDE.md           ← 从模板复制
├── README.md           ← 从模板复制
├── .promptsrc          ← 自动生成
└── docs/
    └── DEVELOPMENT_GUIDE.md  ← 从模板复制
```

## 💡 最佳实践

1. **定期检查**：每月运行 `morphixai prompts check`
2. **CLI 更新后同步**：更新 CLI 包后运行 `update`
3. **提交到版本控制**：所有提示词文件都应提交
4. **团队统一**：确保团队使用相同版本的提示词

## 🔗 相关文档

- 完整指南：[CLI_PROMPTS_GUIDE.md](CLI_PROMPTS_GUIDE.md)
- 远程获取：[REMOTE_PROMPTS_GUIDE.md](REMOTE_PROMPTS_GUIDE.md)
- 提示词管理：[packages/cli/PROMPTS_MANAGEMENT.md](packages/cli/PROMPTS_MANAGEMENT.md)

---

**需要详细信息？** 查看 [CLI_PROMPTS_GUIDE.md](CLI_PROMPTS_GUIDE.md)

