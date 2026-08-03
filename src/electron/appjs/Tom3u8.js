import { ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { worksManager } from "../utils/worksManager.js";
import { spawn } from "child_process";
import Logger from "electron-log/main";
import { once } from "events";
import ffmpeg from "ffmpeg-static";

export default async ({pageName, event, workID, sourcePath, targetPath}) => {
    console.log(event,workID, sourcePath,targetPath)
    // 判断路径
    for (let path of [sourcePath, targetPath]) {
        try {
            await fs.promises.access(path);
        } catch (err) {
            Logger.error(`路径不存在： ${path}`);
            event.sender.send(workID, {
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
    event.sender.send(workID, {
        type: "FileList",
        info: FileList,
    });

    console.log(FileList);

    // 创建路径

    await fs.promises.mkdir(path.join(targetPath, FileList[0].slice(0, 14)), {
        recursive: true,
    });

    for (let file of FileList) {
        const dir = spawn(ffmpeg, [
            "-i",
            path.join(sourcePath, file),
            "-map",
            "0",
            "-f",
            "segment",
            "-segment_time",
            "10",
            "-segment_list",
            path.join(targetPath, file.slice(0, 14), "playlist.m3u8"),
            path.join(targetPath, file.slice(0, 14), "output%5d.ts"),
        ]);
        await worksManager.addWork(pageName, workID, () => {
            console.log("停止了")
            dir.kill();
        },{});
        dir.stderr.on("data", (data) => {
            event.sender.send(workID,data.toString("utf8"));
        });
        dir.stdout.on("data", (data) => {
            event.sender.send(workID,data.toString("utf8"));
        });
        dir.on("error", (err) => {
            Logger.error(`进程启动异常，错误： ${err}`);
        });
        const [code, signal] = await once(dir, "close");
        if (code == 0){
            Logger.info(`成功：${file}，退出码：${code}，信号：${signal}`)
        }else{
            Logger.error(
            `处理失败：${file}，退出码：${code}，信号：${signal}`
        );
        }
    }
    worksManager.stopWork(workID);
    return "ok";
};
