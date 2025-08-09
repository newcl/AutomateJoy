const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const kill = require('tree-kill');

let n8nProcess;

// Function to check if resources are already unpacked
function getN8nDistPath() {
  if (!app.isPackaged) {
    return path.join(process.cwd(), 'n8n-dist');
  }

  // Check if resources are already unpacked to user data directory
  const unpackedPath = path.join(app.getPath('userData'), 'n8n-dist');
  const n8nBinaryPath = path.join(unpackedPath, 'node_modules', '.bin', process.platform === 'win32' ? 'n8n.cmd' : 'n8n');
  
  if (fs.existsSync(n8nBinaryPath)) {
    console.log('Using cached n8n resources from:', unpackedPath);
    return unpackedPath;
  }

  // Resources not unpacked yet, need to copy them
  console.log('Unpacking n8n resources to:', unpackedPath);
  return unpackResources(unpackedPath);
}

// Function to unpack resources from the app bundle
function unpackResources(targetPath) {
  const sourcePath = path.join(process.resourcesPath, 'n8n-dist');
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source n8n-dist not found at: ${sourcePath}`);
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  // Copy the entire n8n-dist folder
  console.log('Starting to unpack n8n resources...');
  copyFolderRecursive(sourcePath, targetPath);
  
  console.log('Successfully unpacked n8n resources to:', targetPath);
  return targetPath;
}

// Function to recursively copy a folder
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

async function startN8n() {
  const n8nDistPath = getN8nDistPath();
  
  // Use npx to start n8n from the installed npm package
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
    console.log(`[n8n] ${data}`);
  });

  n8nProcess.stderr.on('data', (data) => {
    console.error(`[n8n ERROR] ${data}`);
  });

  n8nProcess.on('close', (code) => {
    console.log(`n8n exited with code ${code}`);
  });
}

function stopN8n(event) {
  if (n8nProcess) {
    event.preventDefault(); // prevent immediate quit
    console.log('stopping n8n');
    
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
      console.log('calling app.quit() now');
      app.quit();
    });
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'Pody - n8n Workflow Automation',
    show: false // Don't show until ready
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Wait a few seconds for n8n to boot, then load it directly
//   setTimeout(() => {
//     mainWindow.loadURL('http://127.0.0.1:5678');
//   }, 4000);

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// When Electron is ready
app.whenReady().then(async () => {
  try {
    // Start n8n (this will handle resource unpacking if needed)
    await startN8n();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Kill n8n when quitting
app.on('will-quit', (event) => {
  console.log('will-quit');
  stopN8n(event);
});
