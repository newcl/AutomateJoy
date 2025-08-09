const fs = require('fs');
const path = require('path');
const { checkCache } = require('./check-n8n-cache');

// This script runs before electron-builder packs the application
// It checks if n8n-dist has changed and only processes it if necessary

console.log('🔍 Checking n8n-dist cache before packing...');

const isCacheValid = checkCache();

if (isCacheValid) {
  console.log('✅ Using cached n8n-dist, skipping processing');
} else {
  console.log('🔄 n8n-dist has changed, will process during build');
}

// The actual processing will be handled by electron-builder
// This script just provides information about cache status
