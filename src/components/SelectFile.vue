<script setup>
import { ref } from 'vue';
import log from 'electron-log/renderer';
const path = ref('')

// 获取信息
const props =  defineProps(['Pathtype'])

// 选择文件或者文件夹
async function selectFolder(){
    if (!window.electronAPI){
        console.log("浏览器环境没有electronAPI")
        return
    }
    if (!props.Pathtype){
        log.info(`缺少参数 Pathtype`)
        return
    }
    log.info(`选择${props.Pathtype}`)
    const result = await window.electronAPI.selectFolder(props.Pathtype)
    log.info(`路径选择成功：${result}`)
}


</script>

<template>
    <div class="mb-3 flex items-center gap-4">
        <input v-model="path"
            class="flex-1 h-9 font-normal text-black/80 rounded border border-black/30 shadow-2xs px-3 focus:border-[#4fd1c5] focus:outline focus:outline-[#4fd1c5]" />
        <div @click="selectFolder"
            class="bg-[#4fd1c5] w-20 min-w-20 shadow-2xs shadow-black/20 text-white font-medium cursor-pointer select-none hover:shadow-xs transition-all h-9 rounded flex items-center justify-center">
            浏览
        </div>
    </div>
</template>