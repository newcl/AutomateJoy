const fs = require('fs');
const path = require('path');

const N8N_DIST_PATH = path.join(__dirname, '..', 'n8n-dist');
const CACHE_DIR = path.join(__dirname, '..', '.cache', 'n8n-dist');
const CACHE_FILE = path.join(__dirname, '..', '.n8n-cache.json');

function optimizeBuild() {
  console.log('🚀 Optimizing build process...');
  
  // Check if n8n-dist exists
  if (!fs.existsSync(N8N_DIST_PATH)) {
    console.error('❌ n8n-dist directory not found!');
    process.exit(1);
  }

  // Check cache status
  const isCacheValid = checkCacheStatus();
  
  if (isCacheValid) {
    console.log('✅ Cache is valid, using cached n8n-dist');
    console.log('💡 Tip: Use "npm run dist:fast" for faster builds when n8n-dist hasn\'t changed');
    return true;
  }

  console.log('🔄 Cache is invalid or missing, rebuilding n8n-dist cache...');
  rebuildCache();
  console.log('💡 Tip: Subsequent builds will be faster with cached n8n-dist');
  return false;
}

function checkCacheStatus() {
  if (!fs.existsSync(CACHE_FILE)) {
    return false;
  }

  try {
    const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    const currentHash = calculateHash(N8N_DIST_PATH);
    
    return cacheData.hash === currentHash;
  } catch (error) {
    console.log('⚠️  Cache file corrupted');
    return false;
  }
}

function calculateHash(directory) {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5');
  
  function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir).sort();
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else {
        // Only hash key files for performance
        if (item === 'package.json' || item === 'package-lock.json') {
          const content = fs.readFileSync(fullPath);
          hash.update(content);
        }
      }
    }
  }
  
  processDirectory(directory);
  return hash.digest('hex');
}

function rebuildCache() {
  // Create cache directory
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Copy n8n-dist to cache
  console.log('📁 Copying n8n-dist to cache...');
  copyFolderRecursive(N8N_DIST_PATH, CACHE_DIR);
  
  // Update cache file
  const cacheData = {
    hash: calculateHash(N8N_DIST_PATH),
    timestamp: new Date().toISOString(),
    version: require('../n8n-dist/package.json').dependencies?.n8n || 'unknown'
  };
  
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  console.log('💾 Updated n8n-dist cache');
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
  optimizeBuild();
}

module.exports = { optimizeBuild, checkCacheStatus };
