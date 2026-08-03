import Logger from "electron-log";

let activeWorks = [
    {
        pageName: "Tom3u8",
        workID: 2345234,
        callback: () => {},
        data: { a: 1, b: 2 },
    },
    {
        pageName: "Tom3u8",
        workID: 2345442234,
        callback: () => {},
        data: { a: 4, b: 6 },
    }
];

export const worksManager = {
    async addWork(pageName, workID, call, data = {}) {
        // 包装成Promise
        const callback = () => {
            Promise.resolve(call());
        };
        activeWorks.push({
            pageName: pageName,
            workID: workID,
            callback: callback,
            data: data,
        });
        Logger.info(`addTask: 创建${workID} 进程成功`);
    },
    async stopWork(workID) {
        const item = activeWorks.filter((item) => item.workID == workID)[0];
        if (!item?.callback) {
            return;
        }

        try {
            await item.callback();
            Logger.info(`stopWork： ${item.workID} 进程停止成功`);
        } catch (err) {
            Logger.error(`stopWork: ${item.workID} 进程停止失败`);
        }
        activeWorks = activeWorks.filter((item) => item.workID != workID);
    },
    async getWorks(page) {
        console.log("进来了",page, activeWorks)
        return activeWorks
            .filter((item) => (item.pageName = page))
            .map(({ callback, ...res }) => res);
    },
};
