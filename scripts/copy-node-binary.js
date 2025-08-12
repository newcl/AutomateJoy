// scripts/copy-node-binary.js
const fs = require('fs');
const path = require('path');

// const args = process.argv.slice(2);
// if (args.length < 1) {
//   console.error('Usage: node copy-node-binary.js <target-arch>');
//   process.exit(1);
// }

// const targetArch = args[0]; // e.g. 'x64', 'arm64', 'ia32'

const targetArch = process.env.TARGET_ARCH;
if (!targetArch) {
  console.error('TARGET_ARCH environment variable is not set');
  process.exit(1);
}

console.log(`target arch ${targetArch}`);

const rootDir = path.resolve(__dirname, '..'); // your project root
const sourceDir = path.join(rootDir, 'bin', targetArch);
const destDir = path.join(rootDir, 'build-node', targetArch);

const isWindows = process.platform === 'win32';

// Determine source and destination file names
const nodeBinaryName = isWindows ? 'node.exe' : 'node';
const srcBinary = path.join(sourceDir, nodeBinaryName);
const destBinary = path.join(destDir, nodeBinaryName);

if (!fs.existsSync(srcBinary)) {
  console.error(`Source Node binary not found: ${srcBinary}`);
  process.exit(1);
}

// Create destination dir (clean first)
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

// Copy the binary
fs.copyFileSync(srcBinary, destBinary);
console.log(`Copied ${srcBinary} → ${destBinary}`);
