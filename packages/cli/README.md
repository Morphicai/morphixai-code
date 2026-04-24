# @morphixai/code

[![npm version](https://img.shields.io/npm/v/@morphixai/code.svg)](https://www.npmjs.com/package/@morphixai/code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-morphixai--code-black?logo=github)](https://github.com/Morphicai/morphixai-code)

> **Rapidly build and ship ready-to-use cross-platform mini-apps**

**MorphixAI Code** is a powerful CLI tool and development framework that enables you to quickly create, develop, and deploy cross-platform mini-apps for the MorphixAI ecosystem.

📖 **Documentation in other languages**: [🇨🇳 中文](https://github.com/Morphicai/morphixai-code/blob/main/docs/README_CN.md) | [🇯🇵 日本語](https://github.com/Morphicai/morphixai-code/blob/main/docs/README_JA.md) | [🇰🇷 한국어](https://github.com/Morphicai/morphixai-code/blob/main/docs/README_KO.md)

## ✨ Features

- 🚀 **Rapid Development** - Create projects in seconds, start coding immediately
- 💡 **AI-Powered** - Seamlessly works with AI coding assistants like [Cursor](https://cursor.sh)
- 📱 **Cross-Platform** - Write once, run on Web, iOS, and Android
- 🎯 **Zero Barrier** - Perfect for frontend beginners
- 🔧 **Ready to Use** - Built-in dev server, hot reload, and build tools
- 🌍 **Share Globally** - Publish to MorphixAI App Marketplace

## 🚀 Quick Start

### Create Your First Mini-App

```bash
npx @morphixai/code create m-app
cd m-app
npm install
npm run dev
```

That's it! Your development console will open automatically at `http://localhost:8812`.

💡 **Tip**: For the best AI-assisted development experience, use [Cursor](https://cursor.sh) editor.

## 📚 CLI Commands

### `create` - Create New Project

```bash
npx @morphixai/code create [project-name] [options]

Options:
  -t, --template <template>  Template to use (default: react-ionic)
  -y, --yes                  Skip prompts, use defaults
```

**Examples:**
```bash
# Interactive mode
npx @morphixai/code create

# Specify project name
npx @morphixai/code create m-app

# Use specific template
npx @morphixai/code create m-app --template react-ionic
```

### `dev` - Start Development Server

```bash
morphixai dev [options]

Options:
  -p, --port <port>          Port number (default: 8812)
  --console-path <path>      Console path (default: /__console)
  --debug                    Enable debug mode
  --no-open                  Don't open browser automatically
```

**Examples:**
```bash
# Use default port 8812
npm run dev

# Use custom port
morphixai dev --port 3000

# Enable debug mode
morphixai dev --debug

# Don't open browser automatically
morphixai dev --no-open
```

### `build` - Build for Production

```bash
morphixai build [options]

Options:
  -o, --outDir <dir>  Output directory (default: dist)
  --sourcemap         Generate source maps
```

**Examples:**
```bash
# Build to default directory
npm run build

# Build to custom directory
morphixai build --outDir build

# Generate source maps
morphixai build --sourcemap
```

### `restore` - Restore Source Files

```bash
morphixai restore [options]

Options:
  -s, --source <path>  Source JSON file path (default: _dev/app-files.json)
  -y, --yes            Skip confirmation prompt
  --debug              Enable debug mode
```

**Examples:**
```bash
# Restore from _dev/app-files.json (with confirmation)
morphixai restore

# Restore from dist/app-files.json
morphixai restore --source dist/app-files.json

# Restore from remote URL
morphixai restore --source https://example.com/app-files.json

# Skip confirmation prompt
morphixai restore --yes

# Restore from custom path
morphixai restore --source /path/to/app-files.json
```

**Features:**
- ✅ Supports local file paths (relative or absolute)
- ✅ Supports remote URLs (http:// or https://)
- ✅ Automatic download from remote sources
- ✅ Interactive confirmation before overwriting files

**Notes:**
- Only `.json` files are supported (both local and remote)
- Metadata files (`app-files.js`, `app-files.json`) will be automatically excluded from restore
- Remote files are downloaded to a temporary location and cleaned up after restore
- **⚠️ Warning:** This command will overwrite existing files in the `src/` directory. Always confirm the changes before proceeding.

### `template` - Template Management

```bash
morphixai template <command>

Commands:
  list         List available templates
  update       Update template cache
  clear-cache  Clear template cache
```

### `prompts` - AI Prompts Management

```bash
morphixai prompts <command>

Commands:
  check                Check prompts version
  update               Update prompts to latest version
  install [editor]     Install prompts for specific editor (cursor, claude, all)
```

## 🎯 Project Structure

```
m-app/
├── src/                    # Your mini-app source code
│   ├── app.jsx            # App entry point
│   ├── components/        # React components
│   └── styles/            # CSS modules
├── _dev/                  # Development tools (auto-generated)
├── docs/                  # Documentation
├── package.json           # Dependencies and scripts
└── project-config.json    # Project configuration and ID
```

## 💡 Use Cases

MorphixAI supports building various types of mini-apps:

- 📊 **Productivity Tools** - Todo lists, notes, habit trackers
- 🎨 **Creative Tools** - Image editors, drawing apps, design assistants
- 📱 **Life Utilities** - Weather, calculators, unit converters
- 🤖 **AI Applications** - Smart Q&A, image recognition, content generation
- 💼 **Business Apps** - Business cards, product showcases, booking systems

## 🤖 AI-Assisted Development

MorphixAI Code works seamlessly with AI coding assistants. Recommended: [Cursor](https://cursor.sh) editor.

**Example workflow:**
```
You: Create a user profile card component with avatar, name, and bio

AI: I'll create this component...
1. Create UserCard.jsx component
2. Add responsive styles
3. Support click interactions
4. Optimize for mobile display
```

With AI assistants, you can:
- ✅ Describe requirements in natural language
- ✅ Auto-generate components, styles, and logic
- ✅ Follow best practices and MorphixAI specs
- ✅ Get complete, runnable code instantly

## 📱 Where to Experience MorphixAI?

- **iOS**: Search "MorphixAI" in App Store
- **Android**: [Download from official website](https://morphix.app/)
- **Web**: [App Marketplace](https://app-shell.focusbe.com/app-market)

## 🌍 Publish & Share

### Publish to Official App Marketplace (Recommended)

1. Ensure your mini-app works properly
2. Email details to `contact@baibian.app`
3. Include: App ID, brief description, use cases
4. Your app will appear in the marketplace after approval

### Private Sharing

1. Run locally on your computer
2. Share the code folder as zip
3. Recipients follow the same steps to run

## 🛠️ System Capabilities

MorphixAI Mini-Apps can access:

- 📦 Data Storage
- 📷 Camera & Photos
- 📁 File Operations
- 📍 Geolocation
- 📅 Calendar Integration
- 🔔 Push Notifications
- 🤖 AI Capabilities (GPT, Claude, etc.)

## 🆘 Get Help

- 📖 **Full Documentation**: [GitHub Repository](https://github.com/Morphicai/morphixai-code)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Morphicai/morphixai-code/issues)
- 💬 **Development Specs**: [MorphixAI Development Specification](https://app-shell.focusbe.com/docs/app-development-specification.md)
- 📧 **Contact Us**: contact@baibian.app

## 📖 More Resources

- [Full Documentation](https://github.com/Morphicai/morphixai-code#readme)
- [Contributing Guide](https://github.com/Morphicai/morphixai-code/blob/main/CONTRIBUTING.md)
- [Quick Start Guide](https://github.com/Morphicai/morphixai-code/blob/main/QUICKSTART_RELEASE.md)
- [CLI Prompts Guide](https://github.com/Morphicai/morphixai-code/blob/main/CLI_PROMPTS_GUIDE.md)
- [Changelog](https://github.com/Morphicai/morphixai-code/blob/main/packages/cli/CHANGELOG.md)

## 🗺️ Roadmap

- [ ] Fullscreen mode support
- [ ] Built-in capabilities panel
- [ ] Flutter development support
- [ ] GitHub Actions integration

## 🤝 Contributing

We welcome contributions of all kinds!

1. Fork the project: [github.com/Morphicai/morphixai-code](https://github.com/Morphicai/morphixai-code)
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

See our [Contributing Guide](https://github.com/Morphicai/morphixai-code/blob/main/CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Morphicai/morphixai-code/blob/main/LICENSE) file for details.

## ⭐ Star History

If this project helps you, please give us a Star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Morphicai/morphixai-code&type=Date)](https://star-history.com/#Morphicai/morphixai-code&Date)

---

**Built with ❤️ by the [MorphixAI](https://morphix.app/) Team**
