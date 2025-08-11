const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;
const shell = electron.shell;

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
  openUrl: (url) => shell.openExternal(url)
});
