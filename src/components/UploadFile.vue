<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'

const description = ref("点击或拖动上传文件")
const icon = ref("⬆️")
const fileTypeStatus = ref(null)
// 允许上传的类型
const allowedTypes = [
    'txt',
    'text/plain',
    'text',
    'text/javascript'
];

// 点击上传
const inputElement = document.createElement('input')
inputElement.type = 'file'
inputElement.accept = ".txt,.text,text/plain"


defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
inputElement.addEventListener('change', (e) => {
    if (!e.target.files[0]?.name) { return }
    const file = e.target.files[0]
    authType(file)
    emit("update:modelValue", file)
})


// 拖拽上传
const uploadEl = ref('')
const isDragent = ref(false)
onMounted(() => {
    uploadEl.value.addEventListener('dragover', e => e.preventDefault());
    // 拖拽在半空
    uploadEl.value.addEventListener('dragenter', (e) => {
        e.preventDefault()
        if (!uploadEl.value.contains(e.relatedTarget)) {
            isDragent.value = true;
        }
    })
    // 拖拽离开
    uploadEl.value.addEventListener('dragleave', (e) => {
        e.preventDefault()
        if (!uploadEl.value.contains(e.relatedTarget)) {
            isDragent.value = false;
        }
    })
    // 放开文件
    uploadEl.value.addEventListener('drop', (e) => {
        e.preventDefault()
        console.log("文件上传")
        console.log(e.dataTransfer.files)
        if (e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            authType(file)
            emit("update:modelValue", file)
        }
        isDragent.value = false;
    })
})

// 校验文件类型
function authType(file) {
    if (!allowedTypes.includes(file.type)) {
        description.value = "只支持上传文本"
        icon.value = "❌"
    } else {
        description.value = "成功"
        icon.value = "✅"
    }
}


</script>
<template>
    <div @click="inputElement.click()" ref="uploadEl" :class="isDragent ? 'bg-[#4fd1c5]/8' : 'bg-white'"
        class=" active:bg-[#4fd1c5]/8 transition-all border-black/10 select-none cursor-pointer hover:border-[#4fd1c5] border rounded-2xl flex flex-col items-center justify-center gap-4">
        <div class="text-4xl">{{ icon }}</div>
        <div class="font-medium text-xs">{{ description }}</div>
    </div>
</template>