const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder() {
    return ipcRenderer.invoke('select-folder')
  },
  copyFile(uuid, fileNameList, sourcePath, targetPath) {
    return ipcRenderer.invoke('copyFile', uuid, fileNameList, sourcePath, targetPath)
  },
  stopTask(uuid) {
    return ipcRenderer.invoke('stopTask', uuid)
  }
})

contextBridge.exposeInMainWorld('electronSent', {
  onCopyFile(callback) {
    ipcRenderer.on('onCopyFile', (event, data) => { callback(data) })
    console.log("触发监听")
    return ()=>{ipcRenderer.removeAllListeners('onCopyFile')}
  }
})
