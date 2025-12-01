// scripts/release-with-n8n-version.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const platform = process.argv[2];

if (!platform || !['mac-arm64', 'mac-x64', 'win-x64', 'win-x86'].includes(platform)) {
  console.error('Usage: node release-with-n8n-version.js <platform>');
  console.error('Platforms: mac-arm64, mac-x64, win-x64, win-x86');
  process.exit(1);
}

// Read n8n version
const n8nPackageJson = path.join(__dirname, '../n8n-dist/package.json');
const mainPackageJson = path.join(__dirname, '../package.json');
let n8nVersion = '1.0.0';
let appVersion = '1.0.0';

// Read app version from main package.json
try {
  const mainPkg = JSON.parse(fs.readFileSync(mainPackageJson, 'utf8'));
  appVersion = mainPkg.version || '1.0.0';
} catch (err) {
  console.warn('Warning: Could not read app version, using default:', appVersion);
}

try {
  const pkg = JSON.parse(fs.readFileSync(n8nPackageJson, 'utf8'));
  const n8nDep = pkg.dependencies.n8n || pkg.devDependencies?.n8n;
  
  if (n8nDep) {
    n8nVersion = n8nDep.replace(/^[\^~=]+/, '');
  }
} catch (err) {
  console.warn('Warning: Could not read n8n version, using default:', n8nVersion);
}

// Map platform to build config
const platformMap = {
  'win-x64': {
    arch: 'x64',
    target: '--win nsis --x64',
    version: `${appVersion}-n8n${n8nVersion}-win-x64`
  },
  'win-x86': {
    arch: 'x86',
    target: '--win nsis --x86',
    version: `${appVersion}-n8n${n8nVersion}-win-x86`,
    nodeVersion: 'v22.13.0'  // x86 requires Node 22.x
  },
  'mac-x64': {
    arch: 'x64',
    target: '--mac dmg --x64',
    version: `${appVersion}-n8n${n8nVersion}-mac-x64`
  },
  'mac-arm64': {
    arch: 'arm64',
    target: '--mac dmg --arm64',
    version: `${appVersion}-n8n${n8nVersion}-mac-arm64`
  }
};

const config = platformMap[platform];
const env = { ...process.env };

// Set NODE_VERSION for x86 if needed
if (config.nodeVersion) {
  env.NODE_VERSION = config.nodeVersion;
}

// Set TARGET_ARCH
env.TARGET_ARCH = config.arch;

console.log(`Releasing ${platform} with n8n version ${n8nVersion}...`);
console.log(`Version string: ${config.version}`);

// Run the build command
const cmd = `cross-env TARGET_ARCH=${config.arch} npm run prebuild-node && electron-builder ${config.target} --publish=always --config.extraMetadata.version=${config.version}`;

const res = spawnSync('npm', ['run', 'prebuild-node'], {
  shell: true,
  stdio: 'inherit',
  env,
  cwd: path.resolve(__dirname, '..')
});

if (res.status !== 0) {
  console.error('prebuild-node failed');
  process.exit(res.status);
}

const electronRes = spawnSync('electron-builder', config.target.split(' ').concat(['--publish=always', `--config.extraMetadata.version=${config.version}`]), {
  shell: true,
  stdio: 'inherit',
  env,
  cwd: path.resolve(__dirname, '..')
});

process.exit(electronRes.status || 0);
