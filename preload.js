const { contextBridge, ipcRenderer } = require('electron');

console.log("what");

contextBridge.exposeInMainWorld('electronAPI', {
  checkMarkerFile: () => ipcRenderer.invoke('check-mark-file'),
  onUntarProgress: (callback) => {
    ipcRenderer.on('untar-progress', (event, prog) => callback(prog));
  }
});
