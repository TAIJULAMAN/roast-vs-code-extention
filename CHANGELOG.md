# Changelog

All notable changes to the "Roast" extension will be documented in this file.

## [0.2.0] - 2026-01-27

### Fixed
- **Marketplace Publishing**: Total reset of package identity and version for final stabilization.
- **Identifier Sync**: Confirmed `vs-roast` as the primary identifier.

## [1.0.0] - 2026-01-27

### Added
- **Official Stable Release**: Final integration of all Roast rules and features.
- **Marketplace Stabilization**: Resolved publisher identifier and signing issues.

## [0.1.1] - 2026-01-27

### Fixed
- **Identifier Sync**: Reverted internal name to `vs-roast` to match Marketplace registration path.
- **Publication**: Resolved "Upload Error" caused by name mismatch.

## [0.1.0] - 2026-01-27

### Changed
- **Package Identity**: Renamed internal identifier to `roast` to match Marketplace naming.
- **Stabilization**: Major version bump for final launch readiness.

## [0.0.6] - 2026-01-27

### Fixed
- **Marketplace Stability**: Switched license file to `LICENSE.txt` for better marketplace detection.
- **Package Integrity**: Final verification of all assets and metadata.

## [0.0.5] - 2026-01-27

### Fixed
- **Publisher ID Case Sensitivity**: Corrected publisher mapping to match marketplace account (`MdShahAmanPatwary`).
- **Metadata**: Added required `license` field to `package.json`.

## [0.0.4] - 2026-01-27

### Fixed
- Further optimization of package structure for Marketplace compatibility.
- Standardized extension metadata.

## [0.0.3] - 2026-01-27

### Added
- Initial release of Roast
- Real-time code roasting with decoration API
- 8 core roast rules:
  - var keyword usage
  - console.log statements
  - any type usage (TypeScript)
  - TODO comments
  - Loose equality (==)
  - eval() usage
  - Empty catch blocks
  - Deep nesting detection
- Achievement system (10, 50, 100, 500 roasts)
- Status bar integration with roast counter
- Toggle command to enable/disable roasting
- Statistics command to view roast analytics
- Configurable rules and settings
- Performance optimizations:
  - Debounced updates
  - File size limits
  - Language-specific rule filtering
- Comprehensive configuration options

### Features
- 🔥 Real-time roasting as you type
- 🏆 Achievement unlocking system
- 📊 Statistics tracking
- ⚙️ Fully configurable rules
- 🎯 Language-specific detection
- ⚡ Performance optimized

## [Unreleased]

### Planned Features
- More roast rules (React patterns, security issues)
- Shareable statistics images
- "Roast of the Day" feature
- Custom roast messages
- Integration with popular linters
- Marketplace icon and banner
- Demo GIF/video