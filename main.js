const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const kill = require('tree-kill');


let n8nProcess;

function startN8n() {
  // Use npx to start n8n from the installed npm package
  const n8nBinary = process.platform === 'win32'
  ? path.join(process.cwd(), 'n8n-dist', 'node_modules', '.bin', 'n8n')
  : path.join(process.cwd(), 'n8n-dist', 'node_modules', '.bin', 'n8n');
  
  n8nProcess = spawn(
    n8nBinary,
    ['start'],
    {
      cwd: process.cwd(),
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
    title: 'Pody - n8n Workflow Automation'
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
app.whenReady().then(() => {
  startN8n();
  createWindow();
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
