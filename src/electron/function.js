import { ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { worksManager } from "./utils/worksManager.js";
import { spawn, spawnSync } from "child_process";
import Logger from "electron-log/main";
import { once } from "events";
import ffmpeg from "ffmpeg-static";

// 判断是否在一个盘
function isSameDriveWindow(path1, path2) {
    const drive1 = path.parse(path1).root;
    const drive2 = path.parse(path2).root;
    return drive1 == drive2;
}

ipcMain.handle(
    "copyFile",
    async (event, uuid, fileNameList, sourcePath, targetPath, CopyType) => {
        let isRun = true;
        worksManager.addTask(uuid, () => {
            isRun = false;
        });
        console.log(fileNameList, sourcePath, targetPath);

        // 200毫秒设置一次进度条，避免卡死
        let lastSendTime = 0;
        let fileName;
        let index;
        // 循环复制
        for ([index, fileName] of fileNameList.entries()) {
            if (!isRun) {
                event.sender.send("onCopyFile", {
                    status: "stop",
                    path: path.join(sourcePath, fileName),
                    length: fileNameList.length,
                    cursor: index,
                });
                return false;
            }
            if (!fileName) {
                continue;
            }

            // 文件路径
            const SPath = path.join(sourcePath, fileName);
            const TPath = path.join(targetPath, fileName);
            // 核心代码
            const now = Date.now();
            if (now - lastSendTime > 100) {
                event.sender.send("onCopyFile", {
                    status: "copying",
                    path: SPath,
                    length: fileNameList.length,
                    cursor: index,
                });
                lastSendTime = now;
            }
            try {
                if (isSameDriveWindow(SPath, TPath) && CopyType == "move") {
                    await fs.promises.rename(SPath, TPath);
                } else {
                    await fs.promises.copyFile(SPath, TPath);
                    if (CopyType == "move") {
                        await fs.promises.unlink(SPath);
                    }
                }
            } catch (error) {
                console.log(error);
                event.sender.send("onCopyFile", {
                    status: "error",
                    path: SPath,
                    length: fileNameList.length,
                    cursor: index,
                });
                console.log(`失败：${SPath}`);
                return false;
            }
        }
        event.sender.send("onCopyFile", {
            status: "ok",
            path: path.join(sourcePath, ""),
            length: fileNameList.length,
            cursor: fileNameList.length,
        });

        worksManager.stopTask(uuid);
        return true;
    },
);

ipcMain.handle("segment", async (event, uuid, sourcePath, targetPath) => {
    // 判断路径
    for (let path of [sourcePath, targetPath]) {
        try {
            await fs.promises.access(path);
        } catch (err) {
            Logger.error(`路径不存在： ${path}`);
            event.sender.send("onSegment", {
                type: "errorLog",
                info: `路径不存在： ${path}`,
            });
        }
    }
    // 判断有么有
    const FileList = [];
    for (let file of await fs.promises.readdir(sourcePath)) {
        const filename = file.toString().slice(0, 14);
        Logger.info("正在检查：", filename);
        if (/^\d+$/.test(filename) && filename.length == 14) {
            FileList.push(file);
        }
    }
    event.sender.send("onSegment", {
        type: "FileList",
        info: FileList,
    });

    console.log(FileList);

    // 创建路径

    await fs.promises.mkdir(path.join(targetPath, FileList[0].slice(0, 14)), {
        recursive: true,
    });

    const dir = spawn(ffmpeg, [
        "-i",
        path.join(sourcePath, FileList[0]),
        "-map",
        "0",
        "-f",
        "segment",
        "-segment_time",
        " 10",
        "-segment_list",
        path.join(targetPath, FileList[0].slice(0, 14), "playlist.m3u8"),
        path.join(targetPath, FileList[0].slice(0, 14), "output%5d.ts"),
    ]);
    worksManager.addTask(uuid, () => {
        dir.kill();
    });
    dir.stderr.on("data", (data) => {
        Logger.info(data.toString("utf8"));
    });
    dir.stdout.on("data", (data) => {
        Logger.info(data.toString("utf8"));
    });

    dir.on("error", (err) => {
        Logger.error(`进程启动异常，错误： ${err}`);
    });

    const [code] = await once(dir, "close");
    Logger.info(code);
    worksManager.stopWork(uuid);
    return "ok";
});
