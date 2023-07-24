<template>
  <div class="flex flex-row w-full relative">
    <div v-if="isSideFiltersOpen">
      <side-filters :selectedId="selectedId" />
    </div>

    <div
        class="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-x-3 lg:gap-x-6 gap-y-6 w-full transition-width duration-150
        ease-in-out delay-75">
      <spinner-v2  :load="loading"/>
      <p v-if="errMsg" class="text-2xl font-medium text-info tracking-wider leading-relaxed w-full">{{errMsg}}</p>
      <div v-for="item in products" v-if="!loading && !errMsg" :key="item.id" class="flex">
        <product-card :product="item"/>
      </div>
    </div>
  </div>
</template>

<script setup>
const  SideFilters = defineAsyncComponent({
  loader:() => import("@/modules/categories/components/filters/SideFilters.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import {defineAsyncComponent, onMounted, reactive, watch} from "vue";
import {useFilters} from "@/store/filters.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import {useSort} from "@/store/sort.js";
import ProductCard from "@/shared/components/Cards/ProductCard.vue";
import {useResults} from "@/modules/categories/composables/useResults.js";

const props = defineProps(['isSideFiltersOpen', 'selectedId'])
const filterStore = useFilters()
const sortStore = useSort()

const emits = defineEmits(['results'])

const {loading, products, errMsg, populate, numberOfProducts} = useResults()


onMounted( async() => {
   await populate()
  emits('results', numberOfProducts)
})

watch([filterStore, sortStore],  async() => {
  await populate()
  emits('results', numberOfProducts)
})




</script>

