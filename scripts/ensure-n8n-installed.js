// scripts/ensure-n8n-installed.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const n8nDir = path.join(rootDir, 'n8n-dist');
const markerFile = path.join(n8nDir, '.n8n.done');
const n8nTar = path.join(rootDir, 'n8n-dist.tar');

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
    // If marker exists and n8n-dist.tar exists, skip
    if (fs.existsSync(markerFile) && fs.existsSync(n8nTar)) {
      console.log('n8n marker found and tar exists. Skipping n8n install.');
      process.exit(0);
    }

    if (!fs.existsSync(n8nDir)) {
      console.log('n8n-dist directory does not exist. Creating...');
      fs.mkdirSync(n8nDir, { recursive: true });
    }

    console.log('Installing n8n dependencies in n8n-dist...');
    // Run npm install inside n8n-dist
    runCommand('npm', ['install', '--no-audit', '--no-fund'], { cwd: n8nDir });

    console.log('Building n8n tarball...');
    // Run the existing build-n8n-tar.js script to create n8n-dist.tar
    runCommand('node', [path.join('scripts', 'build-n8n-tar.js')], { cwd: rootDir });

    // Create marker file with timestamp
    fs.writeFileSync(markerFile, new Date().toISOString());
    console.log('Created marker file:', markerFile);

    console.log('n8n installation and tarball creation complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error preparing n8n:', err.message || err);
    process.exit(1);
  }
})();
