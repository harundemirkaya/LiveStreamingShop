<template>
  <div
    @click="handleShopClick"
    class="flex w-full rounded-lg hover:shadow-2xl h-40 xl:h-60 bg relative bg-center bg-cover bg-no-repeat cursor-pointer flex-shrink-0">
    <div
      class="flex justify-between items-center absolute inset-x-0 bottom-0 bg-secondary/80 text-white px-1 xl:px-3 py-2 rounded-b-lg truncate">
      <div class="flex truncate w-full">
        <p class="text-xs xl:text-xl font-semibold text-ellipsis">
          Beats Audio
        </p>
      </div>

      <div class="flex flex-col w-full gap-2 items-center">
        <p class="text-xs xl:text-xl">Follow +</p>
        <button
          class="bg-info px-3 xl:px-4 tracking-wide py-1 rounded-[44px] text-xs xl:text-base xl:font-medium hover:bg-white hover:text-info transition ease-in-out delay-75 duration-100">
          Shop Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleShopClick = () => router.push('/myshop');
</script>

<style scoped>
.bg {
  background-image: url('https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=700&q=60');
}
</style>
