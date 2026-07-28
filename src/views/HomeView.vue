<script setup>
import { RouterView } from 'vue-router';
import HomeIcon from '@/assets/svgs/Home.vue'
import LogoIcon from '@/assets/svgs/Logo.vue'
import SettingIcon from '@/assets/svgs/Setting.vue'
import ToolIcon from '@/assets/svgs/Tool.vue'
</script>

<template>
    <div class="grid grid-cols-[220px_1fr] h-screen bg-[#f0f2f5]">
        <!-- Title -->
        <div class="flex flex-col gap-6 p-5 bg-white">
            <div class="flex items-center gap-3 px-3 py-2">
                <div class="bg-[#5ed3c7] w-10 h-10 flex items-center justify-center rounded-lg">
                    <LogoIcon class="w-5 h-5"></LogoIcon>
                </div>
                <span class="text-lg font-semibold select-none">Tools-tool</span>
            </div>

            <!-- 导航栏 -->
            <nav class="flex flex-col gap-1.5">
                <div class="flex items-center gap-3 font-medium text-gray-500 w-full px-4 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" >
                    <div class="bg-[#4fd1c5] w-8 h-8 flex items-center justify-center rounded-lg" >
                        <HomeIcon class="w-5 h-5"></HomeIcon>
                    </div>
                    <span class="select-none">主页</span>
                </div>
                <div class="flex items-center gap-3 font-medium text-gray-500 w-full px-4 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" >
                    <div class="bg-[#4fd1c5] w-8 h-8 flex items-center justify-center rounded-lg" >
                        <ToolIcon class="w-5 h-5"></ToolIcon>
                    </div>
                    <span class="select-none" >工具</span>
                </div>
                <div class="flex items-center gap-3 font-medium text-gray-500 w-full px-4 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" >
                    <div class="bg-[#4fd1c5] w-8 h-8 flex items-center justify-center rounded-lg" >
                        <SettingIcon class="w-5 h-5"></SettingIcon>
                    </div>
                    <span class="select-none" >设置</span>
                </div>
            </nav>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<style scoped></style>