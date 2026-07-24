import {app, BrowserWindow} from "electron"

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1264,
    height: 717,
    autoHideMenuBar: true
  })
  
  win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
  createWindow()
})