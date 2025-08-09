const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting debug build...');

// Check if n8n-dist exists and its size
const n8nDistPath = path.join(__dirname, '..', 'n8n-dist');
if (fs.existsSync(n8nDistPath)) {
  const stats = fs.statSync(n8nDistPath);
  console.log(`📁 n8n-dist size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Check node_modules size
  const nodeModulesPath = path.join(n8nDistPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const nodeModulesStats = fs.statSync(nodeModulesPath);
    console.log(`📦 node_modules size: ${(nodeModulesStats.size / 1024 / 1024).toFixed(2)} MB`);
  }
} else {
  console.log('❌ n8n-dist not found!');
}

// Check cache status
const cacheFile = path.join(__dirname, '..', '.n8n-cache.json');
if (fs.existsSync(cacheFile)) {
  console.log('✅ Cache file exists');
  const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  console.log(`📅 Cache timestamp: ${cacheData.timestamp}`);
  console.log(`🔢 Cache hash: ${cacheData.hash.substring(0, 8)}...`);
} else {
  console.log('⚠️  No cache file found');
}

// Check available disk space
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  const distStats = fs.statSync(distPath);
  console.log(`📊 dist directory size: ${(distStats.size / 1024 / 1024).toFixed(2)} MB`);
}

console.log('\n🚀 Starting electron-builder with debug output...');

// Run electron-builder with debug output
const buildProcess = spawn('npx', [
  'electron-builder',
  '--config', 'electron-builder-unsigned.json',
  '--win',
  '--x64',
  '--publish=never'
], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DEBUG: 'electron-builder',
    CSC_IDENTITY_AUTO_DISCOVERY: 'false'
  }
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Debug build completed successfully!');
  } else {
    console.error(`❌ Debug build failed with code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Build process error:', error);
  process.exit(1);
});
