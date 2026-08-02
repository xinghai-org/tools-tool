<script setup></script>

<template>
  <div class="px-20 py-6 flex flex-col gap-10 v-full overflow-y-scroll w-full">
    <slot name="content">
      <div class="bg-amber-200 flex w-full -h-full">默认内容</div>
    </slot>
  </div>
</template>
