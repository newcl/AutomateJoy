// scripts/ensure-frontend-built.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const distIndex = path.join(frontendDir, 'dist', 'index.html');

function runCommand(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (res.error) {
    throw res.error;
  }
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited with code ${res.status}`);
  }
}

(async () => {
  try {
    // Always build the frontend to avoid serving stale cached files
    // (building is cheap and ensures the packaged app always has the latest frontend)

    if (!fs.existsSync(frontendDir)) {
      throw new Error('frontend directory not found');
    }

    console.log('Installing frontend dependencies...');
    runCommand('npm', ['install', '--no-audit', '--no-fund'], { cwd: frontendDir });

    console.log('Building frontend...');
    runCommand('npm', ['run', 'build'], { cwd: frontendDir });

    // Verify build output
    if (!fs.existsSync(distIndex)) {
      throw new Error(`Frontend build output not found at ${distIndex}`);
    }

    console.log('Frontend build completed.');

    process.exit(0);
  } catch (err) {
    console.error('Error preparing frontend:', err.message || err);
    process.exit(1);
  }
})();
