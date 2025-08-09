const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const N8N_DIST_PATH = path.join(__dirname, '..', 'n8n-dist');
const CACHE_DIR = path.join(__dirname, '..', '.cache', 'n8n-dist');

function buildN8nCache() {
  console.log('🔨 Building n8n-dist cache...');
  
  // Create cache directory
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Check if n8n-dist exists
  if (!fs.existsSync(N8N_DIST_PATH)) {
    console.error('❌ n8n-dist directory not found!');
    process.exit(1);
  }

  // Copy n8n-dist to cache
  console.log('📁 Copying n8n-dist to cache...');
  copyFolderRecursive(N8N_DIST_PATH, CACHE_DIR);
  
  console.log('✅ n8n-dist cache built successfully');
}

function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyFolderRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

if (require.main === module) {
  buildN8nCache();
}

module.exports = { buildN8nCache };
