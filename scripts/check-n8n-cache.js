const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const N8N_DIST_PATH = path.join(__dirname, '..', 'n8n-dist');
const CACHE_FILE = path.join(__dirname, '..', '.n8n-cache.json');

function calculateHash(directory) {
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
        // Only hash package.json and package-lock.json for performance
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

function checkCache() {
  if (!fs.existsSync(N8N_DIST_PATH)) {
    console.log('n8n-dist directory not found, skipping cache check');
    return false;
  }

  const currentHash = calculateHash(N8N_DIST_PATH);
  
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (cacheData.hash === currentHash) {
        console.log('✅ n8n-dist cache is valid, skipping rebuild');
        return true;
      } else {
        console.log('❌ n8n-dist cache is outdated, will rebuild');
      }
    } catch (error) {
      console.log('⚠️  Cache file corrupted, will rebuild');
    }
  } else {
    console.log('📝 No cache found, will build n8n-dist');
  }

  // Update cache
  const cacheData = {
    hash: currentHash,
    timestamp: new Date().toISOString(),
    version: require('../n8n-dist/package.json').dependencies?.n8n || 'unknown'
  };
  
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  console.log('💾 Updated n8n-dist cache');
  return false;
}

if (require.main === module) {
  checkCache();
}

module.exports = { checkCache, calculateHash };
