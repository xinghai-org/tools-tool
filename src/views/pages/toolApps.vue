<script setup>
    import App from "@/components/App.vue"
</script>

<template>
    <div class="px-20 py-6 flex flex-col gap-10 v-full overflow-y-scroll" >
        <div class="w-full bg-white rounded-xl py-3 px-4 gap-6 flex items-center justify-between min-w-175" >
            <App title="筛选文件" icon="📄" urlName="filterfile"></App>
            <App></App>
            <App></App>
            <App></App>
            <App></App>
        </div>
        <div class="w-full bg-white rounded-xl py-3 px-4 gap-6 flex items-center justify-between min-w-175" >
            <App></App>
            <App></App>
            <App></App>
            <App></App>
            <App></App>
        </div>
        <div class="w-full bg-white rounded-xl py-3 px-4 gap-6 flex items-center justify-between min-w-175" >
            <App></App>
            <App></App>
            <App></App>
            <App></App>
            <App></App>
        </div>
    </div>
</template>