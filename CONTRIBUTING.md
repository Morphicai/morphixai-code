# Contributing to MorphixAI Code

感谢您考虑为 MorphixAI Code 做出贡献！

## 开发流程

### 1. 设置开发环境

```bash
# 克隆仓库
git clone https://github.com/Morphicai/morphixai-code.git
cd morphixai-code

# 安装依赖
pnpm install

# 构建所有包
pnpm build
```

### 2. 开发工作流

```bash
# 在 demo-app 中测试 CLI
cd examples/demo-app
npm run dev

# 运行测试
pnpm test

# 运行 linter
pnpm lint
```

### 3. 提交更改

我们使用 [Changesets](https://github.com/changesets/changesets) 来管理版本和生成 changelog。

#### 创建 changeset

```bash
# 添加 changeset（描述你的更改）
pnpm changeset
```

按照提示：
1. 选择要更新的包
2. 选择版本类型（major/minor/patch）
3. 描述你的更改

#### 提交 PR

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: add amazing feature'`)
4. 添加 changeset (`pnpm changeset`)
5. Push 到分支 (`git push origin feature/amazing-feature`)
6. 开启 Pull Request

### 4. Commit 规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响代码运行的变动）
- `refactor:` 重构（既不是新增功能，也不是修改bug的代码变动）
- `perf:` 性能优化
- `test:` 增加测试
- `chore:` 构建过程或辅助工具的变动

### 5. 发布流程（维护者）

```bash
# 1. 版本更新（基于 changesets）
pnpm version-packages

# 2. 提交版本更改
git add .
git commit -m "chore: version packages"

# 3. 发布到 npm
pnpm release
```

## 包结构

```
morphixai-code/
├── packages/
│   ├── cli/              # @morphixai/cli
│   └── templates/        # 模板包（private）
├── examples/
│   └── demo-app/        # 示例应用（不参与构建）
└── docs/                # 文档
```

**注意**：
- `pnpm build`、`pnpm test`、`pnpm lint` 只在 `packages/` 目录运行
- `examples/` 目录自动被排除，不会参与构建和测试

## 本地测试 CLI

```bash
# 在 cli 包目录
cd packages/cli

# 链接到全局
npm link

# 测试创建项目
morphixai create test-app
cd test-app
npm install
npm run dev
```

## GitHub Actions

- **CI**: 在 PR 和 push 到 main/develop 时运行测试和 linter
- **Release**: 在 push 到 main 时自动发布新版本（需要 changesets）

### 配置 NPM_TOKEN

维护者需要在 GitHub 仓库设置中添加 `NPM_TOKEN` secret：

1. 访问 https://www.npmjs.com/settings/[your-username]/tokens
2. 创建 Automation token
3. 在 GitHub 仓库 Settings > Secrets > Actions 中添加 `NPM_TOKEN`

## 问题和建议

- 提交 Issue: https://github.com/Morphicai/morphixai-code/issues
- 讨论: https://github.com/Morphicai/morphixai-code/discussions

## 许可证

通过贡献，您同意您的贡献将在 MIT 许可证下授权。

