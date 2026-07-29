import { app, BrowserWindow, dialog, ipcMain } from "electron"

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    autoHideMenuBar: true,
    icon: '/logo.png',
    webPreferences: {
      preload:'E:\\Project\\tools-tool\\src\\electron\\preload\\index.cjs'
    }
  })


  win.loadFile('dist/index.html')
}

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: '请选择文件夹'
  })
  if (result.canceled) {
    return null
  } else {
    return result.filePaths[0]
  }
})

app.whenReady().then(() => {
  createWindow()
})