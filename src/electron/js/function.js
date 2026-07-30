import { ipcMain } from "electron";
import fs from "fs";
import path from "path";

ipcMain.handle("copyFile", async (event, fileNameList, sourcePath, targetPath) => {
    console.log(fileNameList, sourcePath, targetPath);
    const results = [];
    for (const fileName of fileNameList) {
        if (!fileName) { continue }
        console.log(`正在复制：${path.join(sourcePath, fileName)}`)
        fs.copyFileSync(
            path.join(sourcePath, fileName),
            path.join(targetPath, fileName)
        );
    }
    return results;
});