const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('🚀 Preparing n8n-dist for fast NSIS build...');

const n8nDistPath = path.join(__dirname, '..', 'n8n-dist');
const zipPath = path.join(__dirname, '..', 'n8n-dist.zip');

// Check if n8n-dist exists
if (!fs.existsSync(n8nDistPath)) {
  console.error('❌ n8n-dist folder not found!');
  process.exit(1);
}

// Remove old zip if it exists
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log('🗑️  Removed old n8n-dist.zip');
}

// Create zip file
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Created n8n-dist.zip (${sizeMB} MB)`);
  console.log('💡 NSIS build will now be much faster!');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(n8nDistPath, 'n8n-dist');
archive.finalize();
