<script setup>
import App from "@/components/App.vue";
</script>

<template>
    <div class="px-20 py-6 flex flex-col gap-10 v-full overflow-y-scroll">
        <div
            class="w-full bg-white grid-cols-5 grid rounded-xl py-3 px-4 xl:grid-cols-6 2xl:grid-cols-8 gap-7 min-w-175"
        >
            <App title="筛选文件" icon="📄" urlName="FilterFile"></App>
            <App title="视频转码" icon="🎬" urlName="Tom3u8"></App>
        </div>
    </div>
</template>
