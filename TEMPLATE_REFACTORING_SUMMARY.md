# React-Ionic 模板重构总结

## 优化内容

### 1. 提示词管理优化 ✅

**之前的方案：**
- Cursor 使用 `.cursor/rules/` 目录，包含多个 md 文件
- Claude 使用一个巨大的 `CLAUDE.md` 文件（1500+ 行）
- 两个编辑器的提示词内容重复

**新方案：**
- 创建统一的 `docs/DEVELOPMENT_GUIDE.md` 作为完整开发指南
- `.cursorrules` 和 `CLAUDE.md` 简化为引用文档，只包含快速参考
- 所有编辑器共享同一份完整文档，维护更简单

**文件结构：**
```
template/
├── docs/
│   └── DEVELOPMENT_GUIDE.md    # 完整开发指南（所有编辑器共享）
├── .cursorrules                # Cursor：强调阅读 @DEVELOPMENT_GUIDE.md
└── CLAUDE.md                   # Claude：强调阅读完整文档
```

**提示词文件特点：**
- 极简化，只有 20-50 行
- 强调必须完整阅读 `DEVELOPMENT_GUIDE.md`
- 列出核心约束和快速要点
- 去除了 `_dev/` 目录的限制（新结构中已不存在）

### 2. 目录结构优化 ✅

**之前的方案：**
```
template/
├── src/
│   ├── app.jsx
│   ├── components/
│   ├── styles/
│   └── _dev/
└── public/
```

**新方案（去除 src 层级）：**
```
template/
├── app.jsx                     # 应用入口（直接在根目录）
├── components/                 # 组件目录
├── styles/                     # 样式目录
├── _dev/                       # CLI 内部目录
├── docs/                       # 文档目录
└── public/                     # 静态资源
```

**优势：**
- 更简洁的目录结构
- 减少嵌套层级
- 文件路径更短
- 更符合现代前端项目习惯

### 3. CLI 工具适配 ✅

**更新的文件：**

1. **`packages/cli/src/utils/app-files.js`**
   - 更新 `generateAppFiles()`: 从根目录读取而非 `src/`
   - 更新 `readDirectoryRecursive()`: 添加更多排除规则（docs, public 等）
   - 更新 `watchAppFiles()`: 监听根目录，排除不需要的目录

2. **`packages/cli/src/commands/dev.js`**
   - 更新用户文件路径：`src/_dev/app-files.js` → `_dev/app-files.js`

3. **`packages/cli/src/prompts/installer.js`**
   - 更新提示词安装逻辑，始终安装 docs
   - 支持新的提示词结构

4. **`packages/cli/prompts-registry.json`**
   - 版本升级到 2.0.0
   - 添加 docs 配置
   - 更新 cursor 和 claude 配置

### 4. 配置文件更新 ✅

**`.promptsrc` 更新：**
```json
{
  "version": "2.0.0",
  "source": "local",
  "editors": {
    "cursor": {
      "enabled": true,
      "version": "2.0.0",
      "path": ""
    },
    "claude": {
      "enabled": true,
      "version": "2.0.0",
      "path": ""
    },
    "docs": {
      "enabled": true,
      "version": "2.0.0",
      "path": "docs"
    }
  }
}
```

## 更新的文件清单

### 模板文件
- ✅ `packages/templates/react-ionic/template/` - 目录结构重构
- ✅ `packages/templates/react-ionic/template/docs/DEVELOPMENT_GUIDE.md` - 新增（1300+ 行完整指南）
- ✅ `packages/templates/react-ionic/template/.cursorrules` - 极简化（27 行，强调阅读完整文档）
- ✅ `packages/templates/react-ionic/template/CLAUDE.md` - 极简化（51 行，强调阅读完整文档）
- ✅ `packages/templates/react-ionic/template/.promptsrc` - 更新版本到 2.0.0
- ❌ `packages/templates/react-ionic/template/.cursor/` - 删除旧目录
- ❌ `packages/templates/react-ionic/template/src/` - 删除，改为根目录

### CLI 工具
- ✅ `packages/cli/src/utils/app-files.js` - 适配新目录结构
- ✅ `packages/cli/src/commands/dev.js` - 更新路径
- ✅ `packages/cli/src/prompts/installer.js` - 适配新提示词方案
- ✅ `packages/cli/prompts-registry.json` - 更新配置

### 示例项目
- ✅ `examples/demo-app/` - 升级到新目录结构
- ✅ `examples/demo-app/docs/` - 添加文档
- ✅ `examples/demo-app/.cursorrules` - 添加
- ✅ `examples/demo-app/CLAUDE.md` - 更新

## 向后兼容性

**破坏性更改：**
1. 旧项目中的 `src/` 目录结构需要迁移
2. 提示词文件位置改变

**迁移步骤：**
```bash
# 在旧项目中执行
mv src/app.jsx app.jsx
mv src/components components
mv src/styles styles
mv src/_dev _dev
rm -rf src

# 更新提示词
morphixai prompts update --force
```

## 优势总结

1. **维护更简单**：只需维护一份完整文档（1300+ 行 DEVELOPMENT_GUIDE.md）
2. **提示词极简**：.cursorrules 和 CLAUDE.md 只有 20-50 行，强调阅读完整文档
3. **结构更清晰**：减少目录嵌套，去除 src 层级
4. **扩展更容易**：添加新编辑器只需创建一个简短的引用文件
5. **版本控制更好**：文件更少，变更更清晰
6. **用户体验更好**：更简洁的项目结构，明确的文档指引
7. **无文件限制**：新结构中没有 _dev 目录限制，开发更自由

## 测试建议

1. 创建新项目测试：
   ```bash
   morphixai create test-app
   cd test-app
   npm run dev
   ```

2. 验证提示词安装：
   ```bash
   # 检查文件是否存在
   ls -la docs/DEVELOPMENT_GUIDE.md
   ls -la .cursorrules
   ls -la CLAUDE.md
   ```

3. 验证 CLI 工具：
   ```bash
   # 启动开发服务器
   npm run dev
   # 检查 _dev/app-files.js 是否正确生成
   ```

4. 验证文件监听：
   - 修改 `app.jsx`
   - 检查 `_dev/app-files.js` 是否自动更新
   - 验证开发服务器热重载是否正常

## 下一步

1. 更新文档，说明新的目录结构
2. 更新 README，添加迁移指南
3. 发布新版本（建议 2.0.0，因为是破坏性更改）
4. 通知用户并提供迁移工具

