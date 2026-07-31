import { ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { taskManager } from "./taskManager.js";


// 判断是否在一个盘
function isSameDriveWindow(path1, path2) {
    const drive1 = path.parse(path1).root
    const drive2 = path.parse(path2).root
    return drive1 == drive2
}

ipcMain.handle("copyFile", async (event, uuid, fileNameList, sourcePath, targetPath, CopyType) => {

    taskManager.addTask(uuid)
    console.log(fileNameList, sourcePath, targetPath);


    // 200毫秒设置一次进度条，避免卡死
    let lastSendTime = 0
    let fileName
    let index
    // 循环复制
    for ([index, fileName] of fileNameList.entries()) {
        if (!taskManager.isActive(uuid)) {
            event.sender.send('onCopyFile', { status: 'stop', path: path.join(sourcePath, fileName), length: fileNameList.length, cursor: index })
            return false
        }
        if (!fileName) { continue }

        // 文件路径
        const SPath = path.join(sourcePath, fileName)
        const TPath = path.join(targetPath, fileName)
        // 核心代码
        const now = Date.now()
        if (now - lastSendTime > 100) {
            event.sender.send('onCopyFile', { status: 'copying', path: SPath, length: fileNameList.length, cursor: index })
            lastSendTime = now
        }
        try {
            if (isSameDriveWindow(SPath, TPath) && CopyType == 'move') {
                await fs.promises.rename(SPath,TPath)
            } else {
                await fs.promises.copyFile(SPath, TPath)
                if (CopyType == 'move') {
                    await fs.promises.unlink(SPath)
                }
            }
        } catch (error) {
            console.log(error)
            event.sender.send('onCopyFile', { status: 'error', path: SPath, length: fileNameList.length, cursor: index })
            console.log(`失败：${SPath}`)
            return false
        }

    }
    event.sender.send('onCopyFile', { status: 'ok', path: path.join(sourcePath, ''), length: fileNameList.length, cursor: fileNameList.length })

    taskManager.stopTask(uuid)
    return true;
});