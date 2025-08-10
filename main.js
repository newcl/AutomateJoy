const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const kill = require('tree-kill');

let n8nProcess;

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

  // Packaged mode: extract to userData folder if not already unpacked
  const unpackedPath = path.join(app.getPath('userData'), 'n8n-dist');
  const n8nBinaryPath = path.join(
    unpackedPath,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'n8n.cmd' : 'n8n'
  );

  if (fs.existsSync(n8nBinaryPath)) {
    console.log('Using cached n8n resources from:', unpackedPath);
    return unpackedPath;
  }

  // Unpack resources if not unpacked
  console.log('Unpacking n8n resources to:', unpackedPath);
  unpackResources(unpackedPath);
  return unpackedPath;
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
  const n8nDistPath = getN8nDistPath();

  const n8nBinary = process.platform === 'win32'
    ? path.join(n8nDistPath, 'node_modules', '.bin', 'n8n.cmd')
    : path.join(n8nDistPath, 'node_modules', '.bin', 'n8n');

  if (!fs.existsSync(n8nBinary)) {
    console.error(`n8n binary not found at: ${n8nBinary}`);
    return;
  }

  n8nProcess = spawn(
    n8nBinary,
    ['start'],
    {
      cwd: n8nDistPath,
      env: {
        ...process.env,
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
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Pody - n8n Workflow Automation',
    show: false, // show when ready
  });

  mainWindow.once('ready-to-show', () => {
    console.log('Ready to show');
    mainWindow.show();
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// App ready handler
app.whenReady().then(async () => {
  console.log('App ready');
  createWindow();
  // mainWindow.show();
  try {
    await startN8n();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
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

// Clean up n8n on app quit
app.on('will-quit', (event) => {
  console.log('App will quit');
  stopN8n(event);
});
