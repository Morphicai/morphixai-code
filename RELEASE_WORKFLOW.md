# 📦 MorphixAI Code - 完整发布工作流

## 🎯 发布工作流程图

```
开发阶段 → 测试验证 → 创建 Changeset → 提交 PR → 合并到 main → 自动发布
```

---

## 📝 详细步骤

### 阶段 1️⃣：开发新功能

#### 1. 创建功能分支
```bash
# 从 main 分支创建新分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 或者修复 bug
git checkout -b fix/bug-description
```

#### 2. 开发代码
```bash
# 在 packages/cli/ 中开发
cd packages/cli
# ... 编写代码 ...

# 实时测试（在 demo-app 中）
cd ../../examples/demo-app
npm run dev
```

#### 3. 确保代码质量
```bash
# 回到项目根目录
cd /Users/pengzai/www/morphicai/morphixai-code

# 运行测试
pnpm test

# 运行 lint
pnpm lint

# 构建验证
pnpm build
```

---

### 阶段 2️⃣：本地测试验证

#### 1. 本地测试 CLI
```bash
# 在 CLI 包中创建链接
cd packages/cli
npm link

# 在临时目录测试
cd /tmp
morphixai create test-app-$(date +%s)
cd test-app-*
npm install
npm run dev

# 验证功能正常后，清理测试项目
cd /tmp && rm -rf test-app-*
```

#### 2. 测试完整流程
- ✅ `morphixai create` 创建项目
- ✅ `npm install` 安装依赖
- ✅ `npm run dev` 开发服务器启动
- ✅ 热重载 (HMR) 工作正常
- ✅ `npm run build` 生产构建成功
- ✅ 项目结构正确（src/、docs/、public/ 等）

---

### 阶段 3️⃣：创建 Changeset（重要！）

#### 1. 运行 changeset 命令
```bash
cd /Users/pengzai/www/morphicai/morphixai-code
pnpm changeset
```

#### 2. 选择变更类型

**提示信息**：
```
🦋  Which packages would you like to include?
```

**选择**：使用空格键选择 `@morphixai/cli`，回车确认

---

**提示信息**：
```
🦋  Which packages should have a major bump?
🦋  Which packages should have a minor bump?
🦋  Which packages should have a patch bump?
```

**选择版本类型**（遵循[语义化版本](https://semver.org/)）：

| 类型 | 何时使用 | 示例 |
|------|---------|------|
| **Major (主版本)** | 破坏性变更、不兼容更新 | `1.0.0` → `2.0.0` |
| **Minor (次版本)** | 新增功能、向后兼容 | `1.0.0` → `1.1.0` |
| **Patch (补丁)** | Bug 修复、小改进 | `1.0.0` → `1.0.1` |

**示例**：
- 🔴 Major: 改变 CLI 命令格式、删除已有 API
- 🟡 Minor: 添加新命令 `morphixai prompts`、新增可选参数
- 🟢 Patch: 修复 HMR bug、优化错误提示

#### 3. 编写变更描述

**提示信息**：
```
🦋  Please enter a summary for this change (this will be in the changelogs).
```

**编写规范**：
```markdown
# 好的示例 ✅
feat: add hot reload support for user projects
fix: resolve path issues in Windows environment
perf: improve CLI startup time by 50%
docs: update README with npx usage examples

# 不好的示例 ❌
update
bug fix
改了一些东西
```

**完整示例**：
```
feat: add prompts management commands

Added new commands for managing AI prompts:
- morphixai prompts check: Check prompt versions
- morphixai prompts update: Update to latest prompts
- morphixai prompts list: List available prompts

This allows users to keep their AI prompts up-to-date
without manually downloading files.
```

#### 4. 验证 changeset 文件
```bash
# 查看生成的 changeset 文件
ls .changeset/

# 示例输出：
# .changeset/
# ├── config.json
# ├── README.md
# └── lovely-pandas-jump.md  # ← 新生成的文件

# 查看内容
cat .changeset/lovely-pandas-jump.md
```

---

### 阶段 4️⃣：提交代码

#### 1. 提交变更
```bash
# 添加所有文件（包括 changeset）
git add .

# 提交（使用 Conventional Commits 格式）
git commit -m "feat: add prompts management commands"

# Push 到远程
git push origin feature/your-feature-name
```

#### 2. 创建 Pull Request
1. 访问 GitHub 仓库
2. 点击 "Compare & pull request"
3. 填写 PR 信息：

**PR 标题示例**：
```
feat: Add prompts management commands
fix: Resolve Windows path compatibility issues
docs: Update installation guide for npx
```

**PR 描述模板**：
```markdown
## 📝 变更说明
添加了 prompts 管理命令，允许用户检查和更新 AI 提示词。

## ✨ 新功能
- morphixai prompts check
- morphixai prompts update
- morphixai prompts list

## 🧪 测试
- [x] 本地测试通过
- [x] 在 demo-app 中验证
- [x] 测试了 Windows/macOS/Linux

## 📦 Changeset
- [x] 已创建 changeset

## 📸 截图（如有）
[添加截图]
```

4. 点击 "Create pull request"

---

### 阶段 5️⃣：代码审查与合并

#### 1. 等待 CI 检查
GitHub Actions 会自动运行：
- ✅ Lint 检查
- ✅ 运行测试
- ✅ 构建验证

查看状态：PR 页面底部会显示检查结果

#### 2. 代码审查
- 团队成员审查代码
- 根据反馈修改（如需要）
- 再次 push 更新

```bash
# 如需修改
# ... 编辑代码 ...
git add .
git commit -m "fix: address review comments"
git push origin feature/your-feature-name
```

#### 3. 合并到 main
- 所有检查通过 ✅
- 获得批准 ✅
- 点击 "Squash and merge" 或 "Merge pull request"

---

### 阶段 6️⃣：自动发布（GitHub Actions）

#### 合并后自动流程：

**1. GitHub Actions 创建版本 PR**
```
✨ 自动发生：
- 读取所有 changeset 文件
- 更新 package.json 版本号
- 生成/更新 CHANGELOG.md
- 创建名为 "Version Packages" 的 PR
```

**2. 审查版本 PR**
访问 GitHub，查看新创建的 PR：
- 标题：`chore: version packages`
- 检查 `CHANGELOG.md` 内容
- 检查 `package.json` 版本号
- 确认变更无误

**3. 合并版本 PR 触发发布**
```
✨ 自动发生：
- 运行 pnpm build
- 运行 changeset publish
- 发布到 npm ✨
- 创建 GitHub Release
- 推送 git tags
```

**4. 验证发布成功**
```bash
# 检查 npm
npm view @morphixai/cli

# 或访问
# https://www.npmjs.com/package/@morphixai/cli
```

---

### 阶段 7️⃣：验证发布

#### 1. 测试新版本
```bash
# 清理旧版本（如有）
npm uninstall -g @morphixai/cli

# 从 npm 安装新版本
npm install -g @morphixai/cli

# 验证版本
morphixai --version

# 创建测试项目
npx @morphixai/cli create test-release
cd test-release
npm install
npm run dev
```

#### 2. 通知团队
- 📢 发布公告
- 📝 更新文档
- 💬 社区通知

---

## 🔥 快速参考

### 常用命令速查
```bash
# 开发
git checkout -b feature/name      # 创建分支
pnpm test                         # 运行测试
pnpm lint                         # 代码检查
pnpm build                        # 构建

# 发布准备
pnpm changeset                    # 创建 changeset
git add .                         # 添加文件
git commit -m "feat: ..."         # 提交
git push origin feature/name      # 推送

# 本地测试
cd packages/cli && npm link       # 链接 CLI
morphixai create test             # 测试创建

# 手动发布（备用）
pnpm version-packages             # 更新版本
pnpm release                      # 发布
```

---

## 🚨 常见问题

### Q: 忘记创建 changeset 了怎么办？
```bash
# 在提交前补充 changeset
pnpm changeset

# 修改最后一次 commit 包含 changeset
git add .changeset
git commit --amend --no-edit
git push --force-with-lease
```

### Q: 选错了版本类型怎么办？
```bash
# 删除错误的 changeset
rm .changeset/[错误的文件名].md

# 重新创建
pnpm changeset
```

### Q: CI 检查失败怎么办？
```bash
# 查看错误日志
# 在 GitHub PR 页面点击 "Details"

# 本地修复
# ... 修复代码 ...
pnpm test   # 确保通过
pnpm lint   # 确保通过

# 提交修复
git add .
git commit -m "fix: resolve CI issues"
git push
```

### Q: 需要紧急 hotfix 怎么办？
```bash
# 从 main 创建 hotfix 分支
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 修复 bug
# ... 编辑代码 ...

# 创建 patch changeset
pnpm changeset
# 选择 "patch"

# 提交并快速合并
git add .
git commit -m "fix: critical bug in CLI"
git push origin hotfix/critical-bug

# 创建 PR 并标记为 urgent
# 快速审查和合并
```

---

## 📋 发布前检查清单

使用此清单确保发布质量：

### 代码质量
- [ ] 所有测试通过 (`pnpm test`)
- [ ] Lint 检查通过 (`pnpm lint`)
- [ ] 构建成功 (`pnpm build`)
- [ ] 本地测试验证通过

### 文档
- [ ] README.md 已更新
- [ ] CHANGELOG.md 包含变更（自动生成）
- [ ] 示例代码已更新（如需要）
- [ ] API 文档已更新（如需要）

### Changeset
- [ ] 已创建 changeset
- [ ] 版本类型正确（major/minor/patch）
- [ ] 变更描述清晰完整
- [ ] Changeset 文件已提交

### Git
- [ ] Commit 信息遵循规范
- [ ] 分支名称清晰
- [ ] PR 描述完整
- [ ] 没有遗留的调试代码

### 发布配置
- [ ] NPM_TOKEN 已配置（首次发布）
- [ ] package.json 信息正确
- [ ] .npmignore 配置正确
- [ ] publishConfig 正确（public）

---

## 🎓 最佳实践

### 1. 频繁提交，小步迭代
```bash
# 好 ✅
git commit -m "feat: add create command structure"
git commit -m "feat: implement project template copying"
git commit -m "feat: add interactive prompts"

# 不好 ❌
# 一次性提交所有更改
git commit -m "add everything"
```

### 2. 一个 PR 专注一个功能
- ✅ PR: "Add prompts management"
- ❌ PR: "Add prompts, fix bugs, update docs, refactor code"

### 3. 及时更新文档
- 代码 + 文档一起提交
- 不要留下 "TODO: update docs"

### 4. 充分测试
- 本地测试
- 多平台验证（Windows/macOS/Linux）
- 边缘情况处理

### 5. 语义化版本
- Breaking changes → Major
- New features → Minor  
- Bug fixes → Patch

---

## 🎯 总结

**理想的发布流程时间线**：

| 步骤 | 时间 | 说明 |
|------|------|------|
| 开发 | 1-3 天 | 编写代码、本地测试 |
| 创建 Changeset | 2 分钟 | 描述变更 |
| 提交 PR | 5 分钟 | 创建 Pull Request |
| CI 检查 | 3-5 分钟 | 自动运行 |
| 代码审查 | 1-2 天 | 团队审查 |
| 合并 PR | 1 分钟 | 合并到 main |
| 版本 PR 生成 | 2 分钟 | 自动创建 |
| 审查版本 PR | 5 分钟 | 检查版本号和 changelog |
| 合并并发布 | 3-5 分钟 | 自动发布到 npm |

**总计**：约 2-5 天（主要是开发和审查时间）

---

**🎉 遵循此工作流，你就能高效、安全地发布新版本！**


