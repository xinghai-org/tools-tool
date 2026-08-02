import { ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { worksManager } from "../utils/worksManager.js";
import { spawn } from "child_process";
import Logger from "electron-log/main";
import { once } from "events";
import ffmpeg from "ffmpeg-static";

export default async (event, workerID, sourcePath, targetPath) => {
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
    await worksManager.addTask(uuid, () => {
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
    worksManager.stopTask(uuid);
    return "ok";
};
