<script setup>
import APPTemplate from "@/components/APPTemplate.vue"
import SelectFile from "@/components/SelectFile.vue";
</script>

<template>
    <APPTemplate>
        <template #content >
            <div class="bg-white rounded-lg min-w-175" >
                <SelectFile Pathtype="File" class="w-30" ></SelectFile>
                <SelectFile Pathtype="Folder" class="w-30" ></SelectFile>
            </div>
        </template>
    </APPTemplate>
</template>