import { ipcMain } from "electron";
import { worksManager } from "./utils/worksManager.js";
import Logger from "electron-log";

// workersManager
ipcMain.handle("worksManager",(event, action,data)=>{
    Logger.info(action,data)
    return worksManager[action](data)
})