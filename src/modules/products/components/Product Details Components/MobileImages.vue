<template>
  <div className="flex flex-col w-full gap-2 lg:hidden">
    <div
      :style="{ backgroundImage: `url(${images[state.index]})` }"
      class="flex w-screen -ml-4 md:-ml-0 relative min-h-[50vh] bg-center bg-no-repeat bg-cover"
    />
    <div class="flex gap-2 w-screen -ml-4 md:-ml-0 overflow-x-scroll">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        :style="{ backgroundImage: `url(${img})` }"
        @click="state.index = idx"
        class="flex w-40 h-40 bg-center bg-no-repeat bg-cover rounded-md cursor-pointer flex-shrink-0"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps(["images"]);
const state = reactive({
  index: 0,
});
</script>
