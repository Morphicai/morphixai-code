# 远程提示词获取功能说明

## 概述

MorphixAI CLI 现在支持从远程 API 获取提示词，同时保持本地回退机制，确保在任何情况下都能正常工作。

## 🌐 远程获取

### 支持的提示词

目前只有 **完整开发指南（DEVELOPMENT_GUIDE.md）** 支持从远程获取：

| 提示词 | 文件 | 来源 | 远程 URL |
|--------|------|------|----------|
| docs | DEVELOPMENT_GUIDE.md | 🌐 远程（回退本地） | https://api.baibian.app/prompts/public?name=mophixai_code_prompt&version=1 |
| cursor | .cursorrules | 📦 本地 | - |
| claude | CLAUDE.md | 📦 本地 | - |
| readme | README.md | 📦 本地 | - |

### 为什么只有 docs 从远程获取？

1. **内容最全面**：DEVELOPMENT_GUIDE.md 包含 1330+ 行的完整开发规范
2. **更新频率高**：开发规范可能经常更新
3. **所有编辑器共享**：所有 AI 编辑器都使用这份文档
4. **其他文件较小**：cursor/claude/readme 都很小（27-159 行），本地即可

## 🔄 工作流程

### 安装时的流程

```
开始安装 docs
    ↓
尝试从远程获取
    ↓
  成功? ──Yes→ 保存到 docs/DEVELOPMENT_GUIDE.md
    │
    No (失败)
    ↓
  显示警告信息
    ↓
自动回退到本地
    ↓
从模板复制文件
    ↓
  完成安装
```

### 示例输出

**远程成功：**
```bash
morphixai create my-app

✔ Installing AI prompts...
📦 Installed prompts:
   ✅ docs (from remote)
   ✅ readme
   ✅ cursor
   ✅ claude
```

**远程失败，本地回退：**
```bash
morphixai create my-app

⚠️  Remote fetch failed for docs, falling back to local: Failed to fetch
✔ Installing AI prompts...
📦 Installed prompts:
   ✅ docs (from local fallback)
   ✅ readme
   ✅ cursor
   ✅ claude
```

## ⚙️ 配置说明

### prompts-registry.json

```json
{
  "version": "1.0.0",
  "prompts": {
    "docs": {
      "version": "1.0.0",
      "description": "Complete development guide",
      "files": ["DEVELOPMENT_GUIDE.md"],
      "path": "docs",
      "remoteUrl": "https://api.baibian.app/prompts/public?name=mophixai_code_prompt&version=1"
    }
  }
}
```

**关键字段：**
- `remoteUrl`: 远程 API 地址（存在则尝试远程获取）
- `files`: 要保存的文件列表
- `path`: 保存的目标目录

### .promptsrc

```json
{
  "version": "1.0.0",
  "source": "mixed",
  "editors": {
    "docs": {
      "enabled": true,
      "version": "1.0.0",
      "path": "docs",
      "source": "remote"
    },
    "cursor": {
      "enabled": true,
      "version": "1.0.0",
      "path": "",
      "source": "local"
    }
  }
}
```

**source 字段说明：**
- `remote`: 从远程获取
- `local`: 从本地获取
- `mixed`: 混合模式（部分远程，部分本地）

## 🛡️ 可靠性保证

### 1. 自动回退机制

```javascript
// 伪代码
try {
  content = await fetchFromRemote(url);
  saveToFile(content);
  console.log('✅ 远程获取成功');
} catch (error) {
  console.warn('⚠️ 远程失败，使用本地版本');
  copyFromLocalTemplate();
  console.log('✅ 本地回退成功');
}
```

### 2. 失败场景

远程获取在以下情况会失败并回退：
- ❌ 网络连接失败
- ❌ API 服务器不可用
- ❌ HTTP 错误（4xx, 5xx）
- ❌ 响应超时
- ❌ 响应内容无效

所有情况都会自动回退到本地，**不会导致安装失败**。

### 3. 本地模板保证

```
packages/templates/react-ionic/template/
└── docs/
    └── DEVELOPMENT_GUIDE.md  ← 始终存在，作为回退
```

本地模板始终包含完整的 DEVELOPMENT_GUIDE.md，确保即使完全离线也能使用。

## 🔧 技术实现

### fetcher.js - 远程获取函数

```javascript
export async function fetchRemotePrompt(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch remote prompt: ${error.message}`);
  }
}
```

### installer.js - 远程安装逻辑

```javascript
// 如果有远程 URL，尝试从远程安装
if (config.remoteUrl) {
  try {
    await installEditorPromptsFromRemote(projectPath, key, config);
    installedEditors.push(key);
  } catch (error) {
    console.warn(`⚠️  Remote fetch failed for ${key}, falling back to local`);
    await installEditorPromptsFromLocal(projectPath, key, config);
    installedEditors.push(key);
  }
} else {
  // 没有远程 URL，直接从本地安装
  await installEditorPromptsFromLocal(projectPath, key, config);
  installedEditors.push(key);
}
```

## 🎯 使用场景

### 场景 1：正常联网环境

```bash
morphixai create my-app
# ✅ docs 从远程获取（最新版本）
# ✅ 其他从本地复制
```

**优势：**
- 获取最新的开发规范
- 无需更新 CLI 包
- 内容实时同步

### 场景 2：离线环境

```bash
morphixai create my-app
# ⚠️  远程获取失败
# ✅ 自动回退到本地版本
# ✅ 安装继续完成
```

**优势：**
- 完全不影响使用
- 自动回退透明
- 本地版本可用

### 场景 3：API 服务器维护

```bash
morphixai create my-app
# ⚠️  API 返回 503
# ✅ 自动使用本地版本
# ✅ 项目创建成功
```

**优势：**
- 不依赖远程服务可用性
- 始终能创建项目

## 📊 版本管理

### 远程 API 版本

```
https://api.baibian.app/prompts/public?name=mophixai_code_prompt&version=1
                                                                      ↑
                                                                    版本号
```

- 当前使用 `version=1`
- 未来可以通过修改版本号获取不同版本
- 注册表中的 `version` 字段与 API 版本对应

### 版本检查

```bash
morphixai prompts check

✅ docs       v1.0.0 (latest, source: remote)
✅ cursor     v1.0.0 (latest, source: local)
✅ claude     v1.0.0 (latest, source: local)
✅ readme     v1.0.0 (latest, source: local)
```

## 💡 最佳实践

### 1. 定期更新

```bash
# 定期运行以获取最新的远程内容
morphixai prompts update
```

### 2. 验证内容

创建项目后，检查文档是否正确：
```bash
cat docs/DEVELOPMENT_GUIDE.md | head -20
```

### 3. 监控远程状态

如果看到频繁的回退警告，可能需要检查：
- 网络连接
- API 服务状态
- 防火墙设置

### 4. 开发环境测试

在开发 CLI 时，可以通过修改 `remoteUrl` 来测试不同的远程源：

```json
{
  "docs": {
    "remoteUrl": "http://localhost:3000/test-prompt"
  }
}
```

## 🔍 故障排查

### 问题 1：总是使用本地版本

**症状：** 从不从远程获取，总是回退

**可能原因：**
- 网络问题
- API 地址错误
- 防火墙阻止

**排查：**
```bash
# 测试 API 可达性
curl "https://api.baibian.app/prompts/public?name=mophixai_code_prompt&version=1"
```

### 问题 2：安装失败

**症状：** 安装完全失败，无法创建项目

**可能原因：**
- 本地模板文件缺失
- 文件权限问题

**排查：**
```bash
# 检查本地模板
ls -la packages/templates/react-ionic/template/docs/DEVELOPMENT_GUIDE.md
```

### 问题 3：内容不完整

**症状：** 生成的文件内容不完整

**可能原因：**
- API 返回不完整
- 网络传输中断

**解决：**
```bash
# 强制使用本地版本
# 临时移除 remoteUrl 字段，或
morphixai prompts install
```

## 📚 相关文档

- [CLI 提示词完整指南](CLI_PROMPTS_GUIDE.md)
- [提示词快速参考](PROMPTS_QUICK_REFERENCE.md)

## 🎉 总结

远程提示词获取功能提供了：

✅ **最新内容**：自动获取最新的开发规范  
✅ **自动回退**：失败时自动使用本地版本  
✅ **完全可靠**：任何情况下都能正常工作  
✅ **透明切换**：用户无需关心来源  
✅ **灵活配置**：可以轻松添加更多远程提示词  

这是一个既现代化又可靠的解决方案！🚀

