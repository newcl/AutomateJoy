const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;
const shell = electron.shell;
const path = require('path');
const os = require('os');

console.log("what");
console.log(shell);

contextBridge.exposeInMainWorld('electronAPI', {
  checkMarkerFile: () => ipcRenderer.invoke('check-mark-file'),
  onUntarProgress: (callback) => {
    ipcRenderer.on('untar-progress', (event, prog) => callback(prog));
  },
  onUntarComplete: (callback) => {
    ipcRenderer.on('untar-complete', (event) => callback());
  },
  openUrl: (url) => shell.openExternal(url),
  openN8nDataFolder: async () => {
    const dataDir = await ipcRenderer.invoke('get-n8n-data-folder');
    // On Windows, opening a directory path will open in Explorer
    return shell.openPath(dataDir);
  }
});
