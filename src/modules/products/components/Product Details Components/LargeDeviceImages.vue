<template>
  <div
    class="hidden lg:flex flex-col gap-2 w-full border-2 min-h-screen items-center justify-center relative
    pr-28"
  >
    <div
      :style="{
        backgroundImage: `url(${images[state?.index] ||  image})`,
      }"
      class="flex w-full h-full bg-center bg-contain bg-no-repeat "
    />
    <div
      class="flex flex-col justify-evenly absolute top-5 right-2  gap-8 items-center "
    >
        <div
          v-for="(img, idx) in images"
          :key="idx"
          :style="{ backgroundImage: `url(${img})` }"
          @click="state.index = idx"
          :class="[
            idx === state.index
              ? 'border-2 border-primary w-[65px] h-[65px]'
              : 'border-0 w-20 h-20',
          ]"
          class="rounded-md bg-cover bg-center cursor-pointer bg-no-repeat"
        />
      </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import image from "@/shared/assets/images/product.jpeg";


const state = reactive({
  index: 0,
});
const props = defineProps(["images"]);
</script>

<style scoped>
.bg {
  background-image: url("../../../../shared/assets/images/product.jpeg");
}
</style>