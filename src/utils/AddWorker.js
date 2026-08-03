import router from "@/router"
import Logger from "electron-log/renderer"

export default async (data, pageName = router.currentRoute.value.name, workID = crypto.randomUUID()) => {
    if (!window.electron) {
        Logger.info("浏览器环境没有electronAPI")
        console.log("浏览器环境没有electronAPI")
    }
    return [window.electronAPI.systemApp("addWork", { pageName: pageName, workID: workID, ...data }), workID]
}