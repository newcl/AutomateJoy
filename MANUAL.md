# AutomateJoy Build & Release Manual

This manual covers building, testing, and releasing AutomateJoy installers for Windows and macOS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Build Commands](#build-commands)
4. [Release Commands](#release-commands)
5. [Troubleshooting](#troubleshooting)
6. [Architecture Overview](#architecture-overview)

---

## Prerequisites

### Required Software
- **Node.js**: v20+ (for development; app bundles its own Node)
- **npm**: 8+
- **Git**: Installed and configured (via GitHub Desktop or Git for Windows)
- **Electron Builder**: Installed via npm
- **Windows**: For building Windows installers
- **macOS**: For building macOS DMG installers

### GitHub Token (for publishing releases)
- Generate a Personal Access Token: https://github.com/settings/tokens/new
- Scopes: `repo` (full control of private repositories)
- Store in environment variable: `GH_TOKEN`

---

## Environment Setup

### 1. Configure Git in VS Code

If using GitHub Desktop, point VS Code to the bundled Git:

```json
// .vscode/settings.json
{
  "git.path": "C:\\Users\\<username>\\AppData\\Local\\GitHubDesktop\\app-<version>\\resources\\app\\git\\mingw64\\bin\\git.exe"
}
```

### 2. Set GitHub Token (for auto-publishing)

**Bash (Git Bash / WSL):**
```bash
export GH_TOKEN='your_github_pat_here'
# Add to ~/.bashrc or ~/.bash_profile to persist:
echo "export GH_TOKEN='your_github_pat_here'" >> ~/.bashrc
source ~/.bashrc
```

**PowerShell:**
```powershell
$env:GH_TOKEN='your_github_pat_here'
# Add to PowerShell profile to persist:
Add-Content $PROFILE "export GH_TOKEN='your_github_pat_here'"
```

### 3. Install Dependencies

```bash
cd c:\git_projects\AutomateJoy
npm install
```

---

## Build Commands

### Build Frontend
Frontend builds automatically as part of `prebuild-node`, but you can build manually:

```bash
cd frontend
npm install
npm run build
cd ..
```

### Prepare n8n
Installs n8n dependencies and creates the tarball. Automatically runs during prebuild:

```bash
node ./scripts/ensure-n8n-installed.js
```

To force re-install n8n (delete markers first):
```bash
rm -f n8n-dist/.n8n.done n8n-dist.tar
# Optional: remove node_modules for full clean install
rm -rf n8n-dist/node_modules
node ./scripts/ensure-n8n-installed.js
```

### Download Node Binary
Downloads Node.js from nodejs.org for the specified architecture. Runs automatically during prebuild:

```bash
# x64 (default for most users)
NODE_VERSION=v24.4.0 TARGET_ARCH=x64 node ./scripts/download-node-binary.js

# x86 (32-bit Windows; use Node 22.x - v24.x dropped 32-bit support)
NODE_VERSION=v22.13.0 TARGET_ARCH=x86 node ./scripts/download-node-binary.js

# arm64 (macOS Apple Silicon)
NODE_VERSION=v24.4.0 TARGET_ARCH=arm64 node ./scripts/download-node-binary.js
```

To force re-download (clear old marker):
```bash
# x64 example
rm -f bin/.node.x64.done bin/x64/node.exe
NODE_VERSION=v24.4.0 TARGET_ARCH=x64 node ./scripts/download-node-binary.js
```

### Full Prebuild Step
Runs all prebuild tasks in order: frontend → n8n → Node → copy binary

```bash
# x64
TARGET_ARCH=x64 npm run prebuild-node

# x86
TARGET_ARCH=x86 npm run prebuild-node

# arm64
TARGET_ARCH=arm64 npm run prebuild-node
```

### Build Installer (without publishing)

```bash
# Windows x64
npm run build-win-x64

# Windows x86
npm run build-win-x86

# macOS x64
npm run build-mac-x64

# macOS arm64
npm run build-mac-arm64
```

Installers appear in `dist/` directory:
- Windows: `AutomateJoy Setup 1.0.X-win-x64.exe`
- macOS: `AutomateJoy-1.0.X-mac-x64.dmg`

---

## Release Commands

### Prerequisites for Publishing
1. Set `GH_TOKEN` environment variable (see [Environment Setup](#environment-setup))
2. Update version numbers in `package.json`
3. Ensure all markers and old builds are cleaned (optional, but recommended)

### Update Version Numbers

Edit `package.json`:

```json
{
  "version": "1.0.X",
  "scripts": {
    "release-mac-arm64": "... --config.extraMetadata.version=1.0.X-mac-arm64",
    "release-mac-x64": "... --config.extraMetadata.version=1.0.X-mac-x64",
    "release-win-x64": "... --config.extraMetadata.version=1.0.X-win-x64",
    "release-win-x86": "... --config.extraMetadata.version=1.0.X-win-x86"
  }
}
```

Or use bash (Git Bash):
```bash
# Replace 1.0.X with new version
sed -i 's/1.0.0/1.0.1/g' package.json
```

### Release Single Platform

```bash
# Verify GH_TOKEN is set
echo $GH_TOKEN

# Windows x64 only
npm run release-win-x64

# Windows x86 only (use Node v22.x for 32-bit support)
NODE_VERSION=v22.13.0 npm run release-win-x86

# macOS x64 only (requires macOS)
npm run release-mac-x64

# macOS arm64 only (requires macOS)
npm run release-mac-arm64
```

### Release All Platforms

**Note:** Must run on the appropriate OS (Windows for Windows builds, macOS for macOS builds).

```bash
# All Windows releases (x64 + x86)
npm run release-win-x64 && NODE_VERSION=v22.13.0 npm run release-win-x86

# All macOS releases (run on macOS)
npm run release-all
```

### Publish to GitHub Releases

Releases are automatically published to GitHub when using `npm run release-*` commands with `GH_TOKEN` set.

To verify published releases: https://github.com/newcl/AutomateJoy/releases

---

## Troubleshooting

### Node Binary Download Fails

**Error:** `Download failed with status 404`

**Cause:** Node.js version not available for the architecture.

**Solution:**
- Node v24.x: Available for x64, arm64. **Not** for x86 (32-bit).
- Node v22.x and earlier: Available for x64, x86, arm64.

For x86 builds, use:
```bash
NODE_VERSION=v22.13.0 TARGET_ARCH=x86 npm run release-win-x86
```

### Git Not Found in VS Code

**Error:** Source Control tab shows "Download Git for Windows"

**Cause:** VS Code cannot find Git executable.

**Solution:**
1. Check `.vscode/settings.json` has correct `git.path`.
2. Verify the path exists: `Test-Path 'path\to\git.exe'`
3. Update to latest GitHub Desktop version and update the path in `.vscode/settings.json`.
4. Or install Git for Windows separately.

### n8n Exits with Code 1

**Error:** App extracts n8n but n8n immediately exits.

**Cause:** Usually Node.js version incompatibility. n8n requires Node >=20.19 and <=24.x.

**Check:**
1. Verify bundled Node version matches n8n requirements.
2. In app logs (`%APPDATA%\AutomateJoy\AutomateJoy.log`), look for:
   ```
   Your Node.js version X.X.X is currently not supported by n8n
   ```
3. Rebuild with a compatible Node version (default v24.4.0 is fine for recent n8n).

### Frontend Not Included in Installer

**Error:** App launches but shows blank white window or "Cannot find index.html".

**Cause:** Frontend wasn't built before packaging.

**Solution:** Frontend builds automatically now, but if you see this error:
```bash
rm -rf frontend/dist frontend/node_modules
npm run prebuild-node  # builds frontend first
npm run build-win-x64
```

### n8n Tarball Not Included

**Error:** App launches, extracts n8n, but n8n-dist folder is empty.

**Cause:** `n8n-dist.tar` wasn't created or packaged.

**Solution:**
```bash
rm -f n8n-dist/.n8n.done n8n-dist.tar
npm run prebuild-node
npm run build-win-x64
```

### Publishing Fails: GH_TOKEN Not Set

**Error:** 
```
GitHub Personal Access Token is not set, neither programmatically, nor using env "GH_TOKEN"
```

**Solution:**
1. Generate token: https://github.com/settings/tokens/new (scope: `repo`)
2. Set in current shell:
   ```bash
   export GH_TOKEN='ghp_xxxxx'
   ```
3. Or add to bash profile (see [Environment Setup](#environment-setup))
4. Verify it's set:
   ```bash
   echo $GH_TOKEN
   ```

### Marker Files Caching Old Builds

Some steps use marker files to skip rebuilding. To force a fresh rebuild:

```bash
# Clear all markers and binaries
rm -f bin/.node.* bin/x64/node.exe bin/x86/node.exe
rm -f n8n-dist/.n8n.done n8n-dist.tar

# Frontend always rebuilds (no marker), but to clean:
rm -rf frontend/dist frontend/node_modules

# Then rebuild
TARGET_ARCH=x64 npm run prebuild-node
npm run build-win-x64
```

---

## Architecture Overview

### Build Pipeline

Each build command runs this pipeline in order:

1. **ensure-frontend-built.js**
   - Runs `npm install && npm run build` in `frontend/`
   - Output: `frontend/dist/index.html`
   - Always runs (no caching) to avoid stale UI files

2. **ensure-n8n-installed.js**
   - Checks for `n8n-dist/.n8n.done` marker + `n8n-dist.tar`
   - If missing: runs `npm install` in `n8n-dist/`, then creates tarball
   - Output: `n8n-dist.tar`

3. **download-node-binary.js**
   - Checks for `bin/.node.<arch>.done` marker
   - If marker exists + version matches + binary exists: skip
   - Otherwise: downloads Node from nodejs.org, extracts to `bin/<arch>/node.exe`
   - Output: `bin/<arch>/node.exe`

4. **copy-node-binary.js**
   - Copies Node from `bin/<arch>/` to `build-node/<arch>/`
   - Output: `build-node/<arch>/node.exe`

5. **electron-builder**
   - Packages app, includes `frontend/dist`, `n8n-dist.tar`, `build-node/`
   - Creates installer in `dist/`
   - If `--publish=always`: uploads to GitHub Releases (requires `GH_TOKEN`)

### Marker Files

Marker files prevent redundant work:

- `bin/.node.x64.done` — Node v24.4.0 downloaded for x64
- `bin/.node.x86.done` — Node downloaded for x86
- `bin/.node.arm64.done` — Node downloaded for arm64
- `n8n-dist/.n8n.done` — n8n dependencies installed + tar created

**To force rebuild:** Delete the marker file.

### Node.js Version Compatibility

- **Default:** `v24.4.0` (set in `scripts/download-node-binary.js`)
- **Override:** `NODE_VERSION=v22.13.0 npm run ...`
- **Availability:**
  - v24.x: x64, arm64 (Windows/macOS)
  - v22.x: x64, x86, arm64 (Windows/macOS, includes 32-bit)
  - x86 (32-bit Windows) requires v22.x or earlier

### n8n Version

- Defined in `n8n-dist/package.json`
- Auto-installed during build: `npm install` in `n8n-dist/`
- Check available versions: `npm view n8n versions`
- Check requirements: `npm view n8n@<version> engines`

---

## Common Workflows

### Develop and Test Locally

```bash
# Install dependencies
npm install

# Run in dev mode (reload on changes)
npm start

# Or with dev tools open
npm run dev
```

### Build and Test Installer (Windows x64)

```bash
TARGET_ARCH=x64 npm run build-win-x64
# Installer in: dist/AutomateJoy Setup 1.0.X-win-x64.exe
# Install and test
```

### Release Version 1.0.1 (Windows only)

```bash
# 1. Update version in package.json (see "Release Commands")

# 2. Set GitHub token
export GH_TOKEN='ghp_xxxxx'

# 3. Release both Windows versions
npm run release-win-x64
NODE_VERSION=v22.13.0 npm run release-win-x86

# 4. Check GitHub: https://github.com/newcl/AutomateJoy/releases
```

### Release Version 1.0.1 (All platforms, requires macOS)

```bash
# 1. Update version in package.json

# 2. Set GitHub token
export GH_TOKEN='ghp_xxxxx'

# 3. Release all platforms
npm run release-all

# (Builds: mac-arm64, mac-x64, win-x64, win-x86)
```

### Clean Full Rebuild

```bash
# Remove all markers, binaries, and build artifacts
rm -rf bin/ build-node/ dist/ frontend/dist
rm -f n8n-dist/.n8n.done n8n-dist.tar

# Rebuild from scratch
TARGET_ARCH=x64 npm run prebuild-node
npm run build-win-x64
```

---

## Additional Resources

- **n8n Docs:** https://docs.n8n.io/hosting/installation/
- **Electron Builder:** https://www.electron.build/
- **Node.js Downloads:** https://nodejs.org/dist/
- **GitHub Releases API:** https://docs.github.com/en/rest/releases/

---

## Questions or Issues?

Refer to the troubleshooting section above or check the build logs:

```bash
# App runtime logs (Windows)
notepad "$env:APPDATA\AutomateJoy\AutomateJoy.log"

# Build output (check terminal/console for detailed errors)
npm run build-win-x64 2>&1 | tee build.log
```
