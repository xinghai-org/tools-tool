import { ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { worksManager } from "../utils/worksManager.js";
import { spawn, spawnSync } from "child_process";
import Logger from "electron-log/main";
import { once } from "events";
import ffmpeg from "ffmpeg-static";

export default async ({ pageName, event, workID, sourcePath, targetPath }) => {
    console.log(event, workID, sourcePath, targetPath)
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

    // 判断有没有文件
    const FileList = [];
    for (let file of await fs.promises.readdir(sourcePath)) {
        const filename = file.toString().slice(0, 14);
        Logger.info("正在检查：", filename);
        if (/^\d+$/.test(filename) && filename.length == 14) {
            FileList.push(file);
        }
    }
    event.sender.send(workID, {
        action: "FileList",
        info: FileList,
    });
    console.log(FileList);


    // 获取总时长（秒）
    let TotalTime = 0
    for (let file of FileList) {
        const result = spawnSync(ffmpeg, ["-i", path.join(sourcePath, file)])
        const time = result.stderr.toString().match(/Duration: (\d+):(\d+):(.*?),/)
        TotalTime += (+time[1] * 3600 + +time[2] * 60 + +time[3])

    }
    Logger.info("总时长", TotalTime)


    // 进行转码
    // 当前时常
    let CurrentTime = 0
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


        // 创建路径
        await fs.promises.mkdir(path.join(targetPath, file.slice(0, 14)), {
            recursive: true,
        });


        // 添加到worksManager管理
        await worksManager.addWork(pageName, workID, () => {
            console.log("停止了")
            dir.kill();
        }, {});


        // 监听信息
        dir.stderr.on("data", (data) => {
            const retime = data.match(/time=(\d+):(\d+):(\d+.\d+\d) /)
            if (retime) {
                let Progress = (+retime[1] * 3600 + +retime[2] * 60 + +retime[3]) + CurrentTime
                event.sender.send(workID, { action: 'progrees', TotalTime: TotalTime, Progress: Progress });
            }
            event.sender.send(workID, { action: "info", info: data.toString("utf8") });
        });
        dir.stdout.on("data", (data) => {
            event.sender.send(workID, { action: "info", info: data.toString("utf8") });
        });
        dir.on("error", (err) => {
            event.sender.send(workID, { action: 'info', info: `进程启动异常，错误： ${err}` });
            Logger.error(`进程启动异常，错误： ${err}`);
        });


        // 等待执行结果
        const [code, signal] = await once(dir, "close");


        // 通过信号和code判断执行成功还是错误
        if (code == 0) {
            event.sender.send(workID, { action: "info", info: `成功：${file}，退出码：${code}，信号：${signal}` });
            Logger.info(`成功：${file}，退出码：${code}，信号：${signal}`)
        } else {
            Logger.error(
                `处理失败：${file}，退出码：${code}，信号：${signal}`
            );
            event.sender.send(workID, { action: info, info: `处理失败：${file}，退出码：${code}，信号：${signal}` });
        }
    }


    // 退出之前结束workersManager的进程
    worksManager.stopWork(workID);
    return "ok";
};

23.32