<script setup>
import UploadFileView from '@/components/UploadFile.vue'
import { watchEffect } from 'vue'
import { ref } from 'vue'
const File = ref({})
const countList = ref([])
const sourcePath = ref('')
const targetPath = ref('')

const selectFolder = async (path) => {
    if (!window.electronAPI) { console.log("浏览器环境，没有electronAPI"); return }
    const result = await window.electronAPI.selectFolder()
    if (!result) { return }
    if (path == 'sourcePath') {
        sourcePath.value = result
    } else {
        targetPath.value = result
    }
}

const copyFile = async () => {
    if (!window.electronAPI) { console.log("浏览器环境，没有electronAPI"); return }
    const result = await window.electronAPI.copyFile([...countList.value], sourcePath.value, targetPath.value)
    console.log(result)
}

watchEffect(() => {
    if (!File.value?.name) {
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        countList.value = e.target.result.split('\r\n')
    }
    reader.readAsText(File.value)
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
            <div class="w-full bg-white rounded-xl py-3 px-4 gap-6 flex items-center min-w-175">
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
                    <div
                    @click="copyFile()"
                        class="mt-4 text-white select-none hover:bg-[#4fd1c5] active:shadow-inner transition-all cursor-pointer bg-[#4fd1c5]/90 shadow w-20 h-9 rounded flex items-center justify-center font-medium">
                        确定</div>
                </div>
            </div>
        </div>
    </div>
</template>
