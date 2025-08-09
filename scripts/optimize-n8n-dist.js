const fs = require('fs');
const path = require('path');

console.log('🔧 Optimizing n8n-dist for faster installation...');

const n8nDistPath = path.join(__dirname, '..', 'n8n-dist');
const nodeModulesPath = path.join(n8nDistPath, 'node_modules');

if (!fs.existsSync(n8nDistPath)) {
  console.error('❌ n8n-dist directory not found!');
  process.exit(1);
}

// Function to remove unnecessary files that slow down installation
function optimizeNodeModules() {
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('⚠️  node_modules not found, skipping optimization');
    return;
  }

  console.log('📁 Optimizing node_modules...');
  
  // List of directories/files to remove to speed up installation
  const removePatterns = [
    '.cache',
    'test',
    'tests',
    'docs',
    'examples',
    '*.md',
    '*.txt',
    '*.log',
    '*.map',
    '*.ts',
    '*.d.ts',
    'coverage',
    '.nyc_output',
    '.nyc_output',
    'node_modules/.cache',
    'node_modules/.bin/*.ps1',
    'node_modules/.bin/*.cmd'
  ];

  let removedCount = 0;
  let savedSpace = 0;

  function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Check if this directory should be removed
        const shouldRemove = removePatterns.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace('*', '.*'));
            return regex.test(item);
          }
          return pattern === item;
        });

        if (shouldRemove) {
          try {
            const size = getDirectorySize(itemPath);
            fs.rmSync(itemPath, { recursive: true, force: true });
            removedCount++;
            savedSpace += size;
            console.log(`🗑️  Removed: ${itemPath} (${(size / 1024 / 1024).toFixed(2)} MB)`);
          } catch (error) {
            console.log(`⚠️  Could not remove ${itemPath}: ${error.message}`);
          }
        } else {
          processDirectory(itemPath);
        }
      } else {
        // Check if this file should be removed
        const shouldRemove = removePatterns.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace('*', '.*'));
            return regex.test(item);
          }
          return pattern === item;
        });

        if (shouldRemove) {
          try {
            const size = stat.size;
            fs.unlinkSync(itemPath);
            removedCount++;
            savedSpace += size;
            console.log(`🗑️  Removed: ${itemPath} (${(size / 1024).toFixed(2)} KB)`);
          } catch (error) {
            console.log(`⚠️  Could not remove ${itemPath}: ${error.message}`);
          }
        }
      }
    }
  }

  function getDirectorySize(dirPath) {
    let totalSize = 0;
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        totalSize += getDirectorySize(itemPath);
      } else {
        totalSize += stat.size;
      }
    }
    
    return totalSize;
  }

  processDirectory(nodeModulesPath);
  
  console.log(`✅ Optimization complete!`);
  console.log(`📊 Removed ${removedCount} items`);
  console.log(`💾 Saved ${(savedSpace / 1024 / 1024).toFixed(2)} MB`);
}

// Run optimization
optimizeNodeModules();
