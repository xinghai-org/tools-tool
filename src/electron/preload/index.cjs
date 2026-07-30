const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder() {
    return ipcRenderer.invoke('select-folder')
  },
  copyFile(fileNameList, sourcePath, targetPath){
    return ipcRenderer.invoke('copyFile',fileNameList, sourcePath, targetPath)
  }
})
