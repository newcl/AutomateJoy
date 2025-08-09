const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting optimized build process with n8n-dist.zip...');

// Step 1: Check if n8n-dist exists
const n8nDistPath = path.join(__dirname, '..', 'n8n-dist');
if (!fs.existsSync(n8nDistPath)) {
  console.error('❌ n8n-dist folder not found! Please run npm install first.');
  process.exit(1);
}

// Step 2: Create the zip file
console.log('📦 Creating n8n-dist.zip...');
try {
  execSync('node scripts/prepare-n8n-dist.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to create n8n-dist.zip:', error);
  process.exit(1);
}

// Step 3: Verify zip was created
const zipPath = path.join(__dirname, '..', 'n8n-dist.zip');
if (!fs.existsSync(zipPath)) {
  console.error('❌ n8n-dist.zip was not created!');
  process.exit(1);
}

const zipStats = fs.statSync(zipPath);
const zipSizeMB = (zipStats.size / 1024 / 1024).toFixed(2);
console.log(`✅ n8n-dist.zip created successfully (${zipSizeMB} MB)`);

// Step 4: Run electron-builder
console.log('🔨 Starting electron-builder...');
try {
  execSync('npx electron-builder', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

console.log('🎉 Build process completed!');
console.log('💡 The installer will now extract n8n-dist.zip during installation for faster builds.');
