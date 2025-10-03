# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial monorepo setup with pnpm workspaces
- @morphixai/cli package with embedded development console
- React + Ionic template
- Virtual file system for user projects
- Hot module replacement (HMR) support
- UUID-based project ID generation
- Changesets for version management
- GitHub Actions CI/CD workflows

### Changed
- Updated project structure from clone-based to npm package
- Moved user development from `src/app/` to `src/`
- Simplified CLI architecture

### Fixed
- Path resolution issues in development server
- HMR configuration for user projects

## [1.0.0] - TBD

Initial release

[Unreleased]: https://github.com/Morphicai/morphixai-code/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Morphicai/morphixai-code/releases/tag/v1.0.0

