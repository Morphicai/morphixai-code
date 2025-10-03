# 🚀 快速发布指南

## 完整流程（5 步）

### 1️⃣ 开发与测试
```bash
# 创建分支
git checkout -b feature/your-feature

# 开发代码...
# 本地测试
cd packages/cli && npm link
cd /tmp && morphixai create test-app && cd test-app
npm install && npm run dev

# 验证通过后
cd /Users/pengzai/www/morphicai/morphixai-code
pnpm test && pnpm lint && pnpm build
```

### 2️⃣ 创建 Changeset（重要！）
```bash
pnpm changeset

# 交互式选择：
# 1. 选择包：@morphixai/cli
# 2. 选择版本类型：
#    - patch: Bug 修复 (1.0.0 → 1.0.1)
#    - minor: 新功能 (1.0.0 → 1.1.0)
#    - major: 破坏性变更 (1.0.0 → 2.0.0)
# 3. 描述变更：简洁清晰的说明
```

### 3️⃣ 提交与创建 PR
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature

# 在 GitHub 创建 Pull Request
```

### 4️⃣ 合并到 main
- ✅ CI 检查通过
- ✅ 代码审查通过
- ✅ 合并 PR

### 5️⃣ 自动发布（无需操作）
```
✨ 合并后自动发生：
1. GitHub Actions 创建 "Version Packages" PR
2. 审查版本 PR（检查 CHANGELOG 和版本号）
3. 合并版本 PR
4. 🎉 自动发布到 npm！
```

---

## 验证发布
```bash
# 等待 2-3 分钟后
npm view @morphixai/cli

# 或测试安装
npx @morphixai/cli@latest create test-new-version
```

---

## 常用命令
```bash
pnpm changeset          # 创建变更记录
pnpm test              # 测试
pnpm lint              # 代码检查
pnpm build             # 构建
pnpm version-packages  # 手动更新版本（备用）
pnpm release           # 手动发布（备用）
```

---

## 注意事项

⚠️ **必须创建 changeset**，否则不会发布新版本
⚠️ **版本类型要正确**，遵循语义化版本规范
⚠️ **首次发布前**，确保 GitHub 已配置 NPM_TOKEN

---

详细文档：查看 `RELEASE_WORKFLOW.md`
