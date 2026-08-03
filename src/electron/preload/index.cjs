const { contextBridge, ipcRenderer, IpcMainServiceWorker } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder(openFile = "openFile") {
        return ipcRenderer.invoke("select-folder", openFile);
    },
    copyFile(workID, fileNameList, sourcePath, targetPath, type) {
        return ipcRenderer.invoke(
            "copyFile",
            workID,
            fileNameList,
            sourcePath,
            targetPath,
            type,
        );
    },
    // 停止服务
    stopWork(workID) {
        return ipcRenderer.invoke("stopWork", workID);
    },
    // 切片
    segment(workID, sourcePath, targetPath) {
        return ipcRenderer.invoke("segment", workID, sourcePath, targetPath);
    },
    worksManager(action, data) {
        return ipcRenderer.invoke("worksManager", action, data);
    },
    systemApp(action, data){
        return ipcRenderer.invoke("system:app", action, data)
    }
});

contextBridge.exposeInMainWorld("electronIPC", {
    eventName() {
        return ipcRenderer.eventNames();
    },
    addListen(workId, callback) {
        ipcRenderer.on(workId, callback);
        return () => {
            ipcRenderer.removeListener(workId, callback);
        };
    },
    async removeListenByPageName(pageName) {
        // 获取id
        const workList = await ipcRenderer.invoke(
            "worksManager",
            "getWorks",
            pageName,
        );
        for (let work of workList) {
            ipcRenderer.removeAllListeners(work.workID);
        }
    },
});
contextBridge.exposeInMainWorld("electronSent", {
    onCopyFile(callback) {
        ipcRenderer.on("onCopyFile", (event, data) => {
            callback(data);
        });
        return () => {
            ipcRenderer.removeAllListeners("onCopyFile");
        };
    },
    onSegment(callback) {
        ipcRenderer.on("onSegment", (event, data) => {
            callback(data);
        });
        return () => {
            ipcRenderer.removeAllListeners("onSegment");
        };
    },
});
