// scripts/download-node-binary.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const extractZip = require('extract-zip');

// Use NODE_VERSION env var to allow easy upgrades; default to a Node.js 24.x release
// n8n requires Node >=20.19 <=24.x, so default to a 24.x compatible version.
const NODE_VERSION = process.env.NODE_VERSION || 'v24.4.0';
const rootDir = path.resolve(__dirname, '..');

const targetArch = process.env.TARGET_ARCH;
if (!targetArch) {
  console.error('TARGET_ARCH environment variable is not set');
  process.exit(1);
}

console.log(`Preparing Node binary for arch: ${targetArch}`);

// Map TARGET_ARCH to Node.js Windows platform identifier
const archMapping = {
  x64: 'win-x64',
  x86: 'win-ia32',
  arm64: 'win-arm64'
};

const nodePlatform = archMapping[targetArch];
if (!nodePlatform) {
  console.error(`Unsupported architecture: ${targetArch}`);
  process.exit(1);
}

const binDir = path.join(rootDir, 'bin', targetArch);
const markerFile = path.join(rootDir, 'bin', `.node.${targetArch}.done`);
const downloadUrl = `https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-${nodePlatform}.zip`;

// Check if already downloaded and version matches
if (fs.existsSync(markerFile)) {
  try {
    const existingVersion = fs.readFileSync(markerFile, 'utf8').trim();
    if (existingVersion === NODE_VERSION) {
      console.log(`Node binary marker found (${path.basename(markerFile)}), version matches ${NODE_VERSION}. Skipping download.`);
      // Ensure binary exists as well
      const existingBinary = path.join(binDir, 'node.exe');
      if (fs.existsSync(existingBinary)) {
        process.exit(0);
      }
      console.log('Marker exists but binary missing — re-downloading.');
    } else {
      console.log(`Node marker version (${existingVersion}) differs from requested ${NODE_VERSION}. Re-downloading.`);
      // remove old binary if present
      try {
        const oldBinary = path.join(binDir, 'node.exe');
        if (fs.existsSync(oldBinary)) fs.unlinkSync(oldBinary);
      } catch (err) {
        // ignore
      }
    }
  } catch (err) {
    console.log('Failed to read marker file, proceeding to download.');
  }
}

console.log(`Downloading Node ${NODE_VERSION} for ${nodePlatform}...`);
console.log(`URL: ${downloadUrl}`);

// Ensure bin directory exists
fs.mkdirSync(path.join(rootDir, 'bin'), { recursive: true });

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {}); // Delete the file on error
        reject(err);
      });
  });
};

const extractNodeBinary = async (zipPath, extractDir) => {
  // Create temp extract directory
  const tempDir = path.join(rootDir, 'bin', `.temp-${targetArch}`);
  
  // Extract zip
  await extractZip(zipPath, { dir: tempDir });
  
  // Node archives contain a top-level directory like node-v18.19.0-win-x64/
  const entries = fs.readdirSync(tempDir);
  const nodeDir = entries.find(entry => entry.startsWith('node-'));
  
  if (!nodeDir) {
    throw new Error('Could not find node directory in downloaded archive');
  }
  
  const sourceBinaryPath = path.join(tempDir, nodeDir, 'node.exe');
  
  if (!fs.existsSync(sourceBinaryPath)) {
    throw new Error(`Node binary not found at ${sourceBinaryPath}`);
  }
  
  // Create target directory
  fs.mkdirSync(extractDir, { recursive: true });
  
  // Copy node.exe to target location
  const targetBinaryPath = path.join(extractDir, 'node.exe');
  fs.copyFileSync(sourceBinaryPath, targetBinaryPath);
  
  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log(`Extracted node.exe to ${targetBinaryPath}`);
};

(async () => {
  try {
    const zipPath = path.join(rootDir, 'bin', `node-${NODE_VERSION}-${nodePlatform}.zip`);
    
    // Download
    await downloadFile(downloadUrl, zipPath);
    console.log(`Downloaded to ${zipPath}`);
    
    // Extract and copy binary
    await extractNodeBinary(zipPath, binDir);
    
    // Clean up zip file
    fs.unlinkSync(zipPath);
    console.log(`Cleaned up zip file`);
    
    // Create marker file
    fs.writeFileSync(markerFile, NODE_VERSION);
    console.log(`Created marker file: ${markerFile}`);
    
    console.log(`✓ Node binary ready for ${targetArch}`);
  } catch (error) {
    console.error(`Error downloading/extracting Node binary: ${error.message}`);
    // Clean up on error
    if (fs.existsSync(path.join(rootDir, 'bin', `.temp-${targetArch}`))) {
      fs.rmSync(path.join(rootDir, 'bin', `.temp-${targetArch}`), { recursive: true, force: true });
    }
    process.exit(1);
  }
})();
