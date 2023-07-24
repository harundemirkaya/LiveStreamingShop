<template>
  <div class="flex flex-col w-full">
    <p class="leading-[1.75] text-[16px] text-primary font-medium tracking-wide">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps(['description'])
</script>
