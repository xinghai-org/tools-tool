<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps({
  icon: { type: String, default: '🔧' },
  title: { type: String, default: '工具' },
  urlName: { type: String, default: 'home' },
  active: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-2.5 w-28 h-28 rounded-xl cursor-pointer select-none transition-all border"
    :class="
      active
        ? 'bg-primary-10 border-[#4fd1c5] shadow-sm'
        : 'bg-white border-gray-100 hover:shadow-md hover:-translate-y-0.5 hover:border-[#4fd1c5]'
    "
    @click="$emit('click')"
    @dblclick="router.push({ name: urlName })"
  >
    <div
      class="w-10 h-10 flex items-center justify-center rounded-xl text-xl"
      :class="active ? 'bg-[#4fd1c5]' : 'bg-[#f0f2f5]'"
    >
      {{ icon }}
    </div>
    <span class="text-xs font-medium" :class="active ? 'text-teal-600' : 'text-gray-600'">
      {{ title }}
    </span>
  </div>
</template>
