const { ipcMain } = require('electron');

const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

const fs = require('fs');
const logFile = path.join(app.getPath('userData'), 'AutomateJoy.log');

function logToFile(message) {
  fs.appendFileSync(logFile, message + '\n');
}

console.log = (msg) => {
  process.stdout.write(msg + '\n'); // keep normal behavior
  logToFile(msg);
};
console.error = (msg) => {
  process.stderr.write(msg + '\n');
  logToFile('ERROR: ' + msg);
};

const tar = require('tar');

async function extractTarGzWithProgress(tarFile, outputDir, onProgress) {
  const stat = fs.statSync(tarFile);
  const totalSize = stat.size;

  console.log(`extracting from ${tarFile} to ${outputDir}`);
  let processedBytes = 0;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(tarFile);

    readStream.on('data', chunk => {
      processedBytes += chunk.length;
      if (onProgress) {
        onProgress(processedBytes / totalSize);
      }
    });

    readStream.on('error', err => {
      console.error('Read stream error:', err);
      reject(err);
    });

    const extractor = tar.x({ C: outputDir, gzip: false});

    extractor.on('error', err => {
      console.error('Extractor error:', err);
      reject(err);
    });

    extractor.on('close', () => {
      resolve();
    });

    readStream.pipe(extractor);
  });

  // if (!fs.existsSync(outputDir)) {
  //   fs.mkdirSync(outputDir, { recursive: true });
  // }

  // return tar.x({
  //   file: tarFile,
  //   C: outputDir,
  //   gzip: false
  // });
}

const n8nInstalledMarkFile = path.join(process.resourcesPath, "n8n.installed");


const extract = require('extract-zip');

const kill = require('tree-kill');

ipcMain.handle('check-mark-file', async () => {
  if (!app.isPackaged) {
    return true;
  }

  return fs.existsSync(n8nInstalledMarkFile);
});

ipcMain.handle('get-n8n-data-folder', async () => {
  return path.join(app.getPath('userData'), 'n8n-data');
});


let n8nProcess;

function touchFile(filePath) {
  const time = new Date();

  try {
    // Update the timestamp if file exists
    fs.utimesSync(filePath, time, time);
  } catch (err) {
    // If file does not exist, create an empty file
    fs.closeSync(fs.openSync(filePath, 'w'));
  }
}

async function ensureN8n() {
  if (!app.isPackaged) {
    return;
  }

  console.log(`checking touch file ${n8nInstalledMarkFile}`);
  if(fs.existsSync(n8nInstalledMarkFile)) {
    return;
  }

  let targetPath;
  let zipPath;
  if (app.isPackaged) {
    targetPath = path.join(process.resourcesPath, 'n8n-dist');
    zipPath = path.join(process.resourcesPath, 'n8n-dist.tar');  
  } else {
    targetPath = String.raw`C:\Users\chenl\AppData\Local\Programs\AutomateJoy\resources\n8n-dist`;
    zipPath = String.raw`C:\Users\chenl\AppData\Local\Programs\AutomateJoy\resources\n8n-dist.tar`;
  }

  console.log('Extracting n8n-dist...');
  console.log(zipPath);
  console.log(targetPath);
  // await extract(zipPath, { dir: targetPath });
  await extractTarGzWithProgress(zipPath, targetPath, (progress) => {
    // console.log(`progress ${progress}`);
    mainWindow.webContents.send('untar-progress', progress);
  });
  
  console.log(`touching ${n8nInstalledMarkFile}`);
  touchFile(n8nInstalledMarkFile);
  mainWindow.webContents.send('untar-complete');
}

/**
 * Get or unpack n8n-dist path.
 * - In dev, use the folder in current working directory.
 * - In packaged mode, unpack n8n-dist to userData once if not unpacked yet.
 */
function getN8nDistPath() {
  if (!app.isPackaged) {
    // Dev mode: assume n8n-dist is next to process.cwd()
    return path.join(process.cwd(), 'n8n-dist');
  }

  // const unpackedPath = path.join(app.getPath('userData'), 'n8n-dist');
  // return unpackedPath;
  return path.join(process.resourcesPath, 'n8n-dist');

  // Packaged mode: extract to userData folder if not already unpacked
  // const unpackedPath = path.join(app.getPath('userData'), 'n8n-dist');
  // const n8nBinaryPath = path.join(
  //   unpackedPath,
  //   'node_modules',
  //   '.bin',
  //   process.platform === 'win32' ? 'n8n.cmd' : 'n8n'
  // );

  // if (fs.existsSync(n8nBinaryPath)) {
  //   console.log('Using cached n8n resources from:', unpackedPath);
  //   return unpackedPath;
  // }

  // // Unpack resources if not unpacked
  // console.log('Unpacking n8n resources to:', unpackedPath);
  // unpackResources(unpackedPath);
  // return unpackedPath;
}

/**
 * Recursively copy folder contents from source to target.
 */
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

/**
 * Copy n8n-dist folder from the app's resources to the unpack target path.
 * Assumes n8n-dist is included in the app bundle under resourcesPath.
 */
function unpackResources(targetPath) {
  const sourcePath = path.join(process.resourcesPath, 'n8n-dist');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source n8n-dist not found at: ${sourcePath}`);
  }

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  console.log('Starting to unpack n8n resources...');
  copyFolderRecursive(sourcePath, targetPath);
  console.log('Successfully unpacked n8n resources to:', targetPath);
}

/**
 * Start the n8n backend process.
 * Spawns n8n CLI from unpacked folder.
 */
async function startN8n() {
  const platform = process.platform; // 'win32', 'darwin', 'linux'
  const arch = process.arch; // 'x64', 'arm64', 'ia32', etc.
  let nodeDir;
  if (app.isPackaged) {
    nodeDir = path.join(process.resourcesPath, 'bin', arch);
  } else {
    nodeDir = path.join(__dirname, 'bin', arch);
  }
  
  // Determine Node binary name & path based on platform
  let nodeBinaryName;
  if (platform === 'win32') {
    nodeBinaryName = 'node.exe';
  } else if(platform === 'darwin') {
    nodeBinaryName = 'node';
  } else {
    console.error(`unsupported platform: ${platform}`);
    return;
  }

  // Path to bundled Node binary inside app resources
  const nodeBinary = path.join(nodeDir, nodeBinaryName);

  const n8nDistPath = getN8nDistPath();

  const n8nBinary = process.platform === 'win32'
    ? path.join(n8nDistPath, 'node_modules', '.bin', 'n8n.cmd')
    : path.join(n8nDistPath, 'node_modules', '.bin', 'n8n');

  if (!fs.existsSync(n8nBinary)) {
    console.error(`n8n binary not found at: ${n8nBinary}`);
    return;
  }

  const env = { ...process.env };
  env.PATH = `${nodeDir}${path.delimiter}${env.PATH || ''}`;

  n8nProcess = spawn(
    n8nBinary,
    ['start'],
    {
      cwd: n8nDistPath,
      env: {
        ...env,
        N8N_HOST: '127.0.0.1',
        N8N_PORT: '5678',
        N8N_USER_FOLDER: path.join(app.getPath('userData'), 'n8n-data'),
      },
      windowsHide: true
    }
  );

  n8nProcess.stdout.on('data', (data) => {
    console.log(`[n8n] ${data.toString()}`);
  });

  n8nProcess.stderr.on('data', (data) => {
    console.error(`[n8n ERROR] ${data.toString()}`);
  });

  n8nProcess.on('close', (code) => {
    console.log(`n8n exited with code ${code}`);
  });
}

/**
 * Kill the n8n process tree before quitting.
 */
function stopN8n(event) {
  if (n8nProcess) {
    event.preventDefault(); // prevent immediate quit
    console.log('Stopping n8n process...');

    return new Promise((resolve) => {
      kill(n8nProcess.pid, 'SIGKILL', (err) => {
        if (err) {
          console.error('Failed to kill n8n process tree:', err);
        } else {
          console.log('n8n process tree killed');
        }
        n8nProcess = null;
        resolve();
      });
    }).then(() => {
      console.log('Exiting app now...');
      app.quit();
    });
  }
}
let mainWindow;

/**
 * Create main Electron browser window.
 */
function createWindow() {

  if (mainWindow) {
    return; // Window already exists
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
    icon: path.join(__dirname, 'icons/icon.png'),
    title: 'AutomateJoy - powered by n8n',
    show: false, // show when ready
  });

  // Hide menu only in packaged version, show it when running locally for debugging
  if (app.isPackaged) {
    mainWindow.removeMenu();
  }

  mainWindow.once('ready-to-show', async () => {
    console.log('Ready to show');
    mainWindow.show();

    try {
      await ensureN8n();
      await startN8n();
      
    } catch (error) {
      console.error('Failed to start application:', error);
      app.quit();
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Renderer page fully loaded');
    // You can send IPC messages or do other setup here
  });

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// App ready handler
app.whenReady().then(async () => {
  console.log('App ready');
  createWindow();
  // mainWindow.show();
  
});

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS activate
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log('Activate window');
    createWindow();
  }
});

// app.on('ready', async () => {
//   console.log("app.ready")
//   await ensureN8n();
// });

// Clean up n8n on app quit
app.on('will-quit', (event) => {
  console.log('App will quit');
  stopN8n(event);
});
