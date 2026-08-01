const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder(fileType='File') {
    return ipcRenderer.invoke('select-folder',fileType)
  },
  copyFile(uuid, fileNameList, sourcePath, targetPath, type) {
    return ipcRenderer.invoke('copyFile', uuid, fileNameList, sourcePath, targetPath, type)
  },
  stopTask(uuid) {
    return ipcRenderer.invoke('stopTask', uuid)
  }
})

contextBridge.exposeInMainWorld('electronSent', {
  onCopyFile(callback) {
    ipcRenderer.on('onCopyFile', (event, data) => { callback(data) })
    console.log("触发监听")
    return () => { ipcRenderer.removeAllListeners('onCopyFile') }
  }
})
