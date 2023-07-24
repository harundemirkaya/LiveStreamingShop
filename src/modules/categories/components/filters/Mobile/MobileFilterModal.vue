<template>
  <div class="fixed inset-0 z-50 overflow-auto bg-white flex flex-col w-screen">
    <div class="flex flex-col relative bg-white  mx-auto rounded-md overflow-x-clip
		w-full little:px-3 xs:px-[25px] px-[25px] pt-6 pb-6 mt-4 z-50 gap-y-8 pb-32">
      <!--x icon-->
      <svg
          @click="emit('close')"
          class="w-6 h-6 text-black fixed right-4 top-5 text-3xl" fill="currentColor" viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"></path>
      </svg>
      <p class="base">Filter</p>
      <mobile-sorters />
      <hr />
      <shop-by-price />
      <hr />
      <FilterActions @close="emit('close')"/>
    </div>
  </div>
</template>

<script setup>
const MobileSorters = () => import("@/modules/categories/components/filters/Mobile/MobileSorters.vue")
const ShopByPrice = () => import("@/modules/categories/components/filters/ShopByPrice.vue")
const FilterActions  = () => import("@/modules/categories/components/filters/FilterActions.vue")


const emit = defineEmits(['close'])
</script>

