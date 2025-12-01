// scripts/get-n8n-version.js
const fs = require('fs');
const path = require('path');

const n8nDistPackageJson = path.join(__dirname, '../n8n-dist/package.json');

try {
  const pkg = JSON.parse(fs.readFileSync(n8nDistPackageJson, 'utf8'));
  
  // Get n8n version from dependencies (e.g., "1.105.4" or "^1.105.4")
  const n8nVersion = pkg.dependencies.n8n || pkg.devDependencies?.n8n;
  
  if (!n8nVersion) {
    console.error('n8n not found in dependencies or devDependencies');
    process.exit(1);
  }
  
  // Strip leading ^, ~, or = to get clean version (e.g., "^1.105.4" → "1.105.4")
  const cleanVersion = n8nVersion.replace(/^[\^~=]+/, '');
  
  console.log(cleanVersion);
} catch (err) {
  console.error('Error reading n8n version:', err.message);
  process.exit(1);
}
