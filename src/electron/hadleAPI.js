import { ipcMain } from "electron";
import { worksManager } from "./utils/worksManager.js";
import Logger from "electron-log";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// workersManager
ipcMain.handle("worksManager",(event, action,data)=>{
    Logger.info(action,data)
    return worksManager[action](data)
})


// system:app Manager
ipcMain.handle("system:app",async (event, action, data)=>{
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename);
    const apps = await fs.promises.readdir(path.join(__dirname, './appjs'))
    console.log(apps)
    Logger.info(apps)
    Logger.info(action,data)
    switch (action){
        case "addWork":
            const func = await import(`./appjs/${data.pageName}.js`)
            console.log(func)
            data.event = event
            return await func.default(data)
    }
})