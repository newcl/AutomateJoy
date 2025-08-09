const fs = require('fs');
const path = require('path');
const { checkCache } = require('./check-n8n-cache');

// This script runs before electron-builder packs the application
// It ensures n8n-dist.zip is created and up-to-date

console.log('🔍 Checking n8n-dist cache before packing...');

const isCacheValid = checkCache();

if (isCacheValid) {
  console.log('✅ Using cached n8n-dist.zip, skipping processing');
} else {
  console.log('🔄 n8n-dist has changed, creating new zip file...');
  
  // Run the prepare script to create the zip
  const { execSync } = require('child_process');
  try {
    execSync('node scripts/prepare-n8n-dist.js', { stdio: 'inherit' });
    console.log('✅ n8n-dist.zip created successfully');
  } catch (error) {
    console.error('❌ Failed to create n8n-dist.zip:', error);
    process.exit(1);
  }
}

console.log('🚀 Ready for electron-builder packing with n8n-dist.zip');
