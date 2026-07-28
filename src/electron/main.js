import {app, BrowserWindow} from "electron"

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    autoHideMenuBar: true,
    icon: '/logo.png'
  })
  
  win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
  createWindow()
})