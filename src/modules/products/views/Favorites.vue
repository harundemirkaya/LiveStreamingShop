<template>
  <div class="content-container flex flex-col py-16 min-h-screen  gap-4">
    <p class="h3 font-semibold">Favorites</p>
    <spinner-v2 :load="loading"/>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <product-card v-for="item in favorites" :key="item?._id" :product="item"/>
    </div>
    <p v-if="favorites?.length < 1 && !loading" class="text-info text-xl font-semibold">No items added to
      favorites</p>
  </div>
</template>

<script setup>
import {useFavorites} from "@/modules/products/composables/useFavorites.js";
import {defineAsyncComponent, onMounted} from "vue";
const  ProductCard = defineAsyncComponent({
  loader:() => import("@/shared/components/Cards/ProductCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const {getFavorites, favorites, loading} = useFavorites()

onMounted(() => {
  getFavorites()
})

</script>
