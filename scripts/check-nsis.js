const fs = require('fs');
const path = require('path');

console.log('🔍 Checking NSIS installer creation...');

// Check if the unpacked directory exists
const unpackedPath = path.join(__dirname, '..', 'dist', 'win-unpacked');
if (fs.existsSync(unpackedPath)) {
  console.log('✅ win-unpacked directory exists');
  
  // Check the size of the unpacked directory
  const getDirectorySize = (dirPath) => {
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
  };
  
  const unpackedSize = getDirectorySize(unpackedPath);
  console.log(`📊 win-unpacked size: ${(unpackedSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Check if resources are properly included
  const resourcesPath = path.join(unpackedPath, 'resources');
  if (fs.existsSync(resourcesPath)) {
    console.log('✅ resources directory exists');
    
    const n8nDistPath = path.join(resourcesPath, 'n8n-dist');
    if (fs.existsSync(n8nDistPath)) {
      console.log('✅ n8n-dist in resources exists');
      const n8nDistSize = getDirectorySize(n8nDistPath);
      console.log(`📦 n8n-dist in resources size: ${(n8nDistSize / 1024 / 1024).toFixed(2)} MB`);
    } else {
      console.log('❌ n8n-dist in resources not found!');
    }
  } else {
    console.log('❌ resources directory not found!');
  }
} else {
  console.log('❌ win-unpacked directory not found!');
}

// Check if installer is being created
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  const distItems = fs.readdirSync(distPath);
  console.log('\n📁 Contents of dist directory:');
  distItems.forEach(item => {
    const itemPath = path.join(distPath, item);
    const stat = fs.statSync(itemPath);
    const size = stat.isDirectory() ? 'DIR' : `${(stat.size / 1024 / 1024).toFixed(2)} MB`;
    console.log(`  ${item} (${size})`);
  });
}

// Check for any .log files that might contain error information
const logFiles = fs.readdirSync(distPath).filter(item => item.endsWith('.log'));
if (logFiles.length > 0) {
  console.log('\n📄 Found log files:');
  logFiles.forEach(logFile => {
    console.log(`  ${logFile}`);
    const logPath = path.join(distPath, logFile);
    const logContent = fs.readFileSync(logPath, 'utf8');
    const lastLines = logContent.split('\n').slice(-10).join('\n');
    console.log(`  Last 10 lines of ${logFile}:`);
    console.log(`  ${lastLines}`);
  });
}

console.log('\n💡 Tips for debugging:');
console.log('1. Check if antivirus is blocking the installer creation');
console.log('2. Ensure sufficient disk space (at least 2GB free)');
console.log('3. Check Windows Event Viewer for any errors');
console.log('4. Try running as administrator if needed');
