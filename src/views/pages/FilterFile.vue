<script setup>
import UploadFileView from '@/components/UploadFile.vue'
import { onUnmounted, watch } from 'vue'
import { ref } from 'vue'
const File = ref({})
const countList = ref([])
const sourcePath = ref('')
const targetPath = ref('')
const LineData = ref({})
const isChangeNewFile = ref(true)
const isRuingCopy = ref(false)
const uuid = crypto.randomUUID()

// 停止复制复位函数
function stopCopy() {
    console.log("复位了")
    if (!isRuingCopy.value) { return }
    window.electronAPI.stopTask(uuid)
    isRuingCopy.value = false
}
// 选择路径
const selectFolder = async (path) => {
    if (!window.electronAPI) { console.log("浏览器环境，没有electronAPI"); return }
    await window.electronAPI.selectFolder()
    if (path == 'sourcePath') {
        sourcePath.value = result
    } else {
        targetPath.value = result
    }
}

// 启动或者关闭复制
const copyFile = async () => {
    if (isRuingCopy.value) {
        console.log("停止脚本")
        stopCopy()
        return
    }

    if (!sourcePath.value || !targetPath.value || !countList.value) {

        return
    }
    isRuingCopy.value = true
    LineData.value = {}
    isChangeNewFile.value = false
    console.log("启动运行")
    if (!window.electronAPI) { console.log("浏览器环境，没有electronAPI"); return }
    const result = await window.electronAPI.copyFile(uuid, [...countList.value], sourcePath.value, targetPath.value)
    if (!result) { }
    console.log(result)
}

// 监听进度条
let stoplineListen
if (window.electronSent) {
    stoplineListen = window.electronSent.onCopyFile((data) => {
        LineData.value = data
        if (data.status == 'ok'){stopCopy()}
    })
}

// 退出卸载监听
onUnmounted(() => {
    if (!window.electronAPI) { return }
    window.electronAPI.stopTask(uuid)
    if (stoplineListen) {
        stoplineListen()
    }
})

// 监听上传文件
watch(File, (newFile) => {
    if (!newFile?.name) {
        return
    }

    console.log("上传文件了")

    if (isRuingCopy.value) {
        stopCopy()
    }

    const reader = new FileReader()

    reader.onload = (e) => {
        countList.value = e.target.result.split('\r\n')
    }

    isChangeNewFile.value = true

    reader.readAsText(newFile)
})
</script>
<template>
    <div class="px-20 py-6 flex flex-col gap-10 v-full overflow-y-scroll">
        <div>
            <span
                class="select-none ml-2 mb-4 text-black/75 font-bold text-xl flex items-center gap-3 before:content-[''] before:w-1 before:h-6 before:bg-[#4fd1c5] before:rounded">
                上传文件
            </span>
            <div class="w-full bg-white rounded-xl py-3 px-4 gap-6 flex items-center justify-between min-w-175">
                <UploadFileView v-model="File" class="w-40 h-40"></UploadFileView>
                <div class="select-none font-serif grid-cols-2 grid flex-1 gap-8">
                    <span>📄文件：{{ File.name || '' }}</span>
                    <span>🔢大小：{{ File.size || '' }}</span>
                    <span>🪨类型：{{ File.type || '' }}</span>
                    <span>🪨数量：{{ countList.length || '' }}</span>
                </div>
            </div>
        </div>
        <div>
            <span
                class=" select-none ml-2 mb-4 text-black/75 font-bold text-xl flex items-center gap-3 before:content-[''] before:w-1 before:h-6 before:bg-[#4fd1c5] before:rounded">
                选择路径
            </span>
            <div
                class=" overflow-hidden relative w-full bg-white rounded-xl py-3 px-4 gap-6 flex items-center min-w-175">
                <div class="flex flex-col gap-2 select-none">
                    资源路径
                    <div class="mb-3 flex items-center gap-4">
                        <input v-model="sourcePath"
                            class="w-90 h-9 font-normal text-black/80 rounded border border-black/30 shadow-2xs px-3 focus:border-[#4fd1c5] focus:outline focus:outline-[#4fd1c5]" />
                        <div @click="selectFolder('sourcePath')"
                            class="bg-[#4fd1c5] w-20 shadow-2xs shadow-black/20 text-white font-medium cursor-pointer select-none hover:shadow-xs transition-all h-9 rounded flex items-center justify-center">
                            浏览
                        </div>
                    </div>
                    目标路径
                    <div class="mb-3 flex items-center gap-4">
                        <input v-model="targetPath"
                            class="w-90 h-9 font-normal text-black/80 rounded border border-black/30 shadow-2xs px-3 focus:border-[#4fd1c5] focus:outline focus:outline-[#4fd1c5]" />
                        <div @click="selectFolder('targetPath')"
                            class="bg-[#4fd1c5] w-20 shadow-2xs shadow-black/20 text-white font-medium cursor-pointer select-none hover:shadow-xs transition-all h-9 rounded flex items-center justify-center">
                            浏览
                        </div>
                    </div>
                </div>
                <div class="w-40 h-35  flex flex-col items-center">
                    <div @click="copyFile()" :class="!sourcePath || !targetPath || !countList.length ? 'validatorF' : ''"
                        class="mt-4  text-white select-none hover:bg-[#4fd1c5] active:shadow-inner transition-all cursor-pointer bg-[#4fd1c5]/90 shadow w-20 h-9 rounded flex items-center justify-center font-medium">
                        {{ isRuingCopy ? '取消' : '开始' }}</div>
                </div>
                <span v-if="!isChangeNewFile" class="absolute bottom-1 left-1 text-[9px] text-black/40">
                    <template v-if="LineData.status === 'copying'">
                        正在复制：{{ LineData.path }}
                    </template>

                    <template v-else-if="LineData.status === 'ok'">
                        成功
                    </template>

                    <template v-else-if="LineData.status === 'error'">
                        错误
                    </template>

                    <template v-else-if="LineData.status === 'stop'">
                        停止
                    </template>
                </span>
                <span v-if="!isChangeNewFile"
                    :style="{ width: `${Math.round(+LineData.cursor / +LineData.length * 100)}%`, 'background-color': `${['error', 'stop'].includes(LineData.status) ? 'rgba(255, 0, 0, 0.5)' : ''}` }"
                    class="h-1 absolute bg-[#4fd1c5] bottom-0 left-0 "></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.validatorF:hover {
    background-color: rgba(255, 0, 0, 0.518);
}
</style>