const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  sign: false,
  fast: false,
  clean: false
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case '--sign':
    case '-s':
      options.sign = true;
      break;
    case '--fast':
    case '-f':
      options.fast = true;
      break;
    case '--clean':
    case '-c':
      options.clean = true;
      break;
    case '--help':
    case '-h':
      console.log(`
Build Options:
  --sign, -s     Enable code signing (slower)
  --fast, -f     Use fast build with caching
  --clean, -c    Clean cache before building
  --help, -h     Show this help

Examples:
  node scripts/build-with-options.js --fast          # Fast build without signing
  node scripts/build-with-options.js --fast --sign   # Fast build with signing
  node scripts/build-with-options.js --clean         # Clean build without signing
`);
      process.exit(0);
  }
}

async function runBuild() {
  console.log('🚀 Starting build with options:', options);
  
  // Run optimization if fast build is requested
  if (options.fast) {
    console.log('🔍 Running optimization...');
    const { optimizeBuild } = require('./optimize-build');
    optimizeBuild();
  }
  
  // Clean cache if requested
  if (options.clean) {
    console.log('🧹 Cleaning cache...');
    const fs = require('fs');
    const cacheDir = path.join(__dirname, '..', '.cache');
    const cacheFile = path.join(__dirname, '..', '.n8n-cache.json');
    
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Cache directory cleaned');
    }
    
    if (fs.existsSync(cacheFile)) {
      fs.unlinkSync(cacheFile);
      console.log('✅ Cache file cleaned');
    }
  }
  
  // Build command
  const buildArgs = ['electron-builder'];
  
  if (!options.sign) {
    buildArgs.push('--win', '--x64', '--publish=never');
    console.log('⚠️  Building without code signing (faster)');
    // Set environment variables to disable signing
    process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
    process.env.CSC_LINK = '';
    process.env.CSC_KEY_PASSWORD = '';
    process.env.CSC_KEYCHAIN = '';
  } else {
    console.log('🔐 Building with code signing (slower)');
  }
  
  // Run the build
  const buildProcess = spawn('npx', buildArgs, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Build completed successfully!');
    } else {
      console.error(`❌ Build failed with code ${code}`);
      process.exit(code);
    }
  });
}

runBuild().catch(console.error);
