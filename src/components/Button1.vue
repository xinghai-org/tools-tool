<script setup>
import { reactive } from 'vue'

// 传入参数
const props = defineProps({
  w: {
    default: 20,
  },
  h: {
    default: 9,
  },
  status: {
    default: 'default',
  },
  active: {
    default: true,
  },
})

// 点击事件
const emit = defineEmits(['click'])

// 颜色组
// const colorMap = reactive({
//   default: ['ring-primary-40', 'bg-primary-10/60', props.active? 'hover:bg-primary-10':'hover:text-red-300 hover:ring-red-300 hover:bg-red-50'],
//   err: ['ring-red-300', 'bg-red-50/50', 'hover:bg-red-50'],
// })

const colorMap = reactive({
  default: {
    default: ['ring-primary-40', 'bg-primary-10/60'],
    active: ['hover:bg-primary-10'],
    inactive: ['hover:text-red-300', ' hover:ring-red-300 ', 'hover:bg-red-50'],
  },
  err: {
    default: ['ring-red-300', 'bg-red-50/50', 'hover:bg-red-50'],
    active: [],
    inactive: [],
  },
})
</script>

<template>
  <button
    @click="
      () => {
        if (props.active) {
          emit('click')
        }
      }
    "
    :class="[
      `w-${w}`,
      `h-${h}`,
      ...colorMap[status]['default'],
      ...colorMap[status][active ? 'active' : 'inactive'],
    ]"
    class="text-primary ring w-20 h-9 rounded transition-all shadow-md active:shadow-none"
  >
    <slot>按钮</slot>
  </button>
</template>
