import { ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { taskManager } from "./taskManager.js";

ipcMain.handle("copyFile", async (event, uuid, fileNameList, sourcePath, targetPath) => {
    taskManager.addTask(uuid)
    console.log(fileNameList, sourcePath, targetPath);


    // 200毫秒设置一次进度条，避免卡死
    let lastSendTime = 0
    // 循环复制
    for (const [index, fileName] of fileNameList.entries()) {
        if (!taskManager.isActive(uuid)) {
            event.sender.send('onCopyFile', { status: 'stop', path: path.join(sourcePath, fileName), length: fileNameList.length, cursor: index })
            return false
        }
        if (!fileName) { continue }

        // 核心代码
        // console.log(`正在复制：${path.join(sourcePath, fileName)}`)
        const now = Date.now()
        if (now - lastSendTime > 100) {
            event.sender.send('onCopyFile', { status: 'copying', path: path.join(sourcePath, fileName), length: fileNameList.length, cursor: index })
            lastSendTime = now
        }
        try {
            await fs.promises.copyFile(
                path.join(sourcePath, fileName),
                path.join(targetPath, fileName)
            );

        } catch {
            event.sender.send('onCopyFile', { status: 'error', path: path.join(sourcePath, fileName), length: fileNameList.length, cursor: index })
            console.log(`复制失败：${path.join(sourcePath, fileName)}`)
            return false
        }

    }
    event.sender.send('onCopyFile', { status: 'ok', path: path.join(sourcePath, ''), length: fileNameList.length, cursor: fileNameList.length })

    taskManager.stopTask(uuid)
    return true;
});