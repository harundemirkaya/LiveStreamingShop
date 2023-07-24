<template>

  <div class="flex max-w-sm w-full  gap-5 relative bg-slate-100 rounded-lg">
    <div
        :style="{backgroundImage: `url(${product.images[0] || '/imgs/profile.svg'})`}"
        class="flex w-[400px] h-24 bg-center bg-contain bg-no-repeat bg-slate-100 rounded-lg border-[1px]">

    </div>


    <div class="flex flex-col gap-2 w-full">
      <p class="base font-medium">{{ product.name }}</p>
      <div class="w-full flex items-center gap-2">
        <div v-for="item in product.variations" :key="item" class="badge badge-md">{{ item }}</div>
      </div>
    </div>

    <div class="w-full flex flex-col gap-2 self-center">
      <p class="text-center base font-bold">${{ product.price }}</p>
    </div>

  </div>
</template>

<script setup>
const props = defineProps(["product"])
</script>
