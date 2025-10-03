# 📜 Monorepo 脚本说明

## 🎯 脚本作用域

所有构建、测试和 lint 脚本都被配置为**只在 `packages/` 目录下运行**，自动排除 `examples/` 目录。

### 为什么要排除 examples？

1. ✅ **examples 不是发布包** - 它们是演示项目，不需要构建
2. ✅ **加快 CI 速度** - 避免不必要的构建和测试
3. ✅ **避免错误** - examples 使用不同的构建配置
4. ✅ **清晰的职责分离** - packages = 可发布，examples = 演示

## 📋 可用脚本

### 开发脚本

```bash
# 运行 CLI 开发服务器
pnpm dev
# 等同于：pnpm --filter @morphixai/code dev
```

### 构建脚本

```bash
# 构建所有 packages
pnpm build
# 等同于：pnpm --filter "./packages/**" run build
# ✅ 只运行：packages/cli, packages/templates/*
# ❌ 排除：examples/demo-app
```

**输出示例**：
```
Scope: 2 of 4 workspace projects
packages/cli build$ ...
```

### 测试脚本

```bash
# 测试所有 packages
pnpm test
# 等同于：pnpm --filter "./packages/**" run test
# ✅ 只运行：packages/cli, packages/templates/*
# ❌ 排除：examples/demo-app
```

### Lint 脚本

```bash
# Lint 所有 packages
pnpm lint
# 等同于：pnpm --filter "./packages/**" run lint
# ✅ 只运行：packages/cli, packages/templates/*
# ❌ 排除：examples/demo-app
```

### 版本管理脚本

```bash
# 创建 changeset
pnpm changeset

# 更新版本号
pnpm version-packages

# 构建并发布
pnpm release
```

## 🔍 Filter 模式说明

### `--filter "./packages/**"`

这个 filter 模式的作用：
- 匹配 `packages/` 目录下的所有包
- 包括子目录中的包（如 `packages/templates/react-ionic`）
- 自动排除不在 `packages/` 目录下的项目

**实际效果**：
```
✅ packages/cli/                    # 匹配
✅ packages/templates/react-ionic/  # 匹配
❌ examples/demo-app/               # 不匹配
❌ root package.json                # 不匹配
```

### 其他 Filter 选项

如果需要其他过滤方式：

```bash
# 只运行特定包
pnpm --filter @morphixai/code run build

# 排除特定包
pnpm --filter "!@morphixai/template-*" run build

# 运行多个包
pnpm --filter "@morphixai/code" --filter "@morphixai/template-*" run build
```

## 📊 Workspace 项目统计

```bash
# 查看所有 workspace 项目
pnpm list --depth -1

# 输出：
# morphixai-monorepo
# ├── @morphixai/code
# ├── @morphixai/template-react-ionic
# └── examples/demo-app (不参与构建)
```

当运行 `pnpm build` 时：
- **Total projects**: 4 (root + 3 个子项目)
- **Filtered projects**: 2 (只有 packages/ 下的)
- **输出**: `Scope: 2 of 4 workspace projects`

## 🎯 在 CI/CD 中的应用

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- name: Build packages
  run: pnpm build
  # 自动排除 examples，只构建 packages
```

### 优势

1. ✅ **更快的 CI** - 只构建需要发布的包
2. ✅ **更清晰的日志** - 不混入 examples 的构建输出
3. ✅ **更可靠** - examples 的构建问题不会影响包发布

## 🛠️ 如何测试 examples

如果需要测试 examples：

```bash
# 方式 1: 直接进入 examples 目录
cd examples/demo-app
npm run dev

# 方式 2: 使用 filter
pnpm --filter demo-app run dev

# 方式 3: 添加专门的脚本
# 在 root package.json 中：
# "test:examples": "pnpm --filter \"./examples/**\" run test"
```

## 📝 最佳实践

### ✅ 推荐做法

1. **保持 examples 独立** - 它们有自己的依赖和配置
2. **使用 filter 模式** - 明确指定运行范围
3. **文档说明** - 在 README 中说明脚本范围
4. **CI 优化** - 利用 filter 加速 CI

### ❌ 避免做法

1. **不要在 root 运行 examples 脚本** - 会污染 workspace
2. **不要混淆 packages 和 examples** - 职责不同
3. **不要在发布流程中包含 examples** - 它们不发布

## 🔧 故障排查

### Q: 为什么显示 "Scope: 2 of 4"？

A: 因为 workspace 有 4 个项目，但 filter 只匹配了 2 个（packages/）。

### Q: 如何验证 filter 是否生效？

```bash
# 查看 filter 匹配的项目
pnpm --filter "./packages/**" list --depth -1

# 输出应该只显示 packages/ 下的包
```

### Q: 如果需要包含 examples 怎么办？

```bash
# 临时包含 examples
pnpm --filter "./packages/**" --filter "./examples/**" run build

# 或创建新的脚本
# "build:all": "pnpm --recursive run build"
```

## 📚 相关资源

- [pnpm Filtering](https://pnpm.io/filtering)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**总结**：所有构建相关的脚本都已配置为只在 `packages/` 目录运行，确保清晰的职责分离和高效的 CI/CD。
