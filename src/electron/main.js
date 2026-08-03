import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import "./function.js";
import "./hadleAPI.js"
import { worksManager } from "./utils/worksManager.js";
import log from "electron-log/main";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 初始化日志
log.initialize();
log.transports.console.level = "info";
log.transports.file.level = "info";
log.transports.console.format =
    "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

let win;
const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        autoHideMenuBar: true,
        icon: "/logo.png",
        webPreferences: {
            preload: path.join(__dirname, "preload", "index.cjs"),
        },
    });

    win.loadFile("dist/index.html");
};

ipcMain.handle("select-folder", async (event, properties) => {
    const result = await dialog.showOpenDialog(win, {
        properties: [properties],
        title: "请选择文件",
    });
    if (result.canceled) {
        return null;
    } else {
        return result.filePaths[0];
    }
});

ipcMain.handle("stopWork", async (event, uuid) => {
    console.log("后端停止");
    worksManager.stopWork(uuid);
});

app.whenReady().then(() => {
    createWindow();
});