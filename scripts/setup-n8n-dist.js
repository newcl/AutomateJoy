const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up n8n-dist folder with n8n...');

const n8nDistPath = path.join(__dirname, '..', 'n8n-dist');

// Step 1: Create n8n-dist directory if it doesn't exist
if (!fs.existsSync(n8nDistPath)) {
  fs.mkdirSync(n8nDistPath, { recursive: true });
  console.log('📁 Created n8n-dist directory');
}

// Step 2: Initialize package.json if it doesn't exist
const packageJsonPath = path.join(n8nDistPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  const packageJson = {
    "name": "n8n-dist",
    "version": "1.0.0",
    "description": "n8n distribution for Pody",
    "dependencies": {
      "n8n": "^1.0.0"
    }
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('📝 Created package.json');
}

// Step 3: Install n8n
console.log('📦 Installing n8n...');
try {
  execSync('npm install', { 
    cwd: n8nDistPath, 
    stdio: 'inherit' 
  });
  console.log('✅ n8n installed successfully!');
} catch (error) {
  console.error('❌ Failed to install n8n:', error);
  process.exit(1);
}

// Step 4: Verify installation
const n8nBinaryPath = path.join(n8nDistPath, 'node_modules', '.bin', process.platform === 'win32' ? 'n8n.cmd' : 'n8n');
if (fs.existsSync(n8nBinaryPath)) {
  console.log('✅ n8n binary found at:', n8nBinaryPath);
} else {
  console.error('❌ n8n binary not found after installation!');
  process.exit(1);
}

console.log('🎉 n8n-dist setup completed successfully!');
console.log('💡 You can now run: npm run prepare:zip');
