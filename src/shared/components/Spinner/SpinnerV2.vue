<template>
  <div
      :class="[load  ? 'flex justify-center items-center': 'hidden']"
      class="p-6"
  >
    <div class="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-primary"/>
  </div>
</template>

<script setup>
const props = defineProps({
  load: {
    type: Boolean,
    default: true
  }
})
</script>