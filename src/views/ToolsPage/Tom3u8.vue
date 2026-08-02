<script setup>
import APPTemplate from "@/components/APPTemplate.vue";
import SelectFile from "@/components/SelectFile.vue";
import Button1 from "@/components/Button1.vue";
import { onMounted, onUnmounted, ref } from "vue";
import log from "electron-log/renderer";
import { useRoute } from "vue-router";

// 组件状态
const sourcePath = ref("");
const targetPath = ref("");
let stopListent = "";
const removeListenList = [];
// 启动进程的唯一uuid
const workID = 0;
const route = useRoute();
// 清除输入框
function clearInput() {
    sourcePath.value = "";
    targetPath.value = "";
}

// 启动监听
onMounted(async () => {
    if (window.electronAPI) {
        stopListent = window.electronSent.onSegment((data) => {
            console.log(data);
        });
        const result = await window.electronAPI.worksManager(
            "getWorks",
            route.name,
        );
        log.info(result);
        for (let item of result) {
            const func = await window.electronIPC.addListen(
                item.workID,
                (event, data) => {
                    console.log(data);
                },
            );
            removeListenList.push(func);
        }
        log.info(await window.electronIPC.eventName());
    }
});

onUnmounted(async () => {
    if (window.electronAPI) {
        stopListent();
        for (let func of removeListenList) {
            await func();
        }
        log.info(await window.electronIPC.eventName());
        console.log("退出");
    }
});

// 启动切片
async function segment() {
    if (!window.electronAPI) {
        console.log("浏览器环境没有electronAPI");
        return;
    }
    if (!sourcePath || !targetPath) {
        return;
    }
    console.log("启动");
    const result = await window.electronAPI.segment(
        workID,
        sourcePath.value,
        targetPath.value,
    );
    if (result) log.info(result);
}
</script>

<template>
    <APPTemplate>
        <template #content>
            <div>
                <span
                    class="select-none ml-2 mb-4 text-black/75 font-bold text-xl flex items-center gap-3 before:content-[''] before:w-1 before:h-6 before:bg-[#4fd1c5] before:rounded"
                >
                    选择路径
                </span>
                <div class="bg-white rounded-lg min-w-175 flex gap-4 p-4">
                    <div class="flex flex-col justify-center">
                        <span class="text-lg mt-3 mb-1">💾 资源路径</span>
                        <div class="flex items-center gap-7">
                            <SelectFile
                                properties="openDirectory"
                                v-model="sourcePath"
                                class="w-120"
                            >
                            </SelectFile>
                            <Button1
                                @click="segment"
                                :active="sourcePath && targetPath"
                                >切片</Button1
                            >
                        </div>
                        <span class="text-lg mt-3 mb-1">🗂️ 目标路径</span>
                        <div class="flex items-center gap-7">
                            <SelectFile
                                properties="openDirectory"
                                v-model="targetPath"
                                class="w-120"
                            ></SelectFile>
                            <Button1 @click="clearInput">清除</Button1>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </APPTemplate>
</template>
